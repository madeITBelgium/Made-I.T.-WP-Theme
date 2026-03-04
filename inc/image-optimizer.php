<?php

if (!defined('WP_CLI') || !WP_CLI) {
    return;
}

class Madeit_Image_Optimizer_Command
{
    /**
     * Loop all uploaded images and optimize them if needed.
     *
     * ## OPTIONS
     *
     * [--max-width=<int>]
     * : Maximum width in pixels. Default: 1920
     *
     * [--max-height=<int>]
     * : Maximum height in pixels. Default: 1920
     *
     * [--quality=<int>]
     * : Output quality (1-100). Default: 82
     *
     * [--backup-suffix=<string>]
     * : Suffix for the backup copy. Default: .orig
     *
     * [--dry-run]
     * : Only report changes, do not write files.
     *
     * [--limit=<int>]
     * : Limit number of images processed.
     *
     * [--offset=<int>]
     * : Offset for pagination.
     *
     * [--show-errors]
     * : Print details for errors after the run.
     *
     * [--use-cli]
     * : Use ImageMagick CLI (convert/identify) instead of WP image editor.
     *
     * [--regenerate-sizes]
     * : Regenerate WordPress image sizes after optimizing.
     *
     * ## EXAMPLES
     *
     *     wp madeit optimize-images --max-width=2048 --max-height=2048 --quality=80
     *     wp madeit optimize-images --dry-run --limit=50
     *
     * @subcommand optimize-images
     *
     * @when after_wp_load
     */
    public function optimize_images($args, $assoc_args)
    {
        $max_width = isset($assoc_args['max-width']) ? (int) $assoc_args['max-width'] : 1920;
        $max_height = isset($assoc_args['max-height']) ? (int) $assoc_args['max-height'] : 1920;
        $quality = isset($assoc_args['quality']) ? (int) $assoc_args['quality'] : 82;
        $backup_suffix = isset($assoc_args['backup-suffix']) ? (string) $assoc_args['backup-suffix'] : '.orig';
        $dry_run = isset($assoc_args['dry-run']);
        $limit = isset($assoc_args['limit']) ? (int) $assoc_args['limit'] : 0;
        $offset = isset($assoc_args['offset']) ? (int) $assoc_args['offset'] : 0;
        $show_errors = isset($assoc_args['show-errors']);
        $use_cli = array_key_exists('use-cli', $assoc_args) ? (bool) $assoc_args['use-cli'] : true;
        $regenerate_sizes = array_key_exists('regenerate-sizes', $assoc_args) ? (bool) $assoc_args['regenerate-sizes'] : true;

        if ($max_width <= 0 || $max_height <= 0) {
            WP_CLI::error('max-width and max-height must be positive integers.');
        }
        if ($quality < 1 || $quality > 100) {
            WP_CLI::error('quality must be between 1 and 100.');
        }

        $query_args = [
            'post_type'      => 'attachment',
            'post_status'    => 'inherit',
            'posts_per_page' => $limit > 0 ? $limit : -1,
            'offset'         => $offset,
            'fields'         => 'ids',
            'meta_query'     => [
                [
                    'key'     => '_wp_attachment_metadata',
                    'compare' => 'EXISTS',
                ],
            ],
        ];

        $attachments = get_posts($query_args);
        if (empty($attachments)) {
            WP_CLI::success('No images found to process.');

            return;
        }

        $progress = \WP_CLI\Utils\make_progress_bar('Optimizing images', count($attachments));
        $stats = [
            'processed' => 0,
            'skipped'   => 0,
            'optimized' => 0,
            'errors'    => 0,
        ];
        $error_log = [];

        if ($use_cli && !$this->cli_tools_available()) {
            WP_CLI::error('ImageMagick CLI tools not available. Expected: convert and identify.');
        }

        foreach ($attachments as $attachment_id) {
            $stats['processed']++;
            $file = get_attached_file($attachment_id);
            if (!$file || !file_exists($file)) {
                $stats['errors']++;
                $error_log[] = $this->format_error($attachment_id, $file, 'File missing');
                $progress->tick();
                continue;
            }

            $mime = get_post_mime_type($attachment_id);
            if (!$this->is_supported_mime($mime)) {
                $stats['skipped']++;
                $progress->tick();
                continue;
            }

            $needs_optimize = $this->needs_optimization($file, $max_width, $max_height);
            if (!$needs_optimize) {
                $stats['skipped']++;
                $progress->tick();
                continue;
            }

            $backup_path = $file.$backup_suffix;
            if (!$dry_run && !file_exists($backup_path)) {
                if (!copy($file, $backup_path)) {
                    $stats['errors']++;
                    $error_log[] = $this->format_error($attachment_id, $file, 'Backup copy failed');
                    $progress->tick();
                    continue;
                }
            }

            if ($dry_run) {
                $stats['optimized']++;
                $progress->tick();
                continue;
            }

            if ($use_cli) {
                $cli_error = '';
                if (!$this->optimize_with_cli($file, $max_width, $max_height, $quality, $mime, $cli_error)) {
                    $stats['errors']++;
                    $error_log[] = $this->format_error($attachment_id, $file, $cli_error);
                    $progress->tick();
                    continue;
                }
            } else {
                $editor = wp_get_image_editor($file);
                if (is_wp_error($editor)) {
                    $stats['errors']++;
                    $error_log[] = $this->format_error($attachment_id, $file, $editor->get_error_message());
                    $progress->tick();
                    continue;
                }

                $editor->set_quality($quality);
                $resize_result = $editor->resize($max_width, $max_height, false);
                if (is_wp_error($resize_result)) {
                    $stats['errors']++;
                    $error_log[] = $this->format_error($attachment_id, $file, $resize_result->get_error_message());
                    $progress->tick();
                    continue;
                }

                $save_result = $editor->save($file);
                if (is_wp_error($save_result)) {
                    $stats['errors']++;
                    $error_log[] = $this->format_error($attachment_id, $file, $save_result->get_error_message());
                    $progress->tick();
                    continue;
                }
            }

            // Refresh attachment metadata so WP knows about the new dimensions.
            if ($regenerate_sizes) {
                $metadata = wp_generate_attachment_metadata($attachment_id, $file);
                if (is_wp_error($metadata)) {
                    $error_log[] = $this->format_error($attachment_id, $file, $metadata->get_error_message());
                } elseif (!empty($metadata)) {
                    wp_update_attachment_metadata($attachment_id, $metadata);
                }
            }

            $stats['optimized']++;
            $progress->tick();
        }

        $progress->finish();

        WP_CLI::success(sprintf(
            'Done. Processed: %d, Optimized: %d, Skipped: %d, Errors: %d',
            $stats['processed'],
            $stats['optimized'],
            $stats['skipped'],
            $stats['errors']
        ));

        if ($show_errors && !empty($error_log)) {
            WP_CLI::log('Error details:');
            foreach ($error_log as $line) {
                WP_CLI::log(' - '.$line);
            }
        }
    }

    private function format_error($attachment_id, $file, $message)
    {
        $file_label = $file ? $file : 'unknown file';

        return sprintf('#%d %s: %s', (int) $attachment_id, $file_label, $message);
    }

    private function is_supported_mime($mime)
    {
        $allowed = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/avif',
        ];

        return in_array($mime, $allowed, true);
    }

    private function cli_tools_available()
    {
        if (!function_exists('shell_exec')) {
            return false;
        }

        $convert = trim((string) shell_exec('command -v convert'));
        $identify = trim((string) shell_exec('command -v identify'));

        return $convert !== '' && $identify !== '';
    }

    private function optimize_with_cli($file, $max_width, $max_height, $quality, $mime, &$error)
    {
        if (!$this->cli_tools_available()) {
            $error = 'ImageMagick CLI tools not available';

            return false;
        }

        $tmp_file = $file.'.tmp-'.uniqid('', true);
        $resize = $max_width.'x'.$max_height.'>';
        $input = escapeshellarg($file);
        $output = escapeshellarg($tmp_file);
        $resize_arg = escapeshellarg($resize);
        $quality_arg = (int) $quality;

        $cmd = sprintf(
            'convert %s -strip -resize %s -quality %d %s',
            $input,
            $resize_arg,
            $quality_arg,
            $output
        );

        $cmd_output = [];
        $exit_code = 0;
        exec($cmd.' 2>&1', $cmd_output, $exit_code);
        if ($exit_code !== 0 || !file_exists($tmp_file)) {
            $error = 'ImageMagick convert failed: '.implode(' ', $cmd_output);
            if (file_exists($tmp_file)) {
                @unlink($tmp_file);
            }

            return false;
        }

        if (!rename($tmp_file, $file)) {
            $error = 'Unable to replace original file after CLI optimize';
            @unlink($tmp_file);

            return false;
        }

        return true;
    }

    private function needs_optimization($file, $max_width, $max_height)
    {
        $size = @getimagesize($file);
        if (empty($size) || empty($size[0]) || empty($size[1])) {
            return false;
        }

        return $size[0] > $max_width || $size[1] > $max_height;
    }
}

WP_CLI::add_command('madeit', 'Madeit_Image_Optimizer_Command');

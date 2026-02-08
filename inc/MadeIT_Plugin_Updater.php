<?php

class MadeIT_Plugin_Updater
{
    private string $endpoint;
    private string $level;
    private int $cacheTtl;

    public function __construct(string $endpoint, string $level = 'stable', int $cacheTtl = 21600)
    {
        $this->endpoint = rtrim($endpoint, '/');
        $this->level = $this->sanitizeLevel($level);
        $this->cacheTtl = max(300, (int) $cacheTtl);

        add_filter('pre_set_site_transient_update_plugins', [$this, 'setTransient']);
        add_filter('plugins_api', [$this, 'setPluginInfo'], 10, 3);
        add_filter('upgrader_source_selection', [$this, 'pluginUpgraderSourceSelection'], 10, 4);
    }

    private function sanitizeLevel($level): string
    {
        if (!is_string($level)) {
            return 'stable';
        }

        $level = strtolower(trim($level));
        if ($level === '') {
            return 'stable';
        }

        $level = preg_replace('/[^a-z0-9._-]+/', '', $level);

        return $level !== '' ? $level : 'stable';
    }

    private function cacheKey(): string
    {
        return 'madeit_plugin_updates_' . md5(home_url('/') . '|' . $this->endpoint . '|' . $this->level);
    }

    private function getInstalledPlugins(): array
    {
        if (!function_exists('get_plugins')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $plugins = get_plugins();
        $list = [];

        foreach ($plugins as $pluginFile => $data) {
            $list[] = [
                'plugin'  => (string) $pluginFile, // e.g. woocommerce/woocommerce.php
                'slug'    => (string) dirname($pluginFile),
                'version' => isset($data['Version']) ? (string) $data['Version'] : '',
                'name'    => isset($data['Name']) ? (string) $data['Name'] : '',
            ];
        }

        return $list;
    }

    private function fetchUpdates(): array
    {
        $cached = get_site_transient($this->cacheKey());
        if (is_array($cached)) {
            return $cached;
        }

        $payload = [
            'website' => home_url('/'),
            'level'   => $this->level,
            'plugins' => $this->getInstalledPlugins(),
        ];

        $response = wp_remote_post(
            $this->endpoint,
            [
                'timeout' => 15,
                'headers' => [
                    'Content-Type' => 'application/json; charset=utf-8',
                    'Accept'       => 'application/json',
                ],
                'body'    => wp_json_encode($payload),
            ]
        );

        if (is_wp_error($response)) {
            return [];
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);

        if ($code < 200 || $code >= 300 || !$body) {
            return [];
        }

        $decoded = json_decode($body, true);
        if (!is_array($decoded)) {
            return [];
        }

        // Accept either: { plugins: [...] } or directly [...]
        $result = $decoded;
        if (isset($decoded['plugins']) && is_array($decoded['plugins'])) {
            $result = $decoded['plugins'];
        }

        if (!is_array($result)) {
            return [];
        }

        // Cache normalized array
        set_site_transient($this->cacheKey(), $result, $this->cacheTtl);

        return $result;
    }

    private function indexUpdatesByPluginFile(array $updates): array
    {
        $indexed = [];

        foreach ($updates as $item) {
            if (!is_array($item)) {
                continue;
            }

            $pluginFile = $item['plugin'] ?? $item['plugin_file'] ?? null;
            if (!is_string($pluginFile) || $pluginFile === '') {
                continue;
            }

            $indexed[$pluginFile] = $item;
        }

        return $indexed;
    }

    public function setTransient($transient)
    {
        if (empty($transient->checked) || !is_array($transient->checked)) {
            return $transient;
        }

        $updates = $this->fetchUpdates();
        if (empty($updates)) {
            return $transient;
        }

        $indexed = $this->indexUpdatesByPluginFile($updates);

        foreach ($indexed as $pluginFile => $item) {
            $newVersion = $item['new_version'] ?? $item['version'] ?? null;
            $packageUrl = $item['package'] ?? $item['download_url'] ?? null;

            if (!is_string($newVersion) || $newVersion === '') {
                continue;
            }

            $installedVersion = $transient->checked[$pluginFile] ?? null;
            if (!is_string($installedVersion) || $installedVersion === '') {
                // If WP doesn't know this plugin, skip
                continue;
            }

            if (version_compare($newVersion, $installedVersion, '<=')) {
                continue;
            }

            if (!is_string($packageUrl) || $packageUrl === '') {
                continue;
            }

            $obj = new stdClass();
            $obj->slug = is_string($item['slug'] ?? null) ? $item['slug'] : dirname($pluginFile);
            $obj->plugin = $pluginFile;
            $obj->new_version = $newVersion;
            $obj->url = is_string($item['url'] ?? null) ? $item['url'] : '';
            $obj->package = $packageUrl;

            if (isset($item['tested']) && is_string($item['tested'])) {
                $obj->tested = $item['tested'];
            }
            if (isset($item['requires']) && is_string($item['requires'])) {
                $obj->requires = $item['requires'];
            }

            $transient->response[$pluginFile] = $obj;
        }

        return $transient;
    }

    public function setPluginInfo($false, $action, $args)
    {
        if ($action !== 'plugin_information') {
            return $false;
        }

        if (!is_object($args) || empty($args->slug) || !is_string($args->slug)) {
            return $false;
        }

        $updates = $this->fetchUpdates();
        if (empty($updates)) {
            return $false;
        }

        // Try to find by slug (dirname) or by explicit slug
        $match = null;
        foreach ($updates as $item) {
            if (!is_array($item)) {
                continue;
            }

            $slug = $item['slug'] ?? null;
            if (!is_string($slug) || $slug === '') {
                $pluginFile = $item['plugin'] ?? $item['plugin_file'] ?? null;
                if (is_string($pluginFile) && $pluginFile !== '') {
                    $slug = dirname($pluginFile);
                }
            }

            if ($slug === $args->slug) {
                $match = $item;
                break;
            }
        }

        if (!$match) {
            return $false;
        }

        $info = new stdClass();
        $info->name = is_string($match['name'] ?? null) ? $match['name'] : $args->slug;
        $info->slug = $args->slug;
        $info->version = is_string($match['new_version'] ?? null) ? $match['new_version'] : (is_string($match['version'] ?? null) ? $match['version'] : '');
        $info->author = is_string($match['author'] ?? null) ? $match['author'] : '';
        $info->homepage = is_string($match['homepage'] ?? null) ? $match['homepage'] : (is_string($match['url'] ?? null) ? $match['url'] : '');
        $info->download_link = is_string($match['package'] ?? null) ? $match['package'] : (is_string($match['download_url'] ?? null) ? $match['download_url'] : '');

        $sections = [];
        if (isset($match['sections']) && is_array($match['sections'])) {
            $sections = $match['sections'];
        } else {
            if (isset($match['description']) && is_string($match['description'])) {
                $sections['description'] = $match['description'];
            }
            if (isset($match['changelog']) && is_string($match['changelog'])) {
                $sections['changelog'] = $match['changelog'];
            }
        }

        if (!empty($sections)) {
            $info->sections = $sections;
        }

        if (isset($match['tested']) && is_string($match['tested'])) {
            $info->tested = $match['tested'];
        }
        if (isset($match['requires']) && is_string($match['requires'])) {
            $info->requires = $match['requires'];
        }

        return $info;
    }

    public function pluginUpgraderSourceSelection($source, $remote_source, $upgrader, $hook_extra = null)
    {
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

        if (!($upgrader instanceof \Plugin_Upgrader)) {
            return $source;
        }

        if (!is_array($hook_extra) || empty($hook_extra['plugin']) || !is_string($hook_extra['plugin'])) {
            return $source;
        }

        global $wp_filesystem;
        if (!$wp_filesystem) {
            return $source;
        }

        $pluginFile = $hook_extra['plugin'];
        $targetDir = dirname($pluginFile);

        if ($targetDir === '.' || $targetDir === '') {
            // Plugin in root of plugins directory (rare) – do nothing.
            return $source;
        }

        $sourceBase = basename($source);
        if ($sourceBase === $targetDir) {
            return $source;
        }

        $correctedSource = str_replace($sourceBase, $targetDir, $source);

        // Attempt rename to match expected plugin folder.
        if ($wp_filesystem->move($source, $correctedSource, true)) {
            return $correctedSource;
        }

        return $source;
    }
}

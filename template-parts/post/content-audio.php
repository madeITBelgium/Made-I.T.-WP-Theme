<?php
/**
 * Template part for displaying audio posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @since 1.0
 *
 * @version 1.0
 */
$content = apply_filters('the_content', get_the_content());
$audio = false;

// Only get audio from the content if a playlist isn't present.
if (false === strpos($content, 'wp-playlist-script')) {
    $audio = get_media_embedded_in_content($content, ['audio']);
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(' blog-post'); ?>>
    <?php
        if (is_sticky() && is_home()) {
            echo madeit_get_svg(['icon' => 'thumb-tack']);
        }
    ?>
    <header>
        <?php
        if (is_single()) {
            the_title('<h1 class="entry-title">', '</h1>');
        } elseif (is_front_page() && is_home()) {
            the_title('<h3 class="entry-title"><a href="'.esc_url(get_permalink()).'" rel="bookmark">', '</a></h3>');
        } else {
            the_title('<h2 class="entry-title"><a href="'.esc_url(get_permalink()).'" rel="bookmark">', '</a></h2>');
        }
        if ('post' === get_post_type()) {
            echo '<div class="entry-meta">';
            if (is_single()) {
                madeit_posted_on();
            } else {
                echo madeit_time_link();
                madeit_edit_link();
            }
            echo '</div><!-- .entry-meta -->';
        }
        if ('' !== get_the_post_thumbnail()) {
            ?>
            <div class="post-thumbnail">
                <a href="<?php the_permalink(); ?>">
                    <?php the_post_thumbnail('madeit-featured-blog-image'); ?>
                </a>
            </div>
            <?php
        } ?>
    </header>
    <div class="content">
        <?php
        if (!is_single()) {

            // If not a single post, highlight the audio file.
            if (!empty($audio)) {
                foreach ($audio as $audio_html) {
                    echo '<div class="entry-audio">';
                    echo $audio_html;
                    echo '</div><!-- .entry-audio -->';
                }
            }
        }

        if (is_single() || empty($audio)) {
            /* translators: %s: Name of current post */
            the_content();
        }
        ?>
    </div>
    <?php
    if (is_single()) {
        madeit_entry_footer();
    }
    ?>
</article>

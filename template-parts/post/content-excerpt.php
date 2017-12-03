<?php
/**
 * Template part for displaying posts with excerpts.
 *
 * Used in Search Results and for Recent Posts in Front Page panels.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @since 1.0
 *
 * @version 1.0
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <header class="entry-header">
        <?php if (is_front_page() && !is_home()) {
    // The excerpt is being displayed within a front page section, so it's a lower hierarchy than h2.
    the_title(sprintf('<h3 class="entry-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h3>');
} else {
    the_title(sprintf('<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h2>');
} ?>
        <?php if ('post' === get_post_type()) : ?>
            <div class="entry-meta">
                <?php
                echo madeit_time_link();
                madeit_edit_link();
                ?>
            </div>
        <?php elseif ('page' === get_post_type() && get_edit_post_link()) : ?>
            <div class="entry-meta">
                <?php madeit_edit_link(); ?>
            </div>
        <?php endif; ?>
    </header>

    <div class="entry-summary">
        <?php the_excerpt(); ?>
    </div>
</article>

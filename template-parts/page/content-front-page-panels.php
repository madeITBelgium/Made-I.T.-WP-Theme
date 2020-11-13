<?php
/**
 * Template part for displaying pages on front page.
 *
 * @since 1.0
 *
 * @version 1.0
 */
global $madeitcounter;

$onlyOneColumn = false;
if (function_exists('is_cart')) {
    $onlyOneColumn = (is_cart() || is_checkout() || is_account_page());
}
?>
<article id="panel<?php echo $madeitcounter; ?>" <?php post_class('madeit-panel '); ?> >
    <?php if (has_post_thumbnail()) {
    $thumbnail = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'madeit-featured-image');

    // Calculate aspect ratio: h / w * 100%.
    $ratio = $thumbnail[2] / $thumbnail[1] * 100; ?>

        <div class="panel-image" style="background-image: url(<?php echo esc_url($thumbnail[0]); ?>);">
            <div class="panel-image-prop" style="padding-top: <?php echo esc_attr($ratio); ?>%"></div>
        </div><!-- .panel-image -->

    <?php
} ?>

    <div class="<?php echo get_theme_mod('container_type'); ?> changable-container">
        <div class="row voffset8 vbottom8">
            <div class="col-sm">
                <header class="entry-header">
                    <?php the_title('<h2 class="entry-title">', '</h2>'); ?>
                </header><!-- .entry-header -->
            </div>
            <div class="col-sm two-column-row <?php if ((is_page() || is_archive()) && 'one-column' === get_theme_mod('page_layout') || $onlyOneColumn) {
        echo 'row';
    } ?>">
                <div class="entry-content">
                    <?php
                        /* translators: %s: Name of current post */
                        the_content(sprintf(
                            __('Continue reading <span class="screen-reader-text">"%s"</span>', 'madeit'),
                            get_the_title()
                        ));
                    ?>
                </div><!-- .entry-content -->

                <?php
                // Show recent blog posts if is blog posts page (Note that get_option returns a string, so we're casting the result as an int).
                if (get_the_ID() === (int) get_option('page_for_posts')) { ?>

                    <?php // Show four most recent posts.
                    $recent_posts = new WP_Query([
                        'posts_per_page'      => 3,
                        'post_status'         => 'publish',
                        'ignore_sticky_posts' => true,
                        'no_found_rows'       => true,
                    ]);
                    ?>

                    <?php if ($recent_posts->have_posts()) { ?>

                        <div class="recent-posts">

                            <?php
                            while ($recent_posts->have_posts()) {
                                $recent_posts->the_post();
                                get_template_part('template-parts/post/content', 'excerpt');
                            }
                            wp_reset_postdata();
                            ?>
                        </div><!-- .recent-posts -->
                    <?php } ?>
                <?php } ?>
            </div>

        </div><!-- .wrap -->
    </div><!-- .panel-content -->

</article><!-- #post-## -->

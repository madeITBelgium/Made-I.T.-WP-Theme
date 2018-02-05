<?php
/**
 * Template part for displaying page content in page.php.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @since 1.0
 *
 * @version 1.0
 */
?>

<article <?php post_class(''); ?> >
    <div class="row">
        <div class="col-sm">
            <header class="entry-header">
                <?php the_title('<h2 class="entry-title">', '</h2>'); ?>

                <?php madeit_edit_link(get_the_ID()); ?>

            </header><!-- .entry-header -->
        </div>
    </div>
    <div class="row">
        <div class="col-sm">
            <div class="entry-content">
                <?php
                    /* translators: %s: Name of current post */
                    the_content(sprintf(
                        __('Continue reading<span class="screen-reader-text"> "%s"</span>', 'madeit'),
                        get_the_title()
                    ));
                ?>
            </div><!-- .entry-content -->

            <?php
            // Show recent blog posts if is blog posts page (Note that get_option returns a string, so we're casting the result as an int).
            if (get_the_ID() === (int) get_option('page_for_posts')) : ?>

                <?php // Show four most recent posts.
                $recent_posts = new WP_Query([
                    'posts_per_page'      => 3,
                    'post_status'         => 'publish',
                    'ignore_sticky_posts' => true,
                    'no_found_rows'       => true,
                ]);
                ?>

                <?php if ($recent_posts->have_posts()) : ?>

                    <div class="recent-posts">

                        <?php
                        while ($recent_posts->have_posts()) : $recent_posts->the_post();
                            get_template_part('template-parts/post/content', 'excerpt');
                        endwhile;
                        wp_reset_postdata();
                        ?>
                    </div><!-- .recent-posts -->
                <?php endif; ?>
            <?php endif; ?>
        </div>
    </div>
</article><!-- #post-## -->
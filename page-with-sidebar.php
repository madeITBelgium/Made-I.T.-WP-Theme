<?php
/**
 * Template Name: Page with right sidebar
 * The template for displaying all pages with a sidebar.
 *
 * @version 1.0
 */
get_header(); ?>

<div class="container my-5">
	<div class="row">
        <div class="col-12 col-sm">
            <?php
            while (have_posts()) {
                the_post();
                if (false !== strpos($post->post_content, '<!-- wp:madeit/block-container') || false !== strpos($post->post_content, '<!-- wp:madeit/block-content')) {
                    get_template_part('template-parts/page/content', 'front-page-gutenberg');
                } elseif (false !== strpos($post->post_content, '<!-- wp:')) {
                    get_template_part('template-parts/page/content', 'front-page-gutenberg-container');
                } else {
                    ?>
                    <div class="container-fluid">
                        <div class="row">
                            <?php
                            get_template_part('template-parts/page/content-front-page', 'panels'); ?>
                        </div>
                    </div>
                    <?php
                }
                // If comments are open or we have at least one comment, load up the comment template.
                if (comments_open() || get_comments_number()) {
                    comments_template();
                }
            } // End of the loop.
            ?>
        </div>
        <?php get_sidebar(); ?>
    </div>
</div>

<?php get_footer();

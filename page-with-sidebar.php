<?php
/**
 * Template Name: Page with right sidebar
 * The template for displaying all pages with a sidebar.
 *
 * @version 1.0
 */
get_header(); ?>

<div class="container voffset8 vbottom8">
	<div class="row">
        <div class="col-sm">
            <?php
            while (have_posts()) : the_post();

                get_template_part('template-parts/page/content', 'page');

                // If comments are open or we have at least one comment, load up the comment template.
                if (comments_open() || get_comments_number()) :
                    comments_template();
                endif;

            endwhile; // End of the loop.
            ?>
        </div>
        <?php get_sidebar(); ?>
    </div>
</div>

<?php get_footer();

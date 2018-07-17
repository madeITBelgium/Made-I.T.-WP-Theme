<?php
/**
 * Template Name: Landingpage
 * The template for displaying all landingpages.
 *
 * @version 1.1
 */
get_header('landing'); ?>

<div class="container voffset8 vbottom8">
	<div class="row">
        <div class="col">
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
    </div>
</div>

<?php get_footer('landing');

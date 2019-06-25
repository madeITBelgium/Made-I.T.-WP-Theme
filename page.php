<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @since 1.0
 *
 * @version 1.0
 */
get_header();

while (have_posts()) : the_post();
    if(false !== strpos($post->post_content, '<!-- wp:madeit/block-container')) {
        get_template_part('template-parts/page/content', 'front-page-gutenberg');
    }
    else if (false !== strpos($post->post_content, '<!-- wp:')) {
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
    if (comments_open() || get_comments_number()) :
        comments_template();
    endif;

endwhile; // End of the loop.

get_footer();

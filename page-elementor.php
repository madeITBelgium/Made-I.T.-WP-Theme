<?php

/**
 * Template Name: Elementor
 * The template for displaying all pages with a sidebar.
 *
 * @version 1.0
 */
get_header();

while (have_posts()) {
    the_post();

    get_template_part('template-parts/page/content', 'elementor');

    // If comments are open or we have at least one comment, load up the comment template.
    if (comments_open() || get_comments_number()) {
        comments_template();
    }
} // End of the loop.

get_footer();

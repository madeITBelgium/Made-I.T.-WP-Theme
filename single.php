<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 * @since 1.0
 *
 * @version 1.0
 */
get_header(); ?>

<div class="container">
    <div class="row">
        <div class="col" id="primary" role="main">
            <?php
            /* Start the Loop */
            while (have_posts()) : the_post();

                get_template_part('template-parts/post/content', get_post_format());

                // If comments are open or we have at least one comment, load up the comment template.
                if (comments_open() || get_comments_number()) :
                    comments_template();
                endif;

                the_post_navigation([
                    'prev_text' => '<span class="screen-reader-text">'.__('Previous Post', 'madeit').'</span><span aria-hidden="true" class="nav-subtitle">'.__('Previous', 'madeit').'</span> <span class="nav-title"><span class="nav-title-icon-wrapper">'.madeit_get_svg(['icon' => 'arrow-left']).'</span>%title</span>',
                    'next_text' => '<span class="screen-reader-text">'.__('Next Post', 'madeit').'</span><span aria-hidden="true" class="nav-subtitle">'.__('Next', 'madeit').'</span> <span class="nav-title">%title<span class="nav-title-icon-wrapper">'.madeit_get_svg(['icon' => 'arrow-right']).'</span></span>',
                ]);

            endwhile;
            ?>
        </div>
        <?php get_sidebar(); ?>
    </div>
</div>

<?php get_footer();

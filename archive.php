<?php
/**
 * The template for displaying archive pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @since 1.0
 *
 * @version 1.0
 */
get_header(); ?>

<div class="container">

    <?php if (have_posts()) : ?>
        <header class="page-header">
            <?php
                the_archive_title('<h1 class="page-title">', '</h1>');
                the_archive_description('<div class="taxonomy-description">', '</div>');
            ?>
        </header><!-- .page-header -->
    <?php endif; ?>

    <div id="primary" class="row">
        <div id="main" class="col" role="main">

            <?php
            if (have_posts()) : ?>
                <?php
                while (have_posts()) : the_post();
                    get_template_part('template-parts/post/content', get_post_format());

                endwhile;

                the_posts_pagination([
                    'prev_text'          => madeit_get_svg(['icon' => 'arrow-left']).'<span class="screen-reader-text">'.__('Previous page', 'madeit').'</span>',
                    'next_text'          => '<span class="screen-reader-text">'.__('Next page', 'madeit').'</span>'.madeit_get_svg(['icon' => 'arrow-right']),
                    'before_page_number' => '<span class="meta-nav screen-reader-text">'.__('Page', 'madeit').' </span>',
                ]);

            else :

                get_template_part('template-parts/post/content', 'none');

            endif; ?>

        </div>
        <?php get_sidebar(); ?>
    </div>
</div>

<?php get_footer();

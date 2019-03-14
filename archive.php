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

                madeit_page_pagination();

            else :

                get_template_part('template-parts/post/content', 'none');

            endif; ?>

        </div>
        <?php get_sidebar(); ?>
    </div>
</div>

<?php get_footer();

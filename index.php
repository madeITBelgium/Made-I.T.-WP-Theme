<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @since 1.0
 *
 * @version 1.0
 */
get_header();

do_action('madeit_before_index_page');

$class = apply_filters('madeit_index_container_class', ['container', 'voffset6']);
?>

<div class="<?php echo is_array($class) ? implode(' ', $class) : $class; ?>">
    <div class="row">
        <div id="primary" class="col" id="main" role="main">
            <?php

            do_action('madeit_between_index_page');

            if (is_home() && !is_front_page()) { ?>
                <header class="page-header">
                    <h1 class="page-title"><?php single_post_title(); ?></h1>
                </header>
            <?php } else { ?>
                <header class="page-header">
                    <h2 class="page-title"><?php echo apply_filters('madeit_index_page_title', __('Posts', 'madeit')); ?></h2>
                </header>
            <?php } ?>
            
            <?php
            if (have_posts()) {
                $i = 0;
                /* Start the Loop */
                while (have_posts()) {
                    the_post();

                    /*
                     * Include the Post-Format-specific template for the content.
                     * If you want to override this in a child theme, then include a file
                     * called content-___.php (where ___ is the Post Format name) and that will be used instead.
                     */
                    get_template_part(apply_filters('madeit_index_post_template', 'template-parts/post/content'), get_post_format());
                    $i++;
                }

                madeit_page_pagination();
            } else {
                get_template_part('template-parts/post/content', 'none');
            }

            get_template_part('template-parts/post/below-index', 'widgets');
            ?>
        </div>
        <?php get_sidebar(); ?>
    </div>
</div>
<?php get_footer();

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
get_header(); ?>

<div class="container">
	<?php if (is_home() && !is_front_page()) : ?>
		<header class="page-header">
			<h1 class="page-title"><?php single_post_title(); ?></h1>
		</header>
	<?php else : ?>
		<header class="page-header">
			<h2 class="page-title"><?php _e('Posts', 'madeit'); ?></h2>
		</header>
	<?php endif; ?>

	<div class="row">
		<div id="primary" class="col" id="main" role="main">

			<?php
            if (have_posts()) :

                /* Start the Loop */
                while (have_posts()) : the_post();

                    /*
                     * Include the Post-Format-specific template for the content.
                     * If you want to override this in a child theme, then include a file
                     * called content-___.php (where ___ is the Post Format name) and that will be used instead.
                     */
                    get_template_part('template-parts/post/content', get_post_format());

                endwhile;

                the_posts_pagination([
                    'prev_text'          => madeit_get_svg(['icon' => 'arrow-left']).'<span class="screen-reader-text">'.__('Previous page', 'madeit').'</span>',
                    'next_text'          => '<span class="screen-reader-text">'.__('Next page', 'madeit').'</span>'.madeit_get_svg(['icon' => 'arrow-right']),
                    'before_page_number' => '<span class="meta-nav screen-reader-text">'.__('Page', 'madeit').' </span>',
                ]);

            else :

                get_template_part('template-parts/post/content', 'none');

            endif;
            ?>
		</div>
	</div>
	<?php get_sidebar(); ?>
</div>
<?php get_footer();

<?php
/**
 * Template part for displaying gallery posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @since 1.0
 *
 * @version 1.2
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php
    if (is_sticky() && is_home()) {
        echo madeit_get_svg(['icon' => 'thumb-tack']);
    }
    ?>
	<header class="entry-header">
		<?php
        if ('post' === get_post_type()) {
            echo '<div class="entry-meta">';
            if (is_single()) {
                madeit_posted_on();
            } else {
                echo madeit_time_link();
                madeit_edit_link();
            }
            echo '</div><!-- .entry-meta -->';
        }

        if (is_single()) {
            the_title('<h1 class="entry-title">', '</h1>');
        } elseif (is_front_page() && is_home()) {
            the_title('<h3 class="entry-title"><a href="'.esc_url(get_permalink()).'" rel="bookmark">', '</a></h3>');
        } else {
            the_title('<h2 class="entry-title"><a href="'.esc_url(get_permalink()).'" rel="bookmark">', '</a></h2>');
        }
        ?>
	</header><!-- .entry-header -->

	<?php if ('' !== get_the_post_thumbnail() && !is_single() && !get_post_gallery()) : ?>
		<div class="post-thumbnail">
			<a href="<?php the_permalink(); ?>">
				<?php the_post_thumbnail('madeit-featured-image'); ?>
			</a>
		</div><!-- .post-thumbnail -->
	<?php endif; ?>

	<div class="entry-content">

		<?php
        if (!is_single()) {

            // If not a single post, highlight the gallery.
            if (get_post_gallery()) {
                echo '<div class="entry-gallery">';
                echo get_post_gallery();
                echo '</div>';
            }
        }

        if (is_single() || !get_post_gallery()) {

            /* translators: %s: Name of current post */
            the_content(sprintf(
                __('Continue reading<span class="screen-reader-text"> "%s"</span>', 'madeit'),
                get_the_title()
            ));

            wp_link_pages([
                'before'      => '<div class="page-links">'.__('Pages:', 'madeit'),
                'after'       => '</div>',
                'link_before' => '<span class="page-number">',
                'link_after'  => '</span>',
            ]);
        }
        ?>

	</div><!-- .entry-content -->

	<?php
    if (is_single()) {
        madeit_entry_footer();
    }
    ?>

</article><!-- #post-## -->

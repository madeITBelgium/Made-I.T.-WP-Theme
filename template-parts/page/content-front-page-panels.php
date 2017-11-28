<?php
/**
 * Template part for displaying pages on front page.
 *
 * @since 1.0
 *
 * @version 1.0
 */
global $madeitcounter;

?>
<article id="panel<?php echo $madeitcounter; ?>" <?php post_class('madeit-panel '); ?> >
	<?php if (has_post_thumbnail()) :
        $thumbnail = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'madeit-featured-image');

        // Calculate aspect ratio: h / w * 100%.
        $ratio = $thumbnail[2] / $thumbnail[1] * 100;
        ?>

		<div class="panel-image" style="background-image: url(<?php echo esc_url($thumbnail[0]); ?>);">
			<div class="panel-image-prop" style="padding-top: <?php echo esc_attr($ratio); ?>%"></div>
		</div><!-- .panel-image -->

	<?php endif; ?>
	
	<div class="container">
		<div class="row voffset7 vbottom7">
			<div class="col">
				<header class="entry-header">
					<?php the_title('<h2 class="entry-title">', '</h2>'); ?>

					<?php madeit_edit_link(get_the_ID()); ?>

				</header><!-- .entry-header -->
			</div>
			<div class="col two-column-row <?php if ((is_page() || is_archive()) && 'one-column' === get_theme_mod('page_layout')) { echo "row"; } ?>">
				<div class="entry-content">
					<?php
                        /* translators: %s: Name of current post */
                        the_content(sprintf(
                            __('Continue reading<span class="screen-reader-text"> "%s"</span>', 'madeit'),
                            get_the_title()
                        ));
                    ?>
				</div><!-- .entry-content -->

				<?php
                // Show recent blog posts if is blog posts page (Note that get_option returns a string, so we're casting the result as an int).
                if (get_the_ID() === (int) get_option('page_for_posts')) : ?>

					<?php // Show four most recent posts.
                    $recent_posts = new WP_Query([
                        'posts_per_page'      => 3,
                        'post_status'         => 'publish',
                        'ignore_sticky_posts' => true,
                        'no_found_rows'       => true,
                    ]);
                    ?>

					<?php if ($recent_posts->have_posts()) : ?>

						<div class="recent-posts">

							<?php
                            while ($recent_posts->have_posts()) : $recent_posts->the_post();
                                get_template_part('template-parts/post/content', 'excerpt');
                            endwhile;
                            wp_reset_postdata();
                            ?>
						</div><!-- .recent-posts -->
					<?php endif; ?>
				<?php endif; ?>
			</div>

		</div><!-- .wrap -->
	</div><!-- .panel-content -->

</article><!-- #post-## -->

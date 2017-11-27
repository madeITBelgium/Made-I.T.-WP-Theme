<?php
/**
 * Additional features to allow styling of the templates.
 *
 * @since 1.0
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 *
 * @return array
 */
function madeit_body_classes($classes)
{
    // Add class of group-blog to blogs with more than 1 published author.
    if (is_multi_author()) {
        $classes[] = 'group-blog';
    }

    // Add class of hfeed to non-singular pages.
    if (!is_singular()) {
        $classes[] = 'hfeed';
    }

    // Add class if we're viewing the Customizer for easier styling of theme options.
    if (is_customize_preview()) {
        $classes[] = 'madeit-customizer';
    }

    // Add class on front page.
    if (is_front_page() && 'posts' !== get_option('show_on_front')) {
        $classes[] = 'madeit-front-page';
    }

    // Add a class if there is a custom header.
    if (has_header_image()) {
        $classes[] = 'has-header-image';
    }

    // Add class if sidebar is used.
    if (is_active_sidebar('sidebar-1') && !is_page()) {
        $classes[] = 'has-sidebar';
    }

    // Add class for one or two column page layouts.
    if (is_page() || is_archive()) {
        if ('one-column' === get_theme_mod('page_layout')) {
            $classes[] = 'page-one-column';
        } else {
            $classes[] = 'page-two-column';
        }
    }

    // Add class if the site title and tagline is hidden.
    if ('blank' === get_header_textcolor()) {
        $classes[] = 'title-tagline-hidden';
    }

    // Get the colorscheme or the default if there isn't one.
    $colors = madeit_sanitize_colorscheme(get_theme_mod('colorscheme', 'light'));
    $classes[] = 'colors-'.$colors;

    return $classes;
}
add_filter('body_class', 'madeit_body_classes');

/**
 * Count our number of active panels.
 *
 * Primarily used to see if we have any panels active, duh.
 */
function madeit_panel_count()
{
    $panel_count = 0;

    /**
     * Filter number of front page sections in Made I.T..
     *
     * @since Made I.T. 1.0
     *
     * @param int $num_sections Number of front page sections.
     */
    $num_sections = apply_filters('madeit_front_page_sections', 4);

    // Create a setting and control for each of the sections available in the theme.
    for ($i = 1; $i < (1 + $num_sections); $i++) {
        if (get_theme_mod('panel_'.$i)) {
            $panel_count++;
        }
    }

    return $panel_count;
}

/**
 * Checks to see if we're on the homepage or not.
 */
function madeit_is_frontpage()
{
    return  is_front_page() && !is_home();
}

/**
 * Template for comments and pingbacks.
 *
 * Used as a callback by wp_list_comments() for displaying the comments.
 */
function madeit_comment($comment, $args, $depth)
{
    $GLOBALS['comment'] = $comment;

    if ('pingback' == $comment->comment_type || 'trackback' == $comment->comment_type) : ?>

	<li id="comment-<?php comment_ID(); ?>" <?php comment_class(); ?>>
		<div class="comment-body">
			<?php _e('Pingback:', 'madeit'); ?> <?php comment_author_link(); ?> <?php edit_comment_link(__('Edit', 'madeit'), '<span class="edit-link">', '</span>'); ?>
		</div>

	<?php else : ?>

	<li id="comment-<?php comment_ID(); ?>" <?php comment_class(empty($args['has_children']) ? '' : 'parent'); ?>>
		<article id="div-comment-<?php comment_ID(); ?>" class="comment-body">
			<footer class="comment-meta">
				<div class="comment-author vcard">
					<?php if (0 != $args['avatar_size']) {
        echo get_avatar($comment, $args['avatar_size']);
    } ?>
					<?php printf(__('%s <span class="says">:</span>', 'madeit'), sprintf('<cite class="fn">%s</cite>', get_comment_author_link())); ?>
				</div><!-- .comment-author -->

				<div class="comment-metadata">
					<a href="<?php echo esc_url(get_comment_link($comment->comment_ID)); ?>">
						<time datetime="<?php comment_time('c'); ?>">
							<?php printf(_x('%1$s om %2$s', '1: date, 2: time', 'madeit'), get_comment_date(), get_comment_time()); ?>
						</time>
					</a>
					<?php edit_comment_link(__('Edit', 'madeit'), '<span class="edit-link">', '</span>'); ?>
				</div><!-- .comment-metadata -->

				<?php if ('0' == $comment->comment_approved) : ?>
				<p class="comment-awaiting-moderation"><?php _e('Je comentaar wacht op een review van de beheerder.', 'madeit'); ?></p>
				<?php endif; ?>
			</footer><!-- .comment-meta -->

			<div class="comment-content">
				<?php comment_text($comment); ?>
			</div><!-- .comment-content -->

			<?php
                comment_reply_link(array_merge($args, [
                    'add_below' => 'div-comment',
                    'depth'     => $depth,
                    'max_depth' => $args['max_depth'],
                    'before'    => '<div class="reply">',
                    'after'     => '</div>',
                ])); ?>
		</article><!-- .comment-body -->

	<?php
    endif;
}

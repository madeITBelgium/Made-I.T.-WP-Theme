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
        if (!is_front_page()) {
            $classes[] = 'single-page';
        }
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
    $classes[] = 'flex-column';
    $classes[] = 'd-flex';

    if (HEADER_UPPER_TOP) {
        $classes[] = 'has-upper-top-navbar';
    }

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

    if ('pingback' == $comment->comment_type || 'trackback' == $comment->comment_type) { ?>

	<li id="comment-<?php comment_ID(); ?>" <?php comment_class(); ?>>
		<div class="comment-body">
			<?php _e('Pingback:', 'madeit'); ?> <?php comment_author_link(); ?> <?php edit_comment_link(__('Edit', 'madeit'), '<span class="edit-link">', '</span>'); ?>
		</div>

	<?php } else { ?>

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

				<?php if ('0' == $comment->comment_approved) { ?>
				<p class="comment-awaiting-moderation"><?php _e('Je comentaar wacht op een review van de beheerder.', 'madeit'); ?></p>
				<?php } ?>
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
    }
}

function madeit_page_pagination($pages = '', $range = 2)
{
    $showitems = ($range * 2) + 1;
    global $paged;
    if (empty($paged)) {
        $paged = 1;
    }
    if ($pages == '') {
        global $wp_query;
        $pages = $wp_query->max_num_pages;

        if (!$pages) {
            $pages = 1;
        }
    }

    if (1 != $pages) {
        echo '<nav aria-label="Page navigation" role="navigation">';
        echo '<span class="sr-only">Page navigation</span>';
        echo '<ul class="pagination justify-content-center ft-wpbs">';

        echo '<li class="page-item disabled d-none d-lg-block"><span class="page-link">'.__('Page', 'madeit').' '.$paged.' '.__('of', 'madeit').' '.$pages.'</span></li>';

        if ($paged > 2 && $paged > $range + 1 && $showitems < $pages) {
            echo '<li class="page-item"><a class="page-link" href="'.get_pagenum_link(1).'" aria-label="First Page">&laquo;<span class="hidden-sm-down d-none d-md-inline-block mr-l"> '.__('First', 'madeit').'</span></a></li>';
        }

        if (($paged - 1) > 0) {
            echo '<li class="page-item d-none"><a class="page-link" href="'.get_pagenum_link($paged - 1).'" aria-label="Previous Page">&lsaquo;<span class="hidden-sm-down d-none d-md-inline-block ml-1"> '.__('Previous', 'madeit').'</span></a></li>';
        }

        for ($i = 1; $i <= $pages; $i++) {
            if (1 != $pages && (!($i >= $paged + $range + 1 || $i <= $paged - $range - 1) || $pages <= $showitems)) {
                echo ($paged == $i) ? '<li class="page-item active"><span class="page-link"><span class="sr-only">Current Page </span>'.$i.'</span></li>' : '<li class="page-item"><a class="page-link" href="'.get_pagenum_link($i).'"><span class="sr-only">Page </span>'.$i.'</a></li>';
            }
        }

        if (($paged + 1) < $pages) {
            echo '<li class="page-item"><a class="page-link next" href="'.get_pagenum_link($paged + 1).'" aria-label="Next Page"><span class="hidden-sm-down d-none d-md-inline-block mr-1">'.__('Next', 'madeit').'</span>&rsaquo;</a></li>';
        }

        if ($paged < $pages - 1 && $paged + $range - 1 < $pages && $showitems < $pages) {
            echo '<li class="page-item"><a class="page-link" href="'.get_pagenum_link($pages).'" aria-label="Last Page"><span class="hidden-sm-down d-none d-md-inline-block mr-1">'.__('Last', 'madeit').'</span>&raquo;</a></li>';
        }

        echo '</ul>';
        echo '</nav>';
        //echo '<div class="pagination-info mb-5 text-center">[ <span class="text-muted">Page</span> '.$paged.' <span class="text-muted">of</span> '.$pages.' ]</div>';
    }
}

if (!function_exists('madeit_show_title_metabox')) {
    function madeit_show_title_metabox($post_type)
    {
        if ('page' == $post_type) {
            add_meta_box(
                'madeit-pagetitle-meta-box',
                'page' == $post_type ? __('Page Attributes') : __('Attributes'),
                'madeit_pagetitle_meta_box_cb',
                'page',
                'side',
                'low'
            );
        }
    }
    add_action('add_meta_boxes', 'madeit_show_title_metabox');
}

if (!function_exists('madeit_pagetitle_meta_box_cb')) {
    function madeit_pagetitle_meta_box_cb($post)
    {
        $hidetitle = get_post_meta($post->ID, 'hide_title', true); ?>
        <input name="hide_title" type="checkbox" id="hide_title" value="1" style="float: right; margin-top: 2px;" <?php if (!empty($hidetitle)) {
            echo 'CHECKED';
        } ?> />
        <p class="post-attributes-label-wrapper"><label class="post-attributes-label" for="hide_title"><?php _e('Hide page title', 'madeit'); ?></label></p>
        <?php
    }
    //add_action('page_attributes_misc_attributes', 'madeit_pagetitle_meta_box_cb');
}

if (!function_exists('madeit_pagetitle_meta_box_save')) {
    function madeit_pagetitle_meta_box_save($post_id, $post)
    {
        if (current_user_can('edit_post', $post_id) && $post->post_type == 'page') {
            remove_action('save_post', 'madeit_pagetitle_meta_box_save', 99, 2);
            if (isset($_POST['hide_title'])) {
                update_post_meta($post_id, 'hide_title', 1);
            } else {
                update_post_meta($post_id, 'hide_title', 0);
            }

            add_action('save_post', 'madeit_pagetitle_meta_box_save', 99, 2);
        }
    }
    add_action('save_post', 'madeit_pagetitle_meta_box_save', 99, 2);
}

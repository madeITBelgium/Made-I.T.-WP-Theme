<?php
/**
 * The template for displaying comments.
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @since 1.0
 *
 * @version 1.0
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if (post_password_required()) {
    return;
}
?>

<div id="comments" class="comments-area">
    <?php if (have_comments()) : ?>
        <h3 class="comments-title">
            <?php
            $comments_number = get_comments_number();
            if ('1' === $comments_number) {
                /* translators: %s: post title */
                printf(_x('One Reply to &ldquo;%s&rdquo;', 'comments title', 'madeit'), get_the_title());
            } else {
                printf(
                    /* translators: 1: number of comments, 2: post title */
                    _nx(
                        '%1$s Reply to &ldquo;%2$s&rdquo;',
                        '%1$s Replies to &ldquo;%2$s&rdquo;',
                        $comments_number,
                        'comments title',
                        'madeit'
                    ),
                    number_format_i18n($comments_number),
                    get_the_title()
                );
            }
            ?>
        </h3>
        <ol class="comment-list">
            <?php
                /* Loop through and list the comments. Tell wp_list_comments()
                 * to use tpweb_comment() to format the comments.
                 * If you want to override this in a child theme, then you can
                 * define tpweb_comment() and that will be used instead.
                 * See tpweb_comment() in inc/template-tags.php for more.
                 */
                wp_list_comments([
                    'callback'    => 'madeit_comment',
                    'avatar_size' => 60,
                    ]
                );
            ?>
        </ol><!-- .comment-list -->

        <?php if (get_comment_pages_count() > 1 && get_option('page_comments')) : // are there comments to navigate through?>
            <nav id="comment-nav-below" class="comment-navigation" role="navigation">
                <div class="nav-previous"><?php previous_comments_link(esc_html__('Previous', 'madeit')); ?></div>
                <div class="nav-next"><?php next_comments_link(esc_html__('Next', 'madeit')); ?></div>
            </nav><!-- #comment-nav-below -->
        <?php endif; ?>
    <?php endif; ?>

    <?php if (!comments_open() && '0' != get_comments_number() && post_type_supports(get_post_type(), 'comments')) : ?>
            <p class="no-comments"><?php _e('Comments are closed.', 'madeit'); ?></p>
    <?php endif; ?>

    <?php
    $commenter = wp_get_current_commenter();
    $comments_arg = [
        'form' => [
            'class' => 'form-horizontal',
        ],
        'fields' => apply_filters('comment_form_default_fields', [
                'autor' => '<div class="form-group required"><label for="author">'.__('Name').'</label><input id="author" name="author" class="form-control" type="text" value="'.esc_attr($commenter['comment_author']).'" size="30" maxlength="245" aria-required="true" /><p id="d1" class="text-danger"></p></div>',
                'email' => '<div class="form-group required"><label for="email">'.__('Email').'</label><input id="email" name="email" class="form-control" type="text" value="'.esc_attr($commenter['comment_author_email']).'" size="30" maxlength="100" aria-required="true" /><p id="d2" class="text-danger"></p></div>',
                'url'   => '<div class="form-group"><label for="url">'.__('Website').'</label><input id="url" name="url" class="form-control" type="text" value="'.esc_attr($commenter['comment_author_url']).'" maxlength="200" size="30" /><p id="d3" class="text-danger"></p></div>',
            ]
         ),
        'comment_field'       => '<div class="form-group required"><label for="comment">'.__('Comment', 'madeit').'</label><textarea id="comment" class="form-control" name="comment" rows="3" maxlength="65525" aria-required="true"></textarea><p id="d4" class="text-danger"></p></div>',
        'comment_notes_after' => '',
        'class_submit'        => 'btn btn-outline-primary pull-right vbottom2',
    ];
    comment_form($comments_arg);
    ?>
</div>

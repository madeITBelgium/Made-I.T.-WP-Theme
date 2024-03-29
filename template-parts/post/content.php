<?php
/**
 * Template part for displaying posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @since 1.0
 *
 * @version 1.0
 */


$class = apply_filters('madeit_blog_column_class', ['col-12']);

?>

<div class="<?php echo implode(" ", $class); ?>">
    <article id="post-<?php the_ID(); ?>" <?php post_class(' blog-post '); ?>>
        <header>
            <?php
            if (is_single()) {
                the_title('<h1 class="entry-title">', '</h1>');
            } elseif (is_front_page() && is_home()) {
                the_title('<h3 class="entry-title"><a href="'.esc_url(get_permalink()).'" rel="bookmark">', '</a></h3>');
            } else {
                the_title('<h2 class="entry-title"><a href="'.esc_url(get_permalink()).'" rel="bookmark">', '</a></h2>');
            }

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
            if ('' !== get_the_post_thumbnail()) {
                ?>
                <div class="post-thumbnail">
                    <a href="<?php the_permalink(); ?>">
                        <?php the_post_thumbnail('madeit-featured-blog-image'); ?>
                    </a>
                </div>
                <?php
            } ?>

        </header>
        <div class="content">
            <?php
            /* translators: %s: Name of current post */
            the_content();
            ?>
        </div>
        <?php
        if (is_single()) {
            madeit_entry_footer();
        }
        ?>
    </article>
</div>
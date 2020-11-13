<?php
/**
 * Displays content for front page.
 *
 * @since 1.0
 *
 * @version 1.0
 */
?>
<div id="post-<?php the_ID(); ?>" <?php post_class(); ?> >
    <?php
    $hidetitle = get_post_meta($post->ID, 'hide_title', true);
    if (empty($hidetitle) || $hidetitle == 0) {
        ?>
        <div class="container">
            <div class="row">
                <div class="col">
                    <?php if (has_post_thumbnail()) {
            $thumbnail = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'madeit-featured-image');

            // Calculate aspect ratio: h / w * 100%.
            $ratio = $thumbnail[2] / $thumbnail[1] * 100; ?>

                        <div class="panel-image" style="background-image: url(<?php echo esc_url($thumbnail[0]); ?>);">
                            <div class="panel-image-prop" style="padding-top: <?php echo esc_attr($ratio); ?>%"></div>
                        </div><!-- .panel-image -->
                    <?php
        } ?>
                    <header class="entry-header">
                        <?php the_title('<h2 class="entry-title">', '</h2> '); ?>
                    </header><!-- .entry-header -->
                </div>
            </div>
        </div>
    <?php
    }
    the_content();
    ?>
</div><!-- #post-## -->

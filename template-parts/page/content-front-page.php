<?php
/**
 * Displays content for front page.
 *
 * @since 1.0
 *
 * @version 1.0
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class('madeit-panel container-fluid'); ?> >

    <?php if (has_post_thumbnail()) :
        $thumbnail = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'madeit-featured-image');

        // Calculate aspect ratio: h / w * 100%.
        $ratio = $thumbnail[2] / $thumbnail[1] * 100;
        ?>

        <div class="panel-image" style="background-image: url(<?php echo esc_url($thumbnail[0]); ?>);">
            <div class="panel-image-prop" style="padding-top: <?php echo esc_attr($ratio); ?>%"></div>
        </div><!-- .panel-image -->

    <?php endif; ?>
    <div class="<?php echo get_theme_mod('container_type'); ?> changable-container">
        <div class="row voffset7 vbottom7">
            <div class="col-sm">
                <header class="entry-header">
                    <?php the_title('<h2 class="entry-title">', '</h2>'); ?>

                    <?php madeit_edit_link(get_the_ID()); ?>

                </header><!-- .entry-header -->
            </div>
            <div class="col-sm two-column-row <?php if ((is_page() || is_archive()) && 'one-column' === get_theme_mod('page_layout')) {
            echo 'row';
        } ?>">
                <div class="entry-content">
                    <?php
                        /* translators: %s: Name of current post */
                        the_content(sprintf(
                            __('Continue reading<span class="screen-reader-text"> "%s"</span>', 'madeit'),
                            get_the_title()
                        ));
                    ?>
                </div><!-- .entry-content -->

            </div><!-- .wrap -->
        </div><!-- .panel-content -->

    </div>

</article><!-- #post-## -->

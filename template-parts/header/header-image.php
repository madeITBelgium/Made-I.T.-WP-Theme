<?php
/**
 * Displays header media.
 *
 * @since 1.0
 *
 * @version 1.0
 */
//TODO add blog description as overlay
?>
<div class="custom-header">
    <div class="custom-header-media">
        
        
        
        <div class="single-featured-image-header">
            <div class="site-branding-text">
                <?php if ( is_front_page() ) : ?>
                    <h1 class="site-title"><?php bloginfo( 'name' ); ?></h1>
                <?php else : ?>
                    <p class="site-title"><?php bloginfo( 'name' ); ?></p>
                <?php endif; ?>

                <?php
                $description = get_bloginfo( 'description', 'display' );

                if ( $description || is_customize_preview() ) :
                ?>
                    <p class="site-description"><?php echo $description; ?></p>
                <?php endif; ?>
            </div><!-- .site-branding-text -->
        
            <?php the_custom_header_markup(); ?>
        </div><!-- .single-featured-image-header -->
    </div>
</div><!-- .custom-header -->

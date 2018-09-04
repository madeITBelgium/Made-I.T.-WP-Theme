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
    <?php the_content(); ?>
</div><!-- #post-## -->

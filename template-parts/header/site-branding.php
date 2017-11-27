<?php
/**
 * Displays header site branding.
 *
 * @since 1.0
 *
 * @version 1.0
 */
?>

<?php the_custom_logo(); ?>
<a class="navbar-brand" href="<?php echo esc_url(home_url('/')); ?>" title="<?php echo esc_attr(get_bloginfo('name', 'display')); ?>" rel="home"><?php bloginfo('name'); ?></a>
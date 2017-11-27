<?php
/**
 * Displays top navigation
 *
 * @package Made I.T.
 * @since 1.0
 */

?>
<nav class="navbar navbar-expand-md bg-white fixed-top">
	<div class="container">
		<?php get_template_part('template-parts/header/site', 'branding'); ?>

		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#site-navigation" aria-expanded="false" aria-label="<?php _e( 'Menu', 'madeit' ); ?>">
			<span class="navbar-toggler-icon"></span>
		</button>
		<?php
		wp_nav_menu(array(
			'theme_location'    => 'top',
			'menu_id'			=> 'top-menu',
			'depth'             => 2,
			'container'         => 'nav',
			'container_id'		=> 'site-navigation',
			'container_class'   => 'collapse navbar-collapse main-navigation',
			'menu_class'        => 'menu nav navbar-nav ml-auto',
			'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
			'walker'            => new wp_bootstrap_navwalker()
		)); ?>
	</div>
</nav>

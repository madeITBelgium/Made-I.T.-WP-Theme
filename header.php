<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Made I.T.
 * @since 1.0
 * @version 1.0
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	
	<?php if ( has_nav_menu( 'top' ) ) : ?>
		<?php get_template_part( 'template-parts/navigation/navigation', 'top' ); ?>
	<?php endif; ?>
	<div id="page" class="site">
		<header id="masthead" class="container-fluid site-header" role="banner">
			<div class="row">
				<?php get_template_part( 'template-parts/header/header', 'image' ); ?>
			</div>
		</header><!-- #masthead -->

	<?php

	/*
	 * If a regular post or page, and not the front page, show the featured image.
	 * Using get_queried_object_id() here since the $post global may not be set before a call to the_post().
	 */
	if ( ( is_single() || ( is_page() && ! madeit_is_frontpage() ) ) && has_post_thumbnail( get_queried_object_id() ) ) :
		echo '<div class="single-featured-image-header">';
		echo get_the_post_thumbnail( get_queried_object_id(), 'madeit-featured-image' );
		echo '</div><!-- .single-featured-image-header -->';
	endif;
	?>
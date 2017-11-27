<?php
/**
 * Made I.T. back compat functionality
 *
 * Prevents Made I.T. from running on WordPress versions prior to 4.7,
 * since this theme is not meant to be backward compatible beyond that and
 * relies on many newer functions and markup changes introduced in 4.7.
 *
 * @package Made I.T.
 * @since Made I.T. 1.0
 */

/**
 * Prevent switching to Made I.T. on old versions of WordPress.
 *
 * Switches to the default theme.
 *
 * @since Made I.T. 1.0
 */
function madeit_switch_theme() {
	switch_theme( WP_DEFAULT_THEME );
	unset( $_GET['activated'] );
	add_action( 'admin_notices', 'madeit_upgrade_notice' );
}
add_action( 'after_switch_theme', 'madeit_switch_theme' );

/**
 * Adds a message for unsuccessful theme switch.
 *
 * Prints an update nag after an unsuccessful attempt to switch to
 * Made I.T. on WordPress versions prior to 4.7.
 *
 * @since Made I.T. 1.0
 *
 * @global string $wp_version WordPress version.
 */
function madeit_upgrade_notice() {
	$message = sprintf( __( 'Made I.T. requires at least WordPress version 4.7. You are running version %s. Please upgrade and try again.', 'madeit' ), $GLOBALS['wp_version'] );
	printf( '<div class="error"><p>%s</p></div>', $message );
}

/**
 * Prevents the Customizer from being loaded on WordPress versions prior to 4.7.
 *
 * @since Made I.T. 1.0
 *
 * @global string $wp_version WordPress version.
 */
function madeit_customize() {
	wp_die( sprintf( __( 'Made I.T. requires at least WordPress version 4.7. You are running version %s. Please upgrade and try again.', 'madeit' ), $GLOBALS['wp_version'] ), '', array(
		'back_link' => true,
	) );
}
add_action( 'load-customize.php', 'madeit_customize' );

/**
 * Prevents the Theme Preview from being loaded on WordPress versions prior to 4.7.
 *
 * @since Made I.T. 1.0
 *
 * @global string $wp_version WordPress version.
 */
function madeit_preview() {
	if ( isset( $_GET['preview'] ) ) {
		wp_die( sprintf( __( 'Made I.T. requires at least WordPress version 4.7. You are running version %s. Please upgrade and try again.', 'madeit' ), $GLOBALS['wp_version'] ) );
	}
}
add_action( 'template_redirect', 'madeit_preview' );

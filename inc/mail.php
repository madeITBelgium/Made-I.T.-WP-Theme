<?php

defined( 'ABSPATH' ) || exit;

/**
 * Mail configuration via wp-config.php constants.
 *
 * Supported constants:
 * - MADEIT_MAIL_FROM_EMAIL (string)
 * - MADEIT_MAIL_FROM_NAME (string)
 * - MADEIT_MAIL_USE_SMTP (bool)
 * - MADEIT_MAIL_SMTP_HOST (string)
 * - MADEIT_MAIL_SMTP_PORT (int)
 * - MADEIT_MAIL_SMTP_SECURE (string: '', 'ssl', 'tls')
 * - MADEIT_MAIL_SMTP_AUTH (bool)
 * - MADEIT_MAIL_SMTP_USER (string)
 * - MADEIT_MAIL_SMTP_PASS (string)
 */

if ( ! function_exists( 'madeit_mail_get_config' ) ) {
	function madeit_mail_get_config(): array {
		$admin_email = (string) get_option( 'admin_email', '' );
		$site_name   = wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES );

		return [
			'from_email' => defined( 'MADEIT_MAIL_FROM_EMAIL' ) ? (string) MADEIT_MAIL_FROM_EMAIL : $admin_email,
			'from_name'  => defined( 'MADEIT_MAIL_FROM_NAME' ) ? (string) MADEIT_MAIL_FROM_NAME : $site_name,
			'use_smtp'   => defined( 'MADEIT_MAIL_USE_SMTP' ) && (bool) MADEIT_MAIL_USE_SMTP,
			'host'       => defined( 'MADEIT_MAIL_SMTP_HOST' ) ? (string) MADEIT_MAIL_SMTP_HOST : '',
			'port'       => defined( 'MADEIT_MAIL_SMTP_PORT' ) ? (int) MADEIT_MAIL_SMTP_PORT : 587,
			'secure'     => defined( 'MADEIT_MAIL_SMTP_SECURE' ) ? (string) MADEIT_MAIL_SMTP_SECURE : 'tls',
			'auth'       => ! defined( 'MADEIT_MAIL_SMTP_AUTH' ) || (bool) MADEIT_MAIL_SMTP_AUTH,
			'user'       => defined( 'MADEIT_MAIL_SMTP_USER' ) ? (string) MADEIT_MAIL_SMTP_USER : '',
			'pass'       => defined( 'MADEIT_MAIL_SMTP_PASS' ) ? (string) MADEIT_MAIL_SMTP_PASS : '',
		];
	}
}

if ( ! function_exists( 'madeit_mail_filter_from_email' ) ) {
	function madeit_mail_filter_from_email( string $email ): string {
		$config = madeit_mail_get_config();
		$from   = sanitize_email( $config['from_email'] );
		return '' !== $from ? $from : $email;
	}
}

if ( ! function_exists( 'madeit_mail_filter_from_name' ) ) {
	function madeit_mail_filter_from_name( string $name ): string {
		$config = madeit_mail_get_config();
		$from   = sanitize_text_field( $config['from_name'] );
		return '' !== $from ? $from : $name;
	}
}

if ( ! function_exists( 'madeit_mail_configure_phpmailer' ) ) {
	function madeit_mail_configure_phpmailer( \PHPMailer\PHPMailer\PHPMailer $phpmailer ): void {
		$config = madeit_mail_get_config();

		// Keep default server mail transport unless SMTP is explicitly enabled.
		if ( ! $config['use_smtp'] ) {
			return;
		}

		if ( '' === trim( $config['host'] ) ) {
			return;
		}

		$phpmailer->isSMTP();
		$phpmailer->Host = trim( $config['host'] );
		$phpmailer->Port = (int) $config['port'];
		$phpmailer->SMTPAuth = (bool) $config['auth'];

		$secure = strtolower( trim( (string) $config['secure'] ) );
		if ( in_array( $secure, [ '', 'ssl', 'tls' ], true ) ) {
			$phpmailer->SMTPSecure = $secure;
		}

		if ( $phpmailer->SMTPAuth ) {
			$phpmailer->Username = (string) $config['user'];
			$phpmailer->Password = (string) $config['pass'];
		}
	}
}

add_filter( 'wp_mail_from', 'madeit_mail_filter_from_email', 99 );
add_filter( 'wp_mail_from_name', 'madeit_mail_filter_from_name', 99 );
add_action( 'phpmailer_init', 'madeit_mail_configure_phpmailer' );

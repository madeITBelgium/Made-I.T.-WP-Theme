<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

class Hardening {

    public static function init(): void {
        // Force SSL for admin — use the force_ssl_admin filter instead of defining the
        // FORCE_SSL_ADMIN constant, to avoid changing core-wide behavior from a plugin.
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_force_ssl_admin', false ) ) {
            add_filter( 'force_ssl_admin', [ __CLASS__, 'madeit_security_force_ssl_admin' ] );
        }

        // Disable file editor
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_disable_file_editor', true ) && ! defined( 'DISALLOW_FILE_EDIT' ) ) {
            define( 'DISALLOW_FILE_EDIT', true ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- WordPress core constant
        }

        // Block REST API user endpoint
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_block_rest_users', true ) ) {
            add_filter( 'rest_endpoints', [ __CLASS__, 'disable_rest_users' ] );
        }

        // Disable XML-RPC
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_block_xmlrpc', true ) ) {
            add_filter( 'xmlrpc_enabled', '__return_false' );
        }

        // Security headers
        add_action( 'send_headers', [ __CLASS__, 'send_security_headers' ] );

        // Remove unneeded wp_head items
        remove_action( 'wp_head', 'wlwmanifest_link' );
        remove_action( 'wp_head', 'rsd_link' );
        remove_action( 'wp_head', 'rest_output_link_wp_head' );

        // Auto-update plugins
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_auto_update_plugins', false ) ) {
            add_filter( 'auto_update_plugin', '__return_true' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- WordPress core hook
        }

        // Auto-update themes
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_auto_update_themes', false ) ) {
            add_filter( 'auto_update_theme', '__return_true' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- WordPress core hook
        }
    }

    /**
     * Filter callback for force_ssl_admin — only forces SSL when the current
     * request is already over HTTPS (directly or via reverse proxy).
     */
    public static function madeit_security_force_ssl_admin( bool $force ): bool {
        if ( $force ) return true; // already forced elsewhere
        $is_https = is_ssl()
            || ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && strtolower( sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) ) ) === 'https' ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
            || ( isset( $_SERVER['HTTP_X_FORWARDED_SSL'] ) && sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_FORWARDED_SSL'] ) ) === 'on' ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
        return $is_https;
    }

    public static function disable_rest_users( array $endpoints ): array {
        if ( ! is_user_logged_in() ) {
            if ( isset( $endpoints['/wp/v2/users'] ) ) {
                unset( $endpoints['/wp/v2/users'] );
            }
            if ( isset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] ) ) {
                unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
            }
        }
        return $endpoints;
    }

    public static function send_security_headers(): void {
        if ( headers_sent() ) return;

        // SecurityHeaders module handles these in a configurable way.
        // Only send fallback headers when that module is disabled.
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_xcontent_enabled', true ) ) {
            header( 'X-Content-Type-Options: nosniff' );
            header( 'X-Frame-Options: SAMEORIGIN' );
            header( 'Referrer-Policy: strict-origin-when-cross-origin' );
            header( 'Permissions-Policy: geolocation=(), microphone=(), camera=()' );
            header_remove( 'X-Powered-By' );
        }
    }
}
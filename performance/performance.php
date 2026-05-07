<?php

/**
 * Performance monitoring for WordPress hooks using Query Monitor.
 * This plugin adds start and stop actions for various WordPress hooks to measure their execution time in Query Monitor.
 * Plugin Name:       Performance Monitoring for WordPress Hooks
 * Plugin URI:        https://www.madeit.be
 * Description:       Adds performance monitoring for various WordPress hooks using Query Monitor.
 * Version:           6.8.0
 * Author:            Made I.T.
 * Text Domain:       madeit
 * Requires PHP:      7.4
 * Requires at least: 6.2.
 */
function madeit_perf_mu_plugin_loaded_start()
{
    do_action('qm/start', 'madeit:perf_mu_plugin_loaded');
}
add_action('mu_plugin_loaded', 'madeit_perf_mu_plugin_loaded_start', 0);

function madeit_perf_mu_plugin_loaded_end()
{
    do_action('qm/stop', 'madeit:perf_mu_plugin_loaded');
}
add_action('mu_plugin_loaded', 'madeit_perf_mu_plugin_loaded_end', PHP_INT_MAX);

function madeit_perf_network_plugin_loaded_start()
{
    do_action('qm/start', 'madeit:perf_network_plugin_loaded');
}
add_action('network_plugin_loaded', 'madeit_perf_network_plugin_loaded_start', 0);

function madeit_perf_network_plugin_loaded_end()
{
    do_action('qm/stop', 'madeit:perf_network_plugin_loaded');
}
add_action('network_plugin_loaded', 'madeit_perf_network_plugin_loaded_end', PHP_INT_MAX);

function madeit_perf_muplugins_loaded_start()
{
    do_action('qm/start', 'madeit:perf_muplugins_loaded');
}
add_action('muplugins_loaded', 'madeit_perf_muplugins_loaded_start', 0);

function madeit_perf_muplugins_loaded_end()
{
    do_action('qm/stop', 'madeit:perf_muplugins_loaded');
}
add_action('muplugins_loaded', 'madeit_perf_muplugins_loaded_end', PHP_INT_MAX);
/*
function madeit_perf_registered_taxonomy_start()
{
    do_action('qm/start', 'madeit:perf_registered_taxonomy');
}
add_action('registered_taxonomy', 'madeit_perf_registered_taxonomy_start', 0);

function madeit_perf_registered_taxonomy_end()
{
    do_action('qm/stop', 'madeit:perf_registered_taxonomy');
}
add_action('registered_taxonomy', 'madeit_perf_registered_taxonomy_end', PHP_INT_MAX);

function madeit_perf_registered_post_type_start()
{
    do_action('qm/start', 'madeit:perf_registered_post_type');
}
add_action('registered_post_type', 'madeit_perf_registered_post_type_start', 0);

function madeit_perf_registered_post_type_end()
{
    do_action('qm/stop', 'madeit:perf_registered_post_type');
}
add_action('registered_post_type', 'madeit_perf_registered_post_type_end', PHP_INT_MAX);
*/
function madeit_perf_plugin_loaded_start($plugin)
{
    do_action('qm/start', 'madeit:perf_plugin_loaded_'.$plugin);
}
add_action('plugin_loaded', 'madeit_perf_plugin_loaded_start', 0, 1);

function madeit_perf_plugin_loaded_end($plugin)
{
    do_action('qm/stop', 'madeit:perf_plugin_loaded_'.$plugin);
}
add_action('plugin_loaded', 'madeit_perf_plugin_loaded_end', PHP_INT_MAX, 1);

function madeit_perf_plugins_loaded_start()
{
    do_action('qm/start', 'madeit:perf_plugins_loaded');
}
add_action('plugins_loaded', 'madeit_perf_plugins_loaded_start', 0);

function madeit_perf_plugins_loaded_end()
{
    do_action('qm/stop', 'madeit:perf_plugins_loaded');
}
add_action('plugins_loaded', 'madeit_perf_plugins_loaded_end', PHP_INT_MAX);

function madeit_perf_setup_theme_start()
{
    do_action('qm/start', 'madeit:perf_setup_theme');
}
add_action('setup_theme', 'madeit_perf_setup_theme_start', 0);

function madeit_perf_setup_theme_end()
{
    do_action('qm/stop', 'madeit:perf_setup_theme');
}
add_action('setup_theme', 'madeit_perf_setup_theme_end', PHP_INT_MAX);

function madeit_perf_load_textdomain_start()
{
    do_action('qm/start', 'madeit:perf_load_textdomain');
}
add_action('load_textdomain', 'madeit_perf_load_textdomain_start', 0);

function madeit_perf_load_textdomain_end()
{
    do_action('qm/stop', 'madeit:perf_load_textdomain');
}
add_action('load_textdomain', 'madeit_perf_load_textdomain_end', PHP_INT_MAX);

function madeit_perf_after_setup_theme_start()
{
    do_action('qm/start', 'madeit:perf_after_setup_theme');
}
add_action('after_setup_theme', 'madeit_perf_after_setup_theme_start', 0);

function madeit_perf_after_setup_theme_end()
{
    do_action('qm/stop', 'madeit:perf_after_setup_theme');
}
add_action('after_setup_theme', 'madeit_perf_after_setup_theme_end', PHP_INT_MAX);

function madeit_perf_init_start()
{
    do_action('qm/start', 'madeit:perf_init');
}
add_action('init', 'madeit_perf_init_start', 0);

function madeit_perf_init_end()
{
    do_action('qm/stop', 'madeit:perf_init');
}
add_action('init', 'madeit_perf_init_end', PHP_INT_MAX);

function madeit_perf_widgets_init_start()
{
    do_action('qm/start', 'madeit:perf_widgets_init');
}
add_action('widgets_init', 'madeit_perf_widgets_init_start', 0);

function madeit_perf_widgets_init_end()
{
    do_action('qm/stop', 'madeit:perf_widgets_init');
}
add_action('widgets_init', 'madeit_perf_widgets_init_end', PHP_INT_MAX);

function madeit_perf_register_sidebar_start()
{
    do_action('qm/start', 'madeit:perf_register_sidebar');
}
add_action('register_sidebar', 'madeit_perf_register_sidebar_start', 0);

function madeit_perf_register_sidebar_end()
{
    do_action('qm/stop', 'madeit:perf_register_sidebar');
}
add_action('register_sidebar', 'madeit_perf_register_sidebar_end', PHP_INT_MAX);

function madeit_perf_wp_loaded_start()
{
    do_action('qm/start', 'madeit:perf_wp_loaded');
}
add_action('wp_loaded', 'madeit_perf_wp_loaded_start', 0);

function madeit_perf_wp_loaded_end()
{
    do_action('qm/stop', 'madeit:perf_wp_loaded');
}
add_action('wp_loaded', 'madeit_perf_wp_loaded_end', PHP_INT_MAX);

function madeit_perf_send_headers_start()
{
    do_action('qm/start', 'madeit:perf_send_headers');
}
add_action('send_headers', 'madeit_perf_send_headers_start', 0);

function madeit_perf_send_headers_end()
{
    do_action('qm/stop', 'madeit:perf_send_headers');
}
add_action('send_headers', 'madeit_perf_send_headers_end', PHP_INT_MAX);

function madeit_perf_wp_start()
{
    do_action('qm/start', 'madeit:perf_wp');
}
add_action('wp', 'madeit_perf_wp_start', 0);

function madeit_perf_wp_end()
{
    do_action('qm/stop', 'madeit:perf_wp');
}
add_action('wp', 'madeit_perf_wp_end', PHP_INT_MAX);

function madeit_perf_template_redirect_start()
{
    do_action('qm/start', 'madeit:perf_template_redirect');
}
add_action('template_redirect', 'madeit_perf_template_redirect_start', 0);

function madeit_perf_template_redirect_end()
{
    do_action('qm/stop', 'madeit:perf_template_redirect');
}
add_action('template_redirect', 'madeit_perf_template_redirect_end', PHP_INT_MAX);

function madeit_perf_wp_head_start()
{
    do_action('qm/start', 'madeit:perf_wp_head');
}
add_action('wp_head', 'madeit_perf_wp_head_start', 0);

function madeit_perf_wp_head_end()
{
    do_action('qm/stop', 'madeit:perf_wp_head');
}
add_action('wp_head', 'madeit_perf_wp_head_end', PHP_INT_MAX);

function madeit_perf_wp_footer_start()
{
    do_action('qm/start', 'madeit:perf_wp_footer');
}
add_action('wp_footer', 'madeit_perf_wp_footer_start', 0);

function madeit_perf_wp_footer_end()
{
    do_action('qm/stop', 'madeit:perf_wp_footer');
}
add_action('wp_footer', 'madeit_perf_wp_footer_end', PHP_INT_MAX);

function madeit_perf_shutdown_start()
{
    do_action('qm/start', 'madeit:perf_shutdown');
}
add_action('shutdown', 'madeit_perf_shutdown_start', 0);

function madeit_perf_shutdown_end()
{
    do_action('qm/stop', 'madeit:perf_shutdown');
}
add_action('shutdown', 'madeit_perf_shutdown_end', PHP_INT_MAX - 1);

/*
send_headers
parse_query
pre_get_posts — WP main query.
posts_clauses
posts_selection
pre_handle_404
send_headers — additional HTTP headers: caching, type, etc.
wp
template_redirect — before plugging in the template file.



get_header
wp_head
wp_enqueue_scripts
wp_print_styles
wp_print_scripts

get_search_form
loop_start
the_post
get_template_part_content
loop_end
get_sidebar
dynamic_sidebar
pre_get_comments
wp_meta

get_footer
wp_footer
wp_print_footer_scripts
admin_bar_menu
wp_before_admin_bar_render
wp_after_admin_bar_render
*/

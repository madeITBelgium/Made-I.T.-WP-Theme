<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 * @since 1.0
 *
 * @version 1.0
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="http://gmpg.org/xfn/11">

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <?php if (has_nav_menu('top')) : ?>
        <?php get_template_part('template-parts/navigation/navigation', 'top'); ?>
    <?php endif; ?>
    <?php if (is_front_page() || (!has_post_thumbnail() && get_theme_mod('show_header_on_sub_pages') == 1) || is_customize_preview()) : ?>
        <?php
        $style = 'display: none;';
        if (is_front_page() || (!has_post_thumbnail() && get_theme_mod('show_header_on_sub_pages') == 1)) {
            $style = '';
        }
        ?>
        <header id="masthead" class="container-fluid site-header <?php if (!is_front_page()) {
            echo 'no-front-page';
        } ?>" role="banner" style="<?php echo $style; ?>">
            <div class="row">
                <?php get_template_part('template-parts/header/header', 'image'); ?>
            </div>
        </header><!-- #masthead -->
    <?php endif; ?>
    <div class="flex-grow">
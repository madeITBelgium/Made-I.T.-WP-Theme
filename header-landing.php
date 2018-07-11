<?php
/**
 * The header for our landingpage.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 * @since 1.1
 *
 * @version 1.1
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

    <?php if (has_nav_menu('top')) : ?>
        <?php get_template_part('template-parts/navigation/navigation', 'landing'); ?>
    <?php endif; ?>
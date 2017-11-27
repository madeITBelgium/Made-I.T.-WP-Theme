<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 * @since 1.0
 *
 * @version 1.2
 */
?>

<footer id="colophon" class="container-fluid" role="contentinfo">
	<div class="row">
		<div class="col">
			<?php
            get_template_part('template-parts/footer/footer', 'widgets');

            if (has_nav_menu('social')) : ?>
				<nav class="social-navigation" role="navigation" aria-label="<?php esc_attr_e('Footer Social Links Menu', 'madeit'); ?>">
					<?php
                        wp_nav_menu([
                            'theme_location' => 'social',
                            'menu_class'     => 'social-links-menu',
                            'depth'          => 1,
                            'link_before'    => '<span class="screen-reader-text">',
                            'link_after'     => '</span>'.madeit_get_svg(['icon' => 'chain']),
                        ]);
                    ?>
				</nav><!-- .social-navigation -->
			<?php endif; ?>
		</div>
	</div>
	<?php
    get_template_part('template-parts/footer/site', 'info');
    ?>
</footer>
<?php wp_footer(); ?>

</body>
</html>

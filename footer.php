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
$footerClass = apply_filters('madeit_footer_class', ['container-fluid', 'site-footer']);
?>
</div>
<footer id="colophon" class="<?php echo is_array($footerClass) ? implode(' ', $footerClass) : $footerClass; ?>" role="contentinfo">
    <div class="row mt-5 mb-5">
        <div class="col-sm">
            <?php get_template_part('template-parts/footer/footer', 'widgets'); ?>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <?php
            if (has_nav_menu('social')) { ?>
                <div class="col-sm">
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
                </div>
            <?php } ?>
            <div class="col-sm site-info text-center">
                <?php get_template_part('template-parts/footer/site', 'info'); ?>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>

</body>
</html>

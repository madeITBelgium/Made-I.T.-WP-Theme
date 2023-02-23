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
$footerWidgetRow = apply_filters('madeit_footer_widget_row_class', ['row', 'mt-5', 'mb-5', 'mx-2']);
$footerContainerClass = apply_filters('madeit_footer_container_class', ['container']);
?>
<?php do_action('madeit_end_grow'); ?>
</div>
<?php do_action('madeit_before_footer'); ?>
<footer id="colophon" class="<?php echo is_array($footerClass) ? implode(' ', $footerClass) : $footerClass; ?>" role="contentinfo">
    <?php do_action('madeit_before_footer_widget'); ?>
    <div class="<?php echo is_array($footerWidgetRow) ? implode(' ', $footerWidgetRow) : $footerWidgetRow; ?>">
        <div class="col">
            <?php get_template_part('template-parts/footer/footer', 'widgets'); ?>
        </div>
    </div>
    <?php do_action('madeit_between_footer'); ?>
    <div class="<?php echo is_array($footerContainerClass) ? implode(' ', $footerContainerClass) : $footerContainerClass; ?>">
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

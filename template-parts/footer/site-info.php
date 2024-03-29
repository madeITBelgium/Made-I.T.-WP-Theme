<?php
/**
 * Displays footer site info.
 *
 * @since 1.0
 *
 * @version 1.0
 */
?>
&copy; <?php echo date('Y'); ?> <?php echo get_bloginfo('name') ?> - 
<a href="<?php echo get_privacy_policy_url(); ?>"><?php _e('Privacy policy', 'madeit'); ?></a>
<?php do_action('madeit_footer_behind_privacy'); ?>
<?php if (SHOW_LOGIN_IN_FOOTER) { ?> - <a href="<?php echo esc_url(wp_login_url()); ?>" alt="<?php esc_attr_e('Login', 'madeit'); ?>"><?php _e('Login', 'madeit'); ?></a><?php } ?>
<?php if (SHOW_MADEIT_IN_FOOTER) { ?> - <?php } ?>
<?php if (SHOW_MADEIT_IN_FOOTER) { ?><a href="<?php echo esc_url(__('https://www.madeit.be/', 'madeit')); ?>" title="<?php printf(__('Webdesign door %s uit Geel', 'madeit'), 'Made I.T.'); ?>"><?php echo apply_filters('madeit_powered_by_text', sprintf(__('Proudly powered by %s', 'madeit'), 'Made I.T.')); ?></a><?php } ?>
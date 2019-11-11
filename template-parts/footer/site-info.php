<?php
/**
 * Displays footer site info.
 *
 * @since 1.0
 *
 * @version 1.0
 */
?>
&copy; <?php echo date('Y'); ?> <?php echo get_bloginfo('name') ?> - <a href="<?php echo get_privacy_policy_url(); ?>"><?php _e('Privacy policy', 'madeit'); ?></a> - <?php if (SHOW_LOGIN_IN_FOOTER) { ?><a href="<?php echo esc_url(wp_login_url()); ?>" alt="<?php esc_attr_e('Login', 'madeit'); ?>"><?php _e('Login', 'madeit'); ?></a><?php } ?> - <a href="<?php echo esc_url(__('https://www.madeit.be/', 'madeit')); ?>" title="<?php printf(__('Webdesign door %s uit Geel', 'madeit'), 'Made I.T.'); ?>"><?php printf(__('Proudly powered by %s', 'madeit'), 'Made I.T.'); ?></a>
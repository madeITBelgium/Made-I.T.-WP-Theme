<?php
/**
 * Show messages.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author      Made I.T.
 *
 * @version     3.9.0
 */
if (!defined('ABSPATH')) {
    exit;
}

if (!$notices) {
    return;
}
?>

<?php foreach ($notices as $notice) { ?>
	<div class="alert alert-success"<?php echo wc_get_notice_data_attr($notice); ?> role="alert">
		<?php echo wc_kses_notice($notice['notice']); ?>
	</div>
<?php } ?>
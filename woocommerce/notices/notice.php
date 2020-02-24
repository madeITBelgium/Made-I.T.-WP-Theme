<?php
/**
 * Show messages.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author      Made I.T.
 *
 * @version     3.5.0
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}
if (!$messages) {
    return;
}
?>

<?php foreach ($messages as $message) { ?>
	<div class="alert alert-info">
		<?php
            echo wc_kses_notice($message);
        ?>
	</div>
<?php } ?>
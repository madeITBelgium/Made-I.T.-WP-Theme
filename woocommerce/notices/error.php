<?php
/**
 * Show error messages.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author      Made I.T.
 *
 * @version     1.6.4
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

if (!$messages) {
    return;
}

?>
<ul class="alert alert-danger">
	<?php foreach ($messages as $message) : ?>
		<li><?php echo wp_kses_post($message); ?></li>
	<?php endforeach; ?>
</ul>

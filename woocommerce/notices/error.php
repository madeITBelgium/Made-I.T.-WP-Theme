<?php
/**
 * Show error messages.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author      Made I.T.
 *
 * @version     3.5.0
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! $messages ) {
	return;
}
?>
<ul class="alert alert-danger" role="alert">
	<?php foreach ( $messages as $message ) : ?>
		<li>
			<?php
				echo wc_kses_notice( $message );
			?>
		</li>
	<?php endforeach; ?>
</ul>
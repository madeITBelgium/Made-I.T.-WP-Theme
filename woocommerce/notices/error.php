<?php
/**
 * Show error messages.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author      Made I.T.
 *
 * @version 3.9.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! $notices ) {
	return;
}
?>
<ul class="alert alert-danger" role="alert">
	<?php foreach ( $notices as $notice ) : ?>
		<li<?php echo wc_get_notice_data_attr( $notice ); ?>>
			<?php echo wc_kses_notice( $notice['notice'] ); ?>
		</li>
	<?php endforeach; ?>
</ul>
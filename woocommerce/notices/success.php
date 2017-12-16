<?php
/**
 * Show messages
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author      Made I.T.
 * @package 	madeit
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! $messages ) {
	return;
}

?>

<?php foreach ( $messages as $message ) : ?>
	<div class="alert alert-success"><?php echo wp_kses_post( $message ); ?></div>
<?php endforeach; ?>

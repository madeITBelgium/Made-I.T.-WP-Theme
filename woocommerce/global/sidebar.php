<?php
/**
 * Sidebar
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author      Made I.T.
 * @package 	madeit
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

get_sidebar( 'shop' );

/* Omit closing PHP tag at the end of PHP files to avoid "headers already sent" issues. */

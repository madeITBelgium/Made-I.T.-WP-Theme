<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class WC_Gateway_Pay_Invoice extends WC_Payment_Gateway {
	
	/**
	 * Constructor for the gateway.
	 */
	public function __construct()
    { 
		global $woocommerce;
		
		$this->id			= 'pay_invoice';
		$this->has_fields 	= false;
		$this->method_title = __('Pay Later By Invoice', 'madeit');
		
		// Load the form fields.
		$this->init_form_fields();
		
		// Load the settings.
		$this->init_settings();
		
		// Define user set variables
		$this->title 				= $this->settings['title'];
		$this->description 			= $this->settings['description'];
		
		// Actions
		add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
		add_filter( 'woocommerce_email_format_string_find', array($this, 'order_status_format_string_find') );
		add_filter( 'woocommerce_email_format_string_replace', array($this, 'order_status_format_string_replace'), 10, 2 );
	}
	
	/**
	 * Allow Order status to be accessible from emails
	 */
	public function order_status_format_string_find( $find )
    {
		$find['order-status'] = '{order_status}';
		return $find;
		
	}
	
	/**
	 * Replace Order status in emails
	 */
	public function order_status_format_string_replace( $replace, $email )
    {
    	if( $email->object ) {
		    $replace['order-status'] = wc_get_order_status_name( $email->object->get_status() );
        }
		return $replace;
	}
	
	/**
	 * Initialise Gateway Settings Form Fields
	 */
	public function init_form_fields()
    {
		$this->form_fields = array(
			'enabled' => array(
                'title' => __( '<b>Enable/Disable:</b>', 'madeit' ), 
                'type' => 'checkbox', 
                'label' => __( 'Enable Pay Later Payment Gateway.', 'madeit' ), 
                'default' => 'yes'
            ), 
			'title' => array(
                'title' => __( '<b>Title:</b>', 'madeit' ), 
                'type' => 'text', 
                'description' => __( 'The title which the user sees during checkout.', 'madeit' ), 
                'default' => __( 'Pay Later', 'madeit' )
            ),
			'description' => array(
                'title' => __( '<b>Description:</b>', 'madeit' ), 
                'type' => 'textarea', 
                'description' => __( 'This controls the description which the user sees during checkout.', 'madeit' ), 
                'default' => __('Choose to pay later, we\'ll send you an invoice.', 'madeit')
            )
        );
	}
	
	/**
	 * Admin Panel Options 
	 */
	public function admin_options()
    {
		?>
		
		<h3>Pay Per Invoice Payment Gateway</h3>
		
		<p>Allow your customers to choose to pay the invoice later</p>
		
		<table class="form-table">
			
		<?php
			
		// Generate the HTML For the settings form.
		$this->generate_settings_html();
	}
	
	/**
	 * Process the payment, set the Order to pending and return the result
	 **/
	public function process_payment( $order_id )
    {
		$order = wc_get_order( $order_id );
		
		$order->update_status( apply_filters( 'woocoommerce_pay_later_checkout_status', 'on-hold', $this ) );

		update_post_meta( $order_id, '_is_pay_later', true );
		
		// Reduce stock levels
		$order->reduce_order_stock();
		
		// Remove cart
		WC()->cart->empty_cart();
		
		return array(
			'result' 	=> 'success',
			'redirect'	=> apply_filters( 'wc_pay_later_order_received_url', $order->get_checkout_order_received_url(), $order, $this )
		);
	}
	
	/**
	 * There are some scenerios where Pay Later should not be a checkout option, such as when on the Order Pay endpoint and when us WC Shop As Customer at checkout 
	 */
	public function is_available()
    {
		// if we are available lets run some checks
        $user = wp_get_current_user();
        if($user->ID == 0) {
            return false;
        }

        //check if user is approved
        if(get_user_meta($user->ID, 'invoice_payments', true)) {
            $is_available = true;
        } else {
            $is_available = false;
        }

        return $is_available;
    }
}
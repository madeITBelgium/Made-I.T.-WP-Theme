<?php

define('ABSPATH', __DIR__);

$session_data = [];
$context = [];
$customer_id = 0;
$order_status = 'processing';
$product = new class {
    public function get_parent_id() { return 42; }
    public function get_id() { return 43; }
    public function get_name() { return 'Rugzak'; }
    public function get_sku() { return 'RUG-001'; }
};
$session = new class {
    public function get($key, $default = null) { return $GLOBALS['session_data'][$key] ?? $default; }
    public function set($key, $value) { $GLOBALS['session_data'][$key] = $value; }
    public function __unset($key) { unset($GLOBALS['session_data'][$key]); }
};
$cart = new class {
    public function is_empty() { return false; }
    public function get_total($context) { return '119.90'; }
};
$item = new class {
    public function get_quantity() { return 2; }
    public function get_product() { return $GLOBALS['product']; }
    public function get_product_id() { return 42; }
    public function get_variation_id() { return 43; }
    public function get_name() { return 'Bestelde rugzak'; }
    public function get_total() { return '99.90'; }
};
$order = new class {
    public function get_order_key() { return 'secret-key'; }
    public function get_customer_id() { return 7; }
    public function has_status($statuses) { return in_array($GLOBALS['order_status'], $statuses, true); }
    public function get_items() { return [$GLOBALS['item']]; }
    public function get_order_number() { return 'ORD-1001'; }
    public function get_id() { return 1001; }
    public function get_total() { return '119.90'; }
    public function get_billing_email() { return 'klant@example.be'; }
};

function add_action(...$arguments) {}
function WC() { return (object) ['session' => $GLOBALS['session'], 'cart' => $GLOBALS['cart']]; }
function get_the_terms($identifier, $taxonomy) {
    check($identifier === 42, 'Variations must use parent categories');
    return [(object) ['term_id' => 9, 'name' => 'Tassen']];
}
function is_wp_error($value) { return false; }
function wc_get_price_to_display($product) { return 59.95; }
function wc_get_product($identifier) { return $GLOBALS['product']; }
function wp_generate_uuid4() { static $identifier = 0; return 'event-'.++$identifier; }
function is_product() { return !empty($GLOBALS['context']['product']); }
function is_checkout() { return !empty($GLOBALS['context']['checkout']); }
function is_wc_endpoint_url() { return !empty($GLOBALS['context']['endpoint']); }
function is_order_received_page() { return !empty($GLOBALS['context']['purchase']); }
function get_queried_object_id() { return 43; }
function get_query_var($name) { return 1001; }
function absint($value) { return abs((int) $value); }
function wc_get_order($identifier) { return $GLOBALS['order']; }
function wc_clean($value) { return $value; }
function wp_unslash($value) { return $value; }
function get_current_user_id() { return $GLOBALS['customer_id']; }
function wp_json_encode($data, $flags) { return json_encode($data, $flags); }

function check($condition, $message)
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

function page_events()
{
    ob_start();
    madeit_wt_page_events();
    $html = ob_get_clean();
    if ($html === '') {
        return [];
    }
    $start = strpos($html, '>') + 1;
    return json_decode(substr($html, $start, strrpos($html, '</script>') - $start), true);
}

require __DIR__.'/../inc/websitetool-ecommerce.php';

madeit_wt_added_to_cart('cart-key', 42, 2, 43);
$events = madeit_wt_take_cart_events();
check(count($events) === 1, 'Confirmed cart add must produce one event');
check($events[0]['data']['quantity'] === 2.0, 'Quantity must be numeric');
check($events[0]['data']['price'] === 59.95, 'Price must be numeric');
check($events[0]['data']['id'] === '43', 'Variation ID must be preserved');
check(madeit_wt_take_cart_events() === [], 'Cart events must be consumed once');

$context = ['product' => true];
check(page_events()[0]['method'] === 'wtTrackProductView', 'Product detail must track a view');
$context = ['checkout' => true];
check(page_events()[0]['data'] === 119.9, 'Checkout must use numeric cart total');
$context['endpoint'] = true;
check(page_events() === [], 'Checkout endpoints must not start another checkout');

$context = ['purchase' => true];
$_GET['key'] = ['invalid-key'];
check(page_events() === [], 'Array order key must be rejected safely');
$_GET['key'] = 'wrong-key';
check(page_events() === [], 'Wrong order key must not expose purchase data');
$_GET['key'] = 'secret-key';
$purchase = page_events()[0];
check($purchase['data']['total_value'] === 119.9, 'Purchase must use actual order total');
check($purchase['data']['products'][0]['price'] === 49.95, 'Purchase must use historical discounted unit price');
check($purchase['data']['products'][0]['name'] === 'Bestelde rugzak', 'Purchase must use historical item name');
check($purchase['data']['user_email'] === 'klant@example.be', 'Purchase must include billing email');
foreach (['pending', 'failed', 'cancelled', 'refunded'] as $order_status) {
    check(page_events() === [], 'Unconfirmed or invalid orders must not track purchases');
}
$order_status = 'on-hold';
check(count(page_events()) === 1, 'Confirmed offline orders must track purchases');
unset($_GET['key']);
$customer_id = 7;
check(count(page_events()) === 1, 'Order owner must be allowed to view purchase');
$customer_id = 8;
check(page_events() === [], 'Other customers must not access purchase data');

echo "WebsiteTool PHP tests passed: products, variations, confirmed adds, checkout, order access, statuses, historical totals.\n";
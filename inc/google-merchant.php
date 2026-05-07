<?php
// Register a custom RSS feed for Google Merchant Center containing WooCommerce products that are for sale.

if (!defined('ABSPATH')) {
	exit;
}

// Register the custom feed endpoint
add_action('init', function () {
	add_feed('google-merchant', 'madeit_google_merchant_feed');
});

// Flush rewrites on theme switch to ensure the feed endpoint works on pretty permalinks
add_action('after_switch_theme', function () {
	flush_rewrite_rules(false);
});

/**
 * Output Google Merchant Center RSS 2.0 feed with g: namespace.
 * URL: /?feed=google-merchant or /feed/google-merchant
 */
function madeit_google_merchant_feed()
{
	if (!function_exists('wc_get_products')) {
		status_header(404);
		exit;
	}

    header('Content-Type: application/rss+xml; charset=UTF-8');
    echo madeit_build_google_merchant_xml();
    exit;
}

/**
 * Build the full Google Merchant XML as a string (used by feed and CLI).
 */
function madeit_build_google_merchant_xml(): string
{
    $site_title = get_bloginfo('name');
    $site_link  = home_url('/');
    $site_desc  = trim((string) get_bloginfo('description'));
    $currency   = function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : get_option('woocommerce_currency', 'EUR');

    $items = madeit_google_merchant_products();

    ob_start();
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
	<title><?php echo madeit_xml_cdata($site_title . ' - Product Feed'); ?></title>
	<link><?php echo esc_url($site_link); ?></link>
	<description><?php echo madeit_xml_cdata($site_desc !== '' ? $site_desc : $site_title . ' product feed'); ?></description>
	<?php foreach ($items as $item) { echo madeit_render_google_item_xml($item, $currency); } ?>
  </channel>
</rss>
<?php
    return (string) ob_get_clean();
}

/**
 * Render a single <item> block for Google Merchant XML.
 *
 * @param array<string,mixed> $item
 * @param string $currency
 */
function madeit_render_google_item_xml(array $item, string $currency): string
{
		$price_value = number_format((float) ($item['price'] ?? 0), 2, '.', '');
		$sale_price  = isset($item['sale_price']) ? number_format((float) $item['sale_price'], 2, '.', '') : null;
		$sale_from   = $item['sale_from'] ?? null;
		$sale_to     = $item['sale_to'] ?? null;

		ob_start();
		?>
		<item>
			<g:id><?php echo madeit_xml_cdata($item['id']); ?></g:id>
			<g:title><?php echo madeit_xml_cdata($item['title']); ?></g:title>
			<g:description><?php echo madeit_xml_cdata($item['description']); ?></g:description>
			<g:link><?php echo esc_url($item['link']); ?></g:link>
			<?php if (!empty($item['image_link'])) { ?>
			<g:image_link><?php echo esc_url($item['image_link']); ?></g:image_link>
			<?php } ?>
			<?php if (!empty($item['additional_image_links']) && is_array($item['additional_image_links'])) {
					foreach ($item['additional_image_links'] as $img) { ?>
			<g:additional_image_link><?php echo esc_url($img); ?></g:additional_image_link>
			<?php } } ?>
			<g:condition>new</g:condition>
			<g:availability><?php echo esc_html($item['availability']); ?></g:availability>
			<g:price><?php echo esc_html($price_value . ' ' . $currency); ?></g:price>
			<?php if ($sale_price && $sale_price < $price_value) { ?>
			<g:sale_price><?php echo esc_html($sale_price . ' ' . $currency); ?></g:sale_price>
			<?php if ($sale_from && $sale_to) { ?>
			<g:sale_price_effective_date><?php echo esc_html(madeit_iso8601_with_tz($sale_from) . '/' . madeit_iso8601_with_tz($sale_to)); ?></g:sale_price_effective_date>
			<?php } } ?>
			<?php if (!empty($item['brand'])) { ?>
			<g:brand><?php echo madeit_xml_cdata($item['brand']); ?></g:brand>
			<?php } ?>
			<?php if (!empty($item['gtin'])) { ?>
			<g:gtin><?php echo esc_html(preg_replace('/\D+/', '', (string) $item['gtin'])); ?></g:gtin>
			<?php } ?>
			<?php if (!empty($item['mpn'])) { ?>
			<g:mpn><?php echo madeit_xml_cdata((string) $item['mpn']); ?></g:mpn>
			<?php } ?>
			<?php if (!empty($item['google_product_category'])) { ?>
			<g:google_product_category><?php echo madeit_xml_cdata($item['google_product_category']); ?></g:google_product_category>
			<?php } ?>
			<?php if (!empty($item['product_type'])) { ?>
			<g:product_type><?php echo madeit_xml_cdata($item['product_type']); ?></g:product_type>
			<?php } ?>
			<?php if (!empty($item['item_group_id'])) { ?>
			<g:item_group_id><?php echo madeit_xml_cdata($item['item_group_id']); ?></g:item_group_id>
			<?php } ?>
			<?php if (!empty($item['identifier_exists']) && $item['identifier_exists'] === false) { ?>
			<g:identifier_exists>FALSE</g:identifier_exists>
			<?php } ?>
		</item>
		<?php
		return (string) ob_get_clean();
}

/**
 * Generate an array of feed items from WooCommerce products/variations.
 * Each item is an associative array with keys used in the template above.
 *
 * @return array<int, array<string, mixed>>
 */
function madeit_google_merchant_products(): array
{
	$items = [];

	// Build base args; allow overrides via filter.
	$args = [
		'status'  => ['publish'],
		'limit'   => -1,
		'type'    => ['simple', 'variable'],
		'return'  => 'ids',
		'orderby' => 'ID',
		'order'   => 'ASC',
	];
	$args = apply_filters('madeit_google_merchant_query_args', $args);

	$product_ids = wc_get_products($args);

	foreach ($product_ids as $product_id) {
		$product = wc_get_product($product_id);
		if (!$product) {
			continue;
		}

		// Skip hidden or non-purchasable products
		if (method_exists($product, 'get_catalog_visibility') && $product->get_catalog_visibility() === 'hidden') {
			continue;
		}
		if (!$product->is_purchasable()) {
			continue;
		}

		if ($product->is_type('variable')) {
			foreach ($product->get_children() as $variation_id) {
				$variation = wc_get_product($variation_id);
				if (!$variation || !$variation->is_purchasable()) {
					continue;
				}

				$stock_status = $variation->get_stock_status();
				if (!in_array($stock_status, ['instock', 'onbackorder'], true)) {
					continue; // only "te koop" (for sale) items
				}

				$items[] = madeit_gc_item_from_product($variation, $product);
			}
		} else {
			$stock_status = $product->get_stock_status();
			if (!in_array($stock_status, ['instock', 'onbackorder'], true)) {
				continue; // only for sale items
			}

			$items[] = madeit_gc_item_from_product($product, null);
		}
	}

	// Allow last-minute customization
	return apply_filters('madeit_google_merchant_items', $items);
}

/**
 * Map a WC product (simple or variation) into a Google Merchant item array.
 *
 * @param WC_Product $product
 * @param WC_Product_Variable|null $parent
 * @return array<string, mixed>
 */
function madeit_gc_item_from_product($product, $parent = null): array
{
	$is_variation = $product->is_type('variation');
	$parent_prod  = $is_variation ? ($parent ?: wc_get_product($product->get_parent_id())) : null;

	$id   = $product->get_sku();
	if (!$id) {
		$id = (string) $product->get_id();
	}

	$link = get_permalink($is_variation && $parent_prod ? $parent_prod->get_id() : $product->get_id());

	$title = $product->get_name();
	// Optional: append variation attributes to title for clarity
	if ($is_variation) {
		$attrs = wc_get_formatted_variation($product, true, false, true);
		if ($attrs) {
			$title .= ' - ' . wp_strip_all_tags($attrs);
		}
	}

	// Description: product short description or full description fallback
	$raw_desc = $product->get_short_description();
	if (!$raw_desc) {
		$raw_desc = $product->get_description();
	}
	$desc = trim(wp_strip_all_tags(strip_shortcodes((string) $raw_desc)));
	if ($desc === '') {
		$desc = $title;
	}
	if (mb_strlen($desc) > 5000) {
		$desc = mb_substr($desc, 0, 5000);
	}

	// Images
	$image_link = '';
	$gallery    = [];
	$image_id   = $product->get_image_id();
	if (!$image_id && $parent_prod) {
		$image_id = $parent_prod->get_image_id();
	}
	if ($image_id) {
		$image_link = wp_get_attachment_url($image_id) ?: '';
	}
	$gallery_ids = $product->get_gallery_image_ids();
	if (empty($gallery_ids) && $parent_prod) {
		$gallery_ids = $parent_prod->get_gallery_image_ids();
	}
	foreach ($gallery_ids as $gid) {
		$url = wp_get_attachment_url($gid);
		if ($url) {
			$gallery[] = $url;
		}
	}

	// Price & sales
	$regular = (float) $product->get_regular_price();
	$price   = (float) $product->get_price();
	$on_sale = $product->is_on_sale();
	$sale_price = $on_sale ? (float) $product->get_sale_price() : null;

	$sale_from = null;
	$sale_to   = null;
	if ($on_sale) {
		$sale_from = $product->get_date_on_sale_from();
		$sale_to   = $product->get_date_on_sale_to();
		$sale_from = $sale_from ? $sale_from->getTimestamp() : null;
		$sale_to   = $sale_to ? $sale_to->getTimestamp() : null;
	}

	// Availability mapping
	$availability_map = [
		'instock'     => 'in stock',
		'outofstock'  => 'out of stock',
		'onbackorder' => 'backorder',
	];
	$availability = $availability_map[$product->get_stock_status()] ?? 'in stock';

	// Brand, GTIN, MPN detection
	$brand = madeit_get_product_brand($product, $parent_prod);
	$gtin  = madeit_get_product_gtin($product, $parent_prod);
	$mpn   = $product->get_sku() ?: null;

	// Product type from categories
	$product_type = madeit_product_type_breadcrumb($is_variation && $parent_prod ? $parent_prod->get_id() : $product->get_id());

	// Optional Google product category (free text or ID). Site can provide via meta or filter.
	$gpc = get_post_meta($product->get_id(), '_google_product_category', true);
	if (!$gpc && $parent_prod) {
		$gpc = get_post_meta($parent_prod->get_id(), '_google_product_category', true);
	}

	$item = [
		'id'                      => (string) $id,
		'title'                   => $title,
		'description'             => $desc,
		'link'                    => $link,
		'image_link'              => $image_link,
		'additional_image_links'  => $gallery,
		'availability'            => $availability,
		'price'                   => $on_sale && $regular > 0 ? $regular : $price,
		'sale_price'              => $on_sale ? $sale_price : null,
		'sale_from'               => $sale_from,
		'sale_to'                 => $sale_to,
		'brand'                   => $brand,
		'gtin'                    => $gtin,
		'mpn'                     => $mpn,
		'google_product_category' => $gpc ?: null,
		'product_type'            => $product_type ?: null,
		'item_group_id'           => $is_variation && $parent_prod ? ( $parent_prod->get_sku() ?: (string) $parent_prod->get_id() ) : null,
		'identifier_exists'       => ($gtin || $brand || $mpn) ? true : false,
	];

	return apply_filters('madeit_google_merchant_item', $item, $product, $parent_prod);
}

function madeit_get_product_brand($product, $parent = null): ?string
{
	// Try attribute taxonomies commonly used for brand
	$try_tax = ['pa_brand', 'brand'];
	$prod = $product;

	foreach ([$prod, $parent] as $p) {
		if (!$p) continue;
		foreach ($try_tax as $tax) {
			$terms = get_the_terms($p->get_id(), $tax);
			if (!empty($terms) && !is_wp_error($terms)) {
				return $terms[0]->name;
			}
		}
	}

	// Fallback: meta fields sometimes used
	$meta_keys = ['_brand', 'brand'];
	foreach ([$prod, $parent] as $p) {
		if (!$p) continue;
		foreach ($meta_keys as $key) {
			$v = get_post_meta($p->get_id(), $key, true);
			if ($v) return (string) $v;
		}
	}

	return null;
}

function madeit_get_product_gtin($product, $parent = null): ?string
{
	// Common meta keys used by GTIN/EAN/UPC plugins
	$keys = ['_gtin', '_ean', '_barcode', '_upc', '_isbn', '_wc_gpf_gtin', 'gtin', 'ean'];

	foreach ([$product, $parent] as $p) {
		if (!$p) continue;
		foreach ($keys as $k) {
			$v = get_post_meta($p->get_id(), $k, true);
			if ($v) return (string) $v;
		}
	}

	return null;
}

function madeit_product_type_breadcrumb(int $product_id): ?string
{
	$terms = get_the_terms($product_id, 'product_cat');
	if (empty($terms) || is_wp_error($terms)) {
		return null;
	}

	// Pick the first (or primary) category and build its path
	// If Yoast primary category exists, prefer it
	$primary_id = null;
	if (class_exists('WPSEO_Primary_Term')) {
		$wpseo_primary_term = new WPSEO_Primary_Term('product_cat', $product_id);
		$primary_id = (int) $wpseo_primary_term->get_primary_term();
	}

	$term = null;
	if ($primary_id) {
		foreach ($terms as $t) {
			if ((int) $t->term_id === $primary_id) {
				$term = $t; break;
			}
		}
	}
	if (!$term) {
		$term = $terms[0];
	}

	$names = [];
	while ($term && !is_wp_error($term)) {
		array_unshift($names, $term->name);
		if (!$term->parent) break;
		$term = get_term($term->parent, 'product_cat');
		if (!$term || is_wp_error($term)) break;
	}

	return $names ? implode(' > ', $names) : null;
}

// Helper: wrap value in CDATA safely
function madeit_xml_cdata(string $value): string
{
	// Avoid ending CDATA in content
	$value = str_replace(']]>', ']]]]><![CDATA[>', $value);
	return '<![CDATA[' . $value . ']]>';
}

// Helper: ISO-8601 with timezone offset and colon (e.g., 2026-05-07T16:00+02:00)
function madeit_iso8601_with_tz(int $ts): string
{
	// Use site timezone setting
	$dt = new DateTime('@' . $ts);
	$tz_string = get_option('timezone_string');
	if ($tz_string) {
		$dt->setTimezone(new DateTimeZone($tz_string));
	} else {
		$offset = (float) get_option('gmt_offset');
		$hours = (int) $offset;
		$mins  = (abs($offset - $hours)) * 60;
		$sign  = $offset < 0 ? '-' : '+';
		$dt->setTimezone(new DateTimeZone(sprintf('%s%02d:%02d', $sign, abs($hours), abs($mins))));
	}
	return $dt->format('Y-m-d\TH:iP');
}

// WP-CLI command: wp google-merchant generate [--filename=<name>]
if (defined('WP_CLI') && WP_CLI) {
	class MadeIT_Google_Merchant_CLI {
		/**
		 * Generate Google Merchant XML and save it into uploads.
		 *
		 * ## OPTIONS
		 *
		 * [--filename=<name>]
		 * : Target filename under uploads. Default: google-merchant.xml
		 *
		 * ## EXAMPLES
		 *
		 *     wp google-merchant generate
		 *     wp google-merchant generate --filename=merchant-feed.xml
		 */
		public function generate($args, $assoc_args)
		{
			if (!function_exists('wc_get_products')) {
				WP_CLI::error('WooCommerce is required to generate this feed.');
				return;
			}

			$uploads = wp_upload_dir();
			if (!empty($uploads['error'])) {
				WP_CLI::error('Upload dir error: ' . $uploads['error']);
				return;
			}

			$filename = isset($assoc_args['filename']) && $assoc_args['filename'] ? basename($assoc_args['filename']) : 'google-merchant.xml';
			$target   = trailingslashit($uploads['basedir']) . $filename;

			// Ensure uploads dir exists
			if (!file_exists($uploads['basedir'])) {
				if (!wp_mkdir_p($uploads['basedir'])) {
					WP_CLI::error('Cannot create uploads directory.');
					return;
				}
			}

			// Build items first to know total for progress
			$items = madeit_google_merchant_products();
			$currency = function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : get_option('woocommerce_currency', 'EUR');

			// Open file for streaming write
			$fh = @fopen($target, 'wb');
			if (!$fh) {
				WP_CLI::error('Failed to open file for writing: ' . $target);
				return;
			}

			// Header
			fwrite($fh, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
			fwrite($fh, '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">' . "\n");
			fwrite($fh, "  <channel>\n");
			$site_title = get_bloginfo('name');
			$site_link  = home_url('/');
			$site_desc  = trim((string) get_bloginfo('description'));
			fwrite($fh, '    <title>' . madeit_xml_cdata($site_title . ' - Product Feed') . "</title>\n");
			fwrite($fh, '    <link>' . esc_url($site_link) . "</link>\n");
			fwrite($fh, '    <description>' . madeit_xml_cdata($site_desc !== '' ? $site_desc : $site_title . ' product feed') . "</description>\n");

			// Progress bar for items
			$total = count($items);
			$progress = \WP_CLI\Utils\make_progress_bar('Generating Google Merchant XML', $total);
			$bytes = 0;
			foreach ($items as $it) {
				$chunk = madeit_render_google_item_xml($it, $currency);
				$bytes += fwrite($fh, $chunk . "\n");
				$progress->tick();
			}
			$progress->finish();

			// Footer
			fwrite($fh, "  </channel>\n");
			fwrite($fh, "</rss>\n");
			fclose($fh);

			$url = trailingslashit($uploads['baseurl']) . $filename;
			WP_CLI::success(sprintf('Feed generated: %s (~%d bytes) -> %s', $target, $bytes, $url));
		}
	}

	WP_CLI::add_command('google-merchant', 'MadeIT_Google_Merchant_CLI');
}

/**
 * Write the Google Merchant XML to uploads. Returns array with file info or WP_Error on failure.
 *
 * @param string $filename
 * @return array|WP_Error
 */
function madeit_google_merchant_write_file(string $filename = 'google-merchant.xml') {
	if (!function_exists('wc_get_products')) {
		return new WP_Error('no_woocommerce', 'WooCommerce is required to generate this feed.');
	}

	$uploads = wp_upload_dir();
	if (!empty($uploads['error'])) {
		return new WP_Error('upload_dir_error', $uploads['error']);
	}

	$filename = $filename ? basename($filename) : 'google-merchant.xml';
	$target   = trailingslashit($uploads['basedir']) . $filename;

	if (!file_exists($uploads['basedir'])) {
		if (!wp_mkdir_p($uploads['basedir'])) {
			return new WP_Error('mkdir_failed', 'Cannot create uploads directory.');
		}
	}

	$items    = madeit_google_merchant_products();
	$currency = function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : get_option('woocommerce_currency', 'EUR');

	$fh = @fopen($target, 'wb');
	if (!$fh) {
		return new WP_Error('open_failed', 'Failed to open file for writing: ' . $target);
	}

	fwrite($fh, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
	fwrite($fh, '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">' . "\n");
	fwrite($fh, "  <channel>\n");
	$site_title = get_bloginfo('name');
	$site_link  = home_url('/');
	$site_desc  = trim((string) get_bloginfo('description'));
	fwrite($fh, '    <title>' . madeit_xml_cdata($site_title . ' - Product Feed') . "</title>\n");
	fwrite($fh, '    <link>' . esc_url($site_link) . "</link>\n");
	fwrite($fh, '    <description>' . madeit_xml_cdata($site_desc !== '' ? $site_desc : $site_title . ' product feed') . "</description>\n");

	$bytes = 0;
	foreach ($items as $it) {
		$chunk = madeit_render_google_item_xml($it, $currency);
		$bytes += fwrite($fh, $chunk . "\n");
	}

	fwrite($fh, "  </channel>\n");
	fwrite($fh, "</rss>\n");
	fclose($fh);

	return [
		'file'  => $target,
		'url'   => trailingslashit($uploads['baseurl']) . $filename,
		'bytes' => $bytes,
		'count' => count($items),
	];
}

/**
 * Schedule a daily cron at ~22:00 server/site local time and hook the task.
 */
add_action('init', function () {
	if (!wp_next_scheduled('madeit_google_merchant_cron_generate')) {
		$ts = madeit_next_timestamp_at(22, 0, 0);
		// Fallback to now+60s if calc fails
		if (!$ts || $ts < time()) {
			$ts = time() + 60;
		}
		wp_schedule_event($ts, 'daily', 'madeit_google_merchant_cron_generate');
	}
});

/**
 * Cron callback: generate the feed into uploads nightly.
 */
add_action('madeit_google_merchant_cron_generate', function () {
	$res = madeit_google_merchant_write_file(apply_filters('madeit_google_merchant_filename', 'google-merchant.xml'));
	if (is_wp_error($res)) {
		error_log('[Google Merchant Feed] Cron generation failed: ' . $res->get_error_message());
		return;
	}
	do_action('madeit_google_merchant_generated', $res);
});

/**
 * Compute the next timestamp for today at H:i:s in the site timezone; if past, returns tomorrow.
 */
function madeit_next_timestamp_at(int $hour, int $minute = 0, int $second = 0): int
{
	$tz_string = get_option('timezone_string');
	if ($tz_string) {
		$tz = new DateTimeZone($tz_string);
	} else {
		$offset = (float) get_option('gmt_offset');
		$hours = (int) $offset;
		$mins  = (abs($offset - $hours)) * 60;
		$sign  = $offset < 0 ? '-' : '+';
		// Create a timezone like +02:00 or -05:30
		$tz = new DateTimeZone(sprintf('%s%02d:%02d', $sign, abs($hours), abs($mins)));
	}

	$now = new DateTime('now', $tz);
	$target = clone $now;
	$target->setTime($hour, $minute, $second);
	if ($target <= $now) {
		$target->modify('+1 day');
		$target->setTime($hour, $minute, $second);
	}
	return $target->getTimestamp();
}


<?php

if (!defined('ABSPATH')) {
    exit;
}

$attributes = isset($attributes) && is_array($attributes) ? $attributes : [];

$layout = isset($attributes['layout']) && is_string($attributes['layout']) ? $attributes['layout'] : 'standaard';

$slides_desktop = isset($attributes['slidesDesktop']) ? (float) $attributes['slidesDesktop'] : 3;
$slides_tablet = isset($attributes['slidesTablet']) ? (float) $attributes['slidesTablet'] : 2;
$slides_mobile = isset($attributes['slidesMobile']) ? (float) $attributes['slidesMobile'] : 1;

$show_arrows = !empty($attributes['showArrows']);
$pagination_type = isset($attributes['paginationType']) && is_string($attributes['paginationType']) ? $attributes['paginationType'] : 'bullets';
$pagination_enabled = $pagination_type !== 'none';

$transition_duration = isset($attributes['transitionDuration']) ? (int) $attributes['transitionDuration'] : 500;
$autoplay = !empty($attributes['autoplay']);
$autoplay_speed = isset($attributes['autoplaySpeed']) ? (int) $attributes['autoplaySpeed'] : 5000;
$loop = !empty($attributes['infiniteLoop']);
$pause_on_interaction = !empty($attributes['pauseOnInteraction']);

$text_color = isset($attributes['textColor']) && is_string($attributes['textColor']) ? $attributes['textColor'] : '';
$bg_color = isset($attributes['containerBackgroundColor']) && is_string($attributes['containerBackgroundColor']) ? $attributes['containerBackgroundColor'] : '';

$show_image = !empty($attributes['showImage']);
$image_width = isset($attributes['width']) && is_string($attributes['width']) ? $attributes['width'] : '';
$image_height = isset($attributes['height']) && is_string($attributes['height']) ? $attributes['height'] : '';
$object_fit = isset($attributes['objectFit']) && is_string($attributes['objectFit']) ? $attributes['objectFit'] : 'cover';

$br_lt = isset($attributes['borderRadius_leftTop']) && is_string($attributes['borderRadius_leftTop']) ? $attributes['borderRadius_leftTop'] : '';
$br_rt = isset($attributes['borderRadius_rightTop']) && is_string($attributes['borderRadius_rightTop']) ? $attributes['borderRadius_rightTop'] : '';
$br_rb = isset($attributes['borderRadius_rightBottom']) && is_string($attributes['borderRadius_rightBottom']) ? $attributes['borderRadius_rightBottom'] : '';
$br_lb = isset($attributes['borderRadius_leftBottom']) && is_string($attributes['borderRadius_leftBottom']) ? $attributes['borderRadius_leftBottom'] : '';

$arrow_size = isset($attributes['arrowSize']) && is_string($attributes['arrowSize']) ? $attributes['arrowSize'] : '';
$arrow_color = isset($attributes['arrowColor']) && is_string($attributes['arrowColor']) ? $attributes['arrowColor'] : '';
$pagination_size = isset($attributes['paginationSize']) && is_string($attributes['paginationSize']) ? $attributes['paginationSize'] : '';
$pagination_color = isset($attributes['paginationColor']) && is_string($attributes['paginationColor']) ? $attributes['paginationColor'] : '';

$category_ids = [];
if (!empty($attributes['categoryIds']) && is_array($attributes['categoryIds'])) {
    $category_ids = array_values(array_filter(array_map('intval', $attributes['categoryIds'])));
}

$tax_query = [];
if (!empty($category_ids)) {
    $tax_query[] = [
        'taxonomy' => 'review_category',
        'field' => 'term_id',
        'terms' => $category_ids,
    ];
}

$post_status = is_admin() ? 'any' : 'publish';

$query = new WP_Query([
    'post_type' => 'review',
    'post_status' => $post_status,
    'posts_per_page' => -1,
    'no_found_rows' => true,
    'ignore_sticky_posts' => true,
	'suppress_filters' => true,
    'tax_query' => $tax_query,
]);

$style_vars = [];
if ($text_color !== '') {
    $style_vars[] = '--madeit-review-text-color: ' . $text_color;
}
if ($bg_color !== '') {
    $style_vars[] = '--madeit-review-bg-color: ' . $bg_color;
}
if ($arrow_size !== '') {
    $style_vars[] = '--madeit-review-arrow-size: ' . $arrow_size;
}
if ($arrow_color !== '') {
    $style_vars[] = '--madeit-review-arrow-color: ' . $arrow_color;
}
if ($pagination_size !== '') {
    $style_vars[] = '--madeit-review-pagination-size: ' . $pagination_size;
}
if ($pagination_color !== '') {
    $style_vars[] = '--madeit-review-pagination-color: ' . $pagination_color;
}

$wrapper_style_attr = empty($style_vars) ? '' : ' style="' . esc_attr(implode('; ', $style_vars)) . '"';

$wrapper_classes = [
    'wp-block-madeit-reviews',
    'madeit-reviews',
    'review',
    'review-' . sanitize_title($layout),
];

ob_start();
?>
    <div
        class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>"
        data-slides-desktop="<?php echo esc_attr((string) $slides_desktop); ?>"
        data-slides-tablet="<?php echo esc_attr((string) $slides_tablet); ?>"
        data-slides-mobile="<?php echo esc_attr((string) $slides_mobile); ?>"
        data-autoplay="<?php echo $autoplay ? 'true' : 'false'; ?>"
        data-autoplay-speed="<?php echo esc_attr((string) $autoplay_speed); ?>"
        data-transition-duration="<?php echo esc_attr((string) $transition_duration); ?>"
        data-loop="<?php echo $loop ? 'true' : 'false'; ?>"
        data-navigation="<?php echo $show_arrows ? 'true' : 'false'; ?>"
        data-pagination="<?php echo $pagination_enabled ? 'true' : 'false'; ?>"
        data-pagination-type="<?php echo esc_attr($pagination_type); ?>"
        data-pause-on-interaction="<?php echo $pause_on_interaction ? 'true' : 'false'; ?>"
        <?php echo $wrapper_style_attr; ?>
    >
        <div class="swiper">
            <div class="swiper-wrapper">
                <?php
                if ($query->have_posts()) {
                    while ($query->have_posts()) {
                        $query->the_post();
                        $post_id = get_the_ID();

                        $field = static function ($name, $id) {
                            if (function_exists('get_field')) {
                                $value = get_field($name, $id);
                                if ($value !== null && $value !== false && $value !== '') {
                                    return $value;
                                }
                            }
                            return get_post_meta($id, $name, true);
                        };

                        $naam = trim((string) ($field('naam', $post_id) ?: get_the_title($post_id)));
                        if ($naam === '') {
                            $naam = (string) __('Anoniem', 'madeit-review');
                        }

                        $bedrijf = trim((string) $field('bedrijf', $post_id));
                        $titel = trim((string) $field('titel', $post_id));
                        $bericht = (string) $field('bericht', $post_id);
                        $rating_raw = $field('rating', $post_id);
                        $rating = (int) $rating_raw;
                        if ($rating < 0) {
                            $rating = 0;
                        }
                        if ($rating > 5) {
                            $rating = 5;
                        }

                        $avatar = $field('avatar', $post_id);
                        $avatar_url = '';
                        $avatar_alt = '';
                        if (is_array($avatar)) {
                            $avatar_url = isset($avatar['url']) ? (string) $avatar['url'] : '';
                            $avatar_alt = isset($avatar['alt']) ? (string) $avatar['alt'] : '';
                        } elseif (is_numeric($avatar)) {
                            $avatar_url = (string) wp_get_attachment_image_url((int) $avatar, 'thumbnail');
                        } elseif (is_string($avatar)) {
                            $avatar_url = $avatar;
                        }

                        $img_styles = [];
                        if ($image_width !== '') {
                            $img_styles[] = 'width:' . $image_width;
                        }
                        if ($image_height !== '') {
                            $img_styles[] = 'height:' . $image_height;
                        }
                        if ($object_fit !== '') {
                            $img_styles[] = 'object-fit:' . $object_fit;
                        }
                        $br_values = array_filter([
                            $br_lt,
                            $br_rt,
                            $br_rb,
                            $br_lb,
                        ], static function ($v) {
                            return is_string($v) && $v !== '';
                        });
                        if (!empty($br_values)) {
                            $img_styles[] = 'border-radius:' . implode(' ', [
                                $br_lt !== '' ? $br_lt : '0',
                                $br_rt !== '' ? $br_rt : '0',
                                $br_rb !== '' ? $br_rb : '0',
                                $br_lb !== '' ? $br_lb : '0',
                            ]);
                        }
                        ?>
                        <div class="swiper-slide">
                            <div class="madeit-review-card card" style="<?php echo esc_attr(($text_color !== '' ? 'color:' . $text_color . ';' : '') . ($bg_color !== '' ? 'background-color:' . $bg_color . ';' : '')); ?>">
                                <!-- import the right layout -->
                                <?php

                                    if ($layout === 'standaard') {
                                        // Import the /layouts/standaard.php file if it exists.
                                        $default_layout_file = __DIR__ . '/layouts/standaard.php';
                                        if (is_readable($default_layout_file)) {
                                            include $default_layout_file;
                                        } else {
                                            echo 'Kan layout niet vinden.';
                                        }
                                    } else {
                                        echo 'Ongeldige layout.';
                                    }
                                ?>
                            
                            </div>
                        </div>
                        <?php
                    }
                    wp_reset_postdata();
                }
                ?>
            </div>

            <?php if ($pagination_enabled) : ?>
                <div class="swiper-pagination"></div>
            <?php endif; ?>

            <?php if ($show_arrows) : ?>
                <div class="swiper-button-prev" aria-label="<?php echo esc_attr(__('Vorige', 'madeit-review')); ?>"></div>
                <div class="swiper-button-next" aria-label="<?php echo esc_attr(__('Volgende', 'madeit-review')); ?>"></div>
            <?php endif; ?>
        </div>

        <?php if (!$query->have_posts()) : ?>
            <p class="madeit-reviews__empty"><?php echo esc_html(__('Geen reviews gevonden.', 'madeit-review')); ?></p>
        <?php endif; ?>
    </div>

<?php

echo (string) ob_get_clean();

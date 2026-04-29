<?php
/**
 * Ducumentation for the customizer: https://developer.wordpress.org/reference/hooks/customize_register/
 * 
 */


//  ===============================
//  = Helpers                     =
//  ===============================

function madeit_get_navbar_option( $key, $default = null ) {
    $options = get_option( 'madeit_navbar_options', [] );
    return isset( $options[ $key ] ) ? $options[ $key ] : $default;
}

//  ===============================
//  = Sanitizers                  =
//  ===============================

function madeit_sanitize_breakpoint( $value ) {
    $allowed = [ 'none', 'sm', 'md', 'lg', 'xl', 'xxl', 'custom' ];
    return in_array( $value, $allowed, true ) ? $value : 'md';
}

function madeit_sanitize_alignment( $value ) {
    $allowed = [ 'left', 'center', 'end' ];
    return in_array( $value, $allowed, true ) ? $value : 'left';
}

function madeit_sanitize_checkbox( $value ) {
    return ! empty( $value ) ? 1 : 0;
}

function madeit_sanitize_number( $value ) {
    return absint( $value );
}

function madeit_sanitize_palette_slug( $value ) {
    if ( ! is_string( $value ) ) {
        return '';
    }

    $value = sanitize_text_field( $value );
    if ( '' === $value ) {
        return '';
    }

    return preg_match( '/^[a-z0-9_-]+$/', $value ) ? $value : '';
}

function madeit_sanitize_color_choice( $value ) {
    if ( ! is_string( $value ) ) {
        return '';
    }

    $value = trim( $value );
    if ( '' === $value ) {
        return '';
    }

    $hex = sanitize_hex_color( $value );
    if ( $hex ) {
        return $hex;
    }

    $value = sanitize_text_field( $value );
    return preg_match( '/^[a-z0-9_-]+$/', $value ) ? $value : '';
}

//  ===============================
//  = Shared Data                 =
//  ===============================

function madeit_mobile_breakpoint_choices() {
    return [
        'none'   => 'Altijd ingeklapt',
        'sm'     => 'Grote smartphone',
        'md'     => 'Tablet',
        'lg'     => 'Tablet liggend / kleine laptop',
        'xl'     => 'Laptop / desktop',
        'xxl'    => 'Brede desktop',
        'custom' => 'Aangepaste waarde',
    ];
}

function madeit_mobile_breakpoint_tooltip() {
    return '
        <p>Kies het schermformaat waarbij het menu verandert in het mobiele menu.</p>
        <table>
            <tr><th>Optie</th><th>Beschrijving</th></tr>
            <tr><td>Altijd ingeklapt</td><td>Hamburgermenu altijd actief</td></tr>
            <tr><td>Grote smartphone</td><td>Vanaf grotere smartphones</td></tr>
            <tr><td>Tablet</td><td>Vanaf tablets</td></tr>
            <tr><td>Tablet liggend / kleine laptop</td><td>Bredere tablets en kleine laptops</td></tr>
            <tr><td>Laptop / desktop</td><td>Standaard desktops</td></tr>
            <tr><td>Brede desktop</td><td>Grote schermen</td></tr>
        </table>
    ';
}

function madeit_text_align_choices() {
    return [
        'left'   => 'Links',
        'center' => 'Midden',
        'end'  => 'Rechts',
    ];
}

//  ===============================
//  = Custom Controls             =
//  ===============================

if ( class_exists( 'WP_Customize_Control' ) ) {

    // Custom select control toevoegen met tooltip
    class My_Custom_Select_Control extends WP_Customize_Control {
        public $type = 'custom_select';
        public $tooltip = '';

        public function render_content() {
            static $style_printed = false;

            if ( ! $style_printed ) {
                ?>
                <style>
                    .my-custom-select-control {
                        position: relative;
                    }

                    .my-custom-select-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 8px;
                        margin-bottom: 6px;
                    }

                    .my-custom-tooltip-trigger {
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: #2271b1;
                        color: #fff;
                        border: none;
                        cursor: pointer;
                        font-size: 12px;
                        line-height: 20px;
                        text-align: center;
                        padding: 0;
                    }

                    .my-custom-tooltip-content {
                        display: none;
                        position: fixed;
                        bottom: 150px;
                        left: 260px;
                        width: 360px;
                        background: #fff;
                        border: 1px solid #ccd0d4;
                        border-radius: 8px;
                        padding: 12px;
                        box-shadow: 0 8px 24px rgba(0,0,0,.12);
                        z-index: 9999;
                    }

                    .my-custom-tooltip-content.active {
                        display: block;
                    }

                    .my-custom-tooltip-content table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        font-size: 12px;
                    }

                    .my-custom-tooltip-content th,
                    .my-custom-tooltip-content td {
                        border: 1px solid #ddd;
                        padding: 6px;
                        text-align: left;
                        vertical-align: top;
                    }

                    .my-custom-tooltip-content th {
                        background: #f6f7f7;
                    }

                    .my-custom-tooltip-content p {
                        margin: 0 0 8px;
                        font-size: 12px;
                    }
                </style>

                <script>
                    document.addEventListener('click', function(e) {
                        const trigger = e.target.closest('.my-custom-tooltip-trigger');
                        
                        document.querySelectorAll('.my-custom-tooltip-content').forEach(el => {
                            if (!el.contains(e.target) && e.target !== trigger) {
                                el.classList.remove('active');
                            }
                        });

                        if (trigger) {
                            const tooltip = trigger.parentNode.parentNode.querySelector('.my-custom-tooltip-content');
                            if (tooltip) {
                                tooltip.classList.toggle('active');
                            }
                        }
                    });
                </script>
                <?php
                $style_printed = true;
            }
            ?>

            <div class="my-custom-select-control">
                <div class="my-custom-select-header">
                    <span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>

                    <?php if ( ! empty( $this->tooltip ) ) : ?>
                        <button type="button" class="my-custom-tooltip-trigger">i</button>
                    <?php endif; ?>
                </div>

                <?php if ( ! empty( $this->tooltip ) ) : ?>
                    <div class="my-custom-tooltip-content">
                        <?php echo wp_kses_post( $this->tooltip ); ?>
                    </div>
                <?php endif; ?>

                <select <?php $this->link(); ?>>
                    <?php foreach ( $this->choices as $value => $label ) : ?>
                        <option value="<?php echo esc_attr( $value ); ?>" <?php selected( $this->value(), $value ); ?>>
                            <?php echo esc_html( $label ); ?>
                        </option>
                    <?php endforeach; ?>
                </select>

                <?php if ( ! empty( $this->description ) ) : ?>
                    <p class="description customize-control-description">
                        <?php echo esc_html( $this->description ); ?>
                    </p>
                <?php endif; ?>
            </div>
            <?php
        }
    }

    // Custom title control toevoegen
    class My_Custom_Title_Control extends WP_Customize_Control {
        public $hr = true;
        public $type = 'custom_title';
        public $description = '';

        public function render_content() {
            ?>
            <?php if ( $this->hr ) : ?>
                <hr style="border: none; border-top: 1px solid #bcbcbc; margin: 20px 0 0 0;">
            <?php endif; ?>
            <h2><?php echo esc_html( $this->label ); ?></h2>
            <?php if ( ! empty( $this->description ) ) : ?>
                <p><?php echo esc_html( $this->description ); ?></p>
            <?php endif; ?>
            <?php
        }
    }

    // slider control toevoegen
    class My_Custom_Slider_Control extends WP_Customize_Control {
        public $type = 'slider';
        public function render_content() {
            ?>
            <label style="display: flex; flex-direction: row; column-gap: 10px; flex-wrap: wrap;">
                <span class="customize-control-title" style="width: 100%;"><?php echo esc_html( $this->label ); ?></span>
                <input style="width: 76%;" type="range" value="<?php echo esc_attr( $this->value() ); ?>" <?php $this->link(); ?> min="<?php echo esc_attr( $this->input_attrs['min'] ); ?>" max="<?php echo esc_attr( $this->input_attrs['max'] ); ?>" step="<?php echo esc_attr( $this->input_attrs['step'] ); ?>">
                <input style="width: 20%;" type="number" value="<?php echo esc_attr( $this->value() ); ?>" <?php $this->link(); ?> min="<?php echo esc_attr( $this->input_attrs['min'] ); ?>" max="<?php echo esc_attr( $this->input_attrs['max'] ); ?>" step="<?php echo esc_attr( $this->input_attrs['step'] ); ?>">
            </label>
            <?php
        }
    }

    // toggle control toevoegen
    class My_Custom_Toggle_Control extends WP_Customize_Control {
        public $type = 'toggle';
        public function render_content() {
            static $style_printed = false;
            if ( ! $style_printed ) {
                ?>
                <style>
                    .custom-toggle input[type=checkbox]{
                        height: 0;
                        width: 0;
                        visibility: hidden;
                    }

                    .custom-toggle label {
                        cursor: pointer;
                        text-indent: -9999px;
                        width: 30px;
                        height: 15px;
                        background: grey;
                        display: block;
                        border-radius: 100px;
                        position: relative;
                    }

                    .custom-toggle label:after {
                        content: '';
                        position: absolute;
                        top: 4px;
                        left: 5px;
                        width: 7px;
                        height: 7px;
                        background: #fff;
                        border-radius: 20px;
                        transition: 0.3s;
                    }

                    .custom-toggle input:checked + label {
                        background: #bada55;
                    }

                    .custom-toggle input:checked + label:after {
                        left: calc(100% - 5px);
                        transform: translateX(-100%);
                    }

                    .custom-toggle label:active:after {
                        width: 30px;
                    }
                </style>
                <?php
                $style_printed = true;
            }
            ?>
            <div class="custom-toggle" style="display: flex; flex-direction: row; column-gap: 10px; align-items: center;">
                <input type="checkbox" id="<?php echo esc_attr( $this->id ); ?>" <?php $this->link(); ?> style="width: 20px; height: 20px; margin: 0; display: none;" value="1" <?php checked( $this->value() ); ?>>
                <label for="<?php echo esc_attr( $this->id ); ?>" style="margin: 0;"></label>
                <span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
            </div>
            <?php
        }
    }

    // color control met color palette (voor kleuren die in de customizer staan ingesteld) inclusief gradients
    class My_Custom_Color_Control extends WP_Customize_Control {
        public $type = 'custom_color';

        // Get the palette from theme supports (editor presets) so this control
        // doesn't rely on non-existing helper functions.
        private function get_color_palette() {
            $palette = [
                'colors'    => [],
                'gradients' => [],
            ];

            $colors_support = get_theme_support( 'editor-color-palette' );
            $colors         = ( is_array( $colors_support ) && isset( $colors_support[0] ) && is_array( $colors_support[0] ) )
                ? $colors_support[0]
                : [];

            if ( is_array( $colors ) ) {
                foreach ( $colors as $color ) {
                    if ( ! is_array( $color ) || empty( $color['slug'] ) ) {
                        continue;
                    }

                    $slug  = (string) $color['slug'];
                    $name  = isset( $color['name'] ) ? (string) $color['name'] : $slug;
                    $value = ( isset( $color['color'] ) && is_string( $color['color'] ) ) ? $color['color'] : '';

                    $palette['colors'][] = [
                        'slug'  => $slug,
                        'name'  => $name,
                        'color' => $value,
                    ];
                }
            }

            $gradients_support = get_theme_support( 'editor-gradient-presets' );
            $gradients         = ( is_array( $gradients_support ) && isset( $gradients_support[0] ) && is_array( $gradients_support[0] ) )
                ? $gradients_support[0]
                : [];

            // Fallback if theme support isn't set yet for some reason.
            if ( empty( $gradients ) && function_exists( 'madeit_generate_gradients_colors' ) ) {
                $gradients = madeit_generate_gradients_colors();
            }

            if ( is_array( $gradients ) ) {
                foreach ( $gradients as $gradient ) {
                    if ( ! is_array( $gradient ) || empty( $gradient['slug'] ) ) {
                        continue;
                    }

                    $slug  = (string) $gradient['slug'];
                    $name  = isset( $gradient['name'] ) ? (string) $gradient['name'] : $slug;
                    $value = ( isset( $gradient['gradient'] ) && is_string( $gradient['gradient'] ) ) ? $gradient['gradient'] : '';

                    $palette['gradients'][] = [
                        'slug'     => $slug,
                        'name'     => $name,
                        'gradient' => $value,
                    ];
                }
            }

            return $palette;
        }

        public function render_content() {
            static $assets_printed = false;

            if ( ! $assets_printed ) {
                ?>
                <style>
                    .madeit-custom-color-control__tabs {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 6px;
                        margin-top: 10px;
                        margin-bottom: 10px;
                    }

                    .madeit-custom-color-control__tab {
                        border: 1px solid #ccd0d4;
                        background: #fff;
                        border-radius: 4px;
                        padding: 6px 10px;
                        cursor: pointer;
                        font-size: 12px;
                    }

                    .madeit-custom-color-control__tab.is-active {
                        background: rgb(64, 87, 107);
                        color: #fff;
                    }

                    .madeit-custom-color-control__panel {
                        display: none;
                        margin-top: 6px;
                    }

                    .madeit-custom-color-control__panel.is-active {
                        display: block;
                    }

                    .madeit-custom-color-control__swatches {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                    }

                    .madeit-custom-color-control__swatch {
                        width: 26px;
                        height: 26px;
                        border-radius: 999px;
                        border: 1px solid #ccd0d4;
                        cursor: pointer;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    .madeit-custom-color-control__swatch.is-active {
                        outline: 2px solid #2271b1;
                        outline-offset: 1px;
                    }
                </style>

                <script>
                    (function() {
                        function closest(el, selector) {
                            while (el && el.nodeType === 1) {
                                if (el.matches(selector)) return el;
                                el = el.parentElement;
                            }
                            return null;
                        }

                        function setValue(container, value) {
                            var input = container.querySelector('.madeit-custom-color-control__value');
                            if (!input) return;
                            input.value = value;
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }

                        function setActiveTab(container, tab) {
                            container.querySelectorAll('.madeit-custom-color-control__tab').forEach(function(btn) {
                                btn.classList.toggle('is-active', btn.getAttribute('data-tab') === tab);
                            });
                            container.querySelectorAll('.madeit-custom-color-control__panel').forEach(function(panel) {
                                panel.classList.toggle('is-active', panel.getAttribute('data-tab') === tab);
                            });
                        }

                        function setActiveSwatch(container, value) {
                            container.querySelectorAll('.madeit-custom-color-control__swatch').forEach(function(btn) {
                                btn.classList.toggle('is-active', btn.getAttribute('data-value') === value);
                            });
                        }

                        document.addEventListener('click', function(e) {
                            var tabBtn = e.target.closest('.madeit-custom-color-control__tab');
                            if (tabBtn) {
                                var container = closest(tabBtn, '.madeit-custom-color-control');
                                if (!container) return;
                                setActiveTab(container, tabBtn.getAttribute('data-tab'));
                                return;
                            }

                            var swatch = e.target.closest('.madeit-custom-color-control__swatch');
                            if (swatch) {
                                var container = closest(swatch, '.madeit-custom-color-control');
                                if (!container) return;
                                var v = swatch.getAttribute('data-value') || '';
                                setValue(container, v);
                                setActiveSwatch(container, v);
                                return;
                            }
                        });

                        document.addEventListener('input', function(e) {
                            if (!e.target.classList.contains('madeit-custom-color-control__custom')) return;
                            var container = closest(e.target, '.madeit-custom-color-control');
                            if (!container) return;
                            var v = e.target.value || '';
                            setValue(container, v);
                            setActiveSwatch(container, v);
                        });
                    })();
                </script>
                <?php
                $assets_printed = true;
            }

            $palette       = $this->get_color_palette();
            $current_value = (string) $this->value();
            $current_hex   = sanitize_hex_color( $current_value );

            $color_slugs = array_map(
                static function( $c ) {
                    return isset( $c['slug'] ) ? (string) $c['slug'] : '';
                },
                is_array( $palette['colors'] ?? null ) ? $palette['colors'] : []
            );
            $gradient_slugs = array_map(
                static function( $g ) {
                    return isset( $g['slug'] ) ? (string) $g['slug'] : '';
                },
                is_array( $palette['gradients'] ?? null ) ? $palette['gradients'] : []
            );

            $active_tab = 'color';
            if ( $current_hex ) {
                $active_tab = 'custom';
            } elseif ( in_array( $current_value, $gradient_slugs, true ) ) {
                $active_tab = 'gradient';
            }

            $custom_value = $current_hex ? $current_hex : '#000000';
            ?>
            <label class="madeit-custom-color-control">
                <span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>

                <input type="hidden" class="madeit-custom-color-control__value" <?php $this->link(); ?> value="<?php echo esc_attr( $current_value ); ?>">

                <div class="madeit-custom-color-control__tabs" role="tablist">
                    <button type="button" class="madeit-custom-color-control__tab <?php echo 'color' === $active_tab ? 'is-active' : ''; ?>" data-tab="color">Kleur</button>
                    <button type="button" class="madeit-custom-color-control__tab <?php echo 'gradient' === $active_tab ? 'is-active' : ''; ?>" data-tab="gradient">Gradient</button>
                    <button type="button" class="madeit-custom-color-control__tab <?php echo 'custom' === $active_tab ? 'is-active' : ''; ?>" data-tab="custom">Custom</button>
                </div>

                <div class="madeit-custom-color-control__panel <?php echo 'color' === $active_tab ? 'is-active' : ''; ?>" data-tab="color">
                    <div class="madeit-custom-color-control__swatches">
                        <?php foreach ( (array) ( $palette['colors'] ?? [] ) as $color ) : ?>
                            <?php
                            $slug  = isset( $color['slug'] ) ? (string) $color['slug'] : '';
                            $name  = isset( $color['name'] ) ? (string) $color['name'] : $slug;
                            $value = isset( $color['color'] ) ? (string) $color['color'] : '';
                            if ( '' === $slug ) {
                                continue;
                            }
                            ?>
                            <button
                                type="button"
                                class="madeit-custom-color-control__swatch <?php echo $current_value === $slug ? 'is-active' : ''; ?>"
                                data-value="<?php echo esc_attr( $slug ); ?>"
                                title="<?php echo esc_attr( $name ); ?>"
                                style="background-color: <?php echo esc_attr( $value ); ?>;">
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="madeit-custom-color-control__panel <?php echo 'gradient' === $active_tab ? 'is-active' : ''; ?>" data-tab="gradient">
                    <div class="madeit-custom-color-control__swatches">
                        <?php foreach ( (array) ( $palette['gradients'] ?? [] ) as $gradient ) : ?>
                            <?php
                            $slug  = isset( $gradient['slug'] ) ? (string) $gradient['slug'] : '';
                            $name  = isset( $gradient['name'] ) ? (string) $gradient['name'] : $slug;
                            $value = isset( $gradient['gradient'] ) ? (string) $gradient['gradient'] : '';
                            if ( '' === $slug ) {
                                continue;
                            }
                            ?>
                            <button
                                type="button"
                                class="madeit-custom-color-control__swatch <?php echo $current_value === $slug ? 'is-active' : ''; ?>"
                                data-value="<?php echo esc_attr( $slug ); ?>"
                                title="<?php echo esc_attr( $name ); ?>"
                                style="background: <?php echo esc_attr( $value ); ?>;">
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="madeit-custom-color-control__panel <?php echo 'custom' === $active_tab ? 'is-active' : ''; ?>" data-tab="custom">
                    <input type="color" class="madeit-custom-color-control__custom" value="<?php echo esc_attr( $custom_value ); ?>">
                </div>
            </label>
            <?php

            if ( ! empty( $this->description ) ) : ?>
                <p class="description customize-control-description">
                    <?php echo esc_html( $this->description ); ?>
                </p>
            <?php endif;
        }
    }

}



// ===============================
// = Customizer Sections         =
// ===============================
function theme_navbar_customizer($wp_customize){

    //adding section in wordpress customizer
    $wp_customize->add_section('navbar_settings_section', array(
        'title' => 'Header',
        'priority' => 90,
    ));

    // ================================
    // = Algemeen                     =
    // ================================
    $wp_customize->add_setting( 'general_settings', array(
        'sanitize_callback' => 'wp_kses_post',
    ));
    $wp_customize->add_control( new My_Custom_Title_Control( $wp_customize, 'my_custom_title_general', array(
        'hr'            => false,
        'label'       => __( 'Algemeen', 'mytheme' ),
        'section'     => 'navbar_settings_section',
        'settings'    => 'general_settings',
        'priority'    => 1,
    )));

    // Achtergrondkleur menu
    $wp_customize->add_setting('madeit_navbar_options[background_color]', array(
        'default'           => '#ffffff',
        'capability'        => 'edit_theme_options',
        'type'              => 'option',
        'sanitize_callback' => 'madeit_sanitize_color_choice',
    ));

    $wp_customize->add_control( new My_Custom_Color_Control( $wp_customize, 'background_color_control', array(
        'label'    => 'Achtergrondkleur menu',
        'section'  => 'navbar_settings_section',
        'settings' => 'madeit_navbar_options[background_color]',
        'priority' => 3,
    )));


    // achtergrondkleur bottom menu (als ingesteld)
    if (HEADER_UPPER_BOTTOM) {
        $wp_customize->add_setting('madeit_navbar_options[background_color_bottom]', array(
            'default'           => '#ffffff',
            'capability'        => 'edit_theme_options',
            'type'              => 'option',
            'sanitize_callback' => 'madeit_sanitize_color_choice',
        ));

        $wp_customize->add_control( new My_Custom_Color_Control( $wp_customize, 'background_color_bottom_control', array(
            'label'    => 'Achtergrondkleur onderste menu',
            'section'  => 'navbar_settings_section',
            'settings' => 'madeit_navbar_options[background_color_bottom]',
            'priority' => 4,
        )));
    }

    // achtergrondkleur top menu (als ingesteld)
    if (HEADER_UPPER_TOP) {
        $wp_customize->add_setting('madeit_navbar_options[background_color_top]', array(
            'default'           => '#ffffff',
            'capability'        => 'edit_theme_options',
            'type'              => 'option',
            'sanitize_callback' => 'madeit_sanitize_color_choice',
        ));

        $wp_customize->add_control( new My_Custom_Color_Control( $wp_customize, 'background_color_top_control', array(
            'label'    => 'Achtergrondkleur bovenste menu',
            'section'  => 'navbar_settings_section',
            'settings' => 'madeit_navbar_options[background_color_top]',
            'priority' => 4,
        )));

        $wp_customize->add_setting('madeit_navbar_options[text_align]', array(
            'default'           => 'left',
            'capability'        => 'edit_theme_options',
            'type'              => 'option',
            'sanitize_callback' => 'madeit_sanitize_alignment',
        ));
        $wp_customize->add_control( new My_Custom_Select_Control( $wp_customize, 'text_align_control', array(
            'label'    => 'Tekst uitlijning bovenste menu',
            'section'  => 'navbar_settings_section',
            'settings' => 'madeit_navbar_options[text_align]',
            'choices'  => madeit_text_align_choices(),
            'priority' => 5,
        )));
    }




    //  ===============================
    //  = Logo                        =
    //  ===============================
    $wp_customize->add_setting( 'my_custom_title_setting_logo', array(
        'sanitize_callback' => 'wp_kses_post',
    ));
    $wp_customize->add_control( new My_Custom_Title_Control( $wp_customize, 'my_custom_title_logo', array(
        'hr'            => true,
        'label'       => __( 'Logo', 'mytheme' ),
        'section'     => 'navbar_settings_section',
        'settings'    => 'my_custom_title_setting_logo',
        'priority'    => 5,
    )));

    // max breedte logo instellen
    $wp_customize->add_setting('madeit_navbar_options[logo_max_width]', array(
        'default'        => 150,
        'capability'     => 'edit_theme_options',
        'type'           => 'option',
        'sanitize_callback' => 'madeit_sanitize_number',
    ));

    $wp_customize->add_control( new My_Custom_Slider_Control( $wp_customize, 'logo_max_width_control', array(
        'settings' => 'madeit_navbar_options[logo_max_width]',
        'label'   => 'Logo max width (px)',
        'section' => 'navbar_settings_section',
        'transport' => 'postMessage',

        'type'        => 'slider',
        'input_attrs' => array(
            'min'     => 10,
            'max'     => 400,
            'step'    => 1,
        ),
        
        'priority'    => 7,
    )));


    //  ===============================
    //  = Mobile                      =
    //  ===============================
    $wp_customize->add_setting( 'mobile_sttings', array(
        'sanitize_callback' => 'wp_kses_post',
    ));
    $wp_customize->add_control( new My_Custom_Title_Control( $wp_customize, 'my_custom_title_menu', array(
        'hr'            => true,
        'label'       => __( 'Mobile', 'madeit' ),
        'section'     => 'navbar_settings_section',
        'settings'    => 'mobile_sttings',
        'priority'    => 9,
    )));

    // Breekpunt mobile menu
    $wp_customize->add_setting('madeit_navbar_options[mobile_menu_breakpoint]', array(
        'default'        => 'md',
        'capability'     => 'edit_theme_options',
        'type'           => 'option',
        'sanitize_callback' => 'madeit_sanitize_breakpoint',
    ));
    $wp_customize->add_control( new My_Custom_Select_Control( $wp_customize, 'mobile_menu_breakpoint_control', array(
        'label'   => 'Breekpunt mobile menu',
        'section' => 'navbar_settings_section',
        'settings' => 'madeit_navbar_options[mobile_menu_breakpoint]',
        'description' => 'Het schermformaat waarbij het menu verandert in het mobiele menu.',
        'tooltip' => madeit_mobile_breakpoint_tooltip(),
        'choices' => madeit_mobile_breakpoint_choices(),

        'priority'       => 10,
    )));

    // zoekveld tonen in mobile menu
    $wp_customize->add_setting('madeit_navbar_options[mobile_menu_search]', array(
        'default'           => 0,
        'capability'        => 'edit_theme_options',
        'type'              => 'option',
        'sanitize_callback' => 'madeit_sanitize_checkbox',
    ));

    $wp_customize->add_control( new My_Custom_Toggle_Control( $wp_customize, 'mobile_menu_search_control', array(
        'label'    => 'Zoekveld tonen in mobiel menu',
        'section'  => 'navbar_settings_section',
        'settings' => 'madeit_navbar_options[mobile_menu_search]',
        'priority' => 11,
    )));

    // CTA tonen in mobile menu
    $wp_customize->add_setting('madeit_navbar_options[mobile_menu_cta]', array(
        'default'           => 0,
        'capability'        => 'edit_theme_options',
        'type'              => 'option',
        'sanitize_callback' => 'madeit_sanitize_checkbox',
    ));

    $wp_customize->add_control( new My_Custom_Toggle_Control( $wp_customize, 'mobile_menu_cta_control', array(
        'label'    => 'CTA tonen in mobiel menu',
        'section'  => 'navbar_settings_section',
        'settings' => 'madeit_navbar_options[mobile_menu_cta]',
        'priority' => 12,
    )));
}
add_action('customize_register', 'theme_navbar_customizer');


//  ===============================
//  = Remove Default Sections     =
//  ===============================
function wpdocs_deregister_section( $wp_customize ) {
	$wp_customize->remove_section( 'colors' );
}
add_action( 'customize_register', 'wpdocs_deregister_section', 999 );
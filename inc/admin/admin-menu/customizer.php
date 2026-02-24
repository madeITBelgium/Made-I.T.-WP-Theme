<?php
/**
 * Ducumentation for the customizer: https://developer.wordpress.org/reference/hooks/customize_register/
 * 
 */

if ( class_exists( 'WP_Customize_Control' ) ) {
    class My_Custom_Title_Control extends WP_Customize_Control {
        public $type = 'custom_title';
        public $description = '';

        public function render_content() {
            ?>
            <h2><?php echo esc_html( $this->label ); ?></h2>
            <?php if ( ! empty( $this->description ) ) : ?>
                <p><?php echo esc_html( $this->description ); ?></p>
            <?php endif; ?>
            <?php
        }
    }
}

// slider control toevoegen
if ( class_exists( 'WP_Customize_Control' ) ) {
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
}

// toggle control toevoegen
if ( class_exists( 'WP_Customize_Control' ) ) {
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
                        width: 60px;
                        height: 30px;
                        background: grey;
                        display: block;
                        border-radius: 100px;
                        position: relative;
                    }

                    .custom-toggle label:after {
                        content: '';
                        position: absolute;
                        top: 5px;
                        left: 5px;
                        width: 20px;
                        height: 20px;
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
}

//! Customizer for footer section
function theme_footer_customizer($wp_customize){
    //adding section in wordpress customizer   
    $wp_customize->add_section('footer_settings_section', array(
        'title' => 'Footer Text Section',
        'priority' => 110,
    ));
    //adding setting for footer text area
    $wp_customize->add_setting('text_setting', array(
        'default' => 'Default Text For Footer Section',
        'type' => 'option',
    ));
    $wp_customize->add_control('text_setting', array(
        'label'   => 'Footer Text Here',
        'section' => 'footer_settings_section',
        'type'    => 'textarea',
    ));
        //adding setting for footer text color
    $wp_customize->add_setting('text_color_setting', array(
        'default'   => '#000000',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'text_color_setting', array(
        'label'   => 'Footer Text Color',
        'section' => 'footer_settings_section',
        'settings' => 'text_color_setting',
    )));
    //adding setting for footer background color
    $wp_customize->add_setting('background_color_setting', array(
        'default'   => '#ffffff',
        'transport' => 'refresh',
        'type' => 'option',
    ));
    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'background_color_setting', array(
        'label'   => 'Footer Background Color',
        'section' => 'footer_settings_section',
        'settings' => 'background_color_setting',   
    )));
}
add_action('customize_register', 'theme_footer_customizer');


//! Customizer for navbar section
function theme_navbar_customizer($wp_customize){
    //adding section in wordpress customizer
    $wp_customize->add_section('navbar_settings_section', array(
        'title' => 'Navbar Settings Section',
        'priority' => 120,
    ));

    //  ===============================
    //  = Algemeen                    =
    //  ===============================
    // Algemeen
    $wp_customize->add_setting( 'my_custom_title_setting', array(
        'sanitize_callback' => 'wp_kses_post',
    ));
    $wp_customize->add_control( new My_Custom_Title_Control( $wp_customize, 'my_custom_title', array(
        'label'       => __( 'Algemeen', 'mytheme' ),
        'section'     => 'navbar_settings_section',
        'settings'    => 'my_custom_title_setting',
        'priority'    => 1,
    )));

    // Header type (enkele preview van de verschillende opties)
    $option1 = get_parent_theme_file_uri('/assets/navbar-options/header-option1.svg');
    $option2 = get_parent_theme_file_uri('/assets/navbar-options/header-option2.svg');
    $option3 = get_parent_theme_file_uri('/assets/navbar-options/header-option3.svg');
    $option4 = get_parent_theme_file_uri('/assets/navbar-options/header-option4.svg');

    $wp_customize->add_setting('madeit_navbar_options[header_type]', array(
        'default'        => 'value1',
        'capability'     => 'edit_theme_options',
        'type'           => 'option',
    ));
    $wp_customize->add_control( 'header_type_control', array(
        'settings' => 'madeit_navbar_options[header_type]',
        'label'   => 'Header type',
        'section' => 'navbar_settings_section',
        'type'    => 'select',
        'priority'       => 2,
        'choices'    => array(
            'value1' => $option1,
            'value2' => $option2,
            'value3' => $option3,
            'value4' => $option4,
        ),
    ));

    // Volledige breedte?
    $wp_customize->add_setting('madeit_navbar_options[full_width]', array(
        'default'        => false,
        'capability'     => 'edit_theme_options',
        'type'           => 'option',
    ));
    $wp_customize->add_control( new My_Custom_Toggle_Control( $wp_customize, 'full_width_control', array(
        'settings' => 'madeit_navbar_options[full_width]',
        'label'   => 'Volledige breedte',
        'section' => 'navbar_settings_section',
        'type'    => 'toggle',
        'priority'       => 3,
    )));

    // Achtergrondkleur
    $wp_customize->add_setting('madeit_navbar_options[background_color]', array(
        'default'        => '#ffffff',
        'capability'     => 'edit_theme_options',
        'type'           => 'option',
    ));
    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'background_color_control', array(
        'label'   => 'Achtergrondkleur',
        'section' => 'navbar_settings_section',
        'settings' => 'madeit_navbar_options[background_color]',
        'priority'       => 4,
    )));



    //  ===============================
    //  = Logo                        =
    //  ===============================
    $wp_customize->add_setting( 'my_custom_title_setting_logo', array(
        'sanitize_callback' => 'wp_kses_post',
    ));
    $wp_customize->add_control( new My_Custom_Title_Control( $wp_customize, 'my_custom_title_logo', array(
        'label'       => __( 'Logo', 'mytheme' ),
        'section'     => 'navbar_settings_section',
        'settings'    => 'my_custom_title_setting_logo',
        'priority'    => 5,
    )));
    // Positie (links, gecentreerd, rechts)
    $wp_customize->add_setting('madeit_navbar_options[logo_position]', array(
        'default'        => 'value1',
        'capability'     => 'edit_theme_options',
        'type'           => 'option',
    ));
    $wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'logo_position_control', array(
        'settings' => 'madeit_navbar_options[logo_position]',
        'label'   => 'Logo positie',
        'section' => 'navbar_settings_section',
        'type'    => 'select',
        'choices'    => array(
            'value1' => 'Links',
            'value2' => 'Gecentreerd',
            'value3' => 'Rechts',
        ),
        'priority'       => 6,
    )));

    // max hoogte (een slider waarmee de maximale hoogte van het logo kan worden ingesteld)
    $wp_customize->add_setting('madeit_navbar_options[logo_max_height]', array(
        'default'        => 100,
        'capability'     => 'edit_theme_options',
        'type'           => 'option',
    ));
    $wp_customize->add_control( new My_Custom_Slider_Control( $wp_customize, 'logo_max_height_control', array(
        'settings' => 'madeit_navbar_options[logo_max_height]',
        'label'   => 'Logo max hoogte (px)',
        'section' => 'navbar_settings_section',

        'type'    => $slider,
        'input_attrs' => array(
            'min' => 10,
            'max' => 200,
            'step' => 1,
        ),
        
        'priority'       => 7,
    )));


    //  ===============================
    //  = Menu                        =
    //  ===============================
    $wp_customize->add_setting( 'my_custom_title_setting_menu', array(
        'sanitize_callback' => 'wp_kses_post', // Sanitize the content if needed
    ));
    $wp_customize->add_control( new My_Custom_Title_Control( $wp_customize, 'my_custom_title_menu', array(
        'label'       => __( 'Menu', 'mytheme' ),
        'section'     => 'navbar_settings_section',
        'settings'    => 'my_custom_title_setting_menu',
        'priority'    => 9,
    )));

    //? Eerst selecteren welk menu je wilt aanpassen? (een dropdown waarmee je het menu kunt selecteren dat je wilt aanpassen)

    // Positie (links, gecentreerd, rechts)

    // Link effect (Geen effect, Onderlijnen vanaf links, Onderlijnen opwaarts, Onderlijnen beneden, Haakjes, Bovenlijn vaste onderlijn, Circel eroverheen, Drie punten onderkant, X markeert de plek, Onderlijn bovenlijn, Verlichte achtergrond)

    // link effect kleur (een kleurkiezer waarmee de kleur van het link effect kan worden ingesteld)

    // Default menu items link kleur (een kleurkiezer waarmee de standaard kleur van de menu items kan worden ingesteld)

    // hover menu items link kleur (een kleurkiezer waarmee de hover kleur van de menu items kan worden ingesteld)

    // active menu items link kleur (een kleurkiezer waarmee de actieve kleur van de menu items kan worden ingesteld)


    // Dropdown menu

    // Dropdown icon (een optie om een icoon toe te voegen aan menu items die een dropdown hebben, met keuze uit verschillende iconen)

    // Dropdown icon color (een kleurkiezer waarmee de kleur van het dropdown icoon kan worden ingesteld)
    
    // Dropdown achtergrondkleur (een kleurkiezer waarmee de achtergrondkleur van het dropdown menu kan worden ingesteld) 

    // Dropdown border (Kiezen welke randen zichtbaar zijn: geen, alle, boven, onder, links, rechts)

    // Dropdown link kleur (een kleurkiezer waarmee de kleur van de links in het dropdown menu kan worden ingesteld)

    // Dropdown hover link kleur (een kleurkiezer waarmee de hover kleur van de links in het dropdown menu kan worden ingesteld)

    // Dropdown active link kleur (een kleurkiezer waarmee de actieve kleur van de links in het dropdown menu kan worden ingesteld)

    // Dropdown effect (Geen effect, Fade, Slide)


    // Searchbar in navbar (een toggle om een zoekbalk toe te voegen aan de navbar, met opties voor positie en stijl van de zoekbalk)




    //  ===============================
    //  = Select Box - Menu Animation =
    //  ===============================
    $wp_customize->add_setting('madeit_navbar_options[header_select]', array(
    'default'        => 'value1',
    'capability'     => 'edit_theme_options',
    'type'           => 'option',

    ));
    $wp_customize->add_control( 'example_select_box', array(
    'settings' => 'madeit_navbar_options[header_select]',
    'label'   => 'Menu animation',
    'section' => 'navbar_settings_section',
    'type'    => 'select',
    'choices'    => array(
        'value1' => 'Onderlijnd',
        'value2' => 'Vettig',
        'value3' => 'Normaal',

        'value4' => 'Custom',
    ),
    ));

    //adding setting for navbar background color
    $wp_customize->add_setting('navbar_background_color_setting', array(
        'default'   => '#ffffff',
        'transport' => 'refresh',
        'type' => 'option',
    ));
    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'navbar_background_color_setting', array(
        'label'   => 'Navbar Background Color',
        'section' => 'navbar_settings_section',
        'settings' => 'navbar_background_color_setting',
    )));
    //adding setting for navbar text color
    $wp_customize->add_setting('navbar_text_color_setting', array(
        'default'   => '#000000',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'navbar_text_color_setting', array(
        'label'   => 'Navbar Text Color',
        'section' => 'navbar_settings_section',
        'settings' => 'navbar_text_color_setting',
    )));
}
add_action('customize_register', 'theme_navbar_customizer');


//! Remove default customizer sections
function wpdocs_deregister_section( $wp_customize ) {

	$wp_customize->remove_section( 'colors' );
}
add_action( 'customize_register', 'wpdocs_deregister_section', 999 );
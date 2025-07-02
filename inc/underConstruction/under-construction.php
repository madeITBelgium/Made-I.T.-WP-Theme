<?php
// Save the settings
function under_construction_register_settings() {
    register_setting('under_construction_options_group', 'under_construction_mode');
    register_setting(
        'under_construction_options_group',
        'under_construction_user_roles',
        [
            'type' => 'array',
            'sanitize_callback' => function($input) {
                if (!is_array($input)) return [];
                return array_map('sanitize_text_field', $input);
            },
            'default' => ['administrator'],
        ]
    );

    // Register additional settings
    register_setting('under_construction_options_group', 'under_construction_end_time');
    register_setting('under_construction_options_group', 'under_construction_template');
    register_setting('under_construction_options_group', 'under_construction_title');
    register_setting('under_construction_options_group', 'under_construction_message');
    register_setting('under_construction_options_group', 'under_construction_background_image');
    register_setting('under_construction_options_group', 'under_construction_background_color');
    register_setting('under_construction_options_group', 'under_construction_text_color');
    register_setting('under_construction_options_group', 'under_construction_logo');
    register_setting('under_construction_options_group', 'under_construction_facebook');
    register_setting('under_construction_options_group', 'under_construction_twitter');
    register_setting('under_construction_options_group', 'under_construction_instagram');
    register_setting('under_construction_options_group', 'under_construction_linkedin');
    register_setting('under_construction_options_group', 'under_construction_topheading');
    register_setting('under_construction_options_group', 'under_construction_heading');
    register_setting('under_construction_options_group', 'under_construction_subheading');
    register_setting('under_construction_options_group', 'under_construction_description');
    register_setting('under_construction_options_group', 'under_construction_newsletter');
    
}
add_action('admin_init', 'under_construction_register_settings');

// Enqueue scripts and styles for the admin page
function under_construction_enqueue_media_uploader($hook) {
    if ($hook !== 'settings_page_under-construction') return;

    wp_enqueue_media();
    wp_enqueue_script('under-construction-media', get_template_directory_uri() . '/inc/underConstruction/media.js', ['jquery'], null, true);
}
add_action('admin_enqueue_scripts', 'under_construction_enqueue_media_uploader');


// create a item in the admin menu under the settings menu
function under_construction_menu() {
    add_options_page(
        'Under Construction',
        '<span><i class="dashicons dashicons-lock"></i>Under Construction</span>',
        'manage_options',
        'under-construction',
        'under_construction_page'
    );
}
add_action('admin_menu', 'under_construction_menu');

// create the page for the under construction settings
function under_construction_page() {
?>
<!-- import the style en js -->
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/inc/underConstruction/style.css">
<script src="<?php echo get_template_directory_uri(); ?>/inc/underConstruction/index.js"></script>


<div class="container d-flex"> 
    <div class="wrap" style="width: 70%;">
        <form method="post" action="options.php">
            <h1>Under Construction</h1>
            <!-- Tabs heading -->
            <h2 class="nav-tab-wrapper">
                <a href="#general" class="nav-tab nav-tab-active"><i class="dashicons dashicons-admin-generic"></i> General</a>
                <a href="#template" class="nav-tab"><i class="dashicons dashicons-admin-customizer"></i> Template</a>
                <a href="#content" class="nav-tab"><i class="dashicons dashicons-editor-textcolor"></i> Inhoud</a>
                <a href="#support" class="nav-tab bg-support"><i class="dashicons dashicons-sos"></i> Support</a>
            </h2>

            <!-- Tabs content -->
            <div class="tab-content">
                <!-- General settings -->
                <div id="general" class="tab-pane active">
                    <h2>Algemene Instellingen</h2>
                    <p>Pas uw instellingen voor de algemene instellingen van de onder constructie pagina aan.</p>
                    <div style="height: 20px;"></div>
                        <div class="d-flex align-items-center">
                            <table class="form-table">
                                <!-- Modus aan/uit -->
                                <tr>
                                    <th>Under construction modus</th>
                                    <td>
                                        <div class="switches-container">
                                            <input type="radio" id="switchOff" name="under_construction_mode" value="off" <?php checked(get_option('under_construction_mode'), 'off'); ?> />
                                            <input type="radio" id="switchOn" name="under_construction_mode" value="on" <?php checked(get_option('under_construction_mode'), 'on'); ?> />
                                            <label for="switchOff">Uit</label>
                                            <label for="switchOn">Aan</label>
                                            <div class="switch-wrapper">
                                                <div class="switch">
                                                    <div>Uit</div>
                                                    <div>Aan</div>
                                                </div>
                                            </div>
                                        </div>
                                        <p class="small">Door het inschakelen van de bouw modus gebruikers zullen niet in staat zijn om toegang tot de website inhoud. <br> Ze zien alleen de in aanbouw zijnde pagina. Uitzonderingen configureren op de witte lijst geplaatste gebruikersrollen.</p>
                                    </td>
                                </tr>
                                <!-- User roles who can see the page -->
                                <tr>
                                    <th>Wie kan deze pagina zien?</th>
                                    <td>
                                        <?php
                                        // get all the user roles
                                        $user_roles = wp_roles()->roles;
                                        ?>
                                        <div class="d-flex flex-wrap align-items-center" style="column-gap: 20px;">
                                            <?php
                                            $saved_roles = get_option('under_construction_user_roles', ['administrator']);

                                            foreach ($user_roles as $role => $details) : ?>
                                                <div class="group">
                                                    <input type="Checkbox" id="role-<?php echo esc_attr($role); ?>" name="under_construction_user_roles[]" value="<?php echo esc_attr($role); ?>" <?php $saved_roles = get_option('under_construction_user_roles', array('administrator')); checked(in_array($role, $saved_roles)); ?> />
                                                    <label for="role-<?php echo esc_attr($role); ?>"><?php echo esc_html($details['name']); ?></label>
                                                </div>
                                            <?php endforeach; ?>
                                        </div>
                                        <p class="small">Hier kunt u de gebruikersrollen configureren die toegang hebben tot de pagina. <br> Standaard hebben alleen beheerders toegang tot de pagina. <br></p>
                                    </td>
                                </tr>
                                <!-- Einddatum en -tijd -->
                                <tr>
                                    <th>Automatisch einddatum & -tijd</th>
                                    <td>
                                        <input type="datetime-local" name="under_construction_end_time" value="<?php echo esc_attr(get_option('under_construction_end_time', '')); ?>" />
                                        <p class="small">Stel een automatische einddatum en -tijd in voor de onder constructie modus. Laat leeg om deze functie uit te schakelen.</p>
                                    </td>

                                    <!-- If time is over set everything to zero -->
                                    <?php
                                    if (get_option('under_construction_end_time')) {
                                        $current_time = current_time('timestamp');
                                        $end_time = strtotime(get_option('under_construction_end_time'));
                                        if ($current_time > $end_time) {
                                            update_option('under_construction_mode', 'off');
                                            update_option('under_construction_end_time', '');
                                        }
                                    }
                                    ?>
                                </tr>

                            </table>
                        </div>

                        <?php
                        settings_fields('under_construction_options_group');
                        do_settings_sections('under-construction');
                        submit_button();
                        ?>
                    
                </div>
                <!-- Template settings -->
                <div id="template" class="tab-pane">
                    <h2>Ontwerpinstellingen</h2>
                    <p>Zoek uit een van onze templates, pas deze aan naar uw wensen in het inhoud-tabblad.</p>

                        <?php
                        settings_fields('under_construction_options_group');
                        ?>
                        <table class="form-table">
                            <tr valign="top">
                                <td>
                                    <div class="row">
                                        <?php
                                        $templates_uri = get_template_directory_uri() . '/inc/underConstruction/images/';
                                        $templates = array(
                                            'templ-1' => 'Template 1',
                                            'templ-2' => 'Template 2',
                                            'templ-3' => 'Template 3',
                                        );
                                        // Define the image extension
                                        $image_extension = '.png';
                                        
                                        foreach ($templates as $template => $name) {
                                            ?>
                                            <?php $input_id = 'under_construction_template_' . esc_attr($template); ?>
                                            <div class="col-4">
                                                <div class="template-item <?php echo esc_attr($template); ?>">
                                                    <div class="img-wrapper">
                                                        <img src="<?php echo esc_url($templates_uri . $template . $image_extension); ?>" alt="<?php echo esc_attr($name); ?>" class="img-fluid">
                                                    </div>
                                                    <h3 style="text-align: center;"><?php echo esc_html($name); ?></h3>
                                                    <input type="radio" name="under_construction_template" id="<?php echo $input_id; ?>" value="<?php echo esc_attr($template); ?>" <?php checked(get_option('under_construction_template', 'templ-1'), $template); ?>>
                                                    <label for="<?php echo $input_id; ?>"></label>
                                                </div>
                                            </div>
                                            <?php
                                        }
                                        ?>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <?php
                        settings_fields('under_construction_options_group');
                        do_settings_sections('under-construction');
                        submit_button();
                        ?>
                </div>
                <!-- Content settings -->
                <div id="content" class="tab-pane">
                    <h2>Inhoud Instellingen</h2>
                    <p>Hier kunt u de inhoud van de onder constructie pagina aanpassen.</p>
                    <?php
                    settings_fields('under_construction_options_group');
                    ?>

                    <!-- TEMPL-1  -->
                    <?php 
                    $chosen_template = get_option('under_construction_template', 'templ-1');
                    // Check which template is chosen met de templ-1.active class
                    
                        if ($chosen_template === 'templ-1')  { ?>
                            <table class="form-table">
                                <tr valign="top">
                                    <th scope="row">Titel</th>
                                    <td>
                                        <input type="text" name="under_construction_title" value="<?php echo esc_attr(get_option('under_construction_title', 'COMING SOON')); ?>" class="regular-text">
                                        <p class="small">De titel die op de onder constructie pagina wordt weergegeven.</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Bericht</th>
                                    <td>
                                        <textarea name="under_construction_message" rows="5" class="large-text"><?php echo esc_textarea(get_option('under_construction_message', 'This website is under construction.')); ?></textarea>
                                        <p class="small">Het bericht dat op de onder constructie pagina wordt weergegeven.</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Achtergrond kleur</th>
                                    <td>
                                        <input type="color" name="under_construction_background_color" id="under_construction_background_color"
                                            value="<?php echo esc_attr(get_option('under_construction_background_color', '#006699')); ?>">
                                        <input type="hidden" name="under_construction_text_color" id="under_construction_text_color"
                                            value="<?php echo esc_attr(get_option('under_construction_text_color', '#ffffff')); ?>">
                                        <p class="small">Stel hier jouw achtergrondkleur in. De tekstkleur wordt automatisch aangepast, zodat deze altijd goed leesbaar is.</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Logo</th>
                                    <td>
                                        <input type="text" name="under_construction_logo" id="under_construction_logo" value="<?php echo esc_url(get_option('under_construction_logo', '')); ?>" class="regular-text" />
                                        <button class="button" id="upload_logo_button">Selecteer of Upload Logo</button>
                                        <p class="small">De URL van het logo dat op de onder constructie pagina wordt weergegeven.</p>

                                        <?php if ($logo_url = get_option('under_construction_logo')) : ?>
                                            <div style="margin-top: 10px;">
                                                <img src="<?php echo esc_url($logo_url); ?>" alt="Preview Logo" style="max-width: 150px; height: auto;">
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            </table>

                        <!-- TEMPL-2 -->
                        <?php } elseif ($chosen_template === 'templ-2') { ?>
                            <table class="form-table">
                                <tr valign="top">
                                    <th scope="row">Titel</th>
                                    <td>
                                        <input type="text" name="under_construction_title" value="<?php echo esc_attr(get_option('under_construction_title', 'COMING SOON')); ?>" class="regular-text">
                                        <p class="small">De titel die op de onder constructie pagina wordt weergegeven.</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Bericht</th>
                                    <td>
                                        <textarea name="under_construction_message" rows="5" class="large-text"><?php echo esc_textarea(get_option('under_construction_message', 'This website is under construction.')); ?></textarea>
                                        <p class="small">Het bericht dat op de onder constructie pagina wordt weergegeven.</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Achtergrond afbeelding</th>
                                    <td>
                                        <input type="text" name="under_construction_background_image" id="under_construction_background_image" value="<?php echo esc_url(get_option('under_construction_background_image', '')); ?>" class="regular-text" />
                                        <button class="button" id="upload_background_image_button">Selecteer of Upload Achtergrond Afbeelding</button>
                                        <p class="small">De URL van de achtergrondafbeelding die op de onder constructie pagina wordt weergegeven.</p>

                                        <?php if ($background_image_url = get_option('under_construction_background_image')) : ?>
                                            <div style="margin-top: 10px;">
                                                <img src="<?php echo esc_url($background_image_url); ?>" alt="Preview Achtergrond Afbeelding" style="max-width: 150px; height: auto;">
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Logo</th>
                                    <td>
                                        <input type="text" name="under_construction_logo" id="under_construction_logo" value="<?php echo esc_url(get_option('under_construction_logo', '')); ?>" class="regular-text" />
                                        <button class="button" id="upload_logo_button">Selecteer of Upload Logo</button>
                                        <p class="small">De URL van het logo dat op de onder constructie pagina wordt weergegeven.</p>

                                        <?php if ($logo_url = get_option('under_construction_logo')) : ?>
                                            <div style="margin-top: 10px;">
                                                <img src="<?php echo esc_url($logo_url); ?>" alt="Preview Logo" style="max-width: 150px; height: auto;">
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            </table>
                        <?php } elseif ($chosen_template === 'templ-3') {
                            ?>
                            <table class="form-table">
                                <span><b>heading</b></span>
                                <!-- BG-image, topheading, heading, subheading -->
                                <tr valign="top">
                                    <th scope="row">Achtergrond afbeelding</th>
                                    <td>
                                        <input type="text" name="under_construction_background_image" id="under_construction_background_image" value="<?php echo esc_url(get_option('under_construction_background_image', '')); ?>" class="regular-text" />
                                        <button class="button" id="upload_background_image_button">Selecteer of Upload Achtergrond Afbeelding</button>
                                        <p class="small">De URL van de achtergrondafbeelding die op de onder constructie pagina wordt weergegeven.</p>

                                        <?php if ($background_image_url = get_option('under_construction_background_image')) : ?>
                                            <div style="margin-top: 10px;">
                                                <img src="<?php echo esc_url($background_image_url); ?>" alt="Preview Achtergrond Afbeelding" style="max-width: 150px; height: auto;">
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Topheading</th>
                                    <td>
                                        <input type="text" name="under_construction_topheading" value="<?php echo esc_attr(get_option('under_construction_topheading', 'Onze nieuwe site')); ?>" class="regular-text">
                                        <p class="small">De topheading die op de onder constructie pagina wordt weergegeven.</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Heading</th>
                                    <td>
                                        <input type="text" name="under_construction_heading" value="<?php echo esc_attr(get_option('under_construction_heading', 'Komt er aan!')); ?>" class="regular-text">
                                        <p class="small">De heading die op de onder constructie pagina wordt weergegeven.</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Subheading</th>
                                    <td>
                                        <input type="text" name="under_construction_subheading" value="<?php echo esc_attr(get_option('under_construction_subheading', 'Blijf op de hoogte')); ?>" class="regular-text">
                                        <p class="small">De subheading die op de onder constructie pagina wordt weergegeven.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding: 20px 0; border-radius: 5px;">
                                        <hr>
                                        <span><b>Content</b></span>
                                    </td>
                                </tr>
                                <!-- title, description, nieuwsbrief aankondiging , social media links -->
                                <tr valign="top">
                                    <th scope="row">Titel</th>
                                    <td>
                                        <input type="text" name="under_construction_title" value="<?php echo esc_attr(get_option('under_construction_title', 'COMING SOON')); ?>" class="regular-text">
                                        <p class="small">De titel die op de onder constructie pagina wordt weergegeven.</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Beschrijving</th>
                                    <td>
                                        <textarea name="under_construction_description" class="regular-text" rows="5"><?php echo esc_textarea(get_option('under_construction_description', '')); ?></textarea>
                                        <p class="small">De beschrijving die op de onder constructie pagina wordt weergegeven.</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Nieuwsbrief Aankondiging</th>
                                    <td>
                                        <input type="text" name="under_construction_newsletter" value="<?php echo esc_attr(get_option('under_construction_newsletter', '')); ?>" class="regular-text">
                                        <p class="small">De tekst die op de onder constructie pagina wordt weergegeven voor de nieuwsbrief aankondiging.</p>
                                    </td>
                                </tr>
                                <tr valign="top">
                                    <th scope="row">Social Media Links</th>
                                    <td>
                                        <input type="text" name="under_construction_facebook" value="<?php echo esc_url(get_option('under_construction_facebook', '')); ?>" class="regular-text" placeholder="Facebook URL">
                                        <input type="text" name="under_construction_twitter" value="<?php echo esc_url(get_option('under_construction_twitter', '')); ?>" class="regular-text" placeholder="Twitter URL">
                                        <input type="text" name="under_construction_instagram" value="<?php echo esc_url(get_option('under_construction_instagram', '')); ?>" class="regular-text" placeholder="Instagram URL">
                                        <input type="text" name="under_construction_linkedin" value="<?php echo esc_url(get_option('under_construction_linkedin', '')); ?>" class="regular-text" placeholder="LinkedIn URL">
                                        <p class="small">Voeg hier de links naar uw sociale media profielen toe. Deze worden weergegeven op de onder constructie pagina.</p>
                                    </td>
                                </tr>
                            </table>
                        <?php
                        } ?>
                    
                    <?php submit_button(); ?>
                </div>
                <!-- Support tab -->
                <div id="support" class="tab-pane">
                    <h2>FAQ</h2>
                    <p>Hier kunt u de veelgestelde vragen over de onder constructie pagina bekijken.</p>
                    <hr>

                    <div class="accordion" id="accordionExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Wat is de onder constructie modus?
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    De onder constructie modus is een functie die u in staat stelt om uw website tijdelijk te verbergen voor bezoekers terwijl u deze aan het bijwerken bent. Dit is handig als u wijzigingen aanbrengt die enige tijd in beslag nemen en u niet wilt dat bezoekers een onvoltooide site zien.
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>

        </form>
    </div>

    <!-- Support section -->
    <div class="wrap" style="max-width: 30%; margin-top: 125px;">
        <h2>Ondersteuning</h2>
        <p>Heeft u hulp nodig? Neem contact op met onze ondersteuning.</p>
        <p class="small">U kunt ons bereiken via e-mail op <a href="mailto:support@madeit.be">suport@madeit.be</a>.</p>
    </div>
</div>
<?php
}

get_template_part('inc/underConstruction/templates/templ-1/templ-1');

// Redirect users to the under construction page if the mode is on
function under_construction_template_redirect() {
    if (is_admin()) return; // voorkom in admin

    $mode = get_option('under_construction_mode', 'off');
    if ($mode !== 'on') return;

    // Check eindtijd
    $end_time = get_option('under_construction_end_time');
    if (!empty($end_time) && strtotime($end_time) < time()) {
        update_option('under_construction_mode', 'off');
        return;
    }

    // Check of gebruiker mag kijken
    $allowed_roles = get_option('under_construction_user_roles', array('administrator'));
    $user = wp_get_current_user();
    foreach ($user->roles as $role) {
        if (in_array($role, $allowed_roles)) return;
    }

    // Laad gekozen template
    $chosen_template = get_option('under_construction_template', 'templ-1');
    $template_path = get_stylesheet_directory() . '/inc/underConstruction/templates/' . $chosen_template . '.php';

    if (file_exists($template_path)) {
        include($template_path);
        exit;
    } else {
        // fallback
        wp_die('Under Construction - template niet gevonden.');
    }
}
add_action('template_redirect', 'under_construction_template_redirect');

?>



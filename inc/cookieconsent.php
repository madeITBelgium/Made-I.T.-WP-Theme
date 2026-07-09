<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_get_cookieconsent_i18n()
{
    return [
        'fallbackLang' => 'nl',
        'translations' => [
            'nl' => [
                'consentModal' => [
                    'title' => __('We waarderen uw privacy', 'madeit'),
                    'description' => __('We gebruiken cookies om uw browse-ervaring te verbeteren, gepersonaliseerde advertenties of inhoud weer te geven en ons verkeer te analyseren. Door op \'Alles accepteren\' te klikken, stemt u in met ons gebruik van cookies.', 'madeit'),
                    'acceptAllBtn' => __('Alles accepteren', 'madeit'),
                    'acceptNecessaryBtn' => __('Alleen noodzakelijke cookies accepteren', 'madeit'),
                    'showPreferencesBtn' => __('Voorkeuren beheren', 'madeit'),
                    'footer' => '',
                ],
                'preferencesModal' => [
                    'title' => __('Cookievoorkeuren', 'madeit'),
                    'acceptAllBtn' => __('Alles accepteren', 'madeit'),
                    'acceptNecessaryBtn' => __('Alleen noodzakelijke cookies accepteren', 'madeit'),
                    'savePreferencesBtn' => __('Voorkeuren opslaan', 'madeit'),
                    'closeIconLabel' => __('Sluit venster', 'madeit'),
                    'serviceCounterLabel' => __('Service|Services', 'madeit'),
                    'sections' => [
                        [
                            'title' => __('Cookie Gebruik', 'madeit'),
                            'description' => __('Wij gebruiken cookies om uw ervaring op onze website te verbeteren. Sommige cookies zijn essentieel voor de werking van de site, terwijl andere ons helpen om inzicht te krijgen in hoe u onze site gebruikt en om gepersonaliseerde inhoud aan te bieden.', 'madeit'),
                        ],
                        [
                            'title' => __('Strikt noodzakelijke cookies <span class="pm__badge">Altijd ingeschakeld</span>', 'madeit'),
                            'description' => __('Essentieel voor de werking van de website en kan niet worden uitgeschakeld.', 'madeit'),
                            'linkedCategory' => 'necessary',
                        ],
                        [
                            'title' => __('Analytics', 'madeit'),
                            'description' => __('Helpt ons begrijpen hoe bezoekers de site gebruiken.', 'madeit'),
                            'linkedCategory' => 'analytics',
                        ],
                        [
                            'title' => __('Advertising', 'madeit'),
                            'description' => __('Wordt gebruikt voor advertenties en metingen.', 'madeit'),
                            'linkedCategory' => 'advertisement',
                        ],
                        [
                            'title' => __('Functionality', 'madeit'),
                            'description' => __('Ondersteunt extra functionaliteit en personalisatie.', 'madeit'),
                            'linkedCategory' => 'functionality',
                        ],
                        [
                            'title' => __('Security', 'madeit'),
                            'description' => __('Ondersteunt beveiliging, fraudepreventie en bescherming.', 'madeit'),
                            'linkedCategory' => 'security',
                        ],
                    ],
                ],
                'services' => [
                    'analytics_storage' => __('Analytics opslag (cookies)', 'madeit'),
                    'ad_storage' => __('Advertentie-opslag (cookies)', 'madeit'),
                    'ad_user_data' => __('Advertentie user data (Google)', 'madeit'),
                    'ad_personalization' => __('Gepersonaliseerde advertenties', 'madeit'),
                    'functionality_storage' => __('Functionele opslag', 'madeit'),
                    'personalization_storage' => __('Personalisatie opslag', 'madeit'),
                    'security_storage' => __('Security opslag', 'madeit'),
                ],
            ],
            'en' => [
                'consentModal' => [
                    'title' => __('We value your privacy', 'madeit'),
                    'description' => __('We use cookies to improve your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking \'Accept all\', you consent to our use of cookies.', 'madeit'),
                    'acceptAllBtn' => __('Accept all', 'madeit'),
                    'acceptNecessaryBtn' => __('Accept necessary cookies only', 'madeit'),
                    'showPreferencesBtn' => __('Manage preferences', 'madeit'),
                    'footer' => '',
                ],
                'preferencesModal' => [
                    'title' => __('Cookie preferences', 'madeit'),
                    'acceptAllBtn' => __('Accept all', 'madeit'),
                    'acceptNecessaryBtn' => __('Accept necessary cookies only', 'madeit'),
                    'savePreferencesBtn' => __('Save preferences', 'madeit'),
                    'closeIconLabel' => __('Close dialog', 'madeit'),
                    'serviceCounterLabel' => __('Service|Services', 'madeit'),
                    'sections' => [
                        [
                            'title' => __('Cookie Usage', 'madeit'),
                            'description' => __('We use cookies to improve your experience on our website. Some cookies are essential for the site to function, while others help us understand how you use the site and offer personalized content.', 'madeit'),
                        ],
                        [
                            'title' => __('Strictly necessary cookies <span class="pm__badge">Always enabled</span>', 'madeit'),
                            'description' => __('Essential for the website to function and cannot be disabled.', 'madeit'),
                            'linkedCategory' => 'necessary',
                        ],
                        [
                            'title' => __('Analytics', 'madeit'),
                            'description' => __('Helps us understand how visitors use the site.', 'madeit'),
                            'linkedCategory' => 'analytics',
                        ],
                        [
                            'title' => __('Advertising', 'madeit'),
                            'description' => __('Used for advertising and measurement.', 'madeit'),
                            'linkedCategory' => 'advertisement',
                        ],
                        [
                            'title' => __('Functionality', 'madeit'),
                            'description' => __('Supports additional functionality and personalization.', 'madeit'),
                            'linkedCategory' => 'functionality',
                        ],
                        [
                            'title' => __('Security', 'madeit'),
                            'description' => __('Supports security, fraud prevention, and protection.', 'madeit'),
                            'linkedCategory' => 'security',
                        ],
                    ],
                ],
                'services' => [
                    'analytics_storage' => __('Analytics storage (cookies)', 'madeit'),
                    'ad_storage' => __('Ad storage (cookies)', 'madeit'),
                    'ad_user_data' => __('Ad user data (Google)', 'madeit'),
                    'ad_personalization' => __('Personalized ads', 'madeit'),
                    'functionality_storage' => __('Functionality storage', 'madeit'),
                    'personalization_storage' => __('Personalization storage', 'madeit'),
                    'security_storage' => __('Security storage', 'madeit'),
                ],
            ],
            'fr' => [
                'consentModal' => [
                    'title' => __('Nous respectons votre vie privee', 'madeit'),
                    'description' => __('Nous utilisons des cookies pour ameliorer votre navigation, proposer des publicites ou contenus personnalises et analyser notre trafic. En cliquant sur \'Tout accepter\', vous acceptez notre utilisation des cookies.', 'madeit'),
                    'acceptAllBtn' => __('Tout accepter', 'madeit'),
                    'acceptNecessaryBtn' => __('Accepter uniquement les cookies necessaires', 'madeit'),
                    'showPreferencesBtn' => __('Gerer les preferences', 'madeit'),
                    'footer' => '',
                ],
                'preferencesModal' => [
                    'title' => __('Preferences de cookies', 'madeit'),
                    'acceptAllBtn' => __('Tout accepter', 'madeit'),
                    'acceptNecessaryBtn' => __('Accepter uniquement les cookies necessaires', 'madeit'),
                    'savePreferencesBtn' => __('Enregistrer les preferences', 'madeit'),
                    'closeIconLabel' => __('Fermer la fenetre', 'madeit'),
                    'serviceCounterLabel' => __('Service|Services', 'madeit'),
                    'sections' => [
                        [
                            'title' => __('Utilisation des cookies', 'madeit'),
                            'description' => __('Nous utilisons des cookies pour ameliorer votre experience sur notre site. Certains cookies sont essentiels au fonctionnement du site, tandis que d\'autres nous aident a comprendre votre utilisation et a proposer du contenu personnalise.', 'madeit'),
                        ],
                        [
                            'title' => __('Cookies strictement necessaires <span class="pm__badge">Toujours actifs</span>', 'madeit'),
                            'description' => __('Essentiels au fonctionnement du site et ne peuvent pas etre desactives.', 'madeit'),
                            'linkedCategory' => 'necessary',
                        ],
                        [
                            'title' => __('Analytics', 'madeit'),
                            'description' => __('Nous aide a comprendre comment les visiteurs utilisent le site.', 'madeit'),
                            'linkedCategory' => 'analytics',
                        ],
                        [
                            'title' => __('Advertising', 'madeit'),
                            'description' => __('Utilise pour la publicite et la mesure.', 'madeit'),
                            'linkedCategory' => 'advertisement',
                        ],
                        [
                            'title' => __('Functionality', 'madeit'),
                            'description' => __('Prend en charge des fonctionnalites supplementaires et la personnalisation.', 'madeit'),
                            'linkedCategory' => 'functionality',
                        ],
                        [
                            'title' => __('Security', 'madeit'),
                            'description' => __('Prend en charge la securite, la prevention de la fraude et la protection.', 'madeit'),
                            'linkedCategory' => 'security',
                        ],
                    ],
                ],
                'services' => [
                    'analytics_storage' => __('Stockage analytics (cookies)', 'madeit'),
                    'ad_storage' => __('Stockage publicitaire (cookies)', 'madeit'),
                    'ad_user_data' => __('Donnees utilisateur publicitaires (Google)', 'madeit'),
                    'ad_personalization' => __('Publicites personnalisees', 'madeit'),
                    'functionality_storage' => __('Stockage fonctionnel', 'madeit'),
                    'personalization_storage' => __('Stockage de personnalisation', 'madeit'),
                    'security_storage' => __('Stockage de securite', 'madeit'),
                ],
            ],
            'de' => [
                'consentModal' => [
                    'title' => __('Wir respektieren Ihre Privatsphaere', 'madeit'),
                    'description' => __('Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, personalisierte Werbung oder Inhalte anzuzeigen und unseren Traffic zu analysieren. Mit einem Klick auf \'Alle akzeptieren\' stimmen Sie der Verwendung von Cookies zu.', 'madeit'),
                    'acceptAllBtn' => __('Alle akzeptieren', 'madeit'),
                    'acceptNecessaryBtn' => __('Nur notwendige Cookies akzeptieren', 'madeit'),
                    'showPreferencesBtn' => __('Einstellungen verwalten', 'madeit'),
                    'footer' => '',
                ],
                'preferencesModal' => [
                    'title' => __('Cookie-Einstellungen', 'madeit'),
                    'acceptAllBtn' => __('Alle akzeptieren', 'madeit'),
                    'acceptNecessaryBtn' => __('Nur notwendige Cookies akzeptieren', 'madeit'),
                    'savePreferencesBtn' => __('Einstellungen speichern', 'madeit'),
                    'closeIconLabel' => __('Fenster schliessen', 'madeit'),
                    'serviceCounterLabel' => __('Dienst|Dienste', 'madeit'),
                    'sections' => [
                        [
                            'title' => __('Cookie-Nutzung', 'madeit'),
                            'description' => __('Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. Einige Cookies sind fuer den Betrieb der Website notwendig, andere helfen uns zu verstehen, wie Sie die Website nutzen, und personalisierte Inhalte anzubieten.', 'madeit'),
                        ],
                        [
                            'title' => __('Unbedingt erforderliche Cookies <span class="pm__badge">Immer aktiv</span>', 'madeit'),
                            'description' => __('Fuer den Betrieb der Website erforderlich und koennen nicht deaktiviert werden.', 'madeit'),
                            'linkedCategory' => 'necessary',
                        ],
                        [
                            'title' => __('Analytics', 'madeit'),
                            'description' => __('Hilft uns zu verstehen, wie Besucher die Website nutzen.', 'madeit'),
                            'linkedCategory' => 'analytics',
                        ],
                        [
                            'title' => __('Advertising', 'madeit'),
                            'description' => __('Wird fuer Werbung und Messung verwendet.', 'madeit'),
                            'linkedCategory' => 'advertisement',
                        ],
                        [
                            'title' => __('Functionality', 'madeit'),
                            'description' => __('Unterstuetzt zusaetzliche Funktionalitaet und Personalisierung.', 'madeit'),
                            'linkedCategory' => 'functionality',
                        ],
                        [
                            'title' => __('Security', 'madeit'),
                            'description' => __('Unterstuetzt Sicherheit, Betrugspraevention und Schutz.', 'madeit'),
                            'linkedCategory' => 'security',
                        ],
                    ],
                ],
                'services' => [
                    'analytics_storage' => __('Analytics-Speicherung (Cookies)', 'madeit'),
                    'ad_storage' => __('Werbe-Speicherung (Cookies)', 'madeit'),
                    'ad_user_data' => __('Werbe-Nutzerdaten (Google)', 'madeit'),
                    'ad_personalization' => __('Personalisierte Werbung', 'madeit'),
                    'functionality_storage' => __('Funktionale Speicherung', 'madeit'),
                    'personalization_storage' => __('Personalisierungs-Speicherung', 'madeit'),
                    'security_storage' => __('Sicherheits-Speicherung', 'madeit'),
                ],
            ],
        ],
    ];
}

function madeit_enqueue_cookieconsent_assets()
{
    if (is_admin()) {
        return;
    }

    $css_rel = '/assets/css/cookieconsent.css';
    $js_rel = '/assets/js/cookieconsent.js';
    $conf_rel = '/assets/js/cookieconsent-config.js';

    $css_path = get_theme_file_path($css_rel);
    $js_path = get_theme_file_path($js_rel);
    $conf_path = get_theme_file_path($conf_rel);

    if (file_exists($css_path)) {
        wp_enqueue_style(
            'madeit-cookieconsent',
            get_theme_file_uri($css_rel),
            [],
            MADEIT_VERSION
        );
    }

    if (file_exists($js_path)) {
        wp_enqueue_script(
            'madeit-cookieconsent',
            get_theme_file_uri($js_rel),
            [],
            MADEIT_VERSION,
            true
        );
    }

    if (file_exists($conf_path)) {
        wp_enqueue_script(
            'madeit-cookieconsent-config',
            get_theme_file_uri($conf_rel),
            ['madeit-cookieconsent'],
            MADEIT_VERSION,
            true
        );

        wp_localize_script(
            'madeit-cookieconsent-config',
            'madeitCookieConsentConfig',
            madeit_get_cookieconsent_i18n()
        );
    }
}

add_action('wp_enqueue_scripts', 'madeit_enqueue_cookieconsent_assets', 20);

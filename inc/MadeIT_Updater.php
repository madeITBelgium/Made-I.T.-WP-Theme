<?php

class MadeIT_Updater
{
    private $slug; // plugin slug
    private $themeData; // plugin data
    private $themeFile; // __FILE__ of our plugin
    private $apiResult; // holds data from GitHub
    private $childTheme = false;

    public function __construct($themeFile, $child = false)
    {
        add_filter('pre_set_site_transient_update_themes', [$this, 'setTransitent']);
        add_filter('themes_api', [$this, 'setThemeInfo'], 10, 3);
        add_filter('upgrader_source_selection', [$this, 'themeUpgraderSourceSelection'], 10, 4);
        add_filter('upgrader_pre_install', [$this, 'preInstall'], 10, 2);
        add_filter('upgrader_post_install', [$this, 'postInstall'], 10, 3);

        $this->themeFile = $themeFile;
        $this->childTheme = $child;
    }

    // Get information regarding our plugin from WordPress
    private function initThemeData()
    {
        $this->slug = $this->childTheme ? get_option('stylesheet') : get_template();
        $theme = wp_get_theme($this->slug);

        $this->themeData = [];
        $this->themeData['ThemeURI'] = esc_html($theme->get('ThemeURI'));
        $this->themeData['ResourceURI'] = $this->themeData['ThemeURI'];
        $this->themeData['Name'] = $theme->get('Name');
        $this->themeData['AuthorName'] = $theme->get('Author');
        $this->themeData['Description'] = $theme->get('Description');
    }

    // Get information regarding our plugin from GitHub
    private function getRepoReleaseInfo()
    {
        // Only do this once
        if (!empty($this->apiResult)) {
            return;
        }
        // Query the GitHub API
        $url = 'https://portal.madeit.be/api/plugin/wordpress/madeit?website='.home_url('/');

        $headers = [];

        // Get the results
        $this->apiResult = wp_remote_retrieve_body(wp_remote_get($url, $headers));

        if (!empty($this->apiResult)) {
            $this->apiResult = @json_decode($this->apiResult);
        }
    }

    // Push in plugin version information to get the update notification
    public function setTransitent($transient)
    {
        // If we have checked the plugin data before, don't re-check
        if (empty($transient->checked)) {
            return $transient;
        }

        // Get plugin & GitHub release information
        $this->initThemeData();
        $this->getRepoReleaseInfo();

        if (empty($this->apiResult)) {
            return $transient;
        }

        // Check the versions if we need to do an update
        $doUpdate = version_compare($this->apiResult->latest_version, $transient->checked[$this->slug]);
        // Update the transient to include our updated plugin data
        if ($doUpdate == 1) {
            $package = $this->apiResult->download_url;

            $theme_array = [];
            $theme_array['new_version'] = $this->apiResult->latest_version;
            $theme_array['url'] = $this->themeData['ThemeURI'];
            $theme_array['package'] = $package;
            $transient->response[$this->slug] = $theme_array;
        }

        return $transient;
    }

    // Push in plugin version information to display in the details lightbox
    public function setThemeInfo($false, $action, $response)
    {
        // Get plugin & GitHub release information
        $this->initThemeData();
        $this->getRepoReleaseInfo();
        // If nothing is found, do nothing
        if (empty($response->slug) || $response->slug != $this->slug) {
            return false;
        }

        if (empty($this->apiResult)) {
            return false;
        }

        // Add our plugin information
        $response->last_updated = $this->apiResult->updated_at;
        $response->slug = $this->slug;
        $response->name = $this->themeData['Name'];
        $response->version = $this->apiResult->latest_version;
        $response->author = $this->themeData['AuthorName'];
        $response->homepage = $this->themeData['ThemeURI'];
        // This is our release download zip file
        $downloadLink = $this->apiResult->download_url;

        $response->download_link = $downloadLink;
        // We're going to parse the GitHub markdown release notes, include the parser
        require_once dirname(__FILE__).'/MadeIT_Parsedown.php';
        // Create tabs in the lightbox
        $response->sections = [
            'description' => $this->themeData['Description'],
            'changelog'   => class_exists('MadeIT_Parsedown')
                ? MadeIT_Parsedown::instance()->parse($this->apiResult->changelog)
                : $this->apiResult->changelog,
        ];

        // Gets the required version of WP if available
        $matches = null;
        preg_match("/requires:\s([\d\.]+)/i", $this->apiResult->changelog, $matches);
        if (!empty($matches)) {
            if (is_array($matches)) {
                if (count($matches) > 1) {
                    $response->requires = $matches[1];
                }
            }
        }
        // Gets the tested version of WP if available
        $matches = null;
        preg_match("/tested:\s([\d\.]+)/i", $this->apiResult->changelog, $matches);
        if (!empty($matches)) {
            if (is_array($matches)) {
                if (count($matches) > 1) {
                    $response->tested = $matches[1];
                }
            }
        }

        return $response;
    }

    // Perform additional actions to successfully install our plugin
    public function postInstall($true, $hook_extra, $result)
    {
        // Get plugin information
        $this->initThemeData();

        if (!isset($hook_extra['theme']) || $this->slug !== $hook_extra['theme']) {
            return $result;
        }

        // Since we are hosted in GitHub, our plugin folder would have a dirname of
        // reponame-tagname change it to our original one:
        global $wp_filesystem;
        if ($this->slug !== $result['destination_name']) {
            $temp_destination_name = $result['destination_name'];
            $temp_destination = $result['destination'];
            $result['destination_name'] = str_replace($temp_destination_name, $this->slug, $result['destination_name']);
            $result['destination'] = str_replace($temp_destination_name, $this->slug, $result['destination']);
            $result['remote_destination'] = str_replace($temp_destination_name, $this->slug, $result['remote_destination']);
            $wp_filesystem->move($temp_destination, $result['destination']);
        }

        return $result;
    }

    public function themeUpgraderSourceSelection($source, $remote_source, $upgrader, $hook_extra = null)
    {
        $this->initThemeData();

        require_once ABSPATH.'wp-admin/includes/class-wp-upgrader.php';
        global $wp_filesystem;
        $source_base = basename($source);
        $active_theme = wp_get_theme()->stylesheet;
        /*
         * Check for upgrade process, return if not correct upgrader.
         */
        if (!($upgrader instanceof \Theme_Upgrader)) {
            return $source;
        }
        /*
         * Set source for updating only for current active theme.
         */
        if ($active_theme === $upgrader->skin->theme_info->stylesheet) {
            $corrected_source = str_replace($source_base, $active_theme, $source);
        } else {
            return $source;
        }
        $upgrader->skin->feedback(
            sprintf(
                esc_html__('Renaming %1$s to %2$s', 'github-updater').'&#8230;',
                '<span class="code">'.$source_base.'</span>',
                '<span class="code">'.basename($corrected_source).'</span>'
            )
        );
        /*
         * If we can rename, do so and return the new name.
         */
        if ($wp_filesystem->move($source, $corrected_source, true)) {
            $upgrader->skin->feedback(esc_html__('Rename successful', 'madeit').'&#8230;');

            return $corrected_source;
        }
        /*
         * Otherwise, return an error.
         */
        $upgrader->skin->feedback(esc_html__('Unable to rename downloaded repository.', 'madeit'));

        return new \WP_Error();
    }

    public function preInstall($return, $theme)
    {
        $this->initThemeData();
        $this->getRepoReleaseInfo();
    }
}

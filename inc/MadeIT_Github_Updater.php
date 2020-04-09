<?php

class MadeIT_Github_Updater
{
    private $slug; // plugin slug
    private $themeData; // plugin data
    private $username; // GitHub username
    private $repo; // GitHub repo name
    private $themeFile; // __FILE__ of our plugin
    private $githubAPIResult; // holds data from GitHub
    private $accessToken; // GitHub private repo token
    private $childTheme = false;

    public function __construct($themeFile, $gitHubUsername, $gitHubProjectName, $accessToken = '', $child = false)
    {
        add_filter('pre_set_site_transient_update_themes', [$this, 'setTransitent']);
        add_filter('themes_api', [$this, 'setThemeInfo'], 10, 3);
        add_filter('upgrader_source_selection', [$this, 'themeUpgraderSourceSelection'], 10, 4);
        add_filter('upgrader_post_install', [$this, 'postInstall'], 10, 3);
        add_filter('upgrader_package_options', [$this, 'beforeDownload'], 10, 1);
        $this->themeFile = $themeFile;
        $this->username = $gitHubUsername;
        $this->repo = $gitHubProjectName;
        $this->accessToken = $accessToken;
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
        if (!empty($this->githubAPIResult)) {
            return;
        }
        // Query the GitHub API
        $url = "https://api.github.com/repos/{$this->username}/{$this->repo}/releases";
        // We need the access token for private repos
        $headers = [];
        if (!empty($this->accessToken)) {
            $headers = ['headers' => ['Authorization' => 'token '.$this->accessToken]];
        }
        // Get the results
        $this->githubAPIResult = wp_remote_retrieve_body(wp_remote_get($url, $headers));

        if (!empty($this->githubAPIResult)) {
            $this->githubAPIResult = @json_decode($this->githubAPIResult);
        }
        // Use only the latest release
        if (is_array($this->githubAPIResult) && count($this->githubAPIResult) > 0) {
            $this->githubAPIResult = $this->githubAPIResult[0];
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
        // Check the versions if we need to do an update
        $doUpdate = version_compare($this->githubAPIResult->tag_name, $transient->checked[$this->slug]);
        // Update the transient to include our updated plugin data
        if ($doUpdate == 1) {
            $package = $this->githubAPIResult->zipball_url;
            // Include the access token for private GitHub repos

            $theme_array = [];
            $theme_array['new_version'] = $this->githubAPIResult->tag_name;
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
        // Add our plugin information
        $response->last_updated = $this->githubAPIResult->published_at;
        $response->slug = $this->slug;
        $response->name = $this->themeData['Name'];
        $response->version = $this->githubAPIResult->tag_name;
        $response->author = $this->themeData['AuthorName'];
        $response->homepage = $this->themeData['ThemeURI'];
        // This is our release download zip file
        $downloadLink = $this->githubAPIResult->zipball_url;
        // Include the access token for private GitHub repos
        $response->download_link = $downloadLink;
        // We're going to parse the GitHub markdown release notes, include the parser
        require_once dirname(__FILE__).'/MadeIT_Parsedown.php';
        // Create tabs in the lightbox
        $response->sections = [
            'description' => $this->themeData['Description'],
            'changelog'   => class_exists('MadeIT_Parsedown')
                ? MadeIT_Parsedown::instance()->parse($this->githubAPIResult->body)
                : $this->githubAPIResult->body,
        ];
        // Gets the required version of WP if available
        $matches = null;
        preg_match("/requires:\s([\d\.]+)/i", $this->githubAPIResult->body, $matches);
        if (!empty($matches)) {
            if (is_array($matches)) {
                if (count($matches) > 1) {
                    $response->requires = $matches[1];
                }
            }
        }
        // Gets the tested version of WP if available
        $matches = null;
        preg_match("/tested:\s([\d\.]+)/i", $this->githubAPIResult->body, $matches);
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

    public function beforeDownload($options)
    {
        $this->initThemeData();
        $this->getRepoReleaseInfo();

        if ($options['package'] === $this->githubAPIResult->zipball_url) {
            add_filter('http_request_args', [$this, 'addAuthHeader'], 10, 2);
        }
    }

    public function addAuthHeader($parsed_args, $url)
    {
        if ($url === $this->githubAPIResult->zipball_url) {
            $parsed_args['headers']['Authorization'] = 'token '.$this->accessToken;
        }

        return $parsed_args;
    }
}

<?php
/**
 * MadeIt Setup Wizard - Step: plugins
 * Install and activate all required and recommended plugins.
 * 
 * @package MadeIt
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-plugins">

    <h1>Plugins Installeren</h1>

    <p class="small">In deze stap installeren we de aanbevolen plugins die nodig zijn voor de volledige functionaliteit van het <?php echo MADEIT_NAME; ?> thema.</p>

    <?php
    $step_data = function_exists('madeit_setup_wizard_get_plugins_step_data')
        ? madeit_setup_wizard_get_plugins_step_data()
        : [
            'plugins' => [],
            'features' => [],
        ];

    $plugin_suggestions = isset($step_data['plugins']) && is_array($step_data['plugins'])
        ? $step_data['plugins']
        : [];

    $feature_suggestions = isset($step_data['features']) && is_array($step_data['features'])
        ? $step_data['features']
        : [];
    ?>

    <?php if (!empty($plugin_suggestions)) : ?>
        <h2>Aanbevolen plugins</h2>
        <div class="pluginList groupChildTheme">
            <?php foreach ($plugin_suggestions as $plugin) :
                $plugin_slug = isset($plugin['slug']) ? sanitize_key((string) $plugin['slug']) : '';
                $plugin_name = isset($plugin['name']) ? (string) $plugin['name'] : '';
                $plugin_description = isset($plugin['description']) ? (string) $plugin['description'] : '';
                $plugin_required = !empty($plugin['required']);
                $plugin_selected = isset($plugin['selected']) ? (bool) $plugin['selected'] : $plugin_required;
                $plugin_logo = isset($plugin['logo']) ? esc_url((string) $plugin['logo']) : '';

                if ($plugin_name === '' || $plugin_slug === '') {
                    continue;
                }
                ?>
                <label class="pluginItem pluginSelectable">
                    <input
                        type="checkbox"
                        name="plugin_selection__<?php echo esc_attr($plugin_slug); ?>"
                        value="1"
                        <?php checked($plugin_selected); ?>
                    />
                    <span class="pluginImage childImage">
                        <?php if ($plugin_logo !== '') : ?>
                            <img src="<?php echo $plugin_logo; ?>" alt="<?php echo esc_attr($plugin_name); ?>" />
                        <?php else : ?>
                            <?php echo $plugin_required ? esc_html__('Vereist', 'madeit') : esc_html__('Aanbevolen', 'madeit'); ?>
                        <?php endif; ?>
                    </span>
                    <span class="pluginContent childContent">
                        <h3><?php echo esc_html($plugin_name); ?></h3>
                        <?php if ($plugin_description !== '') : ?>
                            <p class="small"><?php echo esc_html($plugin_description); ?></p>
                        <?php endif; ?>
                    </span>
                </label>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <?php if (!empty($feature_suggestions)) : ?>
        <h2>Features</h2>
        <div class="pluginList groupChildTheme">
            <?php foreach ($feature_suggestions as $feature) :
                $feature_slug = isset($feature['slug']) ? sanitize_key((string) $feature['slug']) : '';
                $feature_name = isset($feature['name']) ? (string) $feature['name'] : '';
                $feature_description = isset($feature['description']) ? (string) $feature['description'] : '';
                $feature_selected = !empty($feature['selected']);
                $feature_logo = isset($feature['logo']) ? esc_url((string) $feature['logo']) : '';
                $feature_plugins = isset($feature['plugins']) && is_array($feature['plugins'])
                    ? $feature['plugins']
                    : [];

                if ($feature_name === '' || $feature_slug === '') {
                    continue;
                }
                ?>
                <label class="pluginItem pluginSelectable">
                    <input
                        type="checkbox"
                        name="feature_selection__<?php echo esc_attr($feature_slug); ?>"
                        value="1"
                        <?php checked($feature_selected); ?>
                    />
                    <span class="pluginImage childImage">
                        <?php if ($feature_logo !== '') : ?>
                            <img src="<?php echo $feature_logo; ?>" alt="<?php echo esc_attr($feature_name); ?>" />
                        <?php else : ?>
                            Feature
                        <?php endif; ?>
                    </span>
                    <span class="pluginContent childContent">
                        <h3><?php echo esc_html($feature_name); ?></h3>
                        <?php if ($feature_description !== '') : ?>
                            <p class="small"><?php echo esc_html($feature_description); ?></p>
                        <?php endif; ?>

                        <?php if (!empty($feature_plugins)) : ?>
                            <p class="small">
                                <?php
                                $feature_plugin_names = [];
                                foreach ($feature_plugins as $feature_plugin) {
                                    if (isset($feature_plugin['name']) && $feature_plugin['name'] !== '') {
                                        $feature_plugin_names[] = (string) $feature_plugin['name'];
                                    }
                                }
                                echo esc_html(implode(', ', $feature_plugin_names));
                                ?>
                            </p>
                        <?php endif; ?>
                    </span>
                </label>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <div class="buttons">
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=pages')); ?>">Overslaan</a>
        <a class="button button-primary" data-save="1" href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=pages')); ?>">Verder</a>
    </div>
</div>
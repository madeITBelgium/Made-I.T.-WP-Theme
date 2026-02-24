<?php

/**
 * MadeIt Setup Wizard.
 *
 * Hier definieer je de stappen van de setup wizard.
 * De key is de slug van de stap, en de value is de titel die getoond wordt in het menu.
 */
class MadeIt_Setup_Steps
{
    public static function get_steps()
    {
        return [
            'welcome'        => 'Welkom',
            'child-theme'    => 'Child Theme',
            'basic-settings' => 'Basis Instellingen',
            'branding'       => 'Branding',
            'plugins'        => 'Plugins',
            'pages'          => 'Pagina\'s',
            'finish'         => 'Klaar',
        ];
    }
}

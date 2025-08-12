# Gutenberg/Block Editor

Het Made I.T. thema biedt uitgebreide ondersteuning voor de WordPress Gutenberg block editor met custom blocks, styling en geavanceerde functionaliteiten.

## Basis Gutenberg Support

### Theme Support Features
Het thema activeert essentiële Gutenberg features:

```php
function madeit_gutenberg_support() {
    // Wide en full-width alignment
    add_theme_support('align-wide');
    
    // Responsive embeds
    add_theme_support('responsive-embeds');
    
    // Custom color palette
    add_theme_support('editor-color-palette', $colors);
    
    // Gradient presets
    add_theme_support('editor-gradient-presets', madeit_generate_gradients_colors());
}
```

### Editor Color Palette
Automatische kleurpalet gebaseerd op thema configuratie:

```php
$color_palette = [
    [
        'name'  => __('White Color', 'madeit'),
        'slug'  => 'white',
        'color' => '#FFFFFF',
    ],
    [
        'name'  => __('Black Color', 'madeit'),
        'slug'  => 'black',
        'color' => '#000000',
    ],
    [
        'name'  => __('Primary Color', 'madeit'),
        'slug'  => 'primary',
        'color' => madeit_get_theme_color('primary_color_rgb', MADEIT_PRIMARY_COLOR),
    ],
    [
        'name'  => __('Secondary Color', 'madeit'),
        'slug'  => 'secondary',
        'color' => madeit_get_theme_color('secondary_color_rgb', MADEIT_SECONDARY_COLOR),
    ],
    // Alle Bootstrap kleuren (success, info, warning, danger)
];
```

## Block Editor Assets

### Editor Specific Styles
```php
function madeit_block_editor_styles() {
    wp_enqueue_style('madeit-block-editor-styles', 
        get_template_directory_uri() . '/style-editor.css', 
        false, MADEIT_VERSION, 'all');
        
    wp_enqueue_script('madeit-gutenberg-toolbar', 
        get_template_directory_uri() . '/assets/js/gutenberg-toolbar.js', 
        [], MADEIT_VERSION, true);
}
add_action('enqueue_block_editor_assets', 'madeit_block_editor_styles');
```

### Frontend Block Styles
```php
function madeit_extend_gutenberg_css() {
    wp_enqueue_style('madeit-gutenberg-style', 
        get_theme_file_uri('/assets/css/gutenfront.css'), 
        ['wp-editor'], wp_get_theme()->get('Version'));
}
add_action('enqueue_block_assets', 'madeit_extend_gutenberg_css');
```

## Custom Blocks

### MADEIT_ADVANCED_BLOCKS Configuratie
```php
define('MADEIT_ADVANCED_BLOCKS', true);
```

### Block Directories
Het thema bevat twee sets van custom blocks:

1. **Legacy Blocks** (`/gutenberg/`): Oudere block implementaties
2. **Nieuwe Blocks** (`/gutenberg-v2/`): Moderne block implementaties

### Beschikbare Custom Blocks

#### Container Blocks
- **Container**: Basis container met padding/margin opties
- **Container Simple**: Eenvoudige container zonder geavanceerde opties
- **Content Container**: Container specifiek voor content areas

#### Layout Blocks
- **Content Column**: Flexibele kolom layouts
- **Tabs**: Tab interface voor content organisatie
- **Carousel**: Afbeelding/content carousel

#### Content Blocks
- **Card**: Bootstrap card component
- **Color Image Block**: Afbeelding met kleur overlay
- **Content**: Geavanceerde content block met extra styling opties

### Block Registration
```php
// Voorbeeld block registratie
function madeit_register_custom_blocks() {
    wp_register_script(
        'madeit-container-block',
        get_template_directory_uri() . '/gutenberg-v2/content-container/index.js',
        ['wp-blocks', 'wp-element', 'wp-components'],
        MADEIT_VERSION
    );

    register_block_type('madeit/container', [
        'editor_script' => 'madeit-container-block',
        'style'         => 'madeit-gutenberg-style',
        'editor_style'  => 'madeit-block-editor-styles',
    ]);
}
add_action('init', 'madeit_register_custom_blocks');
```

## Advanced Controls

### Block Inspector Controls
Custom controls voor geavanceerde block aanpassingen:

```javascript
// Voorbeeld: Padding/Margin controls
const { InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl, SelectControl } = wp.components;

<InspectorControls>
    <PanelBody title="Spacing" initialOpen={false}>
        <RangeControl
            label="Padding Top"
            value={paddingTop}
            onChange={(value) => setAttributes({ paddingTop: value })}
            min={0}
            max={100}
        />
        <RangeControl
            label="Padding Bottom"
            value={paddingBottom}
            onChange={(value) => setAttributes({ paddingBottom: value })}
            min={0}
            max={100}
        />
        <SelectControl
            label="Background Color"
            value={backgroundColor}
            options={[
                { label: 'None', value: '' },
                { label: 'Primary', value: 'bg-primary' },
                { label: 'Secondary', value: 'bg-secondary' },
            ]}
            onChange={(value) => setAttributes({ backgroundColor: value })}
        />
    </PanelBody>
</InspectorControls>
```

### Bootstrap Integration
Blocks maken gebruik van Bootstrap classes voor consistent styling:

```javascript
// Class names gebaseerd op Bootstrap
const className = classnames(
    'madeit-container',
    {
        [`bg-${backgroundColor}`]: backgroundColor,
        [`py-${paddingY}`]: paddingY,
        [`px-${paddingX}`]: paddingX,
        'container': containerType === 'container',
        'container-fluid': containerType === 'fluid',
    }
);
```

## Block Styling

### Custom CSS Classes
```css
/* Editor specifieke styling */
.wp-block-madeit-container {
    border: 1px dashed #ccc;
    min-height: 100px;
    position: relative;
}

.wp-block-madeit-container:before {
    content: "Container Block";
    position: absolute;
    top: 5px;
    left: 5px;
    font-size: 12px;
    color: #666;
    background: rgba(255,255,255,0.8);
    padding: 2px 5px;
}

/* Frontend styling */
.madeit-container {
    margin-bottom: 2rem;
}

.madeit-container.bg-primary {
    background-color: var(--madeit-primary-color);
    color: white;
}
```

### Responsive Utilities
```css
/* Responsive spacing utilities */
@media (min-width: 576px) {
    .py-sm-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
    .py-sm-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
    .py-sm-3 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
    .py-sm-4 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
    .py-sm-5 { padding-top: 3rem !important; padding-bottom: 3rem !important; }
}

@media (min-width: 768px) {
    .py-md-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
    /* etc... */
}
```

## Block Patterns

### Custom Block Patterns
```php
function madeit_register_block_patterns() {
    register_block_pattern(
        'madeit/hero-section',
        [
            'title'       => __('Hero Section', 'madeit'),
            'description' => __('A hero section with background image and call-to-action', 'madeit'),
            'content'     => '<!-- wp:madeit/container {"backgroundColor":"primary","paddingY":"5"} -->
                <div class="madeit-container bg-primary py-5">
                    <!-- wp:heading {"level":1,"textAlign":"center","textColor":"white"} -->
                    <h1 class="has-text-align-center has-white-color has-text-color">Welcome to Our Site</h1>
                    <!-- /wp:heading -->
                    
                    <!-- wp:paragraph {"align":"center","textColor":"white"} -->
                    <p class="has-text-align-center has-white-color has-text-color">This is a compelling hero section.</p>
                    <!-- /wp:paragraph -->
                    
                    <!-- wp:buttons {"contentJustification":"center"} -->
                    <div class="wp-block-buttons is-content-justification-center">
                        <!-- wp:button {"backgroundColor":"white","textColor":"primary"} -->
                        <div class="wp-block-button">
                            <a class="wp-block-button__link has-primary-color has-white-background-color has-text-color has-background">Get Started</a>
                        </div>
                        <!-- /wp:button -->
                    </div>
                    <!-- /wp:buttons -->
                </div>
                <!-- /wp:madeit/container -->',
            'categories'  => ['madeit'],
        ]
    );
}
add_action('init', 'madeit_register_block_patterns');
```

### Pattern Categories
```php
function madeit_register_pattern_categories() {
    register_block_pattern_category(
        'madeit',
        ['label' => __('Made I.T.', 'madeit')]
    );
    
    register_block_pattern_category(
        'madeit-layouts',
        ['label' => __('Made I.T. Layouts', 'madeit')]
    );
}
add_action('init', 'madeit_register_pattern_categories');
```

## Block Editor Customization

### Custom Toolbar Buttons
```javascript
// Voeg custom button toe aan toolbar
wp.data.dispatch('core/edit-post').registerPlugin('madeit-toolbar', {
    render: function() {
        return wp.element.createElement(
            wp.editPost.PluginSidebarMoreMenuItem,
            {
                target: 'madeit-sidebar',
                icon: 'admin-generic',
            },
            'Made I.T. Options'
        );
    }
});
```

### Custom Sidebar Panel
```javascript
wp.data.dispatch('core/edit-post').registerPlugin('madeit-sidebar', {
    render: function() {
        return wp.element.createElement(
            wp.editPost.PluginSidebar,
            {
                name: 'madeit-sidebar',
                icon: 'admin-generic',
                title: 'Made I.T. Settings',
            },
            wp.element.createElement(
                wp.components.PanelBody,
                { title: 'Page Settings' },
                wp.element.createElement(
                    wp.components.ToggleControl,
                    {
                        label: 'Full Width Layout',
                        checked: false,
                        onChange: function(value) {
                            // Handle change
                        }
                    }
                )
            )
        );
    }
});
```

## Block Variations

### Custom Block Variations
```php
function madeit_register_block_variations() {
    wp_enqueue_script(
        'madeit-block-variations',
        get_template_directory_uri() . '/assets/js/block-variations.js',
        ['wp-blocks', 'wp-dom-ready'],
        MADEIT_VERSION
    );
}
add_action('enqueue_block_editor_assets', 'madeit_register_block_variations');
```

```javascript
// Block variations JavaScript
wp.domReady(function() {
    wp.blocks.registerBlockVariation('core/group', {
        name: 'madeit-card',
        title: 'Card Layout',
        description: 'A card-style layout',
        icon: 'id-alt',
        attributes: {
            className: 'card',
            style: {
                border: {
                    width: '1px',
                    color: '#dee2e6',
                    style: 'solid'
                },
                borderRadius: '0.375rem'
            }
        },
        innerBlocks: [
            ['core/heading', { level: 3, placeholder: 'Card Title' }],
            ['core/paragraph', { placeholder: 'Card content...' }],
            ['core/button', { text: 'Read More' }]
        ],
        scope: ['inserter']
    });
});
```

## Block Theme.json Integration

### Theme.json Configuratie
```json
{
    "version": 2,
    "settings": {
        "color": {
            "palette": [
                {
                    "slug": "primary",
                    "color": "#0051A8",
                    "name": "Primary"
                },
                {
                    "slug": "secondary", 
                    "color": "#868e96",
                    "name": "Secondary"
                }
            ]
        },
        "spacing": {
            "spacingScale": {
                "operator": "*",
                "increment": 1.5,
                "steps": 7,
                "mediumStep": 1.5,
                "unit": "rem"
            }
        },
        "typography": {
            "fontSizes": [
                {
                    "slug": "small",
                    "size": "0.875rem",
                    "name": "Small"
                },
                {
                    "slug": "medium",
                    "size": "1rem", 
                    "name": "Medium"
                },
                {
                    "slug": "large",
                    "size": "1.25rem",
                    "name": "Large"
                }
            ]
        }
    }
}
```

## Performance Optimizations

### Conditional Block Loading
```php
function madeit_conditional_block_assets() {
    if (is_admin() || !has_blocks()) {
        return;
    }
    
    global $post;
    if (!$post || !has_blocks($post->post_content)) {
        return;
    }
    
    // Parse blocks en laad alleen benodigde assets
    $blocks = parse_blocks($post->post_content);
    $loaded_blocks = [];
    
    foreach ($blocks as $block) {
        if (!in_array($block['blockName'], $loaded_blocks)) {
            $loaded_blocks[] = $block['blockName'];
            madeit_load_block_assets($block['blockName']);
        }
    }
}
add_action('wp_enqueue_scripts', 'madeit_conditional_block_assets');
```

### Block Asset Loading
```php
function madeit_load_block_assets($block_name) {
    switch ($block_name) {
        case 'madeit/carousel':
            wp_enqueue_script('swiper-js');
            wp_enqueue_style('swiper-css');
            break;
            
        case 'madeit/tabs':
            wp_enqueue_script('bootstrap-tab');
            break;
            
        case 'madeit/container':
            // Geen extra assets nodig
            break;
    }
}
```

## Accessibility

### Block Accessibility Features
```javascript
// Accessibility attributes voor custom blocks
const blockProps = {
    'aria-label': attributes.ariaLabel,
    'role': attributes.role,
    'tabIndex': attributes.tabIndex
};

// Screen reader tekst
if (attributes.screenReaderText) {
    blockContent.push(
        wp.element.createElement(
            'span',
            { className: 'sr-only' },
            attributes.screenReaderText
        )
    );
}
```

### Focus Management
```css
/* Focus styling voor blocks */
.wp-block-madeit-container:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
}

.wp-block-madeit-container .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0,0,0,0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}
```

## Troubleshooting

### Veelvoorkomende Problemen

1. **Blocks worden niet geladen**
   - Controleer of `MADEIT_ADVANCED_BLOCKS` is ingesteld
   - Verificeer JavaScript console voor errors
   - Controleer bestandspaden

2. **Styling werkt niet**
   - Controleer of editor styles zijn geladen
   - Verificeer CSS specificity
   - Controleer Bootstrap versie compatibiliteit

3. **Custom colors werken niet**
   - Controleer `MADEIT_CUSTOM_COLOR` setting
   - Verificeer color palette configuratie
   - Controleer CSS variabelen

### Debug Mode
```php
// Block debug informatie
add_action('wp_footer', function() {
    if (WP_DEBUG && current_user_can('manage_options')) {
        global $post;
        if ($post && has_blocks($post->post_content)) {
            $blocks = parse_blocks($post->post_content);
            echo '<script>console.log("Blocks:", ' . json_encode($blocks) . ');</script>';
        }
    }
});
```

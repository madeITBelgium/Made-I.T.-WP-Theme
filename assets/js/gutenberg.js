wp.blocks.registerBlockStyle('core/gallery', {
    name: 'grid',
    label: 'Grid style'
});

wp.blocks.registerBlockStyle('core/gallery', {
    name: 'eq-height',
    label: 'Zelfde hoogte style'
});


wp.blocks.registerBlockStyle('core/image', {
    name: 'square',
    label: 'Square'
});

/**
 * Responsive columns for Query Loop Post Template (grid layout).
 * Adds tablet/mobile column controls and exposes CSS variables.
 */
( function ( wp ) {
    if ( ! wp || ! wp.hooks || ! wp.compose || ! wp.element ) {
        return;
    }

    var addFilter = wp.hooks.addFilter;
    var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
    var Fragment = wp.element.Fragment;

    var blockEditor = wp.blockEditor || wp.editor;
    if ( ! blockEditor || ! wp.components || ! wp.i18n ) {
        return;
    }

    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var RangeControl = wp.components.RangeControl;
    var __ = wp.i18n.__;

    var BLOCK_NAMES = [ 'core/post-template', 'core/group' ];

    /**
     * ---------------------------------------------------------
     * Helpers
     * ---------------------------------------------------------
     */

    function isSupportedBlock( name ) {
        return BLOCK_NAMES.includes( name );
    }

    function getLayoutType( attrs ) {
        return attrs?.layout?.type;
    }

    function getDisplayLayoutType( ctx ) {
        return ctx?.displayLayout?.type;
    }

    function getDisplayLayoutColumns( ctx ) {
        var cols = ctx?.displayLayout?.columns;
        return typeof cols === 'number' ? cols : undefined;
    }

    function getDesktopColumns( attrs ) {
        var val = attrs?.layout?.columnCount;
        return typeof val === 'number' ? val : undefined;
    }

    function hasResponsiveSettings( attrs ) {
        return (
            typeof attrs?.madeitColumnsTablet === 'number' ||
            typeof attrs?.madeitColumnsMobile === 'number'
        );
    }

    function isGridLayout( props ) {
        if ( ! props ) return false;

        var layoutType = getLayoutType( props.attributes );
        var displayLayoutType = getDisplayLayoutType( props.context );

        if ( props.name === 'core/group' ) {
            return layoutType === 'grid';
        }

        if ( props.name === 'core/post-template' ) {
            return layoutType === 'grid' || displayLayoutType === 'flex';
        }

        return false;
    }

    /**
     * ---------------------------------------------------------
     * Attributes
     * ---------------------------------------------------------
     */

    addFilter(
        'blocks.registerBlockType',
        'madeit/responsive-columns/attributes',
        function ( settings, name ) {

            if ( ! isSupportedBlock( name ) ) {
                return settings;
            }

            settings.attributes = Object.assign(
                {},
                settings.attributes,
                {
                    madeitColumnsTablet: { type: 'number' },
                    madeitColumnsMobile: { type: 'number' },
                }
            );

            return settings;
        }
    );

    /**
     * ---------------------------------------------------------
     * Inspector controls
     * ---------------------------------------------------------
     */

    var withControls = createHigherOrderComponent( function ( BlockEdit ) {
        return function ( props ) {

            if ( ! isSupportedBlock( props.name ) || ! isGridLayout( props ) ) {
                return wp.element.createElement( BlockEdit, props );
            }

            var desktopCols = getDesktopColumns( props.attributes );

            if ( typeof desktopCols !== 'number' ) {
                desktopCols = getDisplayLayoutColumns( props.context );
            }

            var tabletCols =
                typeof props.attributes.madeitColumnsTablet === 'number'
                    ? props.attributes.madeitColumnsTablet
                    : desktopCols;

            var mobileCols =
                typeof props.attributes.madeitColumnsMobile === 'number'
                    ? props.attributes.madeitColumnsMobile
                    : tabletCols;

            return wp.element.createElement(
                Fragment,
                null,

                wp.element.createElement( BlockEdit, props ),

                wp.element.createElement(
                    InspectorControls,
                    null,

                    wp.element.createElement(
                        PanelBody,
                        {
                            title: __( 'Raster – responsive kolommen', 'madeit' ),
                            initialOpen: false,
                        },

                        wp.element.createElement( RangeControl, {
                            label: __( 'Kolommen (tablet)', 'madeit' ),
                            value: typeof tabletCols === 'number' ? tabletCols : 1,
                            onChange: function ( value ) {
                                props.setAttributes({
                                    madeitColumnsTablet:
                                        typeof value === 'number' ? value : undefined,
                                });
                            },
                            min: 1,
                            max: 6,
                        }),

                        wp.element.createElement( RangeControl, {
                            label: __( 'Kolommen (mobiel)', 'madeit' ),
                            value: typeof mobileCols === 'number' ? mobileCols : 1,
                            onChange: function ( value ) {
                                props.setAttributes({
                                    madeitColumnsMobile:
                                        typeof value === 'number' ? value : undefined,
                                });
                            },
                            min: 1,
                            max: 6,
                        })
                    )
                )
            );
        };
    }, 'withControls' );

    addFilter(
        'editor.BlockEdit',
        'madeit/responsive-columns/controls',
        withControls
    );

    /**
     * ---------------------------------------------------------
     * Style vars
     * ---------------------------------------------------------
     */

    function addStyleVars( style, attrs ) {
        if ( ! hasResponsiveSettings( attrs ) ) {
            return style;
        }

        var next = Object.assign( {}, style );

        var desktop = getDesktopColumns( attrs );

        if ( typeof desktop === 'number' ) {
            next['--madeit-cols-desktop'] = String( desktop );
        }

        if ( typeof attrs.madeitColumnsTablet === 'number' ) {
            next['--madeit-cols-tablet'] = String( attrs.madeitColumnsTablet );
        }

        if ( typeof attrs.madeitColumnsMobile === 'number' ) {
            next['--madeit-cols-mobile'] = String( attrs.madeitColumnsMobile );
        }

        return next;
    }

    /**
     * ---------------------------------------------------------
     * Editor + frontend safe styling
     * (NO BlockListBlock override anymore)
     * ---------------------------------------------------------
     */

    addFilter(
        'blocks.getSaveContent.extraProps',
        'madeit/responsive-columns/save',
        function ( extraProps, blockType, attributes ) {

            if ( ! blockType || ! isSupportedBlock( blockType.name ) ) {
                return extraProps;
            }

            if ( ! isGridLayout( { name: blockType.name, attributes } ) ) {
                return extraProps;
            }

            var next = Object.assign( {}, extraProps );

            next.style = addStyleVars( next.style, attributes );

            return next;
        }
    );

} )( window.wp );

/**
 * Editor preview device sync + Elementor-like hidden-state visualization.
 *
 * - Adds `madeit-preview--desktop|tablet|mobile` on <body> based on Gutenberg preview.
 * - Adds `hide-desktop|hide-tablet|hide-mobile` classes to block wrappers in the editor
 *   when blocks have `hideOnDesktop|hideOnTablet|hideOnMobile` attributes.
 */
( function ( wp ) {
    if ( ! wp || ! wp.data || ! wp.element || ! wp.hooks ) return;

    var addFilter = wp.hooks.addFilter;
    var createElement = wp.element.createElement;

    var BODY_CLASSES = [
        'madeit-preview--desktop',
        'madeit-preview--tablet',
        'madeit-preview--mobile',
    ];

    var BOUND_CANVAS_IFRAMES = typeof WeakSet !== 'undefined' ? new WeakSet() : null;

    function normalizePreviewDeviceType( type ) {
        if ( ! type ) return 'desktop';

        // Gutenberg returns 'Desktop' | 'Tablet' | 'Mobile' (strings).
        var t = String( type ).toLowerCase();
        if ( t.indexOf( 'tablet' ) !== -1 ) return 'tablet';
        if ( t.indexOf( 'mobile' ) !== -1 ) return 'mobile';
        return 'desktop';
    }

    function getPreviewDeviceType() {
        try {
            // Post editor.
            var editPost = wp.data.select( 'core/edit-post' );
            if ( editPost && typeof editPost.__experimentalGetPreviewDeviceType === 'function' ) {
                return normalizePreviewDeviceType( editPost.__experimentalGetPreviewDeviceType() );
            }
        } catch ( e ) {}

        try {
            // Site editor.
            var editSite = wp.data.select( 'core/edit-site' );
            if ( editSite && typeof editSite.__experimentalGetPreviewDeviceType === 'function' ) {
                return normalizePreviewDeviceType( editSite.__experimentalGetPreviewDeviceType() );
            }
        } catch ( e2 ) {}

        return 'desktop';
    }

    function setBodyPreviewClass( device ) {
        if ( ! document ) return;

        function applyToDoc( doc ) {
            if ( ! doc ) return;
            var bodyEl = doc.body;
            if ( ! bodyEl || ! bodyEl.classList ) return;
            for ( var i = 0; i < BODY_CLASSES.length; i++ ) {
                bodyEl.classList.remove( BODY_CLASSES[ i ] );
            }
            bodyEl.classList.add( 'madeit-preview--' + device );
        }

        function getCanvasIframes() {
            var selectors = [
                'iframe.editor-canvas__iframe',
                'iframe[name="editor-canvas"]',
                // WP block editor canvas iframe (common in WP 6+).
                '.block-editor-iframe__container iframe',
                'iframe.block-editor-iframe__iframe',
                'iframe[class*="block-editor-iframe"]',
                // Fallbacks.
                'iframe[title*="Editor canvas"]',
                'iframe[title*="editor canvas"]',
                'iframe[title*="Block editor"]',
                'iframe[title*="block editor"]',
            ];

            var out = [];
            for ( var s = 0; s < selectors.length; s++ ) {
                try {
                    var found = document.querySelectorAll( selectors[ s ] );
                    if ( found && found.length ) {
                        for ( var f = 0; f < found.length; f++ ) {
                            out.push( found[ f ] );
                        }
                    }
                } catch ( e ) {}
            }

            // De-dupe.
            var unique = [];
            for ( var i = 0; i < out.length; i++ ) {
                if ( unique.indexOf( out[ i ] ) === -1 ) unique.push( out[ i ] );
            }
            return unique;
        }

        function ensureIframeBound( frame ) {
            if ( ! frame || typeof frame.addEventListener !== 'function' ) return;
            if ( BOUND_CANVAS_IFRAMES ) {
                if ( BOUND_CANVAS_IFRAMES.has( frame ) ) return;
                BOUND_CANVAS_IFRAMES.add( frame );
            } else {
                if ( frame.__madeitPreviewBound ) return;
                frame.__madeitPreviewBound = true;
            }

            frame.addEventListener( 'load', function () {
                try {
                    var doc = frame.contentDocument;
                    if ( doc && doc.body ) {
                        applyToDoc( doc );
                    }
                } catch ( e ) {}
            } );
        }

        // Outer editor UI document.
        applyToDoc( document );

        // Block editor canvas often runs in an iframe; mirror the class there too.
        var iframes = getCanvasIframes();
        for ( var j = 0; j < iframes.length; j++ ) {
            var frame = iframes[ j ];
            ensureIframeBound( frame );
            try {
                var frameDoc = frame && frame.contentDocument ? frame.contentDocument : null;
                if ( frameDoc && frameDoc.body ) {
                    applyToDoc( frameDoc );
                }
            } catch ( e2 ) {
                // Cross-origin shouldn't happen here, but ignore if it does.
            }
        }
    }

    function bootPreviewDeviceSync() {
        var last = null;

        function update() {
            var next = getPreviewDeviceType();
            if ( next === last ) return;
            last = next;
            setBodyPreviewClass( next );
        }

        update();

        // If the iframe is injected later (common), keep re-applying on DOM changes.
        try {
            if ( window.MutationObserver && document.body ) {
                var obs = new MutationObserver( function () {
                    setBodyPreviewClass( last || getPreviewDeviceType() );
                } );
                obs.observe( document.body, { childList: true, subtree: true } );
            }
        } catch ( e3 ) {}

        // Update on any store change (preview toolbar toggles).
        if ( typeof wp.data.subscribe === 'function' ) {
            wp.data.subscribe( update );
        }
    }

    // Add hide-* classes on the Gutenberg block wrapper in the editor for any block
    // that exposes hideOnDesktop/hideOnTablet/hideOnMobile attributes.
    // This makes global editor-only styling possible (greyed out blocks per preview device).
    addFilter(
        'editor.BlockListBlock',
        'madeit/responsive-visibility/wrapper-classes',
        function ( BlockListBlock ) {
            return function ( props ) {
                var attrs = ( props && props.attributes ) || {};

                var hideDesktop = !! attrs.hideOnDesktop;
                var hideTablet = !! attrs.hideOnTablet;
                var hideMobile = !! attrs.hideOnMobile;

                if ( ! hideDesktop && ! hideTablet && ! hideMobile ) {
                    return createElement( BlockListBlock, props );
                }

                var nextWrapperProps = Object.assign( {}, props.wrapperProps || {} );
                var base = ( nextWrapperProps.className || '' ).trim();
                var tokens = base.length ? base.split( /\s+/ ) : [];

                if ( hideDesktop && tokens.indexOf( 'hide-desktop' ) === -1 ) tokens.push( 'hide-desktop' );
                if ( hideTablet && tokens.indexOf( 'hide-tablet' ) === -1 ) tokens.push( 'hide-tablet' );
                if ( hideMobile && tokens.indexOf( 'hide-mobile' ) === -1 ) tokens.push( 'hide-mobile' );

                nextWrapperProps.className = tokens.join( ' ' );

                return createElement(
                    BlockListBlock,
                    Object.assign( {}, props, { wrapperProps: nextWrapperProps } )
                );
            };
        },
        50
    );

    if ( wp.domReady ) {
        wp.domReady( bootPreviewDeviceSync );
    } else if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', bootPreviewDeviceSync );
    } else {
        bootPreviewDeviceSync();
    }
} )( window.wp );



// POPUP

document.addEventListener('DOMContentLoaded', function () {
    // Alle subtab knoppen
    const subtabs = document.querySelectorAll('.m-popup-subtab');
    // Alle field groups van display
    const groups = {
        preset: document.querySelector('.acf-field-group[data-name="display_preset_group"]'),
        style: document.querySelector('.acf-field-group[data-name="display_style_group"]'),
        size: document.querySelector('.acf-field-group[data-name="display_size_group"]'),
        animation: document.querySelector('.acf-field-group[data-name="display_animation_group"]'),
        position: document.querySelector('.acf-field-group[data-name="display_position_group"]'),
    };

    console.log(groups);
    // Functie om groepen te toggelen
    function showGroup(tab) {
        for (let key in groups) {
            if (!groups[key]) continue;
            groups[key].style.display = (key === tab) ? 'block' : 'none';
        }

        console.log('function showGroup called with tab: ' + tab);
    }

    // Voeg click event toe aan elke subtab
    subtabs.forEach(function(tabBtn){
        tabBtn.addEventListener('click', function(){
            // active class
            subtabs.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // toon juiste groep
            const tabName = this.getAttribute('data-tab');
            showGroup(tabName);
        });

        console.log('clickEvent' + tabBtn.getAttribute('data-tab'));
    });

    // Init: toon preset groep standaard
    showGroup('preset');
    const firstTab = document.querySelector('.m-popup-subtab[data-tab="preset"]');
    const fieldGroep = document.querySelector('.acf-field-group[name="group_display_preset"]');
    if (firstTab) firstTab.classList.add('active');
    if (fieldGroep) fieldGroep.style.display = 'block';
    



});
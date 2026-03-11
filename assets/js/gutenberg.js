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
    if ( ! wp || ! wp.hooks || ! wp.compose || ! wp.element ) return;

    var addFilter = wp.hooks.addFilter;
    var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
    var Fragment = wp.element.Fragment;

    // WP changed the package name from `wp.editor` to `wp.blockEditor`.
    var blockEditor = wp.blockEditor || wp.editor;
    if ( ! blockEditor || ! wp.components || ! wp.i18n ) return;

    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var RangeControl = wp.components.RangeControl;
    var __ = wp.i18n.__;

    var BLOCK_NAME = 'core/post-template';

    var getLayoutType = function ( attrs ) {
        return attrs && attrs.layout && attrs.layout.type ? attrs.layout.type : undefined;
    };

    var getDisplayLayoutType = function ( ctx ) {
        return ctx && ctx.displayLayout && ctx.displayLayout.type
            ? ctx.displayLayout.type
            : undefined;
    };

    var getDisplayLayoutColumns = function ( ctx ) {
        var cols = ctx && ctx.displayLayout ? ctx.displayLayout.columns : undefined;
        return typeof cols === 'number' ? cols : undefined;
    };

    var getDesktopColumns = function ( attrs ) {
        var count = attrs && attrs.layout ? attrs.layout.columnCount : undefined;
        return typeof count === 'number' ? count : undefined;
    };

    addFilter(
        'blocks.registerBlockType',
        'madeit/post-template-responsive-columns/attributes',
        function ( settings, name ) {
            if ( name !== BLOCK_NAME ) return settings;

            settings.attributes = Object.assign( {}, settings.attributes, {
                madeitColumnsTablet: { type: 'number' },
                madeitColumnsMobile: { type: 'number' },
            } );

            return settings;
        }
    );

    var withResponsiveColumnsControls = createHigherOrderComponent( function ( BlockEdit ) {
        return function ( props ) {
            if ( props.name !== BLOCK_NAME ) {
                return wp.element.createElement( BlockEdit, props );
            }

            var layoutType = getLayoutType( props.attributes );
            var displayLayoutType = getDisplayLayoutType( props.context );

            // Support both true grid layout and the flex-based grid (Query displayLayout).
            if ( layoutType !== 'grid' && displayLayoutType !== 'flex' ) {
                return wp.element.createElement( BlockEdit, props );
            }

            var desktopCols =
                getDesktopColumns( props.attributes ) || getDisplayLayoutColumns( props.context );

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
                                props.setAttributes( {
                                    madeitColumnsTablet:
                                        typeof value === 'number' ? value : undefined,
                                } );
                            },
                            min: 1,
                            max: 6,
                        } ),
                        wp.element.createElement( RangeControl, {
                            label: __( 'Kolommen (mobiel)', 'madeit' ),
                            value: typeof mobileCols === 'number' ? mobileCols : 1,
                            onChange: function ( value ) {
                                props.setAttributes( {
                                    madeitColumnsMobile:
                                        typeof value === 'number' ? value : undefined,
                                } );
                            },
                            min: 1,
                            max: 6,
                        } )
                    )
                )
            );
        };
    }, 'withResponsiveColumnsControls' );

    addFilter(
        'editor.BlockEdit',
        'madeit/post-template-responsive-columns/controls',
        withResponsiveColumnsControls
    );

    var addStyleVars = function ( style, attrs ) {
        var desktopCols = getDesktopColumns( attrs );
        var tabletCols =
            typeof attrs.madeitColumnsTablet === 'number'
                ? attrs.madeitColumnsTablet
                : undefined;
        var mobileCols =
            typeof attrs.madeitColumnsMobile === 'number'
                ? attrs.madeitColumnsMobile
                : undefined;

        if (
            typeof desktopCols !== 'number' &&
            typeof tabletCols !== 'number' &&
            typeof mobileCols !== 'number'
        ) {
            return style;
        }

        var nextStyle = Object.assign( {}, style );
        if ( typeof desktopCols === 'number' ) {
            nextStyle['--madeit-pt-cols-desktop'] = String( desktopCols );
        }
        if ( typeof tabletCols === 'number' ) {
            nextStyle['--madeit-pt-cols-tablet'] = String( tabletCols );
        }
        if ( typeof mobileCols === 'number' ) {
            nextStyle['--madeit-pt-cols-mobile'] = String( mobileCols );
        }
        return nextStyle;
    };

    addFilter(
        'editor.BlockListBlock',
        'madeit/post-template-responsive-columns/editor-wrapper-props',
        function ( BlockListBlock ) {
            return function ( props ) {
                if ( props.name !== BLOCK_NAME ) {
                    return wp.element.createElement( BlockListBlock, props );
                }

                var nextWrapperProps = Object.assign( {}, props.wrapperProps );
                nextWrapperProps.style = addStyleVars( nextWrapperProps.style, props.attributes );

                return wp.element.createElement(
                    BlockListBlock,
                    Object.assign( {}, props, { wrapperProps: nextWrapperProps } )
                );
            };
        }
    );

    addFilter(
        'blocks.getSaveContent.extraProps',
        'madeit/post-template-responsive-columns/save-style-props',
        function ( extraProps, blockType, attributes ) {
            if ( blockType && blockType.name !== BLOCK_NAME ) return extraProps;
            if ( ! attributes ) return extraProps;

            var nextExtraProps = Object.assign( {}, extraProps );
            nextExtraProps.style = addStyleVars( nextExtraProps.style, attributes );
            return nextExtraProps;
        }
    );
} )( window.wp );

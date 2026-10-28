import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import './editor.scss';

import metadata from './../block.json';
import edit from './edit';
import save from './save';
import icon from './icon';
import deprecatedV2 from './deprecated-v2';

import classnames from 'classnames';
import { InnerBlocks, getColorClassName, RichText } from '@wordpress/block-editor';

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit,
    save,

    // Deprecated versie van de block om oude content zonder padding vars te valideren.
    deprecated: [
        deprecatedV2,
        {
            attributes: {
                backgroundColor: { type: 'string' },
                customBackgroundColor: { type: 'string' },
                textColor: { type: 'string' },
                customTextColor: { type: 'string' },
                hasTitle: { type: 'boolean', default: false },
                cardTitle: { type: 'string' },
                level: { type: 'number', default: 2 },
                mediaBleed: { type: 'boolean', default: false },
                paddingTop: { type: 'string' },
                paddingRight: { type: 'string' },
                paddingBottom: { type: 'string' },
                paddingLeft: { type: 'string' },
                paddingUnit: { type: 'string', default: 'px' },
                contentPadding: { type: 'object' },
                contentPaddingTablet: { type: 'object' },
                contentPaddingMobile: { type: 'object' },
                minHeight: { type: 'number', default: 0 },
                minHeightUnit: { type: 'string', default: 'px' },
                alignItems: { type: 'string', default: 'stretch' },
                borderHover: { type: 'boolean', default: false },
                borderHoverType: { type: 'string', default: 'none' },
                borderType: { type: 'string', default: 'none' },
                borderWidth: { type: 'object', default: { top: '1px', right: '1px', bottom: '1px', left: '1px' } },
                borderWidthUnit: { type: 'string', default: 'px' },
                borderColor: { type: 'string', default: 'transparent' },
                borderHoverWidth: { type: 'object', default: { top: '1px', right: '1px', bottom: '1px', left: '1px' } },
                borderHoverWidthUnit: { type: 'string', default: 'px' },
                borderHoverColor: { type: 'string', default: 'transparent' },
                borderRadius: { type: 'object', default: { top: '0px', right: '0px', bottom: '0px', left: '0px' } },
                borderRadiusUnit: { type: 'string', default: 'px' },
                boxShadow: { type: 'object', default: {} },
                shadowHover: { type: 'string', default: 'default' },
                boxShadowHover: { type: 'object', default: {} },
                url: { type: 'string' },
                opensInNewTab: { type: 'boolean', default: false },
                linkTarget: { type: 'string' },
                hideOnDesktop: { type: 'boolean' },
                hideOnTablet: { type: 'boolean' },
                hideOnMobile: { type: 'boolean' },
                aosFade: { type: 'string', default: '' },
                aosDelay: { type: 'string', default: '' },
                aosDelayCustom: { type: 'string', default: '' }
            },
            migrate: (attributes) => {
                const nextPadding = attributes.contentPadding || {
                    top: attributes.paddingTop || '20px',
                    right: attributes.paddingRight || '20px',
                    bottom: attributes.paddingBottom || '20px',
                    left: attributes.paddingLeft || '20px'
                };

                return {
                    ...attributes,
                    contentPadding: nextPadding,
                    paddingUnit: attributes.paddingUnit || 'px',
                    minHeight: attributes.minHeight ?? 0,
                    minHeightUnit: attributes.minHeightUnit || 'px',
                    alignItems: attributes.alignItems || 'stretch',
                    borderHover: attributes.borderHover === true || attributes.borderHover === 'hover' ? 'hover' : 'default',
                    borderHoverType: attributes.borderHoverType || 'none',
                    borderType: attributes.borderType || 'none',
                    borderWidth: attributes.borderWidth || { top: '1px', right: '1px', bottom: '1px', left: '1px' },
                    borderWidthUnit: attributes.borderWidthUnit || 'px',
                    borderColor: attributes.borderColor || 'transparent',
                    borderHoverWidth: attributes.borderHoverWidth || { top: '1px', right: '1px', bottom: '1px', left: '1px' },
                    borderHoverWidthUnit: attributes.borderHoverWidthUnit || 'px',
                    borderHoverColor: attributes.borderHoverColor || attributes.borderColor || 'transparent',
                    borderRadius: attributes.borderRadius || { top: '0px', right: '0px', bottom: '0px', left: '0px' },
                    borderRadiusUnit: attributes.borderRadiusUnit || 'px',
                    boxShadow: attributes.boxShadow || {},
                    shadowHover: attributes.shadowHover || 'default',
                    boxShadowHover: attributes.boxShadowHover || {},
                    aosFade: attributes.aosFade || '',
                    aosDelay: attributes.aosDelay || '',
                    aosDelayCustom: attributes.aosDelayCustom || ''
                };
            },
            save: (props) => {
                const {
                    customBackgroundColor,
                    backgroundColor,
                    customTextColor,
                    textColor,
                    cardTitle,
                    level,
                    hasTitle,
                    mediaBleed,
                    contentPadding,
                    minHeight,
                    minHeightUnit,
                    alignItems,
                    borderHover,
                    borderHoverType,
                    borderType,
                    borderWidth,
                    borderColor,
                    borderHoverWidth,
                    borderHoverColor,
                    borderRadius,
                    boxShadow,
                    url,
                    opensInNewTab,
                    linkTarget
                } = props.attributes;

                const { className } = props;
                const backgroundColorClass = backgroundColor
                    ? getColorClassName('background-color', backgroundColor)
                    : undefined;
                const textColorClass = textColor
                    ? getColorClassName('color', textColor)
                    : undefined;
                const TagName = 'h' + level;

                let wrapperClasses = classnames(className, {
                    card: true
                });

                wrapperClasses = classnames(wrapperClasses, {
                    'has-media-bleed': !!mediaBleed
                });

                wrapperClasses = classnames(wrapperClasses, {
                    'has-text-color': textColorClass,
                    'has-background': backgroundColorClass,
                    [backgroundColorClass]: backgroundColorClass,
                    [textColorClass]: textColorClass
                });

                const styleVars = {};
                const safePadding = contentPadding && typeof contentPadding === 'object'
                    ? contentPadding
                    : {
                        top: '1.25rem',
                        right: '1.25rem',
                        bottom: '1.25rem',
                        left: '1.25rem'
                    };

                if (safePadding.top || safePadding.right || safePadding.bottom || safePadding.left) {
                    styleVars['--madeit-card-content-padding-top'] = safePadding.top;
                    styleVars['--madeit-card-content-padding-right'] = safePadding.right;
                    styleVars['--madeit-card-content-padding-bottom'] = safePadding.bottom;
                    styleVars['--madeit-card-content-padding-left'] = safePadding.left;
                }

                if (minHeight > 0) {
                    styleVars['--madeit-card-min-height'] = `${ minHeight }${ minHeightUnit || 'px' }`;
                }

                if (alignItems && alignItems !== 'stretch') {
                    styleVars['--madeit-card-align-items'] = alignItems;
                }

                const hasCustomBorderWidth = borderWidth && typeof borderWidth === 'object' && Object.values(borderWidth).some((value) => value && value !== '1px' && value !== '0px');
                const hasCustomHoverBorderWidth = borderHoverWidth && typeof borderHoverWidth === 'object' && Object.values(borderHoverWidth).some((value) => value && value !== '1px' && value !== '0px');
                const hasCustomBorderColor = !!borderColor && borderColor !== 'transparent';
                const hasCustomHoverBorderColor = !!borderHoverColor && borderHoverColor !== 'transparent' && borderHoverColor !== borderColor;

                if (borderType && borderType !== 'none') {
                    styleVars['--madeit-card-border-style'] = borderType;
                    if (hasCustomBorderWidth) {
                        styleVars['--madeit-card-border-width'] = [ borderWidth.top ?? '1px', borderWidth.right ?? '1px', borderWidth.bottom ?? '1px', borderWidth.left ?? '1px' ].join(' ');
                    }
                    if (hasCustomBorderColor) {
                        styleVars['--madeit-card-border-color'] = borderColor;
                    }
                }

                if ((borderHover === 'hover' || borderHover === true) && borderHoverType && borderHoverType !== 'none') {
                    styleVars['--madeit-card-border-hover-style'] = borderHoverType;
                    if (hasCustomHoverBorderWidth) {
                        styleVars['--madeit-card-border-hover-width'] = [ borderHoverWidth.top ?? '1px', borderHoverWidth.right ?? '1px', borderHoverWidth.bottom ?? '1px', borderHoverWidth.left ?? '1px' ].join(' ');
                    }
                    if (hasCustomHoverBorderColor) {
                        styleVars['--madeit-card-border-hover-color'] = borderHoverColor;
                    }
                }

                if (borderRadius && typeof borderRadius === 'object') {
                    const radiusCss = [
                        borderRadius.top ?? '0px',
                        borderRadius.right ?? '0px',
                        borderRadius.bottom ?? '0px',
                        borderRadius.left ?? '0px'
                    ].join(' ');

                    if (radiusCss !== '0px 0px 0px 0px') {
                        styleVars['--madeit-card-border-radius'] = radiusCss;
                    }
                }

                if (boxShadow && typeof boxShadow === 'object') {
                    const shadowCss = (boxShadow.inset ? 'inset ' : '') + `${ boxShadow.x ?? boxShadow.horizontal ?? '0px' } ${ boxShadow.y ?? boxShadow.vertical ?? '0px' } ${ boxShadow.blur ?? '0px' } ${ boxShadow.spread ?? '0px' } ${ boxShadow.color || 'rgba(0, 0, 0, 0.15)' }`;
                    if (shadowCss && shadowCss !== 'none' && shadowCss !== '0px 0px 0px 0px rgba(0, 0, 0, 0.15)') {
                        styleVars['--madeit-card-box-shadow'] = shadowCss;
                    }
                }

                const style = {
                    backgroundColor: backgroundColorClass
                        ? undefined
                        : customBackgroundColor,
                    color: textColorClass ? undefined : customTextColor,
                    ...styleVars
                };

                const cardUrl = typeof url === 'object' && url !== null ? url.url : url;
                const target = opensInNewTab || (linkTarget === '_blank') ? '_blank' : undefined;
                const rel = target ? 'noopener' : undefined;

                return (
                    <div className={wrapperClasses} style={style}>
                        {cardUrl ? (
                            <>
                                <a href={cardUrl} className="card-link" target={target} rel={rel}></a>
                                {hasTitle && (
                                    <div className="card-header">
                                        <TagName>
                                            <RichText.Content value={cardTitle} />
                                        </TagName>
                                    </div>
                                )}
                                <div className="card-body">
                                    <InnerBlocks.Content />
                                </div>
                            </>
                        ) : (
                            <>
                                {hasTitle && (
                                    <div className="card-header">
                                        <TagName>
                                            <RichText.Content value={cardTitle} />
                                        </TagName>
                                    </div>
                                )}
                                <div className="card-body">
                                    <InnerBlocks.Content />
                                </div>
                            </>
                        )}
                    </div>
                );
            }
        }
    ]
});

import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import './editor.scss';

import metadata from './../block.json';
import edit from './edit';
import save from './save';
import icon from './icon';

import classnames from 'classnames';
import { InnerBlocks, getColorClassName, RichText } from '@wordpress/block-editor';

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit,
    save,

    // Deprecated versie van de block om oude content zonder padding vars te valideren.
    deprecated: [
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
                paddingUnit: { type: 'string' },
                contentPadding: { type: 'object' },
                contentPaddingTablet: { type: 'object' },
                contentPaddingMobile: { type: 'object' }
            },
            migrate: (attributes) => {
                const nextPadding = attributes.contentPadding || {
                    top: attributes.paddingTop || '1.25rem',
                    right: attributes.paddingRight || '1.25rem',
                    bottom: attributes.paddingBottom || '1.25rem',
                    left: attributes.paddingLeft || '1.25rem'
                };

                return {
                    ...attributes,
                    contentPadding: nextPadding
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
                    mediaBleed
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

                const style = {
                    backgroundColor: backgroundColorClass
                        ? undefined
                        : customBackgroundColor,
                    color: textColorClass ? undefined : customTextColor
                };

                return (
                    <div className={wrapperClasses} style={style}>
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
                    </div>
                );
            }
        }
    ]
});

import {
    useBlockProps,
    InnerBlocks
} from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';

export default function Save({ attributes }) {

    const {
        title,
        showIcon = false,
        iconType = 'fontawesome',
        icon = '',
        iconColor = '',
    } = attributes;

    return (
        <div
            {...useBlockProps.save({ className: 'madeit-tab-panel tab-pane fade' })}
            data-title={title}
            data-show-icon={showIcon ? '1' : '0'}
            data-icon-type={iconType}
            data-icon={icon}
            data-icon-color={iconColor || ''}
            role="tabpanel"
        >
            {showIcon && iconType === 'custom' && icon ? (
                <template className="madeit-tab-custom-svg" aria-hidden="true">
                    <RawHTML>{icon}</RawHTML>
                </template>
            ) : null}
            <InnerBlocks.Content />
        </div>
    );
}

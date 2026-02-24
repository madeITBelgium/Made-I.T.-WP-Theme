import {
    useBlockProps,
    InnerBlocks,
} from '@wordpress/block-editor';

export default function Edit({ clientId, context }) {
    const activeTabClientId = context?.['madeit/activeTabClientId'] || '';
    const isActive = !activeTabClientId || activeTabClientId === clientId;

    return (
        <div
            {...useBlockProps({
                className: `madeit-tab-panel tab-pane fade${isActive ? ' active show' : ''}`,
                style: isActive ? undefined : { display: 'none' },
            })}
        >
            <InnerBlocks renderAppender={InnerBlocks.ButtonBlockAppender} />
        </div>
    );
}

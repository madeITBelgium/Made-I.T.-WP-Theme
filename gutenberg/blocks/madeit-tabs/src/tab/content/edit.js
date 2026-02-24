import {
    useBlockProps,
    InnerBlocks,
    RichText
} from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {

    const { title } = attributes;

    return (
        <div
            {...useBlockProps({
                className: 'madeit-tab-content',
            })}
        >

            <InnerBlocks />

        </div>
    );
}

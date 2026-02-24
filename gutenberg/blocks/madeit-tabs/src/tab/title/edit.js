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
                className: 'madeit-tab-title',
            })}
        >

            <RichText
                tagName="h4"
                value={title}
                onChange={(value) => setAttributes({ title: value })}
                placeholder="Tab titel"
                className="madeit-tab-title-editor"
            />

            {/* <InnerBlocks /> */}

        </div>
    );
}

/**
 * BLOCK: madeit-video-lightbox
 */

import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';

import './style.scss';
import './editor.scss';

const icon = {
    src: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <path
                d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                stroke="#476a8a"
                strokeWidth="1.8"
            />

            <path
                d="M10 8L16 12L10 16V8Z"
                fill="#476a8a"
            />
        </svg>
    ),
};

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: Save,
});
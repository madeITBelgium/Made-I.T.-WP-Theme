import { registerBlockType } from '@wordpress/blocks';

import metadata from '../block.json';

import Edit from './edit';
import save from './save';

// These generate build/style-index.css and build/index.css via @wordpress/scripts.
import './style.scss';
import './editor.scss';

const icon = {
    src: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 30 30"
            version="1.1"
        >
            <g>
                <path
                    d="M4,22L2,22L2,4C2.001,2.903 2.903,2.001 4,2L22,2L22,4L4,4L4,22Z"
                    fill="rgb(28,172,180)"
                    fillRule="nonzero"
                />
                <path
                    d="M21,17C22.646,17 24,15.646 24,14C24,12.354 22.646,11 21,11C19.354,11 18,12.354 18,14C18.002,15.645 19.355,16.998 21,17ZM21,13C21.549,13 22,13.451 22,14C22,14.549 21.549,15 21,15C20.451,15 20,14.549 20,14C20,13.452 20.452,13 21,13Z"
                    fill="rgb(71,106,138)"
                    fillRule="nonzero"
                />
                <path
                    d="M28,7L9,7C7.903,7.001 7.001,7.903 7,9L7,28C7.001,29.097 7.903,29.999 9,30L28,30C29.097,29.999 29.999,29.097 30,28L30,9C29.999,7.903 29.097,7.001 28,7ZM28,28L9,28L9,22L13,18.003L18.586,23.589C19.362,24.365 20.638,24.365 21.414,23.589L23,22.003L28,27L28,28ZM28,24.172L24.414,20.586C23.638,19.81 22.362,19.81 21.586,20.586L20,22.172L14.414,16.586C13.638,15.81 12.362,15.81 11.586,16.586L9,19.172L9,9L28,9L28,24.172Z"
                    fill="rgb(71,106,138)"
                    fillRule="nonzero"
                />
                <rect x="0" y="0" width="30" height="30" fill="none" />
            </g>
        </svg>
    ),
};

registerBlockType( metadata.name, {
	title: metadata.title,
	icon: icon,
	category: metadata.category,
	keywords: metadata.keywords,
	attributes: metadata.attributes,
	supports: metadata.supports || {},
	edit: Edit,
	save,
} );

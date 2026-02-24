/**
 * BLOCK: slider
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import './style.scss';

const icon = {
    src: (
        <svg xmlns="http://www.w3.org/2000/svg"width="24" height="24" viewBox="0 0 200 154" version="1.1">
            <g transform="matrix(1,0,0,1,-249.594603,-25.218512)">
                <g id="SVGRepo_iconCarrier" transform="matrix(13.333333,0,0,13.333333,222.5497,-41.031488)">
                    <g transform="matrix(0.06,0,0,0.07,-11.5,3.5)">
                        <path 
                        d="M393,34.433L393,163.504C393,172.039 386.176,178.969 377.772,178.969L323.228,178.969C314.824,178.969 308,172.039 308,163.504L308,34.433C308,25.898 314.824,18.969 323.228,18.969L377.772,18.969C386.176,18.969 393,25.898 393,34.433Z"
                        fill="none"
                        stroke="rgb(71,106,138)"
                        strokeWidth="14.08px"
                        fillRule="nonzero"
                        />
                    </g>
                    <g transform="matrix(0.03094,0,0,0.054438,-7.032526,5.144863)">
                        <path d="M393,36.956L393,160.981C393,170.909 378.819,178.969 361.353,178.969L339.647,178.969C322.181,178.969 308,170.909 308,160.981L308,36.956C308,27.028 322.181,18.969 339.647,18.969L361.353,18.969C378.819,18.969 393,27.028 393,36.956Z" 
                        fill="none"
                        stroke="rgb(28,172,180)"
                        strokeWidth="21.17px"
                        fillRule="nonzero"
                        />
                    </g>
                    <g transform="matrix(0.03094,0,0,0.054438,4.357953,5.144863)">
                        <path d="M393,36.956L393,160.981C393,170.909 378.819,178.969 361.353,178.969L339.647,178.969C322.181,178.969 308,170.909 308,160.981L308,36.956C308,27.028 322.181,18.969 339.647,18.969L361.353,18.969C378.819,18.969 393,27.028 393,36.956Z" 
                        fill="none"
                        stroke="rgb(28,172,180)"
                        strokeWidth="21.17px"
                        fillRule="nonzero"
                        />
                    </g>
                </g>
            </g>
        </svg>
    ),
};

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: Save,
});

// Register child block
import './image';
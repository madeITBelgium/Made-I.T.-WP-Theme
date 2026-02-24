import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.scss';
import './editor.scss';

registerBlockType('madeit/slider-image', {
    title: 'Slider Afbeelding',
    icon: 'format-image',
    parent: ['madeit/slider'],
    supports: {
        reusable: false,
        html: false
    },
    attributes: {
        url: { type: 'string' },
        alt: { type: 'string' },
        id: { type: 'number' },
        focalPoint: {
            type: 'object',
            default: { x: 0.5, y: 0.5 }
        }
    },
    edit: Edit,
    save: Save
});

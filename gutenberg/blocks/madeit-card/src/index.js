import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import './editor.scss';

import metadata from './../block.json';
import edit from './edit';
import save from './save';
import icon from './icon';

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit,
    save,
});

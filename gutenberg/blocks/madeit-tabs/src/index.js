// Entry point for the Tabs block bundle.
// Import the main block and all child blocks so they are registered in the editor.
import './style.scss';
import './editor.scss';

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import Save, { deprecated } from './save';
import icon from './icon';

// Register child blocks used via InnerBlocks.
import './tab';

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: Save,
    deprecated,
});
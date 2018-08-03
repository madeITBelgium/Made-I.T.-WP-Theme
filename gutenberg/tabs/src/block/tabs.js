//  Import CSS.
import './style.scss';
import './editor.scss';

import { times } from 'lodash';
import memoize from 'memize';

export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const { TextControl } = wp.components

export const {
    InspectorControls,
    BlockControls,
    RichText,
} = wp.editor.InspectorControls ? wp.editor : wp.blocks

export const ALLOWED_BLOCKS = [ 'madeit/block-tabs-title', 'madeit/block-tabs-content' ];

export const getTabsTemplate = memoize( ( tabs ) => {
    var content = [
        ['madeit/block-tabs-titles', {aantaltabs: tabs}, times( tabs, (i) => [ 'madeit/block-tabs-title', {tabid: i} ] ) ],
        ['madeit/block-tabs-contents', {aantaltabs: tabs}, times( tabs, (i) => [ 'madeit/block-tabs-content', {tabid: i} ] ) ],
    ];
    return content;
} );

export const edit = ( props ) => {
    const {
        isSelected,
        setAttributes,
        className,
        focus,
        setFocus,
    } = props

    const {
        aantaltabs
    } = props.attributes
    
    return [
        <div>
            <wp.editor.InnerBlocks
                    template={ getTabsTemplate( aantaltabs ) }
                    templateLock="all"
                    allowedBlocks={ ALLOWED_BLOCKS } />
            {
                isSelected &&
                <InspectorControls key='inspector'>
                    <TextControl
                        label={ __( 'Aantal tabs' ) }
                        value={ aantaltabs }
                        type='number'
                        onChange={ ( value ) => setAttributes( { aantaltabs: value } ) }
                    />
                </InspectorControls>
            }
        </div>
    ];
}

export const save = ( props ) => {
    const {
        aantaltabs,
    } = props.attributes;
    
    const {
        className
    } = props
    
    return (
        <div className={ className }>
            <wp.editor.InnerBlocks.Content />
        </div>
    );


    var content = (
        <div className={className}>       
            <ul class="nav nav-tabs" role="tablist">
                {
                    aantaltabs >= 1 &&
                    <li class="nav-item">
                        <a class="nav-link active" id={ slugify(tab1_title) + '-tab' } data-toggle="tab" href={'#' + slugify(tab1_title) } role="tab" aria-controls={ slugify(tab1_title) } aria-selected="true">{tab1_title}</a>
                    </li>
                }
                {
                    aantaltabs >= 2 &&
                    <li class="nav-item">
                        <a class="nav-link" id={ slugify(tab2_title) + '-tab' } data-toggle="tab" href={'#' + slugify(tab2_title) } role="tab" aria-controls={ slugify(tab2_title) } aria-selected="true">{tab2_title}</a>
                    </li>
                }
                {
                    aantaltabs >= 3 &&
                    <li class="nav-item">
                        <a class="nav-link" id={ slugify(tab3_title) + '-tab' } data-toggle="tab" href={'#' + slugify(tab3_title) } role="tab" aria-controls={ slugify(tab3_title) } aria-selected="true">{tab3_title}</a>
                    </li>
                }
                {
                    aantaltabs >= 4 &&
                    <li class="nav-item">
                        <a class="nav-link" id={ slugify(tab4_title) + '-tab' } data-toggle="tab" href={'#' + slugify(tab4_title) } role="tab" aria-controls={ slugify(tab4_title) } aria-selected="true">{tab4_title}</a>
                    </li>
                }
                {
                    aantaltabs >= 5 &&
                    <li class="nav-item">
                        <a class="nav-link" id={ slugify(tab5_title) + '-tab' } data-toggle="tab" href={'#' + slugify(tab5_title) } role="tab" aria-controls={ slugify(tab5_title) } aria-selected="true">{tab5_title}</a>
                    </li>
                }
            </ul>
            <div class="tab-content">
                {
                    aantaltabs >= 1 &&
                    <div class="tab-pane fade show active" id={ slugify(tab1_title) } role="tabpanel" aria-labelledby={ slugify(tab1_title) + '-tab'}>{ tab1_content }</div>
                }
                {
                    aantaltabs >= 2 &&
                    <div class="tab-pane fade" id={ slugify(tab2_title) } role="tabpanel" aria-labelledby={ slugify(tab2_title) + '-tab'}>{ tab2_content }</div>
                }
                {
                    aantaltabs >= 3 &&
                    <div class="tab-pane fade" id={ slugify(tab3_title) } role="tabpanel" aria-labelledby={ slugify(tab3_title) + '-tab'}>{ tab3_content }</div>
                }
                {
                    aantaltabs >= 4 &&
                    <div class="tab-pane fade" id={ slugify(tab4_title) } role="tabpanel" aria-labelledby={ slugify(tab4_title) + '-tab'}>{ tab4_content }</div>
                }
                {
                    aantaltabs >= 5 &&
                    <div class="tab-pane fade" id={ slugify(tab5_title) } role="tabpanel" aria-labelledby={ slugify(tab5_title) + '-tab'}>{ tab5_content }</div>
                }
            </div>
        </div>
    );
    return content;
}

registerBlockType( 'madeit/block-tabs', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Tabs - Made IT Block' ), // Block title.
    icon: 'editor-kitchensink', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'tabs' ),
        __( 'Made IT' ),
        __( 'Made I.T.' ),
    ],

    attributes: {
        aantaltabs: {
            type: 'number',
            default: '3',
        },
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
} )
//  Import CSS.
import './style.scss';
import './editor.scss';

export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const { RangeControl } = wp.components

export const {
    InspectorControls,
    BlockControls,
    RichText,
} = wp.editor.InspectorControls ? wp.editor : wp.blocks

export const el = wp.element.createElement;

export const slugify = (text) => {
    if(text === undefined) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export const edit = ( props ) => {
    const {
        isSelected,
        setAttributes,
        className,
        focus,
        setFocus,
    } = props

    const {
        aantaltabs,
        tab1_title,
        tab1_content,
        tab2_title,
        tab2_content,
        tab3_title,
        tab3_content,
        tab4_title,
        tab4_content,
        tab5_title,
        tab5_content
    } = props.attributes
    
    return [
        <div>
            {
                aantaltabs >= 1  &&
                <div>
                    <h2>Tab 1</h2>
                    <h4>Title</h4>
                    <RichText
                        tagName='p'
                        onChange={ ( value ) => setAttributes( { tab1_title: value } ) }
                        value={ tab1_title }
                        focus={ focus }
                        onFocus={ setFocus } /><br />
                    <h4>Content</h4>
                    <RichText
                        tagName='p'
                        onChange={ ( value ) => setAttributes( { tab1_content: value } ) }
                        value={ tab1_content }
                        focus={ focus }
                        onFocus={ setFocus } />
                    <hr />
                </div>
            }
            {
                aantaltabs >= 2  &&
                <div>
                    <h2>Tab 2</h2>
                    <h4>Title</h4>
                    <RichText
                        tagName='p'
                        onChange={ ( value ) => setAttributes( { tab2_title: value } ) }
                        value={ tab2_title }
                        focus={ focus }
                        onFocus={ setFocus } /><br />
                    <h4>Content</h4>
                    <RichText
                        tagName='p'
                        onChange={ ( value ) => setAttributes( { tab2_content: value } ) }
                        value={ tab2_content }
                        focus={ focus }
                        onFocus={ setFocus } />
                    <hr />
                </div>
            }
            {
                aantaltabs >= 3  &&
                <div>
                    <h2>Tab 3</h2>
                    <h4>Title</h4>
                    <RichText
                        tagName='p'
                        onChange={ ( value ) => setAttributes( { tab3_title: value } ) }
                        value={ tab3_title }
                        focus={ focus }
                        onFocus={ setFocus } /><br />
                    <h4>Content</h4>
                    <RichText
                        tagName='p'
                        onChange={ ( value ) => setAttributes( { tab3_content: value } ) }
                        value={ tab3_content }
                        focus={ focus }
                        onFocus={ setFocus } />
                    <hr />
                </div>
            }
            {
                aantaltabs >= 4  &&
                <div>
                    <h2>Tab 4</h2>
                    <h4>Title</h4>
                    <RichText
                        tagName='p'
                        onChange={ ( value ) => setAttributes( { tab4_title: value } ) }
                        value={ tab4_title }
                        focus={ focus }
                        onFocus={ setFocus } /><br />
                    <h4>Content</h4>
                    <RichText
                        tagName='p'
                        onChange={ ( value ) => setAttributes( { tab4_content: value } ) }
                        value={ tab4_content }
                        focus={ focus }
                        onFocus={ setFocus } />
                    <hr />
                </div>
            }
            {
                aantaltabs >= 5  &&
                <div>
                    <h2>Tab 5</h2>
                    <h4>Title</h4>
                    <RichText
                        tagName='p'
                        onChange={ ( value ) => setAttributes( { tab5_title: value } ) }
                        value={ tab5_title }
                        focus={ focus }
                        onFocus={ setFocus } /><br />
                    <h4>Content</h4>
                    <RichText
                        tagName='p'
                        onChange={ ( value ) => setAttributes( { tab5_content: value } ) }
                        value={ tab5_content }
                        focus={ focus }
                        onFocus={ setFocus } />
                    <hr />
                </div>
            }
            {
                isSelected &&
                <InspectorControls key='inspector'>
                    <RangeControl
                        label={ __( 'Aantal tabs' ) }
                        value={ aantaltabs }
                        min='0'
                        max='5'
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
        tab1_title,
        tab1_content,
        tab2_title,
        tab2_content,
        tab3_title,
        tab3_content,
        tab4_title,
        tab4_content,
        tab5_title,
        tab5_content
    } = props.attributes;
    
    const {
        className
    } = props
    
    console.log('save');
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
    console.log(content);
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
        tab1_title: {
            type: 'string'
        },
        tab1_content: {
            type: 'string'
        },
        tab2_title: {
            type: 'string'
        },
        tab2_content: {
            type: 'string'
        },
        tab3_title: {
            type: 'string'
        },
        tab3_content: {
            type: 'string'
        },
        tab4_title: {
            type: 'string'
        },
        tab4_content: {
            type: 'string'
        },
        tab5_title: {
            type: 'string'
        },
        tab5_content: {
            type: 'string'
        }
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
} )
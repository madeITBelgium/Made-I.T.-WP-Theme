/*
( function( window, wp ){

    // just to keep it cleaner - we refer to our link by id for speed of lookup on DOM.
    var link_id = 'madeit_support_ticket';

    // prepare our custom link's html.
    var link_html = '<a id="' + link_id + '" class="components-button is-tertiary thickbox" title="Made IT Support Ticket aanmaken" href="#TB_inline?width=600&height=550&inlineId=modal-madeit-support">Made I.T. Support</a>';

    // check if gutenberg's editor root element is present.
    var editorEl = document.getElementById( 'editor' );
    if( !editorEl ){ // do nothing if there's no gutenberg root element on page.
        return;
    }

    var unsubscribe = wp.data.subscribe( function () {
        setTimeout( function () {
            if ( !document.getElementById( link_id ) ) {
                var toolbalEl = editorEl.querySelector( '.editor-header__toolbar' );
                if( toolbalEl instanceof HTMLElement ){
                    toolbalEl.insertAdjacentHTML( 'beforeend', link_html );
                }
            }
        }, 1 )
    } );
    // unsubscribe is a function - it's not used right now 
    // but in case you'll need to stop this link from being reappeared at any point you can just call unsubscribe();

} )( window, wp );
*/

( function( window, wp ){

    // just to keep it cleaner - we refer to our link by id for speed of lookup on DOM.
    var link_id = 'madeit_pagebuilder_help';

    // prepare our custom link's html.
    var link_html = '<a id="' + link_id + '" class="components-button is-tertiary thickbox" title="Made IT Pagebuilder Help" href="#TB_inline?width=600&height=550&inlineId=modal-madeit-pagebuilder-help">Made I.T. Support</a>';

    // check if gutenberg's editor root element is present.
    var editorEl = document.getElementById( 'editor' );
    if( !editorEl ){ // do nothing if there's no gutenberg root element on page.
        return;
    }

    var unsubscribe = wp.data.subscribe( function () {
        setTimeout( function () {
            if ( !document.getElementById( link_id ) ) {
                var toolbalEl = editorEl.querySelector( '.editor-header__toolbar' );
                if( toolbalEl instanceof HTMLElement ){
                    toolbalEl.insertAdjacentHTML( 'beforeend', link_html );
                }
            }
        }, 1 )
    } );
    // unsubscribe is a function - it's not used right now 
    // but in case you'll need to stop this link from being reappeared at any point you can just call unsubscribe();

} )( window, wp );
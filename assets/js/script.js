/*global escape: true, unescape: true */

jQuery( document ).ready( function( $ ) {
    var lightboxGroup;
    var gutenbergGallery = false;

    $( '.lightbox' ).each( function( ) {
        if($( this ).parent( ).hasClass('no-lightbox')) {
            return;
        }
        if ( ( undefined === $( this ).parent( ).tagName && 'a' === $( this ).parent( )[0].localName ) || 'a' === $( this ).parent( ).tagName ) {
            $( this ).parent( ).addClass( 'click-lightbox' );
        } else {
            $( this ).wrap( '<a href="' + $( this ).attr( 'src' ) + '" class="click-lightbox"></a>' );
        }
        $( this ).removeClass( 'lightbox' );
    });

    $( 'body' ).append( '<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" id="lightbox-modal"><div class="modal-dialog modal-lg"><div class="modal-content"></div></div></div>' );

    $( '.click-lightbox' ).click( function( e ) {
        var url = $( this ).attr( 'href' );
        var group, index, total, leftIndex, rightIndex, leftUrl, rightUrl;
        e.preventDefault();
        if ( ! url.endsWith( '.jpg' ) && ! url.endsWith( '.png' ) ) {
            url = $( this ).find( 'img:eq(0)' ).attr( 'src' );
        }

        if ( $( this ).parents( '.lightbox-group' ).length ) {
            group = $( this ).parents( '.lightbox-group' )[0];
            lightboxGroup = group;
            gutenbergGallery = false;

            index = $( group ).find( '.click-lightbox' ).index( this );
            total = $( group ).find( '.click-lightbox' ).length - 1;

            leftIndex = index > 0 ? index - 1 : total;
            rightIndex = index < total ? index + 1 : 0;

            leftUrl = $( group ).find( '.click-lightbox:eq(' + leftIndex + ')' ).attr( 'href' );
            rightUrl = $( group ) .find( '.click-lightbox:eq(' + rightIndex + ')' ).attr( 'href' );

            $( '#lightbox-modal .modal-content' ).html( '<div class="lightbox-nav-overlay"><a href="' + leftUrl + '" data-index="' + leftIndex + '"><span>❮</span></a><a href="' + rightUrl + '" data-index="' + rightIndex + '"><span>❯</span></a></div><img src="' + url + '" alt="" style="width: 100%">' );
        } else {
            $( '#lightbox-modal .modal-content' ).html( '<img src="' + url + '" alt="" style="width: 100%">' );
        }
        $( '#lightbox-modal' ).modal( 'show' );
    });

    $( '#lightbox-modal' ).on( 'click', '.lightbox-nav-overlay a', function( e ) {
        e.preventDefault( );
        if(!gutenbergGallery) {
            $( lightboxGroup ).find( '.click-lightbox:eq(' + $( this ).attr( 'data-index' ) + ')' ).click( );
        }
        else {
            $( lightboxGroup ).find( 'a:eq(' + $( this ).attr( 'data-index' ) + ')' ).click( );
        }
    });
    
    $('.wp-block-gallery').each(function() {
        if($(this).find('a').length > 0 && !$(this).hasClass('no-lightbox')) {
            var id = makeid();
            $(this).attr('data-galary-id', id);
        }
    });
    
    $('.wp-block-gallery[data-galary-id] a').click(function(e) {
        var url = $( this ).attr( 'href' );
        var group, index, total, leftIndex, rightIndex, leftUrl, rightUrl;
        e.preventDefault();
        if ( ! url.endsWith( '.jpg' ) && ! url.endsWith( '.png' ) ) {
            url = $( this ).find( 'img:eq(0)' ).attr( 'src' );
        }

        if ( $( this ).parents( '.wp-block-gallery' ).length ) {
            group = $( this ).parents( '.wp-block-gallery' )[0];
            lightboxGroup = group;
            gutenbergGallery = true;

            index = $( group ).find( 'a' ).index( this );
            total = $( group ).find( 'a' ).length - 1;

            leftIndex = index > 0 ? index - 1 : total;
            rightIndex = index < total ? index + 1 : 0;

            leftUrl = $( group ).find( 'a:eq(' + leftIndex + ')' ).attr( 'href' );
            rightUrl = $( group ) .find( 'a:eq(' + rightIndex + ')' ).attr( 'href' );

            $( '#lightbox-modal .modal-content' ).html( '<div class="lightbox-nav-overlay"><a href="' + leftUrl + '" data-index="' + leftIndex + '"><span>❮</span></a><a href="' + rightUrl + '" data-index="' + rightIndex + '"><span>❯</span></a></div><img src="' + url + '" alt="" style="width: 100%">' );
        } else {
            $( '#lightbox-modal .modal-content' ).html( '<img src="' + url + '" alt="" style="width: 100%">' );
        }
        $( '#lightbox-modal' ).modal( 'show' );
    });
    
    document.onkeyup = function(e) {
        if($('#lightbox-modal').is(":visible") && $('#lightbox-modal .lightbox-nav-overlay a').length > 0) {
            if(e.which == 37) {
                //left
                $('#lightbox-modal .lightbox-nav-overlay a:eq(0)').click();
            }
            else if(e.which == 39) {
                //right
                $('#lightbox-modal .lightbox-nav-overlay a:eq(1)').click();
            }
        }
    };

    //Cookie notice
    checkCookieEu();

    function checkCookieEu()
    {

        var consent = getCookieEU( 'cookies_consent' );

        if ( null == consent || '' === consent || undefined === consent ) {

            //Show notification bar
            if ( $( '#cookie_directive_container' ).hasClass( 'modal' ) ) {
                $( '#cookie_directive_container' ).modal( 'show' );
            } else {
                $( '#cookie_directive_container' ).show( );
            }
        }
    }

    function setCookieEu( cName, value, exdays ){
        var cValue, exdate = new Date( );
        exdate.setDate( exdate.getDate( ) + exdays );
        cValue = escape( value ) + ( ( null == exdays ) ? '' : '; expires=' + exdate.toUTCString( ) );
        document.cookie = cName + '=' + cValue + '; path=/';

        if ( $( '#cookie_directive_container' ).hasClass( 'modal' ) ) {
            $( '#cookie_directive_container' ).modal( 'hide' );
        } else {
            $( '#cookie_directive_container' ).hide( 'slow' );
        }
    }

    function getCookieEU( cName ) {
        var i, x, y, ARRcookies = document.cookie.split( ';' );
        for ( i = 0; i < ARRcookies.length; i++ ) {
            x = ARRcookies[i].substr( 0, ARRcookies[i].indexOf( '=' ) );
            y = ARRcookies[i].substr( ARRcookies[i].indexOf( '=' ) + 1 );
            x = x.replace( /^\s+|\s+$/g, '' );
            if ( x === cName ) {
                return unescape( y );
            }
        }
    }

    $( '#cookie_accept .btn' ).click( function( e ) {
        e.preventDefault();
        setCookieEu( 'cookies_consent', 1, 30 );
    });
    
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
});

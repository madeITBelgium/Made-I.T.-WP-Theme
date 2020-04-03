/*global escape: true, unescape: true */

/* IE 11 Fix */
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

jQuery( document ).ready( function( $ ) {
    var lightboxGroup;
    var gutenbergGallery = false;

    $( '.lightbox' ).each( function( ) {
        if ( $( this ).parent( ).hasClass( 'no-lightbox' ) || $( this ).parents( '.wp-block-image' ).hasClass( 'no-lightbox' ) ) {
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

            $( '#lightbox-modal .modal-content' ).html( '' +
                '<div class="modal-header">' +
                    '<button type="button" aria-label="Close" data-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
                '</div>' +
                '<div class="lightbox-nav-overlay">' +
                    '<a href="' + leftUrl + '" data-index="' + leftIndex + '"><span>❮</span></a>' +
                    '<a href="' + rightUrl + '" data-index="' + rightIndex + '"><span>❯</span></a>' +
                '</div>' +
                '<img src="' + url + '" alt="" style="width: 100%">'
            );
        } else {
            $( '#lightbox-modal .modal-content' ).html( '' +
                '<div class="modal-header">' +
                    '<button type="button" aria-label="Close" data-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
                '</div>' +
                '<img src="' + url + '" alt="" style="width: 100%">'
            );
        }
        $( '#lightbox-modal' ).modal( 'show' );
    });

    $( '#lightbox-modal' ).on( 'click', '.lightbox-nav-overlay a', function( e ) {
        e.preventDefault( );
        if ( ! gutenbergGallery ) {
            $( lightboxGroup ).find( '.click-lightbox:eq(' + $( this ).attr( 'data-index' ) + ')' ).click( );
        } else {
            $( lightboxGroup ).find( 'a:eq(' + $( this ).attr( 'data-index' ) + ')' ).click( );
        }
    });

    $( '.wp-block-gallery, .woocommerce-product-gallery__wrapper' ).each( function( ) {
        var id;
        if ( $( this ).find( 'a' ).length > 0 && ! $( this ).hasClass( 'no-lightbox' ) ) {
            id = makeid( );
            $( this ).attr( 'data-galary-id', id );
        }
    });

    $( '.wp-block-gallery[data-galary-id] a' ).click( function( e ) {
        var url = $( this ).attr( 'href' );
        var group, index, total, leftIndex, rightIndex, leftUrl, rightUrl;
        var hasDescription = false;
        var description = '';
        var descHtml = '';
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

            if ( $( this ).parents( '.blocks-gallery-item' ).length > 0 ) {
                hasDescription = 1 === $( this ).parents( '.blocks-gallery-item' ).find( 'figcaption' ).length;
                if ( hasDescription ) {
                    description = $( this ).parents( '.blocks-gallery-item' ).find( 'figcaption:eq(0)' ).html();
                }
            }

            if ( hasDescription && description.length > 0 ) {
                descHtml = '<div class="bg-white">' + description + '</div>';
            }

            $( '#lightbox-modal .modal-content' ).html( '' +
                '<div class="modal-header">' +
                    '<button type="button" aria-label="Close" data-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
                '</div>' +
                '<div class="lightbox-nav-overlay">' +
                    '<a href="' + leftUrl + '" data-index="' + leftIndex + '"><span>❮</span></a>' +
                    '<a href="' + rightUrl + '" data-index="' + rightIndex + '"><span>❯</span></a>' +
                '</div><img src="' + url + '" alt="" style="width: 100%">' + descHtml );
        } else {
            $( '#lightbox-modal .modal-content' ).html( '<div class="modal-header">' +
                    '<button type="button" aria-label="Close" data-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
                '</div>' +
                '<img src="' + url + '" alt="" style="width: 100%">' );
        }
        $( '#lightbox-modal' ).modal( 'show' );
    });

    $( '.woocommerce-product-gallery__wrapper[data-galary-id] a' ).click( function( e ) {
        var url = $( this ).attr( 'href' );
        var group, index, total, leftIndex, rightIndex, leftUrl, rightUrl;
        var hasDescription = false;
        var description = '';
        var descHtml = '';
        e.preventDefault();
        if ( ! url.endsWith( '.jpg' ) && ! url.endsWith( '.png' ) ) {
            url = $( this ).find( 'img:eq(0)' ).attr( 'src' );
        }

        if ( $( this ).parents( '.woocommerce-product-gallery__wrapper' ).length ) {
            group = $( this ).parents( '.woocommerce-product-gallery__wrapper' )[0];
            lightboxGroup = group;
            gutenbergGallery = true;

            index = $( group ).find( 'a' ).index( this );
            total = $( group ).find( 'a' ).length - 1;

            leftIndex = index > 0 ? index - 1 : total;
            rightIndex = index < total ? index + 1 : 0;

            leftUrl = $( group ).find( 'a:eq(' + leftIndex + ')' ).attr( 'href' );
            rightUrl = $( group ) .find( 'a:eq(' + rightIndex + ')' ).attr( 'href' );
            
            $( '#lightbox-modal .modal-content' ).html( '' +
                '<div class="modal-header">' +
                    '<button type="button" aria-label="Close" data-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
                '</div>' +
                '<div class="lightbox-nav-overlay">' +
                    '<a href="' + leftUrl + '" data-index="' + leftIndex + '"><span>❮</span></a>' +
                    '<a href="' + rightUrl + '" data-index="' + rightIndex + '"><span>❯</span></a>' +
                '</div><img src="' + url + '" alt="" style="width: 100%">');
        } else {
            $( '#lightbox-modal .modal-content' ).html( '<div class="modal-header">' +
                    '<button type="button" aria-label="Close" data-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
                '</div>' +
                '<img src="' + url + '" alt="" style="width: 100%">' );
        }
        $( '#lightbox-modal' ).modal( 'show' );
    });

    document.onkeyup = function( e ) {
        if ( $( '#lightbox-modal' ).is( ':visible' ) && $( '#lightbox-modal .lightbox-nav-overlay a' ).length > 0 ) {
            if ( 37 === e.which ) {

                //Left
                $( '#lightbox-modal .lightbox-nav-overlay a:eq(0)' ).click( );
            } else if ( 39 === e.which ) {

                //Right
                $( '#lightbox-modal .lightbox-nav-overlay a:eq(1)' ).click( );
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

    function setCookieEu( cName, value, exdays ) {
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
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var i = 0;

        for ( i = 0; i < 5; i++ ) {
            text += possible.charAt( Math.floor( Math.random( ) * possible.length ) );
        }

        return text;
    }
});


jQuery(document).ready( function( $ ) {
    $('.wp-block-madeit-block-tabs').each(function() {
        var i = 0;
        var elm = $(this);
        $(this).find('.nav-tabs a').each(function() {
            var href = $(this).attr('href').substr(1, $(this).attr('href').length);
            var text = '';
            var possible = 'abcdefghijklmnopqrstuvwxyz';
            var i = 0;

            for ( i = 0; i < 10; i++ ) {
                text += possible.charAt( Math.floor( Math.random( ) * possible.length ) );
            }
            var id = text;
            $(this).attr('href', '#' + id);
            elm.find('.wp-block-madeit-block-tabs-content[aria-labelledby=\'' + href + '-tab\']').prop('id', id);
            i++;
        });
    });
});

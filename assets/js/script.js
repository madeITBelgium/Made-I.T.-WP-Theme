jQuery( document ).ready( function( $ ) {
    var lightboxGroup;

    $( '.lightbox' ).each( function( ) {
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
        $( lightboxGroup ).find( '.click-lightbox:eq(' + $( this ).attr( 'data-index' ) + ')' ).click( );
    });
    
    //Cookie notice
    checkCookie_eu();

    function checkCookie_eu()
    {

        var consent = getCookie_eu("cookies_consent");

        if (consent == null || consent === "" || consent === undefined)
        {
            // show notification bar
            if($('#cookie_directive_container').hasClass('modal')) {
                $('#cookie_directive_container').modal('show');
            }
            else {
                $('#cookie_directive_container').show();
            }
        }

    }

    function setCookie_eu(c_name,value,exdays)
    {

        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie = c_name + "=" + c_value+"; path=/";
        
        if($('#cookie_directive_container').hasClass('modal')) {
            $('#cookie_directive_container').modal('hide');
        }
        else {
            $('#cookie_directive_container').hide('slow');
        }
    }


    function getCookie_eu(c_name)
    {
        var i,x,y,ARRcookies=document.cookie.split(";");
        for (i=0;i<ARRcookies.length;i++)
        {
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x==c_name)
            {
                return unescape(y);
            }
        }
    }

    $("#cookie_accept .btn").click(function() {
        setCookie_eu("cookies_consent", 1, 30);
    });
});

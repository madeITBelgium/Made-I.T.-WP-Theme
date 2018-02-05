jQuery( document ).ready( function( $ ) {
    var lightboxGroup;
    
    $( '.lightbox' ).each( function( ) {
        if ( ( $( this ).parent( ).tagName === undefined && 'a' == $( this ).parent( )[0].localName ) || 'a' === $( this ).parent( ).tagName ) {
            $( this ).parent( ).addClass( 'click-lightbox' );
        } else {
            $( this ).wrap( '<a href="' + $( this ).attr( 'src' ) + '" class="click-lightbox"></a>' );
        }
        $( this ).removeClass( 'lightbox' );
    });

    $( 'body' ).append( '<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" id="lightbox-modal"><div class="modal-dialog modal-lg"><div class="modal-content"></div></div></div>' );

    $( '.click-lightbox' ).click( function( e ) {
        e.preventDefault();
        var url = $( this ).attr( 'href' );
        if( !url.endsWith( '.jpg' ) && !url.endsWith( '.png' )) {
            url = $( this ).find( 'img:eq(0)' ).attr( 'src' );
        }
        
        if ( $( this ).parents( '.lightbox-group' ).length ) {
            
            var group = $( this ).parents( '.lightbox-group' )[0];
            lightboxGroup = group;
            
            var index = $( group ).find( '.click-lightbox' ).index( this );
            var total = $( group ).find( '.click-lightbox' ).length - 1;
            
            var leftIndex = index > 0 ? index - 1 : total;
            var rightIndex = index < total ? index + 1: 0;
            
            var leftUrl = $( group ).find( '.click-lightbox:eq(' + leftIndex + ')' ).attr( 'href' );
            var rightUrl = $( group) .find( '.click-lightbox:eq(' + rightIndex + ')' ).attr( 'href' );
            
            $( '#lightbox-modal .modal-content' ).html( '<div class="lightbox-nav-overlay"><a href="' + leftUrl + '" data-index="' + leftIndex + '"><span>❮</span></a><a href="' + rightUrl + '" data-index="' + rightIndex + '"><span>❯</span></a></div><img src="' + url + '" alt="" style="width: 100%">' );
        } else {
            $( '#lightbox-modal .modal-content' ).html( '<img src="' + url + '" alt="" style="width: 100%">' );
        }
        $( '#lightbox-modal' ).modal( 'show' );
    });
    
    $('#lightbox-modal').on('click', '.lightbox-nav-overlay a', function(e) {
        e.preventDefault();
        $( lightboxGroup ).find( '.click-lightbox:eq(' + $(this).attr('data-index') + ')' ).click();
    });
});

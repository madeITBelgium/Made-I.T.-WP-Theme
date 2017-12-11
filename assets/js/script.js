$( function( ) {
    $( '.lightbox' ).each( function( ) {
        if ( $( this ).parent( ).tagName == "a" ) {
            $( this ).parent( ).addClass('click-lightbox');
        }
        else {
            $(this).wrap('<a href="' + $(this).attr('src') + '" class="click-lightbox"></a>');
        }
        $( this ).removeClass( 'lightbox' );
    });
    
    $('body').append('<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" id="lightbox-modal"><div class="modal-dialog modal-lg"><div class="modal-content"></div></div></div>');
    
    $('.click-lightbox').click(function(e) {
        e.preventDefault();
        $('#lightbox-modal .modal-content').html('<img src="' + $(this).find('img:eq(0)').attr('src') + '" alt="" style="width: 100%">');
        $('#lightbox-modal').modal('show');
    });
});
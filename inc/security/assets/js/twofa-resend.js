(function(){
    'use strict';
    var cfg = window.madeitSecurity2faCfg || {};
    var btn = document.getElementById( 'madeit-security-resend-btn' );
    if ( ! btn ) return;

    btn.addEventListener( 'click', function() {
        btn.disabled = true;
        btn.textContent = 'Sending...';

        var fd = new FormData();
        fd.append( 'action', 'madeit_security_2fa_resend' );
        fd.append( 'token', cfg.token );
        fd.append( 'nonce', cfg.nonce );

        fetch( cfg.ajaxUrl, { method: 'POST', body: fd } )
            .then( function( r ) { return r.json(); } )
            .then( function( d ) {
                btn.textContent = d.success ? 'Code re-sent!' : 'Could not resend.';
                setTimeout( function() { btn.textContent = 'Resend code'; btn.disabled = false; }, 60000 );
            } )
            .catch( function() {
                btn.textContent = 'Error';
                setTimeout( function() { btn.textContent = 'Resend code'; btn.disabled = false; }, 5000 );
            } );
    } );
})();
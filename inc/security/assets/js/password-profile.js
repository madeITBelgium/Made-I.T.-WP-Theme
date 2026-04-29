(function(){
    'use strict';

    var cfg = window.madeitSecurityPasswordCfg || {};

    function waitForPasswordField() {
        var wrap = document.querySelector( '.wp-pwd' );
        if ( ! wrap ) {
            setTimeout( waitForPasswordField, 500 );
            return;
        }
        injectUI( wrap );
    }

    function createEl( tag, attrs, children ) {
        var el = document.createElement( tag );
        if ( attrs ) {
            Object.keys( attrs ).forEach( function( k ) {
                if ( k === 'cssText' ) { el.style.cssText = attrs[k]; }
                else { el.setAttribute( k, attrs[k] ); }
            });
        }
        if ( children ) {
            children.forEach( function( c ) {
                if ( typeof c === 'string' ) { el.appendChild( document.createTextNode( c ) ); }
                else if ( c ) { el.appendChild( c ); }
            });
        }
        return el;
    }

    function rIconEl( ok ) {
        var span = document.createElement( 'span' );
        if ( ok ) {
            span.style.color = '#00a32a';
            span.style.fontWeight = 'bold';
            span.textContent = '\u2713';
        } else {
            span.style.color = '#999';
            span.textContent = '\u25CB';
        }
        return span;
    }

    function makeReqItem( id, text ) {
        var div = createEl( 'div', { id: id, 'class': 'madeit-security-req-item' } );
        div.appendChild( rIconEl( false ) );
        div.appendChild( document.createTextNode( ' ' + text ) );
        return div;
    }

    function injectUI( wrap ) {
        var btn = createEl( 'button', {
            type: 'button',
            id: 'madeit-security-suggest-passphrase',
            'class': 'button button-secondary',
            cssText: 'font-size:13px'
        }, [ '\uD83C\uDFB2 Suggest Passphrase' ] );

        var entropySpan = createEl( 'span', {
            id: 'madeit-security-passphrase-entropy',
            cssText: 'font-size:12px;color:#666;display:none'
        } );

        var btnRow = createEl( 'div', { cssText: 'margin:8px 0 12px;display:flex;align-items:center;gap:8px' }, [ btn, entropySpan ] );
        wrap.parentNode.insertBefore( btnRow, wrap.nextSibling );

        var strong = createEl( 'strong', { cssText: 'display:block;margin-bottom:6px' }, [ 'Password Requirements:' ] );
        var checklist = createEl( 'div', {
            id: 'madeit-security-pw-requirements',
            cssText: 'margin:8px 0 0;padding:10px 14px;background:#f6f7f7;border:1px solid #ddd;border-radius:4px;font-size:13px;display:none'
        }, [
            strong,
            makeReqItem( 'madeit-security-req-length', 'At least ' + cfg.minLength + ' characters' ),
            cfg.requireUpper   ? makeReqItem( 'madeit-security-req-upper',   'Uppercase letter (A-Z)' )           : null,
            cfg.requireLower   ? makeReqItem( 'madeit-security-req-lower',   'Lowercase letter (a-z)' )           : null,
            cfg.requireNumber  ? makeReqItem( 'madeit-security-req-number',  'Number (0-9)' )                     : null,
            cfg.requireSpecial ? makeReqItem( 'madeit-security-req-special', 'Special character (!@#$ etc.)' )    : null,
            cfg.blockCommon    ? makeReqItem( 'madeit-security-req-common',  'Not a commonly breached password' ) : null
        ] );
        btnRow.parentNode.insertBefore( checklist, btnRow.nextSibling );

        var pass1 = document.getElementById( 'pass1' );
        if ( pass1 ) {
            pass1.addEventListener( 'input', function() { validateLive( this.value ); } );
            pass1.addEventListener( 'focus', function() { checklist.style.display = 'block'; } );
        }

        btn.addEventListener( 'click', function( e ) {
            e.preventDefault();
            generatePassphrase();
        } );
    }

    function updateReq( id, ok ) {
        var el = document.getElementById( id );
        if ( ! el ) return;
        var span = el.querySelector( 'span' );
        if ( span ) {
            var newIcon = rIconEl( ok );
            el.replaceChild( newIcon, span );
        }
    }

    function validateLive( pw ) {
        var cl = document.getElementById( 'madeit-security-pw-requirements' );
        if ( cl ) cl.style.display = 'block';

        updateReq( 'madeit-security-req-length',  pw.length >= cfg.minLength );
        updateReq( 'madeit-security-req-upper',   /[A-Z]/.test( pw ) );
        updateReq( 'madeit-security-req-lower',   /[a-z]/.test( pw ) );
        updateReq( 'madeit-security-req-number',  /[0-9]/.test( pw ) );
        updateReq( 'madeit-security-req-special', /[^A-Za-z0-9]/.test( pw ) );
        updateReq( 'madeit-security-req-common', pw.length >= cfg.minLength );
    }

    function generatePassphrase() {
        var btn = document.getElementById( 'madeit-security-suggest-passphrase' );
        btn.disabled = true;
        btn.textContent = 'Generating\u2026';

        var data = new FormData();
        data.append( 'action', 'madeit_security_generate_passphrase' );
        data.append( 'nonce', cfg.nonce );
        data.append( 'words', '5' );
        data.append( 'separator', '-' );

        fetch( cfg.ajaxUrl, { method: 'POST', body: data, credentials: 'same-origin' } )
            .then( function( r ) { return r.json(); } )
            .then( function( json ) {
                btn.disabled = false;
                btn.textContent = '\uD83C\uDFB2 Suggest Passphrase';

                if ( json.success && json.data && json.data.passphrase ) {
                    var pass1 = document.getElementById( 'pass1' );
                    var pass2 = document.getElementById( 'pass2' );
                    if ( pass1 ) {
                        var toggle = document.querySelector( '.wp-hide-pw' );
                        if ( toggle ) toggle.click();

                        pass1.value = json.data.passphrase;
                        pass1.setAttribute( 'type', 'text' );
                        pass1.dispatchEvent( new Event( 'input', { bubbles: true } ) );
                    }
                    if ( pass2 ) pass2.value = json.data.passphrase;

                    var entropy = document.getElementById( 'madeit-security-passphrase-entropy' );
                    if ( entropy ) {
                        entropy.style.display = 'inline';
                        entropy.textContent = '\u2248' + json.data.entropy + ' bits of entropy';
                    }

                    validateLive( json.data.passphrase );
                }
            } )
            .catch( function() {
                btn.disabled = false;
                btn.textContent = '\uD83C\uDFB2 Suggest Passphrase';
            } );
    }

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', waitForPasswordField );
    } else {
        waitForPasswordField();
    }
})();
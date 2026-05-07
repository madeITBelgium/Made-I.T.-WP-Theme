/**
 * 2FA Profile Page
 * Handles: TOTP setup, Email OTP setup, disable 2FA, recovery code regeneration
 */
/* global madeitSecurity2fa, jQuery */
( function ( $ ) {
    'use strict';

    // ── AJAX helper ──────────────────────────────────────────────────────────
    function ajax( action, data ) {
        data = data || {};
        data.action = action;
        data.nonce  = madeitSecurity2fa.nonce;
        return $.post( madeitSecurity2fa.ajax_url, data );
    }

    // ── Start Setup Button ───────────────────────────────────────────────────
    $( document ).on( 'click', '#madeit-security-2fa-start-setup', function () {
        var method = $( '#madeit-security-2fa-method-select' ).val();
        $( this ).hide();

        if ( method === 'totp' ) {
            $( '#madeit-security-totp-setup' ).show();
            $( '#madeit-security-email-setup' ).hide();
            // Auto-generate TOTP secret
            generateTOTP();
        } else {
            $( '#madeit-security-email-setup' ).show();
            $( '#madeit-security-totp-setup' ).hide();
        }
    } );

    // ── Method selector change ───────────────────────────────────────────────
    $( document ).on( 'change', '#madeit-security-2fa-method-select', function () {
        var method = $( this ).val();
        if ( $( '#madeit-security-totp-setup' ).is( ':visible' ) || $( '#madeit-security-email-setup' ).is( ':visible' ) ) {
            if ( method === 'totp' ) {
                $( '#madeit-security-totp-setup' ).show();
                $( '#madeit-security-email-setup' ).hide();
                if ( ! $( '#madeit-security-qr-container img' ).length ) generateTOTP();
            } else {
                $( '#madeit-security-email-setup' ).show();
                $( '#madeit-security-totp-setup' ).hide();
            }
        }
    } );

    // ── Generate TOTP Secret + QR Code ───────────────────────────────────────
    function generateTOTP() {
        $( '#madeit-security-qr-container' ).html( '<p>Generating…</p>' );
        ajax( 'madeit_security_2fa_generate_totp' ).done( function ( res ) {
            if ( res.success ) {
                var qrHtml = res.data.qr_svg
                    ? '<div style="border:4px solid #eee;border-radius:8px;margin-bottom:8px;display:inline-block;padding:4px;background:#fff">' + res.data.qr_svg + '</div>'
                    : '<p style="color:#856404">QR code unavailable. Enter the secret manually below.</p>';
                $( '#madeit-security-qr-container' ).html(
                    qrHtml + '<br>' +
                    '<code style="font-size:.85rem;word-break:break-all;user-select:all">' + res.data.secret + '</code>' +
                    '<p class="description" style="margin-top:6px">Can\'t scan? Enter this secret manually in your authenticator app.</p>'
                );
            } else {
                $( '#madeit-security-qr-container' ).html( '<p style="color:#c0392b">Error generating secret. Please try again.</p>' );
            }
        } ).fail( function () {
            $( '#madeit-security-qr-container' ).html( '<p style="color:#c0392b">Request failed.</p>' );
        } );
    }

    // ── Verify TOTP ──────────────────────────────────────────────────────────
    $( document ).on( 'click', '#madeit-security-verify-totp', function () {
        var code = $( '#madeit-security-totp-code' ).val().trim();
        var $btn = $( this );
        if ( ! code || code.length < 6 ) {
            $( '#madeit-security-totp-result' ).html( '<p style="color:#c0392b">Enter the 6-digit code from your authenticator app.</p>' );
            return;
        }

        $btn.prop( 'disabled', true ).text( 'Verifying…' );
        ajax( 'madeit_security_2fa_verify_totp', { code: code } ).done( function ( res ) {
            if ( res.success ) {
                $( '#madeit-security-totp-result' ).html(
                    '<div style="background:#d4edda;color:#155724;padding:12px;border-radius:6px;margin-top:12px">' +
                    '<strong>✓ ' + res.data.message + '</strong>' +
                    '</div>'
                );
                showRecoveryCodes( res.data.recovery_codes );
                // Reload after a moment so the profile section updates
                setTimeout( function () { location.reload(); }, 4000 );
            } else {
                $( '#madeit-security-totp-result' ).html( '<p style="color:#c0392b">' + ( res.data.message || 'Verification failed.' ) + '</p>' );
                $btn.prop( 'disabled', false ).text( 'Verify & Enable' );
            }
        } ).fail( function () {
            $( '#madeit-security-totp-result' ).html( '<p style="color:#c0392b">Request failed.</p>' );
            $btn.prop( 'disabled', false ).text( 'Verify & Enable' );
        } );
    } );

    // ── Send Test Email OTP ──────────────────────────────────────────────────
    $( document ).on( 'click', '#madeit-security-send-test-otp', function () {
        var $btn = $( this );
        $btn.prop( 'disabled', true ).text( 'Sending…' );
        ajax( 'madeit_security_2fa_send_email_otp' ).done( function ( res ) {
            if ( res.success ) {
                $btn.text( '✓ Code Sent!' );
                $( '#madeit-security-email-otp-code' ).show().focus();
                $( '#madeit-security-verify-email-otp' ).show();
            } else {
                $btn.prop( 'disabled', false ).text( 'Send Test Code' );
            }
        } ).fail( function () {
            $btn.prop( 'disabled', false ).text( 'Send Test Code' );
        } );
    } );

    // ── Verify Email OTP ─────────────────────────────────────────────────────
    $( document ).on( 'click', '#madeit-security-verify-email-otp', function () {
        var code = $( '#madeit-security-email-otp-code' ).val().trim();
        var $btn = $( this );
        if ( ! code || code.length < 6 ) {
            alert( 'Enter the 6-digit code from your email.' );
            return;
        }

        $btn.prop( 'disabled', true ).text( 'Verifying…' );
        ajax( 'madeit_security_2fa_enable_email', { code: code } ).done( function ( res ) {
            if ( res.success ) {
                $( '#madeit-security-email-setup' ).html(
                    '<div style="background:#d4edda;color:#155724;padding:12px;border-radius:6px">' +
                    '<strong>✓ ' + res.data.message + '</strong>' +
                    '</div>'
                );
                showRecoveryCodes( res.data.recovery_codes );
                setTimeout( function () { location.reload(); }, 4000 );
            } else {
                alert( res.data.message || 'Verification failed.' );
                $btn.prop( 'disabled', false ).text( 'Verify & Enable' );
            }
        } ).fail( function () {
            $btn.prop( 'disabled', false ).text( 'Verify & Enable' );
        } );
    } );

    // ── Disable 2FA ──────────────────────────────────────────────────────────
    $( document ).on( 'click', '#madeit-security-disable-2fa', function () {
        if ( ! confirm( 'Disable two-factor authentication? You will only need your password to log in.' ) ) return;

        var $btn = $( this );
        $btn.prop( 'disabled', true ).text( 'Disabling…' );
        ajax( 'madeit_security_2fa_disable' ).done( function ( res ) {
            if ( res.success ) {
                location.reload();
            } else {
                alert( res.data.message || 'Error disabling 2FA.' );
                $btn.prop( 'disabled', false ).text( 'Disable 2FA' );
            }
        } ).fail( function () {
            $btn.prop( 'disabled', false ).text( 'Disable 2FA' );
        } );
    } );

    // ── Regenerate Recovery Codes ─────────────────────────────────────────────
    $( document ).on( 'click', '#madeit-security-regen-codes', function () {
        if ( ! confirm( 'Generate new recovery codes? Your old codes will stop working.' ) ) return;

        var $btn = $( this );
        $btn.prop( 'disabled', true ).text( 'Generating…' );
        ajax( 'madeit_security_2fa_regen_codes' ).done( function ( res ) {
            if ( res.success ) {
                showRecoveryCodes( res.data.recovery_codes );
                $btn.prop( 'disabled', false ).text( 'Regenerate Recovery Codes' );
            } else {
                alert( res.data.message || 'Error.' );
                $btn.prop( 'disabled', false ).text( 'Regenerate Recovery Codes' );
            }
        } ).fail( function () {
            $btn.prop( 'disabled', false ).text( 'Regenerate Recovery Codes' );
        } );
    } );

    // ── Show Recovery Codes ──────────────────────────────────────────────────
    function showRecoveryCodes( codes ) {
        if ( ! codes || ! codes.length ) return;

        var html = '<div style="background:#fff3cd;color:#856404;padding:16px;border-radius:8px;margin-top:16px;border:1px solid #ffc107">' +
            '<strong>⚠️ Save your recovery codes!</strong>' +
            '<p style="font-size:.85rem;margin:8px 0">Store these in a safe place. Each code can only be used once. You won\'t see them again.</p>' +
            '<div style="background:#fff;padding:12px;border-radius:6px;font-family:monospace;font-size:.9rem;line-height:1.8;columns:2;column-gap:24px;border:1px solid #eee">';

        codes.forEach( function ( code ) {
            html += '<div>' + code + '</div>';
        } );

        html += '</div>' +
            '<button type="button" class="button" id="madeit-security-copy-codes" style="margin-top:10px">📋 Copy All Codes</button>' +
            '</div>';

        $( '#madeit-security-recovery-codes-display' ).html( html ).show();

        // Copy functionality
        $( '#madeit-security-copy-codes' ).on( 'click', function () {
            var text = codes.join( '\n' );
            if ( navigator.clipboard ) {
                navigator.clipboard.writeText( text ).then( function () {
                    $( '#madeit-security-copy-codes' ).text( '✅ Copied!' );
                    setTimeout( function () { $( '#madeit-security-copy-codes' ).text( '📋 Copy All Codes' ); }, 2000 );
                } );
            } else {
                var el = document.createElement( 'textarea' );
                el.value = text;
                document.body.appendChild( el );
                el.select();
                document.execCommand( 'copy' );
                document.body.removeChild( el );
                $( '#madeit-security-copy-codes' ).text( '✅ Copied!' );
                setTimeout( function () { $( '#madeit-security-copy-codes' ).text( '📋 Copy All Codes' ); }, 2000 );
            }
        } );
    }

    // ── Allow Enter key on code inputs ───────────────────────────────────────
    $( document ).on( 'keydown', '#madeit-security-totp-code', function ( e ) {
        if ( e.key === 'Enter' ) {
            e.preventDefault();
            $( '#madeit-security-verify-totp' ).trigger( 'click' );
        }
    } );

    $( document ).on( 'keydown', '#madeit-security-email-otp-code', function ( e ) {
        if ( e.key === 'Enter' ) {
            e.preventDefault();
            $( '#madeit-security-verify-email-otp' ).trigger( 'click' );
        }
    } );

} )( jQuery );

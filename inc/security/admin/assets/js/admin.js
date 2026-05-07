/**
 * Admin JavaScript
 * Handles: live visitor feed, visitor log table, IP blocking/unblocking,
 *          IP detail modal, traffic charts, filter bar, pagination.
 */
/* global madeitSecurity, Chart, jQuery */

// ── Shared utilities (file scope — accessible to all IIFEs) ──────────────────
var ajax, showToast, escHtml, escAttr, decodeEntities;

// HTML entity encoding — prevents stored XSS when rendering AJAX data
escHtml = function ( str ) {
    var div = document.createElement( 'div' );
    div.appendChild( document.createTextNode( str == null ? '' : String( str ) ) );
    return div.innerHTML;
};
escAttr = function ( str ) {
    return ( str == null ? '' : String( str ) )
        .replace( /&/g, '&amp;' )
        .replace( /"/g, '&quot;' )
        .replace( /'/g, '&#39;' )
        .replace( /</g, '&lt;' )
        .replace( />/g, '&gt;' );
};
// Decode HTML entities (&#8211; → –) then re-escape for safe insertion.
decodeEntities = function ( str ) {
    var ta = document.createElement( 'textarea' );
    ta.innerHTML = str || '';
    return escHtml( ta.value );
};
( function ( $ ) {
    'use strict';

    // AJAX wrapper — returns a Promise
    ajax = function ( action, data, method ) {
        data   = data   || {};
        method = method || 'GET';
        return new Promise( function ( resolve, reject ) {
            $.ajax( {
                url:      madeitSecurity.ajax_url,
                method:   method,
                dataType: 'json',
                data:     jQuery.extend( { action: action, nonce: madeitSecurity.nonce }, data ),
                success:  function ( res ) { res.success ? resolve( res.data ) : reject( res.data ); },
                error:    function ( xhr, status, err ) {
                    var body = '';
                    try { body = xhr.responseText ? xhr.responseText.substring( 0, 500 ) : '(empty)'; } catch ( ex ) { body = '(unreadable)'; }
                    console.error( 'MADEIT_SECURITY AJAX error [' + action + ']:', { status: status, error: err, httpCode: xhr.status, response: body } );
                    reject( { message: err || status || 'AJAX request failed', httpCode: xhr.status, response: body } );
                },
            } );
        } );
    };

    // Toast notification
    var toastTimer;
    showToast = function ( message, type ) {
        type = type || 'info';
        var $toast = $( '#madeit-security-toast' );
        if ( ! $toast.length ) {
            $toast = $( '<div id="madeit-security-toast"></div>' ).appendTo( 'body' );
        }
        clearTimeout( toastTimer );
        var colors = { success: '#27ae60', danger: '#c0392b', error: '#c0392b', info: '#2471a3' };
        $toast.css( {
            position: 'fixed', bottom: '24px', right: '24px',
            background: colors[ type ] || '#333', color: '#fff',
            padding: '12px 20px', borderRadius: '8px',
            fontFamily: '-apple-system, sans-serif', fontSize: '.88rem', fontWeight: '600',
            zIndex: 200000, boxShadow: '0 4px 16px rgba(0,0,0,.25)', maxWidth: '340px',
        } ).text( message ).stop( true ).fadeIn( 200 );
        toastTimer = setTimeout( function () { $toast.fadeOut( 300 ); }, 3500 );
    };
} )( jQuery );

// ── Main Dashboard / Visitor Log / IP Management / Settings ──────────────────
( function ( $ ) {
    'use strict';
    console.log( 'MADEIT_SECURITY admin.js v' + ( typeof madeitSecurity !== 'undefined' ? ( madeitSecurity.version || '?' ) : 'NO-MADEIT_SECURITY-OBJ' ) + ' loaded' );

    // ── State ─────────────────────────────────────────────────────────────────
    const state = {
        log:  { page: 1, pages: 1, total: 0, filters: {}, loading: false },
        live: { timer: null, lastData: [] },
        stats: { chart: null, browserChart: null, hourlyData: [] },
        blockModal: { ip: null },
    };

    // ── Utility: format helpers ───────────────────────────────────────────────
    function fmtTime( datetime ) {
        if ( ! datetime ) return '—';
        const d = new Date( datetime.replace( ' ', 'T' ) + 'Z' );
        return d.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit', second: '2-digit' } );
    }
    function fmtDateTime( datetime ) {
        if ( ! datetime ) return '—';
        const d = new Date( datetime.replace( ' ', 'T' ) + 'Z' );
        return d.toLocaleDateString( [], { month: 'short', day: 'numeric' } )
             + ' ' + d.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } );
    }
    function fmtNumber( n ) { return Number( n ).toLocaleString(); }
    function timeSince( datetime ) {
        if ( ! datetime ) return '—';
        const secs = Math.floor( ( Date.now() - new Date( datetime.replace( ' ', 'T' ) + 'Z' ) ) / 1000 );
        if ( secs < 5  ) return 'just now';
        if ( secs < 60 ) return secs + 's ago';
        if ( secs < 3600 ) return Math.floor( secs / 60 ) + 'm ago';
        return Math.floor( secs / 3600 ) + 'h ago';
    }
    function methodBadge( method ) {
        const m   = ( method || 'GET' ).toUpperCase();
        const cls = { GET: 'get', POST: 'post', PUT: 'put', DELETE: 'delete' }[ m ] || 'other';
        return `<span class="madeit-security-method madeit-security-method--${ cls }">${ m }</span>`;
    }
    function statusBadge( code ) {
        code = parseInt( code ) || 200;
        const cls = code < 300 ? '2xx' : code < 400 ? '3xx' : code < 500 ? '4xx' : '5xx';
        return `<span class="madeit-security-status madeit-security-status--${ cls }">${ code }</span>`;
    }
    function countryFlag( code ) {
        if ( ! code || code.length !== 2 ) return '';
        // Convert country code to flag emoji
        const flag = code.toUpperCase().split( '' ).map( c =>
            String.fromCodePoint( c.charCodeAt( 0 ) + 127397 ) ).join( '' );
        return `<span title="${ code }">${ flag }</span>`;
    }
    function truncateUrl( url, max = 50 ) {
        try {
            const u = new URL( url );
            const p = u.pathname + ( u.search ? u.search : '' );
            return p.length > max ? p.substring( 0, max ) + '…' : p;
        } catch {
            return ( url || '' ).substring( 0, max );
        }
    }

    function showFormResult( selector, message, type ) {
        var $el = $( selector );
        $el.removeClass( 'madeit-security-notice--success madeit-security-notice--error madeit-security-notice--info' )
           .addClass( 'madeit-security-notice madeit-security-notice--' + type )
           .text( message )
           .show();
    }

    // ── Block / Unblock IP actions ────────────────────────────────────────────
    function blockIP( ip, reason, duration ) {
        return ajax( 'madeit_security_block_ip', { ip, reason, duration }, 'POST' );
    }
    function unblockIP( ip ) {
        return ajax( 'madeit_security_unblock_ip', { ip }, 'POST' );
    }

    // ── Inline Block Button (used in both Live table and Log table) ───────────
    function makeBlockBtn( ip, isBlocked, isWhitelisted ) {
        if ( isWhitelisted ) {
            return `<span class="madeit-security-badge madeit-security-badge--green" title="Whitelisted">✓ Safe</span>`;
        }
        if ( ip === madeitSecurity.my_ip ) {
            return `<span class="madeit-security-badge madeit-security-badge--blue" title="Your IP">You</span>`;
        }
        if ( isBlocked ) {
            return `<button class="madeit-security-btn madeit-security-btn--sm madeit-security-unblock-inline-btn" data-ip="${ escAttr( ip ) }">✓ Unblock</button>`;
        }
        return `<button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--danger madeit-security-block-inline-btn" data-ip="${ escAttr( ip ) }">🚫 Block</button>`;
    }

    function makeDetailBtn( ip ) {
        return `<button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-ip-detail-btn" data-ip="${ escAttr( ip ) }" title="View IP details">🔍</button>`;
    }

    function makeVTBtn( ip ) {
        return `<a href="https://www.virustotal.com/gui/ip-address/${ encodeURIComponent( ip ) }" target="_blank" rel="noopener" class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-vt-btn" title="Lookup on VirusTotal">🛡️ VT</a>`;
    }

    // ── Delegate block/unblock clicks (works for dynamically rendered rows) ───
    $( document ).on( 'click', '.madeit-security-block-inline-btn', function () {
        const ip  = $( this ).data( 'ip' );
        const btn = $( this );
        openBlockModal( ip, function ( reason, duration ) {
            btn.text( '…' ).prop( 'disabled', true );
            blockIP( ip, reason, duration ).then( () => {
                btn.replaceWith( `<button class="madeit-security-btn madeit-security-btn--sm madeit-security-unblock-inline-btn" data-ip="${ ip }">✓ Unblock</button>` );
                markRowBlocked( ip );
                showToast( `🚫 ${ ip } blocked.`, 'danger' );
            } ).catch( e => showToast( e.message || 'Error blocking IP', 'error' ) );
        } );
    } );

    $( document ).on( 'click', '.madeit-security-unblock-inline-btn', function () {
        const ip  = $( this ).data( 'ip' );
        const btn = $( this );
        if ( ! confirm( madeitSecurity.strings.confirm_unblock ) ) return;
        btn.text( '…' ).prop( 'disabled', true );
        unblockIP( ip ).then( () => {
            btn.replaceWith( `<button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--danger madeit-security-block-inline-btn" data-ip="${ ip }">🚫 Block</button>` );
            markRowUnblocked( ip );
            showToast( `✓ ${ ip } unblocked.`, 'success' );
        } ).catch( e => showToast( e.message || 'Error', 'error' ) );
    } );

    function markRowBlocked( ip ) {
        $( `[data-ip="${ ip }"]` ).closest( 'tr' ).addClass( 'madeit-security-row--blocked' );
    }
    function markRowUnblocked( ip ) {
        $( `[data-ip="${ ip }"]` ).closest( 'tr' ).removeClass( 'madeit-security-row--blocked' );
    }

    // ── Block Modal ───────────────────────────────────────────────────────────
    function openBlockModal( ip, onConfirm ) {
        state.blockModal.ip = ip;
        $( '#block-modal-ip' ).text( ip );
        $( '#block-reason-input' ).val( 'Manually blocked' );
        $( '#block-duration-select' ).val( '0' );
        $( '#madeit-security-block-modal' ).show();
        $( '#confirm-block-btn' ).off( 'click' ).on( 'click', function () {
            const reason   = $( '#block-reason-input' ).val() || 'Manually blocked';
            const duration = parseInt( $( '#block-duration-select' ).val() ) || 0;
            $( '#madeit-security-block-modal' ).hide();
            onConfirm( reason, duration );
        } );
    }
    $( document ).on( 'click', '.madeit-security-block-modal-close', () => $( '#madeit-security-block-modal' ).hide() );
    $( document ).on( 'click', '#madeit-security-block-modal', function ( e ) {
        if ( $( e.target ).is( '#madeit-security-block-modal' ) ) $( this ).hide();
    } );

    // ── IP Detail Modal ───────────────────────────────────────────────────────
    $( document ).on( 'click', '.madeit-security-ip-detail-btn', function () {
        const ip = $( this ).data( 'ip' );
        openIPModal( ip );
    } );

    function openIPModal( ip ) {
        $( '#modal-ip-title' ).text( 'IP Details: ' + ip );
        $( '#madeit-security-modal-body' ).html( '<div class="madeit-security-loading-cell"><div class="madeit-security-spinner"></div> Loading…</div>' );
        $( '#madeit-security-ip-modal' ).show();

        ajax( 'madeit_security_get_ip_info', { ip } ).then( data => {
            const blocked     = data.is_blocked;
            const whitelisted = data.is_whitelisted;
            const myIP        = ip === madeitSecurity.my_ip;

            let blockAction = '';
            if ( ! myIP && ! whitelisted ) {
                if ( blocked ) {
                    blockAction = `<button class="madeit-security-btn madeit-security-btn--sm madeit-security-unblock-modal-btn" data-ip="${ escAttr( ip ) }">✓ Unblock IP</button>`;
                } else {
                    blockAction = `<button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--danger madeit-security-block-modal-action-btn" data-ip="${ escAttr( ip ) }">🚫 Block IP</button>`;
                }
            }

            let recentRows = '';
            ( data.recent_pages || [] ).forEach( r => {
                recentRows += `<tr>
                    <td>${ fmtDateTime( r.created_at ) }</td>
                    <td>${ methodBadge( r.method ) }</td>
                    <td class="madeit-security-truncate" title="${ escAttr( r.url ) }">${ escHtml( truncateUrl( r.url ) ) }</td>
                    <td>
                        ${ statusBadge( r.status_code ) }
                        ${ r.block_reason ? `<div style="font-size:.65rem;color:#e74c3c">${ escHtml( r.block_reason ) }</div>` : '' }
                    </td>
                    <td>
                        ${ escHtml( r.ua_family ) || '—' }
                        ${ r.user_agent ? `<div style="font-size:.6rem;color:#999;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${ escAttr( r.user_agent ) }">${ escHtml( r.user_agent ) }</div>` : '' }
                    </td>
                </tr>`;
            } );

            $( '#madeit-security-modal-body' ).html( `
                <div class="madeit-security-modal-ip-meta">
                    <div class="madeit-security-meta-item"><label>IP Address</label><span><code class="madeit-security-ip-code">${ escHtml( ip ) }</code></span></div>
                    <div class="madeit-security-meta-item"><label>Status</label><span>${
                        blocked ? '<span class="madeit-security-badge madeit-security-badge--red">🚫 Blocked</span>' :
                        whitelisted ? '<span class="madeit-security-badge madeit-security-badge--green">✓ Whitelisted</span>' :
                        myIP ? '<span class="madeit-security-badge madeit-security-badge--blue">Your IP</span>' :
                        '<span class="madeit-security-badge madeit-security-badge--gray">Normal</span>'
                    }</span></div>
                    <div class="madeit-security-meta-item"><label>Total Requests</label><span>${ fmtNumber( data.total_requests ) }</span></div>
                    <div class="madeit-security-meta-item"><label>First Seen</label><span>${ fmtDateTime( data.first_seen ) }</span></div>
                    <div class="madeit-security-meta-item"><label>Last Seen</label><span>${ fmtDateTime( data.last_seen ) }</span></div>
                    ${ data.block_detail ? `<div class="madeit-security-meta-item"><label>Block Reason</label><span>${ escHtml( data.block_detail.reason ) }</span></div>` : '' }
                </div>
                <div class="madeit-security-modal-actions">${ blockAction }
                    ${ ! whitelisted && ! myIP ? `<button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-whitelist-modal-btn" data-ip="${ escAttr( ip ) }">✓ Whitelist IP</button>` : '' }
                    <a href="https://www.virustotal.com/gui/ip-address/${ encodeURIComponent( ip ) }" target="_blank" rel="noopener" class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost">🛡️ VirusTotal Lookup</a>
                    <a href="${ madeitSecurity.admin_url }admin.php?page=madeit-security-visitor-log&ip=${ encodeURIComponent( ip ) }" class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost">📋 View All Logs</a>
                </div>
                <div class="madeit-security-modal-recent">
                    <h4>Recent Requests (last 20)</h4>
                    <table class="madeit-security-modal-recent-table">
                        <thead><tr><th>Time</th><th>Method</th><th>Page / URL</th><th>Status</th><th>Browser</th></tr></thead>
                        <tbody>${ recentRows || '<tr><td colspan="5" class="madeit-security-empty-cell">No requests found.</td></tr>' }</tbody>
                    </table>
                </div>
            ` );
        } ).catch( () => {
            $( '#madeit-security-modal-body' ).html( '<div class="madeit-security-notice madeit-security-notice--error">Failed to load IP details.</div>' );
        } );
    }

    $( document ).on( 'click', '#madeit-security-modal-close', () => $( '#madeit-security-ip-modal' ).hide() );
    $( document ).on( 'click', '#madeit-security-ip-modal', function ( e ) {
        if ( $( e.target ).is( '#madeit-security-ip-modal' ) ) $( this ).hide();
    } );

    // Block / unblock from IP detail modal
    $( document ).on( 'click', '.madeit-security-block-modal-action-btn', function () {
        const ip = $( this ).data( 'ip' );
        openBlockModal( ip, function ( reason, duration ) {
            blockIP( ip, reason, duration ).then( () => {
                openIPModal( ip ); // reload modal
                showToast( `🚫 ${ ip } blocked.`, 'danger' );
            } ).catch( e => showToast( e.message, 'error' ) );
        } );
    } );
    $( document ).on( 'click', '.madeit-security-unblock-modal-btn', function () {
        const ip = $( this ).data( 'ip' );
        if ( ! confirm( madeitSecurity.strings.confirm_unblock ) ) return;
        unblockIP( ip ).then( () => {
            openIPModal( ip );
            showToast( `✓ ${ ip } unblocked.`, 'success' );
        } ).catch( e => showToast( e.message, 'error' ) );
    } );
    // Inline block button (from Top IPs widget)
    $( document ).on( 'click', '.madeit-security-inline-block-btn', function () {
        const ip = $( this ).data( 'ip' );
        openBlockModal( ip, function ( reason, duration ) {
            blockIP( ip, reason, duration ).then( () => {
                showToast( '🚫 ' + ip + ' blocked.', 'danger' );
                if ( typeof loadDashboard === 'function' ) loadDashboard();
            } ).catch( function ( e ) { showToast( e.message, 'error' ); } );
        } );
    } );
    $( document ).on( 'click', '.madeit-security-whitelist-modal-btn', function () {
        const ip = $( this ).data( 'ip' );
        ajax( 'madeit_security_whitelist_ip', { ip, label: 'Manually whitelisted' }, 'POST' ).then( () => {
            openIPModal( ip );
            showToast( `✓ ${ ip } whitelisted.`, 'success' );
        } ).catch( e => showToast( e.message, 'error' ) );
    } );

    // ── LIVE VISITORS (Dashboard) ─────────────────────────────────────────────
    function renderLiveVisitors( visitors ) {
        const tbody = $( '#live-visitors-tbody' );
        $( '#live-count-badge' ).text( visitors.length );

        if ( ! visitors.length ) {
            tbody.html( '<tr><td colspan="7" class="madeit-security-empty-cell">No visitors in the last 5 minutes.</td></tr>' );
            return;
        }

        const rows = visitors.map( v => {
            const blocked     = v.is_blocked_now;
            const whitelisted = v.is_whitelisted;
            const isBot       = +v.is_bot;

            return `<tr class="${ blocked ? 'madeit-security-row--blocked' : '' }" data-ip="${ escAttr( v.ip ) }">
                <td>
                    <code class="madeit-security-ip-code">${ escHtml( v.ip ) }</code>
                    ${ v.ip === madeitSecurity.my_ip ? '<span class="madeit-security-badge madeit-security-badge--blue" style="margin-left:4px">You</span>' : '' }
                </td>
                <td>${ countryFlag( v.country ) }</td>
                <td>
                    <span class="madeit-security-nowrap">${ escHtml( v.ua_family || '?' ) } / ${ escHtml( v.os_family || '?' ) }</span>
                </td>
                <td>
                    <span class="madeit-security-truncate" title="${ escAttr( v.url ) }">${ v.page_title ? decodeEntities( v.page_title ) : escHtml( truncateUrl( v.url ) ) }</span>
                    <div style="font-size:.72rem;color:#718096;">${ escHtml( v.request_count ) } req · ${ timeSince( v.last_seen ) }</div>
                </td>
                <td>${ fmtTime( v.last_seen ) }</td>
                <td>
                    ${ isBot ? '<span class="madeit-security-badge madeit-security-badge--orange">🤖 Bot</span>' :
                               '<span class="madeit-security-badge madeit-security-badge--blue">👤 Human</span>' }
                    ${ blocked ? '<span class="madeit-security-badge madeit-security-badge--red">Blocked</span>' : '' }
                </td>
                <td class="madeit-security-actions-cell">
                    ${ makeDetailBtn( v.ip ) }
                    ${ makeVTBtn( v.ip ) }
                    ${ makeBlockBtn( v.ip, blocked, whitelisted ) }
                </td>
            </tr>`;
        } );

        tbody.html( rows.join( '' ) );
    }

    function fetchLiveVisitors() {
        ajax( 'madeit_security_live_visitors' ).then( data => {
            renderLiveVisitors( data.visitors || [] );
            $( '#madeit-security-last-update-time' ).text( fmtTime( data.timestamp ) );
        } ).catch( function ( e ) { console.error( 'MADEIT_SECURITY fetchLiveVisitors error:', e ); } );
    }

    // ── VISITOR LOG TABLE ─────────────────────────────────────────────────────
    function renderLogTable( rows ) {
        const tbody = $( '#visitor-log-tbody' );
        if ( ! rows || ! rows.length ) {
            tbody.html( '<tr><td colspan="9" class="madeit-security-empty-cell">No records found for the selected filters.</td></tr>' );
            return;
        }

        const html = rows.map( r => {
            const blockedNow  = r.is_blocked_now;
            const wasBlocked  = +r.is_blocked;
            const whitelisted = r.is_whitelisted;
            const isBot       = +r.is_bot;

            return `<tr class="${ wasBlocked ? 'madeit-security-row--blocked' : '' }" data-ip="${ escAttr( r.ip ) }">
                <td class="madeit-security-nowrap madeit-security-date-text">${ fmtDateTime( r.created_at ) }</td>
                <td>
                    <code class="madeit-security-ip-code">${ escHtml( r.ip ) }</code>
                    ${ r.ip === madeitSecurity.my_ip ? '<span class="madeit-security-badge madeit-security-badge--blue" style="margin-left:4px">You</span>' : '' }
                </td>
                <td>${ countryFlag( r.country ) }</td>
                <td>${ methodBadge( r.method ) }</td>
                <td>
                    <span class="madeit-security-truncate" title="${ escAttr( r.url ) }">${ r.page_title ? decodeEntities( r.page_title ) : escHtml( truncateUrl( r.url ) ) }</span>
                    ${ r.page_title ? `<div style="font-size:.7rem;color:#aaa">${ escHtml( truncateUrl( r.url, 40 ) ) }</div>` : '' }
                </td>
                <td>
                    <span class="madeit-security-nowrap">${ escHtml( r.ua_family || '?' ) }${ r.os_family ? ' / ' + escHtml( r.os_family ) : '' }</span>
                    ${ isBot ? '<span class="madeit-security-badge madeit-security-badge--orange" style="margin-left:4px">Bot</span>' : '' }
                </td>
                <td>${ r.username ? `<a href="${ escAttr( madeitSecurity.admin_url ) }user-edit.php?user_id=${ encodeURIComponent( r.user_id ) }">${ escHtml( r.username ) }</a>` : '<span style="color:#aaa">—</span>' }</td>
                <td>
                    ${ statusBadge( r.status_code ) }
                    ${ r.block_reason ? `<div style="font-size:.7rem;color:#e74c3c;margin-top:2px" title="${ escAttr( r.block_reason ) }">${ escHtml( r.block_reason.length > 30 ? r.block_reason.substring(0, 30) + '…' : r.block_reason ) }</div>` : '' }
                </td>
                <td class="madeit-security-actions-cell">
                    ${ makeDetailBtn( r.ip ) }
                    ${ makeVTBtn( r.ip ) }
                    ${ makeBlockBtn( r.ip, blockedNow, whitelisted ) }
                </td>
            </tr>`;
        } );

        tbody.html( html.join( '' ) );
    }

    function fetchVisitorLog( page ) {
        if ( state.log.loading ) return;
        state.log.loading = true;
        state.log.page    = page || state.log.page;

        $( '#visitor-log-tbody' ).html( '<tr><td colspan="9" class="madeit-security-loading-cell"><div class="madeit-security-spinner"></div> Loading…</td></tr>' );
        $( '#results-count' ).text( 'Loading…' );

        const params = {
            page:              state.log.page,
            ip:                $( '#filter-ip' ).val()      || '',
            url:               $( '#filter-url' ).val()      || '',
            bot:               $( '#filter-bot' ).val(),
            blocked:           $( '#filter-blocked' ).val(),
            hours:             $( '#filter-hours' ).val()    || 24,
            exclude_logged_in: $( '#filter-exclude-logged-in' ).is( ':checked' ) ? 1 : 0,
        };

        ajax( 'madeit_security_visitor_log', params ).then( data => {
            state.log.pages = data.pages;
            state.log.total = data.total;

            renderLogTable( data.rows );

            $( '#results-count' ).text( fmtNumber( data.total ) + ' records' );
            $( '#log-refresh-time' ).text( fmtTime( data.timestamp ) );
            $( '#pagination-info' ).text( `Page ${ data.page } of ${ data.pages }` );
            $( '#btn-prev-page' ).prop( 'disabled', data.page <= 1 );
            $( '#btn-next-page' ).prop( 'disabled', data.page >= data.pages );

            state.log.loading = false;
        } ).catch( function ( e ) {
            console.error( 'MADEIT_SECURITY visitor log error:', e );
            var msg = ( e && e.message ) ? e.message : 'Unknown error';
            var detail = '';
            if ( e && e.httpCode ) detail += ' [HTTP ' + e.httpCode + ']';
            if ( e && e.response ) detail += ' Server: ' + e.response.substring( 0, 200 );
            $( '#visitor-log-tbody' ).html(
                '<tr><td colspan="9" class="madeit-security-empty-cell" style="text-align:left;font-size:12px;">' +
                '<strong>Error loading log:</strong> ' + escHtml( msg ) +
                ( detail ? '<br><code style="font-size:11px;color:#888;word-break:break-all;">' + escHtml( detail ) + '</code>' : '' ) +
                '</td></tr>'
            );
            state.log.loading = false;
        } );
    }

    // ── STATS & CHARTS (Dashboard) ────────────────────────────────────────────
    function fetchStats() {
        ajax( 'madeit_security_visitor_stats' ).then( data => {
            // Stat cards
            $( '#stat-live-now'   ).text( fmtNumber( data.live_now   ) );
            $( '#stat-total-24h'  ).text( fmtNumber( data.total_24h  ) );
            $( '#stat-unique-ips' ).text( fmtNumber( data.unique_ips  ) + ' unique IPs' );
            $( '#stat-bots-24h'   ).text( fmtNumber( data.bots_24h   ) );
            $( '#stat-bot-pct'    ).text( data.total_24h ? Math.round( data.bots_24h / data.total_24h * 100 ) + '% of traffic' : '—' );
            $( '#stat-blocked-24h').text( fmtNumber( data.blocked_24h ) );
            $( '#stat-total-blocked').text( fmtNumber( data.total_blocked ) + ' IPs on block list' );

            // Traffic chart
            renderTrafficChart( data.hourly || [] );

            // Top IPs
            renderTopIPs( data.top_ips || [] );

            // Top Pages
            renderTopPages( data.top_pages || [] );

            // Browser chart
            renderBrowserChart( data.browsers || [] );
        } ).catch( function ( e ) { console.error( 'MADEIT_SECURITY fetchStats error:', e ); } );
    }

    function renderTrafficChart( hourly ) {
        const labels  = hourly.map( h => {
            const d = new Date( h.hour.replace( ' ', 'T' ) + 'Z' );
            return d.getHours() + ':00';
        } );
        const total   = hourly.map( h => +h.total );
        const bots    = hourly.map( h => +h.bots );
        const blocked = hourly.map( h => +h.blocked );

        const ctx = document.getElementById( 'traffic-chart' );
        if ( ! ctx ) return;

        if ( state.stats.chart ) state.stats.chart.destroy();

        state.stats.chart = new Chart( ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'Total',   data: total,   borderColor: '#2471a3', backgroundColor: 'rgba(36,113,163,.1)', fill: true, tension: .4, pointRadius: 2 },
                    { label: 'Bots',    data: bots,    borderColor: '#e67e22', backgroundColor: 'rgba(230,126,34,.08)', fill: true, tension: .4, pointRadius: 2 },
                    { label: 'Blocked', data: blocked, borderColor: '#c0392b', backgroundColor: 'rgba(192,57,43,.08)', fill: true, tension: .4, pointRadius: 2 },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } },
                    tooltip: { mode: 'index' },
                },
                scales: {
                    x: { grid: { color: '#f0f2f5' }, ticks: { font: { size: 10 } } },
                    y: { beginAtZero: true, grid: { color: '#f0f2f5' }, ticks: { font: { size: 10 } } },
                },
            },
        } );

        // Chart metric selector
        $( '#chart-metric' ).off( 'change' ).on( 'change', function () {
            const v = $( this ).val();
            state.stats.chart.data.datasets.forEach( ds => {
                ds.hidden = v !== 'total' && ds.label.toLowerCase() !== v;
            } );
            state.stats.chart.update();
        } );
    }

    function renderTopIPs( ips ) {
        const $el = $( '#top-ips-list' );
        if ( ! ips.length ) { $el.html( '<p class="madeit-security-empty-panel">No data yet.</p>' ); return; }

        const max  = ips[0].hits;
        const myIP = madeitSecurity.my_ip || '';
        const html = ips.map( ip => {
            var pct        = Math.round( ip.hits / max * 100 );
            var blockedNow = ip.is_blocked_now;
            var barColor   = blockedNow ? 'var(--c-danger,#c0392b)' : 'var(--c-primary,#1847F0)';
            var badges     = '';
            if ( +ip.is_bot )  badges += '<span class="madeit-security-badge madeit-security-badge--orange">Bot</span> ';
            if ( blockedNow )  badges += '<span class="madeit-security-badge madeit-security-badge--red">Blocked</span> ';

            var actions = '<a href="https://www.virustotal.com/gui/ip-address/' + encodeURIComponent( ip.ip ) + '" target="_blank" rel="noopener" class="madeit-security-sidebar-action" title="VirusTotal">🛡️</a>';
            if ( ip.ip !== myIP && ! blockedNow ) {
                actions += '<button class="madeit-security-sidebar-action madeit-security-inline-block-btn" data-ip="' + escAttr( ip.ip ) + '" title="Block">🚫</button>';
            }
            actions += '<button class="madeit-security-sidebar-action madeit-security-ip-detail-btn" data-ip="' + escAttr( ip.ip ) + '" title="Details">🔍</button>';

            return '<div class="madeit-security-ip-list__item">' +
                '<div style="flex:1;min-width:0;overflow:hidden">' +
                    '<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">' +
                        '<code class="madeit-security-ip-list__ip">' + escHtml( ip.ip ) + '</code> ' +
                        countryFlag( ip.country ) + ' ' + badges +
                    '</div>' +
                    '<div style="display:flex;align-items:center;gap:6px">' +
                        '<div style="flex:1;height:3px;background:var(--c-border,#e2e6ea);border-radius:2px;overflow:hidden">' +
                            '<div style="width:' + pct + '%;height:100%;background:' + barColor + ';border-radius:2px"></div>' +
                        '</div>' +
                        '<span class="madeit-security-ip-list__count">' + fmtNumber( ip.hits ) + '</span>' +
                    '</div>' +
                '</div>' +
                '<div style="display:flex;gap:1px;margin-left:4px;flex-shrink:0">' + actions + '</div>' +
            '</div>';
        } ).join( '' );

        $el.html( html );
    }

    function renderTopPages( pages ) {
        const $el = $( '#top-pages-list' );
        if ( ! pages.length ) { $el.html( '<p class="madeit-security-empty-panel">No data yet.</p>' ); return; }

        const html = pages.map( p => `
            <div class="madeit-security-page-list__item">
                <span class="madeit-security-page-list__path" title="${ escAttr( p.url ) }">${ p.page_title ? decodeEntities( p.page_title ) : escHtml( truncateUrl( p.url ) ) }</span>
                <span class="madeit-security-badge madeit-security-badge--blue">${ fmtNumber( p.hits ) }</span>
            </div>` ).join( '' );

        $el.html( html );
    }

    function renderBrowserChart( browsers ) {
        const ctx = document.getElementById( 'browser-chart' );
        if ( ! ctx ) return;

        const colors = [
            '#2471a3','#27ae60','#e67e22','#8e44ad','#c0392b',
            '#16a085','#d35400','#2c3e50','#7f8c8d',
        ];

        if ( state.stats.browserChart ) state.stats.browserChart.destroy();

        state.stats.browserChart = new Chart( ctx, {
            type: 'doughnut',
            data: {
                labels:   browsers.map( b => b.ua_family ),
                datasets: [ { data: browsers.map( b => +b.cnt ), backgroundColor: colors, borderWidth: 2, borderColor: '#fff' } ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right', labels: { font: { size: 10 }, boxWidth: 10, padding: 8 } },
                },
            },
        } );
    }

    // ── LOG PAGE: Filter & Pagination ─────────────────────────────────────────
    function initLogPage() {
        if ( ! $( '#visitor-log-table' ).length ) return;

        // Pre-fill IP from URL query string (e.g. clicking "View All Logs" from modal)
        const urlParams = new URLSearchParams( window.location.search );
        if ( urlParams.get( 'ip' ) ) {
            $( '#filter-ip' ).val( urlParams.get( 'ip' ) );
        }

        fetchVisitorLog( 1 );

        $( '#btn-apply-filters, #btn-refresh-log' ).on( 'click', () => fetchVisitorLog( 1 ) );
        $( '#btn-clear-filters' ).on( 'click', () => {
            $( '#filter-ip, #filter-url' ).val( '' );
            $( '#filter-bot, #filter-blocked' ).val( -1 );
            $( '#filter-hours' ).val( 24 );
            $( '#filter-exclude-logged-in' ).prop( 'checked', false );
            fetchVisitorLog( 1 );
        } );

        // Pressing Enter in search fields
        $( '#filter-ip, #filter-url' ).on( 'keydown', function ( e ) {
            if ( e.key === 'Enter' ) fetchVisitorLog( 1 );
        } );

        // Pagination
        $( '#btn-prev-page' ).on( 'click', () => {
            if ( state.log.page > 1 ) fetchVisitorLog( state.log.page - 1 );
        } );
        $( '#btn-next-page' ).on( 'click', () => {
            if ( state.log.page < state.log.pages ) fetchVisitorLog( state.log.page + 1 );
        } );

        // Export CSV
        $( '#btn-export-log' ).on( 'click', exportLogCSV );
    }

    function exportLogCSV() {
        const ip    = $( '#filter-ip' ).val()  || '';
        const hours = $( '#filter-hours' ).val() || 24;
        const bot   = $( '#filter-bot' ).val();
        const blk   = $( '#filter-blocked' ).val();

        ajax( 'madeit_security_visitor_log', { page: 1, ip, hours, bot: bot, blocked: blk, per_page: 5000 } ).then( data => {
            if ( ! data.rows || ! data.rows.length ) { showToast( 'No data to export.', 'info' ); return; }

            // CSV-safe: prefix cells starting with =, +, -, @, \t, \r with a single quote to prevent formula injection
            function csvSafe( val ) {
                var s = String( val == null ? '' : val ).replace( /"/g, '""' );
                if ( /^[=+\-@\t\r]/.test( s ) ) s = "'" + s;
                return '"' + s + '"';
            }
            const headers = [ 'Time', 'IP', 'Country', 'Method', 'URL', 'Page Title', 'User', 'Status', 'Browser', 'OS', 'Bot', 'Blocked' ];
            const csvRows = [ headers.join( ',' ) ];
            data.rows.forEach( r => {
                csvRows.push( [
                    csvSafe( r.created_at ), csvSafe( r.ip ), csvSafe( r.country ), csvSafe( r.method ),
                    csvSafe( r.url ), csvSafe( r.page_title ),
                    csvSafe( r.username ), csvSafe( r.status_code ), csvSafe( r.ua_family ), csvSafe( r.os_family ),
                    r.is_bot ? 'yes' : 'no', r.is_blocked ? 'yes' : 'no',
                ].join( ',' ) );
            } );

            const blob = new Blob( [ csvRows.join( '\n' ) ], { type: 'text/csv;charset=utf-8;' } );
            const a    = document.createElement( 'a' );
            a.href     = URL.createObjectURL( blob );
            a.download = `madeit-security-log-${ new Date().toISOString().slice( 0, 10 ) }.csv`;
            a.click();
        } );
    }

    // ── DASHBOARD ────────────────────────────────────────────────────────────
    function initDashboard() {
        if ( ! $( '#live-visitors-tbody' ).length ) return;

        fetchLiveVisitors();
        fetchStats();

        // Auto-refresh live every 15 seconds
        state.live.timer = setInterval( fetchLiveVisitors, 15000 );

        $( '#btn-refresh-live' ).on( 'click', fetchLiveVisitors );
    }

    // ── IP MANAGEMENT PAGE ────────────────────────────────────────────────────
    function initIPManagement() {
        if ( ! $( '#blocked-ips-table' ).length ) return;

        // Live search in blocked list
        $( '#block-list-search' ).on( 'input', function () {
            const q = $( this ).val().toLowerCase();
            $( '#blocked-ips-table tbody tr' ).each( function () {
                const ip = $( this ).data( 'ip' ) || '';
                $( this ).toggle( ip.includes( q ) );
            } );
        } );

        // Unblock buttons (statically rendered rows)
        $( '.madeit-security-unblock-btn' ).on( 'click', function () {
            const ip  = $( this ).data( 'ip' );
            const row = $( this ).closest( 'tr' );
            if ( ! confirm( madeitSecurity.strings.confirm_unblock ) ) return;
            unblockIP( ip ).then( () => {
                row.fadeOut( 300, () => row.remove() );
                showToast( `✓ ${ ip } unblocked.`, 'success' );
            } ).catch( e => showToast( e.message, 'error' ) );
        } );

        $( '.madeit-security-whitelist-btn' ).on( 'click', function () {
            const ip  = $( this ).data( 'ip' );
            const row = $( this ).closest( 'tr' );
            ajax( 'madeit_security_whitelist_ip', { ip }, 'POST' ).then( () => {
                row.fadeOut( 300, () => row.remove() );
                showToast( `✓ ${ ip } whitelisted.`, 'success' );
            } ).catch( e => showToast( e.message, 'error' ) );
        } );

        // Quick block form
        $( '#quick-block-submit' ).on( 'click', function () {
            const ip       = $( '#quick-block-ip' ).val().trim();
            const reason   = $( '#quick-block-reason' ).val() || 'Manually blocked';
            const duration = parseInt( $( '#quick-block-duration' ).val() ) || 0;

            if ( ! ip ) { showFormResult( '#quick-block-result', 'Enter an IP address.', 'error' ); return; }

            blockIP( ip, reason, duration ).then( () => {
                showFormResult( '#quick-block-result', `✓ ${ ip } blocked.`, 'success' );
                $( '#quick-block-ip' ).val( '' );
                showToast( `🚫 ${ ip } blocked.`, 'danger' );
            } ).catch( e => showFormResult( '#quick-block-result', e.message || 'Error', 'error' ) );
        } );
    }

    // ── SETTINGS PAGE ─────────────────────────────────────────────────────────
    function initSettings() {
        if ( ! $( '#btn-save-settings' ).length ) return;

        $( '#btn-save-settings' ).on( 'click', function () {
            const settings = {};
            $( '.madeit-security-setting-input' ).each( function () {
                const name = $( this ).attr( 'name' );
                if ( ! name ) return;
                if ( $( this ).attr( 'type' ) === 'checkbox' ) {
                    settings[ name ] = $( this ).is( ':checked' ) ? '1' : '0';
                } else {
                    settings[ name ] = $( this ).val();
                }
            } );

            ajax( 'madeit_security_save_settings', { settings }, 'POST' ).then( data => {
                $( '#settings-saved-notice' ).text( `✓ Saved ${ data.count } setting(s).` ).show().delay( 3000 ).fadeOut();
                showToast( 'Settings saved!', 'success' );
            } ).catch( () => showToast( 'Error saving settings.', 'error' ) );
        } );
    }

    // ── HARDENING: quick toggle ───────────────────────────────────────────────
    function initHardening() {
        $( '.madeit-security-toggle-setting' ).on( 'click', function () {
            const opt = $( this ).data( 'option' );
            const val = $( this ).data( 'value' );
            const btn = $( this );
            btn.text( 'Saving…' ).prop( 'disabled', true );
            const settings = {};
            settings[ opt ] = val;
            ajax( 'madeit_security_save_settings', { settings }, 'POST' ).then( () => {
                btn.closest( 'tr' ).find( '.madeit-security-badge--red' ).replaceWith( '<span class="madeit-security-badge madeit-security-badge--green">✓ Secure</span>' );
                btn.closest( 'tr' ).removeClass( 'madeit-security-row--warning' );
                btn.replaceWith( '<span class="madeit-security-text-muted">—</span>' );
                showToast( 'Setting enabled.', 'success' );
            } ).catch( () => {
                btn.text( 'Enable' ).prop( 'disabled', false );
                showToast( 'Error.', 'error' );
            } );
        } );
    }

    // ── Login security: block from attempt table ───────────────────────────────
    function initLoginSecurity() {
        $( document ).on( 'click', '.madeit-security-block-ip-btn', function () {
            const ip  = $( this ).data( 'ip' );
            const btn = $( this );
            openBlockModal( ip, function ( reason, duration ) {
                btn.text( '…' ).prop( 'disabled', true );
                blockIP( ip, reason, duration ).then( () => {
                    btn.replaceWith( '<span class="madeit-security-badge madeit-security-badge--red">Blocked</span>' );
                    showToast( `🚫 ${ ip } blocked.`, 'danger' );
                } ).catch( e => showToast( e.message, 'error' ) );
            } );
        } );
    }

    // ── Init on DOM ready ─────────────────────────────────────────────────────
    $( function () {
        initDashboard();
        initLogPage();
        initIPManagement();
        initSettings();
        initHardening();
        initLoginSecurity();
    } );

} )( jQuery );

// ── WHITELIST PAGE ────────────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    function initWhitelistPage() {
        if ( ! $( '#whitelist-table' ).length ) return;

        // ── Live search ──────────────────────────────────────────────────────
        $( '#wl-search' ).on( 'input', function () {
            const q = $( this ).val().toLowerCase();
            $( '.wl-row' ).each( function () {
                const ip    = ( $( this ).data( 'ip' )    || '' ).toLowerCase();
                const label = ( $( this ).data( 'label' ) || '' ).toLowerCase();
                $( this ).toggle( ! q || ip.includes( q ) || label.includes( q ) );
            } );
        } );

        // ── Add IP ───────────────────────────────────────────────────────────
        function addToWhitelist( ip, label, $resultEl ) {
            if ( ! ip ) { showWlResult( $resultEl, 'Enter an IP address.', 'error' ); return; }
            $.ajax( {
                url:    madeitSecurity.ajax_url,
                method: 'POST',
                data:   { action: 'madeit_security_add_whitelist', nonce: madeitSecurity.nonce, ip, label },
                success( res ) {
                    if ( res.success ) {
                        showWlResult( $resultEl, '✅ ' + res.data.message, 'success' );
                        renderWhitelistTable( res.data.whitelist );
                        $( '#wl-add-ip' ).val( '' );
                        $( '#wl-add-label' ).val( '' );
                        showToast( '✅ ' + ip + ' whitelisted.', 'success' );
                    } else {
                        showWlResult( $resultEl, res.data.message || 'Error.', 'error' );
                    }
                },
                error() { showWlResult( $resultEl, 'Request failed.', 'error' ); },
            } );
        }

        $( '#btn-add-to-whitelist' ).on( 'click', function () {
            addToWhitelist(
                $( '#wl-add-ip' ).val().trim(),
                $( '#wl-add-label' ).val().trim(),
                $( '#wl-add-result' )
            );
        } );

        $( '#wl-add-ip' ).on( 'keydown', function ( e ) {
            if ( e.key === 'Enter' ) $( '#btn-add-to-whitelist' ).trigger( 'click' );
        } );

        // ── Whitelist my IP (banner button) ──────────────────────────────────
        $( '#btn-whitelist-my-ip, #btn-quick-whitelist-my-ip' ).on( 'click', function () {
            const btn = $( this );
            btn.prop( 'disabled', true ).text( 'Adding…' );
            $.ajax( {
                url:    madeitSecurity.ajax_url,
                method: 'POST',
                data:   { action: 'madeit_security_whitelist_my_ip', nonce: madeitSecurity.nonce, label: 'My admin IP' },
                success( res ) {
                    if ( res.success ) {
                        renderWhitelistTable( res.data.whitelist );
                        showToast( res.data.message, 'success' );
                        // Reload to update the banner state
                        setTimeout( () => location.reload(), 1200 );
                    } else {
                        btn.prop( 'disabled', false ).text( '+ Add mine' );
                    }
                },
            } );
        } );

        // ── Remove IP ────────────────────────────────────────────────────────
        $( document ).on( 'click', '.madeit-security-remove-wl-btn', function () {
            const id  = $( this ).data( 'id' );
            const ip  = $( this ).data( 'ip' );
            const isMe = ip === madeitSecurity.my_ip;
            const msg  = isMe
                ? '⚠️ This is YOUR IP! Removing it could lock you out of wp-admin. Are you sure?'
                : 'Remove ' + ip + ' from the whitelist?';
            if ( ! confirm( msg ) ) return;

            const $row = $( this ).closest( 'tr' );
            $.ajax( {
                url:    madeitSecurity.ajax_url,
                method: 'POST',
                data:   { action: 'madeit_security_remove_whitelist', nonce: madeitSecurity.nonce, id },
                success( res ) {
                    if ( res.success ) {
                        $row.fadeOut( 250, () => {
                            $row.remove();
                            renderWhitelistTable( res.data.whitelist );
                        } );
                        showToast( ip + ' removed from whitelist.', 'info' );
                    }
                },
            } );
        } );
    }

    // ── Render whitelist table ────────────────────────────────────────────────
    function renderWhitelistTable( items ) {
        const $tbody = $( '#whitelist-tbody' );
        if ( ! $tbody.length ) return;

        $( '#wl-count-badge' ).text( items.length );

        if ( ! items.length ) {
            $tbody.html( '<tr id="wl-empty-row"><td colspan="5" class="madeit-security-empty-cell">No whitelisted IPs.</td></tr>' );
            return;
        }

        const rows = items.map( w => {
            const isMe = w.value === madeitSecurity.my_ip;
            const label = w.label ? escHtml( w.label ) : '<em style="color:#aaa">No label</em>';
            const removeStyle = isMe ? 'style="border-color:#c0392b;color:#c0392b"' : '';
            const removeText  = isMe ? '⚠ Remove (locks you out!)' : '✕ Remove';
            return `<tr class="wl-row" data-ip="${ escAttr( w.value ) }" data-label="${ escAttr( ( w.label || '' ).toLowerCase() ) }">
                <td>
                    <code class="madeit-security-ip-code">${ escHtml( w.value ) }</code>
                    ${ isMe ? '<span class="madeit-security-badge madeit-security-badge--blue" style="margin-left:6px">You</span>' : '' }
                </td>
                <td><span class="wl-label-text" data-id="${ escAttr( w.id ) }">${ label }</span></td>
                <td class="madeit-security-date-text">${ w.created_at || '—' }</td>
                <td><em style="color:#aaa">—</em></td>
                <td>
                    <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-remove-wl-btn"
                            data-id="${ escAttr( w.id ) }" data-ip="${ escAttr( w.value ) }" ${ removeStyle }>
                        ${ removeText }
                    </button>
                </td>
            </tr>`;
        } );

        $tbody.html( rows.join( '' ) );
    }

    function showWlResult( $el, msg, type ) {
        $el.removeClass( 'madeit-security-notice--success madeit-security-notice--error madeit-security-notice--info' )
           .addClass( 'madeit-security-notice madeit-security-notice--' + type )
           .text( msg ).show();
    }

    // Wire up the whitelist AJAX call on the IP detail modal "Whitelist" button
    // (already handled above in main JS via madeit_security_whitelist_ip action on IPManager)

    $( function () { initWhitelistPage(); } );

} )( jQuery );

// ── CUSTOM LOGIN URL ──────────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    function initCustomLoginURL() {
        if ( ! $( '#clurl-slug' ).length ) return;

        // ── Save ─────────────────────────────────────────────────────────────
        $( '#btn-save-login-url' ).on( 'click', function () {
            const btn          = $( this );
            const enabled      = $( '#clurl-enabled' ).is( ':checked' ) ? '1' : '0';
            const slug         = $( '#clurl-slug' ).val().trim();
            const block_admin  = $( '#clurl-block-wpadmin' ).is( ':checked' ) ? '1' : '0';

            if ( enabled === '1' && ! slug ) {
                showClurlResult( 'Enter a slug first.', 'error' );
                return;
            }

            btn.text( 'Saving…' ).prop( 'disabled', true );

            $.ajax( {
                url:    madeitSecurity.ajax_url,
                method: 'POST',
                data:   {
                    action:        'madeit_security_save_login_url',
                    nonce:         madeitSecurity.nonce,
                    enabled,
                    slug,
                    block_wpadmin: block_admin,
                },
                success( res ) {
                    btn.text( '💾 Save' ).prop( 'disabled', false );
                    if ( res.success ) {
                        showClurlResult( '✅ ' + res.data.message, 'success' );
                        // Update the displayed URL
                        $( '#clurl-link' ).attr( 'href', res.data.login_url ).text( res.data.login_url );
                        $( '#clurl-slug' ).val( res.data.slug );
                        // Update status badge
                        const badge = $( '#clurl-status-badge' );
                        if ( enabled === '1' ) {
                            badge.text( 'Active' ).removeClass( 'madeit-security-badge--gray' ).addClass( 'madeit-security-badge--green' );
                        } else {
                            badge.text( 'Disabled' ).removeClass( 'madeit-security-badge--green' ).addClass( 'madeit-security-badge--gray' );
                        }
                        showToast( enabled === '1' ? '🔗 Custom login URL active!' : 'Custom login URL disabled.', 'success' );
                    } else {
                        showClurlResult( '❌ ' + ( res.data.message || 'Error saving.' ), 'error' );
                    }
                },
                error() {
                    btn.text( '💾 Save' ).prop( 'disabled', false );
                    showClurlResult( 'Request failed.', 'error' );
                },
            } );
        } );

        // ── Generate new random slug ──────────────────────────────────────────
        $( '#btn-regenerate-slug' ).on( 'click', function () {
            const btn = $( this );
            if ( ! confirm( 'Generate a new random slug? Your current login URL will change.' ) ) return;
            btn.text( '…' ).prop( 'disabled', true );
            $.ajax( {
                url:    madeitSecurity.ajax_url,
                method: 'POST',
                data:   { action: 'madeit_security_regenerate_login_url', nonce: madeitSecurity.nonce },
                success( res ) {
                    btn.text( '🔀 Generate New Slug' ).prop( 'disabled', false );
                    if ( res.success ) {
                        $( '#clurl-slug' ).val( res.data.slug ).addClass( 'madeit-security-input--highlight' );
                        setTimeout( () => $( '#clurl-slug' ).removeClass( 'madeit-security-input--highlight' ), 2000 );
                        if ( $( '#clurl-link' ).length ) {
                            $( '#clurl-link' ).attr( 'href', res.data.login_url ).text( res.data.login_url );
                        }
                        showClurlResult( '🔀 New slug generated — click Save to apply.', 'info' );
                        showToast( 'New slug ready — remember to save!', 'info' );
                    }
                },
                error() { btn.text( '🔀 Generate New Slug' ).prop( 'disabled', false ); },
            } );
        } );

        // ── Copy URL to clipboard ─────────────────────────────────────────────
        $( '#btn-copy-login-url' ).on( 'click', function () {
            const url = $( '#clurl-link' ).attr( 'href' ) || $( '#clurl-link' ).text();
            if ( ! url ) return;
            navigator.clipboard.writeText( url ).then( () => {
                const btn = $( this );
                btn.text( '✅ Copied!' );
                setTimeout( () => btn.text( '📋 Copy' ), 2000 );
            } ).catch( () => {
                // Fallback for older browsers
                const el = document.createElement( 'textarea' );
                el.value = url;
                document.body.appendChild( el );
                el.select();
                document.execCommand( 'copy' );
                document.body.removeChild( el );
                $( this ).text( '✅ Copied!' );
                setTimeout( () => $( this ).text( '📋 Copy' ), 2000 );
            } );
        } );

        // ── Live slug preview ─────────────────────────────────────────────────
        $( '#clurl-slug' ).on( 'input', function () {
            // Strip characters that aren't URL-safe
            const clean = $( this ).val().replace( /[^a-zA-Z0-9\-]/g, '' ).toLowerCase();
            if ( clean !== $( this ).val() ) $( this ).val( clean );
        } );

        // ── Quick-whitelist from login attempts table ──────────────────────────
        $( document ).on( 'click', '.madeit-security-whitelist-ip-quick-btn', function () {
            const ip  = $( this ).data( 'ip' );
            const btn = $( this );
            btn.text( '…' ).prop( 'disabled', true );
            $.ajax( {
                url:    madeitSecurity.ajax_url,
                method: 'POST',
                data:   { action: 'madeit_security_add_whitelist', nonce: madeitSecurity.nonce, ip, label: 'Whitelisted from login monitor' },
                success( res ) {
                    if ( res.success ) {
                        btn.replaceWith( '<span class="madeit-security-badge madeit-security-badge--green">✅ Whitelisted</span>' );
                        showToast( '✅ ' + ip + ' whitelisted.', 'success' );
                    } else {
                        btn.text( '✅ Whitelist' ).prop( 'disabled', false );
                        showToast( res.data.message || 'Error', 'error' );
                    }
                },
                error() { btn.text( '✅ Whitelist' ).prop( 'disabled', false ); },
            } );
        } );
    }

    function showClurlResult( msg, type ) {
        const $el = $( '#clurl-result' );
        $el.removeClass( 'madeit-security-notice--success madeit-security-notice--error madeit-security-notice--info' )
           .addClass( 'madeit-security-notice madeit-security-notice--' + type )
           .text( msg ).show();
    }

    $( function () { initCustomLoginURL(); } );

} )( jQuery );

// ── POST-BREACH RECOVERY ──────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    let lastReport = null;

    function initPostBreach() {
        if ( ! $( '.madeit-security-breach-grid' ).length ) return;

        // ── Action buttons ────────────────────────────────────────────────────
        $( document ).on( 'click', '.madeit-security-breach-action-btn', function () {
            const btn    = $( this );
            const action = btn.data( 'action' );
            const confirmMsg = btn.data( 'confirm' );

            if ( confirmMsg && ! confirm( confirmMsg ) ) return;

            const card   = btn.closest( '.madeit-security-breach-card' );
            const result = $( '#result-' + action );

            btn.prop( 'disabled', true ).text( '⏳ Running…' );
            result.removeClass( 'madeit-security-breach-card__result--success madeit-security-breach-card__result--error' )
                  .addClass( 'madeit-security-breach-card__result madeit-security-breach-card__result--loading' )
                  .text( 'Working…' ).show();

            $.ajax( {
                url:     madeitSecurity.ajax_url,
                method:  'POST',
                timeout: 120000, // 2 min — reinstalls take time
                data: { action: 'madeit_security_breach_action', nonce: madeitSecurity.nonce, breach_action: action },
                success( res ) {
                    btn.prop( 'disabled', false );
                    const ok = res.success;
                    const msg = res.data?.message || ( ok ? 'Done.' : 'An error occurred.' );

                    result.removeClass( 'madeit-security-breach-card__result--loading' )
                          .addClass( ok ? 'madeit-security-breach-card__result--success' : 'madeit-security-breach-card__result--error' )
                          .text( ok ? '✅ ' + msg : '❌ ' + msg );

                    showGlobalResult( msg, ok ? 'success' : 'error' );

                    if ( ok ) {
                        card.addClass( 'madeit-security-card--done' );
                        btn.text( '✅ Done' );

                        // Show detail panels per action
                        handleActionResult( action, res.data );
                    } else {
                        btn.text( btn.attr( 'data-original-text' ) || 'Retry' );
                    }
                },
                error( _, status ) {
                    const msg = status === 'timeout' ? 'Request timed out (the operation may still be running — refresh to check).' : 'Request failed.';
                    result.removeClass( 'madeit-security-breach-card__result--loading' )
                          .addClass( 'madeit-security-breach-card__result--error' )
                          .text( '❌ ' + msg );
                    btn.prop( 'disabled', false );
                    showGlobalResult( msg, 'error' );
                },
            } );
        } );

        // Store original button text
        $( '.madeit-security-breach-action-btn' ).each( function () {
            $( this ).attr( 'data-original-text', $( this ).text() );
        } );

        // ── Unlock button (top of page) ───────────────────────────────────────
        $( '#btn-unlock-site' ).on( 'click', function () {
            if ( ! confirm( 'Lift the site lockdown and restore public access?' ) ) return;
            $( this ).text( '…' ).prop( 'disabled', true );
            $.ajax( {
                url: madeitSecurity.ajax_url, method: 'POST',
                data: { action: 'madeit_security_breach_action', nonce: madeitSecurity.nonce, breach_action: 'unlock_site' },
                success() { location.reload(); },
            } );
        } );

        // ── Copy keys ─────────────────────────────────────────────────────────
        $( '#btn-copy-keys' ).on( 'click', function () {
            const text = $( '#keys-snippet' ).val();
            navigator.clipboard.writeText( text ).then( () => {
                $( this ).text( '✅ Copied!' );
                setTimeout( () => $( this ).text( '📋 Copy Keys' ), 2000 );
            } );
        } );

        // ── Download report ───────────────────────────────────────────────────
        $( '#btn-download-report' ).on( 'click', function () {
            if ( ! lastReport ) return;
            const json  = JSON.stringify( lastReport, null, 2 );
            const blob  = new Blob( [ json ], { type: 'application/json' } );
            const a     = document.createElement( 'a' );
            const fname = 'madeit-security-incident-' + new Date().toISOString().slice( 0, 10 ) + '.json';
            a.href      = URL.createObjectURL( blob );
            a.download  = fname;
            a.click();
        } );
    }

    // ── Per-action result handlers ────────────────────────────────────────────
    function handleActionResult( action, data ) {
        $( '#breach-details-area' ).show();

        switch ( action ) {
            case 'audit_admins':
                renderAdminAudit( data );
                break;
            case 'rotate_secret_keys':
                if ( data.snippet ) {
                    $( '#keys-snippet' ).val( data.snippet );
                    $( '#keys-panel' ).show();
                }
                break;
            case 'reinstall_plugins':
                renderReinstallDetails( data );
                break;
            case 'scan_database':
                renderDbScanResults();
                break;
            case 'generate_report':
                lastReport = data.report;
                $( '#report-panel' ).show();
                break;
        }
    }

    function renderAdminAudit( data ) {
        const $panel  = $( '#admin-audit-panel' );
        const $body   = $( '#admin-audit-body' );
        const flagged = data.details?.flagged || [];

        $panel.show();

        if ( ! flagged.length ) {
            $body.html( '<p style="padding:16px;color:var(--fw-text-mid)">✅ All ' + ( data.details?.total || 0 ) + ' admin account(s) passed the audit — no suspicious patterns found.</p>' );
            return;
        }

        const html = flagged.map( u => `
            <div class="madeit-security-admin-flag-card">
                <h4>⚠ <a href="${ escAttr( u.edit_url ) }" target="_blank">${ escHtml( u.login ) }</a> (${ escHtml( u.role ) }) — ${ escHtml( u.email ) }</h4>
                <ul>${ u.flags.map( f => `<li>${ escHtml( f ) }</li>` ).join( '' ) }</ul>
                <a href="${ escAttr( u.edit_url ) }" target="_blank" class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--danger">Review Account →</a>
            </div>
        ` ).join( '' );

        $body.html( '<div style="padding:16px">' + html + '</div>' );
    }

    function renderReinstallDetails( data ) {
        const d     = data.details || {};
        const $body = $( '#reinstall-body' );
        const $panel = $( '#reinstall-panel' );

        const html = `
            <div style="padding:16px;display:flex;gap:24px;flex-wrap:wrap">
                <div><strong style="color:#27ae60">✅ Reinstalled (${ d.reinstalled?.length || 0 })</strong><ul style="margin:6px 0 0 18px;font-size:.82rem">${ ( d.reinstalled || [] ).map( p => `<li>${ escHtml( p ) }</li>` ).join('') || '<li><em>None</em></li>' }</ul></div>
                <div><strong style="color:#718096">⏭ Skipped (${ d.skipped?.length || 0 })</strong><ul style="margin:6px 0 0 18px;font-size:.82rem">${ ( d.skipped || [] ).map( p => `<li>${ escHtml( p ) }</li>` ).join('') || '<li><em>None</em></li>' }</ul></div>
                ${ d.failed?.length ? `<div><strong style="color:#c0392b">❌ Failed (${ d.failed.length })</strong><ul style="margin:6px 0 0 18px;font-size:.82rem">${ d.failed.map( p => `<li>${ escHtml( p ) }</li>` ).join('') }</ul></div>` : '' }
            </div>
        `;
        $body.html( html );
        $panel.show();
    }

    function renderDbScanResults() {
        const $panel = $( '#db-scan-panel' );
        const $body  = $( '#db-scan-body' );

        // Fetch from the scanner results endpoint
        $.ajax( {
            url:  madeitSecurity.ajax_url,
            data: { action: 'madeit_security_get_scan_results', nonce: madeitSecurity.nonce },
            success( res ) {
                if ( ! res.success ) return;
                const results = res.data.db_findings || [];
                if ( ! results.length ) {
                    $body.html( '<p style="padding:16px;color:var(--fw-text-mid)">✅ No malware patterns found in the database.</p>' );
                } else {
                    const rows = results.map( r => `
                        <tr>
                            <td><span class="madeit-security-badge madeit-security-badge--${ r.severity === 'critical' ? 'red' : 'orange' }">${ r.severity }</span></td>
                            <td>${ r.location }</td>
                            <td style="font-family:monospace;font-size:.75rem;max-width:300px;overflow:hidden;text-overflow:ellipsis">${ r.snippet }</td>
                        </tr>
                    ` ).join( '' );
                    $body.html( `<div class="madeit-security-table-wrapper"><table class="madeit-security-table"><thead><tr><th>Severity</th><th>Location</th><th>Snippet</th></tr></thead><tbody>${ rows }</tbody></table></div>` );
                }
                $panel.show();
            },
        } );
    }

    function showGlobalResult( message, type ) {
        const $el = $( '#breach-result-banner' );
        $el.removeClass( 'madeit-security-breach-result--success madeit-security-breach-result--error madeit-security-breach-result--info' )
           .addClass( 'madeit-security-breach-result madeit-security-breach-result--' + type )
           .html( message ).show();
        $el[0].scrollIntoView( { behavior: 'smooth', block: 'nearest' } );
        showToast( message, type === 'success' ? 'success' : 'danger' );
    }

    $( function () { initPostBreach(); } );

} )( jQuery );

// ── AI CRAWLERS ──────────────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    function initAICrawlers() {
        if ( ! $( '#btn-save-crawler-rules' ).length ) return;

        // ── Block All toggle ─────────────────────────────────────────────────
        $( '#madeit-security-block-all-ai' ).on( 'change', function () {
            const blockAll = $( this ).is( ':checked' );
            $( '.madeit-security-crawler-toggle' ).each( function () {
                // Toggle checked = allowed, unchecked = blocked
                $( this ).prop( 'checked', ! blockAll );
                updateRowBadge( $( this ) );
            } );
        } );

        // ── Per-crawler toggle ───────────────────────────────────────────────
        $( document ).on( 'change', '.madeit-security-crawler-toggle', function () {
            updateRowBadge( $( this ) );
        } );

        function updateRowBadge( $toggle ) {
            // Toggle checked = allowed, unchecked = blocked
            var allowed = $toggle.is( ':checked' );
            var $badge  = $toggle.closest( 'tr' ).find( 'td' ).eq( 3 );
            $badge.html(
                allowed
                    ? '<span class="madeit-security-badge madeit-security-badge--green">Allowed</span>'
                    : '<span class="madeit-security-badge madeit-security-badge--red">Blocked</span>'
            );
        }

        // ── Save rules ───────────────────────────────────────────────────────
        $( '#btn-save-crawler-rules' ).on( 'click', function () {
            const btn   = $( this );
            const rules = {};
            // Toggle checked = allowed, unchecked = blocked
            $( '.madeit-security-crawler-toggle' ).each( function () {
                const id = $( this ).data( 'crawler-id' );
                rules[ id ] = $( this ).is( ':checked' ) ? 'allow' : 'block';
            } );
            const blockAll = $( '#madeit-security-block-all-ai' ).is( ':checked' ) ? 1 : 0;

            btn.text( 'Saving…' ).prop( 'disabled', true );

            ajax( 'madeit_security_save_ai_crawler_rules', {
                rules: JSON.stringify( rules ),
                block_all: blockAll,
            }, 'POST' ).then( () => {
                btn.text( '💾 Save Rules' ).prop( 'disabled', false );
                showResult( $( '#crawler-rules-result' ), '✅ AI crawler rules saved.', 'success' );
                showToast( 'AI crawler rules saved.', 'success' );
                // Reload to update robots.txt preview
                setTimeout( () => location.reload(), 1500 );
            } ).catch( err => {
                btn.text( '💾 Save Rules' ).prop( 'disabled', false );
                showResult( $( '#crawler-rules-result' ), '❌ ' + ( err.message || 'Error saving.' ), 'error' );
            } );
        } );
    }

    function showResult( $el, msg, type ) {
        $el.removeClass( 'madeit-security-notice--success madeit-security-notice--error madeit-security-notice--info' )
           .addClass( 'madeit-security-notice madeit-security-notice--' + type )
           .html( msg ).show();
    }

    $( function () { initAICrawlers(); } );

} )( jQuery );

// ── REST API POLICIES ────────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    function initRestPolicies() {
        if ( ! $( '#rest-policies-table' ).length ) return;

        // ── Save all policies ────────────────────────────────────────────────
        $( '#btn-save-rest-policies' ).on( 'click', function () {
            const btn = $( this );
            btn.text( 'Saving…' ).prop( 'disabled', true );

            const enabled = $( '#rest-policies-enabled' ).is( ':checked' ) ? 1 : 0;

            ajax( 'madeit_security_save_rest_policies', {
                enabled: enabled,
                policies: JSON.stringify( collectPolicies() ),
            }, 'POST' ).then( () => {
                btn.text( '💾 Save Policies' ).prop( 'disabled', false );
                showToast( 'REST API policies saved.', 'success' );
                setTimeout( () => location.reload(), 1200 );
            } ).catch( err => {
                btn.text( '💾 Save Policies' ).prop( 'disabled', false );
                showToast( err.message || 'Error saving policies.', 'error' );
            } );
        } );

        // ── Add new policy ───────────────────────────────────────────────────
        $( '#btn-add-rest-policy' ).on( 'click', function () {
            const ns = $( '#new-policy-namespace' ).val() === '__custom__'
                     ? $( '#new-policy-namespace-custom' ).val().trim()
                     : $( '#new-policy-namespace' ).val();
            const route     = $( '#new-policy-route' ).val().trim();
            const authReq   = $( '#new-policy-auth' ).is( ':checked' );
            const methods   = [];
            $( '.new-policy-method:checked' ).each( function () { methods.push( $( this ).val() ); } );
            const rateLimit = parseInt( $( '#new-policy-rate-limit' ).val() ) || 0;
            const desc      = $( '#new-policy-desc' ).val().trim();

            if ( ! ns ) { showToast( 'Namespace is required.', 'error' ); return; }

            const id = 'custom_' + Date.now();
            const policy = {
                id, namespace: ns, route_pattern: route, auth_required: authReq,
                methods: methods.length ? methods : ['GET','POST','PUT','DELETE','PATCH'],
                rate_limit: rateLimit, description: desc, disabled: false,
            };

            // Add row to table (will be saved when user clicks Save)
            const row = buildPolicyRow( policy, $( '#rest-policies-table tbody tr' ).length + 1 );
            $( '#rest-policies-table tbody' ).append( row );

            // Clear form
            $( '#new-policy-namespace' ).val( '' );
            $( '#new-policy-route, #new-policy-desc' ).val( '' );
            $( '#new-policy-auth' ).prop( 'checked', false );
            $( '.new-policy-method' ).prop( 'checked', true );
            $( '#new-policy-rate-limit' ).val( '0' );

            showToast( 'Policy added — click Save to apply.', 'info' );
        } );

        // ── Delete policy ────────────────────────────────────────────────────
        $( document ).on( 'click', '.madeit-security-delete-policy-btn', function () {
            if ( ! confirm( 'Remove this policy?' ) ) return;
            $( this ).closest( 'tr' ).remove();
            showToast( 'Policy removed — click Save to apply.', 'info' );
        } );

        // ── Namespace custom input toggle ────────────────────────────────────
        $( '#new-policy-namespace' ).on( 'change', function () {
            $( '#new-policy-namespace-custom' ).toggle( $( this ).val() === '__custom__' );
        } );
    }

    function collectPolicies() {
        const policies = [];
        $( '#rest-policies-table tbody tr[data-policy-id]' ).each( function () {
            const $r = $( this );
            policies.push( {
                id:             $r.data( 'policy-id' ),
                namespace:      $r.data( 'policy-ns' ) || '',
                route_pattern:  $r.data( 'policy-route' ) || '',
                auth_required:  $r.data( 'policy-auth' ) === true || $r.data( 'policy-auth' ) === 1,
                methods:        ( $r.data( 'policy-methods' ) || '' ).toString().split( ',' ).filter( Boolean ),
                rate_limit:     parseInt( $r.data( 'policy-rate' ) ) || 0,
                description:    $r.data( 'policy-desc' ) || '',
                disabled:       $r.hasClass( 'madeit-security-policy-disabled' ),
            } );
        } );
        return policies;
    }

    function buildPolicyRow( p, num ) {
        const methods = ( p.methods || [] ).map( m => `<span class="madeit-security-badge madeit-security-badge--blue">${m}</span>` ).join( ' ' );
        return `<tr data-policy-id="${ p.id }" data-policy-ns="${ p.namespace }" data-policy-route="${ p.route_pattern }"
                    data-policy-auth="${ p.auth_required ? 1 : 0 }" data-policy-methods="${ ( p.methods || [] ).join(',') }"
                    data-policy-rate="${ p.rate_limit }" data-policy-desc="${ p.description || '' }">
            <td>${ num }</td>
            <td><code>${ p.namespace || '*' }</code></td>
            <td><code>${ p.route_pattern || 'All routes' }</code></td>
            <td>${ p.auth_required ? '<span class="madeit-security-badge madeit-security-badge--green">Yes</span>' : '<span class="madeit-security-badge madeit-security-badge--gray">No</span>' }</td>
            <td>${ methods || '<span class="madeit-security-badge madeit-security-badge--gray">Any</span>' }</td>
            <td>${ p.rate_limit ? p.rate_limit + '/min' : '∞' }</td>
            <td><span class="madeit-security-badge madeit-security-badge--green">Enabled</span></td>
            <td><button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-delete-policy-btn" data-policy-id="${ p.id }">✕</button></td>
        </tr>`;
    }

    $( function () { initRestPolicies(); } );

} )( jQuery );

// ── SESSION SECURITY ─────────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    function initSessionSecurity() {
        if ( ! $( '#btn-save-session-settings' ).length ) return;

        $( '#btn-save-session-settings' ).on( 'click', function () {
            const btn = $( this );
            const settings = {};

            $( '.madeit-security-setting-input' ).each( function () {
                const name = $( this ).attr( 'name' );
                if ( ! name ) return;
                if ( $( this ).is( ':checkbox' ) ) {
                    settings[ name ] = $( this ).is( ':checked' ) ? '1' : '0';
                } else {
                    settings[ name ] = $( this ).val();
                }
            } );

            btn.text( 'Saving…' ).prop( 'disabled', true );

            ajax( 'madeit_security_save_settings', { settings }, 'POST' ).then( () => {
                btn.text( '💾 Save Settings' ).prop( 'disabled', false );
                $( '#session-settings-result' ).addClass( 'madeit-security-notice madeit-security-notice--success' ).text( '✅ Session settings saved.' ).show();
                showToast( 'Session settings saved.', 'success' );
            } ).catch( () => {
                btn.text( '💾 Save Settings' ).prop( 'disabled', false );
                $( '#session-settings-result' ).addClass( 'madeit-security-notice madeit-security-notice--error' ).text( '❌ Error saving.' ).show();
            } );
        } );
    }

    $( function () { initSessionSecurity(); } );

} )( jQuery );

// ── OUTBOUND MONITOR ─────────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    function initOutboundMonitor() {
        if ( ! $( '#outbound-log-table' ).length ) return;

        // ── Load outbound log ────────────────────────────────────────────────
        loadOutboundLog();

        // ── Save allowlist ───────────────────────────────────────────────────
        $( '#btn-save-outbound-allowlist' ).on( 'click', function () {
            const btn     = $( this );
            const domains = $( '#outbound-allowlist' ).val().trim();
            const mode    = $( '[name="madeit_security_outbound_mode"]' ).val();
            const enabled = $( '[name="madeit_security_outbound_monitor_enabled"]' ).is( ':checked' ) ? 1 : 0;
            const blockPrivate = $( '[name="madeit_security_outbound_block_private"]' ).is( ':checked' ) ? 1 : 0;

            btn.text( 'Saving…' ).prop( 'disabled', true );

            ajax( 'madeit_security_save_outbound_allowlist', {
                domains, mode, enabled, block_private: blockPrivate,
            }, 'POST' ).then( () => {
                btn.text( '💾 Save Allowlist' ).prop( 'disabled', false );
                $( '#outbound-allowlist-result' ).addClass( 'madeit-security-notice madeit-security-notice--success' ).text( '✅ Outbound settings saved.' ).show();
                showToast( 'Outbound monitor settings saved.', 'success' );
            } ).catch( err => {
                btn.text( '💾 Save Allowlist' ).prop( 'disabled', false );
                $( '#outbound-allowlist-result' ).addClass( 'madeit-security-notice madeit-security-notice--error' ).text( '❌ ' + ( err.message || 'Error.' ) ).show();
            } );
        } );
    }

    function loadOutboundLog() {
        ajax( 'madeit_security_get_outbound_log' ).then( data => {
            const log = data.log || [];
            const $tbody = $( '#outbound-log-table tbody' );

            if ( ! log.length ) {
                $tbody.html( '<tr><td colspan="6" class="madeit-security-empty-cell">No outbound requests logged yet.</td></tr>' );
                return;
            }

            const rows = log.slice( 0, 50 ).map( r => {
                const statusClass = r.status === 'blocked' ? 'red' : ( r.status === 'logged' ? 'orange' : 'green' );
                const statusLabel = r.status.charAt(0).toUpperCase() + r.status.slice(1);
                const shortUrl = r.url.length > 60 ? r.url.substring( 0, 57 ) + '…' : r.url;
                return `<tr>
                    <td><code>${ escHtml( r.domain || '—' ) }</code></td>
                    <td title="${ escAttr( r.url ) }" style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ escHtml( shortUrl ) }</td>
                    <td>${ escHtml( r.method || 'GET' ) }</td>
                    <td><small>${ escHtml( r.caller || 'unknown' ) }</small></td>
                    <td><span class="madeit-security-badge madeit-security-badge--${ statusClass }">${ statusLabel }</span></td>
                    <td class="madeit-security-date-text">${ r.timestamp || '—' }</td>
                </tr>`;
            } );

            $tbody.html( rows.join( '' ) );

            // Update stats
            if ( data.stats ) {
                $( '#outbound-stat-total' ).text( data.stats.total || 0 );
                $( '#outbound-stat-blocked' ).text( data.stats.blocked || 0 );
            }
        } ).catch( () => {
            $( '#outbound-log-table tbody' ).html(
                '<tr><td colspan="6" class="madeit-security-empty-cell">Failed to load outbound log.</td></tr>'
            );
        } );
    }

    $( function () { initOutboundMonitor(); } );

} )( jQuery );

// ── CRON GUARD ───────────────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    function initCronGuard() {
        if ( ! $( '#btn-save-cron-settings' ).length ) return;

        // ── Save settings ────────────────────────────────────────────────────
        $( '#btn-save-cron-settings' ).on( 'click', function () {
            const btn = $( this );
            const enabled   = $( '[name="madeit_security_cron_guard_enabled"]' ).is( ':checked' ) ? 1 : 0;
            const rateLimit = parseInt( $( '[name="madeit_security_cron_rate_limit"]' ).val() ) || 60;

            btn.text( 'Saving…' ).prop( 'disabled', true );

            ajax( 'madeit_security_save_cron_settings', {
                enabled, rate_limit: rateLimit,
            }, 'POST' ).then( () => {
                btn.text( '💾 Save Settings' ).prop( 'disabled', false );
                $( '#cron-settings-result' ).addClass( 'madeit-security-notice madeit-security-notice--success' ).text( '✅ Cron Guard settings saved.' ).show();
                showToast( 'Cron Guard settings saved.', 'success' );
            } ).catch( () => {
                btn.text( '💾 Save Settings' ).prop( 'disabled', false );
                $( '#cron-settings-result' ).addClass( 'madeit-security-notice madeit-security-notice--error' ).text( '❌ Error saving.' ).show();
            } );
        } );

        // ── Approve cron hook ────────────────────────────────────────────────
        $( document ).on( 'click', '.madeit-security-cron-approve-btn', function () {
            const btn  = $( this );
            const hook = btn.data( 'hook' );
            btn.text( '…' ).prop( 'disabled', true );

            ajax( 'madeit_security_approve_cron_hook', { hook }, 'POST' ).then( () => {
                btn.closest( '.madeit-security-notice, tr' ).fadeOut( 300 );
                showToast( hook + ' approved.', 'success' );
            } ).catch( err => {
                btn.text( '✅ Approve' ).prop( 'disabled', false );
                showToast( err.message || 'Error approving hook.', 'error' );
            } );
        } );

        // ── Remove cron hook ─────────────────────────────────────────────────
        $( document ).on( 'click', '.madeit-security-cron-remove-btn', function () {
            const btn  = $( this );
            const hook = btn.data( 'hook' );
            if ( ! confirm( 'Remove the cron hook "' + hook + '"? This will unschedule all its events.' ) ) return;

            btn.text( '…' ).prop( 'disabled', true );

            ajax( 'madeit_security_remove_cron_hook', { hook, confirm: '1' }, 'POST' ).then( () => {
                btn.closest( 'tr, .madeit-security-notice' ).fadeOut( 300 );
                showToast( hook + ' removed.', 'success' );
            } ).catch( err => {
                btn.text( '🗑 Remove' ).prop( 'disabled', false );
                showToast( err.message || 'Error removing hook.', 'error' );
            } );
        } );

        // ── Copy buttons ─────────────────────────────────────────────────────
        $( document ).on( 'click', '.madeit-security-copy-btn', function () {
            const target = $( this ).data( 'target' );
            const text   = $( '#' + target ).text();
            navigator.clipboard.writeText( text ).then( () => {
                const orig = $( this ).text();
                $( this ).text( '✅ Copied!' );
                setTimeout( () => $( this ).text( orig ), 2000 );
            } );
        } );
    }

    $( function () { initCronGuard(); } );

} )( jQuery );

// ── MALWARE SCANNER ──────────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    var scanTimer = null;

    function initMalwareScan() {
        if ( ! $( '#madeit-security-start-scan' ).length ) return;

        // Load existing results on page load
        loadResults();

        // ── Start Scan ──────────────────────────────────────────────────────
        $( '#madeit-security-start-scan' ).on( 'click', function () {
            var btn = $( this );
            btn.text( 'Scanning…' ).prop( 'disabled', true );

            $.ajax( {
                url:    madeitSecurity.ajax_url,
                method: 'POST',
                data:   { action: 'madeit_security_start_scan', nonce: madeitSecurity.nonce },
                success: function ( res ) {
                    if ( res.success ) {
                        $( '#madeit-security-scan-progress' ).show();
                        $( '#madeit-security-scan-progress-fill' ).css( 'width', '0%' );
                        $( '#madeit-security-scan-progress-text' ).text( 'Scanning… 0%' );
                        $( '#madeit-security-scan-status' ).text( res.data.message || 'Scan started…' );
                        scanTimer = setInterval( pollStatus, 3000 );
                    } else {
                        btn.text( 'Start Full Scan' ).prop( 'disabled', false );
                        $( '#madeit-security-scan-status' ).text( 'Failed to start scan.' );
                    }
                },
                error: function () {
                    btn.text( 'Start Full Scan' ).prop( 'disabled', false );
                    $( '#madeit-security-scan-status' ).text( 'Error starting scan.' );
                }
            } );
        } );

        // ── Quarantine (delegated) ──────────────────────────────────────────
        $( document ).on( 'click', '.madeit-security-quarantine-btn', function () {
            var btn  = $( this );
            var file = btn.data( 'file' );
            if ( ! confirm( 'Quarantine this file? It will be moved and cannot execute.' ) ) return;

            btn.text( '…' ).prop( 'disabled', true );

            $.ajax( {
                url:    madeitSecurity.ajax_url,
                method: 'POST',
                data:   { action: 'madeit_security_quarantine_file', nonce: madeitSecurity.nonce, file: file },
                success: function ( res ) {
                    if ( res.success ) {
                        showToast( res.data.message || 'File quarantined.', 'success' );
                        loadResults();
                    } else {
                        btn.text( 'Quarantine' ).prop( 'disabled', false );
                        showToast( 'Failed to quarantine file.', 'error' );
                    }
                },
                error: function () {
                    btn.text( 'Quarantine' ).prop( 'disabled', false );
                    showToast( 'Error quarantining file.', 'error' );
                }
            } );
        } );
    }

    // ── Poll scan status ────────────────────────────────────────────────────
    function pollStatus() {
        $.ajax( {
            url:    madeitSecurity.ajax_url,
            method: 'POST',
            data:   { action: 'madeit_security_scan_status', nonce: madeitSecurity.nonce },
            success: function ( res ) {
                if ( ! res.success ) return;

                var d   = res.data;
                var pct = d.pct || 0;
                var st  = d.state || {};

                $( '#madeit-security-scan-progress-fill' ).css( 'width', pct + '%' );
                $( '#madeit-security-scan-progress-text' ).text( 'Scanning… ' + pct + '%' );
                $( '#madeit-security-scan-status' ).text(
                    'Scanning file ' + ( st.offset || 0 ) + ' of ' + ( st.total || 0 ) +
                    '… (' + ( st.found || 0 ) + ' threats found)'
                );

                if ( st.status === 'complete' ) {
                    clearInterval( scanTimer );
                    scanTimer = null;
                    $( '#madeit-security-scan-progress' ).hide();
                    $( '#madeit-security-start-scan' ).text( 'Start Full Scan' ).prop( 'disabled', false );
                    $( '#madeit-security-scan-status' ).text(
                        'Scan complete — ' + ( st.found || 0 ) + ' threat(s) found.'
                    );
                    showToast( 'Malware scan complete.', 'success' );
                    loadResults();
                }
            }
        } );
    }

    // ── Load & render results ───────────────────────────────────────────────
    function loadResults() {
        $.ajax( {
            url:    madeitSecurity.ajax_url,
            method: 'POST',
            data:   { action: 'madeit_security_get_scan_results', nonce: madeitSecurity.nonce },
            success: function ( res ) {
                if ( ! res.success ) return;

                var d            = res.data;
                var fileFindings = d.file_findings || [];
                var dbFindings   = d.db_findings   || [];
                var state        = d.state          || {};

                // ── File findings table ─────────────────────────────────────
                var $fileTbody = $( '#madeit-security-file-findings-body' );

                if ( fileFindings.length ) {
                    var fileRows = fileFindings.map( function ( f ) {
                        var color   = severityColor( f.severity );
                        var snippet = ( f.snippet || '' ).length > 80
                            ? f.snippet.substring( 0, 80 ) + '…'
                            : ( f.snippet || '' );
                        var actionCell;

                        if ( f.status === 'quarantined' ) {
                            actionCell = '<span class="madeit-security-badge madeit-security-badge--amber">Quarantined</span>';
                        } else {
                            actionCell = '<button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--danger madeit-security-quarantine-btn" data-file="' +
                                escAttr( f.file ) + '">Quarantine</button>';
                        }

                        return '<tr>' +
                            '<td><span class="madeit-security-badge madeit-security-badge--' + color + '">' + escHtml( f.severity ) + '</span></td>' +
                            '<td><code style="font-size:12px" title="' + escAttr( f.file ) + '">' + escHtml( f.file ) + '</code></td>' +
                            '<td>' + escHtml( f.sig_name ) + '</td>' +
                            '<td><code style="font-size:11px;word-break:break-all">' + escHtml( snippet ) + '</code></td>' +
                            '<td>' + escHtml( f.found_at || '' ) + '</td>' +
                            '<td>' + actionCell + '</td>' +
                            '</tr>';
                    } );
                    $fileTbody.html( fileRows.join( '' ) );
                } else {
                    $fileTbody.html(
                        '<tr><td colspan="6" class="madeit-security-empty-cell">No file-based threats detected.</td></tr>'
                    );
                }

                // ── DB findings table ───────────────────────────────────────
                var $dbTbody = $( '#madeit-security-db-findings-body' );

                if ( dbFindings.length ) {
                    var dbRows = dbFindings.map( function ( f ) {
                        var color   = severityColor( f.severity );
                        var snippet = ( f.snippet || '' ).length > 80
                            ? f.snippet.substring( 0, 80 ) + '…'
                            : ( f.snippet || '' );

                        return '<tr>' +
                            '<td><span class="madeit-security-badge madeit-security-badge--' + color + '">' + escHtml( f.severity ) + '</span></td>' +
                            '<td>' + escHtml( f.location || '' ) + '</td>' +
                            '<td>' + escHtml( f.type || '' ) + '</td>' +
                            '<td><code style="font-size:11px;word-break:break-all">' + escHtml( snippet ) + '</code></td>' +
                            '</tr>';
                    } );
                    $dbTbody.html( dbRows.join( '' ) );
                } else {
                    $dbTbody.html(
                        '<tr><td colspan="4" class="madeit-security-empty-cell">No database threats detected.</td></tr>'
                    );
                }

                // ── Stat cards & badge counters ─────────────────────────────
                $( '#madeit-security-file-count' ).text( state.total || 0 );
                $( '#madeit-security-threat-count' ).text( fileFindings.length );
                $( '#madeit-security-db-count' ).text( dbFindings.length );
                $( '#madeit-security-last-scan-stat' ).text( d.last_scan || '—' );

                $( '#madeit-security-file-findings-count' ).text( fileFindings.length );
                $( '#madeit-security-db-findings-count' ).text( dbFindings.length );
            }
        } );
    }

    // ── Helpers ─────────────────────────────────────────────────────────────
    function severityColor( severity ) {
        var s = ( severity || '' ).toLowerCase();
        if ( s === 'critical' || s === 'high' ) return 'red';
        if ( s === 'medium' ) return 'amber';
        return 'green';
    }

    function escHtml( str ) {
        var div = document.createElement( 'div' );
        div.appendChild( document.createTextNode( str || '' ) );
        return div.innerHTML;
    }

    /** Decode HTML entities (&#8211; → –) then re-escape for safe insertion. */
    function decodeEntities( str ) {
        var ta = document.createElement( 'textarea' );
        ta.innerHTML = str || '';
        return escHtml( ta.value );
    }

    function escAttr( str ) {
        return ( str || '' )
            .replace( /&/g, '&amp;' )
            .replace( /"/g, '&quot;' )
            .replace( /'/g, '&#39;' )
            .replace( /</g, '&lt;' )
            .replace( />/g, '&gt;' );
    }

    $( function () { initMalwareScan(); } );

} )( jQuery );

// ── VULNERABILITY AUDIT ──────────────────────────────────────────────────────
( function () {
    'use strict';
    var btn = document.getElementById( 'madeit-security-run-vuln-audit' );
    if ( ! btn ) return;
    var label = btn.querySelector( '.madeit-security-btn__label' );
    var spin  = btn.querySelector( '.madeit-security-btn__spinner' );
    btn.addEventListener( 'click', function () {
        btn.disabled = true;
        label.style.display = 'none';
        spin.style.display  = 'inline';
        var fd = new FormData();
        fd.append( 'action', 'madeit_security_run_vuln_audit' );
        fd.append( 'nonce', typeof madeitSecurity !== 'undefined' ? madeitSecurity.nonce : '' );
        fetch( ajaxurl, { method: 'POST', body: fd, credentials: 'same-origin' } )
            .then( function ( r ) { return r.json(); } )
            .then( function ( d ) {
                if ( d.success ) { location.reload(); }
                else {
                    alert( d.data && d.data.message ? d.data.message : 'Audit failed.' );
                    btn.disabled = false; label.style.display = ''; spin.style.display = 'none';
                }
            } )
            .catch( function () {
                alert( 'Network error — try again.' );
                btn.disabled = false; label.style.display = ''; spin.style.display = 'none';
            } );
    } );
} )();

// ── TWO-FACTOR ROLE SYNC ────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';
    $( function () {
        function syncRoles() {
            var roles = [];
            $( '.madeit-security-2fa-role-checkbox:checked' ).each( function () {
                roles.push( $( this ).val() );
            } );
            $( '#madeit-security-2fa-roles-value' ).val( roles.join( ',' ) );
        }
        $( document ).on( 'change', '.madeit-security-2fa-role-checkbox', syncRoles );
    } );
} )( jQuery );

// ── SETUP WIZARD ─────────────────────────────────────────────────────────────
// Wizard logic lives in a separate enqueued script (setup-wizard.php uses wp_add_inline_script).

/* ── Column Resizer ──────────────────────────────────────────────────────── */
( function () {
    'use strict';

    function initResizableTables() {
        document.querySelectorAll( '.madeit-security-wrap .madeit-security-table' ).forEach( initTable );
    }

    function initTable( table ) {
        var cols = table.querySelectorAll( 'thead th' );
        if ( ! cols.length ) return;

        // Columns with a .col-* CSS class already have widths defined in the
        // stylesheet — never override those with inline styles.  For columns
        // WITHOUT a .col-* class, capture the auto-layout width so we can
        // lock it in before switching to table-layout:fixed.
        cols.forEach( function ( th ) {
            if ( ! /\bcol-/.test( th.className || '' ) ) {
                th.style.width = th.offsetWidth + 'px';
            }
        } );

        // Switch to fixed layout — CSS .col-* widths + captured widths apply
        table.style.tableLayout = 'fixed';

        cols.forEach( function ( th ) {
            // Skip if resize handle already attached
            if ( th.querySelector( '.madeit-security-col-resizer' ) ) return;

            var handle = document.createElement( 'div' );
            handle.className = 'madeit-security-col-resizer';
            th.appendChild( handle );

            var startX, startW;

            handle.addEventListener( 'mousedown', function ( e ) {
                startX = e.pageX;
                startW = th.offsetWidth;
                handle.classList.add( 'madeit-security-col-resizer--dragging' );
                document.body.classList.add( 'madeit-security-resizing' );

                function onMouseMove( e ) {
                    var newW = Math.max( 60, startW + ( e.pageX - startX ) );
                    th.style.width = newW + 'px';
                }

                function onMouseUp() {
                    handle.classList.remove( 'madeit-security-col-resizer--dragging' );
                    document.body.classList.remove( 'madeit-security-resizing' );
                    document.removeEventListener( 'mousemove', onMouseMove );
                    document.removeEventListener( 'mouseup', onMouseUp );
                }

                document.addEventListener( 'mousemove', onMouseMove );
                document.addEventListener( 'mouseup', onMouseUp );
                e.preventDefault();
            } );
        } );
    }

    // Init on DOM ready, and again after any AJAX that re-renders tables
    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', initResizableTables );
    } else {
        initResizableTables();
    }

    // Re-init after live visitor table refreshes
    var origInit = window.madeitSecurityTablesInited;
    document.addEventListener( 'madeitSecurity:table-rendered', initResizableTables );

} )();

// ══════════════════════════════════════════════════════════════════════════════
// PASSWORD POLICY — Passphrase generator (admin page)
// ══════════════════════════════════════════════════════════════════════════════
( function ( $ ) {
    'use strict';

    function initPasswordPolicy() {
        var $genBtn = $( '#madeit-security-generate-passphrase' );
        if ( ! $genBtn.length ) return;

        $genBtn.on( 'click', function () {
            var btn = $( this );
            btn.prop( 'disabled', true ).text( 'Generating\u2026' );

            var words     = $( '#madeit-security-pp-words' ).val() || 4;
            var separator = $( '#madeit-security-pp-separator' ).val() || '-';

            $.post( madeitSecurity.ajax_url, {
                action:    'madeit_security_generate_passphrase',
                nonce:     madeitSecurity.nonce,
                words:     words,
                separator: separator
            }, function ( res ) {
                btn.prop( 'disabled', false ).html( '&#127922; Generate Passphrase' );
                if ( res.success && res.data ) {
                    $( '#madeit-security-passphrase-output' ).show();
                    $( '#madeit-security-passphrase-value' ).val( res.data.passphrase );
                    $( '#madeit-security-passphrase-entropy' ).text(
                        '\u2248' + escHtml( String( res.data.entropy ) ) + ' bits of entropy (' +
                        escHtml( String( res.data.words ) ) + ' words)'
                    );
                }
            } ).fail( function () {
                btn.prop( 'disabled', false ).html( '&#127922; Generate Passphrase' );
                if ( typeof showToast === 'function' ) showToast( 'Error generating passphrase.', 'error' );
            } );
        } );

        // Copy button
        $( '#madeit-security-copy-passphrase' ).on( 'click', function () {
            var val = $( '#madeit-security-passphrase-value' ).val();
            if ( ! val ) return;
            if ( navigator.clipboard && navigator.clipboard.writeText ) {
                navigator.clipboard.writeText( val ).then( function () {
                    if ( typeof showToast === 'function' ) showToast( 'Copied to clipboard!', 'success' );
                } );
            } else {
                // Fallback
                $( '#madeit-security-passphrase-value' )[ 0 ].select();
                document.execCommand( 'copy' );
                if ( typeof showToast === 'function' ) showToast( 'Copied to clipboard!', 'success' );
            }
        } );
    }

    $( function () { initPasswordPolicy(); } );

} )( jQuery );

// ── GEOIP DATABASE ──────────────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    function initGeoIP() {
        if ( ! $( '#madeit-security-download-geoip' ).length ) return;

        // Flag emoji helper (same as countryFlag used elsewhere)
        function geoFlag( code ) {
            if ( ! code || code.length !== 2 ) return '';
            return code.toUpperCase().split( '' ).map( function ( c ) {
                return String.fromCodePoint( c.charCodeAt( 0 ) + 127397 );
            } ).join( '' );
        }

        // ── Download / Update button ────────────────────────────────────────
        $( '#madeit-security-download-geoip' ).on( 'click', function () {
            var btn    = $( this );
            var result = $( '#madeit-security-geoip-download-result' );

            btn.text( 'Downloading…' ).prop( 'disabled', true );
            result.removeClass( 'madeit-security-notice--success madeit-security-notice--error' ).text( '' ).hide();

            ajax( 'madeit_security_download_geoip', {}, 'POST' ).then( function ( data ) {
                btn.text( '🔄 Update Database' ).prop( 'disabled', false );
                result.addClass( 'madeit-security-notice madeit-security-notice--success' )
                      .text( '✅ ' + escHtml( data.message ) ).show();
                showToast( 'GeoIP database installed.', 'success' );

                // Enable controls that were disabled without DB
                $( '#madeit-security-geoip-test-ip, #madeit-security-geoip-test-btn' ).prop( 'disabled', false );
                $( '[name="madeit_security_geoip_enabled"]' ).prop( 'disabled', false );

                // Reload page after 2s to refresh status panel
                setTimeout( function () { location.reload(); }, 2000 );
            } ).catch( function ( err ) {
                btn.text( '⬇️ Download Database' ).prop( 'disabled', false );
                var msg = err && err.message ? err.message : 'Download failed.';
                result.addClass( 'madeit-security-notice madeit-security-notice--error' )
                      .text( '❌ ' + escHtml( msg ) ).show();
                showToast( msg, 'error' );
            } );
        } );

        // ── Test Lookup ─────────────────────────────────────────────────────
        $( '#madeit-security-geoip-test-btn' ).on( 'click', function () {
            var ip     = $( '#madeit-security-geoip-test-ip' ).val().trim();
            var result = $( '#madeit-security-geoip-test-result' );

            if ( ! ip ) {
                $( '#madeit-security-geoip-test-ip' ).focus();
                return;
            }

            $( this ).text( '🔍 Looking up…' ).prop( 'disabled', true );
            result.hide();

            ajax( 'madeit_security_test_geoip', { ip: ip }, 'POST' ).then( function ( data ) {
                $( '#madeit-security-geoip-test-btn' ).text( '🔍 Lookup' ).prop( 'disabled', false );
                var code = data.country || '';
                $( '#madeit-security-geoip-test-flag' ).text( geoFlag( code ) || '—' );
                $( '#madeit-security-geoip-test-code' ).text( code || '(not found)' );
                result.show();
            } ).catch( function ( err ) {
                $( '#madeit-security-geoip-test-btn' ).text( '🔍 Lookup' ).prop( 'disabled', false );
                var msg = err && err.message ? err.message : 'Lookup failed.';
                $( '#madeit-security-geoip-test-flag' ).text( '❌' );
                $( '#madeit-security-geoip-test-code' ).text( escHtml( msg ) );
                result.show();
            } );
        } );

        // Enter key in test IP field triggers lookup
        $( '#madeit-security-geoip-test-ip' ).on( 'keypress', function ( e ) {
            if ( e.which === 13 ) {
                e.preventDefault();
                $( '#madeit-security-geoip-test-btn' ).trigger( 'click' );
            }
        } );

        // ── Save Settings ───────────────────────────────────────────────────
        $( '#btn-save-geoip-settings' ).on( 'click', function () {
            var btn      = $( this );
            var settings = {};

            $( '.madeit-security-setting-input' ).each( function () {
                var name = $( this ).attr( 'name' );
                if ( ! name ) return;
                if ( $( this ).is( ':checkbox' ) ) {
                    settings[ name ] = $( this ).is( ':checked' ) ? '1' : '0';
                } else {
                    settings[ name ] = $( this ).val();
                }
            } );

            btn.text( 'Saving…' ).prop( 'disabled', true );

            ajax( 'madeit_security_save_settings', { settings: settings }, 'POST' ).then( function () {
                btn.text( '💾 Save GeoIP Settings' ).prop( 'disabled', false );
                $( '#geoip-settings-result' ).addClass( 'madeit-security-notice madeit-security-notice--success' )
                    .text( '✅ GeoIP settings saved.' ).show();
                showToast( 'GeoIP settings saved.', 'success' );

                //$( '#madeit-security-download-geoip' ).prop( 'disabled', false );
            } ).catch( function () {
                btn.text( '💾 Save GeoIP Settings' ).prop( 'disabled', false );
                $( '#geoip-settings-result' ).addClass( 'madeit-security-notice madeit-security-notice--error' )
                    .text( '❌ Error saving settings.' ).show();
            } );
        } );
    }

    $( function () { initGeoIP(); } );

} )( jQuery );

// ── WAF Configuration Page ───────────────────────────────────────────────────
( function ( $ ) {
    'use strict';

    function initWAF() {
        if ( ! $( '#waf-rules-panel' ).length ) return;

        // ── Category accordion ──────────────────────────────────────────────
        $( '.madeit-security-waf-category__header' ).on( 'click', function () {
            var $header = $( this );
            var $body   = $header.next( '.madeit-security-waf-category__body' );
            var isOpen  = $header.attr( 'aria-expanded' ) === 'true';

            $header.attr( 'aria-expanded', isOpen ? 'false' : 'true' );
            $body.slideToggle( 200 );
        } );

        // Expand all
        $( '#btn-waf-expand-all' ).on( 'click', function () {
            $( '.madeit-security-waf-category__header' ).attr( 'aria-expanded', 'true' );
            $( '.madeit-security-waf-category__body' ).slideDown( 200 );
        } );

        // Collapse all
        $( '#btn-waf-collapse-all' ).on( 'click', function () {
            $( '.madeit-security-waf-category__header' ).attr( 'aria-expanded', 'false' );
            $( '.madeit-security-waf-category__body' ).slideUp( 200 );
        } );

        // ── Rule toggle ─────────────────────────────────────────────────────
        $( '.madeit-security-waf-rule-toggle' ).on( 'change', function () {
            var $cb     = $( this );
            var ruleId  = $cb.data( 'rule' );
            var enabled = $cb.is( ':checked' );
            var $row    = $cb.closest( 'tr' );

            $row.toggleClass( 'madeit-security-waf-rule--disabled', ! enabled );

            ajax( 'madeit_security_waf_toggle_rule', { rule_id: ruleId, enabled: enabled ? '1' : '0' }, 'POST' )
                .then( function () {
                    showToast( enabled ? 'Rule enabled' : 'Rule disabled', 'success' );
                } )
                .catch( function () {
                    // Revert on failure
                    $cb.prop( 'checked', ! enabled );
                    $row.toggleClass( 'madeit-security-waf-rule--disabled', enabled );
                    showToast( 'Failed to update rule', 'error' );
                } );
        } );

        // ── Save WAF settings ───────────────────────────────────────────────
        $( '#btn-save-waf-settings' ).on( 'click', function () {
            var btn      = $( this );
            var settings = {};

            $( '.madeit-security-setting-input' ).each( function () {
                var name = $( this ).attr( 'name' );
                if ( ! name ) return;
                if ( $( this ).is( ':checkbox' ) ) {
                    settings[ name ] = $( this ).is( ':checked' ) ? '1' : '0';
                } else {
                    settings[ name ] = $( this ).val();
                }
            } );

            btn.text( 'Saving…' ).prop( 'disabled', true );

            ajax( 'madeit_security_save_settings', { settings: settings }, 'POST' ).then( function () {
                btn.text( '💾 Save WAF Settings' ).prop( 'disabled', false );
                $( '#waf-settings-result' ).addClass( 'madeit-security-notice madeit-security-notice--success' )
                    .text( '✅ WAF settings saved.' ).show();
                showToast( 'WAF settings saved.', 'success' );
            } ).catch( function () {
                btn.text( '💾 Save WAF Settings' ).prop( 'disabled', false );
                $( '#waf-settings-result' ).addClass( 'madeit-security-notice madeit-security-notice--error' )
                    .text( '❌ Error saving settings.' ).show();
            } );
        } );
    }

    $( function () { initWAF(); } );

} )( jQuery );

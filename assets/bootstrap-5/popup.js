
//get all popups by class .madeit-popup
const popups = document.querySelectorAll('.madeit-popup');
for(let popup of popups) {
    var id = popup.getAttribute('data-id');
    var delay = popup.getAttribute('data-delay');
    var action = popup.getAttribute('data-action');
    var session = popup.getAttribute('data-sessies');

    console.log(id);
    console.log(delay);
    console.log(action);
    console.log(session);

    var opensToday = getPopupCookie('popup_' + id + '_today');
    var opensTotal = getPopupCookie('popup_' + id + '_total');
    if(opensToday === undefined) {
        opensToday = 0;
    }
    if(opensTotal === undefined) {
        opensTotal = 0;
    }
    //parse integer
    opensToday = parseInt(opensToday);
    opensTotal = parseInt(opensTotal);

    var expireDays = 365 * 5;
    if(session === 'Eén keer per dag') {
        expireDays = 1;
    }
    else if(session === 'Eén keer per week') {
        expireDays = 7;
    }
    else if(session === 'Eén keer per maand') {
        expireDays = 30;
    }
    else if(session === 'Eén keer per jaar') {
        expireDays = 365;
    }

    if(action == 'Openen van pagina' || action == 'Openen van specifieke pagina\'s') {
        if(opensToday > 0 && session === 'Elke bezoek één keer') {
            continue;
        }
        else if(session === 'Elke pagina') {
            //Ga verder
        }
        else if(opensToday > 0 && session === 'Eén keer per dag') {
            continue;
        }
        else if(opensTotal > 0 && session === 'Eén keer per week') {
            continue;
        }
        else if(opensTotal > 0 && session === 'Eén keer per maand') {
            continue;
        }
        else if(opensTotal > 0 && session === 'Eén keer per jaar') {
            continue;
        }
        else if(opensTotal > 0 && session === 'Eén keer in totaal') {
            continue;
        }
        else if((opensToday > 0 || opensTotal > 5) && session === '5 keer, één keer per bezoek') {
            continue;
        }
        else if((opensToday > 0 || opensTotal > 10) && session === '10 keer, één keer per bezoek') {
            continue;
        }

        const myModal = new bootstrap.Modal(popup, {});
        setTimeout(function() {
            myModal.show();
            setPopupCookie('popup_' + id + '_today', opensToday + 1, 1);
            setPopupCookie('popup_' + id + '_total', opensTotal + 1, expireDays);
        }, delay);
    }
}


function setPopupCookie( cName, value, exdays ) {
    var cValue, exdate = new Date( );
    exdate.setDate( exdate.getDate( ) + exdays );
    cValue = value + ( ( null == exdays ) ? '' : '; expires=' + exdate.toUTCString( ) );
    document.cookie = cName + '=' + cValue + '; path=/';
}

function getPopupCookie( cName ) {
    var i, x, y, ARRcookies = document.cookie.split( ';' );
    for ( i = 0; i < ARRcookies.length; i++ ) {
        x = ARRcookies[i].substring( 0, ARRcookies[i].indexOf( '=' ) );
        y = ARRcookies[i].substring( ARRcookies[i].indexOf( '=' ) + 1 );
        x = x.replace( /^\s+|\s+$/g, '' );
        if ( x === cName ) {
            return y;
        }
    }
}
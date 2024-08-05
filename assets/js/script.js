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

	
    $( '.do-lightbox' ).each( function( ) {
        if ( $( this ).parent( ).hasClass( 'no-lightbox' ) || $( this ).parents( '.wp-block-image' ).hasClass( 'no-lightbox' ) ) {
            return;
        }
        if ( ( undefined === $( this ).parent( ).tagName && 'a' === $( this ).parent( )[0].localName ) || 'a' === $( this ).parent( ).tagName ) {
            $( this ).parent( ).addClass( 'click-lightbox' );
        } else {
            $( this ).wrap( '<a href="' + $( this ).attr( 'src' ) + '" class="click-lightbox"></a>' );
        }
        $( this ).removeClass( 'do-lightbox' );
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
                    '<button type="button" aria-label="Close" data-dismiss="modal" data-bs-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
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
                    '<button type="button" aria-label="Close" data-dismiss="modal" data-bs-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
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
            $( lightboxGroup ).find( 'a:eq(' + $( this ).attr( 'data-index' ) + ')' ).addClass('active-lightbox-click').click( );
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
                    '<button type="button" aria-label="Close" data-bs-dismiss="modal" data-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
                '</div>' +
                '<div class="lightbox-nav-overlay">' +
                    '<a href="' + leftUrl + '" data-index="' + leftIndex + '"><span>❮</span></a>' +
                    '<a href="' + rightUrl + '" data-index="' + rightIndex + '"><span>❯</span></a>' +
                '</div><img src="' + url + '" alt="" style="width: 100%">' + descHtml );
        } else {
            $( '#lightbox-modal .modal-content' ).html( '<div class="modal-header">' +
                    '<button type="button" aria-label="Close"data-bs-dismiss="modal" data-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
                '</div>' +
                '<img src="' + url + '" alt="" style="width: 100%">' );
        }
        $( '#lightbox-modal' ).modal( 'show' );
    });

    $( '.woocommerce-product-gallery__wrapper[data-galary-id] a' ).click( function( e ) {
        e.preventDefault();
        var url = $(this).attr( 'href' );
        var index = $( this ).parents( '.woocommerce-product-gallery__wrapper' ).find( 'a' ).index( this );
        if(index > 0 && !$(this).hasClass('active-lightbox-click')) {
            var thisSrcSet = $( this ).find( 'img' ).attr( 'srcset' );
            $( '.woocommerce-product-gallery__wrapper[data-galary-id] a:eq(0) img' ).attr( 'srcset', thisSrcSet );
            $( '.woocommerce-product-gallery__wrapper[data-galary-id] a:eq(0) img' ).attr( 'scr', url );
            $( '.woocommerce-product-gallery__wrapper[data-galary-id] a:eq(0) img' ).attr( 'data-large_image', url );
            $( '.woocommerce-product-gallery__wrapper[data-galary-id] a:eq(0)' ).attr( 'href', url );
        } else {
            $(this).removeClass('active-lightbox-click');
            var url = $( this ).attr( 'href' );
            var group, index, total, leftIndex, rightIndex, leftUrl, rightUrl;
            var hasDescription = false;
            var description = '';
            var descHtml = '';
            e.preventDefault();
            if ( ! url.endsWith( '.jpg' ) && ! url.endsWith( '.png' ) ) {
                url = $( this ).find( 'img:eq(0)' ).attr( 'data-large_image' );
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
                        '<button type="button" aria-label="Close"data-bs-dismiss="modal" data-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
                    '</div>' +
                    '<div class="lightbox-nav-overlay">' +
                        '<a href="' + leftUrl + '" data-index="' + leftIndex + '"><span>❮</span></a>' +
                        '<a href="' + rightUrl + '" data-index="' + rightIndex + '"><span>❯</span></a>' +
                    '</div><img src="' + url + '" alt="" style="width: 100%">');
            } else {
                $( '#lightbox-modal .modal-content' ).html( '<div class="modal-header">' +
                        '<button type="button" aria-label="Close" data-bs-dismiss="modal" data-dismiss="modal" class="close"><span aria-hidden="true">×</span></button>' +
                    '</div>' +
                    '<img src="' + url + '" alt="" style="width: 100%">' );
            }
            $( '#lightbox-modal' ).modal( 'show' );
        }
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
    
    $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
        if($( window ).width() < 768) {
            if (!$(this).next().hasClass('show')) {
                $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
            }
            var $subMenu = $(this).next('.dropdown-menu');
            if ($subMenu.hasClass('show')) {
                return true;
                //$subMenu.removeClass('show');
            }
            else {
                $subMenu.addClass('show');
            }

            $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
                $('.dropdown-submenu .show').removeClass('show');
            });

            return false;
        }
    });
    
    $('.dropdown-menu a.dropdown-toggle').on('mouseenter', function(e) {
        if($( window ).width() >= 768) {
            if (!$(this).next().hasClass('show')) {
                $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
            }
            var $subMenu = $(this).next('.dropdown-menu');
            $subMenu.toggleClass('show');


            $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
                $('.dropdown-submenu .show').removeClass('show');
            });
        }

        return false;
    });

    $('.review-show-more').on('click', function(e) {
        e.preventDefault();
        //find parent .review-item
        var reviewItem = $(this).parents('.review-item, .single-review-item');
        reviewItem.find('.long').removeClass('d-none');
        reviewItem.find('.short').addClass('d-none');
    });
});


/* Fix Menu Scroll */
function getScollPosition() {
    let scroll = window.scrollY;
    let roundedScroll = Math.round(scroll/100)*100;

    const el = document.querySelector("body");

	var regx = new RegExp('\\bhas-scroll-[^ ]*[ ]?\\b', 'g');
	el.className = el.className.replace(regx, '');

    if(scroll >= 40) {
        el.classList.remove('no-scroll');
        el.classList.add('has-scroll');
    } else {
        el.classList.remove('has-scroll');
        el.classList.add('no-scroll');
    }
    el.classList.add('has-scroll-' + roundedScroll);
}

getScollPosition();
window.addEventListener('scroll', function() {
    getScollPosition();
});

var maxScrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
var fold = document.documentElement.clientHeight;
var wasBelowFold = false;
var percentagesArr = [25,50,75,100];
const showed = {};
let timeout;
let previousPercentage;
window.addEventListener("scroll", function (event) {
    var scrollVal = this.scrollY;
    var scrollPercentage = Math.round(scrollVal / maxScrollHeight * 100);
    let currentPercentage = 0;
    let i = 0;

    if(scrollVal > fold && !wasBelowFold) {
        track('belowFold', 'true');
        wasBelowFold = true;
    }

    while(percentagesArr[i] <= scrollPercentage) {
      currentPercentage = percentagesArr[i++];
    }
    if (previousPercentage !== currentPercentage) {
        clearTimeout(timeout);
        timeout = currentPercentage !== 0 && !showed[currentPercentage]
          ? setTimeout(() => {
            track('scroll', currentPercentage);
              showed[currentPercentage] = true;
            }, 500)
          : null;
        previousPercentage = currentPercentage;
    }
});

window.addEventListener("resize", () => {
    maxScrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
});

window.addEventListener('click', function(e) {
    var target = e.target;
    var element = target.tagName;
    if(element === 'A') {
        track('click', target.textContent, target.href);
    } else if(element === 'BUTTON') {
        track('click', target.textContent, target.value);
    } else if(element === 'INPUT') {
        track('click', target.value, target.value);
    } else if(element === 'IMG') {
        track('click', target.alt, target.src);
    } else {
        track('click', element, target.textContent);
    }
});

jQuery(function($) {
	$('.madeit-forms-noajax').submit(function(e) {
		track('conversion', 'form_submit');
	});
});

document.addEventListener("madeit-forms-quiz-next", function(e) {
	track('click', 'quiz', e.detail);
});

function track(type, value, extraValue = null) {
    //track to gtag if available
    if(typeof gtag !== 'undefined') {
        gtag('event', type, {
            'event_category': value,
            'event_label': extraValue,
        });
    }
}

jQuery(document).ready( function( $ ) {
    $('.keep-max-container-size').each(function() {
        var orderLgFirst = $(this).parent().find('.order-lg-first');
        if(orderLgFirst.length > 0) {
            var lgFirstIndex = $(orderLgFirst).index();
            var thisIndex = $(this).index();

            if(thisIndex !== lgFirstIndex) {
                $(this).addClass('max-end-size');
            }
        }


        var orderLgLast = $(this).parent().find('.order-lg-last');
        if(orderLgLast.length > 0) {
            var lgLastIndex = $(orderLgLast).index();
            var thisIndex = $(this).index();

            if(thisIndex !== lgLastIndex) {
                $(this).addClass('max-start-size');
            }
        }
    });
});

jQuery(document).ready( function( $ ) {
    $('#madeit-unlock-form').submit(function(e) {
        e.preventDefault();

        var email = $('#madeit-unlock-email').val();
        var newsletter = $('#madeit-unlock-newsletter').is(':checked') ? 1 : 0;
        var lead = $('#madeit-unlock-lead').val();
        var post_id = $('#madeit-unlock-postid').val();

        if(email.length > 0) {
            //loading state
            $('#madeit-unlock-form').hide();
            $('#madeit-unlock-loading').show();

            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                type: 'POST',
                data: {
                    action: 'madeit_unlock_content',
                    post_id: post_id,
                    email: email,
                    newsletter: newsletter,
                    lead: lead
                },
                success: function(response) {
                    $('#madeit-unlock-loading').hide();

                    //redirect to url
                    if(response.url) {
                        window.location.href = response.url;
                    }
                }
            });
        }
    });
});


jQuery(document).ready( function( $ ) {
    $('#madeit-review-form').submit(function(e) {
        e.preventDefault();

        var name = $(this).find('[name="reviewer-name"]').val();
        var email = $(this).find('[name="reviewer-email"]').val();
        var rating = $(this).find('[name="review-rating"]:checked').val();
        var title = $(this).find('[name="review-title"]').val();
        var description = $(this).find('[name="review-description"]').val();

        $(this).find('.loading').show();
        $(this).find('.form').hide();

        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            type: 'POST',
            data: {
                action: 'madeit_submit_review',
                reviewer_name: name,
                email: email,
                rating: rating,
                title: title,
                description: description
            },
            success: function(response) {
                //stop loading
                $('#madeit-review-form').find('.loading').hide();

                //start success
                $('#madeit-review-form').find('.alert-success').show();

                if(rating >= 4) {
                    $('#madeit-review-form').find('.forward').show();
                }
            }
        });
    });
});

//if berocket_ajax_products_loaded is triggered, we need to reinit the lightbox
jQuery(document).ready( function( $ ) {
    $(document).on('berocket_ajax_products_loaded', function() {
        //scroll to top of product list
        $('html, body').animate({scrollTop: $('.products').offset().top - ($('.navbar:eq(0)').height() * 2)}, 200);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    //Hover or click on element [data-megamenu-subid] will show the sub menu
    document.querySelectorAll('[data-megamenu-subid]').forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            var subId = item.getAttribute('data-megamenu-subid');
            var subMenu = document.querySelector('#megamenu-subitem-' + subId);
            if(subMenu) {
                document.querySelectorAll('.megamenu-subitem').forEach(function(s) {
                    if(!s.classList.contains('d-none')) {
                        s.classList.add('d-none');
                    }
                });

                item.parentElement.parentElement.querySelectorAll('.active').forEach(function(a) {
                    a.classList.remove('active');
                });

                item.parentElement.classList.add('active');

                subMenu.classList.remove('d-none');
            }
        });
    });
});
(function($, window, document) {
    "use strict";

    $.fn.yit_infinitescroll = function(options) {
        var opts = $.extend({
            nextSelector: false,
            navSelector: false,
            itemSelector: false,
            contentSelector: false,
            maxPage: false,
            loader: false,
            is_shop: false
        }, options),

        loading = false,
        finished = false;
        
            // validate options and hide std navigation
        if ($(opts.nextSelector).length && $(opts.navSelector).length && $(opts.itemSelector).length && $(opts.contentSelector).length) {
            $(opts.navSelector).hide();
        } else {
            // set finished true
            finished = true;
        }

        // set elem columns ( in shop page )
        var first_elem = $(opts.contentSelector).find(opts.itemSelector).first(),
            columns = first_elem.nextUntil('.first', opts.itemSelector).length + 1;

        var main_ajax = function() {
            var desturl = $(opts.nextSelector).attr('href'); // init next url
            if (typeof desturl === 'undefined') {
                return;
            }

            var last_elem = $(opts.itemSelector).last();
            // set loader and loading
            $(opts.navSelector).after('<div class="madeit-infinite-infs-loader d-flex justify-content-center w-100 my-3"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>');

            loading = true;
            // decode url to prevent error
            desturl = decodeURIComponent(desturl);
            desturl = desturl.replace(/^(?:\/\/|[^\/]+)*\//, "/");
            // ajax call

            $.ajax({
                // params
                url: desturl,
                dataType: 'html',
                cache: false,
                success: function(data) {

                    var obj = $(data),
                        elem = obj.find(opts.itemSelector),
                        next = obj.find(opts.nextSelector),
                        current_url = desturl;

                    if (next.length) {
                        desturl = next.attr('href');
                        $(opts.nextSelector).attr('href', desturl);
                    } else {
                        // set finished var true
                        finished = true;
                        $(document).trigger('madeit-infinite-infs-scroll-finished');
                    }

                    last_elem.after(elem);

                    $('.madeit-infinite-infs-loader').remove();
                    $('.woocommerce-result-count').remove();

                    $(document).trigger('madeit_infinite_adding_elem', [elem, current_url]);

                    elem.addClass('madeit-infinite-infs-animated');

                    setTimeout(function() {
                        loading = false;
                        // remove animation class
                        elem.removeClass('madeit-infinite-infs-animated');

                        $(document).trigger('madeit_infinite_added_elem', [elem, current_url]);

                    }, 1000);

                }
            });
        };

        // set event
        $(window).on('scroll touchstart', function() {
            $(this).trigger('madeit_infinite_start');
        });

        $(window).on('berocket_ajax_filtering_end', function() {
            if ($(opts.nextSelector).length && $(opts.navSelector).length && $(opts.itemSelector).length && $(opts.contentSelector).length) {
                $(opts.navSelector).hide();
                finished = false;
            }
        });

        $(window).on('madeit_infinite_start', function() {
            var t = $(this),
                elem = $(opts.itemSelector).last();

            if (typeof elem === 'undefined') {
                return;
            }

            if (!loading && !finished && (t.scrollTop() + t.height()) >= (elem.offset().top - (2 * elem.height()))) {
                main_ajax();
            }
        })
    }
})(jQuery, window, document);

(function($) {
    "use strict";

    if (typeof madeit_infinite === 'undefined') {
        return;
    }

    // set options
    var infinite_scroll = {
        'nextSelector': madeit_infinite.nextSelector,
        'navSelector': madeit_infinite.navSelector,
        'itemSelector': madeit_infinite.itemSelector,
        'contentSelector': madeit_infinite.contentSelector,
        'is_shop': madeit_infinite.shop
    };

    $(madeit_infinite.contentSelector).yit_infinitescroll(infinite_scroll);

    $(document).on('madeit-infinite-wcan-ajax-loading', function() {
        // reset
        $(window).unbind('madeit_infinite_start');
    });

    $(document).on('madeit-infinite-wcan-ajax-filtered', function() {
        // restart
        $(madeit_infinite.contentSelector).yit_infinitescroll(infinite_scroll);
    });
})(jQuery);
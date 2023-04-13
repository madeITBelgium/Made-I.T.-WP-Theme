(function ($) {
    $( document ).on( 'click', '.add_to_cart_button', function(e) {
        e.preventDefault();

        var thisbutton = $(this);
        var product_qty = thisbutton.data('quantity') || 1;
        var product_id = thisbutton.data('product_id') || 0;
        var product_sku = thisbutton.data('product_sku') || '';

        var data = {
            action: 'woocommerce_ajax_add_to_cart',
            product_id: product_id,
            product_sku: product_sku,
            quantity: product_qty,
        };

        $(document.body).trigger('adding_to_cart', [thisbutton, data]);

        var text = thisbutton.html();
        $.ajax({
            type: 'post',
            url: wc_add_to_cart_params.ajax_url,
            data: data,
            beforeSend: function (response) {
                thisbutton.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>');
            },
            complete: function (response) {
                setTimeout(function() {
                    thisbutton.html(text);
                }, 1000);
            },
            success: function (response) {
                if (response.success === false) {
                    if(response.product_url) {
                        window.location = response.product_url;
                        return;
                    }
                    return;
                }

                thisbutton.html('<i class="fa fa-check" aria-hidden="true"></i>');
                var myModal = new bootstrap.Modal(document.getElementById('addToCartPopup'));
                $('#addToCartPopup').modal('show');
            },
        });
    });


    $( document ).on( 'click', '.single_add_to_cart_button', function(e) {
        e.preventDefault();

        if($(this).hasClass('disabled')) {
            return;
        }

        var thisbutton = $(this),
        $form = thisbutton.closest('form.cart'),
        id = thisbutton.val(),
        product_qty = $form.find('input[name=quantity]').val() || 1,
        product_id = $form.find('input[name=product_id]').val() || id,
        variation_id = $form.find('input[name=variation_id]').val() || 0,
        attributes = [];

        if($form.find('[name^=attribute]').length > 0) {
            for(var i = 0; i < $form.find('[name^=attribute]').length; i++) {
                var attribute = $form.find('[name^=attribute]').eq(i);
                if(attribute.is('select')) {
                    attributes.push({
                        name: attribute.attr('name'),
                        value: attribute.find('option:selected').val(),
                    });
                    //attributes[attribute.attr('name')] = attribute.find('option:selected').val();
                } else {
                    attributes.push({
                        name: attribute.attr('name'),
                        value: attribute.val(),
                    });
                    //attributes[attribute.attr('name')] = attribute.val();
                }
            }
        }

        var data = {
            action: 'woocommerce_ajax_add_to_cart',
            product_id: product_id,
            product_sku: '',
            quantity: product_qty,
            variation_id: variation_id,
            attributes: attributes,
        };

        $(document.body).trigger('adding_to_cart', [thisbutton, data]);

        var text = thisbutton.html();
        $.ajax({
            type: 'post',
            url: wc_add_to_cart_params.ajax_url,
            data: data,
            beforeSend: function (response) {
                thisbutton.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>');
            },
            complete: function (response) {
                setTimeout(function() {
                    thisbutton.html(text);
                }, 1000);
            },
            success: function (response) {
                if (response.success === false) {
                    if(response.product_url) {
                        window.location = response.product_url;
                        return;
                    }
                    return;
                }

                thisbutton.html('<i class="fa fa-check" aria-hidden="true"></i>');
                $('#addToCartPopup').modal('show');
            },
        });
    });
})(jQuery);

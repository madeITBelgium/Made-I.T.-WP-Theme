document.addEventListener('DOMContentLoaded', function() {
    //.b2b-madeit-add-favorite
    //.b2b-madeit-remove-favorite

    // Add favorite
    document.querySelectorAll('.b2b-madeit-add-favorite, .b2b-madeit-remove-favorite').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            var $this = this;
            var $product_id = $this.getAttribute('data-product-id');
            var $action = $this.classList.contains('b2b-madeit-add-favorite') ? 'add' : 'remove';
            var $data = [
                'action=b2b_madeit_favorite',
                'product_id=' + $product_id,
                'type=' + $action
            ];

            fetch(wc_add_to_cart_params.ajax_url, {
                method: 'POST',
                body: $data.join('&'),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if ($action == 'add') {
                            $this.classList.remove('b2b-madeit-add-favorite');
                            $this.classList.add('b2b-madeit-remove-favorite');
                            //change far to fas in classList from i
                            $this.querySelector('i').classList.remove('far');
                            $this.querySelector('i').classList.add('fas');
                        } else {
                            $this.classList.remove('b2b-madeit-remove-favorite');
                            $this.classList.add('b2b-madeit-add-favorite');

                            //change fas to far in classList from i
                            $this.querySelector('i').classList.remove('fas');
                            $this.querySelector('i').classList.add('far');
                        }
                    }
                });
        });
    });
});

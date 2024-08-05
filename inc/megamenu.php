<?php

//ACF

//Menu items

function madeit_megamenu_menuitems( $items, $args )
{
    if(!in_array($args->theme_location, ['top', 'upper-bottom'])) {
        return $items;
    }

    foreach($items as $k => $item) {
        if($item->menu_item_parent == 0 && get_field('megamenu', $item->ID)) {
            $items[$k]->classes[] = 'megamenu';

            if(get_field('megamenu_stijl', $item->ID) === 'style_woo') {
                //Get WooCommerce categories
                $args = [
                    'taxonomy' => 'product_cat',
                    'hide_empty' => false,
                    'parent' => 0
                ];
                
                $product_categories = get_terms($args);
                foreach($product_categories as $product_category) {
                    $items[] = (object) [
                        'title' => $product_category->name,
                        'menu_item_parent' => $item->ID,
                        'ID' => 'product_cat_'.$product_category->term_id,
                        'db_id' => '',
                        'url' => get_term_link($product_category),
                        'classes' => ['menu-item']
                    ];

                    //get WooCommerce subcategories
                    $args['parent'] = $product_category->term_id;
                    $product_subcategories = get_terms($args);
                    foreach($product_subcategories as $product_subcategory) {
                        $items[] = (object) [
                            'title' => $product_subcategory->name,
                            'menu_item_parent' => 'product_cat_'.$product_category->term_id,
                            'ID' => 'product_cat_'.$product_subcategory->term_id,
                            'db_id' => '',
                            'url' => get_term_link($product_subcategory),
                            'classes' => ['menu-item']
                        ];
                    }
                }
            }
            /*
            $label = 'Lorem Ipsum';    // add your custom menu item content here

            // Create a nav_menu_item object
            $item = array(
                'title'            => $label,
                'menu_item_parent' => 0,
                'ID'               => 'yourItemID',
                'db_id'            => '',
                'url'              => $link,
                'classes'          => array( 'menu-item' )
            );
        
            $new_links[] = (object) $item; // Add the new menu item to our array
        
            // insert item
            $location = 3;   // insert at 3rd place
            array_splice( $items, $location, 0, $new_links );
            */
        }
    }

    return $items;
}
add_filter( 'wp_nav_menu_objects', 'madeit_megamenu_menuitems', 10, 2 );
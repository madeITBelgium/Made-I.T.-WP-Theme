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

            if(get_field('megamenu_stijl', $item->ID) === 'style_woo' || get_field('megamenu_stijl', $item->ID) === 'style_woo_2') {
                //Get WooCommerce categories
                $args = [
                    'taxonomy' => 'product_cat',
                    'hide_empty' => true,
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


                        //get WooCommerce subcategories
                        $args['parent'] = $product_subcategory->term_id;
                        $product_subsubcategories = get_terms($args);
                        foreach($product_subsubcategories as $product_subsubcategory) {
                            $items[] = (object) [
                                'title' => $product_subsubcategory->name,
                                'menu_item_parent' => 'product_cat_'.$product_subcategory->term_id,
                                'ID' => 'product_cat_'.$product_subsubcategory->term_id,
                                'db_id' => '',
                                'url' => get_term_link($product_subsubcategory),
                                'classes' => ['menu-item']
                            ];
                        }
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


add_action( 'acf/include_fields', function() {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	acf_add_local_field_group( array(
	'key' => 'group_66aca032661c5',
	'title' => 'Megamenu',
	'fields' => array(
		array(
			'key' => 'field_66aca03363ed4',
			'label' => 'Megamenu',
			'name' => 'megamenu',
			'aria-label' => '',
			'type' => 'true_false',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'message' => '',
			'default_value' => 0,
			'ui' => 0,
			'ui_on_text' => '',
			'ui_off_text' => '',
		),
		array(
			'key' => 'field_66aca06063ed5',
			'label' => 'Megamenu Stijl',
			'name' => 'megamenu_stijl',
			'aria-label' => '',
			'type' => 'select',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => 'field_66aca03363ed4',
						'operator' => '==',
						'value' => '1',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'choices' => array(
				'style_1' => 'Verdeling in 3 kolommen',
				'style_2' => 'Verdeling in 4 kolommen',
				'style_3' => 'Hoofditems links, met verdeling in 4 kolommen',
				'style_woo' => 'WooCommerce categorieën',
				'style_woo_2' => 'WooCommerce categorieën, style2',
			),
			'default_value' => 'style_1',
			'return_format' => 'value',
			'multiple' => 0,
			'allow_null' => 0,
			'ui' => 0,
			'ajax' => 0,
			'placeholder' => '',
		),
		array(
			'key' => 'field_66aca07663ed6',
			'label' => 'Voeg WooCommerce categorieën toe',
			'name' => 'applend_woocommerce_categories',
			'aria-label' => '',
			'type' => 'true_false',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => 'field_66aca06063ed5',
						'operator' => '!=',
						'value' => 'style_woo',
					),
					array(
						'field' => 'field_66aca06063ed5',
						'operator' => '!=',
						'value' => 'style_woo_2',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'message' => '',
			'default_value' => 0,
			'ui' => 0,
			'ui_on_text' => '',
			'ui_off_text' => '',
		),
		array(
			'key' => 'field_66aca0b463ed7',
			'label' => 'WooCommerce Categorieën',
			'name' => 'woocommerce_categories',
			'aria-label' => '',
			'type' => 'taxonomy',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => 'field_66aca07663ed6',
						'operator' => '==',
						'value' => '1',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'taxonomy' => 'product_cat',
			'add_term' => 0,
			'save_terms' => 0,
			'load_terms' => 1,
			'return_format' => 'id',
			'field_type' => 'multi_select',
			'allow_null' => 1,
			'bidirectional' => 0,
			'multiple' => 0,
			'bidirectional_target' => array(
			),
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'nav_menu_item',
				'operator' => '==',
				'value' => 'location/top',
			),
		),
		array(
			array(
				'param' => 'nav_menu_item',
				'operator' => '==',
				'value' => 'location/upper-bottom',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
	'show_in_rest' => 0,
) );
} );


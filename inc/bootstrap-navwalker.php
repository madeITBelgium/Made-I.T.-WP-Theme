<?php

/**
 * Class Name: wp_bootstrap_navwalker
 * GitHub URI: https://github.com/twittem/wp-bootstrap-navwalker
 * Description: A custom WordPress nav walker class to implement the Bootstrap 3 navigation style in a custom theme using the WordPress built in menu manager.
 * Version: 2.0.4
 * Author: Edward McIntyre - @twittem
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt.
 */
class wp_bootstrap_navwalker extends Walker_Nav_Menu
{
    /**
     * @see Walker::start_lvl()
     * @since 3.0.0
     *
     * @param string $output Passed by reference. Used to append additional content.
     * @param int    $depth  Depth of page. Used for padding.
     */
    public function start_lvl(&$output, $depth = 0, $args = [])
    {
        $indent = str_repeat("\t", $depth);

        // Default class.
        $classes = ['dropdown-menu'];

        /**
         * Filters the CSS class(es) applied to a menu list element.
         *
         * @since 4.8.0
         *
         * @param string[] $classes Array of the CSS classes that are applied to the menu `<ul>` element.
         * @param stdClass $args    An object of `wp_nav_menu()` arguments.
         * @param int      $depth   Depth of menu item. Used for padding.
         */
        $class_names = implode(' ', apply_filters('nav_menu_submenu_css_class', $classes, $args, $depth));

        $atts = [];
        $atts['class'] = !empty($class_names) ? $class_names : '';
        $atts['role'] = 'menu';

        /**
         * Filters the HTML attributes applied to a menu list element.
         *
         * @since 6.3.0
         *
         * @param array $atts {
         *                    The HTML attributes applied to the `<ul>` element, empty strings are ignored.
         *
         * @var string $class    HTML CSS class attribute.
         *             }
         *
         * @param stdClass $args  An object of `wp_nav_menu()` arguments.
         * @param int      $depth Depth of menu item. Used for padding.
         */
        $atts = apply_filters('nav_menu_submenu_attributes', $atts, $args, $depth);
        $attributes = $this->build_atts($atts);

        $output .= "\n$indent<ul{$attributes}>\n";
    }

    /**
     * @see Walker::start_el()
     * @since 3.0.0
     *
     * @param string $output       Passed by reference. Used to append additional content.
     * @param object $item         Menu item data object.
     * @param int    $depth        Depth of menu item. Used for padding.
     * @param int    $current_page Menu item ID.
     * @param object $args
     */
    public function start_el(&$output, $item, $depth = 0, $args = [], $id = 0)
    {
        $indent = ($depth) ? str_repeat("\t", $depth) : '';

        /*
         * Dividers, Headers or Disabled
         * =============================
         * Determine whether the item is a Divider, Header, Disabled or regular
         * menu item. To prevent errors we use the strcasecmp() function to so a
         * comparison that is not case sensitive. The strcasecmp() function returns
         * a 0 if the strings are equal.
         */
        if (strcasecmp($item->attr_title, 'divider') == 0 && $depth === 1) {
            $output .= $indent.'<li class="divider">';
        } elseif (strcasecmp($item->title, 'divider') == 0 && $depth === 1) {
            $output .= $indent.'<li class="divider">';
        } elseif (strcasecmp($item->attr_title, 'dropdown-header') == 0 && $depth === 1) {
            $output .= $indent.'<li class="dropdown-header">'.esc_attr($item->title);
        } elseif (strcasecmp($item->attr_title, 'disabled') == 0) {
            $output .= $indent.'<li class="disabled"><a href="#">'.esc_attr($item->title).'</a>';
        } else {
            $class_names = $value = '';

            $classes = empty($item->classes) ? [] : (array) $item->classes;
            $classes[] = 'menu-item-'.$item->ID;
            $classes[] = 'nav-item';

            $class_names = implode(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args));

            if ($args->has_children && $depth === 0) {
                $class_names .= ' dropdown';
            } elseif ($args->has_children && $depth > 0) {
                $class_names .= ' dropdown-submenu';
            }

            if (in_array('current-menu-item', $classes)) {
                $class_names .= ' active';
            }

            $class_names = $class_names ? ' class="'.esc_attr($class_names).'"' : '';

            $id = apply_filters('nav_menu_item_id', 'menu-item-'.$item->ID, $item, $args);
            $id = $id ? ' id="'.esc_attr($id).'"' : '';

            $output .= $indent.'<li'.$id.$value.$class_names.' role="menuitem">';

            $atts = [];
            //$atts['title'] = !empty($item->title) ? $item->title : '';
            $atts['target'] = !empty($item->target) ? $item->target : '';
            $atts['rel'] = !empty($item->xfn) ? $item->xfn : '';

            // If item has_children add atts to a.
            if (function_exists('get_field') && $depth === 0 && get_field('megamenu', $item->ID)) {
                $atts['href'] = !empty($item->url) ? $item->url : '';
                $atts['class'] = 'dropdown-toggle';
                $atts['data-bs-toggle'] = 'dropdown';
                $atts['aria-expanded'] = 'false';
            } elseif ($args->has_children && $depth === 0) {
                $atts['href'] = '#';
                $atts['data-toggle'] = 'dropdown';
                $atts['data-bs-toggle'] = 'dropdown';
                $atts['aria-expanded'] = 'false';
                $atts['class'] = 'dropdown-toggle';
            } elseif ($args->has_children && $depth > 0) {
                //$atts['href'] = '#';
                //$atts['data-toggle'] = 'dropdown';
                $atts['class'] = 'dropdown-toggle';
                $atts['href'] = !empty($item->url) ? $item->url : '';
            } else {
                $atts['href'] = !empty($item->url) ? $item->url : '';
            }

            if (isset($atts['class'])) {
                $atts['class'] .= ' nav-link';
            } else {
                $atts['class'] = 'nav-link';
            }

            $atts = apply_filters('nav_menu_link_attributes', $atts, $item, $args);

            $attributes = '';
            foreach ($atts as $attr => $value) {
                if (!empty($value)) {
                    $value = ('href' === $attr) ? esc_url($value) : esc_attr($value);
                    $attributes .= ' '.$attr.'="'.$value.'"';
                }
            }

            $item_output = $args->before;

            /*
             * Glyphicons
             * ===========
             * Since the the menu item is NOT a Divider or Header we check the see
             * if there is a value in the attr_title property. If the attr_title
             * property is NOT null we apply it as the class name for the glyphicon.
             */
            if (!empty($item->attr_title)) {
                $item_output .= '<a'.$attributes.'><span class="glyphicon '.esc_attr($item->attr_title).'"></span>&nbsp;';
            } else {
                $item_output .= '<a'.$attributes.'>';
            }

            $item_output .= $args->link_before.apply_filters('the_title', $item->title, $item->ID).$args->link_after;
            $item_output .= ($args->has_children && 0 === $depth) ? ' <span class="caret"></span></a>' : '</a>';
            $item_output .= $args->after;

            $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
        }
    }

    /**
     * Traverse elements to create list from elements.
     *
     * Display one element if the element doesn't have any children otherwise,
     * display the element and its children. Will only traverse up to the max
     * depth and no ignore elements under that depth.
     *
     * This method shouldn't be called directly, use the walk() method instead.
     *
     * @see Walker::start_el()
     * @since 2.5.0
     *
     * @param object $element           Data object
     * @param array  $children_elements List of elements to continue traversing.
     * @param int    $max_depth         Max depth to traverse.
     * @param int    $depth             Depth of current element.
     * @param array  $args
     * @param string $output            Passed by reference. Used to append additional content.
     *
     * @return null Null on failure with no changes to parameters.
     */
    public function display_element($element, &$children_elements, $max_depth, $depth, $args, &$output)
    {
        if (!$element) {
            return;
        }

        $max_depth = (int) $max_depth;
        $depth = (int) $depth;

        $id_field = $this->db_fields['id'];
        $id = $element->$id_field;
        $rand = rand(1000, 9999);

        // Display this element.
        if (is_object($args[0])) {
            $args[0]->has_children = !empty($children_elements[$element->$id_field]);
        }

        $this->start_el($output, $element, $depth, ...array_values($args));

        if ($depth === 0 && function_exists('get_field') && get_field('megamenu', $element->ID)) {
            $output = str_replace('data-bs-toggle="dropdown" aria-expanded="false">'.apply_filters('the_title', $element->title, $element->ID), 'data-bs-toggle="dropdown" aria-expanded="false" id="navbarDropdown'.$rand.'">'.apply_filters('the_title', $element->title, $element->ID), $output);
            $classes = apply_filters('madeit_megamenu_dropdown_class', ['dropdown-menu', 'container'], $element);
            $output .= '<div class="'.implode(' ', $classes).'" role="menu" aria-labelledby="navbarDropdown'.$rand.'">';
            $output .= '<div class="row w-100 m-auto">';
            if(get_field('megamenu_stijl', $element->ID) === 'style_1') { //3 columns
                //Mobile
                $classes = apply_filters('madeit_megamenu_style_woo_2_mobile', ['col-12', 'd-lg-none', 'list-unstyled'], $element);
                $output .= '<ul class="'.implode(' ', $classes).'">';
                foreach ($children_elements[$id] ?? [] as $i => $child) {
                    if (isset($children_elements[$child->ID])) {
                        $output .= '<li class="nav-item menu-item dropdown">';
                        $output .= '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown'.$rand.'_'.$child->ID.'" role="button" data-bs-toggle="dropdown" aria-expanded="false">'.$child->title.'</a>';
                        $output .= '<ul class="dropdown-menu" aria-labelledby="navbarDropdown'.$rand.'_'.$child->ID.'">';
                        foreach ($children_elements[$child->ID] ?? [] as $subchild) {
                            if (isset($children_elements[$subchild->ID])) {
                                $output .= '<li clas="nav-item menu-item dropdown">';
                                $output .= '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown'.$rand.'_'.$subchild->ID.'" role="button" data-bs-toggle="dropdown" aria-expanded="false">'.$subchild->title.'</a>';
                                $output .= '<ul class="dropdown-menu" aria-labelledby="navbarDropdown'.$rand.'_'.$subchild->ID.'">';
                                foreach ($children_elements[$subchild->ID] ?? [] as $subsubchild) {
                                    $output .= '<li><a class="nav-item menu-item" href="'.$subsubchild->url.'">'.$subsubchild->title.'</a></li>';
                                }
                                $output .= '</ul>';
                                $output .= '</li>';
                            } else {
                                $output .= '<li><a class="nav-item menu-item" href="'.$subchild->url.'">'.$subchild->title.'</a></li>';
                            }
                        }
                        $output .= '</ul>';
                    } else {
                        $output .= '<li class="nav-item"><a class="nav-link" href="'.$child->url.'">'.$child->title.'</a></li>';
                    }
                }
                $output .= '</ul>';

                // First subitems
                $classes = apply_filters('madeit_megamenu_style_woo_2_desktop', ['d-none', 'd-lg-block', 'col-12', 'my-3'], $element);
                $output .= '<div class="'.implode(' ', $classes).'">';
                $output .= '<div class="row">';

                foreach ($children_elements[$id] ?? [] as $i => $child) {
                    $output .= '<div class="col-12 col-lg-3 col-md-4 mb-3">';
                    $output .= '<h3><a href="'.$child->url.'">'.$child->title.'</a></h3>';
                    $output .= '<ul class="list-unstyled">';
                    foreach ($children_elements[$child->ID] ?? [] as $subchild) {
                        $output .= '<li><a class="text-primary" href="'.$subchild->url.'">'.$subchild->title.'</a></li>';
                    }
                    $output .= '</ul>';

                    $output .= '</div>';
                }

                $output .= '</div>';
                $output .= '</div>';
            }

            if (get_field('megamenu_stijl', $element->ID) === 'style_woo') {
                //Mobile
                $classes = apply_filters('madeit_megamenu_style_woo_mobile', ['col-12', 'd-lg-none', 'list-unstyled'], $element);
                $output .= '<ul class="'.implode(' ', $classes).'">';
                foreach ($children_elements[$id] ?? [] as $i => $child) {
                    if (isset($children_elements[$child->ID])) {
                        $output .= '<li class="nav-item menu-item dropdown">';
                        $output .= '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown'.$rand.'_'.$child->ID.'" role="button" data-bs-toggle="dropdown" aria-expanded="false">'.$child->title.'</a>';
                        $output .= '<ul class="dropdown-menu" aria-labelledby="navbarDropdown'.$rand.'_'.$child->ID.'">';
                        foreach ($children_elements[$child->ID] ?? [] as $subchild) {
                            if (isset($children_elements[$subchild->ID])) {
                                $output .= '<li clas="nav-item menu-item dropdown">';
                                $output .= '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown'.$rand.'_'.$subchild->ID.'" role="button" data-bs-toggle="dropdown" aria-expanded="false">'.$subchild->title.'</a>';
                                $output .= '<ul class="dropdown-menu" aria-labelledby="navbarDropdown'.$rand.'_'.$subchild->ID.'">';
                                foreach ($children_elements[$subchild->ID] ?? [] as $subsubchild) {
                                    $output .= '<li><a class="nav-item menu-item" href="'.$subsubchild->url.'">'.$subsubchild->title.'</a></li>';
                                }
                                $output .= '</ul>';
                                $output .= '</li>';
                            } else {
                                $output .= '<li><a class="nav-item menu-item" href="'.$subchild->url.'">'.$subchild->title.'</a></li>';
                            }
                        }
                        $output .= '</ul>';
                    } else {
                        $output .= '<li class="nav-item"><a class="nav-link" href="'.$child->url.'">'.$child->title.'</a></li>';
                    }
                }
                $output .= '</ul>';

                // First subitems
                $classes = apply_filters('madeit_megamenu_style_woo_left_col', ['col-12', 'col-lg-3', 'bg-primary', 'py-3', 'd-none', 'd-lg-block'], $element);
                $output .= '<div class="'.implode(' ', $classes).'">';
                foreach ($children_elements[$id] ?? [] as $i => $child) {
                    $output .= '<ul class="list-unstyled">';
                    $output .= '<li class="megamenu-h-item'.($i === 0 ? ' active' : '').'"><h3><a href="'.$child->url.'" data-megamenu-subid="'.$rand.'_'.$child->ID.'" class="py-2 d-block">'.$child->title.'</a></h3></li>';
                    $output .= '</ul>';
                }
                $output .= '</div>';

                // WooCommerce Subcategories
                $classes = apply_filters('madeit_megamenu_style_woo_right_col', ['col-12', 'col-lg-9', 'p-3', 'd-none', 'd-lg-block'], $element);
                $output .= '<div class="'.implode(' ', $classes).'">';
                foreach ($children_elements[$id] ?? [] as $i => $child) {
                    $output .= '<div class="megamenu-subitem '.($i === 0 ? '' : 'd-none').'" id="megamenu-subitem-'.$rand.'_'.$child->ID.'">';
                    $output .= '<h3 class="mb-3">'.$child->title.'</h3>';

                    $output .= '<div class="row">';

                    foreach ($children_elements[$child->ID] ?? [] as $subchild) {
                        $output .= '<div class="col-12 col-md-4 mb-3">';
                        $output .= '<p class="mb-0"><b><a class="text-primary" href="'.$subchild->url.'">'.$subchild->title.'</a></b></p>';
                        $output .= '<ul class="list-unstyled">';
                        foreach ($children_elements[$subchild->ID] ?? [] as $subsubchild) {
                            $output .= '<li><a href="'.$subsubchild->url.'">'.$subsubchild->title.'</a></li>';
                        }
                        $output .= '</ul>';
                        $output .= '</div>';
                    }

                    $output .= '</div>';
                    $output .= '</div>';
                }
                $output .= '</div>';
            }

            if (get_field('megamenu_stijl', $element->ID) === 'style_woo_2') {
                //Mobile
                $classes = apply_filters('madeit_megamenu_style_woo_2_mobile', ['col-12', 'd-lg-none', 'list-unstyled'], $element);
                $output .= '<ul class="'.implode(' ', $classes).'">';
                foreach ($children_elements[$id] ?? [] as $i => $child) {
                    if (isset($children_elements[$child->ID])) {
                        $output .= '<li class="nav-item menu-item dropdown">';
                        $output .= '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown'.$rand.'_'.$child->ID.'" role="button" data-bs-toggle="dropdown" aria-expanded="false">'.$child->title.'</a>';
                        $output .= '<ul class="dropdown-menu" aria-labelledby="navbarDropdown'.$rand.'_'.$child->ID.'">';
                        foreach ($children_elements[$child->ID] ?? [] as $subchild) {
                            if (isset($children_elements[$subchild->ID])) {
                                $output .= '<li clas="nav-item menu-item dropdown">';
                                $output .= '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown'.$rand.'_'.$subchild->ID.'" role="button" data-bs-toggle="dropdown" aria-expanded="false">'.$subchild->title.'</a>';
                                $output .= '<ul class="dropdown-menu" aria-labelledby="navbarDropdown'.$rand.'_'.$subchild->ID.'">';
                                foreach ($children_elements[$subchild->ID] ?? [] as $subsubchild) {
                                    $output .= '<li><a class="nav-item menu-item" href="'.$subsubchild->url.'">'.$subsubchild->title.'</a></li>';
                                }
                                $output .= '</ul>';
                                $output .= '</li>';
                            } else {
                                $output .= '<li><a class="nav-item menu-item" href="'.$subchild->url.'">'.$subchild->title.'</a></li>';
                            }
                        }
                        $output .= '</ul>';
                    } else {
                        $output .= '<li class="nav-item"><a class="nav-link" href="'.$child->url.'">'.$child->title.'</a></li>';
                    }
                }
                $output .= '</ul>';

                // First subitems
                $classes = apply_filters('madeit_megamenu_style_woo_2_desktop', ['d-none', 'd-lg-block', 'col-12', 'my-3'], $element);
                $output .= '<div class="'.implode(' ', $classes).'">';
                $output .= '<div class="row">';

                foreach ($children_elements[$id] ?? [] as $i => $child) {
                    $output .= '<div class="col-12 col-lg-3 col-md-4 mb-3">';
                    $output .= '<h3><a href="'.$child->url.'">'.$child->title.'</a></h3>';
                    $output .= '<ul class="list-unstyled">';
                    foreach ($children_elements[$child->ID] ?? [] as $subchild) {
                        $output .= '<li><a class="text-primary" href="'.$subchild->url.'">'.$subchild->title.'</a></li>';
                    }
                    $output .= '</ul>';

                    $output .= '</div>';
                }

                $output .= '</div>';
                $output .= '</div>';
            }
            
            $output .= '</div>';
            $output .= '</div>';
        } else {
            // Descend only when the depth is right and there are children for this element.
            if ((0 === $max_depth || $max_depth > $depth + 1) && isset($children_elements[$id])) {
                foreach ($children_elements[$id] as $child) {
                    if (!isset($newlevel)) {
                        $newlevel = true;
                        // Start the child delimiter.
                        $this->start_lvl($output, $depth, ...array_values($args));
                    }
                    $this->display_element($child, $children_elements, $max_depth, $depth + 1, $args, $output);
                }
                unset($children_elements[$id]);
            }

            if (isset($newlevel) && $newlevel) {
                // End the child delimiter.
                $this->end_lvl($output, $depth, ...array_values($args));
            }
        }

        // End this element.
        $this->end_el($output, $element, $depth, ...array_values($args));
    }

    /**
     * Menu Fallback
     * =============
     * If this function is assigned to the wp_nav_menu's fallback_cb variable
     * and a manu has not been assigned to the theme location in the WordPress
     * menu manager the function with display nothing to a non-logged in user,
     * and will add a link to the WordPress menu manager if logged in as an admin.
     *
     * @param array $args passed from the wp_nav_menu function.
     */
    public static function fallback($args)
    {
        if (current_user_can('manage_options')) {
            extract($args);

            $fb_output = null;

            if ($container) {
                $fb_output = '<'.$container;

                if ($container_id) {
                    $fb_output .= ' id="'.$container_id.'"';
                }

                if ($container_class) {
                    $fb_output .= ' class="'.$container_class.'"';
                }

                $fb_output .= '>';
            }

            $fb_output .= '<ul';

            if ($menu_id) {
                $fb_output .= ' id="'.$menu_id.'"';
            }

            if ($menu_class) {
                $fb_output .= ' class="'.$menu_class.'"';
            }

            $fb_output .= '>';
            $fb_output .= '<li><a href="'.admin_url('nav-menus.php').'">Add a menu</a></li>';
            $fb_output .= '</ul>';

            if ($container) {
                $fb_output .= '</'.$container.'>';
            }

            echo $fb_output;
        }
    }

    public static function empty($args)
    {
    }
}

<?php
class MadeITChildPageMenu extends WP_Widget
{
    // constructor
    public function __construct()
    {
        parent::__construct(
            'madeit_child_pages',
            __('Child pages menu', 'madeit'),
            ['description' => __('Add side menu with child pages', 'madeit')]
        );
    }

    public function form($instance)
    {

        // Check values
        if ($instance) {
            $title = esc_attr($instance['title']);
            $textarea = $instance['textarea'];
        } else {
            $title = '';
            $textarea = '';
        } ?>

        <p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title', 'wp_widget_plugin'); ?></label>
        <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" />
        </p>
        <p>
        <label for="<?php echo $this->get_field_id('textarea'); ?>"><?php _e('Description:', 'wp_widget_plugin'); ?></label>
        <textarea class="widefat" id="<?php echo $this->get_field_id('textarea'); ?>" name="<?php echo $this->get_field_name('textarea'); ?>" rows="7" cols="20" ><?php echo $textarea; ?></textarea>
        </p>
        <?php
    }

    public function update($new_instance, $old_instance)
    {
        $instance = $old_instance;
        // Fields
        $instance['title'] = strip_tags($new_instance['title']);
        $instance['textarea'] = strip_tags($new_instance['textarea']);

        return $instance;
    }

    // display widget
    public function widget($args, $instance)
    {
        extract($args);

        // these are the widget options
        $title = apply_filters('widget_title', $instance['title']);
        echo $before_widget; ?>
        <div class="card" style="width: 18rem;">
            <?php
            if ($title) {
                echo '<div class="card-header">'.$before_title.$title.$after_title.'</div>';
            } ?>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><a href="/kempense-klaprozen/team/">Team</a></li>
                <li class="list-group-item"><a href="/kempense-klaprozen/partners/">Partners</a></li>
            </ul>
        </div>
        <?php
        echo $after_widget;
    }
}

if (!function_exists('madeit_register_widgets')) {
    function madeit_register_widgets()
    {
        register_widget('MadeITChildPageMenu');
    }
}
add_action('widgets_init', 'madeit_register_widgets');

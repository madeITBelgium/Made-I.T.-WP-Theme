<?php
/**
 * Displays footer widgets if assigned.
 *
 * @since 1.0
 *
 * @version 1.0
 */
?>

<?php

if (is_active_sidebar('sidebar-2') || is_active_sidebar('sidebar-3') || is_active_sidebar('sidebar-4') || is_active_sidebar('sidebar-5')) {
    
    $footerWidgetContainerClass = apply_filters('madeit_footer_widget_container_class', ['container']);
    
    $cols = 0;
    if (is_active_sidebar('sidebar-2')) {
        $cols++;
    }
    if (is_active_sidebar('sidebar-3')) {
        $cols++;
    }
    if (is_active_sidebar('sidebar-4')) {
        $cols++;
    }
    if (is_active_sidebar('sidebar-5')) {
        $cols++;
    } ?>
    <div class="<?php echo is_array($footerWidgetContainerClass) ? implode(' ', $footerWidgetContainerClass) : $footerWidgetContainerClass; ?>">
        <div class="row" role="complementary" aria-label="<?php esc_attr_e('Footer', 'madeit'); ?>">
            <?php
            if (is_active_sidebar('sidebar-2')) {
                ?>
                <div class="col-sm footer-widget-1">
                    <?php dynamic_sidebar('sidebar-2'); ?>
                </div>
                <?php
            }
    if (is_active_sidebar('sidebar-3')) {
        ?>
                <div class="col-sm footer-widget-2">
                    <?php dynamic_sidebar('sidebar-3'); ?>
                </div>
                <?php
    }
    if (is_active_sidebar('sidebar-4')) {
        ?>
                <div class="col-sm footer-widget-4">
                    <?php dynamic_sidebar('sidebar-4'); ?>
                </div>
                <?php
    }
    if (is_active_sidebar('sidebar-5')) {
        ?>
                <div class="col-sm footer-widget-5">
                    <?php dynamic_sidebar('sidebar-5'); ?>
                </div>
                <?php
    } ?>
        </div>
    </div>
    <?php
}
?>

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
if (is_active_sidebar('below-index-1')) :
?>
<div class="container">
    <div class="row">
        <?php
        if (is_active_sidebar('below-index-1')) {
            ?>
            <div class="col-sm below-index-widget-1">
                <?php dynamic_sidebar('below-index-1'); ?>
            </div>
        <?php
        }
        ?>
    </div>
</div>
<?php endif; ?>

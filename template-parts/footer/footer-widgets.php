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
if (is_active_sidebar('sidebar-2') || is_active_sidebar('sidebar-3')) :
?>
<div class="container">
	<div class="row" role="complementary" aria-label="<?php esc_attr_e('Footer', 'madeit'); ?>">
		<?php
        if (is_active_sidebar('sidebar-2')) {
            ?>
			<div class="col footer-widget-1">
				<?php dynamic_sidebar('sidebar-2'); ?>
			</div>
		<?php
        }
        if (is_active_sidebar('sidebar-3')) {
            ?>
			<div class="col footer-widget-2">
				<?php dynamic_sidebar('sidebar-3'); ?>
			</div>
		<?php
        } ?>
	</div>
</div>
<?php endif; ?>

<?php
/**
 * Made I.T.: Color Patterns.
 *
 * @since 1.0
 */

/**
 * Generate the CSS for the current custom color scheme.
 */
function madeit_custom_colors_css()
{
    $text_color = madeit_get_theme_color('text_color_rgb', MADEIT_TEXT_COLOR);
    $background_color = madeit_get_theme_color('background_color_rgb', MADEIT_BACKGROUND_COLOR);
    $primary_color = madeit_get_theme_color('primary_color_rgb', MADEIT_PRIMARY_COLOR);
    $secondary_color = madeit_get_theme_color('secondary_color_rgb', MADEIT_SECONDARY_COLOR);
    $success_color = madeit_get_theme_color('success_color_rgb', MADEIT_SUCCESS_COLOR);
    $info_color = madeit_get_theme_color('info_color_rgb', MADEIT_INFO_COLOR);
    $warning_color = madeit_get_theme_color('warning_color_rgb', MADEIT_WARNING_COLOR);
    $danger_color = madeit_get_theme_color('danger_color_rgb', MADEIT_DANGER_COLOR);

    $colors = [
        'text'       => $text_color,
        'background' => $background_color,
        'primary'    => $primary_color,
        'secondary'  => $secondary_color,
        'success'    => $success_color,
        'info'       => $info_color,
        'warning'    => $warning_color,
        'danger'     => $danger_color,
    ];

    $css = '
/**
 * Made I.T.: Color Patterns
 *
 * Colors are ordered from dark to light.
 */
 
 body {
  color: '.$text_color.';
  background-color: '.$background_color.';
}
a {
  color: '.$primary_color.';
}

a:hover {
  color: '.madeit_color_luminance($primary_color, 0, 0, -0.15).';
}

.page-link {
    color: '.$primary_color.';
}
.page-item.active .page-link {
    color: '.madeit_contrast_color(madeit_color_luminance($primary_color, 0, 0, 0)).';
    background-color: '.$primary_color.';
    border-color: '.$primary_color.';
}

a.list-group-item-primary:focus, a.list-group-item-primary:hover, button.list-group-item-primary:focus, button.list-group-item-primary:hover {
    background-color: '.madeit_color_luminance($primary_color, 0, 0, 0.31).';
}

.list-group-item-secondary {
    background-color: '.madeit_change_color($secondary_color, '#dddfe2').';
}

a.list-group-item-secondary:focus, a.list-group-item-secondary:hover, button.list-group-item-secondary:focus, button.list-group-item-secondary:hover {
    background-color: '.madeit_color_luminance($secondary_color, 0, 0, 0.31).';
}

.list-group-item-success {
    background-color: '.madeit_change_color($secondary_color, '#c3e6cb').';
}

a.list-group-item-success:focus, a.list-group-item-success:hover, button.list-group-item-success:focus, button.list-group-item-success:hover {
    background-color: '.madeit_color_luminance($success_color, 0, 0, 0.31).';
}

.list-group-item-info {
    background-color: '.madeit_change_color($secondary_color, '#bee5eb').';
}

a.list-group-item-info:focus, a.list-group-item-info:hover, button.list-group-item-info:focus, button.list-group-item-info:hover {
    background-color: '.madeit_color_luminance($info_color, 0, 0, 0.31).';
}

.list-group-item-warning {
    background-color: '.madeit_change_color($secondary_color, '#ffeeba').';
}

a.list-group-item-warning:focus, a.list-group-item-warning:hover, button.list-group-item-warning:focus, button.list-group-item-warning:hover {
    background-color: '.madeit_color_luminance($warning_color, 0, 0, 0.31).';
}

.list-group-item-danger {
    background-color: '.madeit_change_color($secondary_color, '#f5c6cb').';
}

a.list-group-item-danger:focus, a.list-group-item-danger:hover, button.list-group-item-danger:focus, button.list-group-item-danger:hover {
    background-color: '.madeit_color_luminance($danger_color, 0, 0, 0.31).';
}

.badge-primary {
    background-color: '.$primary_color.';
}

.btn-outline-primary:not([disabled]):not(.disabled):active, .btn-outline-primary:not([disabled]):not(.disabled).active, .show > .btn-outline-primary.dropdown-toggle {
    border-color: '.$primary_color.';
}

.btn-primary:hover {
    background-color: '.madeit_color_luminance($primary_color, 0, 0, -0.07).';
}

.btn-primary:hover {
    border-color: '.madeit_color_luminance($primary_color, 0, 0, -0.1).';
}

.badge-primary[href]:focus, .badge-primary[href]:hover {
    background-color: '.madeit_color_luminance($primary_color, 0, 0, -0.1).';
}

.btn-primary:not([disabled]):not(.disabled):active, .btn-primary:not([disabled]):not(.disabled).active, .show > .btn-primary.dropdown-toggle {
    border-color: '.madeit_color_luminance($primary_color, 0, 0, -0.15).';
}

.badge-secondary {
    background-color: '.$secondary_color.';
}

.btn-outline-secondary:not([disabled]):not(.disabled):active, .btn-outline-secondary:not([disabled]):not(.disabled).active, .show > .btn-outline-secondary.dropdown-toggle {
    border-color: '.$secondary_color.';
}

.btn-secondary:hover {
    background-color: '.madeit_color_luminance($secondary_color, 0, 0, -0.07).';
}

.btn-secondary:hover {
    border-color: '.madeit_color_luminance($secondary_color, 0, 0, -0.1).';
}

.badge-secondary[href]:focus, .badge-secondary[href]:hover {
    background-color: '.madeit_color_luminance($secondary_color, 0, 0, -0.1).';
}

.btn-secondary:not([disabled]):not(.disabled):active, .btn-secondary:not([disabled]):not(.disabled).active, .show > .btn-secondary.dropdown-toggle {
    border-color: '.madeit_color_luminance($secondary_color, 0, 0, -0.15).';
}

.badge-success {
    background-color: '.$success_color.';
}

.btn-outline-success:not([disabled]):not(.disabled):active, .btn-outline-success:not([disabled]):not(.disabled).active, .show > .btn-outline-success.dropdown-toggle {
    border-color: '.$success_color.';
}

.btn-success:hover, .woocommerce button.button.alt:hover {
    background-color: '.madeit_color_luminance($success_color, 0, 0, -0.07).';
}

.btn-success:hover, .woocommerce button.button.alt:hover {
    border-color: '.madeit_color_luminance($success_color, 0, 0, -0.1).';
}

.badge-success[href]:focus, .badge-success[href]:hover {
    background-color: '.madeit_color_luminance($success_color, 0, 0, -0.1).';
}

.btn-success:not([disabled]):not(.disabled):active, .btn-success:not([disabled]):not(.disabled).active, .show > .btn-success.dropdown-toggle {
    border-color: '.madeit_color_luminance($success_color, 0, 0, -0.15).';
}

.badge-info {
    background-color: '.$info_color.';
}

.btn-outline-info:not([disabled]):not(.disabled):active, .btn-outline-info:not([disabled]):not(.disabled).active, .show > .btn-outline-info.dropdown-toggle {
    border-color: '.$info_color.';
}

.btn-info:hover {
    background-color: '.madeit_color_luminance($info_color, 0, 0, -0.07).';
}

.btn-info:hover {
    border-color: '.madeit_color_luminance($info_color, 0, 0, -0.1).';
}

.badge-info[href]:focus, .badge-info[href]:hover {
    background-color: '.madeit_color_luminance($info_color, 0, 0, -0.1).';
}

.btn-info:not([disabled]):not(.disabled):active, .btn-info:not([disabled]):not(.disabled).active, .show > .btn-info.dropdown-toggle {
    border-color: '.madeit_color_luminance($info_color, 0, 0, -0.15).';
}

.badge-warning {
    background-color: '.$warning_color.';
}

.btn-outline-warning:not([disabled]):not(.disabled):active, .btn-outline-warning:not([disabled]):not(.disabled).active, .show > .btn-outline-warning.dropdown-toggle {
    border-color: '.$warning_color.';
}

.btn-warning:hover {
    background-color: '.madeit_color_luminance($warning_color, 0, 0, -0.07).';
}

.btn-warning:hover {
    border-color: '.madeit_color_luminance($warning_color, 0, 0, -0.1).';
}

.badge-warning[href]:focus, .badge-warning[href]:hover {
    background-color: '.madeit_color_luminance($warning_color, 0, 0, -0.1).';
}

.btn-warning:not([disabled]):not(.disabled):active, .btn-warning:not([disabled]):not(.disabled).active, .show > .btn-warning.dropdown-toggle {
    border-color: '.madeit_color_luminance($warning_color, 0, 0, -0.15).';
}

.badge-danger {
    background-color: '.$danger_color.';
}

.btn-outline-danger:not([disabled]):not(.disabled):active, .btn-outline-danger:not([disabled]):not(.disabled).active, .show > .btn-outline-danger.dropdown-toggle {
    border-color: '.$danger_color.';
}

.btn-danger:hover {
    background-color: '.madeit_color_luminance($danger_color, 0, 0, -0.07).';
}

.btn-danger:hover {
    border-color: '.madeit_color_luminance($danger_color, 0, 0, -0.1).';
}

.badge-danger[href]:focus, .badge-danger[href]:hover {
    background-color: '.madeit_color_luminance($danger_color, 0, 0, -0.1).';
}

.btn-danger:not([disabled]):not(.disabled):active, .btn-danger:not([disabled]):not(.disabled).active, .show > .btn-danger.dropdown-toggle {
    border-color: '.madeit_color_luminance($danger_color, 0, 0, -0.15).';
}

.btn-link {
    color: '.$primary_color.';
}

.btn-link:disabled, .btn-link.disabled {
    color: '.$secondary_color.';
}

.btn-outline-success.disabled, .btn-outline-success:disabled {
    color: '.$success_color.';
}

.btn-outline-info.disabled, .btn-outline-info:disabled {
    color: '.$info_color.';
}

.btn-outline-warning.disabled, .btn-outline-warning:disabled {
    color: '.$warning_color.';
}

.btn-outline-danger.disabled, .btn-outline-danger:disabled {
    color: '.$danger_color.';
}

.btn-link:hover {
    color: '.madeit_color_luminance($primary_color, 0, 0, -0.15).';
}

a.list-group-item-primary:focus, a.list-group-item-primary:hover, button.list-group-item-primary:focus, button.list-group-item-primary:hover {
    color: '.madeit_color_luminance($primary_color, 0, 0, -0.25).';
}

.alert-primary {
    background-color: '.madeit_change_color($secondary_color, '#cce5ff').';
}

.alert-primary {
    border-color: '.madeit_change_color($secondary_color, '#b8daff').';
}

.alert-primary hr {
    border-top-color: '.madeit_color_luminance($primary_color, 0, 0, 0.31).';
}

.alert-primary .alert-link {
    color: '.madeit_color_luminance($primary_color, 0, 0, -0.35).';
}

a.list-group-item-secondary:focus, a.list-group-item-secondary:hover, button.list-group-item-secondary:focus, button.list-group-item-secondary:hover {
    color: '.madeit_color_luminance($secondary_color, 0, 0, -0.25).';
}

.alert-secondary {
    background-color: '.madeit_change_color($secondary_color, '#e7e8ea').';
}

.alert-secondary {
    border-color: '.madeit_change_color($secondary_color, '#dddfe2').';
}

.alert-secondary hr {
    border-top-color: '.madeit_color_luminance($secondary_color, 0, 0, 0.31).';
}

.alert-secondary .alert-link {
    color: '.madeit_change_color($secondary_color, '#2e3133').';
}

a.list-group-item-success:focus, a.list-group-item-success:hover, button.list-group-item-success:focus, button.list-group-item-success:hover {
    color: '.madeit_color_luminance($success_color, 0, 0, -0.25).';
}

.alert-success {
    background-color: '.madeit_change_color($success_color, '#d4edda').';
}

.alert-success {
    border-color: '.madeit_change_color($success_color, '#c3e6cb').';
}

.alert-success hr {
    border-top-color: '.madeit_color_luminance($success_color, 0, 0, 0.31).';
}

.alert-success .alert-link {
    color: '.madeit_change_color($success_color, '#0b2e13').';
}

a.list-group-item-info:focus, a.list-group-item-info:hover, button.list-group-item-info:focus, button.list-group-item-info:hover {
    color: '.madeit_color_luminance($info_color, 0, 0, -0.25).';
}

.alert-info {
    background-color: '.madeit_change_color($info_color, '#d1ecf1').';
}

.alert-info {
    border-color: '.madeit_change_color($info_color, '#bee5eb').';
}

.alert-info hr {
    border-top-color: '.madeit_color_luminance($info_color, 0, 0, 0.31).';
}

.alert-info .alert-link {
    color: '.madeit_change_color($info_color, '#062c33').';
}

a.list-group-item-warning:focus, a.list-group-item-warning:hover, button.list-group-item-warning:focus, button.list-group-item-warning:hover {
    color: '.madeit_color_luminance($warning_color, 0, 0, -0.25).';
}

.alert-warning {
    background-color: '.madeit_change_color($warning_color, '#fff3cd').';
}

.alert-warning {
    border-color: '.madeit_change_color($warning_color, '#ffeeba').';
}

.alert-warning hr {
    border-top-color: '.madeit_color_luminance($warning_color, 0, 0, 0.31).';
}

.alert-warning .alert-link {
    color: '.madeit_change_color($warning_color, '#533f03').';
}

a.list-group-item-danger:focus, a.list-group-item-danger:hover, button.list-group-item-danger:focus, button.list-group-item-danger:hover {
    color: '.madeit_color_luminance($danger_color, 0, 0, -0.25).';
}

.alert-danger {
    background-color: '.madeit_change_color($danger_color, '#f8d7da').';
}

.alert-danger {
    border-color: '.madeit_change_color($danger_color, '#f5c6cb').';
}

.alert-danger hr {
    border-top-color: '.madeit_color_luminance($danger_color, 0, 0, 0.31).';
}

.alert-danger .alert-link {
    color: '.madeit_change_color($warning_color, '#491217').';
}

.list-group-item-primary {
    background-color: '.madeit_color_luminance($primary_color, 0, 0, 0.36).';
}

a.list-group-item-primary.active, button.list-group-item-primary.active {
    background-color: '.madeit_change_color($primary_color, '#004085').';
}

a.list-group-item-primary.active, button.list-group-item-primary.active {
    border-color: '.madeit_change_color($primary_color, '#004085').';
}

a.list-group-item-secondary.active, button.list-group-item-secondary.active {
    background-color: '.madeit_change_color($secondary_color, '#464a4e').';
}

a.list-group-item-secondary.active, button.list-group-item-secondary.active {
    border-color: '.madeit_change_color($secondary_color, '#464a4e').';
}

a.list-group-item-success.active, button.list-group-item-success.active {
    background-color: '.madeit_change_color($success_color, '#155724').';
}

a.list-group-item-success.active, button.list-group-item-success.active {
    border-color: '.madeit_change_color($success_color, '#155724').';
}

a.list-group-item-info.active, button.list-group-item-info.active {
    background-color: '.madeit_change_color($info_color, '#0c5460').';
}

a.list-group-item-info.active, button.list-group-item-info.active {
    border-color: '.madeit_change_color($info_color, '#0c5460').';
}

a.list-group-item-warning.active, button.list-group-item-warning.active {
    background-color: '.madeit_change_color($warning_color, '#856404').';
}

a.list-group-item-warning.active, button.list-group-item-warning.active {
    border-color: '.madeit_change_color($warning_color, '#856404').';
}

a.list-group-item-danger.active, button.list-group-item-danger.active {
    background-color: '.madeit_change_color($danger_color, '#721c24').';
}

a.list-group-item-danger.active, button.list-group-item-danger.active {
    border-color: '.madeit_change_color($danger_color, '#721c24').';
}

.bg-primary {
    background-color: '.$primary_color.' !important;
}

a.bg-primary:focus, a.bg-primary:hover {
    background-color: '.madeit_color_luminance($primary_color, 0, 0, -0.1).' !important;
}

.bg-secondary {
    background-color: '.$secondary_color.' !important;
}

a.bg-secondary:focus, a.bg-secondary:hover {
    background-color: '.madeit_color_luminance($secondary_color, 0, 0, -0.1).' !important;
}

.bg-success {
    background-color: '.$success_color.' !important;
}

a.bg-success:focus, a.bg-success:hover {
    background-color: '.madeit_color_luminance($success_color, 0, 0, -0.1).' !important;
}

.bg-info {
    background-color: '.$info_color.' !important;
}

a.bg-info:focus, a.bg-info:hover {
    background-color: '.madeit_color_luminance($info_color, 0, 0, -0.1).' !important;
}

.bg-warning {
    background-color: '.$warning_color.' !important;
}

a.bg-warning:focus, a.bg-warning:hover {
    background-color: '.madeit_color_luminance($warning_color, 0, 0, -0.1).' !important;
}

.bg-danger {
    background-color: '.$danger_color.' !important;
}

a.bg-danger:focus, a.bg-danger:hover {
    background-color: '.madeit_color_luminance($danger_color, 0, 0, -0.1).' !important;
}

.border {
    border: 1px solid '.madeit_change_color($warning_color, '#e9ecef').' !important;
}

.border-primary {
    border-color: '.$primary_color.' !important;
}

.border-secondary {
    border-color: '.$secondary_color.' !important;
}

.border-success {
    border-color: '.$secondary_color.' !important;
}

.border-info {
    border-color: '.$info_color.' !important;
}

.border-warning {
    border-color: '.$warning_color.' !important;
}

.border-danger {
    border-color: '.$danger_color.' !important;
}

.border-light {
    border-color: '.madeit_change_color($warning_color, '#f8f9fa').' !important;
}

.border-dark {
    border-color: '.madeit_change_color($warning_color, '#343a40').' !important;
}

.text-primary {
    color: '.$primary_color.' !important;
}

a.text-primary:focus, a.text-primary:hover {
    color: '.madeit_color_luminance($primary_color, 0, 0, -0.1).' !important;
}

.text-muted {
    color: '.$secondary_color.' !important;
}

a.text-secondary:focus, a.text-secondary:hover {
    color: '.madeit_color_luminance($secondary_color, 0, 0, -0.1).' !important;
}

.text-success {
    color: '.$success_color.' !important;
}

a.text-success:focus, a.text-success:hover {
    color: '.madeit_color_luminance($success_color, 0, 0, -0.1).' !important;
}

.text-info {
    color: '.$info_color.' !important;
}

a.text-info:focus, a.text-info:hover {
    color: '.madeit_color_luminance($info_color, 0, 0, -0.1).' !important;
}

.text-warning {
    color: '.$warning_color.' !important;
}

a.text-warning:focus, a.text-warning:hover {
    color: '.madeit_color_luminance($warning_color, 0, 0, -0.1).' !important;
}

.text-danger {
    color: '.$danger_color.' !important;
}

a.text-danger:focus, a.text-danger:hover {
    color: '.madeit_color_luminance($danger_color, 0, 0, -0.1).' !important;
}

.text-light {
    color: '.madeit_change_color($primary_color, '#f8f9fa').' !important;
}

a.text-light:focus, a.text-light:hover {
    color: '.madeit_change_color($primary_color, '#dae0e5').' !important;
}

.text-dark {
    color: '.madeit_change_color($primary_color, '#343a40').' !important;
}

a.text-dark:focus, a.text-dark:hover {
    color: '.madeit_change_color($primary_color, '#1d2124').' !important;
}













.btn-primary {
  color: '.madeit_contrast_color($primary_color).';
  background-color: '.$primary_color.';
  border-color: '.$primary_color.';
}

.btn-primary:hover {
  color: '.madeit_contrast_color(madeit_color_luminance($primary_color, 0, 0, -0.07)).';
  background-color: '.madeit_color_luminance($primary_color, 0, 0, -0.07).';
  border-color: '.madeit_color_luminance($primary_color, 0, 0, -0.1).';
}

.btn-primary.disabled, .btn-primary:disabled {
  background-color: '.$primary_color.';
  border-color: '.$primary_color.';
}

.btn-primary:not([disabled]):not(.disabled):active, .btn-primary:not([disabled]):not(.disabled).active, .show > .btn-primary.dropdown-toggle {
  color: '.madeit_contrast_color(madeit_color_luminance($primary_color, 0, 0, -0.1)).';
  background-color: '.madeit_color_luminance($primary_color, 0, 0, -0.1).';
  border-color: '.madeit_color_luminance($primary_color, 0, 0, -0.13).';
}

.btn-secondary {
  color: '.madeit_contrast_color($secondary_color).';
  background-color: '.$secondary_color.';
  border-color: '.$secondary_color.';
}

.btn-secondary:hover {
  color: '.madeit_contrast_color(madeit_color_luminance($secondary_color, 0, 0, -0.07)).';
  background-color: '.madeit_color_luminance($secondary_color, 0, 0, -0.07).';
  border-color: '.madeit_color_luminance($secondary_color, 0, 0, -0.1).';
}

.btn-secondary.disabled, .btn-secondary:disabled {
  background-color: '.$secondary_color.';
  border-color: '.$secondary_color.';
}

.btn-secondary:not([disabled]):not(.disabled):active, .btn-secondary:not([disabled]):not(.disabled).active, .show > .btn-secondary.dropdown-toggle {
  color: '.madeit_contrast_color(madeit_color_luminance($secondary_color, 0, 0, -0.07)).';
  background-color: '.madeit_color_luminance($secondary_color, 0, 0, -0.1).';
  border-color: '.madeit_color_luminance($secondary_color, 0, 0, -0.13).';
}

.btn-success, .woocommerce button.button.alt {
  color: '.madeit_contrast_color($success_color).';
  background-color: '.$success_color.';
  border-color: '.$success_color.';
}

.btn-success:hover {
  color: '.madeit_contrast_color(madeit_color_luminance($success_color, 0, 0, -0.07)).';
  background-color: '.madeit_color_luminance($success_color, 0, 0, -0.07).';
  border-color: '.madeit_color_luminance($success_color, 0, 0, -0.1).';
}

.btn-success.disabled, .btn-success:disabled {
  background-color: '.$success_color.';
  border-color: '.$success_color.';
}

.btn-success:not([disabled]):not(.disabled):active, .btn-success:not([disabled]):not(.disabled).active, .show > .btn-success.dropdown-toggle {
  color: '.madeit_contrast_color(madeit_color_luminance($success_color, 0, 0, -0.1)).';
  background-color: '.madeit_color_luminance($success_color, 0, 0, -0.1).';
  border-color: '.madeit_color_luminance($success_color, 0, 0, -0.13).';
}

.btn-info {
  color: '.madeit_contrast_color($info_color).';
  background-color: '.$info_color.';
  border-color: '.$info_color.';
}

.btn-info:hover {
  color: '.madeit_contrast_color(madeit_color_luminance($info_color, 0, 0, -0.07)).';
  background-color: '.madeit_color_luminance($info_color, 0, 0, -0.07).';
  border-color: '.madeit_color_luminance($info_color, 0, 0, -0.1).';
}

.btn-info.disabled, .btn-info:disabled {
  background-color: '.$info_color.';
  border-color: '.$info_color.';
}

.btn-info:not([disabled]):not(.disabled):active, .btn-info:not([disabled]):not(.disabled).active, .show > .btn-info.dropdown-toggle {
  color: '.madeit_contrast_color(madeit_color_luminance($info_color, 0, 0, -0.1)).';
  background-color: '.madeit_color_luminance($info_color, 0, 0, -0.1).';
  border-color: '.madeit_color_luminance($info_color, 0, 0, -0.13).';
}

.btn-warning {
  color: '.madeit_contrast_color($warning_color).';
  background-color: '.$warning_color.';
  border-color: '.$warning_color.';
}

.btn-warning:hover {
  color: '.madeit_contrast_color(madeit_color_luminance($warning_color, 0, 0, -0.07)).';
  background-color: '.madeit_color_luminance($warning_color, 0, 0, -0.07).';
  border-color: '.madeit_color_luminance($warning_color, 0, 0, -0.1).';
}

.btn-warning.disabled, .btn-warning:disabled {
  background-color: '.$warning_color.';
  border-color: '.$warning_color.';
}

.btn-warning:not([disabled]):not(.disabled):active, .btn-warning:not([disabled]):not(.disabled).active, .show > .btn-warning.dropdown-toggle {
  color: '.madeit_contrast_color(madeit_color_luminance($warning_color, 0, 0, -0.1)).';
  background-color: '.madeit_color_luminance($warning_color, 0, 0, -0.1).';
  border-color: '.madeit_color_luminance($warning_color, 0, 0, -0.13).';
}

.btn-danger {
  color: '.madeit_contrast_color($danger_color).';
  background-color: '.$danger_color.';
  border-color: '.$danger_color.';
}

.btn-danger:hover {
  color: '.madeit_contrast_color(madeit_color_luminance($danger_color, 0, 0, -0.07)).';
  background-color: '.madeit_color_luminance($danger_color, 0, 0, -0.07).';
  border-color: '.madeit_color_luminance($danger_color, 0, 0, -0.1).';
}

.btn-danger.disabled, .btn-danger:disabled {
  background-color: '.$danger_color.';
  border-color: '.$danger_color.';
}

.btn-danger:not([disabled]):not(.disabled):active, .btn-danger:not([disabled]):not(.disabled).active, .show > .btn-danger.dropdown-toggle {
  color: '.madeit_contrast_color(madeit_color_luminance($danger_color, 0, 0, -0.1)).';
  background-color: '.madeit_color_luminance($danger_color, 0, 0, -0.1).';
  border-color: '.madeit_color_luminance($danger_color, 0, 0, -0.13).';
}

.btn-outline-primary {
  color: '.$primary_color.';
  border-color: '.$primary_color.';
}

.btn-outline-primary:hover {
  color: #fff;
  background-color: '.$primary_color.';
  border-color: '.$primary_color.';
}

.btn-outline-primary.disabled, .btn-outline-primary:disabled {
  color: '.$primary_color.';
}

.btn-outline-primary:not([disabled]):not(.disabled):active, .btn-outline-primary:not([disabled]):not(.disabled).active, .show > .btn-outline-primary.dropdown-toggle {
  color: '.madeit_contrast_color($primary_color).';
  background-color: '.$primary_color.';
  border-color: '.$primary_color.';
}

.btn-outline-secondary {
  color: '.$secondary_color.';
  border-color: '.$secondary_color.';
}

.btn-outline-secondary:hover {
  color: '.madeit_contrast_color($primary_color).';
  background-color: '.$secondary_color.';
  border-color: '.$secondary_color.';
}

.btn-outline-secondary.disabled, .btn-outline-secondary:disabled {
  color: '.$secondary_color.';
}

.btn-outline-secondary:not([disabled]):not(.disabled):active, .btn-outline-secondary:not([disabled]):not(.disabled).active, .show > .btn-outline-secondary.dropdown-toggle {
  color: '.madeit_contrast_color($secondary_color).';
  background-color: '.$secondary_color.';
  border-color: '.$secondary_color.';
}

.btn-outline-success {
  color: '.$success_color.';
  border-color: '.$success_color.';
}

.btn-outline-success:hover {
  color: '.madeit_contrast_color($secondary_color).';
  background-color: '.$success_color.';
  border-color: '.$success_color.';
}

.btn-outline-success.disabled, .btn-outline-success:disabled {
  color: '.$success_color.';
}

.btn-outline-success:not([disabled]):not(.disabled):active, .btn-outline-success:not([disabled]):not(.disabled).active, .show > .btn-outline-success.dropdown-toggle {
  color: '.madeit_contrast_color($secondary_color).';
  background-color: '.$success_color.';
  border-color: '.$success_color.';
}

.btn-outline-info {
  color: '.$info_color.';
  border-color: '.$info_color.';
}

.btn-outline-info:hover {
  color: '.madeit_contrast_color($info_color).';
  background-color: '.$info_color.';
  border-color: '.$info_color.';
}

.btn-outline-info.disabled, .btn-outline-info:disabled {
  color: '.$info_color.';
}

.btn-outline-info:not([disabled]):not(.disabled):active, .btn-outline-info:not([disabled]):not(.disabled).active, .show > .btn-outline-info.dropdown-toggle {
  color: '.madeit_contrast_color($info_color).';
  background-color: '.$info_color.';
  border-color: '.$info_color.';
}

.btn-outline-warning {
  color: '.$warning_color.';
  border-color: '.$warning_color.';
}

.btn-outline-warning:hover {
  color: '.madeit_contrast_color($info_color).';
  background-color: '.$warning_color.';
  border-color: '.$warning_color.';
}

.btn-outline-warning.disabled, .btn-outline-warning:disabled {
  color: '.$warning_color.';
}

.btn-outline-warning:not([disabled]):not(.disabled):active, .btn-outline-warning:not([disabled]):not(.disabled).active, .show > .btn-outline-warning.dropdown-toggle {
  color: '.madeit_contrast_color($warning_color).';
  background-color: '.$warning_color.';
  border-color: '.$warning_color.';
}

.btn-outline-danger {
  color: '.$danger_color.';
  border-color: '.$danger_color.';
}

.btn-outline-danger:hover {
  color: '.madeit_contrast_color($danger_color).';
  background-color: '.$danger_color.';
  border-color: '.$danger_color.';
}

.btn-outline-danger.disabled, .btn-outline-danger:disabled {
  color: '.$danger_color.';
}

.btn-outline-danger:not([disabled]):not(.disabled):active, .btn-outline-danger:not([disabled]):not(.disabled).active, .show > .btn-outline-danger.dropdown-toggle {
  color: '.madeit_contrast_color($danger_color).';
  background-color: '.$danger_color.';
  border-color: '.$danger_color.';
}

.btn-link {
  color: '.$primary_color.';
}

.btn-link:hover {
  color: '.madeit_color_luminance($primary_color, 0, 0, -0.15).';
}
';
    $gutenbergColors = [
        'default-text'       => $text_color,
        'default-background' => $background_color,
        'primary'            => $primary_color,
        'secondary'          => $secondary_color,
        'success'            => $success_color,
        'info'               => $info_color,
        'warning'            => $warning_color,
        'danger'             => $danger_color,
        'black'              => '#000000',
        'white'              => '#FFFFFF',
    ];

    foreach ($gutenbergColors as $class => $color) {
        $css .= '
.has-'.$class.'-background-color {
	background-color: '.$color.' !important;
}

.has-'.$class.'-color {
	color: '.$color." !important;
}\n";
    }

    /*
     * Filters Made I.T. custom colors CSS.
     *
     * @since Made I.T. 1.0
     *
     * @param string $css        Base theme colors CSS.
     * @param array  $colors     The selected colors
     */
    return apply_filters('madeit_custom_colors_css', $css, $colors);
}

function madeit_color_luminance($hex, $a, $b, $c)
{
    $hex = substr($hex, 1, strlen($hex) - 1);
    $hex = preg_replace('/[^0-9a-f]/i', '', $hex);

    if (strlen($hex) < 6) {
        $hex = $hex[0] + $hex[0] + $hex[1] + $hex[1] + $hex[2] + $hex[2];
    }

    $hsl = madeit_hex2hsl($hex);
    $hsl[0] += ($a != 0) ? $a / 360 : 0;
    $hsl[1] += $b;
    $hsl[2] += $c;
    if ($hsl[0] > 360) {
        $hsl[0] = 360;
    }
    if ($hsl[1] > 1) {
        $hsl[1] = 1;
    }
    if ($hsl[2] > 1) {
        $hsl[2] = 1;
    }

    if ($hsl[0] < 0) {
        $hsl[0] = 0;
    }
    if ($hsl[1] < 0) {
        $hsl[1] = 0;
    }
    if ($hsl[2] < 0) {
        $hsl[2] = 0;
    }

    return madeit_hsl2hex($hsl);
}

function madeit_change_color($hex, $default)
{

    // validate hex string
    $hex = substr($hex, 1, strlen($hex) - 1);
    $hex = preg_replace('/[^0-9a-f]/i', '', $hex);

    if (strlen($hex) < 6) {
        $hex = $hex[0] + $hex[0] + $hex[1] + $hex[1] + $hex[2] + $hex[2];
    }

    $hex2 = substr($default, 1, strlen($default) - 1);
    $hex2 = preg_replace('/[^0-9a-f]/i', '', $hex2);

    if (strlen($hex2) < 6) {
        $hex2 = $hex2[0] + $hex2[0] + $hex2[1] + $hex2[1] + $hex2[2] + $hex2[2];
    }

    $hsl = madeit_hex2hsl($hex);
    $hsl2 = madeit_hex2hsl($hex2);
    $hsl[1] = $hsl2[1];
    $hsl[2] = $hsl2[2];

    return madeit_hsl2hex($hsl);
}

function madeit_validate_hex($hex)
{
    // Complete patterns like #ffffff or #fff
    if (preg_match('/^#([0-9a-fA-F]{6})$/', $hex) || preg_match('/^#([0-9a-fA-F]{3})$/', $hex)) {
        // Remove #
        $hex = substr($hex, 1);
    }

    // Complete patterns without # like ffffff or 000000
    if (preg_match('/^([0-9a-fA-F]{6})$/', $hex)) {
        return $hex;
    }

    // Short patterns without # like fff or 000
    if (preg_match('/^([0-9a-f]{3})$/', $hex)) {
        // Spread to 6 digits
        return substr($hex, 0, 1).substr($hex, 0, 1).substr($hex, 1, 1).substr($hex, 1, 1).substr($hex, 2, 1).substr($hex, 2, 1);
    }

    // If input value is invalid return black
    return '000000';
}

function madeit_hex2hsl($hex)
{
    //Validate Hex Input
    $hex = madeit_validate_hex($hex);

    // Split input by color
    $hex = str_split($hex, 2);
    // Convert color values to value between 0 and 1
    $r = (hexdec($hex[0])) / 255;
    $g = (hexdec($hex[1])) / 255;
    $b = (hexdec($hex[2])) / 255;

    return madeit_rgb2hsl([$r, $g, $b]);
}

/* Converts RGB color to HSL color
 * Check http://en.wikipedia.org/wiki/HSL_and_HSV#Hue_and_chroma for
 * details
 * Input: Array(Red, Green, Blue) - Values from 0 to 1
 * Output: Array(Hue, Saturation, Lightness) - Values from 0 to 1 */
function madeit_rgb2hsl($rgb)
{
    // Fill variables $r, $g, $b by array given.
    list($r, $g, $b) = $rgb;

    // Determine lowest & highest value and chroma
    $max = max($r, $g, $b);
    $min = min($r, $g, $b);
    $chroma = $max - $min;

    // Calculate Luminosity
    $l = ($max + $min) / 2;

    // If chroma is 0, the given color is grey
    // therefore hue and saturation are set to 0
    if ($chroma == 0) {
        $h = 0;
        $s = 0;
    }

    // Else calculate hue and saturation.
    // Check http://en.wikipedia.org/wiki/HSL_and_HSV for details
    else {
        switch ($max) {
            case $r:
                $h_ = fmod((($g - $b) / $chroma), 6);
                if ($h_ < 0) {
                    $h_ = (6 - fmod(abs($h_), 6));
                } // Bugfix: fmod() returns wrong values for negative numbers
                break;

            case $g:
                $h_ = ($b - $r) / $chroma + 2;
                break;

            case $b:
                $h_ = ($r - $g) / $chroma + 4;
                break;
            default:
                break;
        }

        $h = $h_ / 6;
        $s = 1 - abs(2 * $l - 1);
    }

    // Return HSL Color as array
    return [$h, $s, $l];
}

/* Converts HSL color to RGB color
 * Input: Array(Hue, Saturation, Lightness) - Values from 0 to 1
 * Output: Array(Red, Green, Blue) - Values from 0 to 1 */
function madeit_hsl2rgb($hsl)
{
    // Fill variables $h, $s, $l by array given.
    list($h, $s, $l) = $hsl;

    // If saturation is 0, the given color is grey and only
    // lightness is relevant.
    if ($s == 0) {
        $rgb = [$l, $l, $l];
    }

    // Else calculate r, g, b according to hue.
    // Check http://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL for details
    else {
        $chroma = (1 - abs(2 * $l - 1)) * $s;
        $h_ = $h * 6;
        $x = $chroma * (1 - abs((fmod($h_, 2)) - 1)); // Note: fmod because % (modulo) returns int value!!
        $m = $l - round($chroma / 2, 10); // Bugfix for strange float behaviour (e.g. $l=0.17 and $s=1)

             if ($h_ >= 0 && $h_ < 1) {
                 $rgb = [($chroma + $m), ($x + $m), $m];
             } elseif ($h_ >= 1 && $h_ < 2) {
                 $rgb = [($x + $m), ($chroma + $m), $m];
             } elseif ($h_ >= 2 && $h_ < 3) {
                 $rgb = [$m, ($chroma + $m), ($x + $m)];
             } elseif ($h_ >= 3 && $h_ < 4) {
                 $rgb = [$m, ($x + $m), ($chroma + $m)];
             } elseif ($h_ >= 4 && $h_ < 5) {
                 $rgb = [($x + $m), $m, ($chroma + $m)];
             } elseif ($h_ >= 5 && $h_ < 6) {
                 $rgb = [($chroma + $m), $m, ($x + $m)];
             }
    }

    return $rgb;
}

/* Converts RGB color to hex code
 * Input: Array(Red, Green, Blue)
 * Output: String hex value (#000000 - #ffffff) */
function madeit_rgb2hex($rgb)
{
    list($r, $g, $b) = $rgb;
    $r = round(255 * $r);
    $g = round(255 * $g);
    $b = round(255 * $b);

    return '#'.sprintf('%02X', $r).sprintf('%02X', $g).sprintf('%02X', $b);
}

/* Converts HSL color to RGB hex code
 * Input: Array(Hue, Saturation, Lightness) - Values from 0 to 1
 * Output: String hex value (#000000 - #ffffff) */
function madeit_hsl2hex($hsl)
{
    $rgb = madeit_hsl2rgb($hsl);

    return madeit_rgb2hex($rgb);
}

function madeit_contrast_color($hex)
{
    list($r, $g, $b) = madeit_hsl2rgb(madeit_hex2hsl($hex));
    $r = round(255 * $r);
    $g = round(255 * $g);
    $b = round(255 * $b);

    $a = 1 - (0.299 * $r + 0.587 * $g * 0.114 * $b) / 255;

    return $a < 0.3 ? '#000' : '#FFF';
}

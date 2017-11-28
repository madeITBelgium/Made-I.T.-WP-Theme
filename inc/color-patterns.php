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
    $hue = absint(get_theme_mod('colorscheme_hue', 250));

    /**
     * Filter Made I.T. default saturation level.
     *
     * @since Made I.T. 1.0
     *
     * @param int $saturation Color saturation level.
     */
    $saturation = absint(apply_filters('madeit_custom_colors_saturation', 50));
    $reduced_saturation = (.8 * $saturation).'%';
    $saturation = $saturation.'%';
    $css = '
/**
 * Made I.T.: Color Patterns
 *
 * Colors are ordered from dark to light.
 */
 
 body {
  color: #212529;
  background-color: #fff;
}
a {
  color: #007bff;
}

a:hover {
  color: #0056b3;
}





a.list-group-item-primary:focus, a.list-group-item-primary:hover, button.list-group-item-primary:focus, button.list-group-item-primary:hover {
    background-color: #9fcdff;
}

.list-group-item-secondary {
    background-color: #dddfe2;
}

a.list-group-item-secondary:focus, a.list-group-item-secondary:hover, button.list-group-item-secondary:focus, button.list-group-item-secondary:hover {
    background-color: #cfd2d6;
}

.list-group-item-success {
    background-color: #c3e6cb;
}

a.list-group-item-success:focus, a.list-group-item-success:hover, button.list-group-item-success:focus, button.list-group-item-success:hover {
    background-color: #b1dfbb;
}

.list-group-item-info {
    background-color: #bee5eb;
}

a.list-group-item-info:focus, a.list-group-item-info:hover, button.list-group-item-info:focus, button.list-group-item-info:hover {
    background-color: #abdde5;
}

.list-group-item-warning {
    background-color: #ffeeba;
}

a.list-group-item-warning:focus, a.list-group-item-warning:hover, button.list-group-item-warning:focus, button.list-group-item-warning:hover {
    background-color: #ffe8a1;
}

.list-group-item-danger {
    background-color: #f5c6cb;
}

a.list-group-item-danger:focus, a.list-group-item-danger:hover, button.list-group-item-danger:focus, button.list-group-item-danger:hover {
    background-color: #f1b0b7;
}

a.list-group-item-dark.active, button.list-group-item-dark.active {
    color: #fff;
}

.badge-primary {
    background-color: #007bff;
}

.btn-outline-primary:not([disabled]):not(.disabled):active, .btn-outline-primary:not([disabled]):not(.disabled).active, .show > .btn-outline-primary.dropdown-toggle {
    border-color: #007bff;
}

.btn-primary:hover {
    background-color: #0069d9;
}

.btn-primary:hover {
    border-color: #0062cc;
}

.badge-primary[href]:focus, .badge-primary[href]:hover {
    background-color: #0062cc;
}

.btn-primary:not([disabled]):not(.disabled):active, .btn-primary:not([disabled]):not(.disabled).active, .show > .btn-primary.dropdown-toggle {
    border-color: #005cbf;
}

.badge-secondary {
    background-color: #868e96;
}

.btn-outline-secondary:not([disabled]):not(.disabled):active, .btn-outline-secondary:not([disabled]):not(.disabled).active, .show > .btn-outline-secondary.dropdown-toggle {
    border-color: #868e96;
}

.btn-secondary:hover {
    background-color: #727b84;
}

.btn-secondary:hover {
    border-color: #6c757d;
}

.badge-secondary[href]:focus, .badge-secondary[href]:hover {
    background-color: #6c757d;
}

.btn-secondary:not([disabled]):not(.disabled):active, .btn-secondary:not([disabled]):not(.disabled).active, .show > .btn-secondary.dropdown-toggle {
    border-color: #666e76;
}

.badge-success {
    background-color: #28a745;
}

.btn-outline-success:not([disabled]):not(.disabled):active, .btn-outline-success:not([disabled]):not(.disabled).active, .show > .btn-outline-success.dropdown-toggle {
    border-color: #28a745;
}

.btn-success:hover {
    background-color: #218838;
}

.btn-success:hover {
    border-color: #1e7e34;
}

.badge-success[href]:focus, .badge-success[href]:hover {
    background-color: #1e7e34;
}

.btn-success:not([disabled]):not(.disabled):active, .btn-success:not([disabled]):not(.disabled).active, .show > .btn-success.dropdown-toggle {
    border-color: #1c7430;
}

.badge-info {
    background-color: #17a2b8;
}

.btn-outline-info:not([disabled]):not(.disabled):active, .btn-outline-info:not([disabled]):not(.disabled).active, .show > .btn-outline-info.dropdown-toggle {
    border-color: #17a2b8;
}

.btn-info:hover {
    background-color: #138496;
}

.btn-info:hover {
    border-color: #117a8b;
}

.badge-info[href]:focus, .badge-info[href]:hover {
    background-color: #117a8b;
}

.btn-info:not([disabled]):not(.disabled):active, .btn-info:not([disabled]):not(.disabled).active, .show > .btn-info.dropdown-toggle {
    border-color: #10707f;
}

.badge-light[href]:focus, .badge-light[href]:hover {
    color: #111;
}

.badge-warning {
    background-color: #ffc107;
}

.btn-outline-warning:not([disabled]):not(.disabled):active, .btn-outline-warning:not([disabled]):not(.disabled).active, .show > .btn-outline-warning.dropdown-toggle {
    border-color: #ffc107;
}

.btn-warning:hover {
    background-color: #e0a800;
}

.btn-warning:hover {
    border-color: #d39e00;
}

.badge-warning[href]:focus, .badge-warning[href]:hover {
    background-color: #d39e00;
}

.btn-warning:not([disabled]):not(.disabled):active, .btn-warning:not([disabled]):not(.disabled).active, .show > .btn-warning.dropdown-toggle {
    border-color: #c69500;
}

.badge-danger {
    background-color: #dc3545;
}

.btn-outline-danger:not([disabled]):not(.disabled):active, .btn-outline-danger:not([disabled]):not(.disabled).active, .show > .btn-outline-danger.dropdown-toggle {
    border-color: #dc3545;
}

.btn-danger:hover {
    background-color: #c82333;
}

.btn-danger:hover {
    border-color: #bd2130;
}

.badge-danger[href]:focus, .badge-danger[href]:hover {
    background-color: #bd2130;
}

.btn-danger:not([disabled]):not(.disabled):active, .btn-danger:not([disabled]):not(.disabled).active, .show > .btn-danger.dropdown-toggle {
    border-color: #b21f2d;
}

.badge-light {
    background-color: #f8f9fa;
}

.btn-outline-light:not([disabled]):not(.disabled):active, .btn-outline-light:not([disabled]):not(.disabled).active, .show > .btn-outline-light.dropdown-toggle {
    border-color: #f8f9fa;
}

.btn-light:hover {
    background-color: #e2e6ea;
}

.btn-light:hover {
    border-color: #dae0e5;
}

.badge-light[href]:focus, .badge-light[href]:hover {
    background-color: #dae0e5;
}

.btn-light:not([disabled]):not(.disabled):active, .btn-light:not([disabled]):not(.disabled).active, .show > .btn-light.dropdown-toggle {
    border-color: #d3d9df;
}

.badge-dark {
    background-color: #343a40;
}

.btn-outline-dark:not([disabled]):not(.disabled):active, .btn-outline-dark:not([disabled]):not(.disabled).active, .show > .btn-outline-dark.dropdown-toggle {
    border-color: #343a40;
}

.btn-dark:hover {
    background-color: #23272b;
}

.btn-dark:hover {
    border-color: #1d2124;
}

.badge-dark[href]:focus, .badge-dark[href]:hover {
    background-color: #1d2124;
}

.btn-dark:not([disabled]):not(.disabled):active, .btn-dark:not([disabled]):not(.disabled).active, .show > .btn-dark.dropdown-toggle {
    border-color: #171a1d;
}

.btn-link {
    color: #007bff;
}

.btn-link:hover {
    background-color: transparent;
}

.btn-outline-dark {
    background-image: none;
}

.btn-link:disabled, .btn-link.disabled {
    color: #868e96;
}

.btn-outline-success.disabled, .btn-outline-success:disabled {
    color: #28a745;
}

.btn-outline-info.disabled, .btn-outline-info:disabled {
    color: #17a2b8;
}

.btn-outline-warning.disabled, .btn-outline-warning:disabled {
    color: #ffc107;
}

.btn-outline-danger.disabled, .btn-outline-danger:disabled {
    color: #dc3545;
}

.btn-outline-light.disabled, .btn-outline-light:disabled {
    color: #f8f9fa;
}

.btn-outline-light:not([disabled]):not(.disabled):active, .btn-outline-light:not([disabled]):not(.disabled).active, .show > .btn-outline-light.dropdown-toggle {
    color: #212529;
}

.btn-outline-dark.disabled, .btn-outline-dark:disabled {
    color: #343a40;
}

.btn-link {
    font-weight: 400;
}

.btn-link:hover {
    color: #0056b3;
}

.btn-link:hover {
    text-decoration: underline;
}

.btn-link:focus, .btn-link.focus {
    border-color: transparent;
}

.btn-link:focus, .btn-link.focus {
    box-shadow: none;
}

.badge-dark[href]:focus, .badge-dark[href]:hover {
    text-decoration: none;
}

a.list-group-item-primary:focus, a.list-group-item-primary:hover, button.list-group-item-primary:focus, button.list-group-item-primary:hover {
    color: #004085;
}

.alert-primary {
    background-color: #cce5ff;
}

.alert-primary {
    border-color: #b8daff;
}

.alert-primary hr {
    border-top-color: #9fcdff;
}

.alert-primary .alert-link {
    color: #002752;
}

a.list-group-item-secondary:focus, a.list-group-item-secondary:hover, button.list-group-item-secondary:focus, button.list-group-item-secondary:hover {
    color: #464a4e;
}

.alert-secondary {
    background-color: #e7e8ea;
}

.alert-secondary {
    border-color: #dddfe2;
}

.alert-secondary hr {
    border-top-color: #cfd2d6;
}

.alert-secondary .alert-link {
    color: #2e3133;
}

a.list-group-item-success:focus, a.list-group-item-success:hover, button.list-group-item-success:focus, button.list-group-item-success:hover {
    color: #155724;
}

.alert-success {
    background-color: #d4edda;
}

.alert-success {
    border-color: #c3e6cb;
}

.alert-success hr {
    border-top-color: #b1dfbb;
}

.alert-success .alert-link {
    color: #0b2e13;
}

a.list-group-item-info:focus, a.list-group-item-info:hover, button.list-group-item-info:focus, button.list-group-item-info:hover {
    color: #0c5460;
}

.alert-info {
    background-color: #d1ecf1;
}

.alert-info {
    border-color: #bee5eb;
}

.alert-info hr {
    border-top-color: #abdde5;
}

.alert-info .alert-link {
    color: #062c33;
}

a.list-group-item-warning:focus, a.list-group-item-warning:hover, button.list-group-item-warning:focus, button.list-group-item-warning:hover {
    color: #856404;
}

.alert-warning {
    background-color: #fff3cd;
}

.alert-warning {
    border-color: #ffeeba;
}

.alert-warning hr {
    border-top-color: #ffe8a1;
}

.alert-warning .alert-link {
    color: #533f03;
}

a.list-group-item-danger:focus, a.list-group-item-danger:hover, button.list-group-item-danger:focus, button.list-group-item-danger:hover {
    color: #721c24;
}

.alert-danger {
    background-color: #f8d7da;
}

.alert-danger {
    border-color: #f5c6cb;
}

.alert-danger hr {
    border-top-color: #f1b0b7;
}

.alert-danger .alert-link {
    color: #491217;
}

a.list-group-item-light:focus, a.list-group-item-light:hover, button.list-group-item-light:focus, button.list-group-item-light:hover {
    color: #818182;
}

.alert-light {
    background-color: #fefefe;
}

.alert-light {
    border-color: #fdfdfe;
}

.alert-light hr {
    border-top-color: #ececf6;
}

.alert-light .alert-link {
    color: #686868;
}

a.list-group-item-dark:focus, a.list-group-item-dark:hover, button.list-group-item-dark:focus, button.list-group-item-dark:hover {
    color: #1b1e21;
}

.alert-dark {
    background-color: #d6d8d9;
}

.alert-dark {
    border-color: #c6c8ca;
}

.alert-dark hr {
    border-top-color: #b9bbbe;
}

.alert-dark .alert-link {
    color: #040505;
}

.list-group-item-primary {
    background-color: #b8daff;
}

a.list-group-item-primary.active, button.list-group-item-primary.active {
    background-color: #004085;
}

a.list-group-item-primary.active, button.list-group-item-primary.active {
    border-color: #004085;
}

a.list-group-item-secondary.active, button.list-group-item-secondary.active {
    background-color: #464a4e;
}

a.list-group-item-secondary.active, button.list-group-item-secondary.active {
    border-color: #464a4e;
}

a.list-group-item-success.active, button.list-group-item-success.active {
    background-color: #155724;
}

a.list-group-item-success.active, button.list-group-item-success.active {
    border-color: #155724;
}

a.list-group-item-info.active, button.list-group-item-info.active {
    background-color: #0c5460;
}

a.list-group-item-info.active, button.list-group-item-info.active {
    border-color: #0c5460;
}

a.list-group-item-warning.active, button.list-group-item-warning.active {
    background-color: #856404;
}

a.list-group-item-warning.active, button.list-group-item-warning.active {
    border-color: #856404;
}

a.list-group-item-danger.active, button.list-group-item-danger.active {
    background-color: #721c24;
}

a.list-group-item-danger.active, button.list-group-item-danger.active {
    border-color: #721c24;
}

.list-group-item-light {
    background-color: #fdfdfe;
}

a.list-group-item-light:focus, a.list-group-item-light:hover, button.list-group-item-light:focus, button.list-group-item-light:hover {
    background-color: #ececf6;
}

a.list-group-item-light.active, button.list-group-item-light.active {
    background-color: #818182;
}

a.list-group-item-light.active, button.list-group-item-light.active {
    border-color: #818182;
}

.list-group-item-dark {
    background-color: #c6c8ca;
}

a.list-group-item-dark:focus, a.list-group-item-dark:hover, button.list-group-item-dark:focus, button.list-group-item-dark:hover {
    background-color: #b9bbbe;
}

a.list-group-item-dark.active, button.list-group-item-dark.active {
    background-color: #1b1e21;
}

a.list-group-item-dark.active, button.list-group-item-dark.active {
    border-color: #1b1e21;
}

.bg-primary {
    background-color: #007bff !important;
}

a.bg-primary:focus, a.bg-primary:hover {
    background-color: #0062cc !important;
}

.bg-secondary {
    background-color: #868e96 !important;
}

a.bg-secondary:focus, a.bg-secondary:hover {
    background-color: #6c757d !important;
}

.bg-success {
    background-color: #28a745 !important;
}

a.bg-success:focus, a.bg-success:hover {
    background-color: #1e7e34 !important;
}

.bg-info {
    background-color: #17a2b8 !important;
}

a.bg-info:focus, a.bg-info:hover {
    background-color: #117a8b !important;
}

.bg-warning {
    background-color: #ffc107 !important;
}

a.bg-warning:focus, a.bg-warning:hover {
    background-color: #d39e00 !important;
}

.bg-danger {
    background-color: #dc3545 !important;
}

a.bg-danger:focus, a.bg-danger:hover {
    background-color: #bd2130 !important;
}

.bg-light {
    background-color: #f8f9fa !important;
}

a.bg-light:focus, a.bg-light:hover {
    background-color: #dae0e5 !important;
}

.bg-dark {
    background-color: #343a40 !important;
}

a.bg-dark:focus, a.bg-dark:hover {
    background-color: #1d2124 !important;
}

.bg-white {
    background-color: #fff !important;
}

.bg-transparent {
    background-color: transparent !important;
}

.border {
    border: 1px solid #e9ecef !important;
}

.border-primary {
    border-color: #007bff !important;
}

.border-secondary {
    border-color: #868e96 !important;
}

.border-success {
    border-color: #28a745 !important;
}

.border-info {
    border-color: #17a2b8 !important;
}

.border-warning {
    border-color: #ffc107 !important;
}

.border-danger {
    border-color: #dc3545 !important;
}

.border-light {
    border-color: #f8f9fa !important;
}

.border-dark {
    border-color: #343a40 !important;
}

.border-white {
    border-color: #fff !important;
}

.text-white {
    color: #fff !important;
}

.text-primary {
    color: #007bff !important;
}

a.text-primary:focus, a.text-primary:hover {
    color: #0062cc !important;
}

.text-muted {
    color: #868e96 !important;
}

a.text-secondary:focus, a.text-secondary:hover {
    color: #6c757d !important;
}

.text-success {
    color: #28a745 !important;
}

a.text-success:focus, a.text-success:hover {
    color: #1e7e34 !important;
}

.text-info {
    color: #17a2b8 !important;
}

a.text-info:focus, a.text-info:hover {
    color: #117a8b !important;
}

.text-warning {
    color: #ffc107 !important;
}

a.text-warning:focus, a.text-warning:hover {
    color: #d39e00 !important;
}

.text-danger {
    color: #dc3545 !important;
}

a.text-danger:focus, a.text-danger:hover {
    color: #bd2130 !important;
}

.text-light {
    color: #f8f9fa !important;
}

a.text-light:focus, a.text-light:hover {
    color: #dae0e5 !important;
}

.text-dark {
    color: #343a40 !important;
}

a.text-dark:focus, a.text-dark:hover {
    color: #1d2124 !important;
}















.colors-custom a:hover,
.colors-custom a:active,
.colors-custom .entry-content a:focus,
.colors-custom .entry-content a:hover,
.colors-custom .entry-summary a:focus,
.colors-custom .entry-summary a:hover,
.colors-custom .widget a:focus,
.colors-custom .widget a:hover,
.colors-custom .site-footer .widget-area a:focus,
.colors-custom .site-footer .widget-area a:hover,
.colors-custom .posts-navigation a:focus,
.colors-custom .posts-navigation a:hover,
.colors-custom .comment-metadata a:focus,
.colors-custom .comment-metadata a:hover,
.colors-custom .comment-metadata a.comment-edit-link:focus,
.colors-custom .comment-metadata a.comment-edit-link:hover,
.colors-custom .comment-reply-link:focus,
.colors-custom .comment-reply-link:hover,
.colors-custom .widget_authors a:focus strong,
.colors-custom .widget_authors a:hover strong,
.colors-custom .entry-title a:focus,
.colors-custom .entry-title a:hover,
.colors-custom .entry-meta a:focus,
.colors-custom .entry-meta a:hover,
.colors-custom.blog .entry-meta a.post-edit-link:focus,
.colors-custom.blog .entry-meta a.post-edit-link:hover,
.colors-custom.archive .entry-meta a.post-edit-link:focus,
.colors-custom.archive .entry-meta a.post-edit-link:hover,
.colors-custom.search .entry-meta a.post-edit-link:focus,
.colors-custom.search .entry-meta a.post-edit-link:hover,
.colors-custom .page-links a:focus .page-number,
.colors-custom .page-links a:hover .page-number,
.colors-custom .entry-footer a:focus,
.colors-custom .entry-footer a:hover,
.colors-custom .entry-footer .cat-links a:focus,
.colors-custom .entry-footer .cat-links a:hover,
.colors-custom .entry-footer .tags-links a:focus,
.colors-custom .entry-footer .tags-links a:hover,
.colors-custom .post-navigation a:focus,
.colors-custom .post-navigation a:hover,
.colors-custom .pagination a:not(.prev):not(.next):focus,
.colors-custom .pagination a:not(.prev):not(.next):hover,
.colors-custom .comments-pagination a:not(.prev):not(.next):focus,
.colors-custom .comments-pagination a:not(.prev):not(.next):hover,
.colors-custom .logged-in-as a:focus,
.colors-custom .logged-in-as a:hover,
.colors-custom a:focus .nav-title,
.colors-custom a:hover .nav-title,
.colors-custom .edit-link a:focus,
.colors-custom .edit-link a:hover,
.colors-custom .site-info a:focus,
.colors-custom .site-info a:hover,
.colors-custom .widget .widget-title a:focus,
.colors-custom .widget .widget-title a:hover,
.colors-custom .widget ul li a:focus,
.colors-custom .widget ul li a:hover {
	color: hsl( '.$hue.', '.$saturation.', 0% ); /* base: #000; */
}

.colors-custom .entry-content a,
.colors-custom .entry-summary a,
.colors-custom .widget a,
.colors-custom .site-footer .widget-area a,
.colors-custom .posts-navigation a,
.colors-custom .widget_authors a strong {
	-webkit-box-shadow: inset 0 -1px 0 hsl( '.$hue.', '.$saturation.', 6% ); /* base: rgba(15, 15, 15, 1); */
	box-shadow: inset 0 -1px 0 hsl( '.$hue.', '.$saturation.', 6% ); /* base: rgba(15, 15, 15, 1); */
}

.colors-custom button,
.colors-custom input[type="button"],
.colors-custom input[type="submit"],
.colors-custom .entry-footer .edit-link a.post-edit-link {
	background-color: hsl( '.$hue.', '.$saturation.', 13% ); /* base: #222; */
}

.colors-custom input[type="text"]:focus,
.colors-custom input[type="email"]:focus,
.colors-custom input[type="url"]:focus,
.colors-custom input[type="password"]:focus,
.colors-custom input[type="search"]:focus,
.colors-custom input[type="number"]:focus,
.colors-custom input[type="tel"]:focus,
.colors-custom input[type="range"]:focus,
.colors-custom input[type="date"]:focus,
.colors-custom input[type="month"]:focus,
.colors-custom input[type="week"]:focus,
.colors-custom input[type="time"]:focus,
.colors-custom input[type="datetime"]:focus,
.colors-custom .colors-custom input[type="datetime-local"]:focus,
.colors-custom input[type="color"]:focus,
.colors-custom textarea:focus,
.colors-custom button.secondary,
.colors-custom input[type="reset"],
.colors-custom input[type="button"].secondary,
.colors-custom input[type="reset"].secondary,
.colors-custom input[type="submit"].secondary,
.colors-custom a,
.colors-custom .site-title,
.colors-custom .site-title a,
.colors-custom .navigation-top a,
.colors-custom .dropdown-toggle,
.colors-custom .menu-toggle,
.colors-custom .page .panel-content .entry-title,
.colors-custom .page-title,
.colors-custom.page:not(.madeit-front-page) .entry-title,
.colors-custom .page-links a .page-number,
.colors-custom .comment-metadata a.comment-edit-link,
.colors-custom .comment-reply-link .icon,
.colors-custom h2.widget-title,
.colors-custom mark,
.colors-custom .post-navigation a:focus .icon,
.colors-custom .post-navigation a:hover .icon,
.colors-custom .site-content .site-content-light,
.colors-custom .madeit-panel .recent-posts .entry-header .edit-link {
	color: hsl( '.$hue.', '.$saturation.', 13% ); /* base: #222; */
}

.colors-custom .entry-content a:focus,
.colors-custom .entry-content a:hover,
.colors-custom .entry-summary a:focus,
.colors-custom .entry-summary a:hover,
.colors-custom .widget a:focus,
.colors-custom .widget a:hover,
.colors-custom .site-footer .widget-area a:focus,
.colors-custom .site-footer .widget-area a:hover,
.colors-custom .posts-navigation a:focus,
.colors-custom .posts-navigation a:hover,
.colors-custom .comment-metadata a:focus,
.colors-custom .comment-metadata a:hover,
.colors-custom .comment-metadata a.comment-edit-link:focus,
.colors-custom .comment-metadata a.comment-edit-link:hover,
.colors-custom .comment-reply-link:focus,
.colors-custom .comment-reply-link:hover,
.colors-custom .widget_authors a:focus strong,
.colors-custom .widget_authors a:hover strong,
.colors-custom .entry-title a:focus,
.colors-custom .entry-title a:hover,
.colors-custom .entry-meta a:focus,
.colors-custom .entry-meta a:hover,
.colors-custom.blog .entry-meta a.post-edit-link:focus,
.colors-custom.blog .entry-meta a.post-edit-link:hover,
.colors-custom.archive .entry-meta a.post-edit-link:focus,
.colors-custom.archive .entry-meta a.post-edit-link:hover,
.colors-custom.search .entry-meta a.post-edit-link:focus,
.colors-custom.search .entry-meta a.post-edit-link:hover,
.colors-custom .page-links a:focus .page-number,
.colors-custom .page-links a:hover .page-number,
.colors-custom .entry-footer .cat-links a:focus,
.colors-custom .entry-footer .cat-links a:hover,
.colors-custom .entry-footer .tags-links a:focus,
.colors-custom .entry-footer .tags-links a:hover,
.colors-custom .post-navigation a:focus,
.colors-custom .post-navigation a:hover,
.colors-custom .pagination a:not(.prev):not(.next):focus,
.colors-custom .pagination a:not(.prev):not(.next):hover,
.colors-custom .comments-pagination a:not(.prev):not(.next):focus,
.colors-custom .comments-pagination a:not(.prev):not(.next):hover,
.colors-custom .logged-in-as a:focus,
.colors-custom .logged-in-as a:hover,
.colors-custom a:focus .nav-title,
.colors-custom a:hover .nav-title,
.colors-custom .edit-link a:focus,
.colors-custom .edit-link a:hover,
.colors-custom .site-info a:focus,
.colors-custom .site-info a:hover,
.colors-custom .widget .widget-title a:focus,
.colors-custom .widget .widget-title a:hover,
.colors-custom .widget ul li a:focus,
.colors-custom .widget ul li a:hover {
	-webkit-box-shadow: inset 0 0 0 hsl( '.$hue.', '.$saturation.', 13% ), 0 3px 0 hsl( '.$hue.', '.$saturation.', 13% );
	box-shadow: inset 0 0 0 hsl( '.$hue.', '.$saturation.' , 13% ), 0 3px 0 hsl( '.$hue.', '.$saturation.', 13% );
}

body.colors-custom,
.colors-custom button,
.colors-custom input,
.colors-custom select,
.colors-custom textarea,
.colors-custom h3,
.colors-custom h4,
.colors-custom h6,
.colors-custom label,
.colors-custom .entry-title a,
.colors-custom.madeit-front-page .panel-content .recent-posts article,
.colors-custom .entry-footer .cat-links a,
.colors-custom .entry-footer .tags-links a,
.colors-custom .format-quote blockquote,
.colors-custom .nav-title,
.colors-custom .comment-body,
.colors-custom .site-content .wp-playlist-light .wp-playlist-current-item .wp-playlist-item-album {
	color: hsl( '.$hue.', '.$reduced_saturation.', 20% ); /* base: #333; */
}

.colors-custom .social-navigation a:hover,
.colors-custom .social-navigation a:focus {
	background: hsl( '.$hue.', '.$reduced_saturation.', 20% ); /* base: #333; */
}

.colors-custom input[type="text"]:focus,
.colors-custom input[type="email"]:focus,
.colors-custom input[type="url"]:focus,
.colors-custom input[type="password"]:focus,
.colors-custom input[type="search"]:focus,
.colors-custom input[type="number"]:focus,
.colors-custom input[type="tel"]:focus,
.colors-custom input[type="range"]:focus,
.colors-custom input[type="date"]:focus,
.colors-custom input[type="month"]:focus,
.colors-custom input[type="week"]:focus,
.colors-custom input[type="time"]:focus,
.colors-custom input[type="datetime"]:focus,
.colors-custom input[type="datetime-local"]:focus,
.colors-custom input[type="color"]:focus,
.colors-custom textarea:focus,
.bypostauthor > .comment-body > .comment-meta > .comment-author .avatar {
	border-color: hsl( '.$hue.', '.$reduced_saturation.', 20% ); /* base: #333; */
}

.colors-custom h2,
.colors-custom blockquote,
.colors-custom input[type="text"],
.colors-custom input[type="email"],
.colors-custom input[type="url"],
.colors-custom input[type="password"],
.colors-custom input[type="search"],
.colors-custom input[type="number"],
.colors-custom input[type="tel"],
.colors-custom input[type="range"],
.colors-custom input[type="date"],
.colors-custom input[type="month"],
.colors-custom input[type="week"],
.colors-custom input[type="time"],
.colors-custom input[type="datetime"],
.colors-custom input[type="datetime-local"],
.colors-custom input[type="color"],
.colors-custom textarea,
.colors-custom .site-description,
.colors-custom .entry-content blockquote.alignleft,
.colors-custom .entry-content blockquote.alignright,
.colors-custom .colors-custom .taxonomy-description,
.colors-custom .site-info a,
.colors-custom .wp-caption,
.colors-custom .gallery-caption {
	color: hsl( '.$hue.', '.$saturation.', 40% ); /* base: #666; */
}

.colors-custom abbr,
.colors-custom acronym {
	border-bottom-color: hsl( '.$hue.', '.$saturation.', 40% ); /* base: #666; */
}

.colors-custom h5,
.colors-custom .entry-meta,
.colors-custom .entry-meta a,
.colors-custom.blog .entry-meta a.post-edit-link,
.colors-custom.archive .entry-meta a.post-edit-link,
.colors-custom.search .entry-meta a.post-edit-link,
.colors-custom .nav-subtitle,
.colors-custom .comment-metadata,
.colors-custom .comment-metadata a,
.colors-custom .no-comments,
.colors-custom .comment-awaiting-moderation,
.colors-custom .page-numbers.current,
.colors-custom .page-links .page-number,
.colors-custom .navigation-top .current-menu-item > a,
.colors-custom .navigation-top .current_page_item > a,
.colors-custom .main-navigation a:hover,
.colors-custom .site-content .wp-playlist-light .wp-playlist-current-item .wp-playlist-item-artist {
	color: hsl( '.$hue.', '.$saturation.', 46% ); /* base: #767676; */
}

.colors-custom button:hover,
.colors-custom button:focus,
.colors-custom input[type="button"]:hover,
.colors-custom input[type="button"]:focus,
.colors-custom input[type="submit"]:hover,
.colors-custom input[type="submit"]:focus,
.colors-custom .entry-footer .edit-link a.post-edit-link:hover,
.colors-custom .entry-footer .edit-link a.post-edit-link:focus,
.colors-custom .social-navigation a,
.colors-custom .prev.page-numbers:focus,
.colors-custom .prev.page-numbers:hover,
.colors-custom .next.page-numbers:focus,
.colors-custom .next.page-numbers:hover,
.colors-custom .site-content .wp-playlist-light .wp-playlist-item:hover,
.colors-custom .site-content .wp-playlist-light .wp-playlist-item:focus {
	background: hsl( '.esc_attr($hue).', '.esc_attr($saturation).', 46% ); /* base: #767676; */
}

.colors-custom button.secondary:hover,
.colors-custom button.secondary:focus,
.colors-custom input[type="reset"]:hover,
.colors-custom input[type="reset"]:focus,
.colors-custom input[type="button"].secondary:hover,
.colors-custom input[type="button"].secondary:focus,
.colors-custom input[type="reset"].secondary:hover,
.colors-custom input[type="reset"].secondary:focus,
.colors-custom input[type="submit"].secondary:hover,
.colors-custom input[type="submit"].secondary:focus,
.colors-custom hr {
	background: hsl( '.$hue.', '.$saturation.', 73% ); /* base: #bbb; */
}

.colors-custom input[type="text"],
.colors-custom input[type="email"],
.colors-custom input[type="url"],
.colors-custom input[type="password"],
.colors-custom input[type="search"],
.colors-custom input[type="number"],
.colors-custom input[type="tel"],
.colors-custom input[type="range"],
.colors-custom input[type="date"],
.colors-custom input[type="month"],
.colors-custom input[type="week"],
.colors-custom input[type="time"],
.colors-custom input[type="datetime"],
.colors-custom input[type="datetime-local"],
.colors-custom input[type="color"],
.colors-custom textarea,
.colors-custom select,
.colors-custom fieldset,
.colors-custom .widget .tagcloud a:hover,
.colors-custom .widget .tagcloud a:focus,
.colors-custom .widget.widget_tag_cloud a:hover,
.colors-custom .widget.widget_tag_cloud a:focus,
.colors-custom .wp_widget_tag_cloud a:hover,
.colors-custom .wp_widget_tag_cloud a:focus {
	border-color: hsl( '.$hue.', '.$saturation.', 73% ); /* base: #bbb; */
}

.colors-custom thead th {
	border-bottom-color: hsl( '.$hue.', '.$saturation.', 73% ); /* base: #bbb; */
}

.colors-custom .entry-footer .cat-links .icon,
.colors-custom .entry-footer .tags-links .icon {
	color: hsl( '.$hue.', '.$saturation.', 73% ); /* base: #bbb; */
}

.colors-custom button.secondary,
.colors-custom input[type="reset"],
.colors-custom input[type="button"].secondary,
.colors-custom input[type="reset"].secondary,
.colors-custom input[type="submit"].secondary,
.colors-custom .prev.page-numbers,
.colors-custom .next.page-numbers {
	background-color: hsl( '.$hue.', '.$saturation.', 87% ); /* base: #ddd; */
}

.colors-custom .widget .tagcloud a,
.colors-custom .widget.widget_tag_cloud a,
.colors-custom .wp_widget_tag_cloud a {
	border-color: hsl( '.$hue.', '.$saturation.', 87% ); /* base: #ddd; */
}

.colors-custom.madeit-front-page article:not(.has-post-thumbnail):not(:first-child),
.colors-custom .widget ul li {
	border-top-color: hsl( '.$hue.', '.$saturation.', 87% ); /* base: #ddd; */
}

.colors-custom .widget ul li {
	border-bottom-color: hsl( '.$hue.', '.$saturation.', 87% ); /* base: #ddd; */
}

.colors-custom pre,
.colors-custom mark,
.colors-custom ins {
	background: hsl( '.$hue.', '.$saturation.', 93% ); /* base: #eee; */
}

.colors-custom .navigation-top,
.colors-custom .main-navigation > div > ul,
.colors-custom .pagination,
.colors-custom .comments-pagination,
.colors-custom .entry-footer,
.colors-custom .site-footer {
	border-top-color: hsl( '.$hue.', '.$saturation.', 93% ); /* base: #eee; */
}

.colors-custom .navigation-top,
.colors-custom .main-navigation li,
.colors-custom .entry-footer,
.colors-custom .single-featured-image-header,
.colors-custom .site-content .wp-playlist-light .wp-playlist-item,
.colors-custom tr {
	border-bottom-color: hsl( '.$hue.', '.$saturation.', 93% ); /* base: #eee; */
}

.colors-custom .site-content .wp-playlist-light {
	border-color: hsl( '.$hue.', '.$saturation.', 93% ); /* base: #eee; */
}

.colors-custom .site-header,
.colors-custom .single-featured-image-header {
	background-color: hsl( '.$hue.', '.$saturation.', 98% ); /* base: #fafafa; */
}

.colors-custom button,
.colors-custom input[type="button"],
.colors-custom input[type="submit"],
.colors-custom .entry-footer .edit-link a.post-edit-link,
.colors-custom .social-navigation a,
.colors-custom .site-content .wp-playlist-light a.wp-playlist-caption:hover,
.colors-custom .site-content .wp-playlist-light .wp-playlist-item:hover a,
.colors-custom .site-content .wp-playlist-light .wp-playlist-item:focus a,
.colors-custom .site-content .wp-playlist-light .wp-playlist-item:hover,
.colors-custom .site-content .wp-playlist-light .wp-playlist-item:focus,
.colors-custom .prev.page-numbers:focus,
.colors-custom .prev.page-numbers:hover,
.colors-custom .next.page-numbers:focus,
.colors-custom .next.page-numbers:hover,
.colors-custom.has-header-image .site-title,
.colors-custom.has-header-video .site-title,
.colors-custom.has-header-image .site-title a,
.colors-custom.has-header-video .site-title a,
.colors-custom.has-header-image .site-description,
.colors-custom.has-header-video .site-description {
	color: hsl( '.$hue.', '.$saturation.', 100% ); /* base: #fff; */
}

body.colors-custom,
.colors-custom .navigation-top,
.colors-custom .main-navigation ul {
	background: hsl( '.$hue.', '.$saturation.', 100% ); /* base: #fff; */
}

.colors-custom .widget ul li a,
.colors-custom .site-footer .widget-area ul li a {
	-webkit-box-shadow: inset 0 -1px 0 hsl( '.$hue.', '.$saturation.', 100% ); /* base: rgba(255, 255, 255, 1); */
	box-shadow: inset 0 -1px 0 hsl( '.$hue.', '.$saturation.', 100% );  /* base: rgba(255, 255, 255, 1); */
}

.colors-custom .menu-toggle,
.colors-custom .menu-toggle:hover,
.colors-custom .menu-toggle:focus,
.colors-custom .menu .dropdown-toggle,
.colors-custom .menu-scroll-down,
.colors-custom .menu-scroll-down:hover,
.colors-custom .menu-scroll-down:focus {
	background-color: transparent;
}

.colors-custom .widget .tagcloud a,
.colors-custom .widget .tagcloud a:focus,
.colors-custom .widget .tagcloud a:hover,
.colors-custom .widget.widget_tag_cloud a,
.colors-custom .widget.widget_tag_cloud a:focus,
.colors-custom .widget.widget_tag_cloud a:hover,
.colors-custom .wp_widget_tag_cloud a,
.colors-custom .wp_widget_tag_cloud a:focus,
.colors-custom .wp_widget_tag_cloud a:hover,
.colors-custom .entry-footer .edit-link a.post-edit-link:focus,
.colors-custom .entry-footer .edit-link a.post-edit-link:hover {
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
}

/* Reset non-customizable hover styling for links */
.colors-custom .entry-content a:hover,
.colors-custom .entry-content a:focus,
.colors-custom .entry-summary a:hover,
.colors-custom .entry-summary a:focus,
.colors-custom .widget a:hover,
.colors-custom .widget a:focus,
.colors-custom .site-footer .widget-area a:hover,
.colors-custom .site-footer .widget-area a:focus,
.colors-custom .posts-navigation a:hover,
.colors-custom .posts-navigation a:focus,
.colors-custom .widget_authors a:hover strong,
.colors-custom .widget_authors a:focus strong {
	-webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 3px 0 rgba(0, 0, 0, 1);
	box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 3px 0 rgba(0, 0, 0, 1);
}

.colors-custom .gallery-item a,
.colors-custom .gallery-item a:hover,
.colors-custom .gallery-item a:focus {
	-webkit-box-shadow: none;
	box-shadow: none;
}

@media screen and (min-width: 48em) {

	.colors-custom .nav-links .nav-previous .nav-title .icon,
	.colors-custom .nav-links .nav-next .nav-title .icon {
		color: hsl( '.$hue.', '.$saturation.', 20% ); /* base: #222; */
	}

	.colors-custom .main-navigation li li:hover,
	.colors-custom .main-navigation li li.focus {
		background: hsl( '.$hue.', '.$saturation.', 46% ); /* base: #767676; */
	}

	.colors-custom .navigation-top .menu-scroll-down {
		color: hsl( '.$hue.', '.$saturation.', 46% ); /* base: #767676; */;
	}

	.colors-custom abbr[title] {
		border-bottom-color: hsl( '.$hue.', '.$saturation.', 46% ); /* base: #767676; */;
	}

	.colors-custom .main-navigation ul ul {
		border-color: hsl( '.$hue.', '.$saturation.', 73% ); /* base: #bbb; */
		background: hsl( '.$hue.', '.$saturation.', 100% ); /* base: #fff; */
	}

	.colors-custom .main-navigation ul li.menu-item-has-children:before,
	.colors-custom .main-navigation ul li.page_item_has_children:before {
		border-bottom-color: hsl( '.$hue.', '.$saturation.', 73% ); /* base: #bbb; */
	}

	.colors-custom .main-navigation ul li.menu-item-has-children:after,
	.colors-custom .main-navigation ul li.page_item_has_children:after {
		border-bottom-color: hsl( '.$hue.', '.$saturation.', 100% ); /* base: #fff; */
	}

	.colors-custom .main-navigation li li.focus > a,
	.colors-custom .main-navigation li li:focus > a,
	.colors-custom .main-navigation li li:hover > a,
	.colors-custom .main-navigation li li a:hover,
	.colors-custom .main-navigation li li a:focus,
	.colors-custom .main-navigation li li.current_page_item a:hover,
	.colors-custom .main-navigation li li.current-menu-item a:hover,
	.colors-custom .main-navigation li li.current_page_item a:focus,
	.colors-custom .main-navigation li li.current-menu-item a:focus {
		color: hsl( '.$hue.', '.$saturation.', 100% ); /* base: #fff; */
	}
}';

    /*
     * Filters Made I.T. custom colors CSS.
     *
     * @since Made I.T. 1.0
     *
     * @param string $css        Base theme colors CSS.
     * @param int    $hue        The user's selected color hue.
     * @param string $saturation Filtered theme color saturation level.
     */
    return apply_filters('madeit_custom_colors_css', $css, $hue, $saturation);
}

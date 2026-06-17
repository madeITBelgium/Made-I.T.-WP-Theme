=== Made I.T. ===
Contributors: madeit
Requires at least: WordPress 5.0
Tested up to: 7.0
Requires PHP: 8.5
Version: 3.0.8
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Tags: madeit, bootstrap, bootstrap4, made i.t., Made I.T.

== Description ==

== Installation ==

1. In your admin panel, go to Appearance -> Themes and click the 'Add New' button.
2. Type in Made I.T. in the search form and press the 'Enter' key on your keyboard.
3. Click on the 'Activate' button to use your new theme right away.
4. Go to https://www.madeit.be/wordpress-theme for a guide on how to customize this theme.
5. Navigate to Appearance > Customize in your admin panel and customize to taste.

== Copyright ==

Made I.T. WordPress Theme, Copyright 2017 - 2026 Made I.T.
Made I.T. Theme is distributed under the terms of the GNU GPL

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

Made I.T. Theme bundles the following third-party resources:

HTML5 Shiv, Copyright 2014 Alexander Farkas
Licenses: MIT/GPL2
Source: https://github.com/aFarkas/html5shiv

jQuery scrollTo, Copyright 2007-2015 Ariel Flesler
License: MIT
Source: https://github.com/flesler/jquery.scrollTo

normalize.css, Copyright 2012-2016 Nicolas Gallagher and Jonathan Neal
License: MIT
Source: https://necolas.github.io/normalize.css/

Font Awesome icons, Copyright Dave Gandy
License: SIL Open Font License, version 1.1.
Source: http://fontawesome.io/

Bundled header image, Copyright Alvin Engler
License: CC0 1.0 Universal (CC0 1.0)
Source: https://unsplash.com/@englr?photo=bIhpiQA009k

== Changelog ==
= 3.0.8 =
* Added WPML config for `categorie-pagina` and expanded multilingual handling for category SEO pages
* Refactored category SEO page loading/rendering with reusable helpers and WPML fallback translation logic
* Added new WP-CLI command `madeit merge-product-cat` for safe product category merges (dry-run/apply)
* Improved duplicate product category slug fixer with explicit apply mode, WPML-aware duplicate classification, language options, and orphan parent checks
* Updated Odoo category synchronization to parse spaced category paths and select the lowest existing category ID when duplicates exist
* Changed mobile navigation fallback breakpoint from `md` to `lg`

= 3.0.7 =
* Added legacy boxed inline wrapper save handling for the Container Content block
* Added WP-CLI command to fix duplicate product category slugs
* Improved Container Content migration eligibility for legacy boxed inline wrappers
* Preserved legacy inline wrapper styles and avoided new CSS vars on legacy markup
* Simplified starter content defaults by removing bundled widgets, thumbnails, and theme mods
* Updated under-construction and theme image assets (loader, templates, screenshot)
* Fixed product category inserts during Odoo sync by letting WordPress generate unique slugs
* Removed bundled starter content attachments and sample images

= 3.0.6 =
* Added class name and style support for Container Content Column blocks in the editor
* Improved container alignment and migration rules for container content blocks
* Updated security auto-update defaults and window gating behavior
* Fixed blog index container sizing conflicts and frontend container auto-fix behavior
* Fixed core image style merging and removed unconditional opcache reset during setup
* Removed generated source maps for Container Content block build assets

= 3.0.5 =
* Added custom responsive unit support for Container Content min-height and max-width (including custom unit input values)
* Improved legacy container migration paths for inline-margin wrappers and regenerated related block build assets
* Added WordPress core auto-update control in security settings and hardening checks
* Improved security auto-update behavior with a guarded update window (06:00-17:00, site timezone)
* Fixed blocked-IP duplicate handling via upsert logic and improved remote update automation in daily calls

= 3.0.4 =
* Added security WP-CLI commands: list-blocked, block-ip, unblock-ip, and whitelist-ip
* Added blocked-IP self-service unblock request flow with email submission, nonce protection, and rate limiting
* Improved popup frontend behavior for specific page targeting and modal close handling
* Improved popup admin fields with conditional page-selection UI and clearer usage instructions
* Fixed Color Image block migration behavior for deprecated margin offsets and updated block metadata/build artifacts
* Fixed WooCommerce login compatibility in honeypot checks by skipping wp-login timing token validation for WooCommerce login forms

= 3.0.3 =
* Fixed stray output in under construction routing to prevent blank lines before XML responses

= 3.0.2 =
* Fixed frontend Container block rendering and wrapper handling for `madeit-block-content`
* Improved Separator block attribute defaults and editor style handling
* Updated build tooling to preserve `node_modules` during node project rebuilds
* Refreshed Gutenberg block build output for advanced-controls, madeit-card, madeit-container, madeit-maps, madeit-review, madeit-slider, and madeit-tabs
* Added generated filters/hooks export metadata for maintenance and diagnostics

= 3.0.1 =
* Added Git changelog skill and release tooling for better version tracking
* Updated Gutenberg block editor support and builds for Card, Container, Color Image, Maps, Review, Slider, and Tabs
* Added AI sidebar and editor restriction enhancements
* Added honeypot security support and improved admin notices/updates flow
* Added build scripts, filters/hooks export tooling, and theme screenshot

= 3.0.0 =
* WooCommerce 9.4 - 10.5.2
* Bootstrap v5.3.7
* AI functions
* Default cookie banner
* Many improvements and bug fixes

= 2.10.7 =
* WooCommerce 8.7 - 9.3
* Bootstrap v5.3.3

= 2.10.0 =
* WooCommerce 8.3 - 8.6
* Review form
* Bug fixes
* Bootstrap v5.3.2

= 2.9.0 =
* Adjust navigation menu on tablet
* Improve content block margin & paddings
* WooCommerce 7.4

= 2.8.0 =
* Review support
* WooCommerce 7.0 & 7.1, 7.2, 7.3
* Improved WooCommerce support - Card layouts
* Boostrap 4 & 5 Support
* Popups
* GA, GA4 & Facebook Pixel integration

= 2.7.1 =
* Release 2.7.0 & 2.7.1

= 2.7.0 =
* Made I.T. Visual Form Builder integration
* Bootstrap 4.6.*
* WooCommerce 6.*
* Improved support and help functions
* Add support for animation
* Add support for infinityscroll

= 2.6.1 =
* WooCommerce 5.7

= 2.6.0 =
* WordPress 5.8 support
* Card Gutenberg block

= 2.5.0 =
* Bootstrap 4.5.x
* Improve WooCommerce Support
* WordPress 5.6 Support

= 2.4.0 =
* Fix woocommerce
* WordPress 5.5 support

= 2.3.1 =
* Fix woocommerce

= 2.3.0 =
* WordPress 5.4 support

= 2.2.0 =
* Extra afbeelding stijl
* Verbeterde popup
* Woocommerce verbeteringen
* Fix theme style

= 2.1.1 =
* Fix header image

= 2.1.0 =
* General improvements
* Custom theme color css cache system
* Extra gutenberg blocks

= 1.0.5 =
* Cookie notice

= 1.0.1 - 1.0.4 =
* Bug fixes

= 1.0.0 =
* Basic

Initial release

/*
 * Editor-only compatibility layer.
 *
 * Goal: keep the legacy `madeit/block-carousel` block working for existing content,
 * but prevent inserting it going forward.
 */

(function (wp) {
	if (!wp || !wp.hooks || !wp.hooks.addFilter) {
		return;
	}

	wp.hooks.addFilter(
		'blocks.registerBlockType',
		'madeit/hide-legacy-carousel-inserter',
		function (settings, name) {
			if (name !== 'madeit/block-carousel') {
				return settings;
			}

			return {
				...settings,
				supports: {
					...(settings && settings.supports ? settings.supports : {}),
					inserter: false,
				},
			};
		}
	);
})(window.wp);

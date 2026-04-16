
import { __ } from '@wordpress/i18n';

export default {
	name: 'standaard',
	label: __('Standaard', 'madeit-review'),
	template: [
		[
			'core/group',
			{ className: 'madeit-review__card' },
			[
				['core/paragraph', { placeholder: __('Review…', 'madeit-review'), className: 'madeit-review__bericht' }],
				['core/paragraph', { placeholder: __('Naam…', 'madeit-review'), className: 'madeit-review__naam' }],
			],
		],
	],
};

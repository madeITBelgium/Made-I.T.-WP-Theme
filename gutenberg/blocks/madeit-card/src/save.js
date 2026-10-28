import classnames from 'classnames';

import {
	InnerBlocks,
	getColorClassName,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { getCardStyleVars } from './utils';

export default function save( props ) {
	const {
		customBackgroundColor,
		backgroundColor,
		customTextColor,
		textColor,
		cardTitle,
		level,
		hasTitle,
		mediaBleed,
		url,
		opensInNewTab,
		linkTarget,
		linkToPost,
	} = props.attributes;

	const { className } = props;

	const backgroundColorClass = backgroundColor
		? getColorClassName( 'background-color', backgroundColor )
		: undefined;
	const textColorClass = textColor
		? getColorClassName( 'color', textColor )
		: undefined;

	const TagName = 'h' + level;
	const cardUrl = typeof url === 'object' && url !== null ? url.url : url;
	const isNewTab = opensInNewTab !== undefined ? opensInNewTab : ( linkTarget === '_blank' || ( typeof url === 'object' && url !== null && url.opensInNewTab ) );
	const target = isNewTab ? '_blank' : undefined;
	const rel = isNewTab ? 'noopener' : undefined;
	const hasLink = !! linkToPost || !! cardUrl;

	const wrapperClasses = classnames( className, {
		card: true,
		'has-media-bleed': !! mediaBleed,
		'has-text-color': textColorClass,
		'has-background': backgroundColorClass,
		[ backgroundColorClass ]: backgroundColorClass,
		[ textColorClass ]: textColorClass,
	} );

	const blockProps = useBlockProps.save( {
		className: wrapperClasses,
		style: {
			backgroundColor: backgroundColorClass
				? undefined
				: customBackgroundColor,
			color: textColorClass ? undefined : customTextColor,
			...getCardStyleVars( props.attributes ),
		},
	} );

	return (
		<div { ...blockProps }>
			{ hasLink && (
				// With linkToPost the href is filled in server side (register.php) with the permalink of the current post.
				<a
					href={ linkToPost ? undefined : cardUrl }
					className="card-link"
					target={ target }
					rel={ rel }
					data-madeit-post-link={ linkToPost ? 'true' : undefined }
				></a>
			) }
			{ hasTitle && (
				<div className="card-header">
					<TagName>
						<RichText.Content value={ cardTitle } />
					</TagName>
				</div>
			) }
			<div className="card-body">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}

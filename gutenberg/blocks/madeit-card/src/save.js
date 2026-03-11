import classnames from 'classnames';

import {
	InnerBlocks,
	getColorClassName,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

export default function save(props) {
	const {
		customBackgroundColor,
		backgroundColor,
		customTextColor,
		textColor,
		cardTitle,
		level,
		hasTitle,
		contentPadding,
		mediaBleed,
	} = props.attributes;

	const { className } = props;

	const backgroundColorClass = backgroundColor
		? getColorClassName('background-color', backgroundColor)
		: undefined;
	const textColorClass = textColor
		? getColorClassName('color', textColor)
		: undefined;

	const TagName = 'h' + level;

	let wrapperClasses = classnames(className, {
		card: true,
	});

	wrapperClasses = classnames(wrapperClasses, {
		'has-media-bleed': !!mediaBleed,
	});

	wrapperClasses = classnames(wrapperClasses, {
		'has-text-color': textColorClass,
		'has-background': backgroundColorClass,
		[backgroundColorClass]: backgroundColorClass,
		[textColorClass]: textColorClass,
	});

	const blockProps = useBlockProps.save({
		className: wrapperClasses,
		style: {
			backgroundColor: backgroundColorClass
				? undefined
				: customBackgroundColor,
			color: textColorClass ? undefined : customTextColor,
			'--madeit-card-content-padding-top': contentPadding?.top,
			'--madeit-card-content-padding-right': contentPadding?.right,
			'--madeit-card-content-padding-bottom': contentPadding?.bottom,
			'--madeit-card-content-padding-left': contentPadding?.left,
		},
	});

	return (
		<div {...blockProps}>
			{hasTitle && (
				<div className="card-header">
					<TagName>
						<RichText.Content value={cardTitle} />
					</TagName>
				</div>
			)}
			<div className="card-body">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}


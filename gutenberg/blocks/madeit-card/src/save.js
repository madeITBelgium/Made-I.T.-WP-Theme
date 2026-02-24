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


import HeadingLevelDropdown from './heading-level-dropdown';

import {
	InnerBlocks,
	InspectorControls,
	ContrastChecker,
	PanelColorSettings,
	withColors,
	RichText,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';

import { PanelBody, ToggleControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

function CardEdit(props) {
	const {
		attributes,
		setAttributes,
		hasChildBlocks,
		backgroundColor,
		setBackgroundColor,
		textColor,
		setTextColor,
		className,
	} = props;

	const { level, cardTitle, hasTitle } = attributes;
	const TagName = 'h' + level;

	const fallbackTextColor = '#FFFFFF';
	const fallbackBackgroundColor = '#000000';

	const blockProps = useBlockProps({
		className,
		style: {
			backgroundColor: backgroundColor.color,
			color: textColor.color,
		},
	});

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Title')}>
					<ToggleControl
						label={__('Has title')}
						checked={hasTitle}
						onChange={(state) => setAttributes({ hasTitle: state })}
					/>
				</PanelBody>
				<PanelColorSettings
					title={__('Color Settings')}
					initialOpen={false}
					colorSettings={[
						{
							value: backgroundColor.color,
							onChange: (value) => setBackgroundColor(value),
							label: __('Background Color'),
						},
						{
							value: textColor.color,
							onChange: (value) => setTextColor(value),
							label: __('Text Color'),
						},
					]}
				>
					<ContrastChecker
						{...{
							textColor: textColor.color,
							backgroundColor: backgroundColor.color,
							fallbackTextColor,
							fallbackBackgroundColor,
						}}
					/>
				</PanelColorSettings>
			</InspectorControls>
			{hasTitle && (
				<BlockControls group="block">
					<HeadingLevelDropdown
						selectedLevel={level}
						onChange={(newLevel) =>
							setAttributes({ level: newLevel })
						}
					/>
				</BlockControls>
			)}
			{hasTitle && (
				<div className="card-header">
					<RichText
						identifier="cardTitle"
						tagName={TagName}
						value={cardTitle}
						onChange={(value) => setAttributes({ cardTitle: value })}
						aria-label={__('Heading text')}
						placeholder={__('Heading')}
					/>
				</div>
			)}
			<div className="card-body">
				<InnerBlocks
					templateLock={false}
					renderAppender={
						hasChildBlocks
							? undefined
							: () => <InnerBlocks.ButtonBlockAppender />
					}
				/>
			</div>
		</div>
	);
}

export default compose(
	withColors('backgroundColor', 'textColor'),
	withSelect((select, ownProps) => {
		const { clientId } = ownProps;
		const { getBlockOrder } = select('core/block-editor');

		return {
			hasChildBlocks: getBlockOrder(clientId).length > 0,
		};
	})
)(CardEdit);


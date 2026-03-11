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

import { PanelBody, ToggleControl, __experimentalBoxControl as BoxControl, } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

const paddingToVars = (padding) => {
	if (!padding) return {};
	const vars = {};
	if (padding.top !== undefined) {
		vars['--madeit-card-content-padding-top'] = padding.top;
	}
	if (padding.right !== undefined) {
		vars['--madeit-card-content-padding-right'] = padding.right;
	}
	if (padding.bottom !== undefined) {
		vars['--madeit-card-content-padding-bottom'] = padding.bottom;
	}
	if (padding.left !== undefined) {
		vars['--madeit-card-content-padding-left'] = padding.left;
	}
	return vars;
};

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

	const { level, cardTitle, hasTitle, contentPadding, mediaBleed } = attributes;
	const TagName = 'h' + level;

	const fallbackTextColor = '#FFFFFF';
	const fallbackBackgroundColor = '#000000';

	const wrapperClasses = classnames(className, {
		'has-media-bleed': mediaBleed,
	});

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: {
			backgroundColor: backgroundColor.color,
			color: textColor.color,
			...paddingToVars(contentPadding),
		},
	});

	const setContentPadding = (newPadding) => {
		setAttributes({ contentPadding: newPadding });
	};

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

				<PanelBody title={__('Spatie')}>
					<div className="madeit-control">
						<BoxControl
							__next40pxDefaultSize
							label={__('Inhoud padding')}
							onChange={setContentPadding}
							values={contentPadding}
							allowReset={ false }
						/>
					</div>

					<ToggleControl
						label={__('Afbeelding tot rand')}
						help={__('Laat Image/Cover blocks de padding negeren zodat ze tegen de rand staan.')}
						checked={!!mediaBleed}
						onChange={(state) => setAttributes({ mediaBleed: state })}
					/>
				</PanelBody>
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


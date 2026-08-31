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
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';

import { PanelBody, ToggleControl, __experimentalBoxControl as BoxControl, TabPanel, SelectControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { ControlHeader, UnitSelect, getTabIcon, ResponsiveVisibilityPanel } from '../../../shared';

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

	const { level, cardTitle, hasTitle, contentPadding, mediaBleed, url, opensInNewTab, linkTarget, hideOnDesktop, hideOnTablet, hideOnMobile, aosFade, aosDelay, aosDelayCustom } = attributes;
	const TagName = 'h' + level;

	const cardUrl = typeof url === 'object' && url !== null ? url.url : url;
	const isNewTab = opensInNewTab !== undefined ? opensInNewTab : (linkTarget === '_blank' || (typeof url === 'object' && url !== null && url.opensInNewTab));

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

	
	const currentPadding = contentPadding || {};
	const paddingUnit = attributes?.paddingUnit || 'px';

	return (
		<div {...blockProps}>
			<InspectorControls>

				<TabPanel
					className="madeit-inspector-tabs"
					tabs={ [
						{
							name: 'settings',
							title: __( 'Algemeen' ),
							icon: <span dangerouslySetInnerHTML={{ __html: getTabIcon( 'settings' ) }} />,
						},
						{
							name: 'styles',
							title: __( 'Stijl' ),
							icon: <span dangerouslySetInnerHTML={{ __html: getTabIcon( 'styles' ) }} />,
						},
						{
							name: 'advanced',
							title: __( 'Advanced' ),
							icon: <span dangerouslySetInnerHTML={{ __html: getTabIcon( 'advanced' ) }} />,
						},
					] }
				>
					{ ( tab ) => (
						<div className={ `madeit-inspector-tab-content madeit-inspector-tab-content-${ tab.name }` }>
							{ tab.name === 'settings' && (
								<PanelBody title={__('Title')}>
									<ToggleControl
										label={__('Has title')}
										checked={hasTitle}
										onChange={(state) => setAttributes({ hasTitle: state })}
									/>
								</PanelBody>
							)}

							{ tab.name === 'styles' && (
								<>
								<PanelColorSettings
									title={__('Color Settings')}
									initialOpen={false}
									colorSettings={[
										{
											value: backgroundColor.color,
											onChange: (value) => setBackgroundColor(value),
											label: __('Background Color'),
											enableAlpha: true,
										},
										{
											value: textColor.color,
											onChange: (value) => setTextColor(value),
											label: __('Text Color'),
											enableAlpha: true,
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
									{/* <div className="madeit-control">
										<BoxControl
											__next40pxDefaultSize
											label={__('Inhoud padding')}
											onChange={setContentPadding}
											values={contentPadding}
											allowReset={ false }
										/>
									</div> */}


									<div
										className="madeit-control"
										style={ {
											display: 'flex',
											flexWrap: 'wrap',
											gap: '6px',
										} }
									>
										<ControlHeader
											title={ __( 'Inhoud Padding', 'madeit' ) }
											afterBreakpoint={
												<UnitSelect
													style={{ marginLeft: 'auto', }}
													value={ paddingUnit || 'px' }
													units={ [ 'px', '%', 'em', 'rem' ] }
													onChange={ ( unit ) => {

														const nextPadding = {};

														[ 'top', 'right', 'bottom', 'left' ].forEach(
															( key ) => {

																const raw = currentPadding?.[ key ];

																if ( ! raw ) {
																	return;
																}

																const numeric = parseFloat( raw );

																if ( ! Number.isFinite( numeric ) ) {
																	return;
																}

																nextPadding[ key ] = `${ numeric }${ unit }`;

															}
														);

														setAttributes( {
															contentPadding: nextPadding,
															paddingUnit: unit,
															madeitHasUserEdits: true,
														} );

													} }
												/>
											}
										/>

										<div
											className="madeit-controls"
											style={ {
												display: 'flex',
												alignItems: 'flex-start',
												maxWidth: 'calc(100% - 35px)',
												width: '100%',
											} }
										>
											{ [
												{ label: 'Bovenaan', key: 'top' },
												{ label: 'Rechts', key: 'right' },
												{ label: 'Onderaan', key: 'bottom' },
												{ label: 'Links', key: 'left' },
											].map( ( item ) => {

												const rawValue = currentPadding?.[ item.key ];

												const numericValue = parseFloat( rawValue );

												const displayValue = Number.isFinite( numericValue )
													? numericValue
													: '';

												return (
													<div
														key={ item.key }
														className="control-item"
														style={ {
															display: 'flex',
															flexDirection: 'column',
															alignItems: 'center',
															flex: 1,
														} }
													>
														<input
															type="number"
															value={ displayValue }
															min={ -9999 }
															onChange={ ( e ) => {

																const val = e.target.value;

																setAttributes( {
																	contentPadding: {
																		...currentPadding,
																		[ item.key ]:
																			val === ''
																				? undefined
																				: `${ val }${ paddingUnit }`,
																	},
																	madeitHasUserEdits: true,
																} );

															} }
															style={ {
																width: '100%',
																height: '27px',
																minHeight: '27px',
																fontSize: '.85em',
																textAlign: 'center',
																padding: '0',
															} }
														/>

														<span
															style={ {
																fontSize: '9px',
																marginTop: '4px',
															} }
														>
															{ __( item.label, 'madeit' ) }
														</span>
													</div>
												);

											} ) }
										</div>
									</div>



									<ToggleControl
										label={__('Afbeelding tot rand')}
										help={__('Laat Image/Cover blocks de padding negeren zodat ze tegen de rand staan.')}
										checked={!!mediaBleed}
										onChange={(state) => setAttributes({ mediaBleed: state })}
									/>
								</PanelBody>
								</>
							)}

							{ tab.name === 'advanced' && (
								<>
								<PanelBody title={__('Geavanceerd')}>
									<ControlHeader
										title={ __( 'Card linken', 'madeit' ) }
									/>

									<div className="madeit-control">
										<LinkControl
											style={{ maxWidth: '100%' }}
											value={
												cardUrl
													? {
															url: cardUrl,
															opensInNewTab: !!isNewTab,
													}
													: undefined
											}
											onChange={(nextValue) => {
												if (!nextValue || !nextValue.url) {
													setAttributes({
														url: undefined,
														opensInNewTab: false,
														linkTarget: undefined,
													});
												} else {
													const newOpensInNewTab = !!nextValue.opensInNewTab;
													setAttributes({
														url: nextValue.url,
														opensInNewTab: newOpensInNewTab,
														linkTarget: newOpensInNewTab ? '_blank' : undefined,
													});
												}
											}}
										/>
									</div>
								

								
									<ResponsiveVisibilityPanel
										title="Responsive"
										initialOpen={ true }
										hideOnDesktop={ hideOnDesktop }
										hideOnTablet={ hideOnTablet }
										hideOnMobile={ hideOnMobile }
										setAttributes={ setAttributes }
									/>
								</PanelBody>
		
								<PanelBody className="" title="Binnenkomende animatie" initialOpen={false}>
									<SelectControl
										__next40pxDefaultSize
										label={ __( 'Animatie', 'madeit' ) }
										value={ aosFade || '' }
										options={ [
											{ label: __( 'Geen', 'madeit' ), value: '' },
											// Fade animations
											{ label: __( 'Fade', 'madeit' ), value: 'fade' },
											{ label: __( 'Fade up', 'madeit' ), value: 'fade-up' },
											{ label: __( 'Fade down', 'madeit' ), value: 'fade-down' },
											{ label: __( 'Fade left', 'madeit' ), value: 'fade-left' },
											{ label: __( 'Fade right', 'madeit' ), value: 'fade-right' },
											{ label: __( 'Fade up right', 'madeit' ), value: 'fade-up-right' },
											{ label: __( 'Fade up left', 'madeit' ), value: 'fade-up-left' },
											{ label: __( 'Fade down right', 'madeit' ), value: 'fade-down-right' },
											{ label: __( 'Fade down left', 'madeit' ), value: 'fade-down-left' },

											// Flip animations
											{ label: __( 'Flip up', 'madeit' ), value: 'flip-up' },
											{ label: __( 'Flip down', 'madeit' ), value: 'flip-down' },
											{ label: __( 'Flip left', 'madeit' ), value: 'flip-left' },
											{ label: __( 'Flip right', 'madeit' ), value: 'flip-right' },

											// Slide animations
											{ label: __( 'Slide up', 'madeit' ), value: 'slide-up' },
											{ label: __( 'Slide down', 'madeit' ), value: 'slide-down' },
											{ label: __( 'Slide left', 'madeit' ), value: 'slide-left' },
											{ label: __( 'Slide right', 'madeit' ), value: 'slide-right' },

											// Zoom animations
											{ label: __( 'Zoom in', 'madeit' ), value: 'zoom-in' },
											{ label: __( 'Zoom in up', 'madeit' ), value: 'zoom-in-up' },
											{ label: __( 'Zoom in down', 'madeit' ), value: 'zoom-in-down' },
											{ label: __( 'Zoom in left', 'madeit' ), value: 'zoom-in-left' },
											{ label: __( 'Zoom in right', 'madeit' ), value: 'zoom-in-right' },
											{ label: __( 'Zoom out', 'madeit' ), value: 'zoom-out' },
											{ label: __( 'Zoom out up', 'madeit' ), value: 'zoom-out-up' },
											{ label: __( 'Zoom out down', 'madeit' ), value: 'zoom-out-down' },
											{ label: __( 'Zoom out left', 'madeit' ), value: 'zoom-out-left' },
											{ label: __( 'Zoom out right', 'madeit' ), value: 'zoom-out-right' },
										] }
										onChange={ ( value ) => setAttributes( { aosFade: value || '' } ) }
									/>

									{/* If option is selected, show additional settings */}
									{ aosFade && (
										<>
											<SelectControl
												label={ __( 'Animatie vertraging (ms)', 'madeit' ) }
												value={ aosDelay || '' }
												options={ [
													{ label: __( 'Geen', 'madeit' ), value: '' },
													{ label: __( '100ms', 'madeit' ), value: '100' },
													{ label: __( '200ms', 'madeit' ), value: '200' },
													{ label: __( '300ms', 'madeit' ), value: '300' },
													{ label: __( '400ms', 'madeit' ), value: '400' },
													{ label: __( '500ms', 'madeit' ), value: '500' },
													{ label: __( '600ms', 'madeit' ), value: '600' },
													{ label: __( '700ms', 'madeit' ), value: '700' },
													{ label: __( '800ms', 'madeit' ), value: '800' },
													{ label: __( '900ms', 'madeit' ), value: '900' },
													{ label: __( '1000ms', 'madeit' ), value: '1000' },
													{ label: __( 'Eigen invoer', 'madeit' ), value: 'custom' },
												] }
												onChange={ ( value ) => setAttributes( { aosDelay: value || '' } ) }
											/>

											{ aosDelay === 'custom' && (
												<TextControl
													label={ __( 'Eigen animatie vertraging (ms)', 'madeit' ) }
													value={ aosDelayCustom || '' }
													onChange={ ( value ) => setAttributes( { aosDelayCustom: value || '' } ) }
												/>
											) }

										</>
									) }
								</PanelBody>
							</>
							)}

						</div>
					) }
				</TabPanel>


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


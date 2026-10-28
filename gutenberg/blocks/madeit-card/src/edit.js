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

import {
	PanelBody,
	ToggleControl,
	TabPanel,
	SelectControl,
	RangeControl,
	TextControl,
	ColorPalette,
	Button,
	ToolbarGroup,
	ToolbarDropdownMenu,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { withSelect, useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { ControlHeader, UnitSelect, getTabIcon, ResponsiveVisibilityPanel } from '../../../shared';
import {
	CARD_STYLE_KEYS,
	CARD_STYLE_STORAGE_KEY,
	getCardStyleVars,
	hasShadow,
	normalizeBorderWidth,
	normalizeRadius,
	normalizeShadow,
} from './utils';

const AOS_DELAY_PRESETS = [ '', '100', '200', '300', '400', '500' ];

const readCardStyleClipboard = () => {
	try {
		const raw = window.localStorage.getItem( CARD_STYLE_STORAGE_KEY );
		const parsed = raw ? JSON.parse( raw ) : null;
		return parsed && typeof parsed === 'object' ? parsed : null;
	} catch ( e ) {
		return null;
	}
};

const FlexStartIcon = () => (
	<svg  version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-start</title><path d="M8 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM15.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888z"></path></svg>
);
const FlexCenterIcon = () => (
	<svg  version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-center</title><path d="M16 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
);
const FlexEndIcon = () => (
	<svg  version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-end</title><path d="M24 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM18.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
);
const FlexStretchIcon = () => (
	<svg  version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>shrink</title><path d="M16 0c0.736 0 1.344 0.608 1.344 1.344v29.312c0 0.736-0.608 1.344-1.344 1.344s-1.344-0.608-1.344-1.344v-29.312c0-0.736 0.608-1.344 1.344-1.344zM26.368 8.672c0.256 0.032 0.48 0.16 0.704 0.384 0.16 0.224 0.256 0.48 0.256 0.8v3.488h2.816c1.024 0 1.856 0.832 1.856 1.856v1.6c0 1.024-0.832 1.856-1.856 1.856h-2.816v3.616c-0.032 0.32-0.16 0.608-0.384 0.8-0.224 0.16-0.448 0.256-0.704 0.256-0.256-0.032-0.48-0.16-0.704-0.384l-5.216-6.080-0.128-0.16c-0.16-0.224-0.224-0.48-0.192-0.8s0.128-0.576 0.32-0.768l5.344-6.208c0.192-0.192 0.416-0.288 0.704-0.256zM5.632 8.672c0.224-0.032 0.448 0.032 0.608 0.16l0.128 0.096 5.344 6.176c0.16 0.224 0.288 0.48 0.288 0.8 0.032 0.256 0 0.448-0.096 0.64l-0.064 0.16-0.128 0.16-5.248 6.080c-0.192 0.224-0.416 0.352-0.704 0.384-0.224 0-0.48-0.096-0.704-0.256-0.16-0.16-0.288-0.352-0.352-0.608l-0.032-0.192v-3.616h-2.816c-1.024 0-1.856-0.832-1.856-1.856v-1.6c0-1.024 0.832-1.856 1.856-1.856h2.816v-3.488c0-0.256 0.064-0.48 0.16-0.672l0.096-0.128c0.192-0.224 0.448-0.352 0.704-0.384z"></path></svg>
);

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
		context,
	} = props;

	const {
		level = 2,
		cardTitle,
		hasTitle = false,
		contentPadding,
		mediaBleed = false,
		url,
		opensInNewTab,
		linkTarget,
		linkToPost = false,
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
		aosFade = '',
		aosDelay = '',
		aosDelayCustom = '',
		minHeight = 0,
		minHeightUnit = 'px',
		alignItems = 'stretch',
		borderHoverType = 'none',
		borderType = 'none',
		borderWidth = {},
		borderWidthUnit = 'px',
		borderColor = 'transparent',
		borderHoverWidth = {},
		borderHoverWidthUnit = 'px',
		borderHoverColor = 'transparent',
		borderRadius = {},
		borderRadiusUnit = 'px',
		boxShadow = {},
		boxShadowHover = {},
	} = attributes;

	const TagName = 'h' + level;
	const cardUrl = typeof url === 'object' && url !== null ? url.url : url;
	const isNewTab = opensInNewTab !== undefined ? opensInNewTab : (linkTarget === '_blank' || (typeof url === 'object' && url !== null && url.opensInNewTab));
	const paddingUnit = attributes?.paddingUnit || 'px';
	const currentPadding = contentPadding && Object.keys(contentPadding).length
		? contentPadding
		: {
			top: '20px',
			right: '20px',
			bottom: '20px',
			left: '20px',
		};
	const safeBorderWidth = normalizeBorderWidth(borderWidth);
	const safeHoverBorderWidth = normalizeBorderWidth(borderHoverWidth);
	const safeRadius = normalizeRadius(borderRadius);
	const safeShadow = normalizeShadow(boxShadow);
	const hasHoverBorder = borderHoverType && borderHoverType !== 'none';
	const hasHoverShadow = hasShadow(boxShadowHover);
	// Without its own hover shadow the hover controls start from the default shadow (that is also what is shown on hover).
	const safeShadowHover = normalizeShadow(hasHoverShadow ? boxShadowHover : boxShadow);
	const aosDelaySelectValue = aosDelay === 'custom' || AOS_DELAY_PRESETS.includes(aosDelay) ? aosDelay : 'custom';
	const aosDelayCustomValue = aosDelaySelectValue === 'custom' && !aosDelayCustom && aosDelay !== 'custom' ? aosDelay : aosDelayCustom;

	const [ borderTab, setBorderTab ] = useState('default');
	const [ shadowTab, setShadowTab ] = useState('default');

	const { createSuccessNotice, createWarningNotice } = useDispatch('core/notices');

	const postId = context?.postId;
	const postType = context?.postType;
	const postTitle = useSelect(
		(select) => {
			if (!linkToPost || !postId || !postType) {
				return undefined;
			}
			const record = select('core').getEntityRecord('postType', postType, postId);
			return record?.title?.rendered || record?.title?.raw;
		},
		[ linkToPost, postId, postType ]
	);

	const copyCardStyle = () => {
		const data = {};
		CARD_STYLE_KEYS.forEach((key) => {
			if (attributes[ key ] !== undefined) {
				data[ key ] = attributes[ key ];
			}
		});

		try {
			window.localStorage.setItem(CARD_STYLE_STORAGE_KEY, JSON.stringify(data));
			createSuccessNotice(__('Card-stijl gekopieerd.', 'madeit'), { type: 'snackbar' });
		} catch (e) {
			createWarningNotice(__('Card-stijl kon niet gekopieerd worden.', 'madeit'), { type: 'snackbar' });
		}
	};

	const pasteCardStyle = () => {
		const data = readCardStyleClipboard();
		if (!data) {
			createWarningNotice(__('Er is nog geen card-stijl gekopieerd.', 'madeit'), { type: 'snackbar' });
			return;
		}

		// Keys missing in the copied data are reset, so the card looks exactly like the copied one.
		const next = {};
		CARD_STYLE_KEYS.forEach((key) => {
			next[ key ] = data[ key ];
		});
		setAttributes(next);
		createSuccessNotice(__('Card-stijl geplakt.', 'madeit'), { type: 'snackbar' });
	};

	const renderShadowControls = (shadow, attributeKey, colorLabel) => {
		const update = (changes) => setAttributes({ [ attributeKey ]: { ...shadow, ...changes } });

		return (
			<div style={ { display: 'grid', gap: '8px' } }>
				<PanelColorSettings
					colorSettings={ [
						{ value: shadow.color || '', onChange: (color) => update({ color }), label: colorLabel, enableAlpha: true },
					] }
				/>
				<div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } }>
					<RangeControl
						__next40pxDefaultSize
						label={ __('Horizontaal', 'madeit') }
						value={ shadow.x }
						min={ -100 }
						max={ 100 }
						onChange={ (value) => update({ x: value ?? 0 }) }
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __('Verticaal', 'madeit') }
						value={ shadow.y }
						min={ -100 }
						max={ 100 }
						onChange={ (value) => update({ y: value ?? 0 }) }
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __('Blur', 'madeit') }
						value={ shadow.blur }
						min={ 0 }
						max={ 100 }
						onChange={ (value) => update({ blur: value ?? 0 }) }
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __('Spread', 'madeit') }
						value={ shadow.spread }
						min={ -50 }
						max={ 50 }
						onChange={ (value) => update({ spread: value ?? 0 }) }
					/>
				</div>
				<SelectControl
					__next40pxDefaultSize
					label={ __('Position', 'madeit') }
					value={ shadow.inset ? 'inset' : 'outset' }
					onChange={ (value) => update({ inset: value === 'inset' }) }
					options={ [
						{ label: __('Outset', 'madeit'), value: 'outset' },
						{ label: __('Inset', 'madeit'), value: 'inset' },
					] }
				/>
			</div>
		);
	};

	const fallbackTextColor = '#FFFFFF';
	const fallbackBackgroundColor = '#000000';

	const wrapperClasses = classnames(className, {
		'has-media-bleed': mediaBleed,
	});

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: {
			backgroundColor: backgroundColor?.color || undefined,
			color: textColor?.color || undefined,
			...getCardStyleVars(attributes),
		},
	});

	return (
		<div {...blockProps}>
			<InspectorControls>
				<TabPanel
					className="madeit-inspector-tabs"
					tabs={ [
						{ name: 'settings', title: __( 'Algemeen' ), icon: <span dangerouslySetInnerHTML={{ __html: getTabIcon( 'settings' ) }} /> },
						{ name: 'styles', title: __( 'Stijl' ), icon: <span dangerouslySetInnerHTML={{ __html: getTabIcon( 'styles' ) }} /> },
						{ name: 'advanced', title: __( 'Advanced' ), icon: <span dangerouslySetInnerHTML={{ __html: getTabIcon( 'advanced' ) }} /> },
					] }
				>
					{ ( tab ) => (
						<div className={ `madeit-inspector-tab-content madeit-inspector-tab-content-${ tab.name }` }>
							{ tab.name === 'settings' && (
								<>
									<PanelBody title={ __( 'Title' ) }>
										<ToggleControl
											label={ __( 'Has title' ) }
											checked={ !!hasTitle }
											onChange={ ( state ) => setAttributes( { hasTitle: state } ) }
										/>
									</PanelBody>

									<PanelBody title="Spatie" initialOpen={true}>
										<div className="madeit-control">
											<ControlHeader title={ __( 'Min hoogte' ) } 
												afterBreakpoint={
													<UnitSelect
														value={ minHeightUnit }
                                                        units={ [ 'px', '%', 'em', 'rem' ] }
                                                        onChange={ ( unit ) => {
															setAttributes( { minHeightUnit: unit } );
														} }
													/>
												} 
											/>
											<div style={ { display: 'flex', gap: '8px', alignItems: 'center' } }>
												<RangeControl
													__next40pxDefaultSize
													label=""
													value={ minHeight || 0 }
													onChange={ ( value ) => setAttributes( { minHeight: value } ) }
													min={ 0 }
													max={ minHeightUnit === 'vh' ? 100 : 1000 }
												/>
											</div>
										</div>

										<div className="madeit-control">
											<ControlHeader title={ __( 'Align items' ) } />
											
												<ToggleGroupControl 
													__next40pxDefaultSize
													className="madeit-control-buttonGroup"
													value={ alignItems }
													onChange={ ( value ) =>
														setAttributes( { alignItems: value } )
													}
												>
													
																							
												<ToggleGroupControlOption value="flex-start" label={ < FlexStartIcon /> } />
												<ToggleGroupControlOption value="center" label={ < FlexCenterIcon /> } />
												<ToggleGroupControlOption value="flex-end" label={ < FlexEndIcon /> } />
												<ToggleGroupControlOption value="stretch" label={ < FlexStretchIcon /> } />
											</ToggleGroupControl>
										</div>
									</PanelBody>
								</>
							)}

							{ tab.name === 'styles' && (
								<>
									<PanelColorSettings
										title={ __( 'Color Settings' ) }
										initialOpen={ false }
										colorSettings={ [
											{ value: backgroundColor?.color, onChange: ( value ) => setBackgroundColor( value ), label: __( 'Background Color' ), enableAlpha: true },
											{ value: textColor?.color, onChange: ( value ) => setTextColor( value ), label: __( 'Text Color' ), enableAlpha: true },
										] }
									>
										<ContrastChecker
											{ ...{
												textColor: textColor?.color,
												backgroundColor: backgroundColor?.color,
												fallbackTextColor,
												fallbackBackgroundColor,
											} }
										/>
									</PanelColorSettings>

									<PanelBody title={ __( 'Spatie' ) }>
										<div className="madeit-control" style={ { display: 'flex', flexWrap: 'wrap', gap: '6px' } }>
											<ControlHeader
												title={ __( 'Inhoud Padding', 'madeit' ) }
												afterBreakpoint={
													<UnitSelect
														style={ { marginLeft: 'auto' } }
														value={ paddingUnit || 'px' }
														units={ [  'px', '%', 'em', 'rem' ] }
														onChange={ ( unit ) => {
															const nextPadding = {};
															[ 'top', 'right', 'bottom', 'left' ].forEach( ( key ) => {
																const raw = currentPadding?.[ key ];
																if ( ! raw ) return;
																const numeric = parseFloat( raw );
																if ( ! Number.isFinite( numeric ) ) return;
																nextPadding[ key ] = `${ numeric }${ unit }`;
															} );
															setAttributes( { contentPadding: nextPadding, paddingUnit: unit, madeitHasUserEdits: true } );
														} }
													/>
												}
											/>

											<div className="madeit-controls" style={ { display: 'flex', alignItems: 'flex-start', maxWidth: 'calc(100% - 35px)', width: '100%' } }>
												{ [
													{ label: 'Bovenaan', key: 'top' },
													{ label: 'Rechts', key: 'right' },
													{ label: 'Onderaan', key: 'bottom' },
													{ label: 'Links', key: 'left' },
												].map( ( item ) => {
													const rawValue = currentPadding?.[ item.key ];
													const numericValue = parseFloat( rawValue );
													const displayValue = Number.isFinite( numericValue ) ? numericValue : '';
													return (
														<div key={ item.key } className="control-item" style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 } }>
															<input
																type="number"
																value={ displayValue !== '' ? displayValue : 20 }
																min={ -9999 }
																onChange={ ( e ) => {
																	const val = e.target.value;
																	setAttributes( {
																		contentPadding: {
																			...currentPadding,
																			[ item.key ]: val === '' ? '20px' : `${ val }${ paddingUnit }`,
																		},
																		madeitHasUserEdits: true,
																	} );
																} }
																style={ { width: '100%', height: '27px', minHeight: '27px', fontSize: '.85em', textAlign: 'center', padding: '0' } }
															/>
															<span style={ { fontSize: '9px', marginTop: '4px' } }>{ __( item.label, 'madeit' ) }</span>
														</div>
													);
												} ) }
											</div>
										</div>

										<ToggleControl
											label={ __( 'Afbeelding tot rand' ) }
											help={ __( 'Laat Image/Cover blocks de padding negeren zodat ze tegen de rand staan.' ) }
											checked={ !!mediaBleed }
											onChange={ ( state ) => setAttributes( { mediaBleed: state } ) }
										/>
									</PanelBody>

									<PanelBody title={ __( 'Border' ) }>
										<ToggleGroupControl 
												__next40pxDefaultSize
												className="madeit-control-buttonGroup"
												value={ borderTab }
												onChange={ ( value ) =>
													setBorderTab( value )
												}
											>
																
											<ToggleGroupControlOption value="default" label="Default" />
											<ToggleGroupControlOption value="hover" label="Hover" />
										</ToggleGroupControl>

										{ borderTab === 'default' && (
											// Border type
											<>
											<div className="madeit-control">
												<SelectControl
													__next40pxDefaultSize
													label={ __( 'Border type' ) }
													value={ borderType || 'none' }
													options={ [
														{ value: 'none', label: 'None'  },
														{ value: 'solid', label: 'Solid'  },
														{ value: 'dashed', label: 'Dashed'  },
														{ value: 'dotted', label: 'Dotted'  },
														{ value: 'double', label:'Double'  },
													] }
													onChange={ ( newBorderType ) => setAttributes( { borderType: newBorderType } ) }
												/>
											</div>

											{ borderType !== 'none' && (
												<>
												<div className="madeit-control">
													<ControlHeader title={ __( 'Border width', 'madeit' ) } 
														afterBreakpoint={
															<UnitSelect
																value={ borderWidthUnit }
																units={ [ 'px', '%', 'em', 'rem' ] }
																onChange={ ( unit ) => {
																	setAttributes( { borderWidthUnit: unit } );
																} }
															/>
														} 
													/>

													<div className="madeit-controls" style={ { display: 'flex', alignItems: 'flex-start', width: '100%' } }>
														{ [
															{ label: 'Bovenaan', key: 'top' },
															{ label: 'Rechts', key: 'right' },
															{ label: 'Onderaan', key: 'bottom' },
															{ label: 'Links', key: 'left' },
														].map( ( item ) => {
															const rawValue = safeBorderWidth?.[ item.key ] || '0px';
															const numericValue = parseFloat( rawValue );
															const displayValue = Number.isFinite( numericValue ) ? numericValue : 0;
															return (
																<div key={ item.key } style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 } } className="control-item">
																	<input
																		type="number"
																		value={ displayValue }
																		min={ 0 }
																		onChange={ ( e ) => {
																			const val = e.target.value;
																			const next = { ...safeBorderWidth, [ item.key ]: val === '' ? '0px' : `${ val }${ borderWidthUnit || 'px' }` };
																			setAttributes( { borderWidth: next } );
																		} }
																		style={ { width: '100%', height: '27px', minHeight: '27px', fontSize: '.85em', textAlign: 'center' } }
																	/>
																	<span style={ { fontSize: '9px', marginTop: '4px' } }>{ __( item.label, 'madeit' ) }</span>
																</div>
															);
														} ) }
													</div>
												</div>

												<div className="madeit-control">
													<ControlHeader title={ __( 'Border color', 'madeit' ) } />
													<PanelColorSettings
														colorSettings={ [
															{ value: borderColor || '', onChange: ( color ) => setAttributes( { borderColor: color } ), label: __( 'Border Color', 'madeit' ), enableAlpha: true },
														] }
													>
														{/* value={ borderColor || '' }
														onChange={ ( color ) => setAttributes( { borderColor: color } ) }
														enableAlpha={ true } */}
													</PanelColorSettings>
												</div>
												</>
											) }

										</>
										) }

										{ borderTab === 'hover' && (
											<>
											<p style={ { fontSize: '12px', color: '#757575', margin: '8px 0' } }>
												{ hasHoverBorder
													? __( 'Deze border wordt getoond wanneer je over de card hovert.', 'madeit' )
													: __( 'Geen hover border ingesteld: bij hover blijft de gewone border zichtbaar.', 'madeit' ) }
											</p>
											<div className="madeit-control">
												<SelectControl
													label={ __( 'Border type' ) }
													value={ borderHoverType || 'none' }
													onChange={ ( value ) => setAttributes( { borderHoverType: value } ) }
													options={ [
														{ value: 'none', label: 'None'  },
														{ value: 'solid', label: 'Solid'  },
														{ value: 'dashed', label: 'Dashed'  },
														{ value: 'dotted', label: 'Dotted'  },
														{ value: 'double', label: 'Double'  },
													] }
												/>
											</div>

											{ hasHoverBorder && (
												<>
												<div className="madeit-control">
													<ControlHeader title={ __( 'Border width', 'madeit' ) } 
														afterBreakpoint={
															<UnitSelect
																value={ borderHoverWidthUnit }
																units={ [ 'px', '%', 'em', 'rem' ] }
																onChange={ ( unit ) => {
																	setAttributes( { borderHoverWidthUnit: unit } );
																} }
															/>
														} 
													/>

													<div className="madeit-controls" style={ { display: 'flex', alignItems: 'flex-start', width: '100%' } }>
														{ [
															{ label: 'Bovenaan', key: 'top' },
															{ label: 'Rechts', key: 'right' },
															{ label: 'Onderaan', key: 'bottom' },
															{ label: 'Links', key: 'left' },
														].map( ( item ) => {
															const rawValue = safeHoverBorderWidth?.[ item.key ] || '0px';
															const numericValue = parseFloat( rawValue );
															const displayValue = Number.isFinite( numericValue ) ? numericValue : 0;
															return (
																<div key={ item.key } style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 } } className="control-item">
																	<input
																		type="number"
																		value={ displayValue }
																		min={ 0 }
																		onChange={ ( e ) => {
																			const val = e.target.value;
																			const next = { ...safeHoverBorderWidth, [ item.key ]: val === '' ? '0px' : `${ val }${ borderHoverWidthUnit || 'px' }` };
																			setAttributes( { borderHoverWidth: next } );
																		} }
																		style={ { width: '100%', height: '27px', minHeight: '27px', fontSize: '.85em', textAlign: 'center' } }
																	/>
																	<span style={ { fontSize: '9px', marginTop: '4px' } }>{ __( item.label, 'madeit' ) }</span>
																</div>
															);
														} ) }
													</div>
												</div>

												<div className="madeit-control">
													<ControlHeader title={ __( 'Border color', 'madeit' ) } />

													<PanelColorSettings
														colorSettings={ [
															{ value: borderHoverColor || '', onChange: ( color ) => setAttributes( { borderHoverColor: color } ), label: __( 'Border Hover Color', 'madeit' ), enableAlpha: true },
														] }
													>
														{/* value={ borderColor || '' }
														onChange={ ( color ) => setAttributes( { borderColor: color } ) }
														enableAlpha={ true } */}
													</PanelColorSettings>
												</div>
												</>
											) }
											</>
										) }

										<div className='madeit-control' style={ { display: 'flex', flexWrap: 'wrap', gap: '6px' } }>
											<ControlHeader title={ __( 'Border radius', 'madeit' ) } />
											<div className="madeit-controls" style={ { display: 'flex', alignItems: 'flex-start', width: '100%' } }>
												{ [
													{ label: 'Bovenaan', key: 'top' },
													{ label: 'Rechts', key: 'right' },
													{ label: 'Onderaan', key: 'bottom' },
													{ label: 'Links', key: 'left' },
												].map( ( item ) => {
													const rawValue = safeRadius?.[ item.key ] || '0px';
													const numericValue = parseFloat( rawValue );
													const displayValue = Number.isFinite( numericValue ) ? numericValue : 0;
													return (
														<div key={ item.key } style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 } } className="control-item">
															<input
																type="number"
																value={ displayValue }
																min={ 0 }
																onChange={ ( e ) => {
																	const val = e.target.value;
																	const next = { ...safeRadius, [ item.key ]: val === '' ? '0px' : `${ val }${ borderRadiusUnit || 'px' }` };
																	setAttributes( { borderRadius: next } );
																} }
																style={ { width: '100%', height: '27px', minHeight: '27px', fontSize: '.85em', textAlign: 'center' } }
															/>
															<span style={ { fontSize: '9px', marginTop: '4px' } }>{ __( item.label, 'madeit' ) }</span>
														</div>
													);
												} ) }
											</div>
										</div>

										<ToggleGroupControl 
												__next40pxDefaultSize
												className="madeit-control-buttonGroup"
												value={ shadowTab }
												onChange={ ( value ) =>
													setShadowTab( value )
												}
											>
																
											<ToggleGroupControlOption value="default" label="Default" />
											<ToggleGroupControlOption value="hover" label="Hover" />
										</ToggleGroupControl>

										{ shadowTab === 'hover' && (
											<div className="madeit-control">
												<ControlHeader title={ __( 'Box shadow hover', 'madeit' ) } />
												<p style={ { fontSize: '12px', fontStyle: 'normal', color: '#757575', margin: '0 0 8px' } }>
													{ hasHoverShadow
														? __( 'Deze schaduw wordt getoond wanneer je over de card hovert.', 'madeit' )
														: __( 'Geen hover schaduw ingesteld: bij hover blijft de gewone schaduw zichtbaar.', 'madeit' ) }
												</p>
												{ renderShadowControls( safeShadowHover, 'boxShadowHover', __( 'Shadow Hover Color', 'madeit' ) ) }
												{ hasHoverShadow && (
													<Button
														variant="secondary"
														isDestructive
														size="small"
														style={ { marginTop: '8px' } }
														onClick={ () => setAttributes( { boxShadowHover: {} } ) }
													>
														{ __( 'Hover schaduw verwijderen', 'madeit' ) }
													</Button>
												) }
											</div>
										) }

										{ shadowTab === 'default' && (
											<div className="madeit-control">
												<ControlHeader title={ __( 'Box shadow', 'madeit' ) } />
												{ renderShadowControls( safeShadow, 'boxShadow', __( 'Shadow Color', 'madeit' ) ) }
												{ hasShadow( boxShadow ) && (
													<Button
														variant="secondary"
														isDestructive
														size="small"
														style={ { marginTop: '8px' } }
														onClick={ () => setAttributes( { boxShadow: {} } ) }
													>
														{ __( 'Schaduw verwijderen', 'madeit' ) }
													</Button>
												) }
											</div>
										) }
									</PanelBody>
								</>
							)}

							{ tab.name === 'advanced' && (
								<>
									<PanelBody title={ __( 'Geavanceerd' ) }>
										<ControlHeader title={ __( 'Card linken', 'madeit' ) } />
										<div className="madeit-control">
											<ToggleControl
												label={ __( 'Link naar huidig bericht', 'madeit' ) }
												help={ __( 'Handig in een Query Loop: elke card linkt automatisch naar zijn eigen bericht/pagina.', 'madeit' ) }
												checked={ !!linkToPost }
												onChange={ ( state ) => setAttributes( { linkToPost: state } ) }
											/>
										</div>

										{ linkToPost ? (
											<div className="madeit-control">
												<p style={ { fontSize: '12px', color: '#757575', margin: '0 0 8px' } }>
													{ postTitle
														? __( 'Linkt naar:', 'madeit' ) + ' ' + postTitle.replace( /<[^>]*>/g, '' )
														: __( 'De link wordt op de website ingevuld met de URL van het bericht waarin de card staat.', 'madeit' ) }
												</p>
												<ToggleControl
													label={ __( 'Openen in nieuw tabblad', 'madeit' ) }
													checked={ !!isNewTab }
													onChange={ ( state ) => setAttributes( { opensInNewTab: state, linkTarget: state ? '_blank' : undefined } ) }
												/>
											</div>
										) : (
											<div className="madeit-control">
												<LinkControl
													style={ { maxWidth: '100%' } }
													value={ cardUrl ? { url: cardUrl, opensInNewTab: !!isNewTab } : undefined }
													onChange={ ( nextValue ) => {
														if ( ! nextValue || ! nextValue.url ) {
															setAttributes( { url: undefined, opensInNewTab: false, linkTarget: undefined } );
														} else {
															const newOpensInNewTab = !!nextValue.opensInNewTab;
															setAttributes( {
																url: nextValue.url,
																opensInNewTab: newOpensInNewTab,
																linkTarget: newOpensInNewTab ? '_blank' : undefined,
															} );
														}
													} }
												/>
											</div>
										) }

										<ResponsiveVisibilityPanel
											title="Responsive"
											initialOpen={ true }
											hideOnDesktop={ hideOnDesktop }
											hideOnTablet={ hideOnTablet }
											hideOnMobile={ hideOnMobile }
											setAttributes={ setAttributes }
										/>
									</PanelBody>

									<PanelBody title="Binnenkomende animatie" initialOpen={ false }>
										<SelectControl
											__next40pxDefaultSize
											label={ __( 'Animatie', 'madeit' ) }
											value={ aosFade || '' }
											options={ [
												{ label: __( 'Geen', 'madeit' ), value: '' },
												{ label: __( 'Fade', 'madeit' ), value: 'fade' },
												{ label: __( 'Fade up', 'madeit' ), value: 'fade-up' },
												{ label: __( 'Fade down', 'madeit' ), value: 'fade-down' },
												{ label: __( 'Fade left', 'madeit' ), value: 'fade-left' },
												{ label: __( 'Fade right', 'madeit' ), value: 'fade-right' },
											] }
											onChange={ ( value ) => setAttributes( { aosFade: value || '' } ) }
										/>

										{ aosFade && (
											<>
												<SelectControl
													__next40pxDefaultSize
													label={ __( 'Animatie vertraging (ms)', 'madeit' ) }
													value={ aosDelaySelectValue }
													options={ [
														{ label: __( 'Geen', 'madeit' ), value: '' },
														{ label: __( '100ms', 'madeit' ), value: '100' },
														{ label: __( '200ms', 'madeit' ), value: '200' },
														{ label: __( '300ms', 'madeit' ), value: '300' },
														{ label: __( '400ms', 'madeit' ), value: '400' },
														{ label: __( '500ms', 'madeit' ), value: '500' },
														{ label: __( 'Eigen invoer', 'madeit' ), value: 'custom' },
													] }
													onChange={ ( value ) => {
														if ( value === 'custom' ) {
															setAttributes( { aosDelay: 'custom', aosDelayCustom: aosDelayCustomValue || '' } );
														} else {
															setAttributes( { aosDelay: value || '', aosDelayCustom: '' } );
														}
													} }
												/>

												{ aosDelaySelectValue === 'custom' && (
													<TextControl
														__next40pxDefaultSize
														type="number"
														min={ 0 }
														label={ __( 'Eigen animatie vertraging (ms)', 'madeit' ) }
														value={ aosDelayCustomValue || '' }
														onChange={ ( value ) => setAttributes( { aosDelay: 'custom', aosDelayCustom: value || '' } ) }
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

			<BlockControls group="other">
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon="admin-appearance"
						label={ __( 'Card-stijl', 'madeit' ) }
						controls={ [
							{
								title: __( 'Kopieer card-stijl', 'madeit' ),
								icon: 'admin-page',
								onClick: copyCardStyle,
							},
							{
								title: __( 'Plak card-stijl', 'madeit' ),
								icon: 'clipboard',
								onClick: pasteCardStyle,
							},
						] }
					/>
				</ToolbarGroup>
			</BlockControls>

			{ hasTitle && (
				<BlockControls group="block">
					<HeadingLevelDropdown
						selectedLevel={ level }
						onChange={ ( newLevel ) => setAttributes( { level: newLevel } ) }
					/>
				</BlockControls>
			) }

			{ hasTitle && (
				<div className="card-header">
					<RichText
						identifier="cardTitle"
						tagName={ TagName }
						value={ cardTitle }
						onChange={ ( value ) => setAttributes( { cardTitle: value } ) }
						aria-label={ __( 'Heading text' ) }
						placeholder={ __( 'Heading' ) }
					/>
				</div>
			) }

			<div className="card-body">
				<InnerBlocks
					templateLock={ false }
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
	withColors( 'backgroundColor', 'textColor' ),
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const { getBlockOrder } = select( 'core/block-editor' );

		return {
			hasChildBlocks: getBlockOrder( clientId ).length > 0,
		};
	} )
)( CardEdit );

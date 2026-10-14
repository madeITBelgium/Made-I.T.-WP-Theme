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
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { ControlHeader, UnitSelect, getTabIcon, ResponsiveVisibilityPanel } from '../../../shared';

const paddingToVars = (padding) => {
	if (!padding || typeof padding !== 'object') {
		return {};
	}

	const vars = {};
	if (padding.top !== undefined) vars['--madeit-card-content-padding-top'] = padding.top;
	if (padding.right !== undefined) vars['--madeit-card-content-padding-right'] = padding.right;
	if (padding.bottom !== undefined) vars['--madeit-card-content-padding-bottom'] = padding.bottom;
	if (padding.left !== undefined) vars['--madeit-card-content-padding-left'] = padding.left;

	return vars;
};

const normalizeRadius = (value) => {
	if (!value || typeof value !== 'object') {
		return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
	}

	return {
		top: value.top ?? '0px',
		right: value.right ?? '0px',
		bottom: value.bottom ?? '0px',
		left: value.left ?? '0px',
	};
};

const borderRadiusToCss = (value) => {
	const safe = normalizeRadius(value);
	return `${ safe.top } ${ safe.right } ${ safe.bottom } ${ safe.left }`;
};

const normalizeBorderWidth = (value) => {
	if (!value || typeof value !== 'object') {
		return { top: '1px', right: '1px', bottom: '1px', left: '1px' };
	}

	return {
		top: value.top ?? '1px',
		right: value.right ?? '1px',
		bottom: value.bottom ?? '1px',
		left: value.left ?? '1px',
	};
};

const borderWidthToCss = (value) => {
	const safe = normalizeBorderWidth(value);
	return `${ safe.top } ${ safe.right } ${ safe.bottom } ${ safe.left }`;
};

const normalizeShadow = (value) => {
	if (!value || typeof value !== 'object') {
		return { x: '0px', y: '0px', blur: '0px', spread: '0px', color: '#000000', inset: false };
	}

	return {
		x: value.x ?? value.horizontal ?? '0px',
		y: value.y ?? value.vertical ?? '0px',
		blur: value.blur ?? '0px',
		spread: value.spread ?? '0px',
		color: value.color || '#000000',
		inset: !!value.inset,
	};
};

const shadowToCss = (value) => {
	const safe = normalizeShadow(value);
	const prefix = safe.inset ? 'inset ' : '';
	return `${ prefix }${ safe.x }px ${ safe.y }px ${ safe.blur }px ${ safe.spread }px ${ safe.color }`;
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
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
		aosFade = '',
		aosDelay = '',
		aosDelayCustom = '',
		minHeight = 0,
		minHeightUnit = 'px',
		alignItems = 'stretch',
		borderHover = 'default',
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
		shadowHover = 'default',
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
	const safeShadowHover = normalizeShadow(boxShadowHover);
	const hasDefaultBorder = borderType && borderType !== 'none';
	const hasHoverBorder = borderHover === 'hover' && borderHoverType && borderHoverType !== 'none';
	const hasDefaultShadow = shadowHover === 'default';
	const hasHoverShadow = shadowHover === 'hover' && !!boxShadowHover && typeof boxShadowHover === 'object';

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
			...paddingToVars(contentPadding),
			'--madeit-card-min-height': minHeight > 0 ? `${ minHeight }${ minHeightUnit }` : 'auto',
			'--madeit-card-align-items': alignItems || 'stretch',
			'--madeit-card-border-style': hasDefaultBorder ? borderType : 'none',
			'--madeit-card-border-width': hasDefaultBorder ? borderWidthToCss(safeBorderWidth) : '0px 0px 0px 0px',
			'--madeit-card-border-color': hasDefaultBorder ? (borderColor || 'transparent') : 'transparent',
			'--madeit-card-border-hover-style': hasHoverBorder ? borderHoverType : 'none',
			'--madeit-card-border-hover-width': hasHoverBorder ? borderWidthToCss(safeHoverBorderWidth) : '0px 0px 0px 0px',
			'--madeit-card-border-hover-color': hasHoverBorder ? (borderHoverColor || borderColor || 'transparent') : 'transparent',
			'--madeit-card-border-radius': borderRadiusToCss(safeRadius),
			'--madeit-card-box-shadow': hasDefaultShadow ? shadowToCss(safeShadow) : 'none',
			'--madeit-card-box-shadow-hover': hasHoverShadow ? shadowToCss(safeShadowHover) : 'none',
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
												value={ borderHover }
												onChange={ ( value ) =>
													setAttributes( { borderHover: value } )
												}
											>
																
											<ToggleGroupControlOption value="default" label="Default" />
											<ToggleGroupControlOption value="hover" label="Hover" />
										</ToggleGroupControl>

										{ borderHover == 'default' && (
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

										{ borderHover == 'hover' && (
											<>
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
												value={ shadowHover }
												onChange={ ( value ) =>
													setAttributes( { shadowHover: value } )
												}
											>
																
											<ToggleGroupControlOption value="default" label="Default" />
											<ToggleGroupControlOption value="hover" label="Hover" />
										</ToggleGroupControl>

										{ shadowHover === 'hover' && (
											<div className="madeit-control">
												<ControlHeader title={ __( ' Box shadow hover ' ) } />
												<div style={ { display: 'grid', gap: '8px' } }>

													<PanelColorSettings
														colorSettings={ [
																{ value: safeShadowHover.color || '', onChange: ( color ) => setAttributes( { boxShadowHover: { ...safeShadowHover, color: color } } ), label: __( 'Shadow Hover Color', 'madeit' ), enableAlpha: true },
														] }
													>
													</PanelColorSettings>
													<div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } }>
														<RangeControl
															__next40pxDefaultSize
															label={ __( 'Horizontaal', 'madeit' ) }
															value={ safeShadowHover.x }
															onChange={ ( value ) => setAttributes( { boxShadowHover: { ...safeShadowHover, x: value, horizontal: value } } ) }
														/>
														<RangeControl
															__next40pxDefaultSize
															label={ __( 'Verticaal', 'madeit' ) }
															value={ safeShadowHover.y }
															onChange={ ( value ) => setAttributes( { boxShadowHover: { ...safeShadowHover, y: value, vertical: value } } ) }
														/>
														<RangeControl
															__next40pxDefaultSize
															label={ __( 'Blur', 'madeit' ) }
															value={ safeShadowHover.blur }
															onChange={ ( value ) => setAttributes( { boxShadowHover: { ...safeShadowHover, blur: value } } ) }
														/>
														<RangeControl
															__next40pxDefaultSize
															label={ __( 'Spread', 'madeit' ) }
															value={ safeShadowHover.spread }
															onChange={ ( value ) => setAttributes( { boxShadowHover: { ...safeShadowHover, spread: value } } ) }
														/>
													</div>
													<SelectControl
														label={ __( 'Position', 'madeit' ) }
														value={ safeShadowHover.inset ? 'inset' : 'outset' }
														onChange={ ( value ) => setAttributes( { boxShadowHover: { ...safeShadowHover, inset: value === 'inset' } } ) }
														options={ [
															{ label: __( 'Outset', 'madeit' ), value: 'outset' },
															{ label: __( 'Inset', 'madeit' ), value: 'inset' },
														] }
													/>
												</div>
											</div>
										) }

										{ shadowHover === 'default' && (
										<div className="madeit-control">
											<ControlHeader title={ __( ' Box shadow ' ) } />
											<div style={ { display: 'grid', gap: '8px' } }>

												<PanelColorSettings
														colorSettings={ [
																{ value: safeShadow.color || '', onChange: ( color ) => setAttributes( { boxShadow: { ...safeShadow, color: color } } ), label: __( 'Shadow Color', 'madeit' ), enableAlpha: true },
														] }
													>
												</PanelColorSettings>
												<div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } }>
													<RangeControl
														__next40pxDefaultSize
														label={ __( 'Horizontaal', 'madeit' ) }
														value={ safeShadow.x }
														onChange={ ( value ) => setAttributes( { boxShadow: { ...safeShadow, x: value, horizontal: value } } ) }
													/>
													<RangeControl
														__next40pxDefaultSize
														label={ __( 'Verticaal', 'madeit' ) }
														value={ safeShadow.y }
														onChange={ ( value ) => setAttributes( { boxShadow: { ...safeShadow, y: value, vertical: value } } ) }
													/>
													<RangeControl
														__next40pxDefaultSize
														label={ __( 'Blur', 'madeit' ) }
														value={ safeShadow.blur }
														onChange={ ( value ) => setAttributes( { boxShadow: { ...safeShadow, blur: value } } ) }
													/>
													<RangeControl
														__next40pxDefaultSize
														label={ __( 'Spread', 'madeit' ) }
														value={ safeShadow.spread }
														onChange={ ( value ) => setAttributes( { boxShadow: { ...safeShadow, spread: value } } ) }
													/>
												</div>
												<SelectControl
													label={ __( 'Position', 'madeit' ) }
													value={ safeShadow.inset ? 'inset' : 'outset' }
													onChange={ ( value ) => setAttributes( { boxShadow: { ...safeShadow, inset: value === 'inset' } } ) }
													options={ [
														{ label: __( 'Outset', 'madeit' ), value: 'outset' },
														{ label: __( 'Inset', 'madeit' ), value: 'inset' },
													] }
												/>
											</div>
										</div>
										)}
									</PanelBody>
								</>
							)}

							{ tab.name === 'advanced' && (
								<>
									<PanelBody title={ __( 'Geavanceerd' ) }>
										<ControlHeader title={ __( 'Card linken', 'madeit' ) } />
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
													label={ __( 'Animatie vertraging (ms)', 'madeit' ) }
													value={ aosDelay || '' }
													options={ [
														{ label: __( 'Geen', 'madeit' ), value: '' },
														{ label: __( '100ms', 'madeit' ), value: '100' },
														{ label: __( '200ms', 'madeit' ), value: '200' },
														{ label: __( '300ms', 'madeit' ), value: '300' },
														{ label: __( '400ms', 'madeit' ), value: '400' },
														{ label: __( '500ms', 'madeit' ), value: '500' },
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

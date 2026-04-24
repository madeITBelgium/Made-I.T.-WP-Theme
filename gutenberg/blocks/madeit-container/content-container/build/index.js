/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../../shared/BreakpointSwitcher.js"
/*!*********************************************!*\
  !*** ../../../shared/BreakpointSwitcher.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BreakpointSwitcher)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);


function BreakpointSwitcher(props) {
  var active = props && props.active ? props.active : 'desktop';
  var onChange = props && props.onChange ? props.onChange : null;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ButtonGroup, {
    className: 'madeit-control-breakpoints'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    icon: 'desktop',
    isPressed: active === 'desktop',
    onClick: function () {
      if (onChange) onChange('desktop');
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    icon: 'tablet',
    isPressed: active === 'tablet',
    onClick: function () {
      if (onChange) onChange('tablet');
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    icon: 'smartphone',
    isPressed: active === 'mobile',
    onClick: function () {
      if (onChange) onChange('mobile');
    }
  }));
}

/***/ },

/***/ "../../../shared/ControlHeader.js"
/*!****************************************!*\
  !*** ../../../shared/ControlHeader.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ControlHeader)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BreakpointSwitcher */ "../../../shared/BreakpointSwitcher.js");




function ControlHeader(props) {
  var title = props && typeof props.title !== 'undefined' ? props.title : '';
  var breakpoint = props && props.breakpoint ? props.breakpoint : null;
  var onBreakpointChange = props && props.onBreakpointChange ? props.onBreakpointChange : null;
  var afterBreakpoint = props && props.afterBreakpoint ? props.afterBreakpoint : null;
  var onReset = props && props.onReset ? props.onReset : null;
  var resetLabel = props && props.resetLabel ? props.resetLabel : null;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'madeit-control-header'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'madeit-control-header__title'
  }, title), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'madeit-control-header__tools'
  }, breakpoint && onBreakpointChange ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_3__["default"], {
    active: breakpoint,
    onChange: onBreakpointChange
  }) : null, afterBreakpoint, onReset ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    className: 'madeit-control-header__reset',
    icon: 'undo',
    variant: 'tertiary',
    onClick: onReset,
    showTooltip: true,
    label: resetLabel || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reset')
  }) : null));
}

/***/ },

/***/ "../../../shared/ResponsiveBoxControl.js"
/*!***********************************************!*\
  !*** ../../../shared/ResponsiveBoxControl.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResponsiveBoxControl)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ControlHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ControlHeader */ "../../../shared/ControlHeader.js");




function ResponsiveBoxControl(props) {
  var title = props && typeof props.title !== 'undefined' ? props.title : '';
  var breakpoint = props && props.breakpoint ? props.breakpoint : 'desktop';
  var onBreakpointChange = props && props.onBreakpointChange ? props.onBreakpointChange : null;
  var values = props && typeof props.values !== 'undefined' ? props.values : undefined;
  var onChange = props && props.onChange ? props.onChange : null;
  var sides = props && props.sides ? props.sides : undefined;
  var inputProps = props && props.inputProps ? props.inputProps : undefined;
  var allowReset = props && typeof props.allowReset !== 'undefined' ? props.allowReset : true;
  var onReset = props && props.onReset ? props.onReset : null;
  var resetLabel = props && props.resetLabel ? props.resetLabel : null;
  var next40pxDefaultSize = props && props.__next40pxDefaultSize ? props.__next40pxDefaultSize : undefined;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'madeit-control'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_ControlHeader__WEBPACK_IMPORTED_MODULE_3__["default"], {
    title: title,
    breakpoint: breakpoint,
    onBreakpointChange: onBreakpointChange,
    onReset: onReset,
    resetLabel: resetLabel || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reset')
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalBoxControl, {
    __next40pxDefaultSize: next40pxDefaultSize,
    label: '',
    onChange: onChange,
    values: values,
    allowReset: allowReset,
    sides: sides,
    inputProps: inputProps
  }));
}

/***/ },

/***/ "../../../shared/ResponsiveVisibilityPanel.js"
/*!****************************************************!*\
  !*** ../../../shared/ResponsiveVisibilityPanel.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResponsiveVisibilityPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);



function ResponsiveVisibilityPanel(props) {
  var title = props && typeof props.title !== 'undefined' ? props.title : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Responsive');
  var initialOpen = props && typeof props.initialOpen === 'boolean' ? props.initialOpen : true;
  var hideOnDesktop = props && typeof props.hideOnDesktop !== 'undefined' ? !!props.hideOnDesktop : false;
  var hideOnTablet = props && typeof props.hideOnTablet !== 'undefined' ? !!props.hideOnTablet : false;
  var hideOnMobile = props && typeof props.hideOnMobile !== 'undefined' ? !!props.hideOnMobile : false;
  var setAttributes = props && props.setAttributes ? props.setAttributes : null;
  var onChangeDesktop = props && props.onChangeDesktop ? props.onChangeDesktop : null;
  var onChangeTablet = props && props.onChangeTablet ? props.onChangeTablet : null;
  var onChangeMobile = props && props.onChangeMobile ? props.onChangeMobile : null;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
    title: title,
    initialOpen: initialOpen
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hide on Desktop'),
    checked: hideOnDesktop,
    onChange: function (val) {
      if (onChangeDesktop) {
        onChangeDesktop(val);
      } else if (setAttributes) {
        setAttributes({
          hideOnDesktop: !!val
        });
      }
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hide on Tablet'),
    checked: hideOnTablet,
    onChange: function (val) {
      if (onChangeTablet) {
        onChangeTablet(val);
      } else if (setAttributes) {
        setAttributes({
          hideOnTablet: !!val
        });
      }
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hide on Mobile'),
    checked: hideOnMobile,
    onChange: function (val) {
      if (onChangeMobile) {
        onChangeMobile(val);
      } else if (setAttributes) {
        setAttributes({
          hideOnMobile: !!val
        });
      }
    }
  }));
}

/***/ },

/***/ "../../../shared/index.js"
/*!********************************!*\
  !*** ../../../shared/index.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BreakpointSwitcher: () => (/* reexport safe */ _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   ControlHeader: () => (/* reexport safe */ _ControlHeader__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   ResponsiveBoxControl: () => (/* reexport safe */ _ResponsiveBoxControl__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   ResponsiveVisibilityPanel: () => (/* reexport safe */ _ResponsiveVisibilityPanel__WEBPACK_IMPORTED_MODULE_3__["default"])
/* harmony export */ });
/* harmony import */ var _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BreakpointSwitcher */ "../../../shared/BreakpointSwitcher.js");
/* harmony import */ var _ControlHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ControlHeader */ "../../../shared/ControlHeader.js");
/* harmony import */ var _ResponsiveBoxControl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ResponsiveBoxControl */ "../../../shared/ResponsiveBoxControl.js");
/* harmony import */ var _ResponsiveVisibilityPanel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ResponsiveVisibilityPanel */ "../../../shared/ResponsiveVisibilityPanel.js");





/***/ },

/***/ "./src/edit.js"
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColumnsEditContainer: () => (/* binding */ ColumnsEditContainer),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../shared */ "../../../shared/index.js");
/* harmony import */ var _variations__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./variations */ "./src/variations.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./editor.scss */ "./src/editor.scss");














const ALLOWED_BLOCKS = ['madeit/block-content-column'];
function ColumnsEditContainer(props) {
  var _legacyMinHeight$valu, _legacyMinHeight$unit, _ref, _attributes$alignItem, _ref2, _attributes$justifyCo, _ref3, _attributes$flexWrapV;
  const {
    attributes,
    setAttributes,
    className,
    updateAlignment,
    updateColumns,
    clientId,
    containerBackgroundColor,
    setContainerBackgroundColor,
    rowBackgroundColor,
    setRowBackgroundColor,
    rowTextColor,
    setRowTextColor
  } = props;
  const isBlockSelected = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.useSelect)(select => select('core/block-editor')?.isBlockSelected?.(clientId), [clientId]);
  const {
    verticalAlignment,
    size,
    contentWidth,
    containerMargin,
    containerMarginTablet,
    containerMarginMobile,
    containerPadding,
    containerPaddingTablet,
    containerPaddingMobile,
    containerPaddingOnRow,
    rowMargin,
    rowPadding,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    containerBackgroundGradient,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    rowGapTablet,
    rowGapUnitTablet,
    rowGapMobile,
    rowGapUnitMobile,
    columnsCount,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile,
    backgroundType
  } = attributes;
  const computedContainerBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0 ? containerBackgroundPosition : 'center center';
  const computedContainerBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0 ? containerBackgroundRepeat : 'no-repeat';
  const computedContainerBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0 ? containerBackgroundSize : 'cover';
  const computedBackgroundType = backgroundType || (containerBackgroundImage?.url || containerBackgroundColor?.color ? 'classic' : 'transparent');
  const computedBackgroundGradient = attributes.containerBackgroundGradient || {
    gradient: ''
  };
  const computedBackgroundGradientValue = typeof computedBackgroundGradient?.gradient === 'string' && computedBackgroundGradient.gradient.trim().length > 0 ? computedBackgroundGradient.gradient : undefined;
  const gradients = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.useSelect)(select => {
    const settings = select('core/block-editor')?.getSettings?.() || {};

    // Gutenberg has multiple possible shapes depending on WP/Gutenberg version.
    const gradientsFromFeatures = settings?.__experimentalFeatures?.color?.gradients?.theme || settings?.__experimentalFeatures?.color?.gradients?.default || settings?.__experimentalFeatures?.color?.gradients?.custom;
    return settings.gradients || gradientsFromFeatures || [];
  }, []);

  // Define the container size options and their corresponding CSS classes
  const containerSizes = [{
    value: 'container',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Boxed')
  },
  // { value: 'container-content-boxed', label: __( 'Full width - Content boxed' ) },
  {
    value: 'container-fluid',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Full width')
  }];
  const contentBoxedSizes = [{
    value: 'container',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Boxed')
  }, {
    value: 'container-fluid',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Full width')
  }];
  const fallbackTextColor = '#FFFFFF';
  const fallbackBackgroundColor = '#000000';

  // Initialize `contentWidth` once so it doesn't keep following `size`.
  // This keeps existing blocks stable, while making the controls truly independent.
  const didInitContentWidth = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useRef)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
    if (didInitContentWidth.current) return;
    if (typeof contentWidth === 'string' && contentWidth.length > 0) {
      didInitContentWidth.current = true;
      return;
    }
    const initialContentWidth = size === 'container-fluid' ? 'container-fluid' : 'container';
    setAttributes({
      contentWidth: initialContentWidth
    });
    didInitContentWidth.current = true;
  }, [contentWidth, size, setAttributes]);

  // If the outer container is boxed, content cannot be full width.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
    if (size !== 'container') return;
    if (contentWidth !== 'container-fluid') return;
    setAttributes({
      contentWidth: 'container'
    });
  }, [size, contentWidth, setAttributes]);
  const {
    count
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.useSelect)(select => {
    return {
      count: select('core/block-editor').getBlockCount(clientId)
    };
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
    if (columnsCount === count) return;
    setAttributes({
      columnsCount: count
    });
  }, [columnsCount, count, setAttributes]);
  var classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment
  });
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    [`container`]: 'container' === size,
    [`container-fluid`]: 'container-fluid' === size || 'container-content-boxed' === size
  });
  const computedContentWidth = size === 'container' ? 'container' : contentWidth === 'container-fluid' ? 'container-fluid' : 'container';
  const canChooseContentWidth = size !== 'container';
  var classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()('', {
    [`container`]: computedContentWidth === 'container',
    [`container-fluid`]: computedContentWidth === 'container-fluid'
  });
  const setContainerPadding = containerPadding => {
    setAttributes({
      containerPadding
    });
  };
  const setContainerMargin = containerMargin => {
    setAttributes({
      containerMargin
    });
  };
  const setRowPadding = rowPadding => {
    setAttributes({
      rowPadding
    });
  };
  const setRowMargin = rowMargin => {
    setAttributes({
      rowMargin
    });
  };
  const resetAllContainer = () => {
    setContainerPadding(undefined);
    setContainerMargin(undefined);
  };
  const resetAllRow = () => {
    setRowPadding(undefined);
    setRowMargin(undefined);
  };
  const resetContainerPadding = () => {
    setContainerPadding(undefined);
  };
  const resetContainerMargin = () => {
    setContainerMargin(undefined);
  };
  const setContainerBackgroundImage = media => {
    if (!media || !media.id) {
      setAttributes({
        containerBackgroundImage: undefined
      });
      return;
    }
    const url = media.url || media?.sizes?.full?.url || media?.sizes?.large?.url || media?.source_url;
    setAttributes({
      containerBackgroundImage: {
        id: media.id,
        url,
        alt: media.alt || ''
      },
      containerBackgroundPosition: typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0 ? containerBackgroundPosition : 'center center',
      containerBackgroundRepeat: typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0 ? containerBackgroundRepeat : 'no-repeat',
      containerBackgroundSize: typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0 ? containerBackgroundSize : 'cover'
    });
  };
  const setContainerBackgroundPosition = value => setAttributes({
    containerBackgroundPosition: value
  });
  const setContainerBackgroundRepeat = value => setAttributes({
    containerBackgroundRepeat: value
  });
  const setContainerBackgroundSize = value => setAttributes({
    containerBackgroundSize: value
  });
  const setContainerBackgroundGradient = value => {
    if (!value) {
      setAttributes({
        containerBackgroundGradient: undefined
      });
      return;
    }
    if (typeof value === 'string') {
      if (value.trim().length === 0) {
        setAttributes({
          containerBackgroundGradient: undefined
        });
        return;
      }
      setAttributes({
        containerBackgroundGradient: {
          gradient: value
        }
      });
      return;
    }

    // Handle objects like { gradient: '' } coming from pickers.
    if (typeof value?.gradient === 'string' && value.gradient.trim().length === 0) {
      setAttributes({
        containerBackgroundGradient: undefined
      });
      return;
    }
    setAttributes({
      containerBackgroundGradient: value
    });
  };
  const computedOverflow = overflow !== null && overflow !== void 0 ? overflow : 'visible';
  const computedHtmlTag = htmlTag !== null && htmlTag !== void 0 ? htmlTag : 'div';
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(computedHtmlTag) ? computedHtmlTag : 'div';
  const applyContainerBackgroundToChild = size === 'container';
  const containerBackgroundStyle = {
    backgroundColor: computedBackgroundType === 'transparent' ? 'transparent' : containerBackgroundColor.color
  };
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    containerBackgroundStyle.backgroundImage = `url(${containerBackgroundImage.url})`;
    containerBackgroundStyle.backgroundPosition = computedContainerBackgroundPosition;
    containerBackgroundStyle.backgroundRepeat = computedContainerBackgroundRepeat;
    containerBackgroundStyle.backgroundSize = computedContainerBackgroundSize;
  }
  if (computedBackgroundType === 'gradient' && computedBackgroundGradientValue) {
    containerBackgroundStyle.backgroundImage = computedBackgroundGradientValue;
  }
  var style = {
    overflow: computedOverflow
  };
  if (!applyContainerBackgroundToChild) {
    style = {
      ...style,
      ...containerBackgroundStyle
    };
  }

  // Responsive flex-direction via CSS variables.
  style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
  if (flexDirectionTablet) {
    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
  }
  if (flexDirectionMobile) {
    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
  }

  // Responsive align-items / justify-content via CSS variables.
  style['--madeit-align-items-desktop'] = alignItems || 'stretch';
  if (alignItemsTablet) {
    style['--madeit-align-items-tablet'] = alignItemsTablet;
  }
  if (alignItemsMobile) {
    style['--madeit-align-items-mobile'] = alignItemsMobile;
  }
  style['--madeit-justify-content-desktop'] = justifyContent || 'flex-start';
  if (justifyContentTablet) {
    style['--madeit-justify-content-tablet'] = justifyContentTablet;
  }
  if (justifyContentMobile) {
    style['--madeit-justify-content-mobile'] = justifyContentMobile;
  }

  // Responsive flex-wrap via CSS variables.
  style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';
  if (flexWrapTablet) {
    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
  }
  if (flexWrapMobile) {
    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
  }

  // Responsive min-height via CSS variables.
  if (typeof minHeight === 'number') {
    style['--madeit-min-height-desktop'] = `${minHeight}${minHeightUnit || 'px'}`;
  }
  if (typeof minHeightTablet === 'number') {
    style['--madeit-min-height-tablet'] = `${minHeightTablet}${minHeightUnitTablet || 'px'}`;
  }
  if (typeof minHeightMobile === 'number') {
    style['--madeit-min-height-mobile'] = `${minHeightMobile}${minHeightUnitMobile || 'px'}`;
  }

  // Responsive max-width via CSS variables.
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }

  // Responsive row-gap via CSS variables.
  if (typeof rowGap === 'number') {
    style['--madeit-row-gap-desktop'] = `${rowGap}${rowGapUnit || 'px'}`;
  }
  if (typeof rowGapTablet === 'number') {
    style['--madeit-row-gap-tablet'] = `${rowGapTablet}${rowGapUnitTablet || 'px'}`;
  }
  if (typeof rowGapMobile === 'number') {
    style['--madeit-row-gap-mobile'] = `${rowGapMobile}${rowGapUnitMobile || 'px'}`;
  }
  const setCssVarIfDefined = (targetStyle, key, value) => {
    if (value === undefined || value === null) return;
    if (typeof value !== 'string') return;
    const trimmed = value.trim();
    if (trimmed === '') return;
    targetStyle[key] = trimmed;
  };
  const setSpacingVars = (targetStyle, prefix, spacing, breakpoint) => {
    if (!spacing || typeof spacing !== 'object') return;
    setCssVarIfDefined(targetStyle, `--${prefix}-top-${breakpoint}`, spacing.top);
    setCssVarIfDefined(targetStyle, `--${prefix}-right-${breakpoint}`, spacing.right);
    setCssVarIfDefined(targetStyle, `--${prefix}-bottom-${breakpoint}`, spacing.bottom);
    setCssVarIfDefined(targetStyle, `--${prefix}-left-${breakpoint}`, spacing.left);
  };

  // Desktop margin stays inline; tablet/mobile overrides via CSS variables.
  if (containerMargin && typeof containerMargin === 'object') {
    if (containerMargin.top !== undefined) {
      style.marginTop = containerMargin.top;
    }
    if (containerMargin.bottom !== undefined) {
      style.marginBottom = containerMargin.bottom;
    }
  }
  if (containerMarginTablet && typeof containerMarginTablet === 'object') {
    setCssVarIfDefined(style, '--madeit-container-margin-top-tablet', containerMarginTablet.top);
    setCssVarIfDefined(style, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom);
  }
  if (containerMarginMobile && typeof containerMarginMobile === 'object') {
    setCssVarIfDefined(style, '--madeit-container-margin-top-mobile', containerMarginMobile.top);
    setCssVarIfDefined(style, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom);
  }
  const shouldApplyContainerPaddingOnRow = containerPaddingOnRow === true;

  // Desktop padding stays inline; tablet/mobile overrides via CSS variables.
  var rowStyle = {};
  if (shouldApplyContainerPaddingOnRow) {
    if (containerPadding && typeof containerPadding === 'object') {
      if (containerPadding.top !== undefined) rowStyle.paddingTop = containerPadding.top;
      if (containerPadding.right !== undefined) rowStyle.paddingRight = containerPadding.right;
      if (containerPadding.bottom !== undefined) rowStyle.paddingBottom = containerPadding.bottom;
      if (containerPadding.left !== undefined) rowStyle.paddingLeft = containerPadding.left;
    }
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile');
  } else {
    if (containerPadding && typeof containerPadding === 'object') {
      if (containerPadding.top !== undefined) style.paddingTop = containerPadding.top;
      if (containerPadding.right !== undefined) style.paddingRight = containerPadding.right;
      if (containerPadding.bottom !== undefined) style.paddingBottom = containerPadding.bottom;
      if (containerPadding.left !== undefined) style.paddingLeft = containerPadding.left;
    }
    setSpacingVars(style, 'madeit-container-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(style, 'madeit-container-padding', containerPaddingMobile, 'mobile');
  }
  var styleChild = {};
  if (size === 'container-content-boxed') {
    styleChild = {
      backgroundColor: rowBackgroundColor.color,
      color: rowTextColor.color
    };
    if (rowMargin !== undefined && rowMargin.top !== undefined) {
      styleChild.marginTop = rowMargin.top;
    }
    if (rowMargin !== undefined && rowMargin.bottom !== undefined) {
      styleChild.marginBottom = rowMargin.bottom;
    }
    if (rowMargin !== undefined && rowMargin.left !== undefined) {
      styleChild.marginLeft = rowMargin.left;
    }
    if (rowMargin !== undefined && rowMargin.right !== undefined) {
      styleChild.marginRight = rowMargin.right;
    }
    if (rowPadding !== undefined && rowPadding.top !== undefined) {
      styleChild.paddingTop = rowPadding.top;
    }
    if (rowPadding !== undefined && rowPadding.bottom !== undefined) {
      styleChild.paddingBottom = rowPadding.bottom;
    }
    if (rowPadding !== undefined && rowPadding.left !== undefined) {
      styleChild.paddingLeft = rowPadding.left;
    }
    if (rowPadding !== undefined && rowPadding.right !== undefined) {
      styleChild.paddingRight = rowPadding.right;
    }
  } else {
    style.color = rowTextColor.color;
    if (applyContainerBackgroundToChild) {
      styleChild = {
        ...styleChild,
        ...containerBackgroundStyle
      };
    }
  }
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.useBlockProps)({
    className: classes,
    style: style,
    'data-madeit-dir': flexDirection || 'row',
    'data-madeit-dir-tablet': flexDirectionTablet || undefined,
    'data-madeit-dir-mobile': flexDirectionMobile || undefined
  });

  // Auto-migrate legacy blocks: if containerPadding exists but the new
  // containerPaddingOnRow flag was never set, switch it on so the next save
  // serializes padding on `.madeit-container-row`.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
    if (containerPaddingOnRow === true) return;
    if (!containerPadding) return;
    const hasAnyPadding = containerPadding.top !== undefined || containerPadding.bottom !== undefined || containerPadding.left !== undefined || containerPadding.right !== undefined;
    if (!hasAnyPadding) return;
    setAttributes({
      containerPaddingOnRow: true
    });
  }, [containerPaddingOnRow, containerPadding, setAttributes]);
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('layout');
  const [activeMaxWidthBreakpoint, setActiveMaxWidthBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const [activeMinHeightBreakpoint, setActiveMinHeightBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const [activeRowGapBreakpoint, setActiveRowGapBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const [activePaddingBreakpoint, setActivePaddingBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const [activeMarginBreakpoint, setActiveMarginBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const [activeDirectionBreakpoint, setActiveDirectionBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const directionValueKey = activeDirectionBreakpoint === 'tablet' ? 'flexDirectionTablet' : activeDirectionBreakpoint === 'mobile' ? 'flexDirectionMobile' : 'flexDirection';
  const currentDirection = attributes?.[directionValueKey] || 'row';
  const resetDirection = () => setAttributes({
    [directionValueKey]: activeDirectionBreakpoint === 'desktop' ? 'row' : undefined
  });
  const maxWidthValueKey = activeMaxWidthBreakpoint === 'tablet' ? 'maxWidthTablet' : activeMaxWidthBreakpoint === 'mobile' ? 'maxWidthMobile' : 'maxWidth';
  const maxWidthUnitKey = activeMaxWidthBreakpoint === 'tablet' ? 'maxWidthUnitTablet' : activeMaxWidthBreakpoint === 'mobile' ? 'maxWidthUnitMobile' : 'maxWidthUnit';
  const currentMaxWidthValue = attributes?.[maxWidthValueKey];
  const currentMaxWidthUnit = attributes?.[maxWidthUnitKey] || 'px';
  const resetMaxWidth = () => setAttributes({
    [maxWidthValueKey]: undefined,
    [maxWidthUnitKey]: 'px',
    madeitHasUserEdits: true
  });
  const minHeightValueKey = activeMinHeightBreakpoint === 'tablet' ? 'minHeightTablet' : activeMinHeightBreakpoint === 'mobile' ? 'minHeightMobile' : 'minHeight';
  const minHeightUnitKey = activeMinHeightBreakpoint === 'tablet' ? 'minHeightUnitTablet' : activeMinHeightBreakpoint === 'mobile' ? 'minHeightUnitMobile' : 'minHeightUnit';
  const currentMinHeightValue = attributes?.[minHeightValueKey];
  const currentMinHeightUnit = attributes?.[minHeightUnitKey] || 'px';
  const parseWrapperLengthVar = varName => {
    const wrapperStyle = attributes?.wrapperStyle;
    if (typeof wrapperStyle !== 'string' || wrapperStyle.trim() === '') {
      return undefined;
    }
    const match = wrapperStyle.match(new RegExp(`${varName}\\s*:\\s*([^;]+)`));
    const raw = match?.[1]?.trim();
    if (!raw) return undefined;
    const lengthMatch = raw.match(/^(-?\d+(?:\.\d+)?)([a-z%]+)$/i);
    if (!lengthMatch) return undefined;
    const value = Number.parseFloat(lengthMatch[1]);
    const unit = String(lengthMatch[2]).toLowerCase();
    if (!Number.isFinite(value)) return undefined;
    return {
      value,
      unit
    };
  };
  const madeitHasUserEdits = attributes?.madeitHasUserEdits === true;
  const legacyMinHeightVarName = activeMinHeightBreakpoint === 'tablet' ? '--madeit-min-height-tablet' : activeMinHeightBreakpoint === 'mobile' ? '--madeit-min-height-mobile' : '--madeit-min-height-desktop';
  const legacyMinHeight = !madeitHasUserEdits ? parseWrapperLengthVar(legacyMinHeightVarName) : undefined;
  const minHeightValueForUi = typeof currentMinHeightValue === 'number' ? currentMinHeightValue : (_legacyMinHeight$valu = legacyMinHeight?.value) !== null && _legacyMinHeight$valu !== void 0 ? _legacyMinHeight$valu : 0;
  const minHeightUnitForUi = typeof currentMinHeightValue === 'number' ? currentMinHeightUnit : (_legacyMinHeight$unit = legacyMinHeight?.unit) !== null && _legacyMinHeight$unit !== void 0 ? _legacyMinHeight$unit : currentMinHeightUnit;
  const resetMinHeight = () => setAttributes({
    [minHeightValueKey]: undefined,
    [minHeightUnitKey]: 'px',
    madeitHasUserEdits: true
  });
  const rowGapValueKey = activeRowGapBreakpoint === 'tablet' ? 'rowGapTablet' : activeRowGapBreakpoint === 'mobile' ? 'rowGapMobile' : 'rowGap';
  const rowGapUnitKey = activeRowGapBreakpoint === 'tablet' ? 'rowGapUnitTablet' : activeRowGapBreakpoint === 'mobile' ? 'rowGapUnitMobile' : 'rowGapUnit';
  const paddingValueKey = activePaddingBreakpoint === 'tablet' ? 'containerPaddingTablet' : activePaddingBreakpoint === 'mobile' ? 'containerPaddingMobile' : 'containerPadding';
  const marginValueKey = activeMarginBreakpoint === 'tablet' ? 'containerMarginTablet' : activeMarginBreakpoint === 'mobile' ? 'containerMarginMobile' : 'containerMargin';
  const currentRowGapValueRaw = attributes?.[rowGapValueKey];
  const currentRowGapValue = typeof currentRowGapValueRaw === 'number' ? currentRowGapValueRaw : 20;
  const currentRowGapUnit = attributes?.[rowGapUnitKey] || 'px';
  const resetRowGap = () => setAttributes({
    [rowGapValueKey]: activeRowGapBreakpoint === 'desktop' ? 20 : undefined,
    [rowGapUnitKey]: 'px',
    madeitHasUserEdits: true
  });
  const isRowDirection = currentDirection === 'row' || currentDirection === 'row-reverse';
  const isColumnDirection = currentDirection === 'column' || currentDirection === 'column-reverse';
  const alignItemsValueKey = activeDirectionBreakpoint === 'tablet' ? 'alignItemsTablet' : activeDirectionBreakpoint === 'mobile' ? 'alignItemsMobile' : 'alignItems';
  const currentAlignItems = (_ref = (_attributes$alignItem = attributes?.[alignItemsValueKey]) !== null && _attributes$alignItem !== void 0 ? _attributes$alignItem : attributes?.alignItems) !== null && _ref !== void 0 ? _ref : 'flex-start';
  const resetAlignItems = () => setAttributes({
    [alignItemsValueKey]: activeDirectionBreakpoint === 'desktop' ? 'flex-start' : undefined
  });
  const justifyContentValueKey = activeDirectionBreakpoint === 'tablet' ? 'justifyContentTablet' : activeDirectionBreakpoint === 'mobile' ? 'justifyContentMobile' : 'justifyContent';
  const currentJustifyContent = (_ref2 = (_attributes$justifyCo = attributes?.[justifyContentValueKey]) !== null && _attributes$justifyCo !== void 0 ? _attributes$justifyCo : attributes?.justifyContent) !== null && _ref2 !== void 0 ? _ref2 : 'flex-start';
  const resetJustifyContent = () => setAttributes({
    [justifyContentValueKey]: activeDirectionBreakpoint === 'desktop' ? 'flex-start' : undefined
  });
  const flexWrapValueKey = activeDirectionBreakpoint === 'tablet' ? 'flexWrapTablet' : activeDirectionBreakpoint === 'mobile' ? 'flexWrapMobile' : 'flexWrap';
  const currentFlexWrap = (_ref3 = (_attributes$flexWrapV = attributes?.[flexWrapValueKey]) !== null && _attributes$flexWrapV !== void 0 ? _attributes$flexWrapV : attributes?.flexWrap) !== null && _ref3 !== void 0 ? _ref3 : 'nowrap';
  const resetFlexWrap = () => setAttributes({
    [flexWrapValueKey]: activeDirectionBreakpoint === 'desktop' ? 'nowrap' : undefined
  });
  const FlexStartIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-start"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M8 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM15.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888z"
  }));
  const CenterIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-center"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M16 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"
  }));
  const FlexEndIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-end"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M24 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM18.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"
  }));
  const StretchIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "shrink"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M16 0c0.736 0 1.344 0.608 1.344 1.344v29.312c0 0.736-0.608 1.344-1.344 1.344s-1.344-0.608-1.344-1.344v-29.312c0-0.736 0.608-1.344 1.344-1.344zM26.368 8.672c0.256 0.032 0.48 0.16 0.704 0.384 0.16 0.224 0.256 0.48 0.256 0.8v3.488h2.816c1.024 0 1.856 0.832 1.856 1.856v1.6c0 1.024-0.832 1.856-1.856 1.856h-2.816v3.616c-0.032 0.32-0.16 0.608-0.384 0.8-0.224 0.16-0.448 0.256-0.704 0.256-0.256-0.032-0.48-0.16-0.704-0.384l-5.216-6.080-0.128-0.16c-0.16-0.224-0.224-0.48-0.192-0.8s0.128-0.576 0.32-0.768l5.344-6.208c0.192-0.192 0.416-0.288 0.704-0.256zM5.632 8.672c0.224-0.032 0.448 0.032 0.608 0.16l0.128 0.096 5.344 6.176c0.16 0.224 0.288 0.48 0.288 0.8 0.032 0.256 0 0.448-0.096 0.64l-0.064 0.16-0.128 0.16-5.248 6.080c-0.192 0.224-0.416 0.352-0.704 0.384-0.224 0-0.48-0.096-0.704-0.256-0.16-0.16-0.288-0.352-0.352-0.608l-0.032-0.192v-3.616h-2.816c-1.024 0-1.856-0.832-1.856-1.856v-1.6c0-1.024 0.832-1.856 1.856-1.856h2.816v-3.488c0-0.256 0.064-0.48 0.16-0.672l0.096-0.128c0.192-0.224 0.448-0.352 0.704-0.384z"
  }));
  const FlexStartIconRotate = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-start"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M8 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM15.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888z"
  }));
  const CenterIconRotate = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-center"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M16 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"
  }));
  const FlexEndIconRotate = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-end"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M24 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM18.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"
  }));
  const StretchIconRotate = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "shrink"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M16 0c0.736 0 1.344 0.608 1.344 1.344v29.312c0 0.736-0.608 1.344-1.344 1.344s-1.344-0.608-1.344-1.344v-29.312c0-0.736 0.608-1.344 1.344-1.344zM26.368 8.672c0.256 0.032 0.48 0.16 0.704 0.384 0.16 0.224 0.256 0.48 0.256 0.8v3.488h2.816c1.024 0 1.856 0.832 1.856 1.856v1.6c0 1.024-0.832 1.856-1.856 1.856h-2.816v3.616c-0.032 0.32-0.16 0.608-0.384 0.8-0.224 0.16-0.448 0.256-0.704 0.256-0.256-0.032-0.48-0.16-0.704-0.384l-5.216-6.080-0.128-0.16c-0.16-0.224-0.224-0.48-0.192-0.8s0.128-0.576 0.32-0.768l5.344-6.208c0.192-0.192 0.416-0.288 0.704-0.256zM5.632 8.672c0.224-0.032 0.448 0.032 0.608 0.16l0.128 0.096 5.344 6.176c0.16 0.224 0.288 0.48 0.288 0.8 0.032 0.256 0 0.448-0.096 0.64l-0.064 0.16-0.128 0.16-5.248 6.080c-0.192 0.224-0.416 0.352-0.704 0.384-0.224 0-0.48-0.096-0.704-0.256-0.16-0.16-0.288-0.352-0.352-0.608l-0.032-0.192v-3.616h-2.816c-1.024 0-1.856-0.832-1.856-1.856v-1.6c0-1.024 0.832-1.856 1.856-1.856h2.816v-3.488c0-0.256 0.064-0.48 0.16-0.672l0.096-0.128c0.192-0.224 0.448-0.352 0.704-0.384z"
  }));
  const JustifyStartIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-start"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M8 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM15.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888z"
  }));
  const JustifyStartIconRotate = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-start"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M8 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM15.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888z"
  }));
  const JustifyCenterIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-center"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M16 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"
  }));
  const JustifyCenterIconRotate = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-center"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M16 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"
  }));
  const JustifyEndIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-end"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M24 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM18.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"
  }));
  const JustifyEndIconRotate = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-end"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M24 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM18.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"
  }));
  const JustifyBetweenIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-space-between"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM8.8 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-3.456v-21.312h3.456zM26.656 5.344v21.312h-3.456c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h3.456z"
  }));
  const JustifyBetweenIconRotate = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-space-between"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM8.8 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-3.456v-21.312h3.456zM26.656 5.344v21.312h-3.456c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h3.456z"
  }));
  const JustifySpaceAroundIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-space-between"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM8.8 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-3.456v-21.312h3.456zM26.656 5.344v21.312h-3.456c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h3.456z"
  }));
  const JustifySpaceAroundIconRotate = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-space-between"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM8.8 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-3.456v-21.312h3.456zM26.656 5.344v21.312h-3.456c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h3.456z"
  }));
  const JustifySpaceEvenlyIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-space-evenly"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM22.144 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-1.6c-1.024 0-1.888-0.832-1.888-1.856v-17.6c0-1.024 0.864-1.856 1.888-1.856h1.6zM11.456 5.344c1.024 0 1.888 0.832 1.888 1.856v17.6c0 1.024-0.864 1.856-1.888 1.856h-1.6c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h1.6z"
  }));
  const JustifySpaceEvenlyIconRotate = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    style: {
      transform: 'rotate(90deg)'
    },
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("title", null, "justify-space-evenly"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM22.144 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-1.6c-1.024 0-1.888-0.832-1.888-1.856v-17.6c0-1.024 0.864-1.856 1.888-1.856h1.6zM11.456 5.344c1.024 0 1.888 0.832 1.888 1.856v17.6c0 1.024-0.864 1.856-1.888 1.856h-1.6c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h1.6z"
  }));
  const styleTransparentIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    id: "SVGRepo_bgCarrier",
    "stroke-width": "0"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    id: "SVGRepo_tracerCarrier",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    id: "SVGRepo_iconCarrier"
  }, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7.49991 0.877075C3.84222 0.877075 0.877075 3.84222 0.877075 7.49991C0.877075 11.1576 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1576 14.1227 7.49991C14.1227 3.84222 11.1576 0.877075 7.49991 0.877075ZM3.85768 3.15057C4.84311 2.32448 6.11342 1.82708 7.49991 1.82708C10.6329 1.82708 13.1727 4.36689 13.1727 7.49991C13.1727 8.88638 12.6753 10.1567 11.8492 11.1421L3.85768 3.15057ZM3.15057 3.85768C2.32448 4.84311 1.82708 6.11342 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C8.88638 13.1727 10.1567 12.6753 11.1421 11.8492L3.15057 3.85768Z",
    fill: "#000000"
  }), " "));
  const styleClassicIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 -2 32 32",
    fill: "#000000"
  }, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    strokeWidth: "0"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    fill: "none",
    fillRule: "evenodd"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    transform: "translate(-101.000000, -156.000000)",
    fill: "#000000"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M132.132,156.827 C130.975,155.685 129.099,155.685 127.942,156.827 L115.336,169.277 L119.499,173.44 L132.132,160.964 C133.289,159.821 133.289,157.969 132.132,156.827 Z M112.461,180.385 C111.477,181.298 107.08,183.333 104.491,181.36 C104.491,181.36 105.392,180.657 106.074,179.246 C107.703,174.919 111.763,175.56 111.763,175.56 L113.159,176.938 C113.173,176.952 114.202,178.771 112.461,180.385 Z M113.913,170.683 L110.764,173.788 C108.661,173.74 105.748,174.485 104.491,178.603 C103.53,180.781 101,180.671 101,180.671 C106.253,186.498 112.444,183.196 113.857,181.764 C115.1,180.506 115.279,178.966 115.146,177.734 L118.076,174.846 L113.913,170.683 Z"
  })))));
  const styleGradientIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    fill: "#000000",
    viewBox: "0 0 32 32",
    id: "icon",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    id: "SVGRepo_bgCarrier",
    "stroke-width": "0"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    id: "SVGRepo_tracerCarrier",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    id: "SVGRepo_iconCarrier"
  }, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, " "), " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M26,4H6A2.0023,2.0023,0,0,0,4,6V26a2.0023,2.0023,0,0,0,2,2H26a2.0023,2.0023,0,0,0,2-2V6A2.0023,2.0023,0,0,0,26,4ZM22,26V22H18v4H14V22H10V18h4V14H10V10h4V6h4v4h4V6h4V26Z"
  }), " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    x: "14",
    y: "10",
    width: "4",
    height: "4"
  }), " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    x: "14",
    y: "18",
    width: "4",
    height: "4"
  }), " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    x: "18",
    y: "14",
    width: "4",
    height: "4"
  }), " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    id: "_Transparent_Rectangle_",
    "data-name": "<Transparent Rectangle>",
    className: "cls-1",
    width: "32",
    height: "32",
    fill: "none"
  }), " "));
  const handleBackgroundTypeChange = newType => {
    // When switching to transparent, clear classic background selections
    // so they don't "stick" when toggling back and forth.
    if (newType === 'transparent') {
      setAttributes({
        backgroundType: 'transparent',
        containerBackgroundColor: undefined,
        customContainerBackgroundColor: undefined
      });
      return;
    }
    setAttributes({
      backgroundType: newType
    });
  };
  const resetBackgroundType = () => {
    setAttributes({
      backgroundType: 'transparent',
      containerBackgroundColor: undefined,
      customContainerBackgroundColor: undefined,
      containerBackgroundImage: undefined,
      containerBackgroundPosition: undefined,
      containerBackgroundRepeat: undefined,
      containerBackgroundSize: undefined,
      containerBackgroundGradient: {}
    });
  };
  const StyleSwitcher = ({
    active,
    onChange
  }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, {
    className: "madeit-control-styleSwitcher"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: styleTransparentIcon,
    isPressed: active === 'transparent',
    onClick: () => onChange('transparent')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: styleClassicIcon,
    isPressed: active === 'classic',
    onClick: () => onChange('classic')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: styleGradientIcon,
    isPressed: active === 'gradient',
    onClick: () => onChange('gradient')
  }));
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
    const bodyClass = 'madeit-content-container-advanced-tabs';
    if (isBlockSelected) {
      document.body.classList.add(bodyClass);
    } else {
      document.body.classList.remove(bodyClass);
    }
    return () => {
      document.body.classList.remove(bodyClass);
    };
  }, [isBlockSelected]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
    if (!isBlockSelected) return;
    const advancedPanel = document.querySelector('.block-editor-block-inspector__advanced');
    if (!advancedPanel) return;
    if (activeTab === 'advanced') {
      advancedPanel.style.display = 'block';
    } else if (activeTab === 'layout' || activeTab === 'style') {
      console.log('Hiding advanced panel');
      advancedPanel.style.display = 'none';
    }
  }, [activeTab, isBlockSelected]);
  return [(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-evenly'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    isPrimary: activeTab === 'layout',
    onClick: () => setActiveTab('layout'),
    style: {
      marginRight: '5px'
    }
  }, "Layout"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    isPrimary: activeTab === 'style',
    onClick: () => setActiveTab('style'),
    style: {
      marginRight: '5px'
    }
  }, "Style"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    isPrimary: activeTab === 'advanced',
    onClick: () => setActiveTab('advanced')
  }, "Advanced")), activeTab === 'layout' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    title: "Algemeen",
    initialOpen: true
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Wijzig kolommen'),
    value: count,
    onChange: value => updateColumns(count, value),
    min: 1,
    max: 6
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Container breedte')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, null, containerSizes.map(({
    value,
    label
  }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    key: value,
    isPrimary: size === value,
    onClick: () => setAttributes({
      size: value
    })
  }, label))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), canChooseContentWidth && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Content breedte'),
    value: computedContentWidth,
    onChange: newSize => setAttributes({
      contentWidth: newSize
    }),
    options: contentBoxedSizes
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('max breedte'),
    breakpoint: activeMaxWidthBreakpoint,
    onBreakpointChange: setActiveMaxWidthBreakpoint,
    afterBreakpoint: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, {
      className: "madeit-control-units"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
      isPressed: currentMaxWidthUnit === 'px',
      onClick: () => setAttributes({
        [maxWidthUnitKey]: 'px',
        madeitHasUserEdits: true
      })
    }, "px"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
      isPressed: currentMaxWidthUnit === '%',
      onClick: () => setAttributes({
        [maxWidthUnitKey]: '%',
        madeitHasUserEdits: true
      })
    }, "%"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
      isPressed: currentMaxWidthUnit === 'vh',
      onClick: () => setAttributes({
        [maxWidthUnitKey]: 'vh',
        madeitHasUserEdits: true
      })
    }, "vh"))
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control-rangeRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
    label: "",
    value: typeof currentMaxWidthValue === 'number' ? currentMaxWidthValue : 0,
    onChange: value => setAttributes({
      [maxWidthValueKey]: value,
      madeitHasUserEdits: true
    }),
    min: 0,
    max: currentMaxWidthUnit === 'vh' || currentMaxWidthUnit === '%' ? 100 : 1000
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    className: "madeit-control-rangeRow__reset",
    icon: "undo",
    variant: "tertiary",
    onClick: resetMaxWidth,
    showTooltip: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset max breedte')
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Min hoogte'),
    breakpoint: activeMinHeightBreakpoint,
    onBreakpointChange: setActiveMinHeightBreakpoint,
    afterBreakpoint: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, {
      className: "madeit-control-units"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
      isPressed: minHeightUnitForUi === 'px',
      onClick: () => setAttributes({
        [minHeightUnitKey]: 'px',
        madeitHasUserEdits: true
      })
    }, "px"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
      isPressed: minHeightUnitForUi === 'vh',
      onClick: () => setAttributes({
        [minHeightUnitKey]: 'vh',
        madeitHasUserEdits: true
      })
    }, "vh"))
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control-rangeRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
    label: "",
    value: minHeightValueForUi,
    onChange: value => setAttributes({
      [minHeightValueKey]: value,
      madeitHasUserEdits: true
    }),
    min: 0,
    max: minHeightUnitForUi === 'vh' ? 100 : 1000
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    className: "madeit-control-rangeRow__reset",
    icon: "undo",
    variant: "tertiary",
    onClick: resetMinHeight,
    showTooltip: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset min hoogte')
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Overflow'),
    value: computedOverflow,
    options: [{
      value: 'visible',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Visible')
    }, {
      value: 'hidden',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Hidden')
    }, {
      value: 'scroll',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Scroll')
    }, {
      value: 'auto',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Auto')
    }],
    onChange: newOverflow => setAttributes({
      overflow: newOverflow
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('HTML tag'),
    value: computedHtmlTag,
    options: [{
      value: 'div',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('div')
    }, {
      value: 'section',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('section')
    }, {
      value: 'article',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('article')
    }, {
      value: 'main',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('main')
    }, {
      value: 'header',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('header')
    }, {
      value: 'footer',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('footer')
    }],
    onChange: newHtmlTag => setAttributes({
      htmlTag: newHtmlTag
    })
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    title: "Flex",
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Direction'),
    breakpoint: activeDirectionBreakpoint,
    onBreakpointChange: setActiveDirectionBreakpoint
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, {
    className: "madeit-control-buttonGroup"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: "arrow-right-alt2",
    isPressed: currentDirection === 'row',
    onClick: () => setAttributes({
      [directionValueKey]: 'row'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Row')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: "arrow-down-alt2",
    isPressed: currentDirection === 'column',
    onClick: () => setAttributes({
      [directionValueKey]: 'column'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Column')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: "arrow-left-alt2",
    isPressed: currentDirection === 'row-reverse',
    onClick: () => setAttributes({
      [directionValueKey]: 'row-reverse'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Row reverse')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: "arrow-up-alt2",
    isPressed: currentDirection === 'column-reverse',
    onClick: () => setAttributes({
      [directionValueKey]: 'column-reverse'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Column reverse')
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Align items'),
    breakpoint: activeDirectionBreakpoint,
    onBreakpointChange: setActiveDirectionBreakpoint,
    onReset: resetAlignItems,
    resetLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset align items')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, {
    className: "madeit-control-buttonGroup"
  }, isRowDirection && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FlexStartIconRotate, null),
    isPressed: currentAlignItems === 'flex-start',
    onClick: () => setAttributes({
      [alignItemsValueKey]: 'flex-start'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Top')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(CenterIconRotate, null),
    isPressed: currentAlignItems === 'center',
    onClick: () => setAttributes({
      [alignItemsValueKey]: 'center'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Center')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FlexEndIconRotate, null),
    isPressed: currentAlignItems === 'flex-end',
    onClick: () => setAttributes({
      [alignItemsValueKey]: 'flex-end'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Bottom')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(StretchIconRotate, null),
    isPressed: currentAlignItems === 'stretch',
    onClick: () => setAttributes({
      [alignItemsValueKey]: 'stretch'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Stretch')
  })), isColumnDirection && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FlexStartIcon, null),
    isPressed: currentAlignItems === 'flex-start',
    onClick: () => setAttributes({
      [alignItemsValueKey]: 'flex-start'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Left')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(CenterIcon, null),
    isPressed: currentAlignItems === 'center',
    onClick: () => setAttributes({
      [alignItemsValueKey]: 'center'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Center')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FlexEndIcon, null),
    isPressed: currentAlignItems === 'flex-end',
    onClick: () => setAttributes({
      [alignItemsValueKey]: 'flex-end'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Right')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(StretchIcon, null),
    isPressed: currentAlignItems === 'stretch',
    onClick: () => setAttributes({
      [alignItemsValueKey]: 'stretch'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Stretch')
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify items'),
    breakpoint: activeDirectionBreakpoint,
    onBreakpointChange: setActiveDirectionBreakpoint,
    onReset: resetJustifyContent,
    resetLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset justify items')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, {
    className: "madeit-control-buttonGroup"
  }, isRowDirection && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyStartIcon, null),
    isPressed: currentJustifyContent === 'flex-start',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'flex-start'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify start')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyCenterIcon, null),
    isPressed: currentJustifyContent === 'center',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'center'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify center')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyEndIcon, null),
    isPressed: currentJustifyContent === 'flex-end',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'flex-end'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify end')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyBetweenIcon, null),
    isPressed: currentJustifyContent === 'space-between',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'space-between'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify between')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifySpaceAroundIcon, null),
    isPressed: currentJustifyContent === 'space-around',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'space-around'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify space around')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifySpaceEvenlyIcon, null),
    isPressed: currentJustifyContent === 'space-evenly',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'space-evenly'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify space evenly')
  })), isColumnDirection && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyStartIconRotate, null),
    isPressed: currentJustifyContent === 'flex-start',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'flex-start'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify start')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyCenterIconRotate, null),
    isPressed: currentJustifyContent === 'center',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'center'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify center')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyEndIconRotate, null),
    isPressed: currentJustifyContent === 'flex-end',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'flex-end'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify end')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyBetweenIconRotate, null),
    isPressed: currentJustifyContent === 'space-between',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'space-between'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify between')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifySpaceAroundIconRotate, null),
    isPressed: currentJustifyContent === 'space-around',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'space-around'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify space around')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifySpaceEvenlyIconRotate, null),
    isPressed: currentJustifyContent === 'space-evenly',
    onClick: () => setAttributes({
      [justifyContentValueKey]: 'space-evenly'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify space evenly')
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Wrap'),
    breakpoint: activeDirectionBreakpoint,
    onBreakpointChange: setActiveDirectionBreakpoint,
    onReset: resetFlexWrap,
    resetLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset wrap')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, {
    className: "madeit-control-buttonGroup"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    isPressed: currentFlexWrap === 'wrap',
    onClick: () => setAttributes({
      [flexWrapValueKey]: 'wrap'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Wrap')
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Wrap')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    isPressed: currentFlexWrap === 'nowrap',
    onClick: () => setAttributes({
      [flexWrapValueKey]: 'nowrap'
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No wrap')
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No wrap')))))), activeTab === 'style' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    title: "Achtergrond",
    initialOpen: true
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Achtergrond type'),
    onReset: resetBackgroundType,
    afterBreakpoint: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(StyleSwitcher, {
      active: computedBackgroundType,
      onChange: handleBackgroundTypeChange
    })
  }), computedBackgroundType === 'classic' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.PanelColorSettings, {
    initialOpen: true,
    colorSettings: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Achtergrond kleur'),
      value: containerBackgroundColor.color,
      onChange: value => setContainerBackgroundColor(value)
    }]
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.MediaUploadCheck, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.MediaUpload, {
    onSelect: media => setContainerBackgroundImage(media),
    allowedTypes: ['image'],
    value: containerBackgroundImage?.id,
    render: ({
      open
    }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
      onClick: open,
      style: {
        width: '100%',
        height: '150px',
        justifyContent: 'center',
        padding: '0px'
      }
    }, !containerBackgroundImage ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%',
        height: '150px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0px'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Selecteer afbeelding')) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'madeit-background-image-preview'
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      className: "remove-image-button",
      onClick: e => {
        e.stopPropagation();
        setContainerBackgroundImage(null);
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('x')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: containerBackgroundImage.url,
      alt: containerBackgroundImage.alt,
      style: {
        width: '100%',
        height: '150px',
        objectFit: 'cover'
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      className: "edit-image-button",
      onClick: e => {
        e.stopPropagation();
        open();
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Wijzig afbeelding'))))
  }))), containerBackgroundImage && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Achtergrond positie'),
    value: computedContainerBackgroundPosition,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Links boven'),
      value: 'left top'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Midden boven'),
      value: 'center top'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Rechts boven'),
      value: 'right top'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Links midden'),
      value: 'left center'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Midden'),
      value: 'center center'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Rechts midden'),
      value: 'right center'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Links onder'),
      value: 'left bottom'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Midden onder'),
      value: 'center bottom'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Rechts onder'),
      value: 'right bottom'
    }],
    onChange: value => setContainerBackgroundPosition(value)
  }))), containerBackgroundImage && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Achtergrond herhaling'),
    value: computedContainerBackgroundRepeat,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No-repeat'),
      value: 'no-repeat'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Repeat'),
      value: 'repeat'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Repeat-x'),
      value: 'repeat-x'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Repeat-y'),
      value: 'repeat-y'
    }],
    onChange: value => setContainerBackgroundRepeat(value)
  })), containerBackgroundImage && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Achtergrond grootte'),
    value: computedContainerBackgroundSize,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Auto'),
      value: 'auto'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Cover'),
      value: 'cover'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Contain'),
      value: 'contain'
    }],
    onChange: value => setContainerBackgroundSize(value)
  }))), computedBackgroundType === 'gradient' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.GradientPicker, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Gradient'),
    gradients: gradients,
    value: computedBackgroundGradientValue,
    onChange: value => setContainerBackgroundGradient({
      gradient: value
    })
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    className: "disabledPanel",
    title: "Achtergrond overlay",
    initialOpen: false
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    title: "Spatie",
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('row gap'),
    breakpoint: activeRowGapBreakpoint,
    onBreakpointChange: setActiveRowGapBreakpoint,
    afterBreakpoint: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, {
      className: "madeit-control-units"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
      isPressed: currentRowGapUnit === 'px',
      onClick: () => setAttributes({
        [rowGapUnitKey]: 'px',
        madeitHasUserEdits: true
      })
    }, "px"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
      isPressed: currentRowGapUnit === 'em',
      onClick: () => setAttributes({
        [rowGapUnitKey]: 'em',
        madeitHasUserEdits: true
      })
    }, "em"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
      isPressed: currentRowGapUnit === 'rem',
      onClick: () => setAttributes({
        [rowGapUnitKey]: 'rem',
        madeitHasUserEdits: true
      })
    }, "rem"))
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control-rangeRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
    label: "",
    value: typeof currentRowGapValue === 'number' ? currentRowGapValue : 0,
    onChange: value => setAttributes({
      [rowGapValueKey]: value,
      madeitHasUserEdits: true
    }),
    min: 0,
    max: 100
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    className: "madeit-control-rangeRow__reset",
    icon: "undo",
    variant: "tertiary",
    onClick: resetRowGap,
    showTooltip: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset Row Gap')
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ResponsiveBoxControl, {
    __next40pxDefaultSize: true,
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Padding'),
    breakpoint: activePaddingBreakpoint,
    onBreakpointChange: setActivePaddingBreakpoint,
    values: attributes?.[paddingValueKey],
    onChange: next => setAttributes({
      [paddingValueKey]: next
    }),
    onReset: () => setAttributes({
      [paddingValueKey]: undefined
    }),
    resetLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset padding')
    // allowReset={ true }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ResponsiveBoxControl, {
    __next40pxDefaultSize: true,
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Margin'),
    breakpoint: activeMarginBreakpoint,
    onBreakpointChange: setActiveMarginBreakpoint,
    values: attributes?.[marginValueKey],
    onChange: next => setAttributes({
      [marginValueKey]: next
    }),
    onReset: () => setAttributes({
      [marginValueKey]: undefined
    }),
    resetLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset margin')
    // allowReset={ true }
    ,
    inputProps: {
      min: -1000,
      max: 1000
    },
    sides: ['top', 'bottom']
  }))), activeTab === 'advanced' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ResponsiveVisibilityPanel, {
    title: "Responsive",
    initialOpen: true,
    hideOnDesktop: hideOnDesktop,
    hideOnTablet: hideOnTablet,
    hideOnMobile: hideOnMobile,
    setAttributes: setAttributes
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    className: "disabledPanel",
    title: "Binnenkomende animatie",
    initialOpen: false
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.BlockControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.BlockVerticalAlignmentToolbar, {
    onChange: updateAlignment,
    value: verticalAlignment
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: classesChild,
    style: styleChild
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `row madeit-container-row rows-${columnsCount || 0}`,
    style: rowStyle
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.InnerBlocks, {
    orientation: "horizontal",
    allowedBlocks: ALLOWED_BLOCKS
  }))))];
}
const ColumnsEditContainerWrapper = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.withDispatch)((dispatch, ownProps, registry) => ({
  /**
   * Update all child Column blocks with a new vertical alignment setting
   * based on whatever alignment is passed in. This allows change to parent
   * to overide anything set on a individual column basis.
   *
   * @param {string} verticalAlignment the vertical alignment setting
   */
  updateAlignment(verticalAlignment) {
    const {
      clientId,
      setAttributes
    } = ownProps;
    const {
      updateBlockAttributes
    } = dispatch('core/block-editor');
    const {
      getBlockOrder
    } = registry.select('core/block-editor');

    // Update own alignment.
    setAttributes({
      verticalAlignment
    });

    // Update all child Column Blocks to match
    const innerBlockClientIds = getBlockOrder(clientId);
    innerBlockClientIds.forEach(innerBlockClientId => {
      updateBlockAttributes(innerBlockClientId, {
        verticalAlignment
      });
    });
  },
  /**
   * Updates the column count, including necessary revisions to child Column
   * blocks to grant required or redistribute available space.
   *
   * @param {number} previousColumns Previous column count.
   * @param {number} newColumns      New column count.
   */
  updateColumns(previousColumns, newColumns) {
    const {
      clientId
    } = ownProps;
    const {
      replaceInnerBlocks
    } = dispatch('core/block-editor');
    const {
      getBlocks
    } = registry.select('core/block-editor');
    let innerBlocks = getBlocks(clientId);

    // Redistribute available width for existing inner blocks.
    const isAddingColumn = newColumns > previousColumns;
    if (isAddingColumn) {
      // If adding a new column, assign width to the new column equal to
      // as if it were `1 / columns` of the total available space.
      const newColumnWidth = (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.toWidthPrecision)(12 / newColumns);

      // Redistribute in consideration of pending block insertion as
      // constraining the available working width.
      const widths = (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.getRedistributedColumnWidths)(innerBlocks, 12 - newColumnWidth);
      innerBlocks = [...(0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.getMappedColumnWidths)(innerBlocks, widths), ...(0,lodash__WEBPACK_IMPORTED_MODULE_2__.times)(newColumns - previousColumns, () => {
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.createBlock)('madeit/block-content-column', {
          width: newColumnWidth
        });
      })];
    } else if (isAddingColumn) {
      innerBlocks = [...innerBlocks, ...(0,lodash__WEBPACK_IMPORTED_MODULE_2__.times)(newColumns - previousColumns, () => {
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.createBlock)('madeit/block-content-column');
      })];
    } else {
      // The removed column will be the last of the inner blocks.
      innerBlocks = (0,lodash__WEBPACK_IMPORTED_MODULE_2__.dropRight)(innerBlocks, previousColumns - newColumns);

      //if ( hasExplicitWidths ) {
      // Redistribute as if block is already removed.
      const widths = (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.getRedistributedColumnWidths)(innerBlocks, 12);
      innerBlocks = (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.getMappedColumnWidths)(innerBlocks, widths);
      //}
    }
    replaceInnerBlocks(clientId, innerBlocks, false);
  }
}))(ColumnsEditContainer);
const createBlocksFromInnerBlocksTemplate = innerBlocksTemplate => {
  return (0,lodash__WEBPACK_IMPORTED_MODULE_2__.map)(innerBlocksTemplate, ([name, attributes, innerBlocks = []]) => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.createBlock)(name, attributes, createBlocksFromInnerBlocksTemplate(innerBlocks)));
};
const ColumnsEdit = props => {
  const {
    clientId,
    attributes,
    setAttributes
  } = props;
  // Must be called unconditionally to keep hook order stable
  // when switching from placeholder → inner blocks.
  const placeholderBlockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.useBlockProps)();
  const {
    hasInnerBlocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.useSelect)(select => ({
    hasInnerBlocks: select('core/block-editor').getBlocks(clientId).length > 0
  }), [clientId]);
  const {
    replaceInnerBlocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.useDispatch)('core/block-editor');
  const didInitNewResponsiveDefaults = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useRef)(false);
  const columnsCount = attributes?.columnsCount;
  const flexDirectionTablet = attributes?.flexDirectionTablet;
  const flexDirectionMobile = attributes?.flexDirectionMobile;

  // New blocks (placeholder state) should default to column on tablet/mobile.
  // Existing blocks are left untouched (they already render as row via fallback
  // when tablet/mobile values are undefined).
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
    if (didInitNewResponsiveDefaults.current) return;
    didInitNewResponsiveDefaults.current = true;

    // Only apply defaults for truly new blocks (placeholder state).
    if (hasInnerBlocks) return;

    // If the block already has a layout chosen at least once, don't override.
    if (columnsCount !== undefined && columnsCount !== null) return;
    const shouldInitTablet = flexDirectionTablet === undefined || flexDirectionTablet === null;
    const shouldInitMobile = flexDirectionMobile === undefined || flexDirectionMobile === null;
    if (!shouldInitTablet && !shouldInitMobile) return;
    setAttributes({
      ...(shouldInitTablet ? {
        flexDirectionTablet: 'column'
      } : {}),
      ...(shouldInitMobile ? {
        flexDirectionMobile: 'column'
      } : {})
    });
  }, [hasInnerBlocks, columnsCount, flexDirectionTablet, flexDirectionMobile, setAttributes]);
  if (hasInnerBlocks) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ColumnsEditContainerWrapper, {
      ...props
    });
  }
  const defaultVariation = Array.isArray(_variations__WEBPACK_IMPORTED_MODULE_12__["default"]) ? _variations__WEBPACK_IMPORTED_MODULE_12__["default"].find(v => v?.isDefault) || _variations__WEBPACK_IMPORTED_MODULE_12__["default"][0] : undefined;
  const startEmpty = () => {
    replaceInnerBlocks(clientId, [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.createBlock)('madeit/block-content-column', {
      width: 12
    })], false);
  };
  const applyVariation = (nextVariation = defaultVariation) => {
    if (nextVariation?.attributes) {
      setAttributes(nextVariation.attributes);
    }
    if (nextVariation?.innerBlocks) {
      replaceInnerBlocks(clientId, createBlocksFromInnerBlocksTemplate(nextVariation.innerBlocks), false);
      return;
    }
    startEmpty();
  };

  // Merge custom class name into placeholder props.
  const mergedPlaceholderProps = {
    ...placeholderBlockProps,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(placeholderBlockProps.className, 'madeit-container-placeholder')
  };

  // Placeholder with layout options (local variations, not registered with core).
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...mergedPlaceholderProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-container-placeholder__inner"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-container-placeholder__header"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "madeit-container-placeholder__description"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Kies een layout om te starten.'))), Array.isArray(_variations__WEBPACK_IMPORTED_MODULE_12__["default"]) && _variations__WEBPACK_IMPORTED_MODULE_12__["default"].length > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-container-placeholder__variations"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "premium-blocks__placeholder-group"
  }, _variations__WEBPACK_IMPORTED_MODULE_12__["default"].map(variation => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    key: variation.name || variation.title,
    className: "premium-blocks__placeholder-item"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    className: "premium-blocks__placeholder-button",
    variant: "secondary",
    onClick: () => applyVariation(variation),
    "aria-label": variation.title || variation.name
  }, variation.icon)))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_7__.compose)([(0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.withColors)('containerBackgroundColor', 'rowTextColor', 'rowBackgroundColor')])(ColumnsEdit));

/***/ },

/***/ "./src/icon.js"
/*!*********************!*\
  !*** ./src/icon.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const {
  G,
  Path,
  SVG
} = wp.components;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  xmlnsXlink: "http://www.w3.org/1999/xlink",
  xmlnsSerif: "http://www.serif.com/",
  width: "100%",
  height: "100%",
  viewBox: "0 0 135 135",
  version: "1.1",
  xmlSpace: "preserve",
  style: {
    fillRule: 'evenodd',
    clipRule: 'evenodd',
    strokeLinejoin: 'round',
    strokeMiterlimit: 2
  }
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  transform: "matrix(1,0,0,1,-282.404386,-214.957044)"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  id: "SVGRepo_iconCarrier",
  transform: "matrix(7.458333,0,0,7.458333,260.029386,192.582044)"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  id: "\u5F62\u72B6",
  d: "M3,5C3,3.895 3.895,3 5,3L19,3C20.105,3 21,3.895 21,5L21,19C21,20.105 20.105,21 19,21L5,21C3.895,21 3,20.105 3,19L3,5ZM14,5L10,5L10,19L14,19L14,5ZM16,5L19,5L19,19L16,19L16,5ZM8,19L8,5L5,5L5,19L8,19Z",
  style: {
    fill: 'rgb(71,106,138)'
  }
})))));

/***/ },

/***/ "./src/index.js"
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../block.json */ "./block.json");
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./icon */ "./src/icon.js");
/* harmony import */ var _save_versions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./save-versions */ "./src/save-versions/index.js");







// Oude save versies importeren


/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
  icon: _icon__WEBPACK_IMPORTED_MODULE_5__["default"],
  //? Wanneer iemand block toevoegd -> Deze waarden worden automatisch toegevoegd aan de attributes van het block
  //? Deze waarden worden ook gebruikt als default waarden bij het renderen van het block
  //? Het veranderd de bestaande block niet!
  variations: [{
    name: 'madeit-default-responsive',
    title: _block_json__WEBPACK_IMPORTED_MODULE_4__.title,
    isDefault: true,
    scope: ['inserter'],
    attributes: {
      overflow: 'visible',
      flexDirection: 'row',
      flexDirectionTablet: 'column',
      flexDirectionMobile: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap',
      containerPaddingOnRow: true,
      columnsCount: 0,
      rowGap: 20,
      rowGapUnit: 'px',
      rowGapTablet: 20,
      rowGapUnitTablet: 'px',
      rowGapMobile: 20,
      rowGapUnitMobile: 'px'
    }
  }],
  getEditWrapperProps(attributes) {
    const {
      size
    } = attributes;
    if ('container-fluid' === size || 'container-content-boxed' === size) {
      return {
        'data-align': 'full'
      };
    }
    return {
      'data-align': 'container'
    };
  },
  // The "edit" property must be a valid function.
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  // The "save" property must be  valid function.
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"],
  deprecated: [{
    // Deprecated (2026-04-17): `size` default changed from `container`
    // to `container-content-boxed`. Keep old content without an explicit
    // `size` attribute valid by serializing with legacy fallback.
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV1,
    migrate: function (attributes) {
      const wrapperClassName = typeof attributes?.wrapperClassName === 'string' ? attributes.wrapperClassName : '';
      const wrapperTokens = wrapperClassName.trim().length ? wrapperClassName.trim().split(/\s+/) : [];
      const wrapperHasContainer = wrapperTokens.includes('container');
      const wrapperHasContainerFluid = wrapperTokens.includes('container-fluid');
      const isLegacyDefaultContainerMarkup = wrapperHasContainer && !wrapperHasContainerFluid;
      if (typeof attributes?.size === 'string' && attributes.size.length > 0 && attributes.size !== 'container-content-boxed' || !isLegacyDefaultContainerMarkup) {
        return attributes;
      }
      return {
        ...attributes,
        size: 'container'
      };
    }
  }, {
    // Deprecated (2026-04-08): spacing serialized entirely as CSS vars
    // (desktop/tablet/mobile). Kept for validation.
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV2,
    migrate: function (attributes) {
      return attributes;
    }
  }, {
    // Deprecated (2026-04-08): spacing was serialized as direct inline
    // margin/padding styles. Current save() uses CSS variables for
    // responsive padding/margin.
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV3,
    migrate: function (attributes) {
      return attributes;
    }
  }, {
    /** Deprecated (2026-03-26):
     * - Remove default css variables
     */
    isEligible: function (attributes) {
      const hasLegacyDefaultVars = typeof attributes?.rowGap === 'number' || typeof attributes?.rowGapTablet === 'number' || typeof attributes?.rowGapMobile === 'number' || typeof attributes?.flexDirection === 'string' || typeof attributes?.flexDirectionTablet === 'string' || typeof attributes?.flexDirectionMobile === 'string' || typeof attributes?.alignItems === 'string' || typeof attributes?.justifyContent === 'string' || typeof attributes?.flexWrap === 'string';
      return hasLegacyDefaultVars;
    },
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV4,
    migrate: function (attributes) {
      return attributes;
    }
  }, {
    // Deprecated (2026-03-17):
    // Same as the wrapper-padding legacy serializer, but without
    // explicit whitespace text nodes. This helps match older saved
    // content across different serialization histories.
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV5
  }, {
    // Deprecated (2026-03-17):
    // containerPadding used to be serialized on the outer wrapper
    // instead of `.madeit-container-row`.
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV6
  }, {
    // Deprecated (2026-03-09):
    // Boxed (`size: container`) used to serialize the container background
    // on the outer wrapper, without an inner `.container` wrapper.
    // Kept to avoid validation errors for existing content.
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV7
  }, {
    // Deprecated (very old markup):
    // - No `madeit-block-content--frontend` class on the wrapper
    // - Inner wrapper was a plain `.row` (no `madeit-container-row`, no data attrs)
    // Keep this so copy/pasting older blocks won't require recovery.
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV8
  }, {
    // Deprecated (legacy direct-row markup + overflow:visible + default flex vars):
    // Some older content was saved with:
    // - wrapper `.container` (not container-fluid)
    // - direct `.row.madeit-container-row` child
    // - `overflow:visible` serialized inline (even though it's the default)
    isEligible: function (attributes) {
      // Only target legacy content that now parses with the new default size
      // (`container-content-boxed`) but was saved as a boxed `.container` wrapper.
      if (attributes?.size && attributes.size !== 'container-content-boxed') {
        return false;
      }
      const wrapperClassName = typeof attributes?.wrapperClassName === 'string' ? attributes.wrapperClassName : '';

      // If the wrapper class cannot be derived (unexpected parser edge),
      // do not skip this variant: it is safe to try and will only match
      // if markup is identical.
      if (wrapperClassName.trim().length === 0) {
        return true;
      }
      const wrapperTokens = wrapperClassName.trim().split(/\s+/);
      const hasContainer = wrapperTokens.includes('container');
      const hasContainerFluid = wrapperTokens.includes('container-fluid');
      const hasFrontend = wrapperTokens.includes('madeit-block-content--frontend');
      return hasContainer && !hasContainerFluid && hasFrontend;
    },
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV14
  }, {
    // Deprecated (legacy boxed wrapper + inner container wrapper):
    // Some older content was saved with:
    // - wrapper `.container.madeit-block-content--frontend`
    // - inner `.container` wrapper
    // - `.row.madeit-container-row` inside that container (no `.col` wrapper)
    isEligible: function (attributes) {
      if (attributes?.size && attributes.size !== 'container-content-boxed') {
        return false;
      }
      const wrapperClassName = typeof attributes?.wrapperClassName === 'string' ? attributes.wrapperClassName : '';
      const wrapperTokens = wrapperClassName.trim().length ? wrapperClassName.trim().split(/\s+/) : [];
      const hasContainer = wrapperTokens.includes('container');
      const hasContainerFluid = wrapperTokens.includes('container-fluid');
      const hasFrontend = wrapperTokens.includes('madeit-block-content--frontend');

      // NOTE: older content often did not serialize `contentWidth` at all.
      // The structural signature we care about is `.container` (no fluid)
      // + `madeit-block-content--frontend` on the wrapper.
      return hasContainer && !hasContainerFluid && hasFrontend;
    },
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV15
  }, {
    // Deprecated (legacy markup):
    // - Wrapper *did* include `madeit-block-content--frontend`
    // - Inner wrapper *did* include `.madeit-container-row` + data attrs
    // - But `overflow:visible` was NOT serialized in the style attribute
    // - The inner row wrapper contained newline whitespace
    // Needed for older/copy-pasted content that predates the overflow serialization.
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV9
  }, {
    // Deprecated version (pre rowGap responsive vars):
    // Only the desktop row-gap var was serialized (tablet/mobile were ignored),
    // and the inner row wrapper contained newline whitespace.
    // Keep this to prevent "Try recovery" on existing content.
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV10
  }, {
    // Deprecated version (2026-02): matched a save() that always serialized
    // `background-color: transparent` when no explicit background was set.
    // Keeping this prevents "This block contains unexpected or invalid content"
    // for content saved during that period.
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV11
  }, {
    /**
     * Deprecated version (2026-02)
     */
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV12
  }, {
    supports: {
      html: false
    },
    attributes: {
      verticalAlignment: {
        type: "string"
      },
      containerBackgroundColor: {
        type: 'string'
      },
      customContainerBackgroundColor: {
        type: 'string'
      },
      size: {
        type: 'string',
        default: 'container'
      },
      containerMarginBottom: {
        type: 'number',
        default: 0
      },
      containerMarginTop: {
        type: 'number',
        default: 0
      },
      containerMarginLeft: {
        type: 'number',
        default: 0
      },
      containerMarginRight: {
        type: 'number',
        default: 0
      },
      containerPaddingTop: {
        type: 'number',
        default: 0
      },
      containerPaddingBottom: {
        type: 'number',
        default: 0
      },
      containerPaddingLeft: {
        type: 'number',
        default: 0
      },
      containerPaddingRight: {
        type: 'number',
        default: 0
      },
      rowBackgroundColor: {
        type: 'string'
      },
      customRowBackgroundColor: {
        type: 'string'
      },
      rowTextColor: {
        type: 'string'
      },
      customRowTextColor: {
        type: 'string'
      },
      rowMarginBottom: {
        type: 'number',
        default: 0
      },
      rowMarginTop: {
        type: 'number',
        default: 0
      },
      rowMarginLeft: {
        type: 'number',
        default: 0
      },
      rowMarginRight: {
        type: 'number',
        default: 0
      },
      rowPaddingTop: {
        type: 'number',
        default: 0
      },
      rowPaddingBottom: {
        type: 'number',
        default: 0
      },
      rowPaddingLeft: {
        type: 'number',
        default: 0
      },
      rowPaddingRight: {
        type: 'number',
        default: 0
      }
    },
    migrate(attributes) {
      return {
        containerPadding: {
          top: attributes.containerPaddingTop !== null && attributes.containerPaddingTop !== undefined ? attributes.containerPaddingTop + 'px' : undefined,
          bottom: attributes.containerPaddingBottom !== null && attributes.containerPaddingBottom !== undefined ? attributes.containerPaddingBottom + 'px' : undefined,
          left: attributes.containerPaddingLeft !== null && attributes.containerPaddingLeft !== undefined ? attributes.containerPaddingLeft + 'px' : undefined,
          right: attributes.containerPaddingRight !== null && attributes.containerPaddingRight !== undefined ? attributes.containerPaddingRight + 'px' : undefined
        },
        containerMargin: {
          top: attributes.containerMarginTop !== null && attributes.containerMarginTop !== undefined ? attributes.containerMarginTop + 'px' : undefined,
          bottom: attributes.containerMarginBottom !== null && attributes.containerMarginBottom !== undefined ? attributes.containerMarginBottom + 'px' : undefined,
          left: attributes.containerMarginLeft !== null && attributes.containerMarginLeft !== undefined ? attributes.containerMarginLeft + 'px' : undefined,
          right: attributes.containerMarginRight !== null && attributes.containerMarginRight !== undefined ? attributes.containerMarginRight + 'px' : undefined
        },
        rowPadding: {
          top: attributes.rowPaddingTop !== null && attributes.rowPaddingTop !== undefined ? attributes.rowPaddingTop + 'px' : undefined,
          bottom: attributes.rowPaddingBottom !== null && attributes.rowPaddingBottom !== undefined ? attributes.rowPaddingBottom + 'px' : undefined,
          left: attributes.rowPaddingLeft !== null && attributes.rowPaddingLeft !== undefined ? attributes.rowPaddingLeft + 'px' : undefined,
          right: attributes.rowPaddingRight !== null && attributes.rowPaddingRight !== undefined ? attributes.rowPaddingRight + 'px' : undefined
        },
        rowMargin: {
          top: attributes.rowMarginTop !== null && attributes.rowMarginTop !== undefined ? attributes.rowMarginTop + 'px' : undefined,
          bottom: attributes.rowMarginBottom !== null && attributes.rowMarginBottom !== undefined ? attributes.rowMarginBottom + 'px' : undefined,
          left: attributes.rowMarginLeft !== null && attributes.rowMarginLeft !== undefined ? attributes.rowMarginLeft + 'px' : undefined,
          right: attributes.rowMarginRight !== null && attributes.rowMarginRight !== undefined ? attributes.rowMarginRight + 'px' : undefined
        },
        size: attributes.size,
        verticalAlignment: attributes.verticalAlignment,
        containerBackgroundColor: attributes.containerBackgroundColor,
        customContainerBackgroundColor: attributes.customContainerBackgroundColor
      };
    },
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV13
  }]
});

/***/ },

/***/ "./src/save-versions/index.js"
/*!************************************!*\
  !*** ./src/save-versions/index.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   saveV1: () => (/* reexport safe */ _save_v1_size_default_container__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   saveV10: () => (/* reexport safe */ _save_v10_pre_rowgap_responsive_vars__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   saveV11: () => (/* reexport safe */ _save_v11_transparent_background_default__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   saveV12: () => (/* reexport safe */ _v1__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   saveV13: () => (/* reexport safe */ _save_v13_legacy_attributes__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   saveV14: () => (/* reexport safe */ _save_v14_legacy_direct_row_overflow_visible__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   saveV15: () => (/* reexport safe */ _save_v15_legacy_wrapper_container_inner_container__WEBPACK_IMPORTED_MODULE_14__["default"]),
/* harmony export */   saveV2: () => (/* reexport safe */ _save_2026_04_08_vars__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   saveV3: () => (/* reexport safe */ _save_2026_04_08__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   saveV4: () => (/* reexport safe */ _save_2026_03_26__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   saveV5: () => (/* reexport safe */ _save_padding_on_wrapper_min__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   saveV6: () => (/* reexport safe */ _save_padding_on_wrapper__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   saveV7: () => (/* reexport safe */ _save_v7_legacy_boxed_no_inner_container__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   saveV8: () => (/* reexport safe */ _save_v8_very_old_markup_plain_row__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   saveV9: () => (/* reexport safe */ _save_v9_legacy_no_overflow_serialized__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _save_v1_size_default_container__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./save-v1-size-default-container */ "./src/save-versions/save-v1-size-default-container.js");
/* harmony import */ var _save_2026_04_08_vars__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./save-2026-04-08-vars */ "./src/save-versions/save-2026-04-08-vars.js");
/* harmony import */ var _save_2026_04_08__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./save-2026-04-08 */ "./src/save-versions/save-2026-04-08.js");
/* harmony import */ var _save_2026_03_26__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save-2026-03-26 */ "./src/save-versions/save-2026-03-26.js");
/* harmony import */ var _save_padding_on_wrapper_min__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save-padding-on-wrapper-min */ "./src/save-versions/save-padding-on-wrapper-min.js");
/* harmony import */ var _save_padding_on_wrapper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./save-padding-on-wrapper */ "./src/save-versions/save-padding-on-wrapper.js");
/* harmony import */ var _save_v7_legacy_boxed_no_inner_container__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./save-v7-legacy-boxed-no-inner-container */ "./src/save-versions/save-v7-legacy-boxed-no-inner-container.js");
/* harmony import */ var _save_v8_very_old_markup_plain_row__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./save-v8-very-old-markup-plain-row */ "./src/save-versions/save-v8-very-old-markup-plain-row.js");
/* harmony import */ var _save_v9_legacy_no_overflow_serialized__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./save-v9-legacy-no-overflow-serialized */ "./src/save-versions/save-v9-legacy-no-overflow-serialized.js");
/* harmony import */ var _save_v10_pre_rowgap_responsive_vars__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./save-v10-pre-rowgap-responsive-vars */ "./src/save-versions/save-v10-pre-rowgap-responsive-vars.js");
/* harmony import */ var _save_v11_transparent_background_default__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./save-v11-transparent-background-default */ "./src/save-versions/save-v11-transparent-background-default.js");
/* harmony import */ var _v1__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./v1 */ "./src/save-versions/v1.js");
/* harmony import */ var _save_v13_legacy_attributes__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./save-v13-legacy-attributes */ "./src/save-versions/save-v13-legacy-attributes.js");
/* harmony import */ var _save_v14_legacy_direct_row_overflow_visible__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./save-v14-legacy-direct-row-overflow-visible */ "./src/save-versions/save-v14-legacy-direct-row-overflow-visible.js");
/* harmony import */ var _save_v15_legacy_wrapper_container_inner_container__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./save-v15-legacy-wrapper-container-inner-container */ "./src/save-versions/save-v15-legacy-wrapper-container-inner-container.js");
/**
 * Deprecated save implementations for the content-container block.
 *
 * Naming convention:
 * - `saveV1` is the most recent deprecated save in the `deprecated` array
 * - Higher numbers are progressively older.
 *
 * Keep these functions behavior-identical: they exist purely to avoid block
 * validation errors for already-saved content.
 */


















/***/ },

/***/ "./src/save-versions/save-2026-03-26.js"
/*!**********************************************!*\
  !*** ./src/save-versions/save-2026-03-26.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */




/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
function save(props) {
  const {
    wrapperClassName,
    directRowClassName,
    verticalAlignment,
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    size,
    contentWidth,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor,
    containerMargin,
    containerPadding,
    containerPaddingOnRow,
    rowMargin,
    rowPadding,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    rowGapTablet,
    rowGapUnitTablet,
    rowGapMobile,
    rowGapUnitMobile,
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = props.attributes;
  const {
    className
  } = props;

  // NOTE: Historically this block was saved without additional wrapper classes
  // and without layout-related inline CSS vars. To avoid block validation
  // failures on legacy/pasted content, we only serialize “enhanced” markup
  // when the corresponding attributes are explicitly set.

  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', rowTextColor) : undefined;
  const hasClassicBackground = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const computedBackgroundType = backgroundType || (hasClassicBackground ? 'classic' : undefined);
  var classes = className;
  var classesChild = '';
  var defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }

  // Legacy compatibility (2026-04-17 default change follow-up):
  // Some older content was saved with a `.container` wrapper while the block
  // had no explicit `size` attribute. After changing the default to
  // `container-content-boxed`, those blocks parse with the new default but
  // still carry the legacy wrapper classes from markup. In that case we must
  // serialize as `container` to avoid injecting `container-fluid` and the
  // boxed `.row > .col > .container > .row` structure, which triggers block
  // validation errors.
  const wrapperClassNameRaw = typeof wrapperClassName === 'string' ? wrapperClassName.trim() : '';
  if (wrapperClassNameRaw.length > 0) {
    const wrapperTokens = wrapperClassNameRaw.split(/\s+/);
    const wrapperHasContainer = wrapperTokens.includes('container');
    const wrapperHasContainerFluid = wrapperTokens.includes('container-fluid');
    if (defaultSize === 'container-content-boxed' && wrapperHasContainer && !wrapperHasContainerFluid) {
      defaultSize = 'container';
    }
  }
  const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
  const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
  const hasWrapperClassNameFromMarkup = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0;
  const wrapperHasFrontendClass = hasWrapperClassNameFromMarkup && wrapperClassName.split(/\s+/).includes(FRONTEND_WRAPPER_CLASS);

  // General legacy compatibility:
  // Older saved content may not include the frontend wrapper class at all
  // (regardless of `size`). When we can detect that from parsed markup,
  // we must not inject the class in `save()`, otherwise block validation
  // fails and the editor shows recovery prompts.
  const shouldUseLegacyWrapperClasses = hasWrapperClassNameFromMarkup && !wrapperHasFrontendClass;

  // Very old saved content (no frontend wrapper class) also did not include
  // the enhanced layout-related CSS variables. To keep block validation
  // stable, do not serialize these vars for that legacy markup.
  const shouldSerializeEnhancedLayoutVars = !shouldUseLegacyWrapperClasses;

  // Defaults from the block's default variation (`madeit-default-responsive`).
  // Older content could have these attribute values but did NOT serialize the
  // corresponding CSS vars. This deprecated save matches that behavior.
  const DEFAULT_ROW_GAP = 20;
  const DEFAULT_FLEX_DIRECTION_DESKTOP = 'row';
  const DEFAULT_FLEX_DIRECTION_TABLET = 'column';
  const DEFAULT_FLEX_DIRECTION_MOBILE = 'column';
  const DEFAULT_ALIGN_ITEMS_DESKTOP = 'stretch';
  const DEFAULT_JUSTIFY_CONTENT_DESKTOP = 'flex-start';
  const DEFAULT_FLEX_WRAP_DESKTOP = 'nowrap';

  // Legacy boxed markup (the one throwing validation errors):
  // - Wrapper did NOT include `madeit-block-content--frontend`
  // - `.row` was a direct child of the wrapper (no inner `.container`)
  // We only switch to legacy serialization when we can positively detect
  // legacy markup from the stored HTML (wrapperClassName derived attr).
  const shouldUseLegacyBoxedMarkup = defaultSize === 'container' && hasWrapperClassNameFromMarkup && !wrapperHasFrontendClass;

  // Keep the old direct-row detector as a secondary hint (some HTML parsers
  // won't support :scope selectors), but do not rely on it as the primary
  // switch.
  const hasDirectRowWrapper = typeof directRowClassName === 'string' && directRowClassName.trim().length > 0;
  const applyContainerBackgroundToInner = defaultSize === 'container' && !shouldUseLegacyBoxedMarkup && !hasDirectRowWrapper;
  const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
  const contentWidthResolvedRaw = hasContentWidth ? contentWidth : defaultSize === 'container-content-boxed' ? 'container' : outerSizeNormalized;
  let contentWidthNormalized = contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';

  // If the outer container is boxed, content cannot be full width.
  if (outerSizeNormalized === 'container') {
    contentWidthNormalized = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    [`container`]: 'container' === defaultSize,
    [`container-fluid`]: 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
    [`is-hidden-desktop`]: !!hideOnDesktop,
    [`is-hidden-tablet`]: !!hideOnTablet,
    [`is-hidden-mobile`]: !!hideOnMobile,
    ['madeit-block-content--frontend']: !shouldUseLegacyWrapperClasses
  });
  if (defaultSize !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize === 'container-content-boxed',
    [`container`]: contentWidthNormalized === 'container',
    [`container-fluid`]: contentWidthNormalized === 'container-fluid'
  });

  // Text color stays on the outer wrapper so it inherits everywhere.
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    [rowTextColorClass]: rowTextColorClass
  });

  // Container background should live on the inner container when the block
  // is boxed, so padding/margins on the wrapper don't get painted.
  // BUT: legacy boxed markup had no inner container wrapper, so in that case
  // we keep the background on the outer wrapper for validation compatibility.
  if (applyContainerBackgroundToInner) {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  } else {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  }
  const containerBackgroundStyle = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  var style = {};
  const toCssLength = (value, unit = 'px') => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return `${value}${unit || 'px'}`;
    }
    if (typeof value !== 'string') {
      return undefined;
    }
    const trimmed = value.trim();
    if (trimmed === '') {
      return undefined;
    }

    // Plain number string: treat as the number + provided unit.
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
      return `${trimmed}${unit || 'px'}`;
    }

    // Number with explicit unit (legacy): accept it as-is.
    if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(trimmed)) {
      return trimmed;
    }
    return undefined;
  };
  const hasBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0;
  const hasBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0;
  const hasBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0;
  const computedBackgroundGradient = props.attributes.containerBackgroundGradient || {
    gradient: ''
  };
  const computedBackgroundGradientValue = typeof computedBackgroundGradient?.gradient === 'string' && computedBackgroundGradient.gradient.trim().length > 0 ? computedBackgroundGradient.gradient : undefined;
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    containerBackgroundStyle.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (hasBackgroundPosition) {
      containerBackgroundStyle.backgroundPosition = containerBackgroundPosition;
    }
    if (hasBackgroundRepeat) {
      containerBackgroundStyle.backgroundRepeat = containerBackgroundRepeat;
    }
    if (hasBackgroundSize) {
      containerBackgroundStyle.backgroundSize = containerBackgroundSize;
    }
  }
  if (computedBackgroundType === 'gradient' && computedBackgroundGradientValue) {
    containerBackgroundStyle.backgroundImage = computedBackgroundGradientValue;
  }
  if (!applyContainerBackgroundToInner) {
    style = {
      ...style,
      ...containerBackgroundStyle
    };
  }

  // Apply overflow to outer wrapper (avoid serializing default `visible`).
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') {
    style.overflow = overflow;
  }

  // Responsive min-height via CSS variables.
  const minHeightDesktopCss = toCssLength(minHeight, minHeightUnit || 'px');
  if (minHeightDesktopCss !== undefined) {
    style['--madeit-min-height-desktop'] = minHeightDesktopCss;
  }
  const minHeightTabletCss = toCssLength(minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightTabletCss !== undefined) {
    style['--madeit-min-height-tablet'] = minHeightTabletCss;
  }
  const minHeightMobileCss = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightMobileCss !== undefined) {
    style['--madeit-min-height-mobile'] = minHeightMobileCss;
  }

  // Responsive max-width via CSS variables.
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }

  // Responsive row-gap via CSS variables.
  // Row gap via CSS variables.
  // Important for block validation stability: only serialize tablet/mobile overrides
  // when a desktop rowGap is explicitly set.
  if (shouldSerializeEnhancedLayoutVars) {
    const hasRowGapDesktop = typeof rowGap === 'number' && rowGap !== DEFAULT_ROW_GAP;
    if (hasRowGapDesktop) {
      style['--madeit-row-gap-desktop'] = `${rowGap}${rowGapUnit || 'px'}`;
      if (typeof rowGapTablet === 'number' && rowGapTablet !== DEFAULT_ROW_GAP) {
        style['--madeit-row-gap-tablet'] = `${rowGapTablet}${rowGapUnitTablet || 'px'}`;
      }
      if (typeof rowGapMobile === 'number' && rowGapMobile !== DEFAULT_ROW_GAP) {
        style['--madeit-row-gap-mobile'] = `${rowGapMobile}${rowGapUnitMobile || 'px'}`;
      }
    }
  }

  // Responsive flex-direction via CSS variables.
  if (shouldSerializeEnhancedLayoutVars) {
    if (typeof flexDirection === 'string' && flexDirection.length > 0 && flexDirection !== DEFAULT_FLEX_DIRECTION_DESKTOP) {
      style['--madeit-flex-direction-desktop'] = flexDirection;
    }
    if (typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 && flexDirectionTablet !== DEFAULT_FLEX_DIRECTION_TABLET) {
      style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
    }
    if (typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 && flexDirectionMobile !== DEFAULT_FLEX_DIRECTION_MOBILE) {
      style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
    }
  }

  // Responsive align-items / justify-content via CSS variables.
  if (shouldSerializeEnhancedLayoutVars) {
    if (typeof alignItems === 'string' && alignItems.length > 0 && alignItems !== DEFAULT_ALIGN_ITEMS_DESKTOP) {
      style['--madeit-align-items-desktop'] = alignItems;
    }
    if (typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0) {
      style['--madeit-align-items-tablet'] = alignItemsTablet;
    }
    if (typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0) {
      style['--madeit-align-items-mobile'] = alignItemsMobile;
    }
    if (typeof justifyContent === 'string' && justifyContent.length > 0 && justifyContent !== DEFAULT_JUSTIFY_CONTENT_DESKTOP) {
      style['--madeit-justify-content-desktop'] = justifyContent;
    }
    if (typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0) {
      style['--madeit-justify-content-tablet'] = justifyContentTablet;
    }
    if (typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0) {
      style['--madeit-justify-content-mobile'] = justifyContentMobile;
    }
  }

  // Responsive flex-wrap via CSS variables.
  if (shouldSerializeEnhancedLayoutVars) {
    if (typeof flexWrap === 'string' && flexWrap.length > 0 && flexWrap !== DEFAULT_FLEX_WRAP_DESKTOP) {
      style['--madeit-flex-wrap-desktop'] = flexWrap;
    }
    if (typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0) {
      style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
    }
    if (typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0) {
      style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
    }
  }
  if (containerMargin !== undefined && containerMargin.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin !== undefined && containerMargin.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  /*
  if(containerMargin !== undefined && containerMargin.left !== undefined) {
      style.marginLeft = containerMargin.left;
      style['--margin-left-desktop'] = containerMargin.left;
  }
  if(containerMargin !== undefined && containerMargin.right !== undefined) {
      style.marginRight = containerMargin.right;
      style['--margin-right-desktop'] = containerMargin.right;
  }
      */

  const shouldApplyContainerPaddingOnRow = containerPaddingOnRow === true;

  // Legacy compatibility: existing content may have containerPadding serialized
  // on the outer wrapper. Keep doing that unless explicitly migrated.
  if (!shouldApplyContainerPaddingOnRow) {
    if (containerPadding !== undefined && containerPadding.top !== undefined) {
      style.paddingTop = containerPadding.top;
    }
    if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
      style.paddingBottom = containerPadding.bottom;
    }
    if (containerPadding !== undefined && containerPadding.left !== undefined) {
      style.paddingLeft = containerPadding.left;
    }
    if (containerPadding !== undefined && containerPadding.right !== undefined) {
      style.paddingRight = containerPadding.right;
    }
  }

  // New behaviour: apply containerPadding on `.madeit-container-row`.
  const rowStyle = {};
  if (shouldApplyContainerPaddingOnRow) {
    if (containerPadding !== undefined && containerPadding.top !== undefined) {
      rowStyle.paddingTop = containerPadding.top;
    }
    if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
      rowStyle.paddingBottom = containerPadding.bottom;
    }
    if (containerPadding !== undefined && containerPadding.left !== undefined) {
      rowStyle.paddingLeft = containerPadding.left;
    }
    if (containerPadding !== undefined && containerPadding.right !== undefined) {
      rowStyle.paddingRight = containerPadding.right;
    }
  }
  var styleChild = {};
  if (defaultSize === 'container-content-boxed') {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-text-color': rowTextColor !== undefined,
      'has-background': rowBackgroundColor !== undefined,
      [rowBackgroundColorClass]: rowBackgroundColor !== undefined,
      [rowTextColorClass]: rowTextColor !== undefined
    });
    styleChild = {
      backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
      color: rowTextColorClass ? undefined : rowTextColorClass
    };
    if (rowMargin !== undefined && rowMargin.top !== undefined) {
      styleChild.marginTop = rowMargin.top;
    }
    if (rowMargin !== undefined && rowMargin.bottom !== undefined) {
      styleChild.marginBottom = rowMargin.bottom;
    }
    if (rowMargin !== undefined && rowMargin.left !== undefined) {
      styleChild.marginLeft = rowMargin.left;
    }
    if (rowMargin !== undefined && rowMargin.right !== undefined) {
      styleChild.marginRight = rowMargin.right;
    }
    if (rowPadding !== undefined && rowPadding.top !== undefined) {
      styleChild.paddingTop = rowPadding.top;
    }
    if (rowPadding !== undefined && rowPadding.bottom !== undefined) {
      styleChild.paddingBottom = rowPadding.bottom;
    }
    if (rowPadding !== undefined && rowPadding.left !== undefined) {
      styleChild.paddingLeft = rowPadding.left;
    }
    if (rowPadding !== undefined && rowPadding.right !== undefined) {
      styleChild.paddingRight = rowPadding.right;
    }
  } else {
    style.color = rowTextColorClass ? undefined : rowTextColorClass;
    if (applyContainerBackgroundToInner) {
      styleChild = {
        ...styleChild,
        ...containerBackgroundStyle
      };
    }
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
    className: classes,
    style: style
  });
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const dirDesktop = typeof flexDirection === 'string' && flexDirection.length > 0 ? flexDirection : 'row';
  const dirTablet = typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ? flexDirectionTablet : undefined;
  const dirMobile = typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ? flexDirectionMobile : undefined;
  const hasEnhancedRowWrapper = Number.isFinite(columnsCount) || typeof flexDirection === 'string' && flexDirection.length > 0 || typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 || typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0;
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const rowClassName = hasEnhancedRowWrapper ? `row madeit-container-row rows-${rowsCount}` : 'row';
  const baseRowProps = hasEnhancedRowWrapper ? {
    className: rowClassName,
    'data-madeit-dir': dirDesktop,
    'data-madeit-dir-tablet': dirTablet,
    'data-madeit-dir-mobile': dirMobile
  } : {
    className: rowClassName
  };
  const hasRowStyle = Object.keys(rowStyle).length > 0;
  const outerRowProps = hasRowStyle ? {
    ...baseRowProps,
    style: rowStyle
  } : baseRowProps;
  const innerRowProps = baseRowProps;
  if (size === 'container-content-boxed') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...innerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')))));
  } else {
    // Legacy markup: some older saved content had `.row` directly under the
    // wrapper (no inner `.container`). When detected via `directRowClassName`
    // (derived from stored HTML), serialize the same structure to avoid
    // block validation errors.
    if (hasDirectRowWrapper) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...outerRowProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n'));
    }
    const shouldWrapContent = outerSizeNormalized !== 'container' && hasContentWidth && contentWidthNormalized !== outerSizeNormalized;
    if (applyContainerBackgroundToInner) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classesChild,
        style: styleChild
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...outerRowProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')));
    }
    if (shouldWrapContent) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
          container: contentWidthNormalized === 'container',
          'container-fluid': contentWidthNormalized === 'container-fluid'
        })
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...outerRowProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')));
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n'));
  }
}

/***/ },

/***/ "./src/save-versions/save-2026-04-08-vars.js"
/*!***************************************************!*\
  !*** ./src/save-versions/save-2026-04-08-vars.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save20260408Vars)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */




/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */


/**
 * Deprecated save (2026-04-08): responsive spacing via CSS variables.
 *
 * This is the first responsive implementation that stored desktop/tablet/mobile
 * spacing entirely as CSS variables (no inline margin/padding properties).
 * Kept to avoid block validation errors if content was saved in that window.
 */
function save20260408Vars(props) {
  const {
    wrapperClassName,
    directRowClassName,
    verticalAlignment,
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    size,
    contentWidth,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor,
    containerMargin,
    containerMarginTablet,
    containerMarginMobile,
    containerPadding,
    containerPaddingTablet,
    containerPaddingMobile,
    containerPaddingOnRow,
    rowMargin,
    rowPadding,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    rowGapTablet,
    rowGapUnitTablet,
    rowGapMobile,
    rowGapUnitMobile,
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = props.attributes;
  const {
    className
  } = props;
  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', rowTextColor) : undefined;
  const hasClassicBackground = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const computedBackgroundType = backgroundType || (hasClassicBackground ? 'classic' : undefined);
  var classes = className;
  var classesChild = '';
  var defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }
  const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
  const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
  const hasWrapperClassNameFromMarkup = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0;
  const wrapperHasFrontendClass = hasWrapperClassNameFromMarkup && wrapperClassName.split(/\s+/).includes(FRONTEND_WRAPPER_CLASS);
  const shouldUseLegacyWrapperClasses = hasWrapperClassNameFromMarkup && !wrapperHasFrontendClass;
  const shouldUseLegacyBoxedMarkup = defaultSize === 'container' && hasWrapperClassNameFromMarkup && !wrapperHasFrontendClass;
  const hasDirectRowWrapper = typeof directRowClassName === 'string' && directRowClassName.trim().length > 0;
  const applyContainerBackgroundToInner = defaultSize === 'container' && !shouldUseLegacyBoxedMarkup && !hasDirectRowWrapper;
  const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
  const contentWidthResolvedRaw = hasContentWidth ? contentWidth : defaultSize === 'container-content-boxed' ? 'container' : outerSizeNormalized;
  let contentWidthNormalized = contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';
  if (outerSizeNormalized === 'container') {
    contentWidthNormalized = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    container: 'container' === defaultSize,
    'container-fluid': 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile,
    'madeit-block-content--frontend': !shouldUseLegacyWrapperClasses
  });
  if (defaultSize !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize === 'container-content-boxed',
    container: contentWidthNormalized === 'container',
    'container-fluid': contentWidthNormalized === 'container-fluid'
  });
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    [rowTextColorClass]: rowTextColorClass
  });
  if (applyContainerBackgroundToInner) {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  } else {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  }
  const containerBackgroundStyle = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  var style = {};
  const toCssLength = (value, unit = 'px') => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return `${value}${unit || 'px'}`;
    }
    if (typeof value !== 'string') {
      return undefined;
    }
    const trimmed = value.trim();
    if (trimmed === '') {
      return undefined;
    }
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
      return `${trimmed}${unit || 'px'}`;
    }
    if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(trimmed)) {
      return trimmed;
    }
    return undefined;
  };
  const hasBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0;
  const hasBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0;
  const hasBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0;
  const computedBackgroundGradient = props.attributes.containerBackgroundGradient || {
    gradient: ''
  };
  const computedBackgroundGradientValue = typeof computedBackgroundGradient?.gradient === 'string' && computedBackgroundGradient.gradient.trim().length > 0 ? computedBackgroundGradient.gradient : undefined;
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    containerBackgroundStyle.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (hasBackgroundPosition) {
      containerBackgroundStyle.backgroundPosition = containerBackgroundPosition;
    }
    if (hasBackgroundRepeat) {
      containerBackgroundStyle.backgroundRepeat = containerBackgroundRepeat;
    }
    if (hasBackgroundSize) {
      containerBackgroundStyle.backgroundSize = containerBackgroundSize;
    }
  }
  if (computedBackgroundType === 'gradient' && computedBackgroundGradientValue) {
    containerBackgroundStyle.backgroundImage = computedBackgroundGradientValue;
  }
  if (!applyContainerBackgroundToInner) {
    style = {
      ...style,
      ...containerBackgroundStyle
    };
  }
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') {
    style.overflow = overflow;
  }
  const minHeightDesktopCss = toCssLength(minHeight, minHeightUnit || 'px');
  if (minHeightDesktopCss !== undefined) {
    style['--madeit-min-height-desktop'] = minHeightDesktopCss;
  }
  const minHeightTabletCss = toCssLength(minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightTabletCss !== undefined) {
    style['--madeit-min-height-tablet'] = minHeightTabletCss;
  }
  const minHeightMobileCss = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightMobileCss !== undefined) {
    style['--madeit-min-height-mobile'] = minHeightMobileCss;
  }
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }
  const hasRowGapDesktop = typeof rowGap === 'number';
  if (hasRowGapDesktop) {
    const rowGapDesktopCss = `${rowGap}${rowGapUnit || 'px'}`;
    if (rowGapDesktopCss !== '20px') {
      style['--madeit-row-gap-desktop'] = rowGapDesktopCss;
    }
    if (typeof rowGapTablet === 'number') {
      const rowGapTabletCss = `${rowGapTablet}${rowGapUnitTablet || 'px'}`;
      if (rowGapTabletCss !== '20px') {
        style['--madeit-row-gap-tablet'] = rowGapTabletCss;
      }
    }
    if (typeof rowGapMobile === 'number') {
      const rowGapMobileCss = `${rowGapMobile}${rowGapUnitMobile || 'px'}`;
      if (rowGapMobileCss !== '20px') {
        style['--madeit-row-gap-mobile'] = rowGapMobileCss;
      }
    }
  }
  if (typeof flexDirection === 'string' && flexDirection.length > 0 && flexDirection !== 'row') {
    style['--madeit-flex-direction-desktop'] = flexDirection;
  }
  if (typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 && flexDirectionTablet !== 'column') {
    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
  }
  if (typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 && flexDirectionMobile !== 'column') {
    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
  }
  if (typeof alignItems === 'string' && alignItems.length > 0 && alignItems !== 'stretch') {
    style['--madeit-align-items-desktop'] = alignItems;
  }
  if (typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0) {
    style['--madeit-align-items-tablet'] = alignItemsTablet;
  }
  if (typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0) {
    style['--madeit-align-items-mobile'] = alignItemsMobile;
  }
  if (typeof justifyContent === 'string' && justifyContent.length > 0 && justifyContent !== 'flex-start') {
    style['--madeit-justify-content-desktop'] = justifyContent;
  }
  if (typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0) {
    style['--madeit-justify-content-tablet'] = justifyContentTablet;
  }
  if (typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0) {
    style['--madeit-justify-content-mobile'] = justifyContentMobile;
  }
  if (typeof flexWrap === 'string' && flexWrap.length > 0 && flexWrap !== 'nowrap') {
    style['--madeit-flex-wrap-desktop'] = flexWrap;
  }
  if (typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0) {
    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
  }
  if (typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0) {
    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
  }
  const setCssVarIfDefined = (targetStyle, key, value) => {
    if (value === undefined || value === null) return;
    if (typeof value !== 'string') return;
    const trimmed = value.trim();
    if (trimmed === '') return;
    targetStyle[key] = trimmed;
  };
  const setSpacingVars = (targetStyle, prefix, spacing, breakpoint) => {
    if (!spacing || typeof spacing !== 'object') return;
    setCssVarIfDefined(targetStyle, `--${prefix}-top-${breakpoint}`, spacing.top);
    setCssVarIfDefined(targetStyle, `--${prefix}-right-${breakpoint}`, spacing.right);
    setCssVarIfDefined(targetStyle, `--${prefix}-bottom-${breakpoint}`, spacing.bottom);
    setCssVarIfDefined(targetStyle, `--${prefix}-left-${breakpoint}`, spacing.left);
  };
  if (containerMargin && typeof containerMargin === 'object') {
    setCssVarIfDefined(style, '--madeit-container-margin-top-desktop', containerMargin.top);
    setCssVarIfDefined(style, '--madeit-container-margin-bottom-desktop', containerMargin.bottom);
  }
  if (containerMarginTablet && typeof containerMarginTablet === 'object') {
    setCssVarIfDefined(style, '--madeit-container-margin-top-tablet', containerMarginTablet.top);
    setCssVarIfDefined(style, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom);
  }
  if (containerMarginMobile && typeof containerMarginMobile === 'object') {
    setCssVarIfDefined(style, '--madeit-container-margin-top-mobile', containerMarginMobile.top);
    setCssVarIfDefined(style, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom);
  }
  const shouldApplyContainerPaddingOnRow = containerPaddingOnRow === true;
  const rowStyle = {};
  if (shouldApplyContainerPaddingOnRow) {
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPadding, 'desktop');
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile');
  } else {
    setSpacingVars(style, 'madeit-container-padding', containerPadding, 'desktop');
    setSpacingVars(style, 'madeit-container-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(style, 'madeit-container-padding', containerPaddingMobile, 'mobile');
  }
  var styleChild = {};
  if (defaultSize === 'container-content-boxed') {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-text-color': rowTextColor !== undefined,
      'has-background': rowBackgroundColor !== undefined,
      [rowBackgroundColorClass]: rowBackgroundColor !== undefined,
      [rowTextColorClass]: rowTextColor !== undefined
    });
    styleChild = {
      backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
      color: rowTextColorClass ? undefined : rowTextColorClass
    };
    if (rowMargin !== undefined && rowMargin.top !== undefined) {
      styleChild.marginTop = rowMargin.top;
    }
    if (rowMargin !== undefined && rowMargin.bottom !== undefined) {
      styleChild.marginBottom = rowMargin.bottom;
    }
    if (rowMargin !== undefined && rowMargin.left !== undefined) {
      styleChild.marginLeft = rowMargin.left;
    }
    if (rowMargin !== undefined && rowMargin.right !== undefined) {
      styleChild.marginRight = rowMargin.right;
    }
    if (rowPadding !== undefined && rowPadding.top !== undefined) {
      styleChild.paddingTop = rowPadding.top;
    }
    if (rowPadding !== undefined && rowPadding.bottom !== undefined) {
      styleChild.paddingBottom = rowPadding.bottom;
    }
    if (rowPadding !== undefined && rowPadding.left !== undefined) {
      styleChild.paddingLeft = rowPadding.left;
    }
    if (rowPadding !== undefined && rowPadding.right !== undefined) {
      styleChild.paddingRight = rowPadding.right;
    }
  } else {
    style.color = rowTextColorClass ? undefined : rowTextColorClass;
    if (applyContainerBackgroundToInner) {
      styleChild = {
        ...styleChild,
        ...containerBackgroundStyle
      };
    }
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
    className: classes,
    style: style
  });
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const dirDesktop = typeof flexDirection === 'string' && flexDirection.length > 0 ? flexDirection : 'row';
  const dirTablet = typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ? flexDirectionTablet : undefined;
  const dirMobile = typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ? flexDirectionMobile : undefined;
  const hasEnhancedRowWrapper = Number.isFinite(columnsCount) || typeof flexDirection === 'string' && flexDirection.length > 0 || typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 || typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0;
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const rowClassName = hasEnhancedRowWrapper ? `row madeit-container-row rows-${rowsCount}` : 'row';
  const baseRowProps = hasEnhancedRowWrapper ? {
    className: rowClassName,
    'data-madeit-dir': dirDesktop,
    'data-madeit-dir-tablet': dirTablet,
    'data-madeit-dir-mobile': dirMobile
  } : {
    className: rowClassName
  };
  const hasRowStyle = Object.keys(rowStyle).length > 0;
  const outerRowProps = hasRowStyle ? {
    ...baseRowProps,
    style: rowStyle
  } : baseRowProps;
  const innerRowProps = baseRowProps;
  if (size === 'container-content-boxed') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...innerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')))));
  }
  if (hasDirectRowWrapper) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n'));
  }
  const shouldWrapContent = outerSizeNormalized !== 'container' && hasContentWidth && contentWidthNormalized !== outerSizeNormalized;
  if (applyContainerBackgroundToInner) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')));
  }
  if (shouldWrapContent) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        container: contentWidthNormalized === 'container',
        'container-fluid': contentWidthNormalized === 'container-fluid'
      })
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...outerRowProps
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n'));
}

/***/ },

/***/ "./src/save-versions/save-2026-04-08.js"
/*!**********************************************!*\
  !*** ./src/save-versions/save-2026-04-08.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save20260408)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */




/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */


/**
 * Deprecated save (2026-04-08): legacy spacing serialization
 *
 * This version keeps `containerMargin`/`containerPadding` serialized as direct
 * inline styles (marginTop/paddingTop/etc). It exists to avoid block validation
 * errors after switching the current save() implementation to CSS variables for
 * responsive spacing.
 */
function save20260408(props) {
  const {
    wrapperClassName,
    directRowClassName,
    verticalAlignment,
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    size,
    contentWidth,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor,
    containerMargin,
    containerPadding,
    containerPaddingOnRow,
    rowMargin,
    rowPadding,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    rowGapTablet,
    rowGapUnitTablet,
    rowGapMobile,
    rowGapUnitMobile,
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = props.attributes;
  const {
    className
  } = props;
  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', rowTextColor) : undefined;
  const hasClassicBackground = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const computedBackgroundType = backgroundType || (hasClassicBackground ? 'classic' : undefined);
  var classes = className;
  var classesChild = '';
  var defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }
  const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
  const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
  const hasWrapperClassNameFromMarkup = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0;
  const wrapperHasFrontendClass = hasWrapperClassNameFromMarkup && wrapperClassName.split(/\s+/).includes(FRONTEND_WRAPPER_CLASS);
  const shouldUseLegacyWrapperClasses = hasWrapperClassNameFromMarkup && !wrapperHasFrontendClass;
  const shouldUseLegacyBoxedMarkup = defaultSize === 'container' && hasWrapperClassNameFromMarkup && !wrapperHasFrontendClass;
  const hasDirectRowWrapper = typeof directRowClassName === 'string' && directRowClassName.trim().length > 0;
  const applyContainerBackgroundToInner = defaultSize === 'container' && !shouldUseLegacyBoxedMarkup && !hasDirectRowWrapper;
  const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
  const contentWidthResolvedRaw = hasContentWidth ? contentWidth : defaultSize === 'container-content-boxed' ? 'container' : outerSizeNormalized;
  let contentWidthNormalized = contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';
  if (outerSizeNormalized === 'container') {
    contentWidthNormalized = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    container: 'container' === defaultSize,
    'container-fluid': 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile,
    'madeit-block-content--frontend': !shouldUseLegacyWrapperClasses
  });
  if (defaultSize !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize === 'container-content-boxed',
    container: contentWidthNormalized === 'container',
    'container-fluid': contentWidthNormalized === 'container-fluid'
  });
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    [rowTextColorClass]: rowTextColorClass
  });
  if (applyContainerBackgroundToInner) {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  } else {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  }
  const containerBackgroundStyle = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  var style = {};
  const toCssLength = (value, unit = 'px') => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return `${value}${unit || 'px'}`;
    }
    if (typeof value !== 'string') {
      return undefined;
    }
    const trimmed = value.trim();
    if (trimmed === '') {
      return undefined;
    }
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
      return `${trimmed}${unit || 'px'}`;
    }
    if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(trimmed)) {
      return trimmed;
    }
    return undefined;
  };
  const hasBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0;
  const hasBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0;
  const hasBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0;
  const computedBackgroundGradient = props.attributes.containerBackgroundGradient || {
    gradient: ''
  };
  const computedBackgroundGradientValue = typeof computedBackgroundGradient?.gradient === 'string' && computedBackgroundGradient.gradient.trim().length > 0 ? computedBackgroundGradient.gradient : undefined;
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    containerBackgroundStyle.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (hasBackgroundPosition) {
      containerBackgroundStyle.backgroundPosition = containerBackgroundPosition;
    }
    if (hasBackgroundRepeat) {
      containerBackgroundStyle.backgroundRepeat = containerBackgroundRepeat;
    }
    if (hasBackgroundSize) {
      containerBackgroundStyle.backgroundSize = containerBackgroundSize;
    }
  }
  if (computedBackgroundType === 'gradient' && computedBackgroundGradientValue) {
    containerBackgroundStyle.backgroundImage = computedBackgroundGradientValue;
  }
  if (!applyContainerBackgroundToInner) {
    style = {
      ...style,
      ...containerBackgroundStyle
    };
  }
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') {
    style.overflow = overflow;
  }
  const minHeightDesktopCss = toCssLength(minHeight, minHeightUnit || 'px');
  if (minHeightDesktopCss !== undefined) {
    style['--madeit-min-height-desktop'] = minHeightDesktopCss;
  }
  const minHeightTabletCss = toCssLength(minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightTabletCss !== undefined) {
    style['--madeit-min-height-tablet'] = minHeightTabletCss;
  }
  const minHeightMobileCss = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightMobileCss !== undefined) {
    style['--madeit-min-height-mobile'] = minHeightMobileCss;
  }
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }
  const hasRowGapDesktop = typeof rowGap === 'number';
  if (hasRowGapDesktop) {
    const rowGapDesktopCss = `${rowGap}${rowGapUnit || 'px'}`;
    if (rowGapDesktopCss !== '20px') {
      style['--madeit-row-gap-desktop'] = rowGapDesktopCss;
    }
    if (typeof rowGapTablet === 'number') {
      const rowGapTabletCss = `${rowGapTablet}${rowGapUnitTablet || 'px'}`;
      if (rowGapTabletCss !== '20px') {
        style['--madeit-row-gap-tablet'] = rowGapTabletCss;
      }
    }
    if (typeof rowGapMobile === 'number') {
      const rowGapMobileCss = `${rowGapMobile}${rowGapUnitMobile || 'px'}`;
      if (rowGapMobileCss !== '20px') {
        style['--madeit-row-gap-mobile'] = rowGapMobileCss;
      }
    }
  }
  if (typeof flexDirection === 'string' && flexDirection.length > 0 && flexDirection !== 'row') {
    style['--madeit-flex-direction-desktop'] = flexDirection;
  }
  if (typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 && flexDirectionTablet !== 'column') {
    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
  }
  if (typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 && flexDirectionMobile !== 'column') {
    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
  }
  if (typeof alignItems === 'string' && alignItems.length > 0 && alignItems !== 'stretch') {
    style['--madeit-align-items-desktop'] = alignItems;
  }
  if (typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0) {
    style['--madeit-align-items-tablet'] = alignItemsTablet;
  }
  if (typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0) {
    style['--madeit-align-items-mobile'] = alignItemsMobile;
  }
  if (typeof justifyContent === 'string' && justifyContent.length > 0 && justifyContent !== 'flex-start') {
    style['--madeit-justify-content-desktop'] = justifyContent;
  }
  if (typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0) {
    style['--madeit-justify-content-tablet'] = justifyContentTablet;
  }
  if (typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0) {
    style['--madeit-justify-content-mobile'] = justifyContentMobile;
  }
  if (typeof flexWrap === 'string' && flexWrap.length > 0 && flexWrap !== 'nowrap') {
    style['--madeit-flex-wrap-desktop'] = flexWrap;
  }
  if (typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0) {
    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
  }
  if (typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0) {
    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
  }
  if (containerMargin !== undefined && containerMargin.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin !== undefined && containerMargin.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  const shouldApplyContainerPaddingOnRow = containerPaddingOnRow === true;
  if (!shouldApplyContainerPaddingOnRow) {
    if (containerPadding !== undefined && containerPadding.top !== undefined) {
      style.paddingTop = containerPadding.top;
    }
    if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
      style.paddingBottom = containerPadding.bottom;
    }
    if (containerPadding !== undefined && containerPadding.left !== undefined) {
      style.paddingLeft = containerPadding.left;
    }
    if (containerPadding !== undefined && containerPadding.right !== undefined) {
      style.paddingRight = containerPadding.right;
    }
  }
  const rowStyle = {};
  if (shouldApplyContainerPaddingOnRow) {
    if (containerPadding !== undefined && containerPadding.top !== undefined) {
      rowStyle.paddingTop = containerPadding.top;
    }
    if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
      rowStyle.paddingBottom = containerPadding.bottom;
    }
    if (containerPadding !== undefined && containerPadding.left !== undefined) {
      rowStyle.paddingLeft = containerPadding.left;
    }
    if (containerPadding !== undefined && containerPadding.right !== undefined) {
      rowStyle.paddingRight = containerPadding.right;
    }
  }
  var styleChild = {};
  if (defaultSize === 'container-content-boxed') {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-text-color': rowTextColor !== undefined,
      'has-background': rowBackgroundColor !== undefined,
      [rowBackgroundColorClass]: rowBackgroundColor !== undefined,
      [rowTextColorClass]: rowTextColor !== undefined
    });
    styleChild = {
      backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
      color: rowTextColorClass ? undefined : rowTextColorClass
    };
    if (rowMargin !== undefined && rowMargin.top !== undefined) {
      styleChild.marginTop = rowMargin.top;
    }
    if (rowMargin !== undefined && rowMargin.bottom !== undefined) {
      styleChild.marginBottom = rowMargin.bottom;
    }
    if (rowMargin !== undefined && rowMargin.left !== undefined) {
      styleChild.marginLeft = rowMargin.left;
    }
    if (rowMargin !== undefined && rowMargin.right !== undefined) {
      styleChild.marginRight = rowMargin.right;
    }
    if (rowPadding !== undefined && rowPadding.top !== undefined) {
      styleChild.paddingTop = rowPadding.top;
    }
    if (rowPadding !== undefined && rowPadding.bottom !== undefined) {
      styleChild.paddingBottom = rowPadding.bottom;
    }
    if (rowPadding !== undefined && rowPadding.left !== undefined) {
      styleChild.paddingLeft = rowPadding.left;
    }
    if (rowPadding !== undefined && rowPadding.right !== undefined) {
      styleChild.paddingRight = rowPadding.right;
    }
  } else {
    style.color = rowTextColorClass ? undefined : rowTextColorClass;
    if (applyContainerBackgroundToInner) {
      styleChild = {
        ...styleChild,
        ...containerBackgroundStyle
      };
    }
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
    className: classes,
    style: style
  });
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const dirDesktop = typeof flexDirection === 'string' && flexDirection.length > 0 ? flexDirection : 'row';
  const dirTablet = typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ? flexDirectionTablet : undefined;
  const dirMobile = typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ? flexDirectionMobile : undefined;
  const hasEnhancedRowWrapper = Number.isFinite(columnsCount) || typeof flexDirection === 'string' && flexDirection.length > 0 || typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 || typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0;
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const rowClassName = hasEnhancedRowWrapper ? `row madeit-container-row rows-${rowsCount}` : 'row';
  const baseRowProps = hasEnhancedRowWrapper ? {
    className: rowClassName,
    'data-madeit-dir': dirDesktop,
    'data-madeit-dir-tablet': dirTablet,
    'data-madeit-dir-mobile': dirMobile
  } : {
    className: rowClassName
  };
  const hasRowStyle = Object.keys(rowStyle).length > 0;
  const outerRowProps = hasRowStyle ? {
    ...baseRowProps,
    style: rowStyle
  } : baseRowProps;
  const innerRowProps = baseRowProps;
  if (size === 'container-content-boxed') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...innerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')))));
  }
  if (hasDirectRowWrapper) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n'));
  }
  const shouldWrapContent = outerSizeNormalized !== 'container' && hasContentWidth && contentWidthNormalized !== outerSizeNormalized;
  if (applyContainerBackgroundToInner) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')));
  }
  if (shouldWrapContent) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        container: contentWidthNormalized === 'container',
        'container-fluid': contentWidthNormalized === 'container-fluid'
      })
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...outerRowProps
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n'));
}

/***/ },

/***/ "./src/save-versions/save-padding-on-wrapper-min.js"
/*!**********************************************************!*\
  !*** ./src/save-versions/save-padding-on-wrapper-min.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */




/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
function save(props) {
  const {
    wrapperClassName,
    directRowClassName,
    verticalAlignment,
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    size,
    contentWidth,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor,
    containerMargin,
    containerPadding,
    rowMargin,
    rowPadding,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    rowGapTablet,
    rowGapUnitTablet,
    rowGapMobile,
    rowGapUnitMobile,
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = props.attributes;
  const {
    className
  } = props;

  // NOTE: Historically this block was saved without additional wrapper classes
  // and without layout-related inline CSS vars. To avoid block validation
  // failures on legacy/pasted content, we only serialize “enhanced” markup
  // when the corresponding attributes are explicitly set.

  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', rowTextColor) : undefined;
  const hasClassicBackground = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const computedBackgroundType = backgroundType || (hasClassicBackground ? 'classic' : undefined);
  var classes = className;
  var classesChild = '';
  var defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }
  const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
  const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
  const hasWrapperClassNameFromMarkup = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0;
  const wrapperHasFrontendClass = hasWrapperClassNameFromMarkup && wrapperClassName.split(/\s+/).includes(FRONTEND_WRAPPER_CLASS);

  // Legacy boxed markup (the one throwing validation errors):
  // - Wrapper did NOT include `madeit-block-content--frontend`
  // - `.row` was a direct child of the wrapper (no inner `.container`)
  // We only switch to legacy serialization when we can positively detect
  // legacy markup from the stored HTML (wrapperClassName derived attr).
  const shouldUseLegacyBoxedMarkup = defaultSize === 'container' && hasWrapperClassNameFromMarkup && !wrapperHasFrontendClass;

  // Keep the old direct-row detector as a secondary hint (some HTML parsers
  // won't support :scope selectors), but do not rely on it as the primary
  // switch.
  const hasDirectRowWrapper = typeof directRowClassName === 'string' && directRowClassName.trim().length > 0;
  const applyContainerBackgroundToInner = defaultSize === 'container' && !shouldUseLegacyBoxedMarkup;
  const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
  const contentWidthResolvedRaw = hasContentWidth ? contentWidth : defaultSize === 'container-content-boxed' ? 'container' : outerSizeNormalized;
  let contentWidthNormalized = contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';

  // If the outer container is boxed, content cannot be full width.
  if (outerSizeNormalized === 'container') {
    contentWidthNormalized = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    [`container`]: 'container' === defaultSize,
    [`container-fluid`]: 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
    [`is-hidden-desktop`]: !!hideOnDesktop,
    [`is-hidden-tablet`]: !!hideOnTablet,
    [`is-hidden-mobile`]: !!hideOnMobile,
    ['madeit-block-content--frontend']: !shouldUseLegacyBoxedMarkup
  });
  if (defaultSize !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize === 'container-content-boxed',
    [`container`]: contentWidthNormalized === 'container',
    [`container-fluid`]: contentWidthNormalized === 'container-fluid'
  });

  // Text color stays on the outer wrapper so it inherits everywhere.
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    [rowTextColorClass]: rowTextColorClass
  });

  // Container background should live on the inner container when the block
  // is boxed, so padding/margins on the wrapper don't get painted.
  // BUT: legacy boxed markup had no inner container wrapper, so in that case
  // we keep the background on the outer wrapper for validation compatibility.
  if (applyContainerBackgroundToInner) {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  } else {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  }
  const containerBackgroundStyle = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  var style = {};
  const toCssLength = (value, unit = 'px') => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return `${value}${unit || 'px'}`;
    }
    if (typeof value !== 'string') {
      return undefined;
    }
    const trimmed = value.trim();
    if (trimmed === '') {
      return undefined;
    }

    // Plain number string: treat as the number + provided unit.
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
      return `${trimmed}${unit || 'px'}`;
    }

    // Number with explicit unit (legacy): accept it as-is.
    if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(trimmed)) {
      return trimmed;
    }
    return undefined;
  };
  const hasBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0;
  const hasBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0;
  const hasBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0;
  const computedBackgroundGradient = props.attributes.containerBackgroundGradient || {
    gradient: ''
  };
  const computedBackgroundGradientValue = typeof computedBackgroundGradient?.gradient === 'string' && computedBackgroundGradient.gradient.trim().length > 0 ? computedBackgroundGradient.gradient : undefined;
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    containerBackgroundStyle.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (hasBackgroundPosition) {
      containerBackgroundStyle.backgroundPosition = containerBackgroundPosition;
    }
    if (hasBackgroundRepeat) {
      containerBackgroundStyle.backgroundRepeat = containerBackgroundRepeat;
    }
    if (hasBackgroundSize) {
      containerBackgroundStyle.backgroundSize = containerBackgroundSize;
    }
  }
  if (computedBackgroundType === 'gradient' && computedBackgroundGradientValue) {
    containerBackgroundStyle.backgroundImage = computedBackgroundGradientValue;
  }
  if (!applyContainerBackgroundToInner) {
    style = {
      ...style,
      ...containerBackgroundStyle
    };
  }

  // Apply overflow to outer wrapper (avoid serializing default `visible`).
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') {
    style.overflow = overflow;
  }

  // Responsive min-height via CSS variables.
  const minHeightDesktopCss = toCssLength(minHeight, minHeightUnit || 'px');
  if (minHeightDesktopCss !== undefined) {
    style['--madeit-min-height-desktop'] = minHeightDesktopCss;
  }
  const minHeightTabletCss = toCssLength(minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightTabletCss !== undefined) {
    style['--madeit-min-height-tablet'] = minHeightTabletCss;
  }
  const minHeightMobileCss = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightMobileCss !== undefined) {
    style['--madeit-min-height-mobile'] = minHeightMobileCss;
  }

  // Responsive max-width via CSS variables.
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }

  // Responsive row-gap via CSS variables.
  // Row gap via CSS variables.
  // Important for block validation stability: only serialize tablet/mobile overrides
  // when a desktop rowGap is explicitly set.
  const hasRowGapDesktop = typeof rowGap === 'number';
  if (hasRowGapDesktop) {
    style['--madeit-row-gap-desktop'] = `${rowGap}${rowGapUnit || 'px'}`;
    if (typeof rowGapTablet === 'number') {
      style['--madeit-row-gap-tablet'] = `${rowGapTablet}${rowGapUnitTablet || 'px'}`;
    }
    if (typeof rowGapMobile === 'number') {
      style['--madeit-row-gap-mobile'] = `${rowGapMobile}${rowGapUnitMobile || 'px'}`;
    }
  }

  // Responsive flex-direction via CSS variables (only if explicitly set).
  if (typeof flexDirection === 'string' && flexDirection.length > 0) {
    style['--madeit-flex-direction-desktop'] = flexDirection;
  }
  if (typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0) {
    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
  }
  if (typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0) {
    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
  }

  // Responsive align-items / justify-content via CSS variables (only if explicitly set).
  if (typeof alignItems === 'string' && alignItems.length > 0) {
    style['--madeit-align-items-desktop'] = alignItems;
  }
  if (typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0) {
    style['--madeit-align-items-tablet'] = alignItemsTablet;
  }
  if (typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0) {
    style['--madeit-align-items-mobile'] = alignItemsMobile;
  }
  if (typeof justifyContent === 'string' && justifyContent.length > 0) {
    style['--madeit-justify-content-desktop'] = justifyContent;
  }
  if (typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0) {
    style['--madeit-justify-content-tablet'] = justifyContentTablet;
  }
  if (typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0) {
    style['--madeit-justify-content-mobile'] = justifyContentMobile;
  }

  // Responsive flex-wrap via CSS variables (only if explicitly set).
  if (typeof flexWrap === 'string' && flexWrap.length > 0) {
    style['--madeit-flex-wrap-desktop'] = flexWrap;
  }
  if (typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0) {
    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
  }
  if (typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0) {
    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
  }
  if (containerMargin !== undefined && containerMargin.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin !== undefined && containerMargin.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  if (containerMargin !== undefined && containerMargin.left !== undefined) {
    style.marginLeft = containerMargin.left;
    style['--margin-left-desktop'] = containerMargin.left;
  }
  if (containerMargin !== undefined && containerMargin.right !== undefined) {
    style.marginRight = containerMargin.right;
    style['--margin-right-desktop'] = containerMargin.right;
  }
  if (containerPadding !== undefined && containerPadding.top !== undefined) {
    style.paddingTop = containerPadding.top;
  }
  if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
    style.paddingBottom = containerPadding.bottom;
  }
  if (containerPadding !== undefined && containerPadding.left !== undefined) {
    style.paddingLeft = containerPadding.left;
  }
  if (containerPadding !== undefined && containerPadding.right !== undefined) {
    style.paddingRight = containerPadding.right;
  }
  var styleChild = {};
  if (defaultSize === 'container-content-boxed') {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-text-color': rowTextColor !== undefined,
      'has-background': rowBackgroundColor !== undefined,
      [rowBackgroundColorClass]: rowBackgroundColor !== undefined,
      [rowTextColorClass]: rowTextColor !== undefined
    });
    styleChild = {
      backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
      color: rowTextColorClass ? undefined : rowTextColorClass
    };
    if (rowMargin !== undefined && rowMargin.top !== undefined) {
      styleChild.marginTop = rowMargin.top;
    }
    if (rowMargin !== undefined && rowMargin.bottom !== undefined) {
      styleChild.marginBottom = rowMargin.bottom;
    }
    if (rowMargin !== undefined && rowMargin.left !== undefined) {
      styleChild.marginLeft = rowMargin.left;
    }
    if (rowMargin !== undefined && rowMargin.right !== undefined) {
      styleChild.marginRight = rowMargin.right;
    }
    if (rowPadding !== undefined && rowPadding.top !== undefined) {
      styleChild.paddingTop = rowPadding.top;
    }
    if (rowPadding !== undefined && rowPadding.bottom !== undefined) {
      styleChild.paddingBottom = rowPadding.bottom;
    }
    if (rowPadding !== undefined && rowPadding.left !== undefined) {
      styleChild.paddingLeft = rowPadding.left;
    }
    if (rowPadding !== undefined && rowPadding.right !== undefined) {
      styleChild.paddingRight = rowPadding.right;
    }
  } else {
    style.color = rowTextColorClass ? undefined : rowTextColorClass;
    if (applyContainerBackgroundToInner) {
      styleChild = {
        ...styleChild,
        ...containerBackgroundStyle
      };
    }
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
    className: classes,
    style: style
  });
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const dirDesktop = typeof flexDirection === 'string' && flexDirection.length > 0 ? flexDirection : 'row';
  const dirTablet = typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ? flexDirectionTablet : undefined;
  const dirMobile = typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ? flexDirectionMobile : undefined;
  const hasEnhancedRowWrapper = Number.isFinite(columnsCount) || typeof flexDirection === 'string' && flexDirection.length > 0 || typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 || typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0;
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const rowClassName = hasEnhancedRowWrapper ? `row madeit-container-row rows-${rowsCount}` : 'row';
  const rowProps = hasEnhancedRowWrapper ? {
    className: rowClassName,
    'data-madeit-dir': dirDesktop,
    'data-madeit-dir-tablet': dirTablet,
    'data-madeit-dir-mobile': dirMobile
  } : {
    className: rowClassName
  };
  if (size === 'container-content-boxed') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...rowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...rowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null))))));
  } else {
    const shouldWrapContent = outerSizeNormalized !== 'container' && hasContentWidth && contentWidthNormalized !== outerSizeNormalized;
    if (applyContainerBackgroundToInner) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classesChild,
        style: styleChild
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...rowProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null))));
    }
    if (shouldWrapContent) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
          container: contentWidthNormalized === 'container',
          'container-fluid': contentWidthNormalized === 'container-fluid'
        })
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...rowProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null))));
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...rowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)));
  }
}

/***/ },

/***/ "./src/save-versions/save-padding-on-wrapper.js"
/*!******************************************************!*\
  !*** ./src/save-versions/save-padding-on-wrapper.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */




/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
function save(props) {
  const {
    wrapperClassName,
    directRowClassName,
    verticalAlignment,
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    size,
    contentWidth,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor,
    containerMargin,
    containerPadding,
    rowMargin,
    rowPadding,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    rowGapTablet,
    rowGapUnitTablet,
    rowGapMobile,
    rowGapUnitMobile,
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = props.attributes;
  const {
    className
  } = props;

  // NOTE: Historically this block was saved without additional wrapper classes
  // and without layout-related inline CSS vars. To avoid block validation
  // failures on legacy/pasted content, we only serialize “enhanced” markup
  // when the corresponding attributes are explicitly set.

  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', rowTextColor) : undefined;
  const hasClassicBackground = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const computedBackgroundType = backgroundType || (hasClassicBackground ? 'classic' : undefined);
  var classes = className;
  var classesChild = '';
  var defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }
  const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
  const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
  const hasWrapperClassNameFromMarkup = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0;
  const wrapperHasFrontendClass = hasWrapperClassNameFromMarkup && wrapperClassName.split(/\s+/).includes(FRONTEND_WRAPPER_CLASS);

  // Legacy boxed markup (the one throwing validation errors):
  // - Wrapper did NOT include `madeit-block-content--frontend`
  // - `.row` was a direct child of the wrapper (no inner `.container`)
  // We only switch to legacy serialization when we can positively detect
  // legacy markup from the stored HTML (wrapperClassName derived attr).
  const shouldUseLegacyBoxedMarkup = defaultSize === 'container' && hasWrapperClassNameFromMarkup && !wrapperHasFrontendClass;

  // Keep the old direct-row detector as a secondary hint (some HTML parsers
  // won't support :scope selectors), but do not rely on it as the primary
  // switch.
  const hasDirectRowWrapper = typeof directRowClassName === 'string' && directRowClassName.trim().length > 0;
  const applyContainerBackgroundToInner = defaultSize === 'container' && !shouldUseLegacyBoxedMarkup;
  const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
  const contentWidthResolvedRaw = hasContentWidth ? contentWidth : defaultSize === 'container-content-boxed' ? 'container' : outerSizeNormalized;
  let contentWidthNormalized = contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';

  // If the outer container is boxed, content cannot be full width.
  if (outerSizeNormalized === 'container') {
    contentWidthNormalized = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    [`container`]: 'container' === defaultSize,
    [`container-fluid`]: 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
    [`is-hidden-desktop`]: !!hideOnDesktop,
    [`is-hidden-tablet`]: !!hideOnTablet,
    [`is-hidden-mobile`]: !!hideOnMobile,
    ['madeit-block-content--frontend']: !shouldUseLegacyBoxedMarkup
  });
  if (defaultSize !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize === 'container-content-boxed',
    [`container`]: contentWidthNormalized === 'container',
    [`container-fluid`]: contentWidthNormalized === 'container-fluid'
  });

  // Text color stays on the outer wrapper so it inherits everywhere.
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    [rowTextColorClass]: rowTextColorClass
  });

  // Container background should live on the inner container when the block
  // is boxed, so padding/margins on the wrapper don't get painted.
  // BUT: legacy boxed markup had no inner container wrapper, so in that case
  // we keep the background on the outer wrapper for validation compatibility.
  if (applyContainerBackgroundToInner) {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  } else {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  }
  const containerBackgroundStyle = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  var style = {};
  const toCssLength = (value, unit = 'px') => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return `${value}${unit || 'px'}`;
    }
    if (typeof value !== 'string') {
      return undefined;
    }
    const trimmed = value.trim();
    if (trimmed === '') {
      return undefined;
    }

    // Plain number string: treat as the number + provided unit.
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
      return `${trimmed}${unit || 'px'}`;
    }

    // Number with explicit unit (legacy): accept it as-is.
    if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(trimmed)) {
      return trimmed;
    }
    return undefined;
  };
  const hasBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0;
  const hasBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0;
  const hasBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0;
  const computedBackgroundGradient = props.attributes.containerBackgroundGradient || {
    gradient: ''
  };
  const computedBackgroundGradientValue = typeof computedBackgroundGradient?.gradient === 'string' && computedBackgroundGradient.gradient.trim().length > 0 ? computedBackgroundGradient.gradient : undefined;
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    containerBackgroundStyle.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (hasBackgroundPosition) {
      containerBackgroundStyle.backgroundPosition = containerBackgroundPosition;
    }
    if (hasBackgroundRepeat) {
      containerBackgroundStyle.backgroundRepeat = containerBackgroundRepeat;
    }
    if (hasBackgroundSize) {
      containerBackgroundStyle.backgroundSize = containerBackgroundSize;
    }
  }
  if (computedBackgroundType === 'gradient' && computedBackgroundGradientValue) {
    containerBackgroundStyle.backgroundImage = computedBackgroundGradientValue;
  }
  if (!applyContainerBackgroundToInner) {
    style = {
      ...style,
      ...containerBackgroundStyle
    };
  }

  // Apply overflow to outer wrapper (avoid serializing default `visible`).
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') {
    style.overflow = overflow;
  }

  // Responsive min-height via CSS variables.
  const minHeightDesktopCss = toCssLength(minHeight, minHeightUnit || 'px');
  if (minHeightDesktopCss !== undefined) {
    style['--madeit-min-height-desktop'] = minHeightDesktopCss;
  }
  const minHeightTabletCss = toCssLength(minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightTabletCss !== undefined) {
    style['--madeit-min-height-tablet'] = minHeightTabletCss;
  }
  const minHeightMobileCss = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightMobileCss !== undefined) {
    style['--madeit-min-height-mobile'] = minHeightMobileCss;
  }

  // Responsive max-width via CSS variables.
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }

  // Responsive row-gap via CSS variables.
  // Row gap via CSS variables.
  // Important for block validation stability: only serialize tablet/mobile overrides
  // when a desktop rowGap is explicitly set.
  const hasRowGapDesktop = typeof rowGap === 'number';
  if (hasRowGapDesktop) {
    style['--madeit-row-gap-desktop'] = `${rowGap}${rowGapUnit || 'px'}`;
    if (typeof rowGapTablet === 'number') {
      style['--madeit-row-gap-tablet'] = `${rowGapTablet}${rowGapUnitTablet || 'px'}`;
    }
    if (typeof rowGapMobile === 'number') {
      style['--madeit-row-gap-mobile'] = `${rowGapMobile}${rowGapUnitMobile || 'px'}`;
    }
  }

  // Responsive flex-direction via CSS variables (only if explicitly set).
  if (typeof flexDirection === 'string' && flexDirection.length > 0) {
    style['--madeit-flex-direction-desktop'] = flexDirection;
  }
  if (typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0) {
    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
  }
  if (typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0) {
    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
  }

  // Responsive align-items / justify-content via CSS variables (only if explicitly set).
  if (typeof alignItems === 'string' && alignItems.length > 0) {
    style['--madeit-align-items-desktop'] = alignItems;
  }
  if (typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0) {
    style['--madeit-align-items-tablet'] = alignItemsTablet;
  }
  if (typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0) {
    style['--madeit-align-items-mobile'] = alignItemsMobile;
  }
  if (typeof justifyContent === 'string' && justifyContent.length > 0) {
    style['--madeit-justify-content-desktop'] = justifyContent;
  }
  if (typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0) {
    style['--madeit-justify-content-tablet'] = justifyContentTablet;
  }
  if (typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0) {
    style['--madeit-justify-content-mobile'] = justifyContentMobile;
  }

  // Responsive flex-wrap via CSS variables (only if explicitly set).
  if (typeof flexWrap === 'string' && flexWrap.length > 0) {
    style['--madeit-flex-wrap-desktop'] = flexWrap;
  }
  if (typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0) {
    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
  }
  if (typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0) {
    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
  }
  if (containerMargin !== undefined && containerMargin.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin !== undefined && containerMargin.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  if (containerMargin !== undefined && containerMargin.left !== undefined) {
    style.marginLeft = containerMargin.left;
    style['--margin-left-desktop'] = containerMargin.left;
  }
  if (containerMargin !== undefined && containerMargin.right !== undefined) {
    style.marginRight = containerMargin.right;
    style['--margin-right-desktop'] = containerMargin.right;
  }
  if (containerPadding !== undefined && containerPadding.top !== undefined) {
    style.paddingTop = containerPadding.top;
  }
  if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
    style.paddingBottom = containerPadding.bottom;
  }
  if (containerPadding !== undefined && containerPadding.left !== undefined) {
    style.paddingLeft = containerPadding.left;
  }
  if (containerPadding !== undefined && containerPadding.right !== undefined) {
    style.paddingRight = containerPadding.right;
  }
  var styleChild = {};
  if (defaultSize === 'container-content-boxed') {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-text-color': rowTextColor !== undefined,
      'has-background': rowBackgroundColor !== undefined,
      [rowBackgroundColorClass]: rowBackgroundColor !== undefined,
      [rowTextColorClass]: rowTextColor !== undefined
    });
    styleChild = {
      backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
      color: rowTextColorClass ? undefined : rowTextColorClass
    };
    if (rowMargin !== undefined && rowMargin.top !== undefined) {
      styleChild.marginTop = rowMargin.top;
    }
    if (rowMargin !== undefined && rowMargin.bottom !== undefined) {
      styleChild.marginBottom = rowMargin.bottom;
    }
    if (rowMargin !== undefined && rowMargin.left !== undefined) {
      styleChild.marginLeft = rowMargin.left;
    }
    if (rowMargin !== undefined && rowMargin.right !== undefined) {
      styleChild.marginRight = rowMargin.right;
    }
    if (rowPadding !== undefined && rowPadding.top !== undefined) {
      styleChild.paddingTop = rowPadding.top;
    }
    if (rowPadding !== undefined && rowPadding.bottom !== undefined) {
      styleChild.paddingBottom = rowPadding.bottom;
    }
    if (rowPadding !== undefined && rowPadding.left !== undefined) {
      styleChild.paddingLeft = rowPadding.left;
    }
    if (rowPadding !== undefined && rowPadding.right !== undefined) {
      styleChild.paddingRight = rowPadding.right;
    }
  } else {
    style.color = rowTextColorClass ? undefined : rowTextColorClass;
    if (applyContainerBackgroundToInner) {
      styleChild = {
        ...styleChild,
        ...containerBackgroundStyle
      };
    }
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
    className: classes,
    style: style
  });
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const dirDesktop = typeof flexDirection === 'string' && flexDirection.length > 0 ? flexDirection : 'row';
  const dirTablet = typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ? flexDirectionTablet : undefined;
  const dirMobile = typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ? flexDirectionMobile : undefined;
  const hasEnhancedRowWrapper = Number.isFinite(columnsCount) || typeof flexDirection === 'string' && flexDirection.length > 0 || typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 || typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0;
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const rowClassName = hasEnhancedRowWrapper ? `row madeit-container-row rows-${rowsCount}` : 'row';
  const rowProps = hasEnhancedRowWrapper ? {
    className: rowClassName,
    'data-madeit-dir': dirDesktop,
    'data-madeit-dir-tablet': dirTablet,
    'data-madeit-dir-mobile': dirMobile
  } : {
    className: rowClassName
  };
  if (size === 'container-content-boxed') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...rowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...rowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')))));
  } else {
    const shouldWrapContent = outerSizeNormalized !== 'container' && hasContentWidth && contentWidthNormalized !== outerSizeNormalized;
    if (applyContainerBackgroundToInner) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classesChild,
        style: styleChild
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...rowProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')));
    }
    if (shouldWrapContent) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
          container: contentWidthNormalized === 'container',
          'container-fluid': contentWidthNormalized === 'container-fluid'
        })
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...rowProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')));
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...rowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n'));
  }
}

/***/ },

/***/ "./src/save-versions/save-v1-size-default-container.js"
/*!*************************************************************!*\
  !*** ./src/save-versions/save-v1-size-default-container.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveV1SizeDefaultContainer)
/* harmony export */ });
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../save */ "./src/save.js");


/**
 * Deprecated (2026-04-17): `size` default changed from `container`
 * to `container-content-boxed`.
 *
 * This variant keeps old content without an explicit `size` attribute valid by
 * serializing with the legacy fallback (`container`).
 */
function saveV1SizeDefaultContainer(props) {
  const currentSize = typeof props?.attributes?.size === 'string' ? props.attributes.size : '';
  const wrapperClassName = typeof props?.attributes?.wrapperClassName === 'string' ? props.attributes.wrapperClassName : '';
  const wrapperTokens = wrapperClassName.trim().length ? wrapperClassName.trim().split(/\s+/) : [];
  const wrapperHasContainer = wrapperTokens.includes('container');
  const wrapperHasContainerFluid = wrapperTokens.includes('container-fluid');

  // Legacy compatibility: older content was saved with a `container` wrapper
  // when no explicit `size` attribute existed. After changing the default
  // to `container-content-boxed`, those blocks parse with the new default
  // but still carry legacy wrapper classes from markup.
  const shouldForceLegacyContainer = currentSize === 'container-content-boxed' && wrapperHasContainer && !wrapperHasContainerFluid;
  const legacySize = shouldForceLegacyContainer ? 'container' : currentSize && currentSize.length > 0 ? currentSize : 'container';
  return (0,_save__WEBPACK_IMPORTED_MODULE_0__["default"])({
    ...props,
    attributes: {
      ...props.attributes,
      size: legacySize
    }
  });
}

/***/ },

/***/ "./src/save-versions/save-v10-pre-rowgap-responsive-vars.js"
/*!******************************************************************!*\
  !*** ./src/save-versions/save-v10-pre-rowgap-responsive-vars.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveV10PreRowGapResponsiveVars)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);




/**
 * Deprecated version (pre rowGap responsive vars):
 * - Only the desktop row-gap var was serialized (tablet/mobile ignored)
 * - Inner row wrapper did not include newline whitespace in all cases
 */
function saveV10PreRowGapResponsiveVars(props) {
  const {
    verticalAlignment,
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    size,
    contentWidth,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor,
    containerMargin,
    containerPadding,
    rowMargin,
    rowPadding,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    // rowGapTablet/rowGapMobile existed as attributes but were not serialized.
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = props.attributes;
  const {
    className
  } = props;
  const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', rowTextColor) : undefined;
  const computedBackgroundType = backgroundType || (containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor ? 'classic' : 'transparent');
  let classes = className;
  let classesChild = '';
  let defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }
  const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
  const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
  const contentWidthResolvedRaw = hasContentWidth ? contentWidth : defaultSize === 'container-content-boxed' ? 'container' : outerSizeNormalized;
  let contentWidthNormalized = contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';
  if (outerSizeNormalized === 'container') {
    contentWidthNormalized = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    container: 'container' === defaultSize,
    'container-fluid': 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile,
    [FRONTEND_WRAPPER_CLASS]: true
  });
  if (defaultSize !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize === 'container-content-boxed',
    container: contentWidthNormalized === 'container',
    'container-fluid': contentWidthNormalized === 'container-fluid'
  });
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    'has-background': containerBackgroundColorClass,
    [containerBackgroundColorClass]: containerBackgroundColorClass,
    [rowTextColorClass]: rowTextColorClass
  });
  const style = {
    backgroundColor: computedBackgroundType === 'transparent' ? 'transparent' : containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  const computedContainerBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0 ? containerBackgroundPosition : 'center center';
  const computedContainerBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0 ? containerBackgroundRepeat : 'no-repeat';
  const computedContainerBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0 ? containerBackgroundSize : 'cover';
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    style.backgroundImage = `url(${containerBackgroundImage.url})`;
    style.backgroundPosition = computedContainerBackgroundPosition;
    style.backgroundRepeat = computedContainerBackgroundRepeat;
    style.backgroundSize = computedContainerBackgroundSize;
  }

  // Historic: gradient support may not have been used here; keep compatible.
  if (computedBackgroundType === 'gradient') {
    const computedBackgroundGradient = props.attributes?.containerBackgroundGradient || {
      gradient: 'var(--wp--preset--gradient--color-and-background)'
    };
    if (computedBackgroundGradient?.gradient) {
      style.backgroundImage = computedBackgroundGradient.gradient;
    }
  }
  if (overflow) {
    style.overflow = overflow;
  }
  if (typeof minHeight === 'number') {
    style['--madeit-min-height-desktop'] = `${minHeight}${minHeightUnit || 'px'}`;
  }
  if (typeof minHeightTablet === 'number') {
    style['--madeit-min-height-tablet'] = `${minHeightTablet}${minHeightUnitTablet || 'px'}`;
  }
  if (typeof minHeightMobile === 'number') {
    style['--madeit-min-height-mobile'] = `${minHeightMobile}${minHeightUnitMobile || 'px'}`;
  }
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }

  // Historic: only desktop row-gap was serialized.
  if (typeof rowGap === 'number') {
    style['--madeit-row-gap-desktop'] = `${rowGap}${rowGapUnit || 'px'}`;
  }
  style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
  if (flexDirectionTablet) {
    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
  }
  if (flexDirectionMobile) {
    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
  }
  style['--madeit-align-items-desktop'] = alignItems || 'stretch';
  if (alignItemsTablet) {
    style['--madeit-align-items-tablet'] = alignItemsTablet;
  }
  if (alignItemsMobile) {
    style['--madeit-align-items-mobile'] = alignItemsMobile;
  }
  style['--madeit-justify-content-desktop'] = justifyContent || 'flex-start';
  if (justifyContentTablet) {
    style['--madeit-justify-content-tablet'] = justifyContentTablet;
  }
  if (justifyContentMobile) {
    style['--madeit-justify-content-mobile'] = justifyContentMobile;
  }
  style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';
  if (flexWrapTablet) {
    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
  }
  if (flexWrapMobile) {
    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
  }
  if (containerMargin !== undefined && containerMargin.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin !== undefined && containerMargin.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  if (containerMargin !== undefined && containerMargin.left !== undefined) {
    style.marginLeft = containerMargin.left;
  }
  if (containerMargin !== undefined && containerMargin.right !== undefined) {
    style.marginRight = containerMargin.right;
  }
  if (containerPadding !== undefined && containerPadding.top !== undefined) {
    style.paddingTop = containerPadding.top;
  }
  if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
    style.paddingBottom = containerPadding.bottom;
  }
  if (containerPadding !== undefined && containerPadding.left !== undefined) {
    style.paddingLeft = containerPadding.left;
  }
  if (containerPadding !== undefined && containerPadding.right !== undefined) {
    style.paddingRight = containerPadding.right;
  }
  const shouldWrapContent = outerSizeNormalized !== 'container' && hasContentWidth && contentWidthNormalized !== outerSizeNormalized;
  const HtmlTag = htmlTag || 'div';
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classes,
    style
  });
  const rowProps = {
    className: `row madeit-container-row rows-${columnsCount || 0}`,
    'data-madeit-dir': flexDirection || 'row',
    'data-madeit-dir-tablet': flexDirectionTablet || undefined,
    'data-madeit-dir-mobile': flexDirectionMobile || undefined
  };
  if (shouldWrapContent) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        container: contentWidthNormalized === 'container',
        'container-fluid': contentWidthNormalized === 'container-fluid'
      })
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...rowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null))));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...rowProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)));
}

/***/ },

/***/ "./src/save-versions/save-v11-transparent-background-default.js"
/*!**********************************************************************!*\
  !*** ./src/save-versions/save-v11-transparent-background-default.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveV11TransparentBackgroundDefault)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);




/**
 * Deprecated version (2026-02): matched a save() that always serialized
 * `background-color: transparent` when no explicit background was set.
 */
function saveV11TransparentBackgroundDefault(props) {
  const {
    verticalAlignment,
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    size,
    contentWidth,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor,
    containerMargin,
    containerPadding,
    rowMargin,
    rowPadding,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    rowGapTablet,
    rowGapUnitTablet,
    rowGapMobile,
    rowGapUnitMobile,
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = props.attributes;
  const {
    className
  } = props;
  const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', rowTextColor) : undefined;
  const computedBackgroundType = backgroundType || (containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor ? 'classic' : 'transparent');
  var classes = className;
  var classesChild = '';
  var defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }
  const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
  const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
  const contentWidthResolvedRaw = hasContentWidth ? contentWidth : defaultSize === 'container-content-boxed' ? 'container' : outerSizeNormalized;
  let contentWidthNormalized = contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';
  if (outerSizeNormalized === 'container') {
    contentWidthNormalized = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    [`container`]: 'container' === defaultSize,
    [`container-fluid`]: 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
    [`is-hidden-desktop`]: !!hideOnDesktop,
    [`is-hidden-tablet`]: !!hideOnTablet,
    [`is-hidden-mobile`]: !!hideOnMobile
  });
  if (defaultSize !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize === 'container-content-boxed',
    [`container`]: contentWidthNormalized === 'container',
    [`container-fluid`]: contentWidthNormalized === 'container-fluid'
  });
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    'has-background': containerBackgroundColorClass,
    [containerBackgroundColorClass]: containerBackgroundColorClass,
    [rowTextColorClass]: rowTextColorClass
  });
  var style = {
    backgroundColor: computedBackgroundType === 'transparent' ? 'transparent' : containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  const computedContainerBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0 ? containerBackgroundPosition : 'center center';
  const computedContainerBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0 ? containerBackgroundRepeat : 'no-repeat';
  const computedContainerBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0 ? containerBackgroundSize : 'cover';
  const computedBackgroundGradient = props.attributes?.containerBackgroundGradient || {
    gradient: 'var(--wp--preset--gradient--color-and-background)'
  };
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    style.backgroundImage = `url(${containerBackgroundImage.url})`;
    style.backgroundPosition = computedContainerBackgroundPosition;
    style.backgroundRepeat = computedContainerBackgroundRepeat;
    style.backgroundSize = computedContainerBackgroundSize;
  }
  if (computedBackgroundType === 'gradient') {
    style.backgroundImage = computedBackgroundGradient.gradient;
  }
  if (overflow) {
    style.overflow = overflow;
  }
  if (typeof minHeight === 'number') {
    style['--madeit-min-height-desktop'] = `${minHeight}${minHeightUnit || 'px'}`;
  }
  if (typeof minHeightTablet === 'number') {
    style['--madeit-min-height-tablet'] = `${minHeightTablet}${minHeightUnitTablet || 'px'}`;
  }
  if (typeof minHeightMobile === 'number') {
    style['--madeit-min-height-mobile'] = `${minHeightMobile}${minHeightUnitMobile || 'px'}`;
  }
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }
  if (typeof rowGap === 'number') {
    style['--madeit-row-gap-desktop'] = `${rowGap}${rowGapUnit || 'px'}`;
  }
  if (typeof rowGapTablet === 'number') {
    style['--madeit-row-gap-tablet'] = `${rowGapTablet}${rowGapUnitTablet || 'px'}`;
  }
  if (typeof rowGapMobile === 'number') {
    style['--madeit-row-gap-mobile'] = `${rowGapMobile}${rowGapUnitMobile || 'px'}`;
  }
  style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
  if (flexDirectionTablet) {
    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
  }
  if (flexDirectionMobile) {
    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
  }
  style['--madeit-align-items-desktop'] = alignItems || 'stretch';
  if (alignItemsTablet) {
    style['--madeit-align-items-tablet'] = alignItemsTablet;
  }
  if (alignItemsMobile) {
    style['--madeit-align-items-mobile'] = alignItemsMobile;
  }
  style['--madeit-justify-content-desktop'] = justifyContent || 'flex-start';
  if (justifyContentTablet) {
    style['--madeit-justify-content-tablet'] = justifyContentTablet;
  }
  if (justifyContentMobile) {
    style['--madeit-justify-content-mobile'] = justifyContentMobile;
  }
  style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';
  if (flexWrapTablet) {
    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
  }
  if (flexWrapMobile) {
    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
  }
  if (containerMargin !== undefined && containerMargin.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin !== undefined && containerMargin.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  if (containerMargin !== undefined && containerMargin.left !== undefined) {
    style.marginLeft = containerMargin.left;
  }
  if (containerMargin !== undefined && containerMargin.right !== undefined) {
    style.marginRight = containerMargin.right;
  }
  if (containerPadding !== undefined && containerPadding.top !== undefined) {
    style.paddingTop = containerPadding.top;
  }
  if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
    style.paddingBottom = containerPadding.bottom;
  }
  if (containerPadding !== undefined && containerPadding.left !== undefined) {
    style.paddingLeft = containerPadding.left;
  }
  if (containerPadding !== undefined && containerPadding.right !== undefined) {
    style.paddingRight = containerPadding.right;
  }
  var styleChild = {};
  if (defaultSize === 'container-content-boxed') {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-text-color': rowTextColor !== undefined,
      'has-background': rowBackgroundColor !== undefined,
      [rowBackgroundColorClass]: rowBackgroundColor !== undefined,
      [rowTextColorClass]: rowTextColor !== undefined
    });
    styleChild = {
      backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
      color: rowTextColorClass ? undefined : rowTextColorClass
    };
    if (rowMargin !== undefined && rowMargin.top !== undefined) {
      styleChild.marginTop = rowMargin.top;
    }
    if (rowMargin !== undefined && rowMargin.bottom !== undefined) {
      styleChild.marginBottom = rowMargin.bottom;
    }
    if (rowMargin !== undefined && rowMargin.left !== undefined) {
      styleChild.marginLeft = rowMargin.left;
    }
    if (rowMargin !== undefined && rowMargin.right !== undefined) {
      styleChild.marginRight = rowMargin.right;
    }
    if (rowPadding !== undefined && rowPadding.top !== undefined) {
      styleChild.paddingTop = rowPadding.top;
    }
    if (rowPadding !== undefined && rowPadding.bottom !== undefined) {
      styleChild.paddingBottom = rowPadding.bottom;
    }
    if (rowPadding !== undefined && rowPadding.left !== undefined) {
      styleChild.paddingLeft = rowPadding.left;
    }
    if (rowPadding !== undefined && rowPadding.right !== undefined) {
      styleChild.paddingRight = rowPadding.right;
    }
  } else {
    style.color = rowTextColorClass ? undefined : rowTextColorClass;
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, FRONTEND_WRAPPER_CLASS),
    style: style
  });
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const dirDesktop = flexDirection || 'row';
  const dirTablet = flexDirectionTablet || undefined;
  const dirMobile = flexDirectionMobile || undefined;
  if (size === 'container-content-boxed') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `row madeit-container-row rows-${columnsCount || 0}`,
      "data-madeit-dir": dirDesktop,
      "data-madeit-dir-tablet": dirTablet,
      "data-madeit-dir-mobile": dirMobile
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `row madeit-container-row rows-${columnsCount || 0}`,
      "data-madeit-dir": dirDesktop,
      "data-madeit-dir-tablet": dirTablet,
      "data-madeit-dir-mobile": dirMobile
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null))))));
  }
  const shouldWrapContent = outerSizeNormalized !== 'container' && hasContentWidth && contentWidthNormalized !== outerSizeNormalized;
  if (shouldWrapContent) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        container: contentWidthNormalized === 'container',
        'container-fluid': contentWidthNormalized === 'container-fluid'
      })
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `row madeit-container-row rows-${columnsCount || 0}`,
      "data-madeit-dir": dirDesktop,
      "data-madeit-dir-tablet": dirTablet,
      "data-madeit-dir-mobile": dirMobile
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null))));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `row madeit-container-row rows-${columnsCount || 0}`,
    "data-madeit-dir": dirDesktop,
    "data-madeit-dir-tablet": dirTablet,
    "data-madeit-dir-mobile": dirMobile
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)));
}

/***/ },

/***/ "./src/save-versions/save-v13-legacy-attributes.js"
/*!*********************************************************!*\
  !*** ./src/save-versions/save-v13-legacy-attributes.js ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveV13LegacyAttributes)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);




/**
 * Very old save implementation that used split numeric attributes for margins/padding.
 * Kept only for validation of legacy content.
 */
function saveV13LegacyAttributes(props) {
  const {
    verticalAlignment,
    containerBackgroundColor,
    customContainerBackgroundColor,
    size,
    containerMarginTop,
    containerMarginBottom,
    containerMarginLeft,
    containerMarginRight,
    containerPaddingTop,
    containerPaddingBottom,
    containerPaddingLeft,
    containerPaddingRight,
    rowMarginTop,
    rowMarginBottom,
    rowPaddingTop,
    rowPaddingBottom,
    rowPaddingLeft,
    rowPaddingRight,
    rowMarginLeft,
    rowMarginRight,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor
  } = props.attributes;
  const {
    className
  } = props;
  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', rowTextColor) : undefined;
  var classes = className;
  var classesChild = '';
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    [`container`]: 'container' === size,
    [`container-fluid`]: 'container-fluid' === size || 'container-content-boxed' === size
  });
  if (size !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && size !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && size === 'container-content-boxed',
    [`container`]: 'container' === size || 'container-content-boxed' === size,
    [`container-fluid`]: 'container-fluid' === size
  });
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    'has-background': containerBackgroundColorClass,
    [containerBackgroundColorClass]: containerBackgroundColorClass,
    [rowTextColorClass]: rowTextColorClass
  });
  var style = {
    backgroundColor: containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  if (containerMarginTop > 0) {
    style.marginTop = containerMarginTop + 'px';
  }
  if (containerMarginBottom > 0) {
    style.marginBottom = containerMarginBottom + 'px';
  }
  if (containerMarginLeft > 0) {
    style.marginLeft = containerMarginLeft + 'px';
  }
  if (containerMarginRight > 0) {
    style.marginRight = containerMarginRight + 'px';
  }
  if (containerPaddingTop > 0) {
    style.paddingTop = containerPaddingTop + 'px';
  }
  if (containerPaddingBottom > 0) {
    style.paddingBottom = containerPaddingBottom + 'px';
  }
  if (containerPaddingLeft > 0) {
    style.paddingLeft = containerPaddingLeft + 'px';
  }
  if (containerPaddingRight > 0) {
    style.paddingRight = containerPaddingRight + 'px';
  }
  var styleChild = {};
  if (size === 'container-content-boxed') {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-text-color': rowTextColor !== undefined,
      'has-background': rowBackgroundColor !== undefined,
      [rowBackgroundColorClass]: rowBackgroundColor !== undefined,
      [rowTextColorClass]: rowTextColor !== undefined
    });
    styleChild = {
      backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
      color: rowTextColorClass ? undefined : rowTextColorClass
    };
    if (rowMarginTop > 0) {
      styleChild.marginTop = rowMarginTop + 'px';
    }
    if (rowMarginBottom > 0) {
      styleChild.marginBottom = rowMarginBottom + 'px';
    }
    if (rowMarginLeft > 0) {
      styleChild.marginLeft = rowMarginLeft + 'px';
    }
    if (rowMarginRight > 0) {
      styleChild.marginRight = rowMarginRight + 'px';
    }
    if (rowPaddingTop > 0) {
      styleChild.paddingTop = rowPaddingTop + 'px';
    }
    if (rowPaddingBottom > 0) {
      styleChild.paddingBottom = rowPaddingBottom + 'px';
    }
    if (rowPaddingLeft > 0) {
      styleChild.paddingLeft = rowPaddingLeft + 'px';
    }
    if (rowPaddingRight > 0) {
      styleChild.paddingRight = rowPaddingRight + 'px';
    }
  } else {
    style.color = rowTextColorClass ? undefined : rowTextColorClass;
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classes,
    style: style
  });
  if (size === 'container-content-boxed') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "row"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "row"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null))))));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "row"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)));
}

/***/ },

/***/ "./src/save-versions/save-v14-legacy-direct-row-overflow-visible.js"
/*!**************************************************************************!*\
  !*** ./src/save-versions/save-v14-legacy-direct-row-overflow-visible.js ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveV14LegacyDirectRowOverflowVisible)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Deprecated legacy variant:
 * - Wrapper is `container` (not container-fluid)
 * - Direct `.row.madeit-container-row` child (no inner container wrappers)
 * - Serializes `overflow: visible` inline
 * - Serializes default flex vars inline
 *
 * This exists purely for block validation compatibility.
 */
function saveV14LegacyDirectRowOverflowVisible(props) {
  const {
    verticalAlignment,
    containerMargin,
    containerPadding,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = props.attributes;

  // For validation we want to mirror the saved markup as closely as possible.
  // When available, use the wrapper/row classnames that were parsed from the
  // stored HTML (attribute sources in block.json).
  const wrapperClassNameFromMarkup = typeof props?.attributes?.wrapperClassName === 'string' ? props.attributes.wrapperClassName : '';
  const directRowClassNameFromMarkup = typeof props?.attributes?.directRowClassName === 'string' ? props.attributes.directRowClassName : '';
  const hasWrapperClassNameFromMarkup = wrapperClassNameFromMarkup.trim().length > 0;

  // Fallback if parser couldn't provide wrapperClassName.
  const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
  let wrapperClassName = hasWrapperClassNameFromMarkup ? wrapperClassNameFromMarkup : `wp-block-madeit-block-content container ${FRONTEND_WRAPPER_CLASS}`;

  // Normalize structural tokens without changing overall intent.
  // (This variant is specifically for `.container` wrappers.)
  if (wrapperClassName.includes('container-fluid')) {
    wrapperClassName = wrapperClassName.split(/\s+/).filter(token => token && token !== 'container-fluid').join(' ');
  }
  if (!wrapperClassName.split(/\s+/).includes('container')) {
    wrapperClassName = `${wrapperClassName} container`;
  }
  if (!wrapperClassName.split(/\s+/).includes(FRONTEND_WRAPPER_CLASS)) {
    wrapperClassName = `${wrapperClassName} ${FRONTEND_WRAPPER_CLASS}`;
  }

  // Add optional classes (only if they exist in attributes; legacy content can have them).
  if (verticalAlignment) {
    wrapperClassName = `${wrapperClassName} are-vertically-aligned-${verticalAlignment}`;
  }
  if (hideOnDesktop) {
    wrapperClassName = `${wrapperClassName} is-hidden-desktop`;
  }
  if (hideOnTablet) {
    wrapperClassName = `${wrapperClassName} is-hidden-tablet`;
  }
  if (hideOnMobile) {
    wrapperClassName = `${wrapperClassName} is-hidden-mobile`;
  }

  // Style key ordering matters for validation.
  const style = {};

  // Always serialize overflow (legacy always had it, even when visible).
  style.overflow = typeof overflow === 'string' && overflow.length > 0 ? overflow : 'visible';
  if (typeof minHeight === 'number') {
    style['--madeit-min-height-desktop'] = `${minHeight}${minHeightUnit || 'px'}`;
  }
  if (typeof minHeightTablet === 'number') {
    style['--madeit-min-height-tablet'] = `${minHeightTablet}${minHeightUnitTablet || minHeightUnit || 'px'}`;
  }
  if (typeof minHeightMobile === 'number') {
    style['--madeit-min-height-mobile'] = `${minHeightMobile}${minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px'}`;
  }

  // Legacy: desktop vars were serialized even when they matched defaults.
  style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
  style['--madeit-align-items-desktop'] = alignItems || 'stretch';
  style['--madeit-justify-content-desktop'] = justifyContent || 'flex-start';
  style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';

  // Legacy: tablet/mobile vars were typically omitted when they were default.
  if (flexDirectionTablet && flexDirectionTablet !== 'column') {
    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
  }
  if (flexDirectionMobile && flexDirectionMobile !== 'column') {
    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
  }
  if (alignItemsTablet && alignItemsTablet !== 'stretch') {
    style['--madeit-align-items-tablet'] = alignItemsTablet;
  }
  if (alignItemsMobile && alignItemsMobile !== 'stretch') {
    style['--madeit-align-items-mobile'] = alignItemsMobile;
  }
  if (justifyContentTablet && justifyContentTablet !== 'flex-start') {
    style['--madeit-justify-content-tablet'] = justifyContentTablet;
  }
  if (justifyContentMobile && justifyContentMobile !== 'flex-start') {
    style['--madeit-justify-content-mobile'] = justifyContentMobile;
  }
  if (flexWrapTablet && flexWrapTablet !== 'nowrap') {
    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
  }
  if (flexWrapMobile && flexWrapMobile !== 'nowrap') {
    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
  }
  if (containerMargin?.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin?.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  if (containerMargin?.left !== undefined) {
    style.marginLeft = containerMargin.left;
  }
  if (containerMargin?.right !== undefined) {
    style.marginRight = containerMargin.right;
  }
  if (containerPadding?.top !== undefined) {
    style.paddingTop = containerPadding.top;
  }
  if (containerPadding?.bottom !== undefined) {
    style.paddingBottom = containerPadding.bottom;
  }
  if (containerPadding?.left !== undefined) {
    style.paddingLeft = containerPadding.left;
  }
  if (containerPadding?.right !== undefined) {
    style.paddingRight = containerPadding.right;
  }
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const rowClassName = directRowClassNameFromMarkup.trim().length > 0 ? directRowClassNameFromMarkup : `row madeit-container-row rows-${columnsCount || 0}`;
  const rowProps = {
    className: rowClassName,
    // Legacy saved markup included only the desktop dir attribute.
    'data-madeit-dir': flexDirection || 'row'
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    className: wrapperClassName,
    style: style
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...rowProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null)));
}

/***/ },

/***/ "./src/save-versions/save-v15-legacy-wrapper-container-inner-container.js"
/*!********************************************************************************!*\
  !*** ./src/save-versions/save-v15-legacy-wrapper-container-inner-container.js ***!
  \********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveV15LegacyWrapperContainerInnerContainer)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Deprecated legacy variant:
 * - Outer wrapper is `.container` (not container-fluid)
 * - Wrapper includes `madeit-block-content--frontend`
 * - Content is wrapped in an inner `.container`
 * - Inner wrapper is `.row.madeit-container-row...` (no `.col` wrapper)
 *
 * This exists purely for block validation compatibility.
 */
function saveV15LegacyWrapperContainerInnerContainer(props) {
  const {
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    justifyContent,
    flexWrap,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    columnsCount,
    wrapperClassName,
    containerMargin,
    containerPadding,
    containerPaddingOnRow
  } = props.attributes;
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const wrapperClassNameFromMarkup = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0 ? wrapperClassName : 'wp-block-madeit-block-content container madeit-block-content--frontend';
  const rowProps = {
    className: `row madeit-container-row rows-${columnsCount || 0}`,
    'data-madeit-dir': flexDirection || 'row',
    'data-madeit-dir-tablet': typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ? flexDirectionTablet : undefined,
    'data-madeit-dir-mobile': typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ? flexDirectionMobile : undefined
  };

  // Legacy versions serialized some layout vars and wrapper spacing inline.
  // Only emit style keys that exist to avoid introducing new attributes.
  const style = {};
  const shouldApplyContainerPaddingOnRow = containerPaddingOnRow === true;

  // Match current save() rules for stability:
  // Only serialize layout vars when they differ from defaults.
  if (typeof alignItems === 'string' && alignItems.length > 0 && alignItems !== 'stretch') {
    style['--madeit-align-items-desktop'] = alignItems;
  }
  if (typeof justifyContent === 'string' && justifyContent.length > 0 && justifyContent !== 'flex-start') {
    style['--madeit-justify-content-desktop'] = justifyContent;
  }
  if (typeof flexWrap === 'string' && flexWrap.length > 0 && flexWrap !== 'nowrap') {
    style['--madeit-flex-wrap-desktop'] = flexWrap;
  }

  // Responsive max-width via CSS variables.
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }
  if (containerMargin?.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin?.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  if (containerMargin?.left !== undefined) {
    style.marginLeft = containerMargin.left;
  }
  if (containerMargin?.right !== undefined) {
    style.marginRight = containerMargin.right;
  }
  if (!shouldApplyContainerPaddingOnRow) {
    if (containerPadding?.top !== undefined) {
      style.paddingTop = containerPadding.top;
    }
    if (containerPadding?.bottom !== undefined) {
      style.paddingBottom = containerPadding.bottom;
    }
    if (containerPadding?.left !== undefined) {
      style.paddingLeft = containerPadding.left;
    }
    if (containerPadding?.right !== undefined) {
      style.paddingRight = containerPadding.right;
    }
  }
  const wrapperStyle = Object.keys(style).length > 0 ? style : undefined;

  // When `containerPaddingOnRow` was enabled, desktop padding was serialized on the row.
  // (This matches the stored markup shown in the validation warning.)
  if (shouldApplyContainerPaddingOnRow && containerPadding && typeof containerPadding === 'object') {
    const rowStyle = {};
    if (containerPadding.top !== undefined) rowStyle.paddingTop = containerPadding.top;
    if (containerPadding.right !== undefined) rowStyle.paddingRight = containerPadding.right;
    if (containerPadding.bottom !== undefined) rowStyle.paddingBottom = containerPadding.bottom;
    if (containerPadding.left !== undefined) rowStyle.paddingLeft = containerPadding.left;
    if (Object.keys(rowStyle).length > 0) {
      rowProps.style = rowStyle;
    }
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    className: wrapperClassNameFromMarkup,
    style: wrapperStyle
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...rowProps
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null), '\n\n')));
}

/***/ },

/***/ "./src/save-versions/save-v7-legacy-boxed-no-inner-container.js"
/*!**********************************************************************!*\
  !*** ./src/save-versions/save-v7-legacy-boxed-no-inner-container.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveV7LegacyBoxedNoInnerContainer)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../save */ "./src/save.js");





/**
 * Deprecated (2026-03-09):
 * Boxed (`size: container`) used to serialize the container background on the
 * outer wrapper, without an inner `.container` wrapper.
 *
 * Kept to avoid validation errors for existing content.
 */
function saveV7LegacyBoxedNoInnerContainer(props) {
  const {
    attributes,
    className
  } = props;
  const {
    verticalAlignment,
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    size,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    rowGapTablet,
    rowGapUnitTablet,
    rowGapMobile,
    rowGapUnitMobile,
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile,
    containerMargin,
    containerPadding,
    rowTextColor
  } = attributes;

  // Only handle boxed legacy markup here; for other sizes, use the
  // current save implementation (unchanged for those cases).
  let defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }
  if (defaultSize !== 'container') {
    return (0,_save__WEBPACK_IMPORTED_MODULE_3__["default"])(props);
  }
  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', rowTextColor) : undefined;
  const hasClassicBackground = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const computedBackgroundType = backgroundType || (hasClassicBackground ? 'classic' : undefined);
  let classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, {
    container: true,
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile,
    'madeit-block-content--frontend': true,
    [`are-vertically-aligned-${verticalAlignment}`]: !!verticalAlignment
  });
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    'has-background': containerBackgroundColorClass,
    [containerBackgroundColorClass]: containerBackgroundColorClass,
    [rowTextColorClass]: rowTextColorClass
  });
  const style = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  const hasBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0;
  const hasBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0;
  const hasBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0;
  const computedBackgroundGradient = attributes.containerBackgroundGradient || {
    gradient: ''
  };
  const computedBackgroundGradientValue = typeof computedBackgroundGradient?.gradient === 'string' && computedBackgroundGradient.gradient.trim().length > 0 ? computedBackgroundGradient.gradient : undefined;
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    style.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (hasBackgroundPosition) {
      style.backgroundPosition = containerBackgroundPosition;
    }
    if (hasBackgroundRepeat) {
      style.backgroundRepeat = containerBackgroundRepeat;
    }
    if (hasBackgroundSize) {
      style.backgroundSize = containerBackgroundSize;
    }
  }
  if (computedBackgroundType === 'gradient' && computedBackgroundGradientValue) {
    style.backgroundImage = computedBackgroundGradientValue;
  }
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') {
    style.overflow = overflow;
  }

  // Responsive min-height via CSS variables.
  if (typeof minHeight === 'number') {
    style['--madeit-min-height-desktop'] = `${minHeight}${minHeightUnit || 'px'}`;
  }
  if (typeof minHeightTablet === 'number') {
    style['--madeit-min-height-tablet'] = `${minHeightTablet}${minHeightUnitTablet || minHeightUnit || 'px'}`;
  }
  if (typeof minHeightMobile === 'number') {
    style['--madeit-min-height-mobile'] = `${minHeightMobile}${minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px'}`;
  }

  // Responsive max-width via CSS variables.
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }

  // Row gap via CSS variables.
  const hasRowGapDesktop = typeof rowGap === 'number';
  if (hasRowGapDesktop) {
    style['--madeit-row-gap-desktop'] = `${rowGap}${rowGapUnit || 'px'}`;
    if (typeof rowGapTablet === 'number') {
      style['--madeit-row-gap-tablet'] = `${rowGapTablet}${rowGapUnitTablet || 'px'}`;
    }
    if (typeof rowGapMobile === 'number') {
      style['--madeit-row-gap-mobile'] = `${rowGapMobile}${rowGapUnitMobile || 'px'}`;
    }
  }

  // Responsive flex-direction via CSS variables (only if explicitly set).
  if (typeof flexDirection === 'string' && flexDirection.length > 0) {
    style['--madeit-flex-direction-desktop'] = flexDirection;
  }
  if (typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0) {
    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
  }
  if (typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0) {
    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
  }
  if (typeof alignItems === 'string' && alignItems.length > 0) {
    style['--madeit-align-items-desktop'] = alignItems;
  }
  if (typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0) {
    style['--madeit-align-items-tablet'] = alignItemsTablet;
  }
  if (typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0) {
    style['--madeit-align-items-mobile'] = alignItemsMobile;
  }
  if (typeof justifyContent === 'string' && justifyContent.length > 0) {
    style['--madeit-justify-content-desktop'] = justifyContent;
  }
  if (typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0) {
    style['--madeit-justify-content-tablet'] = justifyContentTablet;
  }
  if (typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0) {
    style['--madeit-justify-content-mobile'] = justifyContentMobile;
  }
  if (typeof flexWrap === 'string' && flexWrap.length > 0) {
    style['--madeit-flex-wrap-desktop'] = flexWrap;
  }
  if (typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0) {
    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
  }
  if (typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0) {
    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
  }
  if (containerMargin !== undefined && containerMargin.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin !== undefined && containerMargin.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  if (containerMargin !== undefined && containerMargin.left !== undefined) {
    style.marginLeft = containerMargin.left;
    style['--margin-left-desktop'] = containerMargin.left;
  }
  if (containerMargin !== undefined && containerMargin.right !== undefined) {
    style.marginRight = containerMargin.right;
    style['--margin-right-desktop'] = containerMargin.right;
  }
  if (containerPadding !== undefined && containerPadding.top !== undefined) {
    style.paddingTop = containerPadding.top;
  }
  if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
    style.paddingBottom = containerPadding.bottom;
  }
  if (containerPadding !== undefined && containerPadding.left !== undefined) {
    style.paddingLeft = containerPadding.left;
  }
  if (containerPadding !== undefined && containerPadding.right !== undefined) {
    style.paddingRight = containerPadding.right;
  }

  // Apply row text color inline only when no class exists.
  if (!rowTextColorClass) {
    style.color = rowTextColorClass;
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classes,
    style
  });
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const dirDesktop = typeof flexDirection === 'string' && flexDirection.length > 0 ? flexDirection : 'row';
  const dirTablet = typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ? flexDirectionTablet : undefined;
  const dirMobile = typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ? flexDirectionMobile : undefined;
  const hasEnhancedRowWrapper = Number.isFinite(columnsCount) || typeof flexDirection === 'string' && flexDirection.length > 0 || typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 || typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0;
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const rowClassName = hasEnhancedRowWrapper ? `row madeit-container-row rows-${rowsCount}` : 'row';
  const rowProps = hasEnhancedRowWrapper ? {
    className: rowClassName,
    'data-madeit-dir': dirDesktop,
    'data-madeit-dir-tablet': dirTablet,
    'data-madeit-dir-mobile': dirMobile
  } : {
    className: rowClassName
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...rowProps
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n'));
}

/***/ },

/***/ "./src/save-versions/save-v8-very-old-markup-plain-row.js"
/*!****************************************************************!*\
  !*** ./src/save-versions/save-v8-very-old-markup-plain-row.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveV8VeryOldMarkupPlainRow)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);




/**
 * Deprecated (very old markup):
 * - No `madeit-block-content--frontend` class on the wrapper
 * - Inner wrapper was a plain `.row` (no `madeit-container-row`, no data attrs)
 */
function saveV8VeryOldMarkupPlainRow(props) {
  const {
    size,
    contentWidth,
    containerMargin,
    containerPadding,
    rowMargin,
    rowPadding,
    htmlTag
  } = props.attributes;
  const {
    className
  } = props;
  let classes = className;
  let defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }
  const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
  const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
  const contentWidthResolvedRaw = hasContentWidth ? contentWidth : defaultSize === 'container-content-boxed' ? 'container' : outerSizeNormalized;
  let contentWidthNormalized = contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';
  if (outerSizeNormalized === 'container') {
    contentWidthNormalized = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    container: 'container' === defaultSize,
    'container-fluid': 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize
  });
  const style = {};
  if (containerMargin !== undefined && containerMargin.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin !== undefined && containerMargin.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  if (containerMargin !== undefined && containerMargin.left !== undefined) {
    style.marginLeft = containerMargin.left;
  }
  if (containerMargin !== undefined && containerMargin.right !== undefined) {
    style.marginRight = containerMargin.right;
  }
  if (containerPadding !== undefined && containerPadding.top !== undefined) {
    style.paddingTop = containerPadding.top;
  }
  if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
    style.paddingBottom = containerPadding.bottom;
  }
  if (containerPadding !== undefined && containerPadding.left !== undefined) {
    style.paddingLeft = containerPadding.left;
  }
  if (containerPadding !== undefined && containerPadding.right !== undefined) {
    style.paddingRight = containerPadding.right;
  }

  // Historic: for these old blocks, row spacing/padding was applied
  // on the same wrapper (so we mimic the old behavior).
  if (rowMargin !== undefined && rowMargin.top !== undefined) {
    style.marginTop = rowMargin.top;
  }
  if (rowMargin !== undefined && rowMargin.bottom !== undefined) {
    style.marginBottom = rowMargin.bottom;
  }
  if (rowMargin !== undefined && rowMargin.left !== undefined) {
    style.marginLeft = rowMargin.left;
  }
  if (rowMargin !== undefined && rowMargin.right !== undefined) {
    style.marginRight = rowMargin.right;
  }
  if (rowPadding !== undefined && rowPadding.top !== undefined) {
    style.paddingTop = rowPadding.top;
  }
  if (rowPadding !== undefined && rowPadding.bottom !== undefined) {
    style.paddingBottom = rowPadding.bottom;
  }
  if (rowPadding !== undefined && rowPadding.left !== undefined) {
    style.paddingLeft = rowPadding.left;
  }
  if (rowPadding !== undefined && rowPadding.right !== undefined) {
    style.paddingRight = rowPadding.right;
  }
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const shouldWrapContent = outerSizeNormalized !== 'container' && hasContentWidth && contentWidthNormalized !== outerSizeNormalized;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classes,
    style
  });
  if (shouldWrapContent) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        container: contentWidthNormalized === 'container',
        'container-fluid': contentWidthNormalized === 'container-fluid'
      })
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "row"
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n')));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "row"
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n'));
}

/***/ },

/***/ "./src/save-versions/save-v9-legacy-no-overflow-serialized.js"
/*!********************************************************************!*\
  !*** ./src/save-versions/save-v9-legacy-no-overflow-serialized.js ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveV9LegacyNoOverflowSerialized)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);




/**
 * Deprecated (legacy markup):
 * - Wrapper *did* include `madeit-block-content--frontend`
 * - Inner wrapper *did* include `.madeit-container-row` + data attrs
 * - But `overflow:visible` was NOT serialized in the style attribute
 * - The inner row wrapper contained newline whitespace
 */
function saveV9LegacyNoOverflowSerialized(props) {
  const {
    verticalAlignment,
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    size,
    contentWidth,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor,
    containerMargin,
    containerPadding,
    rowMargin,
    rowPadding,
    // overflow intentionally ignored
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    rowGapTablet,
    rowGapUnitTablet,
    rowGapMobile,
    rowGapUnitMobile,
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = props.attributes;
  const {
    className
  } = props;
  const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', rowTextColor) : undefined;
  const hasClassicBackground = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const computedBackgroundType = backgroundType || (hasClassicBackground ? 'classic' : undefined);
  let classes = className;
  let classesChild = '';
  let defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }
  const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
  const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
  const contentWidthResolvedRaw = hasContentWidth ? contentWidth : defaultSize === 'container-content-boxed' ? 'container' : outerSizeNormalized;
  let contentWidthNormalized = contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';
  if (outerSizeNormalized === 'container') {
    contentWidthNormalized = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    container: 'container' === defaultSize,
    'container-fluid': 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile
  });
  if (defaultSize !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize === 'container-content-boxed',
    container: contentWidthNormalized === 'container',
    'container-fluid': contentWidthNormalized === 'container-fluid'
  });
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    'has-background': containerBackgroundColorClass,
    [containerBackgroundColorClass]: containerBackgroundColorClass,
    [rowTextColorClass]: rowTextColorClass
  });
  const style = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  const hasBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0;
  const hasBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0;
  const hasBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0;
  const computedBackgroundGradient = props.attributes.containerBackgroundGradient || {
    gradient: ''
  };
  const computedBackgroundGradientValue = typeof computedBackgroundGradient?.gradient === 'string' && computedBackgroundGradient.gradient.trim().length > 0 ? computedBackgroundGradient.gradient : undefined;
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    style.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (hasBackgroundPosition) {
      style.backgroundPosition = containerBackgroundPosition;
    }
    if (hasBackgroundRepeat) {
      style.backgroundRepeat = containerBackgroundRepeat;
    }
    if (hasBackgroundSize) {
      style.backgroundSize = containerBackgroundSize;
    }
  }
  if (computedBackgroundType === 'gradient' && computedBackgroundGradientValue) {
    style.backgroundImage = computedBackgroundGradientValue;
  }

  // Responsive min-height via CSS variables.
  if (typeof minHeight === 'number') {
    style['--madeit-min-height-desktop'] = `${minHeight}${minHeightUnit || 'px'}`;
  }
  if (typeof minHeightTablet === 'number') {
    style['--madeit-min-height-tablet'] = `${minHeightTablet}${minHeightUnitTablet || 'px'}`;
  }
  if (typeof minHeightMobile === 'number') {
    style['--madeit-min-height-mobile'] = `${minHeightMobile}${minHeightUnitMobile || 'px'}`;
  }

  // Responsive max-width via CSS variables.
  if (typeof maxWidth === 'number') {
    style['--madeit-max-width-desktop'] = `${maxWidth}${maxWidthUnit || 'px'}`;
  }
  if (typeof maxWidthTablet === 'number') {
    style['--madeit-max-width-tablet'] = `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`;
  }
  if (typeof maxWidthMobile === 'number') {
    style['--madeit-max-width-mobile'] = `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`;
  }

  // Row gap via CSS variables.
  const hasRowGapDesktop = typeof rowGap === 'number';
  if (hasRowGapDesktop) {
    style['--madeit-row-gap-desktop'] = `${rowGap}${rowGapUnit || 'px'}`;
    if (typeof rowGapTablet === 'number') {
      style['--madeit-row-gap-tablet'] = `${rowGapTablet}${rowGapUnitTablet || 'px'}`;
    }
    if (typeof rowGapMobile === 'number') {
      style['--madeit-row-gap-mobile'] = `${rowGapMobile}${rowGapUnitMobile || 'px'}`;
    }
  }

  // Responsive flex-direction via CSS variables.
  style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
  if (flexDirectionTablet) {
    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
  }
  if (flexDirectionMobile) {
    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
  }
  style['--madeit-align-items-desktop'] = alignItems || 'stretch';
  if (alignItemsTablet) {
    style['--madeit-align-items-tablet'] = alignItemsTablet;
  }
  if (alignItemsMobile) {
    style['--madeit-align-items-mobile'] = alignItemsMobile;
  }
  style['--madeit-justify-content-desktop'] = justifyContent || 'flex-start';
  if (justifyContentTablet) {
    style['--madeit-justify-content-tablet'] = justifyContentTablet;
  }
  if (justifyContentMobile) {
    style['--madeit-justify-content-mobile'] = justifyContentMobile;
  }
  style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';
  if (flexWrapTablet) {
    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
  }
  if (flexWrapMobile) {
    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
  }
  if (containerMargin?.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin?.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  if (containerMargin?.left !== undefined) {
    style.marginLeft = containerMargin.left;
  }
  if (containerMargin?.right !== undefined) {
    style.marginRight = containerMargin.right;
  }
  if (containerPadding?.top !== undefined) {
    style.paddingTop = containerPadding.top;
  }
  if (containerPadding?.bottom !== undefined) {
    style.paddingBottom = containerPadding.bottom;
  }
  if (containerPadding?.left !== undefined) {
    style.paddingLeft = containerPadding.left;
  }
  if (containerPadding?.right !== undefined) {
    style.paddingRight = containerPadding.right;
  }
  let styleChild = {};
  if (defaultSize === 'container-content-boxed') {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-text-color': rowTextColor !== undefined,
      'has-background': rowBackgroundColor !== undefined,
      [rowBackgroundColorClass]: rowBackgroundColor !== undefined,
      [rowTextColorClass]: rowTextColor !== undefined
    });
    styleChild = {
      backgroundColor: rowBackgroundColorClass ? undefined : customRowBackgroundColor,
      color: rowTextColorClass ? undefined : customRowTextColor
    };
    if (rowMargin?.top !== undefined) {
      styleChild.marginTop = rowMargin.top;
    }
    if (rowMargin?.bottom !== undefined) {
      styleChild.marginBottom = rowMargin.bottom;
    }
    if (rowMargin?.left !== undefined) {
      styleChild.marginLeft = rowMargin.left;
    }
    if (rowMargin?.right !== undefined) {
      styleChild.marginRight = rowMargin.right;
    }
    if (rowPadding?.top !== undefined) {
      styleChild.paddingTop = rowPadding.top;
    }
    if (rowPadding?.bottom !== undefined) {
      styleChild.paddingBottom = rowPadding.bottom;
    }
    if (rowPadding?.left !== undefined) {
      styleChild.paddingLeft = rowPadding.left;
    }
    if (rowPadding?.right !== undefined) {
      styleChild.paddingRight = rowPadding.right;
    }
  } else {
    style.color = rowTextColorClass ? undefined : customRowTextColor;
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, FRONTEND_WRAPPER_CLASS),
    style
  });
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const dirDesktop = flexDirection || 'row';
  const dirTablet = flexDirectionTablet || undefined;
  const dirMobile = flexDirectionMobile || undefined;
  if (size === 'container-content-boxed') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `row madeit-container-row rows-${columnsCount || 0}`,
      "data-madeit-dir": dirDesktop,
      "data-madeit-dir-tablet": dirTablet,
      "data-madeit-dir-mobile": dirMobile
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `row madeit-container-row rows-${columnsCount || 0}`,
      "data-madeit-dir": dirDesktop,
      "data-madeit-dir-tablet": dirTablet,
      "data-madeit-dir-mobile": dirMobile
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n')))));
  }
  const shouldWrapContent = outerSizeNormalized !== 'container' && hasContentWidth && contentWidthNormalized !== outerSizeNormalized;
  if (shouldWrapContent) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        container: contentWidthNormalized === 'container',
        'container-fluid': contentWidthNormalized === 'container-fluid'
      })
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `row madeit-container-row rows-${columnsCount || 0}`,
      "data-madeit-dir": dirDesktop,
      "data-madeit-dir-tablet": dirTablet,
      "data-madeit-dir-mobile": dirMobile
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n')));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `row madeit-container-row rows-${columnsCount || 0}`,
    "data-madeit-dir": dirDesktop,
    "data-madeit-dir-tablet": dirTablet,
    "data-madeit-dir-mobile": dirMobile
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n'));
}

/***/ },

/***/ "./src/save-versions/v1.js"
/*!*********************************!*\
  !*** ./src/save-versions/v1.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */




/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
function save(props) {
  const {
    verticalAlignment,
    containerBackgroundColor,
    customContainerBackgroundColor,
    size,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor,
    containerMargin,
    containerPadding,
    rowMargin,
    rowPadding
  } = props.attributes;
  const {
    className
  } = props;
  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', rowTextColor) : undefined;
  var classes = className;
  var classesChild = '';
  var defaultSize = size;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    [`container`]: 'container' === defaultSize,
    [`container-fluid`]: 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize
  });
  if (defaultSize !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize === 'container-content-boxed',
    [`container`]: 'container' === defaultSize || 'container-content-boxed' === defaultSize,
    [`container-fluid`]: 'container-fluid' === defaultSize
  });
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    'has-background': containerBackgroundColorClass,
    [containerBackgroundColorClass]: containerBackgroundColorClass,
    [rowTextColorClass]: rowTextColorClass
  });
  var style = {
    backgroundColor: containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  if (containerMargin !== undefined && containerMargin.top !== undefined) {
    style.marginTop = containerMargin.top;
  }
  if (containerMargin !== undefined && containerMargin.bottom !== undefined) {
    style.marginBottom = containerMargin.bottom;
  }
  if (containerPadding !== undefined && containerPadding.top !== undefined) {
    style.paddingTop = containerPadding.top;
  }
  if (containerPadding !== undefined && containerPadding.bottom !== undefined) {
    style.paddingBottom = containerPadding.bottom;
  }
  if (containerPadding !== undefined && containerPadding.left !== undefined) {
    style.paddingLeft = containerPadding.left;
  }
  if (containerPadding !== undefined && containerPadding.right !== undefined) {
    style.paddingRight = containerPadding.right;
  }
  var styleChild = {};
  if (defaultSize === 'container-content-boxed') {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-text-color': rowTextColor !== undefined,
      'has-background': rowBackgroundColor !== undefined,
      [rowBackgroundColorClass]: rowBackgroundColor !== undefined,
      [rowTextColorClass]: rowTextColor !== undefined
    });
    styleChild = {
      backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
      color: rowTextColorClass ? undefined : rowTextColorClass
    };
    if (rowMargin !== undefined && rowMargin.top !== undefined) {
      styleChild.marginTop = rowMargin.top;
    }
    if (rowMargin !== undefined && rowMargin.bottom !== undefined) {
      styleChild.marginBottom = rowMargin.bottom;
    }
    if (rowPadding !== undefined && rowPadding.top !== undefined) {
      styleChild.paddingTop = rowPadding.top;
    }
    if (rowPadding !== undefined && rowPadding.bottom !== undefined) {
      styleChild.paddingBottom = rowPadding.bottom;
    }
    if (rowPadding !== undefined && rowPadding.left !== undefined) {
      styleChild.paddingLeft = rowPadding.left;
    }
    if (rowPadding !== undefined && rowPadding.right !== undefined) {
      styleChild.paddingRight = rowPadding.right;
    }
  } else {
    style.color = rowTextColorClass ? undefined : rowTextColorClass;
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
    className: classes,
    style: style
  });
  if (size === 'container-content-boxed') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "row"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "row"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null))))));
  } else {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "row"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)));
  }
}

/***/ },

/***/ "./src/save.js"
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */




/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
function save(props) {
  const {
    wrapperClassName,
    wrapperStyle,
    directRowClassName,
    boxedInnerContainerClassName,
    boxedInnerRowClassName,
    verticalAlignment,
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    size,
    contentWidth,
    rowBackgroundColor,
    rowTextColor,
    customRowBackgroundColor,
    customRowTextColor,
    containerMargin,
    containerMarginTablet,
    containerMarginMobile,
    containerPadding,
    containerPaddingTablet,
    containerPaddingMobile,
    containerPaddingOnRow,
    rowMargin,
    rowPadding,
    overflow,
    htmlTag,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    alignItems,
    alignItemsTablet,
    alignItemsMobile,
    justifyContent,
    justifyContentTablet,
    justifyContentMobile,
    flexWrap,
    flexWrapTablet,
    flexWrapMobile,
    minHeight,
    minHeightUnit,
    minHeightTablet,
    minHeightUnitTablet,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    maxWidthTablet,
    maxWidthUnitTablet,
    maxWidthMobile,
    maxWidthUnitMobile,
    rowGap,
    rowGapUnit,
    rowGapTablet,
    rowGapUnitTablet,
    rowGapMobile,
    rowGapUnitMobile,
    columnsCount,
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile,
    madeitHasUserEdits
  } = props.attributes;
  const {
    className
  } = props;

  // NOTE: Historically this block was saved without additional wrapper classes
  // and without layout-related inline CSS vars. To avoid block validation
  // failures on legacy/pasted content, we only serialize “enhanced” markup
  // when the corresponding attributes are explicitly set.

  const containerBackgroundColorClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const rowBackgroundColorClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextColorClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', rowTextColor) : undefined;
  const hasClassicBackground = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const computedBackgroundType = backgroundType || (hasClassicBackground ? 'classic' : undefined);
  const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
  const classNameRaw = typeof className === 'string' ? className.trim() : '';
  const extraClassName = classNameRaw ? classNameRaw.split(/\s+/).filter(Boolean)
  // Strip classes that are controlled by this block's save() so
  // legacy parsing doesn't accidentally re-inject them and cause
  // validation mismatches (e.g. `container` + `container-fluid`).
  .filter(token => {
    if (token === 'wp-block-madeit-block-content') return false;
    if (token === 'container' || token === 'container-fluid') return false;
    if (token === FRONTEND_WRAPPER_CLASS) return false;
    if (token === 'has-text-color' || token === 'has-background') return false;
    if (token.startsWith('are-vertically-aligned-')) return false;
    if (token.startsWith('is-hidden-')) return false;
    return true;
  }).join(' ') : '';
  var classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content', extraClassName);
  var classesChild = '';
  const hasExplicitSize = typeof size === 'string' && size.trim().length > 0;
  var defaultSize = hasExplicitSize ? size.trim() : undefined;
  if (defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
    defaultSize = undefined;
  }
  const wrapperClassNameRaw = typeof wrapperClassName === 'string' ? wrapperClassName.trim() : '';
  const wrapperTokens = wrapperClassNameRaw.length ? wrapperClassNameRaw.split(/\s+/) : [];
  const wrapperHasContainer = wrapperTokens.includes('container');
  const wrapperHasContainerFluid = wrapperTokens.includes('container-fluid');

  // Legacy compatibility (default drift / missing serialized attributes):
  // Only override based on wrapper classes when it helps match stored markup
  // for content that parses with defaults.
  if (defaultSize === 'container-content-boxed') {
    // Old content saved as `.container` should not be forced into boxed.
    if (wrapperHasContainer && !wrapperHasContainerFluid) {
      defaultSize = 'container';
    }
  } else {
    // If our inferred size differs from the wrapper markup, correct it.
    if (wrapperHasContainerFluid && !wrapperHasContainer) {
      defaultSize = 'container-fluid';
    } else if (wrapperHasContainer && !wrapperHasContainerFluid) {
      defaultSize = 'container';
    }
  }

  // Fallback default when neither attributes nor markup specify a size.
  if (!defaultSize) {
    defaultSize = 'container';
  }
  const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
  const hasWrapperClassNameFromMarkup = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0;
  const wrapperHasFrontendClass = hasWrapperClassNameFromMarkup && wrapperClassName.split(/\s+/).includes(FRONTEND_WRAPPER_CLASS);

  // General legacy compatibility:
  // Older saved content may not include the frontend wrapper class at all
  // (regardless of `size`). When we can detect that from parsed markup,
  // we must not inject the class in `save()`, otherwise block validation
  // fails and the editor shows recovery prompts.
  const shouldUseLegacyWrapperClasses = hasWrapperClassNameFromMarkup && !wrapperHasFrontendClass && !madeitHasUserEdits;

  // Very old saved content (no frontend wrapper class) also did not include
  // the enhanced layout-related CSS variables. To keep block validation
  // stable, do not serialize these vars for that legacy markup.
  const shouldSerializeEnhancedLayoutVars = !shouldUseLegacyWrapperClasses;

  // Compatibility: some historical versions stored only a subset of the
  // `--madeit-*` CSS vars even when the attributes existed. When we can read
  // the stored `style` attribute (via derived `wrapperStyle`), only serialize
  // vars that were present in the original markup to avoid validation errors.
  const wrapperStyleRaw = typeof wrapperStyle === 'string' ? wrapperStyle : '';
  const wrapperStyleNormalized = wrapperStyleRaw.replace(/\s+/g, '');
  const shouldMatchWrapperStyleVars = wrapperStyleNormalized.length > 0 && !madeitHasUserEdits;

  // Defaults from the block's default variation (`madeit-default-responsive`).
  // These are provided via CSS on `.madeit-block-content--frontend`, so we
  // should NOT serialize them inline (doing so causes validation drift for
  // older posts that had no `style` attribute).
  const DEFAULT_ROW_GAP = 20;
  const DEFAULT_FLEX_DIRECTION_DESKTOP = 'row';
  const DEFAULT_FLEX_DIRECTION_TABLET = 'column';
  const DEFAULT_FLEX_DIRECTION_MOBILE = 'column';
  const DEFAULT_ALIGN_ITEMS_DESKTOP = 'stretch';
  const DEFAULT_JUSTIFY_CONTENT_DESKTOP = 'flex-start';
  const DEFAULT_FLEX_WRAP_DESKTOP = 'nowrap';
  const escapeRegExp = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wrapperHadVar = varName => shouldMatchWrapperStyleVars && wrapperStyleNormalized.includes(`${varName}:`);
  const getWrapperVarValue = varName => {
    if (!shouldMatchWrapperStyleVars) return undefined;
    const pattern = new RegExp(`${escapeRegExp(varName)}:([^;]+)`);
    const match = wrapperStyleNormalized.match(pattern);
    return match?.[1];
  };
  const maybeSetVar = (targetStyle, varName, value) => {
    if (shouldMatchWrapperStyleVars && !wrapperHadVar(varName)) return;
    if (value === undefined || value === null) return;
    targetStyle[varName] = value;
  };

  // Legacy boxed markup (the one throwing validation errors):
  // - Wrapper did NOT include `madeit-block-content--frontend`
  // - `.row` was a direct child of the wrapper (no inner `.container`)
  // We only switch to legacy serialization when we can positively detect
  // legacy markup from the stored HTML (wrapperClassName derived attr).
  const shouldUseLegacyBoxedMarkup = defaultSize === 'container' && hasWrapperClassNameFromMarkup && !wrapperHasFrontendClass && !madeitHasUserEdits;

  // Keep the old direct-row detector as a secondary hint (some HTML parsers
  // won't support :scope selectors), but do not rely on it as the primary
  // switch.
  const hasDirectRowWrapper = typeof directRowClassName === 'string' && directRowClassName.trim().length > 0;
  const hasLegacyBoxedInnerRowWrapper = typeof boxedInnerRowClassName === 'string' && boxedInnerRowClassName.trim().length > 0;
  const applyContainerBackgroundToInner = defaultSize === 'container' && !shouldUseLegacyBoxedMarkup && !hasDirectRowWrapper;
  const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
  const contentWidthResolvedRaw = hasContentWidth ? contentWidth : defaultSize === 'container-content-boxed' ? 'container' : outerSizeNormalized;
  let contentWidthNormalized = contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';

  // If the outer container is boxed, content cannot be full width.
  if (outerSizeNormalized === 'container') {
    contentWidthNormalized = 'container';
  }
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    [`container`]: 'container' === defaultSize,
    [`container-fluid`]: 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
    [`is-hidden-desktop`]: !!hideOnDesktop,
    [`is-hidden-tablet`]: !!hideOnTablet,
    [`is-hidden-mobile`]: !!hideOnMobile,
    ['madeit-block-content--frontend']: !shouldUseLegacyWrapperClasses
  });
  if (defaultSize !== 'container-content-boxed') {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize !== 'container-content-boxed'
    });
  }
  classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment && defaultSize === 'container-content-boxed',
    [`container`]: contentWidthNormalized === 'container',
    [`container-fluid`]: contentWidthNormalized === 'container-fluid'
  });

  // Text color stays on the outer wrapper so it inherits everywhere.
  classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
    'has-text-color': rowTextColorClass,
    [rowTextColorClass]: rowTextColorClass
  });

  // Container background should live on the inner container when the block
  // is boxed, so padding/margins on the wrapper don't get painted.
  // BUT: legacy boxed markup had no inner container wrapper, so in that case
  // we keep the background on the outer wrapper for validation compatibility.
  if (applyContainerBackgroundToInner) {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  } else {
    classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes, {
      'has-background': containerBackgroundColorClass,
      [containerBackgroundColorClass]: containerBackgroundColorClass
    });
  }
  const containerBackgroundStyle = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : containerBackgroundColorClass ? undefined : customContainerBackgroundColor
  };
  var style = {};
  const toCssLength = (value, unit = 'px') => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return `${value}${unit || 'px'}`;
    }
    if (typeof value !== 'string') {
      return undefined;
    }
    const trimmed = value.trim();
    if (trimmed === '') {
      return undefined;
    }

    // Plain number string: treat as the number + provided unit.
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
      return `${trimmed}${unit || 'px'}`;
    }

    // Number with explicit unit (legacy): accept it as-is.
    if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(trimmed)) {
      return trimmed;
    }
    return undefined;
  };
  const hasBackgroundPosition = typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0;
  const hasBackgroundRepeat = typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0;
  const hasBackgroundSize = typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0;
  const computedBackgroundGradient = props.attributes.containerBackgroundGradient || {
    gradient: ''
  };
  const computedBackgroundGradientValue = typeof computedBackgroundGradient?.gradient === 'string' && computedBackgroundGradient.gradient.trim().length > 0 ? computedBackgroundGradient.gradient : undefined;
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    containerBackgroundStyle.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (hasBackgroundPosition) {
      containerBackgroundStyle.backgroundPosition = containerBackgroundPosition;
    }
    if (hasBackgroundRepeat) {
      containerBackgroundStyle.backgroundRepeat = containerBackgroundRepeat;
    }
    if (hasBackgroundSize) {
      containerBackgroundStyle.backgroundSize = containerBackgroundSize;
    }
  }
  if (computedBackgroundType === 'gradient' && computedBackgroundGradientValue) {
    containerBackgroundStyle.backgroundImage = computedBackgroundGradientValue;
  }
  if (!applyContainerBackgroundToInner) {
    style = {
      ...style,
      ...containerBackgroundStyle
    };
  }

  // Apply overflow to outer wrapper (avoid serializing default `visible`).
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') {
    style.overflow = overflow;
  }

  // Responsive min-height via CSS variables.
  const minHeightDesktopCss = toCssLength(minHeight, minHeightUnit || 'px');
  maybeSetVar(style, '--madeit-min-height-desktop', minHeightDesktopCss !== undefined ? minHeightDesktopCss : getWrapperVarValue('--madeit-min-height-desktop'));
  const minHeightTabletCss = toCssLength(minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px');
  maybeSetVar(style, '--madeit-min-height-tablet', minHeightTabletCss !== undefined ? minHeightTabletCss : getWrapperVarValue('--madeit-min-height-tablet'));
  const minHeightMobileCss = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px');
  maybeSetVar(style, '--madeit-min-height-mobile', minHeightMobileCss !== undefined ? minHeightMobileCss : getWrapperVarValue('--madeit-min-height-mobile'));

  // Responsive max-width via CSS variables.
  maybeSetVar(style, '--madeit-max-width-desktop', typeof maxWidth === 'number' ? `${maxWidth}${maxWidthUnit || 'px'}` : getWrapperVarValue('--madeit-max-width-desktop'));
  maybeSetVar(style, '--madeit-max-width-tablet', typeof maxWidthTablet === 'number' ? `${maxWidthTablet}${maxWidthUnitTablet || 'px'}` : getWrapperVarValue('--madeit-max-width-tablet'));
  maybeSetVar(style, '--madeit-max-width-mobile', typeof maxWidthMobile === 'number' ? `${maxWidthMobile}${maxWidthUnitMobile || 'px'}` : getWrapperVarValue('--madeit-max-width-mobile'));

  // Responsive row-gap via CSS variables.
  // Row gap via CSS variables.
  // Important for block validation stability: only serialize tablet/mobile overrides
  // when a desktop rowGap is explicitly set.
  if (shouldSerializeEnhancedLayoutVars) {
    const hasRowGapDesktop = typeof rowGap === 'number';
    if (hasRowGapDesktop) {
      const rowGapDesktopCss = `${rowGap}${rowGapUnit || 'px'}`;
      const shouldEmitRowGapDesktop = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-row-gap-desktop') : rowGap !== DEFAULT_ROW_GAP;
      if (shouldEmitRowGapDesktop) {
        maybeSetVar(style, '--madeit-row-gap-desktop', rowGapDesktopCss);
      }
      const shouldEmitRowGapTablet = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-row-gap-tablet') : typeof rowGapTablet === 'number' && rowGapTablet !== DEFAULT_ROW_GAP;
      if (shouldEmitRowGapTablet) {
        const rowGapTabletCss = `${rowGapTablet}${rowGapUnitTablet || 'px'}`;
        maybeSetVar(style, '--madeit-row-gap-tablet', rowGapTabletCss);
      }
      const shouldEmitRowGapMobile = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-row-gap-mobile') : typeof rowGapMobile === 'number' && rowGapMobile !== DEFAULT_ROW_GAP;
      if (shouldEmitRowGapMobile) {
        const rowGapMobileCss = `${rowGapMobile}${rowGapUnitMobile || 'px'}`;
        maybeSetVar(style, '--madeit-row-gap-mobile', rowGapMobileCss);
      }
    } else {
      // Only restore vars from stored markup when present.
      if (shouldMatchWrapperStyleVars) {
        maybeSetVar(style, '--madeit-row-gap-desktop', getWrapperVarValue('--madeit-row-gap-desktop'));
        maybeSetVar(style, '--madeit-row-gap-tablet', getWrapperVarValue('--madeit-row-gap-tablet'));
        maybeSetVar(style, '--madeit-row-gap-mobile', getWrapperVarValue('--madeit-row-gap-mobile'));
      }
    }
  }

  // Responsive flex-direction via CSS variables.
  if (shouldSerializeEnhancedLayoutVars) {
    const shouldEmitFlexDirDesktop = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-flex-direction-desktop') : typeof flexDirection === 'string' && flexDirection.length > 0 && flexDirection !== DEFAULT_FLEX_DIRECTION_DESKTOP;
    if (shouldEmitFlexDirDesktop) {
      maybeSetVar(style, '--madeit-flex-direction-desktop', flexDirection);
    }
    const shouldEmitFlexDirTablet = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-flex-direction-tablet') : typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 && flexDirectionTablet !== DEFAULT_FLEX_DIRECTION_TABLET;
    if (shouldEmitFlexDirTablet) {
      maybeSetVar(style, '--madeit-flex-direction-tablet', flexDirectionTablet);
    }
    const shouldEmitFlexDirMobile = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-flex-direction-mobile') : typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 && flexDirectionMobile !== DEFAULT_FLEX_DIRECTION_MOBILE;
    if (shouldEmitFlexDirMobile) {
      maybeSetVar(style, '--madeit-flex-direction-mobile', flexDirectionMobile);
    }
  }

  // Responsive align-items / justify-content via CSS variables.
  if (shouldSerializeEnhancedLayoutVars) {
    const shouldEmitAlignDesktop = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-align-items-desktop') : typeof alignItems === 'string' && alignItems.length > 0 && alignItems !== DEFAULT_ALIGN_ITEMS_DESKTOP;
    if (shouldEmitAlignDesktop) {
      maybeSetVar(style, '--madeit-align-items-desktop', alignItems);
    }
    const shouldEmitAlignTablet = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-align-items-tablet') : typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0;
    if (shouldEmitAlignTablet) {
      maybeSetVar(style, '--madeit-align-items-tablet', alignItemsTablet);
    }
    const shouldEmitAlignMobile = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-align-items-mobile') : typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0;
    if (shouldEmitAlignMobile) {
      maybeSetVar(style, '--madeit-align-items-mobile', alignItemsMobile);
    }
    const shouldEmitJustifyDesktop = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-justify-content-desktop') : typeof justifyContent === 'string' && justifyContent.length > 0 && justifyContent !== DEFAULT_JUSTIFY_CONTENT_DESKTOP;
    if (shouldEmitJustifyDesktop) {
      maybeSetVar(style, '--madeit-justify-content-desktop', justifyContent);
    }
    const shouldEmitJustifyTablet = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-justify-content-tablet') : typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0;
    if (shouldEmitJustifyTablet) {
      maybeSetVar(style, '--madeit-justify-content-tablet', justifyContentTablet);
    }
    const shouldEmitJustifyMobile = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-justify-content-mobile') : typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0;
    if (shouldEmitJustifyMobile) {
      maybeSetVar(style, '--madeit-justify-content-mobile', justifyContentMobile);
    }
  }

  // Responsive flex-wrap via CSS variables.
  if (shouldSerializeEnhancedLayoutVars) {
    const shouldEmitWrapDesktop = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-flex-wrap-desktop') : typeof flexWrap === 'string' && flexWrap.length > 0 && flexWrap !== DEFAULT_FLEX_WRAP_DESKTOP;
    if (shouldEmitWrapDesktop) {
      maybeSetVar(style, '--madeit-flex-wrap-desktop', flexWrap);
    }
    const shouldEmitWrapTablet = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-flex-wrap-tablet') : typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0;
    if (shouldEmitWrapTablet) {
      maybeSetVar(style, '--madeit-flex-wrap-tablet', flexWrapTablet);
    }
    const shouldEmitWrapMobile = shouldMatchWrapperStyleVars ? wrapperHadVar('--madeit-flex-wrap-mobile') : typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0;
    if (shouldEmitWrapMobile) {
      maybeSetVar(style, '--madeit-flex-wrap-mobile', flexWrapMobile);
    }
  }
  const setCssVarIfDefined = (targetStyle, key, value) => {
    if (value === undefined || value === null) return;
    if (typeof value !== 'string') return;
    const trimmed = value.trim();
    if (trimmed === '') return;
    targetStyle[key] = trimmed;
  };
  const setSpacingVars = (targetStyle, prefix, spacing, breakpoint) => {
    if (!spacing || typeof spacing !== 'object') return;
    setCssVarIfDefined(targetStyle, `--${prefix}-top-${breakpoint}`, spacing.top);
    setCssVarIfDefined(targetStyle, `--${prefix}-right-${breakpoint}`, spacing.right);
    setCssVarIfDefined(targetStyle, `--${prefix}-bottom-${breakpoint}`, spacing.bottom);
    setCssVarIfDefined(targetStyle, `--${prefix}-left-${breakpoint}`, spacing.left);
  };

  // Desktop margin stays as inline style for backward compatibility.
  // Tablet/mobile overrides are stored as CSS variables (overriding inline via
  // `!important` rules in the stylesheet when set).
  if (containerMargin && typeof containerMargin === 'object') {
    if (containerMargin.top !== undefined) {
      style.marginTop = containerMargin.top;
    }
    if (containerMargin.bottom !== undefined) {
      style.marginBottom = containerMargin.bottom;
    }
  }
  if (containerMarginTablet && typeof containerMarginTablet === 'object') {
    setCssVarIfDefined(style, '--madeit-container-margin-top-tablet', containerMarginTablet.top);
    setCssVarIfDefined(style, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom);
  }
  if (containerMarginMobile && typeof containerMarginMobile === 'object') {
    setCssVarIfDefined(style, '--madeit-container-margin-top-mobile', containerMarginMobile.top);
    setCssVarIfDefined(style, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom);
  }
  const shouldApplyContainerPaddingOnRow = containerPaddingOnRow === true;

  // Desktop padding stays as inline style for backward compatibility.
  // Tablet/mobile overrides are stored as CSS variables.
  const rowStyle = {};
  if (shouldApplyContainerPaddingOnRow) {
    if (containerPadding && typeof containerPadding === 'object') {
      if (containerPadding.top !== undefined) rowStyle.paddingTop = containerPadding.top;
      if (containerPadding.right !== undefined) rowStyle.paddingRight = containerPadding.right;
      if (containerPadding.bottom !== undefined) rowStyle.paddingBottom = containerPadding.bottom;
      if (containerPadding.left !== undefined) rowStyle.paddingLeft = containerPadding.left;
    }
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile');
  } else {
    if (containerPadding && typeof containerPadding === 'object') {
      if (containerPadding.top !== undefined) style.paddingTop = containerPadding.top;
      if (containerPadding.right !== undefined) style.paddingRight = containerPadding.right;
      if (containerPadding.bottom !== undefined) style.paddingBottom = containerPadding.bottom;
      if (containerPadding.left !== undefined) style.paddingLeft = containerPadding.left;
    }
    setSpacingVars(style, 'madeit-container-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(style, 'madeit-container-padding', containerPaddingMobile, 'mobile');
  }
  var styleChild = {};
  if (defaultSize === 'container-content-boxed') {
    classesChild = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classesChild, {
      'has-text-color': rowTextColor !== undefined,
      'has-background': rowBackgroundColor !== undefined,
      [rowBackgroundColorClass]: rowBackgroundColor !== undefined,
      [rowTextColorClass]: rowTextColor !== undefined
    });
    styleChild = {
      backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
      color: rowTextColorClass ? undefined : rowTextColorClass
    };
    if (rowMargin !== undefined && rowMargin.top !== undefined) {
      styleChild.marginTop = rowMargin.top;
    }
    if (rowMargin !== undefined && rowMargin.bottom !== undefined) {
      styleChild.marginBottom = rowMargin.bottom;
    }
    if (rowMargin !== undefined && rowMargin.left !== undefined) {
      styleChild.marginLeft = rowMargin.left;
    }
    if (rowMargin !== undefined && rowMargin.right !== undefined) {
      styleChild.marginRight = rowMargin.right;
    }
    if (rowPadding !== undefined && rowPadding.top !== undefined) {
      styleChild.paddingTop = rowPadding.top;
    }
    if (rowPadding !== undefined && rowPadding.bottom !== undefined) {
      styleChild.paddingBottom = rowPadding.bottom;
    }
    if (rowPadding !== undefined && rowPadding.left !== undefined) {
      styleChild.paddingLeft = rowPadding.left;
    }
    if (rowPadding !== undefined && rowPadding.right !== undefined) {
      styleChild.paddingRight = rowPadding.right;
    }
  } else {
    style.color = rowTextColorClass ? undefined : rowTextColorClass;
    if (applyContainerBackgroundToInner) {
      styleChild = {
        ...styleChild,
        ...containerBackgroundStyle
      };
    }
  }
  const hasStyleProps = Object.keys(style).length > 0;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
    className: classes,
    style: hasStyleProps ? style : undefined
  });
  const allowedHtmlTags = ['div', 'section', 'article', 'main', 'header', 'footer'];
  const HtmlTag = allowedHtmlTags.includes(htmlTag) ? htmlTag : 'div';
  const dirDesktop = typeof flexDirection === 'string' && flexDirection.length > 0 ? flexDirection : 'row';
  const dirTablet = typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ? flexDirectionTablet : undefined;
  const dirMobile = typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ? flexDirectionMobile : undefined;
  const hasEnhancedRowWrapper = Number.isFinite(columnsCount) || typeof flexDirection === 'string' && flexDirection.length > 0 || typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 || typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0;
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const rowClassName = hasEnhancedRowWrapper ? `row madeit-container-row rows-${rowsCount}` : 'row';
  const baseRowProps = hasEnhancedRowWrapper ? {
    className: rowClassName,
    'data-madeit-dir': dirDesktop,
    'data-madeit-dir-tablet': dirTablet,
    'data-madeit-dir-mobile': dirMobile
  } : {
    className: rowClassName
  };
  const hasRowStyle = Object.keys(rowStyle).length > 0;
  const outerRowProps = hasRowStyle ? {
    ...baseRowProps,
    style: rowStyle
  } : baseRowProps;
  const innerRowProps = baseRowProps;
  if (defaultSize === 'container-content-boxed') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classesChild,
      style: styleChild
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...innerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')))));
  } else {
    // Legacy boxed inner structure (row > col > container > row).
    // If detected from stored markup, serialize the exact same wrapper
    // structure so Gutenberg validation can succeed.
    if (hasLegacyBoxedInnerRowWrapper && defaultSize !== 'container-content-boxed') {
      const innerContainerClassFromMarkup = typeof boxedInnerContainerClassName === 'string' && boxedInnerContainerClassName.trim().length > 0 ? boxedInnerContainerClassName.trim() : 'container';
      const innerRowClassFromMarkup = typeof boxedInnerRowClassName === 'string' && boxedInnerRowClassName.trim().length > 0 ? boxedInnerRowClassName.trim() : innerRowProps.className;
      const innerRowPropsFromMarkup = {
        ...innerRowProps,
        className: innerRowClassFromMarkup
      };
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...outerRowProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "col"
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: innerContainerClassFromMarkup
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...innerRowPropsFromMarkup
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')))));
    }

    // Legacy markup: some older saved content had `.row` directly under the
    // wrapper (no inner `.container`). When detected via `directRowClassName`
    // (derived from stored HTML), serialize the same structure to avoid
    // block validation errors.
    if (hasDirectRowWrapper) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...outerRowProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n'));
    }
    const shouldWrapContent = outerSizeNormalized !== 'container' && hasContentWidth && contentWidthNormalized !== outerSizeNormalized;
    if (applyContainerBackgroundToInner) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classesChild,
        style: styleChild
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...outerRowProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')));
    }
    if (shouldWrapContent) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
          container: contentWidthNormalized === 'container',
          'container-fluid': contentWidthNormalized === 'container-fluid'
        })
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...outerRowProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n')));
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n'));
  }
}

/***/ },

/***/ "./src/utils.js"
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAdjacentBlocks: () => (/* binding */ getAdjacentBlocks),
/* harmony export */   getColumnWidths: () => (/* binding */ getColumnWidths),
/* harmony export */   getColumnsTemplate: () => (/* binding */ getColumnsTemplate),
/* harmony export */   getEffectiveColumnWidth: () => (/* binding */ getEffectiveColumnWidth),
/* harmony export */   getMappedColumnWidths: () => (/* binding */ getMappedColumnWidths),
/* harmony export */   getRedistributedColumnWidths: () => (/* binding */ getRedistributedColumnWidths),
/* harmony export */   getTotalColumnsWidth: () => (/* binding */ getTotalColumnsWidth),
/* harmony export */   hasExplicitColumnWidths: () => (/* binding */ hasExplicitColumnWidths),
/* harmony export */   toWidthPrecision: () => (/* binding */ toWidthPrecision)
/* harmony export */ });
/* harmony import */ var memize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! memize */ "./node_modules/memize/dist/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/**
 * External dependencies
 */



/**
 * Returns the layouts configuration for a given number of columns.
 *
 * @param {number} columns Number of columns.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getColumnsTemplate = (0,memize__WEBPACK_IMPORTED_MODULE_0__["default"])(columns => {
  if (columns === undefined) {
    return null;
  }
  return (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(columns, () => ['madeit/block-content-column']);
});

/**
 * Returns a column width attribute value rounded to standard precision.
 * Returns `undefined` if the value is not a valid finite number.
 *
 * @param {?number} value Raw value.
 *
 * @return {number} Value rounded to standard precision.
 */
const toWidthPrecision = value => Number.isFinite(value) ? parseFloat(value.toFixed(0)) : undefined;

/**
 * Returns the considered adjacent to that of the specified `clientId` for
 * resizing consideration. Adjacent blocks are those occurring after, except
 * when the given block is the last block in the set. For the last block, the
 * behavior is reversed.
 *
 * @param {WPBlock[]} blocks   Block objects.
 * @param {string}    clientId Client ID to consider for adjacent blocks.
 *
 * @return {WPBlock[]} Adjacent block objects.
 */
function getAdjacentBlocks(blocks, clientId) {
  const index = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.findIndex)(blocks, {
    clientId
  });
  const isLastBlock = index === blocks.length - 1;
  return isLastBlock ? blocks.slice(0, index) : blocks.slice(index + 1);
}

/**
 * Returns an effective width for a given block. An effective width is equal to
 * its attribute value if set, or a computed value assuming equal distribution.
 *
 * @param {WPBlock} block           Block object.
 * @param {number}  totalBlockCount Total number of blocks in Columns.
 *
 * @return {number} Effective column width.
 */
function getEffectiveColumnWidth(block, totalBlockCount) {
  const {
    width = 12 / totalBlockCount
  } = block.attributes;
  return toWidthPrecision(width);
}

/**
 * Returns the total width occupied by the given set of column blocks.
 *
 * @param {WPBlock[]} blocks          Block objects.
 * @param {?number}   totalBlockCount Total number of blocks in Columns.
 *                                    Defaults to number of blocks passed.
 *
 * @return {number} Total width occupied by blocks.
 */
function getTotalColumnsWidth(blocks, totalBlockCount = blocks.length) {
  return (0,lodash__WEBPACK_IMPORTED_MODULE_1__.sumBy)(blocks, block => getEffectiveColumnWidth(block, totalBlockCount));
}

/**
 * Returns an object of `clientId` → `width` of effective column widths.
 *
 * @param {WPBlock[]} blocks          Block objects.
 * @param {?number}   totalBlockCount Total number of blocks in Columns.
 *                                    Defaults to number of blocks passed.
 *
 * @return {Object<string,number>} Column widths.
 */
function getColumnWidths(blocks, totalBlockCount = blocks.length) {
  return blocks.reduce((result, block) => {
    const width = getEffectiveColumnWidth(block, totalBlockCount);
    return Object.assign(result, {
      [block.clientId]: width
    });
  }, {});
}

/**
 * Returns an object of `clientId` → `width` of column widths as redistributed
 * proportional to their current widths, constrained or expanded to fit within
 * the given available width.
 *
 * @param {WPBlock[]} blocks          Block objects.
 * @param {number}    availableWidth  Maximum width to fit within.
 * @param {?number}   totalBlockCount Total number of blocks in Columns.
 *                                    Defaults to number of blocks passed.
 *
 * @return {Object<string,number>} Redistributed column widths.
 */
function getRedistributedColumnWidths(blocks, availableWidth, totalBlockCount = blocks.length) {
  const totalWidth = getTotalColumnsWidth(blocks, totalBlockCount);
  const difference = availableWidth - totalWidth;
  const adjustment = difference / blocks.length;
  return (0,lodash__WEBPACK_IMPORTED_MODULE_1__.mapValues)(getColumnWidths(blocks, totalBlockCount), width => toWidthPrecision(width + adjustment));
}

/**
 * Returns true if column blocks within the provided set are assigned with
 * explicit widths, or false otherwise.
 *
 * @param {WPBlock[]} blocks Block objects.
 *
 * @return {boolean} Whether columns have explicit widths.
 */
function hasExplicitColumnWidths(blocks) {
  return blocks.some(block => Number.isFinite(block.attributes.width));
}

/**
 * Returns a copy of the given set of blocks with new widths assigned from the
 * provided object of redistributed column widths.
 *
 * @param {WPBlock[]}             blocks Block objects.
 * @param {Object<string,number>} widths Redistributed column widths.
 *
 * @return {WPBlock[]} blocks Mapped block objects.
 */
function getMappedColumnWidths(blocks, widths) {
  return blocks.map(block => (0,lodash__WEBPACK_IMPORTED_MODULE_1__.merge)({}, block, {
    attributes: {
      width: widths[block.clientId]
    }
  }));
}

/***/ },

/***/ "./src/variations.js"
/*!***************************!*\
  !*** ./src/variations.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);

/**
 * WordPress dependencies
 */



/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */

const variations = [
/* ============================
 * 1 COLUMN – 100%
 * ============================ */
{
  name: 'one-column',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('100'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('One column'),
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 114 60",
    width: "48",
    height: "48"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    x: "0",
    y: "0",
    width: "114",
    height: "60"
  })),
  innerBlocks: [['madeit/block-content-column', {
    width: 12
  }]]
},
/* ============================
 * 2 COLUMNS – 50 / 50
 * ============================ */
{
  name: 'two-columns-equal',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('50 / 50'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Two equal columns'),
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 114 60",
    width: "48",
    height: "48"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "m56 0H0v60h56V0Zm58 0H58v60h56V0Z"
  })),
  innerBlocks: [['madeit/block-content-column', {
    width: 6
  }], ['madeit/block-content-column', {
    width: 6
  }]]
},
/* ============================
 * 2 COLUMNS – 33 / 66
 * ============================ */
{
  name: 'two-columns-33-66',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('33 / 66'),
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 114 60",
    width: "48",
    height: "48"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "m37 0H0v60h37V0Zm77 0H39v60h75V0Z"
  })),
  innerBlocks: [['madeit/block-content-column', {
    width: 4
  }], ['madeit/block-content-column', {
    width: 8
  }]]
},
/* ============================
 * 2 COLUMNS – 66 / 33
 * ============================ */
{
  name: 'two-columns-66-33',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('66 / 33'),
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 114 60",
    width: "48",
    height: "48"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "m75 0H0v60h75V0Zm39 0H77v60h37V0Z"
  })),
  innerBlocks: [['madeit/block-content-column', {
    width: 8
  }], ['madeit/block-content-column', {
    width: 4
  }]]
},
/* ============================
 * 3 COLUMNS – EQUAL
 * ============================ */
{
  name: 'three-columns',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('33 / 33 / 33'),
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 114 60",
    width: "48",
    height: "48"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M0 0h37v60H0zM39 0h36v60H39zM77 0h37v60H77z"
  })),
  innerBlocks: [['madeit/block-content-column', {
    width: 4
  }], ['madeit/block-content-column', {
    width: 4
  }], ['madeit/block-content-column', {
    width: 4
  }]]
},
/* ============================
 * 3 COLUMNS – 25 / 50 / 25
 * ============================ */
{
  name: 'three-columns-center',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('25 / 50 / 25'),
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 114 60",
    width: "48",
    height: "48"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M0 0h27v60H0zM29 0h56v60H29zM87 0h27v60H87z"
  })),
  innerBlocks: [['madeit/block-content-column', {
    width: 3
  }], ['madeit/block-content-column', {
    width: 6
  }], ['madeit/block-content-column', {
    width: 3
  }]]
},
/* ============================
 * 4 COLUMNS – EQUAL
 * ============================ */
{
  name: 'four-columns',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('25 / 25 / 25 / 25'),
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 114 60",
    width: "48",
    height: "48"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M0 0h27v60H0zM29 0h27v60H29zM58 0h27v60H58zM87 0h27v60H87z"
  })),
  innerBlocks: [['madeit/block-content-column', {
    width: 3
  }], ['madeit/block-content-column', {
    width: 3
  }], ['madeit/block-content-column', {
    width: 3
  }], ['madeit/block-content-column', {
    width: 3
  }]]
},
/* ============================
 * 2 + 2 GRID (STACKED)
 * ============================ */
{
  name: 'two-by-two',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('2 x 2 grid'),
  icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    viewBox: "0 0 114 60",
    width: "48",
    height: "48"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M0 0h56v29H0zM58 0h56v29H58zM0 31h56v29H0zM58 31h56v29H58z"
  })),
  innerBlocks: [['madeit/block-content-column', {
    width: 6
  }], ['madeit/block-content-column', {
    width: 6
  }], ['madeit/block-content-column', {
    width: 6
  }], ['madeit/block-content-column', {
    width: 6
  }]]
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (variations);

/***/ },

/***/ "./src/editor.scss"
/*!*************************!*\
  !*** ./src/editor.scss ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/style.scss"
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

"use strict";
module.exports = window["React"];

/***/ },

/***/ "lodash"
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
(module) {

"use strict";
module.exports = window["lodash"];

/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

"use strict";
module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/compose"
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
(module) {

"use strict";
module.exports = window["wp"]["compose"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

"use strict";
module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

"use strict";
module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ },

/***/ "./node_modules/classnames/index.js"
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else // removed by dead control flow
{}
}());


/***/ },

/***/ "./node_modules/memize/dist/index.js"
/*!*******************************************!*\
  !*** ./node_modules/memize/dist/index.js ***!
  \*******************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ memize)
/* harmony export */ });
/**
 * Memize options object.
 *
 * @typedef MemizeOptions
 *
 * @property {number} [maxSize] Maximum size of the cache.
 */

/**
 * Internal cache entry.
 *
 * @typedef MemizeCacheNode
 *
 * @property {?MemizeCacheNode|undefined} [prev] Previous node.
 * @property {?MemizeCacheNode|undefined} [next] Next node.
 * @property {Array<*>}                   args   Function arguments for cache
 *                                               entry.
 * @property {*}                          val    Function result.
 */

/**
 * Properties of the enhanced function for controlling cache.
 *
 * @typedef MemizeMemoizedFunction
 *
 * @property {()=>void} clear Clear the cache.
 */

/**
 * Accepts a function to be memoized, and returns a new memoized function, with
 * optional options.
 *
 * @template {(...args: any[]) => any} F
 *
 * @param {F}             fn        Function to memoize.
 * @param {MemizeOptions} [options] Options object.
 *
 * @return {((...args: Parameters<F>) => ReturnType<F>) & MemizeMemoizedFunction} Memoized function.
 */
function memize(fn, options) {
	var size = 0;

	/** @type {?MemizeCacheNode|undefined} */
	var head;

	/** @type {?MemizeCacheNode|undefined} */
	var tail;

	options = options || {};

	function memoized(/* ...args */) {
		var node = head,
			len = arguments.length,
			args,
			i;

		searchCache: while (node) {
			// Perform a shallow equality test to confirm that whether the node
			// under test is a candidate for the arguments passed. Two arrays
			// are shallowly equal if their length matches and each entry is
			// strictly equal between the two sets. Avoid abstracting to a
			// function which could incur an arguments leaking deoptimization.

			// Check whether node arguments match arguments length
			if (node.args.length !== arguments.length) {
				node = node.next;
				continue;
			}

			// Check whether node arguments match arguments values
			for (i = 0; i < len; i++) {
				if (node.args[i] !== arguments[i]) {
					node = node.next;
					continue searchCache;
				}
			}

			// At this point we can assume we've found a match

			// Surface matched node to head if not already
			if (node !== head) {
				// As tail, shift to previous. Must only shift if not also
				// head, since if both head and tail, there is no previous.
				if (node === tail) {
					tail = node.prev;
				}

				// Adjust siblings to point to each other. If node was tail,
				// this also handles new tail's empty `next` assignment.
				/** @type {MemizeCacheNode} */ (node.prev).next = node.next;
				if (node.next) {
					node.next.prev = node.prev;
				}

				node.next = head;
				node.prev = null;
				/** @type {MemizeCacheNode} */ (head).prev = node;
				head = node;
			}

			// Return immediately
			return node.val;
		}

		// No cached value found. Continue to insertion phase:

		// Create a copy of arguments (avoid leaking deoptimization)
		args = new Array(len);
		for (i = 0; i < len; i++) {
			args[i] = arguments[i];
		}

		node = {
			args: args,

			// Generate the result from original function
			val: fn.apply(null, args),
		};

		// Don't need to check whether node is already head, since it would
		// have been returned above already if it was

		// Shift existing head down list
		if (head) {
			head.prev = node;
			node.next = head;
		} else {
			// If no head, follows that there's no tail (at initial or reset)
			tail = node;
		}

		// Trim tail if we're reached max size and are pending cache insertion
		if (size === /** @type {MemizeOptions} */ (options).maxSize) {
			tail = /** @type {MemizeCacheNode} */ (tail).prev;
			/** @type {MemizeCacheNode} */ (tail).next = null;
		} else {
			size++;
		}

		head = node;

		return node.val;
	}

	memoized.clear = function () {
		head = null;
		tail = null;
		size = 0;
	};

	// Ignore reason: There's not a clear solution to create an intersection of
	// the function with additional properties, where the goal is to retain the
	// function signature of the incoming argument and add control properties
	// on the return value.

	// @ts-ignore
	return memoized;
}




/***/ },

/***/ "./block.json"
/*!********************!*\
  !*** ./block.json ***!
  \********************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"madeit/block-content","version":"2.0.0","title":"Made I.T. Container","category":"madeit","icon":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" xmlns:serif=\\"http://www.serif.com/\\" width=\\"30\\" height=\\"30\\" viewBox=\\"0 0 135 135\\" version=\\"1.1\\" xml:space=\\"preserve\\" style=\\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\\"><g transform=\\"matrix(1,0,0,1,-282.404386,-214.957044)\\"><g id=\\"SVGRepo_iconCarrier\\" transform=\\"matrix(7.458333,0,0,7.458333,260.029386,192.582044)\\"><path id=\\"形状\\" d=\\"M3,5C3,3.895 3.895,3 5,3L19,3C20.105,3 21,3.895 21,5L21,19C21,20.105 20.105,21 19,21L5,21C3.895,21 3,20.105 3,19L3,5ZM14,5L10,5L10,19L14,19L14,5ZM16,5L19,5L19,19L16,19L16,5ZM8,19L8,5L5,5L5,19L8,19Z\\" style=\\"fill:rgb(71,106,138);\\"/></g></g></svg>","description":"A container block with multiple options for styling and layout.","keywords":["content","columns","madeit"],"supports":{"html":false},"textdomain":"content-container","editorScript":"file:./build/index.js","editorStyle":"file:./build/index.css","style":"file:./build/style-index.css","attributes":{"wrapperClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content","attribute":"class"},"wrapperStyle":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content","attribute":"style"},"directRowClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content > .row","attribute":"class"},"boxedInnerContainerClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content > .row > .col > .container","attribute":"class"},"boxedInnerRowClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content > .row > .col > .container > .row","attribute":"class"},"verticalAlignment":{"type":"string"},"backgroundType":{"type":"string"},"containerBackgroundColor":{"type":"string"},"customContainerBackgroundColor":{"type":"string"},"containerBackgroundImage":{"type":"object"},"containerBackgroundPosition":{"type":"string"},"containerBackgroundRepeat":{"type":"string"},"containerBackgroundSize":{"type":"string"},"containerBackgroundGradient":{"type":"object"},"size":{"type":"string","default":"container"},"contentWidth":{"type":"string"},"containerMargin":{"type":"object"},"containerMarginTablet":{"type":"object"},"containerMarginMobile":{"type":"object"},"containerPadding":{"type":"object"},"containerPaddingTablet":{"type":"object"},"containerPaddingMobile":{"type":"object"},"containerPaddingOnRow":{"type":"boolean"},"rowBackgroundColor":{"type":"string"},"customRowBackgroundColor":{"type":"string"},"rowTextColor":{"type":"string"},"customRowTextColor":{"type":"string"},"rowMargin":{"type":"object"},"rowPadding":{"type":"object"},"overflow":{"type":"string"},"htmlTag":{"type":"string","default":"div"},"flexDirection":{"type":"string"},"flexDirectionTablet":{"type":"string"},"flexDirectionMobile":{"type":"string"},"alignItems":{"type":"string"},"alignItemsTablet":{"type":"string"},"alignItemsMobile":{"type":"string"},"justifyContent":{"type":"string"},"justifyContentTablet":{"type":"string"},"justifyContentMobile":{"type":"string"},"minHeight":{"type":"number"},"minHeightUnit":{"type":"string","default":"px"},"minHeightTablet":{"type":"number"},"minHeightUnitTablet":{"type":"string","default":"px"},"minHeightMobile":{"type":"number"},"minHeightUnitMobile":{"type":"string","default":"px"},"maxWidth":{"type":"number"},"maxWidthUnit":{"type":"string","default":"px"},"maxWidthTablet":{"type":"number"},"maxWidthUnitTablet":{"type":"string","default":"px"},"maxWidthMobile":{"type":"number"},"maxWidthUnitMobile":{"type":"string","default":"px"},"rowGap":{"type":"number"},"rowGapUnit":{"type":"string","default":"px"},"rowGapTablet":{"type":"number"},"rowGapUnitTablet":{"type":"string","default":"px"},"rowGapMobile":{"type":"number"},"rowGapUnitMobile":{"type":"string","default":"px"},"columnsCount":{"type":"number"},"flexWrap":{"type":"string"},"flexWrapTablet":{"type":"string"},"flexWrapMobile":{"type":"string"},"hideOnDesktop":{"type":"boolean"},"hideOnTablet":{"type":"boolean"},"hideOnMobile":{"type":"boolean"},"madeitHasUserEdits":{"type":"boolean","default":false}}}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkcontent_container"] = globalThis["webpackChunkcontent_container"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map
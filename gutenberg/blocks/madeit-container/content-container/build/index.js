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
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _breakpoint_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./breakpoint-context */ "../../../shared/breakpoint-context.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);

// import { createElement } from '@wordpress/element';
// import { Button, ButtonGroup } from '@wordpress/components';

// export default function BreakpointSwitcher(props) {
//     var active = props && props.active ? props.active : 'desktop';
//     var onChange = props && props.onChange ? props.onChange : null;

//     return createElement(
//         ButtonGroup,
//         { className: 'madeit-control-breakpoints' },
//         createElement(Button, {
//             icon: 'desktop',
//             isPressed: active === 'desktop',
//             onClick: function () {
//                 if (onChange) onChange('desktop');
//             },
//         }),
//         createElement(Button, {
//             icon: 'tablet',
//             isPressed: active === 'tablet',
//             onClick: function () {
//                 if (onChange) onChange('tablet');
//             },
//         }),
//         createElement(Button, {
//             icon: 'smartphone',
//             isPressed: active === 'mobile',
//             onClick: function () {
//                 if (onChange) onChange('mobile');
//             },
//         })
//     );
// }



function BreakpointSwitcher() {
  const {
    breakpoint,
    setBreakpoint
  } = (0,_breakpoint_context__WEBPACK_IMPORTED_MODULE_1__.useBreakpoint)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, {
    className: "madeit-control-breakpoints"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    icon: "desktop",
    isPressed: breakpoint === 'desktop',
    onClick: () => setBreakpoint('desktop')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    icon: "tablet",
    isPressed: breakpoint === 'tablet',
    onClick: () => setBreakpoint('tablet')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    icon: "smartphone",
    isPressed: breakpoint === 'mobile',
    onClick: () => setBreakpoint('mobile')
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

/***/ "../../../shared/breakpoint-context.js"
/*!*********************************************!*\
  !*** ../../../shared/breakpoint-context.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BreakpointContext: () => (/* binding */ BreakpointContext),
/* harmony export */   BreakpointProvider: () => (/* binding */ BreakpointProvider),
/* harmony export */   getBreakpointKey: () => (/* binding */ getBreakpointKey),
/* harmony export */   useBreakpoint: () => (/* binding */ useBreakpoint)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);


const BreakpointContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createContext)({
  breakpoint: 'desktop',
  setBreakpoint: () => {}
});
function BreakpointProvider({
  children
}) {
  const [breakpoint, setBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('desktop');
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(BreakpointContext.Provider, {
    value: {
      breakpoint,
      setBreakpoint
    }
  }, children);
}
function useBreakpoint() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useContext)(BreakpointContext);
}

// Helper: geeft de juiste attribute key terug op basis van breakpoint
function getBreakpointKey(baseKey, breakpoint) {
  if (breakpoint === 'tablet') return `${baseKey}Tablet`;
  if (breakpoint === 'mobile') return `${baseKey}Mobile`;
  return baseKey;
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
/* harmony export */   BreakpointProvider: () => (/* reexport safe */ _breakpoint_context__WEBPACK_IMPORTED_MODULE_1__.BreakpointProvider),
/* harmony export */   BreakpointSwitcher: () => (/* reexport safe */ _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   ControlHeader: () => (/* reexport safe */ _ControlHeader__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   ResponsiveBoxControl: () => (/* reexport safe */ _ResponsiveBoxControl__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   ResponsiveVisibilityPanel: () => (/* reexport safe */ _ResponsiveVisibilityPanel__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   getBreakpointKey: () => (/* reexport safe */ _breakpoint_context__WEBPACK_IMPORTED_MODULE_1__.getBreakpointKey),
/* harmony export */   useBreakpoint: () => (/* reexport safe */ _breakpoint_context__WEBPACK_IMPORTED_MODULE_1__.useBreakpoint)
/* harmony export */ });
/* harmony import */ var _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BreakpointSwitcher */ "../../../shared/BreakpointSwitcher.js");
/* harmony import */ var _breakpoint_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./breakpoint-context */ "../../../shared/breakpoint-context.js");
/* harmony import */ var _ControlHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ControlHeader */ "../../../shared/ControlHeader.js");
/* harmony import */ var _ResponsiveBoxControl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ResponsiveBoxControl */ "../../../shared/ResponsiveBoxControl.js");
/* harmony import */ var _ResponsiveVisibilityPanel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ResponsiveVisibilityPanel */ "../../../shared/ResponsiveVisibilityPanel.js");






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

// ─── 1. Inner component: heeft toegang tot BreakpointContext ─────────────────

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
    // ─── General attributes ─────────────────
    verticalAlignment,
    size,
    // ─── Container attributes ─────────────────
    contentWidth,
    containerMargin,
    containerMarginTablet,
    containerMarginMobile,
    containerPadding,
    containerPaddingTablet,
    containerPaddingMobile,
    containerPaddingOnRow,
    // ─── Row attributes (only for "container-content-boxed" size) ─────────────────
    rowMargin,
    rowPadding,
    // ─── Background attributes ─────────────────
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    containerBackgroundGradient,
    // ─── Other attributes ─────────────────
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

  // ── Huidige breakpunt voor elke aanpasbare CSS-eigenschap ──────────────
  const [activeMaxWidthBreakpoint, setActiveMaxWidthBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const [activeMinHeightBreakpoint, setActiveMinHeightBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const [activeRowGapBreakpoint, setActiveRowGapBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const [activePaddingBreakpoint, setActivePaddingBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const [activeMarginBreakpoint, setActiveMarginBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const [activeDirectionBreakpoint, setActiveDirectionBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');

  // ── Afgeleide keys — allemaal gestuurd door activeBreakpoint ───────────
  const directionValueKey = activeDirectionBreakpoint === 'tablet' ? 'flexDirectionTablet' : activeDirectionBreakpoint === 'mobile' ? 'flexDirectionMobile' : 'flexDirection';
  const maxWidthValueKey = activeMaxWidthBreakpoint === 'tablet' ? 'maxWidthTablet' : activeMaxWidthBreakpoint === 'mobile' ? 'maxWidthMobile' : 'maxWidth';
  const maxWidthUnitKey = activeMaxWidthBreakpoint === 'tablet' ? 'maxWidthUnitTablet' : activeMaxWidthBreakpoint === 'mobile' ? 'maxWidthUnitMobile' : 'maxWidthUnit';
  const minHeightValueKey = activeMinHeightBreakpoint === 'tablet' ? 'minHeightTablet' : activeMinHeightBreakpoint === 'mobile' ? 'minHeightMobile' : 'minHeight';
  const minHeightUnitKey = activeMinHeightBreakpoint === 'tablet' ? 'minHeightUnitTablet' : activeMinHeightBreakpoint === 'mobile' ? 'minHeightUnitMobile' : 'minHeightUnit';

  // ── Huidige waarden ────────────────────────────────────────────────────
  const currentDirection = attributes?.[directionValueKey] || 'row';
  const currentMaxWidthValue = attributes?.[maxWidthValueKey];
  const currentMaxWidthUnit = attributes?.[maxWidthUnitKey] || 'px';
  const currentMinHeightValue = attributes?.[minHeightValueKey];
  const currentMinHeightUnit = attributes?.[minHeightUnitKey] || 'px';

  // ── Reset helpers ──────────────────────────────────────────────────────
  const resetDirection = () => setAttributes({
    [directionValueKey]: activeDirectionBreakpoint === 'desktop' ? 'row' : undefined
  });
  const resetMaxWidth = () => setAttributes({
    [maxWidthValueKey]: undefined,
    [maxWidthUnitKey]: 'px',
    madeitHasUserEdits: true
  });

  // ── Container / size helpers ───────────────────────────────────────────
  const containerSizes = [{
    value: 'container',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Boxed')
  }, {
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

  // ── CSS klassen ────────────────────────────────────────────────────────
  var classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, {
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
    [`container`]: 'container' === size,
    [`container-fluid`]: 'container-fluid' === size || 'container-content-boxed' === size
  });

  // classes = classnames( classes, {
  // } );

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

  // Initialize `contentWidth` once so it doesn't keep following `size`.
  // This keeps existing blocks stable, while making the controls truly independent.

  // Als we in "container" zitten, is contentWidth altijd "container". Anders is het "container-fluid" tenzij het al een andere waarde had (omdat de gebruiker die heeft aangepast).
  const computedContentWidth = size === 'container' ? 'container' : contentWidth === 'container-fluid' ? 'container-fluid' : 'container-fluid';
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

  // background-image always on the outher container, never on the inner row, because that's more intuitive for users and works better with the way the block is structured (the inner row can be toggled between "container" and "container-fluid" widths, which would be weird if it also had the background image). The "container-content-boxed" size is a special case where we want the background color on the inner row but the background image on the outer container, so we also apply the background image styles to the inner row in that case.
  const applyContainerBackgroundToChild = size === 'container-fluid' || size === 'container-content-boxed';
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

    // BoxControl typically returns strings like "12px", but some older
    // blocks/controls can still pass numbers.
    if (typeof value === 'number' && Number.isFinite(value)) {
      targetStyle[key] = `${value}px`;
      return;
    }
    if (typeof value !== 'string') return;
    const trimmed = value.trim();
    if (trimmed === '') return;
    targetStyle[key] = trimmed;
  };
  const setSpacingVars = (targetStyle, prefix, spacing, breakpoint) => {
    if (!spacing || typeof spacing !== 'object') return;
    const rawTop = spacing.top;
    const rawRight = spacing.right;
    const rawBottom = spacing.bottom;
    const rawLeft = spacing.left;
    const hasAnyValue = rawTop !== undefined && rawTop !== null && String(rawTop).trim() !== '' || rawRight !== undefined && rawRight !== null && String(rawRight).trim() !== '' || rawBottom !== undefined && rawBottom !== null && String(rawBottom).trim() !== '' || rawLeft !== undefined && rawLeft !== null && String(rawLeft).trim() !== '';
    if (!hasAnyValue) return;

    // Important: the build pipeline can merge longhand padding declarations
    // into a single `padding: ...` shorthand. If any of the 4 values is an
    // invalid var() (missing), the whole shorthand becomes invalid.
    // To keep responsive padding working, always emit all 4 sides when
    // spacing is used (missing sides default to 0).
    setCssVarIfDefined(targetStyle, `--${prefix}-top-${breakpoint}`, rawTop === undefined || rawTop === null || String(rawTop).trim() === '' ? '0px' : rawTop);
    setCssVarIfDefined(targetStyle, `--${prefix}-right-${breakpoint}`, rawRight === undefined || rawRight === null || String(rawRight).trim() === '' ? '0px' : rawRight);
    setCssVarIfDefined(targetStyle, `--${prefix}-bottom-${breakpoint}`, rawBottom === undefined || rawBottom === null || String(rawBottom).trim() === '' ? '0px' : rawBottom);
    setCssVarIfDefined(targetStyle, `--${prefix}-left-${breakpoint}`, rawLeft === undefined || rawLeft === null || String(rawLeft).trim() === '' ? '0px' : rawLeft);
  };

  // Desktop margin stays inline; we also set matching desktop CSS variables
  // so tablet/mobile fallbacks can safely reference them.
  if (containerMargin && typeof containerMargin === 'object') {
    if (containerMargin.top !== undefined) {
      style.marginTop = containerMargin.top;
      setCssVarIfDefined(style, '--madeit-container-margin-top-desktop', containerMargin.top);
    }
    if (containerMargin.bottom !== undefined) {
      style.marginBottom = containerMargin.bottom;
      setCssVarIfDefined(style, '--madeit-container-margin-bottom-desktop', containerMargin.bottom);
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

  // Desktop padding stays inline; we also set matching desktop CSS variables
  // so tablet/mobile fallbacks can safely reference them.
  var rowStyle = {};
  if (shouldApplyContainerPaddingOnRow) {
    if (containerPadding && typeof containerPadding === 'object') {
      if (containerPadding.top !== undefined) rowStyle.paddingTop = containerPadding.top;
      if (containerPadding.right !== undefined) rowStyle.paddingRight = containerPadding.right;
      if (containerPadding.bottom !== undefined) rowStyle.paddingBottom = containerPadding.bottom;
      if (containerPadding.left !== undefined) rowStyle.paddingLeft = containerPadding.left;
    }
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPadding, 'desktop');
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile');
  } else {
    if (containerPadding && typeof containerPadding === 'object') {
      if (containerPadding.top !== undefined) style.paddingTop = containerPadding.top;
      if (containerPadding.right !== undefined) style.paddingRight = containerPadding.right;
      if (containerPadding.bottom !== undefined) style.paddingBottom = containerPadding.bottom;
      if (containerPadding.left !== undefined) style.paddingLeft = containerPadding.left;
    }
    setSpacingVars(style, 'madeit-container-padding', containerPadding, 'desktop');
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
      size: value,
      madeitHasUserEdits: true
    })
  }, label))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
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
/**
 * index.js — madeit/block-content
 *
 * Registreert het block type en definieert:
 * - Variaties (layout presets)
 * - Edit & save functies
 * - Deprecated versies (voor backward compatibility met bestaande content)
 *
 * DEPRECATED VOLGORDE
 * ───────────────────
 * Gutenberg doorloopt de deprecated array van boven naar onder.
 * De meest recente deprecated versie staat bovenaan (saveV0),
 * de oudste versie staat onderaan (saveV13).
 *
 * ⚠️  BELANGRIJK: Verwijder nooit een deprecated versie tenzij je 100% zeker
 * bent dat er geen live content meer bestaat die met die versie werd opgeslagen.
 */









// ─── Hulpfuncties voor migrate() ──────────────────────────────────────────────

/**
 * Normaliseert een CSS-lengtewaarde naar een string met eenheid.
 */
const normalizeCssLength = (value, defaultUnit = 'px') => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}${defaultUnit || 'px'}`;
  }
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return `${trimmed}${defaultUnit || 'px'}`;
  if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(trimmed)) return trimmed;
  return undefined;
};

/**
 * Normaliseert een spacing-object { top, right, bottom, left }.
 */
const normalizeSpacingObject = spacing => {
  var _normalizeCssLength, _normalizeCssLength2, _normalizeCssLength3, _normalizeCssLength4;
  if (!spacing || typeof spacing !== 'object') return undefined;
  const {
    top,
    right,
    bottom,
    left
  } = spacing;
  const hasAnyValue = [top, right, bottom, left].some(v => v !== undefined && v !== null && String(v).trim() !== '');
  if (!hasAnyValue) return undefined;
  return {
    top: (_normalizeCssLength = normalizeCssLength(top)) !== null && _normalizeCssLength !== void 0 ? _normalizeCssLength : '0px',
    right: (_normalizeCssLength2 = normalizeCssLength(right)) !== null && _normalizeCssLength2 !== void 0 ? _normalizeCssLength2 : '0px',
    bottom: (_normalizeCssLength3 = normalizeCssLength(bottom)) !== null && _normalizeCssLength3 !== void 0 ? _normalizeCssLength3 : '0px',
    left: (_normalizeCssLength4 = normalizeCssLength(left)) !== null && _normalizeCssLength4 !== void 0 ? _normalizeCssLength4 : '0px'
  };
};

/**
 * Normaliseert alle spacing-attributen van een block (margin + padding).
 */
const normalizeSpacingAttributes = attributes => {
  const next = {
    ...(attributes || {})
  };
  next.containerMargin = normalizeSpacingObject(next.containerMargin);
  next.containerMarginTablet = normalizeSpacingObject(next.containerMarginTablet);
  next.containerMarginMobile = normalizeSpacingObject(next.containerMarginMobile);
  next.containerPadding = normalizeSpacingObject(next.containerPadding);
  next.containerPaddingTablet = normalizeSpacingObject(next.containerPaddingTablet);
  next.containerPaddingMobile = normalizeSpacingObject(next.containerPaddingMobile);
  next.rowMargin = normalizeSpacingObject(next.rowMargin);
  next.rowPadding = normalizeSpacingObject(next.rowPadding);
  return next;
};

// ─── Block registratie ────────────────────────────────────────────────────────

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
  icon: _icon__WEBPACK_IMPORTED_MODULE_5__["default"],
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
    if (size === 'container-fluid' || size === 'container-content-boxed') {
      return {
        'data-align': 'full'
      };
    }
    return {
      'data-align': 'container'
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"],
  deprecated: [
  // ── V0: Inner container div toegevoegd + CSS-vars voor margin/padding (2026-05-08) ──
  // Vóór deze wijziging had de HtmlTag geen inner <div class="container|container-fluid">
  // en werden margin/padding als directe inline stijlen geserialiseerd
  // (marginTop, marginBottom) in plaats van CSS-variabelen.
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV0,
    migrate(attributes) {
      return {
        ...normalizeSpacingAttributes(attributes),
        madeitHasUserEdits: true
      };
    }
  },
  // ── V1: Size default veranderd van 'container' naar 'container-content-boxed' (2026-04-17) ──
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV1,
    migrate(attributes) {
      const wrapperClassName = typeof attributes?.wrapperClassName === 'string' ? attributes.wrapperClassName : '';
      const wrapperTokens = wrapperClassName.trim().length ? wrapperClassName.trim().split(/\s+/) : [];
      const wrapperHasContainer = wrapperTokens.includes('container');
      const wrapperHasContainerFluid = wrapperTokens.includes('container-fluid');
      const isLegacyDefaultContainer = wrapperHasContainer && !wrapperHasContainerFluid;
      const correctedSize = typeof attributes?.size === 'string' && attributes.size.length > 0 && attributes.size !== 'container-content-boxed' ? attributes.size : isLegacyDefaultContainer ? 'container' : attributes.size;
      return {
        ...attributes,
        size: correctedSize,
        madeitHasUserEdits: true
      };
    }
  },
  // ── V2: Responsive spacing volledig als CSS vars (2026-04-08) ──────────
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV2,
    migrate(attributes) {
      return {
        ...normalizeSpacingAttributes(attributes),
        madeitHasUserEdits: true
      };
    }
  },
  // ── V3: Spacing als directe inline stijlen (2026-04-08) ───────────────
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV3,
    migrate(attributes) {
      return {
        ...normalizeSpacingAttributes(attributes),
        madeitHasUserEdits: true
      };
    }
  },
  // ── V4: Zonder default CSS vars (2026-03-26) ──────────────────────────
  {
    isEligible(attributes) {
      return typeof attributes?.rowGap === 'number' || typeof attributes?.rowGapTablet === 'number' || typeof attributes?.rowGapMobile === 'number' || typeof attributes?.flexDirection === 'string' || typeof attributes?.flexDirectionTablet === 'string' || typeof attributes?.flexDirectionMobile === 'string' || typeof attributes?.alignItems === 'string' || typeof attributes?.justifyContent === 'string' || typeof attributes?.flexWrap === 'string';
    },
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV4,
    migrate(attributes) {
      return {
        ...attributes,
        madeitHasUserEdits: true
      };
    }
  },
  // ── V5: Wrapper padding zonder whitespace tekst nodes ─────────────────
  {
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV5
  },
  // ── V6: Padding op outer wrapper (2026-03-17) ─────────────────────────
  {
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV6
  },
  // ── V7: Legacy boxed zonder inner container (2026-03-09) ──────────────
  {
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV7
  },
  // ── V8: Zeer oude markup met plain `.row` (geen `madeit-container-row`) ──
  {
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV8
  },
  // ── V14: Legacy direct row met overflow:visible geserialiseerd ─────────
  {
    isEligible(attributes) {
      if (attributes?.size && attributes.size !== 'container-content-boxed') return false;
      const wrapperClassName = typeof attributes?.wrapperClassName === 'string' ? attributes.wrapperClassName : '';
      if (wrapperClassName.trim().length === 0) return true;
      const tokens = wrapperClassName.trim().split(/\s+/);
      return tokens.includes('container') && !tokens.includes('container-fluid') && tokens.includes('madeit-block-content--frontend');
    },
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV14
  },
  // ── V15: Legacy wrapper container met inner container ─────────────────
  {
    isEligible(attributes) {
      if (attributes?.size && attributes.size !== 'container-content-boxed') return false;
      const wrapperClassName = typeof attributes?.wrapperClassName === 'string' ? attributes.wrapperClassName : '';
      const tokens = wrapperClassName.trim().length ? wrapperClassName.trim().split(/\s+/) : [];
      return tokens.includes('container') && !tokens.includes('container-fluid') && tokens.includes('madeit-block-content--frontend');
    },
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV15
  },
  // ── V9: Legacy zonder overflow:visible serialisatie ───────────────────
  {
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV9
  },
  // ── V10: Pre rowGap responsive vars ───────────────────────────────────
  {
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV10
  },
  // ── V11: Altijd background-color: transparent (2026-02) ───────────────
  {
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV11
  },
  // ── V12 ⭐ LIVE OP WEBSITES ────────────────────────────────────────────
  {
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV12
  },
  // ── V13 ⭐ LIVE OP WEBSITES (alleroudste versie) ──────────────────────
  {
    supports: {
      html: false
    },
    attributes: {
      verticalAlignment: {
        type: 'string'
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
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV13,
    migrate(attributes) {
      const toPx = value => value !== null && value !== undefined ? value + 'px' : undefined;
      const wrapperClassName = typeof attributes?.wrapperClassName === 'string' ? attributes.wrapperClassName : '';
      const wrapperTokens = wrapperClassName.trim().split(/\s+/);
      const wrapperHasContainerFluid = wrapperTokens.includes('container-fluid');
      const migratedSize = wrapperHasContainerFluid ? 'container-fluid' : attributes.size || 'container';
      return {
        containerPadding: {
          top: toPx(attributes.containerPaddingTop),
          bottom: toPx(attributes.containerPaddingBottom),
          left: toPx(attributes.containerPaddingLeft),
          right: toPx(attributes.containerPaddingRight)
        },
        containerMargin: {
          top: toPx(attributes.containerMarginTop),
          bottom: toPx(attributes.containerMarginBottom),
          left: toPx(attributes.containerMarginLeft),
          right: toPx(attributes.containerMarginRight)
        },
        rowPadding: {
          top: toPx(attributes.rowPaddingTop),
          bottom: toPx(attributes.rowPaddingBottom),
          left: toPx(attributes.rowPaddingLeft),
          right: toPx(attributes.rowPaddingRight)
        },
        rowMargin: {
          top: toPx(attributes.rowMarginTop),
          bottom: toPx(attributes.rowMarginBottom),
          left: toPx(attributes.rowMarginLeft),
          right: toPx(attributes.rowMarginRight)
        },
        size: migratedSize,
        verticalAlignment: attributes.verticalAlignment,
        containerBackgroundColor: attributes.containerBackgroundColor,
        customContainerBackgroundColor: attributes.customContainerBackgroundColor,
        madeitHasUserEdits: true
      };
    }
  }]
});

/***/ },

/***/ "./src/save-versions/index.js"
/*!************************************!*\
  !*** ./src/save-versions/index.js ***!
  \************************************/
() {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: /home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/src/save-versions/index.js: `saveV0` has already been exported. Exported identifiers must be unique. (69:9)\n\n\u001b[0m \u001b[90m 67 |\u001b[39m \u001b[90m * - Geen flex/layout CSS vars\u001b[39m\n \u001b[90m 68 |\u001b[39m \u001b[90m */\u001b[39m\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 69 |\u001b[39m \u001b[36mexport\u001b[39m { \u001b[36mdefault\u001b[39m \u001b[36mas\u001b[39m saveV0 } \u001b[36mfrom\u001b[39m \u001b[32m'./save_20260508_deprecated'\u001b[39m\u001b[33m;\u001b[39m\n \u001b[90m    |\u001b[39m          \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 70 |\u001b[39m\n \u001b[90m 71 |\u001b[39m \u001b[90m/**\u001b[39m\n \u001b[90m 72 |\u001b[39m \u001b[90m * saveV12 — De versie die op alle huidige live websites staat.\u001b[39m\u001b[0m\n    at constructor (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:365:19)\n    at JSXParserMixin.raise (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:6599:19)\n    at JSXParserMixin.checkDuplicateExports (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:14076:14)\n    at JSXParserMixin.checkExport (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:14018:16)\n    at JSXParserMixin.parseExport (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:13817:12)\n    at JSXParserMixin.parseStatementContent (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:12878:27)\n    at JSXParserMixin.parseStatementLike (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:12767:17)\n    at JSXParserMixin.parseModuleItem (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:12744:17)\n    at JSXParserMixin.parseBlockOrModuleBlockBody (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:13316:36)\n    at JSXParserMixin.parseBlockBody (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:13309:10)\n    at JSXParserMixin.parseProgram (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:12622:10)\n    at JSXParserMixin.parseTopLevel (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:12612:25)\n    at JSXParserMixin.parse (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:14488:25)\n    at parse (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/parser/lib/index.js:14522:38)\n    at parser (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/core/lib/parser/index.js:41:34)\n    at parser.next (<anonymous>)\n    at normalizeFile (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/core/lib/transformation/normalize-file.js:64:37)\n    at normalizeFile.next (<anonymous>)\n    at run (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/core/lib/transformation/index.js:22:50)\n    at run.next (<anonymous>)\n    at transform (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/@babel/core/lib/transform.js:22:33)\n    at transform.next (<anonymous>)\n    at step (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/gensync/index.js:261:32)\n    at /home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/gensync/index.js:273:13\n    at async.call.result.err.err (/home/testmadeitbe/www/wp-content/themes/madeit/gutenberg/blocks/madeit-container/content-container/node_modules/gensync/index.js:223:11)");

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
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);

/**
 * save.js — madeit-block-content
 *
 * STRUCTUUR VAN DE OUTPUT
 * ────────────────────────
 * De HtmlTag is ALTIJD container-fluid (de outer wrapper).
 * De size-instelling (container / container-fluid) bepaalt de INNER div, niet de outer.
 *
 * <HtmlTag class="wp-block-madeit-block-content container-fluid madeit-block-content--frontend {color?}" style="{bg?}">
 *   <div class="{container | container-fluid}">
 *     <div class="row ...">
 *       <InnerBlocks />
 *     </div>
 *   </div>
 * </HtmlTag>
 *
 * MARKUP-VARIANTEN:
 *   A. container-content-boxed  → inner div = container, met extra boxed child
 *   B. Legacy boxed inner row   → row > col > container > row
 *   C. Legacy direct row        → geen inner container div
 *   D. Standaard                → inner div = container of container-fluid op basis van `size`
 */

// ─── 1. Imports ──────────────────────────────────────────────────────────────




// ─── 2. Constanten ───────────────────────────────────────────────────────────

/** CSS-klasse die alleen op de frontend-wrapper staat (niet in de editor). */
const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';

/** HTML-tags die toegestaan zijn als wrapper-element. */
const ALLOWED_HTML_TAGS = ['div', 'section', 'article', 'main', 'header', 'footer'];

// ─── 3. Hulpfuncties ─────────────────────────────────────────────────────────

/**
 * Zet een numerieke of string-waarde om naar een geldige CSS-lengte.
 */
function toCssLength(value, unit = 'px') {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}${unit || 'px'}`;
  }
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return `${trimmed}${unit || 'px'}`;
  if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(trimmed)) return trimmed;
  return undefined;
}

/**
 * Schrijft één CSS-variabele naar een stijl-object.
 */
function setCssVar(targetStyle, key, value) {
  if (value === undefined || value === null) return;
  if (typeof value === 'number' && Number.isFinite(value)) {
    targetStyle[key] = `${value}px`;
    return;
  }
  if (typeof value !== 'string') return;
  const trimmed = value.trim();
  if (trimmed) targetStyle[key] = trimmed;
}

/**
 * Filtert de `className`-prop van de block zodat klassen die door save()
 * zelf worden beheerd niet dubbel verschijnen.
 */
function filterExtraClasses(className) {
  if (typeof className !== 'string' || !className.trim()) return '';
  return className.trim().split(/\s+/).filter(Boolean).filter(token => {
    if (token === 'wp-block-madeit-block-content') return false;
    if (token === 'container' || token === 'container-fluid') return false;
    if (token === FRONTEND_WRAPPER_CLASS) return false;
    if (token === 'has-text-color' || token === 'has-background') return false;
    if (token.startsWith('are-vertically-aligned-')) return false;
    if (token.startsWith('is-hidden-')) return false;
    return true;
  }).join(' ');
}

// ─── 4. Stijl-opbouw helpers ──────────────────────────────────────────────────

/**
 * Voegt responsieve spacing (margin of padding) toe aan een stijl-object via CSS-vars.
 */
function setSpacingVars(targetStyle, prefix, spacing, breakpoint) {
  if (!spacing || typeof spacing !== 'object') return;
  const {
    top,
    right,
    bottom,
    left
  } = spacing;
  const hasAnyValue = [top, right, bottom, left].some(v => v !== undefined && v !== null && String(v).trim() !== '');
  if (!hasAnyValue) return;
  const fallback = v => v === undefined || v === null || String(v).trim() === '' ? '0px' : v;
  setCssVar(targetStyle, `--${prefix}-top-${breakpoint}`, fallback(top));
  setCssVar(targetStyle, `--${prefix}-right-${breakpoint}`, fallback(right));
  setCssVar(targetStyle, `--${prefix}-bottom-${breakpoint}`, fallback(bottom));
  setCssVar(targetStyle, `--${prefix}-left-${breakpoint}`, fallback(left));
}

/**
 * Maakt het stijl-object voor de achtergrond (kleur, afbeelding, gradient).
 */
function buildBackgroundStyle(attributes) {
  const {
    backgroundType,
    containerBackgroundColor,
    customContainerBackgroundColor,
    containerBackgroundImage,
    containerBackgroundPosition,
    containerBackgroundRepeat,
    containerBackgroundSize,
    containerBackgroundGradient
  } = attributes;
  const hasClassicBackground = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const computedBackgroundType = backgroundType || (hasClassicBackground ? 'classic' : undefined);
  const containerBgClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const style = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : containerBgClass ? undefined : customContainerBackgroundColor
  };
  if (computedBackgroundType === 'classic' && containerBackgroundImage?.url) {
    style.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (containerBackgroundPosition) style.backgroundPosition = containerBackgroundPosition;
    if (containerBackgroundRepeat) style.backgroundRepeat = containerBackgroundRepeat;
    if (containerBackgroundSize) style.backgroundSize = containerBackgroundSize;
  }
  const gradientValue = typeof containerBackgroundGradient?.gradient === 'string' && containerBackgroundGradient.gradient.trim().length > 0 ? containerBackgroundGradient.gradient : undefined;
  if (computedBackgroundType === 'gradient' && gradientValue) {
    style.backgroundImage = gradientValue;
  }
  return style;
}

/**
 * Bouwt het volledige stijl-object voor de buitenste wrapper (HtmlTag).
 * De HtmlTag is ALTIJD container-fluid — size heeft hier geen effect op de klasse.
 * Stijlen: achtergrond, overflow, min-height, max-width, row-gap,
 *          flex-direction, align-items, justify-content, flex-wrap,
 *          container margin + padding (als niet op row).
 */
function buildWrapperStyle(attributes, backgroundStyle) {
  const {
    overflow,
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
    containerMargin,
    containerMarginTablet,
    containerMarginMobile,
    containerPadding,
    containerPaddingTablet,
    containerPaddingMobile,
    containerPaddingOnRow
  } = attributes;
  const style = {};

  // Achtergrond altijd op de wrapper.
  Object.assign(style, backgroundStyle);

  // Overflow (standaard 'visible' wordt niet geserialiseerd).
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') {
    style.overflow = overflow;
  }

  // ── Min-height ────────────────────────────────────────────────────────────
  const minHeightDesktop = toCssLength(minHeight, minHeightUnit || 'px');
  const minHeightTabletV = toCssLength(minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px');
  const minHeightMobileV = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px');
  if (minHeightDesktop) setCssVar(style, '--madeit-min-height-desktop', minHeightDesktop);
  if (minHeightTabletV) setCssVar(style, '--madeit-min-height-tablet', minHeightTabletV);
  if (minHeightMobileV) setCssVar(style, '--madeit-min-height-mobile', minHeightMobileV);

  // ── Max-width ─────────────────────────────────────────────────────────────
  if (typeof maxWidth === 'number') setCssVar(style, '--madeit-max-width-desktop', `${maxWidth}${maxWidthUnit || 'px'}`);
  if (typeof maxWidthTablet === 'number') setCssVar(style, '--madeit-max-width-tablet', `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`);
  if (typeof maxWidthMobile === 'number') setCssVar(style, '--madeit-max-width-mobile', `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`);

  // ── Row-gap ───────────────────────────────────────────────────────────────
  if (typeof rowGap === 'number') {
    setCssVar(style, '--madeit-row-gap-desktop', `${rowGap}${rowGapUnit || 'px'}`);
    if (typeof rowGapTablet === 'number') setCssVar(style, '--madeit-row-gap-tablet', `${rowGapTablet}${rowGapUnitTablet || 'px'}`);
    if (typeof rowGapMobile === 'number') setCssVar(style, '--madeit-row-gap-mobile', `${rowGapMobile}${rowGapUnitMobile || 'px'}`);
  }

  // ── Flex-direction ────────────────────────────────────────────────────────
  if (typeof flexDirection === 'string' && flexDirection.length > 0) setCssVar(style, '--madeit-flex-direction-desktop', flexDirection);
  if (typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0) setCssVar(style, '--madeit-flex-direction-tablet', flexDirectionTablet);
  if (typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0) setCssVar(style, '--madeit-flex-direction-mobile', flexDirectionMobile);

  // ── Align-items ───────────────────────────────────────────────────────────
  if (typeof alignItems === 'string' && alignItems.length > 0) setCssVar(style, '--madeit-align-items-desktop', alignItems);
  if (typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0) setCssVar(style, '--madeit-align-items-tablet', alignItemsTablet);
  if (typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0) setCssVar(style, '--madeit-align-items-mobile', alignItemsMobile);

  // ── Justify-content ───────────────────────────────────────────────────────
  if (typeof justifyContent === 'string' && justifyContent.length > 0) setCssVar(style, '--madeit-justify-content-desktop', justifyContent);
  if (typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0) setCssVar(style, '--madeit-justify-content-tablet', justifyContentTablet);
  if (typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0) setCssVar(style, '--madeit-justify-content-mobile', justifyContentMobile);

  // ── Flex-wrap ─────────────────────────────────────────────────────────────
  if (typeof flexWrap === 'string' && flexWrap.length > 0) setCssVar(style, '--madeit-flex-wrap-desktop', flexWrap);
  if (typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0) setCssVar(style, '--madeit-flex-wrap-tablet', flexWrapTablet);
  if (typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0) setCssVar(style, '--madeit-flex-wrap-mobile', flexWrapMobile);

  // ── Container margin ──────────────────────────────────────────────────────
  if (containerMargin && typeof containerMargin === 'object') {
    if (containerMargin.top !== undefined) setCssVar(style, '--madeit-container-margin-top-desktop', containerMargin.top);
    if (containerMargin.bottom !== undefined) setCssVar(style, '--madeit-container-margin-bottom-desktop', containerMargin.bottom);
  }
  if (containerMarginTablet && typeof containerMarginTablet === 'object') {
    setCssVar(style, '--madeit-container-margin-top-tablet', containerMarginTablet.top);
    setCssVar(style, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom);
  }
  if (containerMarginMobile && typeof containerMarginMobile === 'object') {
    setCssVar(style, '--madeit-container-margin-top-mobile', containerMarginMobile.top);
    setCssVar(style, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom);
  }

  // ── Container padding (op wrapper, niet op row) ───────────────────────────
  if (containerPaddingOnRow !== true) {
    setSpacingVars(style, 'madeit-container-padding', containerPadding, 'desktop');
    setSpacingVars(style, 'madeit-container-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(style, 'madeit-container-padding', containerPaddingMobile, 'mobile');
  }
  return style;
}

/**
 * Bouwt het stijl-object voor de `.row`-div.
 */
function buildRowStyle(attributes) {
  const {
    containerPadding,
    containerPaddingTablet,
    containerPaddingMobile,
    containerPaddingOnRow
  } = attributes;
  if (containerPaddingOnRow !== true) return {};
  const rowStyle = {};
  setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPadding, 'desktop');
  setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet');
  setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile');
  return rowStyle;
}

/**
 * Bouwt het stijl-object voor het boxed child-element (alleen container-content-boxed).
 */
function buildChildStyle(attributes, defaultSize) {
  if (defaultSize !== 'container-content-boxed') return {};
  const {
    rowBackgroundColor,
    rowTextColor,
    rowMargin,
    rowPadding
  } = attributes;
  const styleChild = {};
  const rowBgClass = rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', rowBackgroundColor) : undefined;
  const rowTextClass = rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', rowTextColor) : undefined;
  if (!rowBgClass) styleChild.backgroundColor = rowBackgroundColor;
  if (!rowTextClass) styleChild.color = rowTextColor;
  const spacingProps = [[rowMargin, 'margin'], [rowPadding, 'padding']];
  for (const [spacing, prop] of spacingProps) {
    if (spacing && typeof spacing === 'object') {
      if (spacing.top !== undefined) styleChild[`${prop}Top`] = spacing.top;
      if (spacing.right !== undefined) styleChild[`${prop}Right`] = spacing.right;
      if (spacing.bottom !== undefined) styleChild[`${prop}Bottom`] = spacing.bottom;
      if (spacing.left !== undefined) styleChild[`${prop}Left`] = spacing.left;
    }
  }
  return styleChild;
}

// ─── 5. Hoofd save()-functie ──────────────────────────────────────────────────

/**
 * Genereert de opgeslagen HTML voor het madeit-block-content block.
 *
 * STRUCTUUR (altijd):
 *
 *   <HtmlTag class="wp-block-madeit-block-content container-fluid madeit-block-content--frontend ..." style="...">
 *     <div class="{container | container-fluid}">      ← bepaald door `size`
 *       <div class="row ...">
 *         <InnerBlocks />
 *       </div>
 *     </div>
 *   </HtmlTag>
 *
 * Uitzonderingen:
 *   A. container-content-boxed → inner div = container, met extra boxed wrapper
 *   B. Legacy boxed inner row  → row > col > container > row
 *   C. Legacy direct row       → geen inner div
 */
function save(props) {
  const {
    attributes,
    className
  } = props;

  // ── Kleur-classes ──────────────────────────────────────────────────────────
  const containerBgClass = attributes.containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', attributes.containerBackgroundColor) : undefined;
  const rowBgClass = attributes.rowBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', attributes.rowBackgroundColor) : undefined;
  const rowTextClass = attributes.rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', attributes.rowTextColor) : undefined;

  // ── Size bepalen ───────────────────────────────────────────────────────────
  // `size` bepaalt de INNER div, NIET de outer HtmlTag.
  // De outer HtmlTag is altijd container-fluid.
  const rawSize = typeof attributes.size === 'string' ? attributes.size.trim() : '';
  const innerSize = ['container', 'container-fluid', 'container-content-boxed'].includes(rawSize) ? rawSize : 'container'; // fallback

  // De klasse voor de inner div (tweede niveau):
  //   - container-content-boxed → inner div = 'container'
  //   - container               → inner div = 'container'
  //   - container-fluid         → inner div = 'container-fluid'
  const innerDivClass = innerSize === 'container-fluid' ? 'container-fluid' : 'container';

  // ── Stijlen bouwen ─────────────────────────────────────────────────────────
  const backgroundStyle = buildBackgroundStyle(attributes);
  const wrapperStyle = buildWrapperStyle(attributes, backgroundStyle);
  const rowStyle = buildRowStyle(attributes);
  const childStyle = buildChildStyle(attributes, innerSize);

  // ── Klassen bouwen voor de outer HtmlTag ───────────────────────────────────
  const customClassNames = [typeof attributes.className === 'string' && attributes.className.trim() ? attributes.className.trim() : '', typeof className === 'string' && className.trim() ? className.trim() : ''].filter(Boolean).join(' ');
  const extraClass = filterExtraClasses(customClassNames);
  const {
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile,
    verticalAlignment
  } = attributes;

  // De outer wrapper is ALTIJD container-fluid.
  // Tekstkleur erft overal via de wrapper.
  const wrapperClass = classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content', 'container-fluid', FRONTEND_WRAPPER_CLASS, extraClass, {
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile,
    'has-text-color': !!rowTextClass,
    [rowTextClass]: !!rowTextClass,
    'has-background': !!containerBgClass,
    [containerBgClass]: !!containerBgClass
  });

  // ── Block props ────────────────────────────────────────────────────────────
  const hasStyleProps = Object.keys(wrapperStyle).length > 0;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: wrapperClass,
    style: hasStyleProps ? wrapperStyle : undefined
  });

  // Zorg dat onze wrapperClass altijd de basis vormt (geen dubbelen).
  // blockProps.className = classnames( wrapperClass, blockProps.className );

  // ── HTML-tag ───────────────────────────────────────────────────────────────
  const HtmlTag = ALLOWED_HTML_TAGS.includes(attributes.htmlTag) ? attributes.htmlTag : 'div';

  // ── Row props ──────────────────────────────────────────────────────────────
  const {
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    columnsCount
  } = attributes;
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
  const hasRowStyleProps = Object.keys(rowStyle).length > 0;
  const outerRowProps = hasRowStyleProps ? {
    ...baseRowProps,
    style: rowStyle
  } : baseRowProps;

  // ── JSX renderen ───────────────────────────────────────────────────────────

  // VARIANT A: container-content-boxed
  // Inner div = 'container', plus extra boxed child wrapper.
  if (innerSize === 'container-content-boxed') {
    const childBgClass = rowBgClass;
    const childClassNames = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      [`are-vertically-aligned-${verticalAlignment}`]: !!verticalAlignment,
      'has-background': !!childBgClass || !!attributes.rowBackgroundColor,
      [childBgClass]: !!childBgClass,
      'has-text-color': !!rowTextClass,
      [rowTextClass]: !!rowTextClass
    });
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "container"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: childClassNames,
      style: childStyle
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: rowClassName
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n'))))));
  }

  // VARIANT B: legacy boxed inner row (row > col > container > row)
  if (typeof attributes.boxedInnerRowClassName === 'string' && attributes.boxedInnerRowClassName.trim().length > 0) {
    const innerContainerClass = typeof attributes.boxedInnerContainerClassName === 'string' && attributes.boxedInnerContainerClassName.trim().length > 0 ? attributes.boxedInnerContainerClassName.trim() : 'container';
    const innerRowClass = attributes.boxedInnerRowClassName.trim() || rowClassName;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: innerDivClass
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: innerContainerClass
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: innerRowClass
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n'))))));
  }

  // VARIANT C: legacy direct row (geen inner container div)
  if (typeof attributes.directRowClassName === 'string' && attributes.directRowClassName.trim().length > 0) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...outerRowProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n'));
  }

  // VARIANT D: standaard
  // HtmlTag = altijd container-fluid
  // Inner div = container of container-fluid op basis van `size`
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerDivClass
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...outerRowProps
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n')));
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
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"madeit/block-content","version":"2.0.0","title":"Made I.T. Container","category":"madeit","icon":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" xmlns:serif=\\"http://www.serif.com/\\" width=\\"30\\" height=\\"30\\" viewBox=\\"0 0 135 135\\" version=\\"1.1\\" xml:space=\\"preserve\\" style=\\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\\"><g transform=\\"matrix(1,0,0,1,-282.404386,-214.957044)\\"><g id=\\"SVGRepo_iconCarrier\\" transform=\\"matrix(7.458333,0,0,7.458333,260.029386,192.582044)\\"><path id=\\"形状\\" d=\\"M3,5C3,3.895 3.895,3 5,3L19,3C20.105,3 21,3.895 21,5L21,19C21,20.105 20.105,21 19,21L5,21C3.895,21 3,20.105 3,19L3,5ZM14,5L10,5L10,19L14,19L14,5ZM16,5L19,5L19,19L16,19L16,5ZM8,19L8,5L5,5L5,19L8,19Z\\" style=\\"fill:rgb(71,106,138);\\"/></g></g></svg>","description":"A container block with multiple options for styling and layout.","keywords":["content","columns","madeit"],"supports":{"html":false},"textdomain":"content-container","editorScript":"file:./build/index.js","editorStyle":"file:./build/index.css","style":"file:./build/style-index.css","attributes":{"wrapperClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content","attribute":"class"},"wrapperStyle":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content","attribute":"style"},"directRowClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content > .row","attribute":"class"},"boxedInnerContainerClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content > .row > .col > .container","attribute":"class"},"boxedInnerRowClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content > .row > .col > .container > .row","attribute":"class"},"verticalAlignment":{"type":"string"},"backgroundType":{"type":"string"},"containerBackgroundColor":{"type":"string"},"customContainerBackgroundColor":{"type":"string"},"containerBackgroundImage":{"type":"object"},"containerBackgroundPosition":{"type":"string"},"containerBackgroundRepeat":{"type":"string"},"containerBackgroundSize":{"type":"string"},"containerBackgroundGradient":{"type":"object"},"size":{"type":"string","default":"container"},"contentWidth":{"type":"string"},"containerMargin":{"type":"object"},"containerMarginTablet":{"type":"object"},"containerMarginMobile":{"type":"object"},"containerPadding":{"type":"object"},"containerPaddingTablet":{"type":"object"},"containerPaddingMobile":{"type":"object"},"containerPaddingOnRow":{"type":"boolean"},"rowBackgroundColor":{"type":"string"},"customRowBackgroundColor":{"type":"string"},"rowTextColor":{"type":"string"},"customRowTextColor":{"type":"string"},"rowMargin":{"type":"object"},"rowPadding":{"type":"object"},"overflow":{"type":"string"},"htmlTag":{"type":"string","default":"div"},"flexDirection":{"type":"string"},"flexDirectionTablet":{"type":"string"},"flexDirectionMobile":{"type":"string"},"alignItems":{"type":"string"},"alignItemsTablet":{"type":"string"},"alignItemsMobile":{"type":"string"},"justifyContent":{"type":"string"},"justifyContentTablet":{"type":"string"},"justifyContentMobile":{"type":"string"},"minHeight":{"type":"number"},"minHeightUnit":{"type":"string","default":"px"},"minHeightTablet":{"type":"number"},"minHeightUnitTablet":{"type":"string","default":"px"},"minHeightMobile":{"type":"number"},"minHeightUnitMobile":{"type":"string","default":"px"},"maxWidth":{"type":"number"},"maxWidthUnit":{"type":"string","default":"px"},"maxWidthTablet":{"type":"number"},"maxWidthUnitTablet":{"type":"string","default":"px"},"maxWidthMobile":{"type":"number"},"maxWidthUnitMobile":{"type":"string","default":"px"},"rowGap":{"type":"number"},"rowGapUnit":{"type":"string","default":"px"},"rowGapTablet":{"type":"number"},"rowGapUnitTablet":{"type":"string","default":"px"},"rowGapMobile":{"type":"number"},"rowGapUnitMobile":{"type":"string","default":"px"},"columnsCount":{"type":"number"},"flexWrap":{"type":"string"},"flexWrapTablet":{"type":"string"},"flexWrapMobile":{"type":"string"},"hideOnDesktop":{"type":"boolean"},"hideOnTablet":{"type":"boolean"},"hideOnMobile":{"type":"boolean"},"madeitHasUserEdits":{"type":"boolean","default":false},"className":{"type":"string"}}}');

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
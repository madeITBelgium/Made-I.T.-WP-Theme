/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../../shared/AdvancedUnitSelect.js"
/*!*********************************************!*\
  !*** ../../../shared/AdvancedUnitSelect.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UnitSelect)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);




const PRESET_UNITS = ['px', '%', 'vh', 'vw', 'em', 'rem'];
function UnitSelect({
  value = 'px',
  onChange,
  units = ['px', '%', 'vh']
}) {
  const isCustom = value && !PRESET_UNITS.includes(value);
  const [showCustom, setShowCustom] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(isCustom);
  const options = [...units.map(u => ({
    value: u,
    label: u
  })), {
    value: '__custom__',
    label: '✎'
  }];
  const selectValue = showCustom ? '__custom__' : value || 'px';
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-unit-select"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
    value: selectValue,
    options: options,
    onChange: next => {
      if (next === '__custom__') {
        setShowCustom(true);
        onChange('__custom__'); // ← sla '__custom__' op als tijdelijke waarde
      } else {
        setShowCustom(false);
        onChange(next);
      }
    },
    __nextHasNoMarginBottom: true
  }), showCustom && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    __next40pxDefaultSize: true,
    style: {
      width: '100%',
      position: 'absolute',
      right: 0,
      left: '-3px',
      maxWidth: '251px',
      margin: 'auto',
      transform: 'translateY(8px)'
    },
    placeholder: "calc(100% - 2rem)",
    value: value === '__custom__' ? '' : value,
    onChange: val => onChange(val || '__custom__') // ← val leeg? blijf '__custom__'
    ,
    __nextHasNoMarginBottom: true
  }));
}

/***/ },

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
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);

/**
 * BreakpointSwitcher.js
 *
 */



const DEVICE_MAP = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile'
};

// Omgekeerde mapping voor uitlezen
const REVERSE_DEVICE_MAP = Object.fromEntries(Object.entries(DEVICE_MAP).map(([k, v]) => [v, k]));
function BreakpointSwitcher({
  onChange
}) {
  var _REVERSE_DEVICE_MAP$g;
  const {
    setDeviceType
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)('core/editor');
  const gutenbergDevice = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => select('core/editor').getDeviceType());

  // Sync met Gutenberg, fallback naar 'desktop'
  const active = (_REVERSE_DEVICE_MAP$g = REVERSE_DEVICE_MAP[gutenbergDevice]) !== null && _REVERSE_DEVICE_MAP$g !== void 0 ? _REVERSE_DEVICE_MAP$g : 'desktop';
  const handleChange = breakpoint => {
    setDeviceType(DEVICE_MAP[breakpoint]);
    onChange?.(breakpoint);
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControl, {
    className: "madeit-control-breakpoints",
    value: active,
    onChange: value => handleChange(value)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
    value: "desktop",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
      icon: "desktop"
    }),
    "aria-label": "Desktop"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
    value: "tablet",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
      icon: "tablet"
    }),
    "aria-label": "Tablet"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
    value: "mobile",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
      icon: "smartphone"
    }),
    "aria-label": "Mobile"
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
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BreakpointSwitcher */ "../../../shared/BreakpointSwitcher.js");

/**
 * ControlHeader.js — Shared component for managing control headers in Gutenberg blocks.
 *
 */




function ControlHeader({
  title = '',
  breakpoint = null,
  onBreakpointChange = null,
  afterBreakpoint = null,
  onReset = null,
  resetLabel = null
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control-header",
    style: {
      width: '100%'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "madeit-control-header__title"
  }, title), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control-header__tools"
  }, breakpoint && onBreakpointChange && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_3__["default"], {
    active: breakpoint,
    onChange: onBreakpointChange
  }), afterBreakpoint, onReset && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    className: "madeit-control-header__reset",
    icon: "undo",
    variant: "tertiary",
    onClick: onReset,
    showTooltip: true,
    label: resetLabel || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reset')
  })));
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
/**
 * ResponsiveBoxControl.js — Shared component for managing responsive box controls in Gutenberg blocks.
 *
 */





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

/***/ "../../../shared/UnitSelect.js"
/*!*************************************!*\
  !*** ../../../shared/UnitSelect.js ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UnitSelect)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);


const PRESET_UNITS = ['px', '%', 'vh', 'vw', 'em', 'rem'];
function UnitSelect({
  value = 'px',
  onChange,
  units = PRESET_UNITS
}) {
  const options = units.map(unit => ({
    value: unit,
    label: unit
  }));
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-unit-select"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
    value: value,
    options: options,
    onChange: onChange,
    __nextHasNoMarginBottom: true
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

/**
 * breakpoint-context.js — Shared context for managing responsive breakpoints in Gutenberg blocks.
 *
 */


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
/* harmony export */   AdvancedUnitSelect: () => (/* reexport safe */ _AdvancedUnitSelect__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   BreakpointProvider: () => (/* reexport safe */ _breakpoint_context__WEBPACK_IMPORTED_MODULE_1__.BreakpointProvider),
/* harmony export */   BreakpointSwitcher: () => (/* reexport safe */ _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   ControlHeader: () => (/* reexport safe */ _ControlHeader__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   ResponsiveBoxControl: () => (/* reexport safe */ _ResponsiveBoxControl__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   ResponsiveVisibilityPanel: () => (/* reexport safe */ _ResponsiveVisibilityPanel__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   UnitSelect: () => (/* reexport safe */ _UnitSelect__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   getBreakpointKey: () => (/* reexport safe */ _breakpoint_context__WEBPACK_IMPORTED_MODULE_1__.getBreakpointKey),
/* harmony export */   useBreakpoint: () => (/* reexport safe */ _breakpoint_context__WEBPACK_IMPORTED_MODULE_1__.useBreakpoint)
/* harmony export */ });
/* harmony import */ var _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BreakpointSwitcher */ "../../../shared/BreakpointSwitcher.js");
/* harmony import */ var _breakpoint_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./breakpoint-context */ "../../../shared/breakpoint-context.js");
/* harmony import */ var _ControlHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ControlHeader */ "../../../shared/ControlHeader.js");
/* harmony import */ var _ResponsiveBoxControl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ResponsiveBoxControl */ "../../../shared/ResponsiveBoxControl.js");
/* harmony import */ var _ResponsiveVisibilityPanel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ResponsiveVisibilityPanel */ "../../../shared/ResponsiveVisibilityPanel.js");
/* harmony import */ var _UnitSelect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./UnitSelect */ "../../../shared/UnitSelect.js");
/* harmony import */ var _AdvancedUnitSelect__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AdvancedUnitSelect */ "../../../shared/AdvancedUnitSelect.js");








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

/**
 * edit.js — madeit-block-content
*
*/













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
    marginUnit,
    rowPadding,
    paddingUnit,
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

  // ── Eén globale breakpoint state ───────────────────────────────────────
  const [activeBreakpoint, setActiveBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)('desktop');
  const activeMaxWidthBreakpoint = activeBreakpoint;
  const activeMinHeightBreakpoint = activeBreakpoint;
  const activeRowGapBreakpoint = activeBreakpoint;
  const activePaddingBreakpoint = activeBreakpoint;
  const activeMarginBreakpoint = activeBreakpoint;
  const activeDirectionBreakpoint = activeBreakpoint;

  // ── Huidige breakpunt voor elke aanpasbare CSS-eigenschap ──────────────
  // const [ activeMaxWidthBreakpoint, setActiveMaxWidthBreakpoint ] = useState( 'desktop' );
  // const [ activeMinHeightBreakpoint, setActiveMinHeightBreakpoint ] = useState( 'desktop' );
  // const [ activeRowGapBreakpoint, setActiveRowGapBreakpoint ] = useState( 'desktop' );
  // const [ activePaddingBreakpoint, setActivePaddingBreakpoint ] = useState( 'desktop' );
  // const [ activeMarginBreakpoint, setActiveMarginBreakpoint ] = useState( 'desktop' );
  // const [ activeDirectionBreakpoint, setActiveDirectionBreakpoint ] = useState( 'desktop' );

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

  // In ColumnsEditContainer, naast je andere hooks:
  const blockStyles = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.useSelect)(select => select(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.store).getBlockStyles('madeit/block-content'),
  // jouw block name
  []);
  const {
    updateBlockAttributes
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.useDispatch)('core/block-editor');
  const currentClassName = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.useSelect)(select => {
    var _select$getBlockAttri;
    return (_select$getBlockAttri = select('core/block-editor').getBlockAttributes(clientId)?.className) !== null && _select$getBlockAttri !== void 0 ? _select$getBlockAttri : '';
  }, [clientId]);
  const applyBlockStyle = styleName => {
    const withoutStyles = currentClassName.split(' ').filter(cls => !cls.startsWith('is-style-')).join(' ').trim();

    // Is deze stijl al actief? Dan uitzetten
    const isActive = currentClassName.includes(`is-style-${styleName}`);
    const newClass = isActive ? withoutStyles // uitzetten
    : `${withoutStyles} is-style-${styleName}`.trim(); // aanzetten

    updateBlockAttributes(clientId, {
      className: newClass
    });
  };
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
  const StyleTransparentIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
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
  const StyleClassicIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
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
  const StyleGradientIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
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
  }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControl, {
    __next40pxDefaultSize: true,
    className: "madeit-control-styleSwitcher",
    value: active,
    onChange: onChange
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "transparent",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(StyleTransparentIcon, null)
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "classic",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(StyleClassicIcon, null)
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "gradient",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(StyleGradientIcon, null)
  }));
  const previewBlockStyle = styleName => {
    const block = document.querySelector(`.block-editor-block-list__block[data-block="${clientId}"]`);
    if (!block) {
      return;
    }

    // verwijder vorige previews
    block.classList.forEach(className => {
      if (className.startsWith('is-style-preview-')) {
        block.classList.remove(className);
      }
    });
    if (styleName) {
      block.classList.add(`is-style-preview-${styleName}`);
    }
  };
  const clearPreviewBlockStyle = () => {
    const block = document.querySelector(`.block-editor-block-list__block[data-block="${clientId}"]`);
    if (!block) {
      return;
    }
    block.classList.forEach(className => {
      if (className.startsWith('is-style-preview-')) {
        block.classList.remove(className);
      }
    });
  };
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

  // 1. Body-class: enkel afhankelijk van isBlockSelected
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

  // 2. Stijlen panel klasse: ook direct bij selectie toevoegen, niet bij tab-wissel
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
    if (!isBlockSelected) return;
    const stylesPanel = document.querySelector('.block-editor-block-styles')?.closest('.components-panel__body');
    if (!stylesPanel) return;
    stylesPanel.classList.add('madeit-gutenberg-styles-panel');
    return () => {
      stylesPanel.classList.remove('madeit-gutenberg-styles-panel');
    };
  }, [isBlockSelected]);
  return [(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-evenly'
    },
    className: 'TabContents'
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
    isPrimary: activeTab === 'layout',
    onClick: () => setActiveTab('layout'),
    style: {
      flex: '1',
      justifyContent: 'center'
    }
  }, "Layout"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
    isPrimary: activeTab === 'style',
    onClick: () => setActiveTab('style'),
    style: {
      flex: '1',
      justifyContent: 'center'
    }
  }, "Style"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
    isPrimary: activeTab === 'advanced',
    onClick: () => setActiveTab('advanced'),
    style: {
      flex: '1',
      justifyContent: 'center'
    }
  }, "Advanced")), activeTab === 'layout' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    title: "Container",
    initialOpen: true
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Aantal kolommen'),
    value: count,
    onChange: value => updateColumns(count, value),
    min: 1,
    max: 6
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Inhoud breedte'),
    labelPosition: "left",
    value: size,
    options: [{
      value: 'container',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Boxed')
    }, {
      value: 'container-fluid',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Full width')
    }],
    onChange: newSize => setAttributes({
      size: newSize,
      madeitHasUserEdits: true
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control",
    style: currentMaxWidthUnit == '__custom__' ? {
      marginBottom: '52px'
    } : {}
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('max breedte'),
    breakpoint: activeBreakpoint,
    onBreakpointChange: setActiveBreakpoint,
    afterBreakpoint: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.AdvancedUnitSelect, {
      value: currentMaxWidthUnit,
      units: ['px', '%', 'em', 'rem', 'vw'],
      onChange: unit => setAttributes({
        [maxWidthUnitKey]: unit,
        madeitHasUserEdits: true
      })
    })
  }), currentMaxWidthUnit !== '__custom__' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control-rangeRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
    __next40pxDefaultSize: true,
    label: "",
    value: typeof currentMaxWidthValue === 'number' ? currentMaxWidthValue : 0,
    onChange: value => setAttributes({
      [maxWidthValueKey]: value,
      madeitHasUserEdits: true
    }),
    min: 0,
    max: currentMaxWidthUnit === 'vh' || currentMaxWidthUnit === '%' ? 100 : 1000
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
    className: "madeit-control-rangeRow__reset",
    icon: "undo",
    variant: "tertiary",
    onClick: resetMaxWidth,
    showTooltip: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset max breedte')
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control",
    style: currentMinHeightUnit == '__custom__' ? {
      marginBottom: '52px'
    } : {}
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Min hoogte'),
    breakpoint: activeBreakpoint,
    onBreakpointChange: setActiveBreakpoint,
    afterBreakpoint: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.AdvancedUnitSelect, {
      value: currentMinHeightUnit,
      units: ['px', '%', 'em', 'rem', 'vh'],
      onChange: unit => setAttributes({
        [minHeightUnitKey]: unit,
        madeitHasUserEdits: true
      })
    })
  }), currentMinHeightUnit !== '__custom__' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control-rangeRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
    __next40pxDefaultSize: true,
    label: "",
    value: minHeightValueForUi,
    onChange: value => setAttributes({
      [minHeightValueKey]: value,
      madeitHasUserEdits: true
    }),
    min: 0,
    max: minHeightUnitForUi === 'vh' ? 100 : 1000,
    description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Gebruik 100vh om de container op volledige hoogte te bereiken')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
    className: "madeit-control-rangeRow__reset",
    icon: "undo",
    variant: "tertiary",
    onClick: resetMinHeight,
    showTooltip: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset min hoogte')
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "description",
    style: currentMinHeightUnit == '__custom__' ? {
      marginTop: '49px',
      marginBottom: '-51px'
    } : {}
  }, "Gebruik 100vh om de container op volledige hoogte te bereiken")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Items')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Direction'),
    breakpoint: activeBreakpoint,
    onBreakpointChange: setActiveBreakpoint
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControl, {
    __next40pxDefaultSize: true,
    className: "madeit-control-buttonGroup",
    value: currentDirection,
    onChange: value => setAttributes({
      [directionValueKey]: value
    })
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "row",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Icon, {
      icon: "arrow-right-alt2"
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Row')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "column",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Icon, {
      icon: "arrow-down-alt2"
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Column')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "row-reverse",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Icon, {
      icon: "arrow-left-alt2"
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Row reverse')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "column-reverse",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Icon, {
      icon: "arrow-up-alt2"
    }),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Column reverse')
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Align items'),
    breakpoint: activeBreakpoint,
    onBreakpointChange: setActiveBreakpoint,
    onReset: resetAlignItems,
    resetLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset align items')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControl, {
    __next40pxDefaultSize: true,
    className: "madeit-control-buttonGroup",
    value: currentAlignItems,
    onChange: value => setAttributes({
      [alignItemsValueKey]: value
    })
  }, isRowDirection && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "flex-start",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FlexStartIconRotate, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Top')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "center",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(CenterIconRotate, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Center')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "flex-end",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FlexEndIconRotate, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Bottom')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "stretch",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(StretchIconRotate, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Stretch')
  })), isColumnDirection && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "flex-start",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FlexStartIcon, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Left')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "center",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(CenterIcon, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Center')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "flex-end",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(FlexEndIcon, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Right')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "stretch",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(StretchIcon, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Stretch')
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify items'),
    breakpoint: activeBreakpoint,
    onBreakpointChange: setActiveBreakpoint,
    onReset: resetJustifyContent,
    resetLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset justify items')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControl, {
    __next40pxDefaultSize: true,
    className: "madeit-control-buttonGroup",
    value: currentJustifyContent,
    onChange: value => setAttributes({
      [justifyContentValueKey]: value
    })
  }, isRowDirection && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "flex-start",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyStartIcon, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify start')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "center",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyCenterIcon, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify center')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "flex-end",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyEndIcon, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify end')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "space-between",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyBetweenIcon, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify between')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "space-around",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifySpaceAroundIcon, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify space around')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "space-evenly",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifySpaceEvenlyIcon, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify space evenly')
  })), isColumnDirection && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "flex-start",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyStartIconRotate, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify start')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "center",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyCenterIconRotate, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify center')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "flex-end",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyEndIconRotate, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify end')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "space-between",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifyBetweenIconRotate, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify between')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "space-around",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifySpaceAroundIconRotate, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify space around')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "space-evenly",
    label: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(JustifySpaceEvenlyIconRotate, null),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Justify space evenly')
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Wrap'),
    breakpoint: activeBreakpoint,
    onBreakpointChange: setActiveBreakpoint,
    onReset: resetFlexWrap,
    resetLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset wrap')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControl, {
    __next40pxDefaultSize: true,
    className: "madeit-control-buttonGroup",
    value: currentFlexWrap,
    onChange: value => setAttributes({
      [flexWrapValueKey]: value
    })
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "wrap",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Wrap'),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Wrap')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    value: "nowrap",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No wrap'),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No wrap')
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    title: "Extra opties",
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
    __next40pxDefaultSize: true,
    className: "flex1",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Overflow'),
    labelPosition: "left",
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
    __next40pxDefaultSize: true,
    className: "flex1",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('HTML tag'),
    labelPosition: "left",
    value: computedHtmlTag,
    options: [{
      value: 'div',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Standaard')
    }, {
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
  }))), activeTab === 'style' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, blockStyles?.length > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    title: "Stijlen",
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControl, {
    __next40pxDefaultSize: true,
    className: "madeit-block-styles-picker",
    value: blockStyles.find(style => (currentClassName || '').includes(`is-style-${style.name}`))?.name || 'default',
    onChange: value => {
      if (value === 'default') {
        applyBlockStyle('');
        return;
      }
      applyBlockStyle(value);
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    className: "madeit-block-styles-picker-button",
    value: "default",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Default')
  }), blockStyles.map(style => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.__experimentalToggleGroupControlOption, {
    className: "madeit-block-styles-picker-button",
    key: style.name,
    value: style.name,
    label: style.label,
    onMouseEnter: () => previewBlockStyle(style.name),
    onMouseLeave: clearPreviewBlockStyle
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
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
    }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
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
    __next40pxDefaultSize: true,
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
    __next40pxDefaultSize: true,
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
    __next40pxDefaultSize: true,
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
    breakpoint: activeBreakpoint,
    onBreakpointChange: setActiveBreakpoint,
    afterBreakpoint: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.UnitSelect, {
      value: currentRowGapUnit,
      units: ['px', 'em', 'rem'],
      onChange: unit => {
        const currentRowGap = attributes?.[rowGapValueKey] || {};
        const nextRowGap = {};
        Object.keys(currentRowGap).forEach(key => {
          const raw = currentRowGap[key];
          if (raw === undefined || raw === null || raw === '') {
            return;
          }
          const numeric = parseFloat(raw);
          if (!Number.isFinite(numeric)) {
            return;
          }
          nextRowGap[key] = `${numeric}${unit}`;
        });
        setAttributes({
          [rowGapValueKey]: nextRowGap,
          [rowGapUnitKey]: unit,
          madeitHasUserEdits: true
        });
      }
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control-rangeRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
    __next40pxDefaultSize: true,
    label: "",
    value: typeof currentRowGapValue === 'number' ? currentRowGapValue : 0,
    onChange: value => setAttributes({
      [rowGapValueKey]: value,
      madeitHasUserEdits: true
    }),
    min: 0,
    max: 100
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
    className: "madeit-control-rangeRow__reset",
    icon: "undo",
    variant: "tertiary",
    onClick: resetRowGap,
    showTooltip: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Reset Row Gap')
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control",
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Padding', 'madeit'),
    breakpoint: activeBreakpoint,
    onBreakpointChange: setActiveBreakpoint,
    afterBreakpoint: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.UnitSelect, {
      value: paddingUnit,
      units: ['px', '%', 'em', 'rem', 'vw', 'vh'],
      onChange: unit => {
        const currentPadding = attributes?.[paddingValueKey] || {};
        const nextPadding = {};
        ['top', 'right', 'bottom', 'left'].forEach(key => {
          const raw = currentPadding?.[key];
          if (!raw) {
            return;
          }
          const numeric = parseFloat(raw);
          if (!Number.isFinite(numeric)) {
            return;
          }
          nextPadding[key] = `${numeric}${unit}`;
        });
        setAttributes({
          [paddingValueKey]: nextPadding,
          paddingUnit: unit,
          madeitHasUserEdits: true
        });
      }
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-controls",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      maxWidth: 'calc(100% - 35px)'
    }
  }, [{
    label: 'Bovenaan',
    key: 'top',
    status: 'default'
  }, {
    label: 'Rechts',
    key: 'right',
    status: 'default'
  }, {
    label: 'Onderaan',
    key: 'bottom',
    status: 'default'
  }, {
    label: 'Links',
    key: 'left',
    status: 'default'
  }].map(item => {
    const currentPadding = attributes?.[paddingValueKey] || {};
    const rawValue = currentPadding?.[item.key];
    const numericValue = parseFloat(rawValue);
    const displayValue = Number.isFinite(numericValue) ? numericValue : '';
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: item.key,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
      },
      className: "control-item"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "number",
      value: displayValue,
      min: -9999,
      disabled: item.status === 'disabled',
      onChange: e => {
        const val = e.target.value;
        const currentPadding = attributes?.[paddingValueKey] || {};
        setAttributes({
          [paddingValueKey]: {
            ...currentPadding,
            [item.key]: val === '' ? undefined : `${val}${paddingUnit || 'px'}`
          }
        });
      },
      style: {
        width: '100%',
        height: '27px',
        minHeight: '27px',
        fontSize: '.85em',
        textAlign: 'center'
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        fontSize: '9px',
        marginTop: '4px'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)(item.label, 'madeit')));
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
    title: "Waarden koppelen",
    variant: "tertiary",
    onClick: () => {
      const currentPadding = attributes?.[paddingValueKey] || {};
      const values = [currentPadding.top, currentPadding.right, currentPadding.bottom, currentPadding.left];
      const allEqual = values.every(val => val === values[0]);
      if (allEqual) {
        setAttributes({
          [paddingValueKey]: {
            top: undefined,
            right: undefined,
            bottom: undefined,
            left: undefined
          }
        });
      } else {
        const firstValue = values.find(val => val) || '';
        setAttributes({
          [paddingValueKey]: {
            top: firstValue,
            right: firstValue,
            bottom: firstValue,
            left: firstValue
          }
        });
      }
    },
    style: {
      height: 'fit-content',
      marginLeft: '10px',
      marginTop: '9px',
      padding: '0'
    },
    showTooltip: true
  }, (() => {
    const currentPadding = attributes?.[paddingValueKey] || {};
    const values = [currentPadding.top, currentPadding.right, currentPadding.bottom, currentPadding.left];
    const allEqual = values.every(val => val === values[0] && val !== undefined);
    return allEqual ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "dashicons dashicons-editor-unlink",
      style: {
        fontSize: '15px',
        width: 'min-content'
      }
    }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "dashicons dashicons-admin-links",
      style: {
        fontSize: '15px',
        width: 'min-content'
      }
    });
  })())), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control",
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Margin', 'madeit'),
    breakpoint: activeBreakpoint,
    onBreakpointChange: setActiveBreakpoint,
    afterBreakpoint: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.UnitSelect, {
      value: marginUnit,
      units: ['px', '%', 'em', 'rem', 'vw', 'vh'],
      onChange: unit => {
        const currentMargin = attributes?.[marginValueKey] || {};
        const nextMargin = {};
        ['top', 'right', 'bottom', 'left'].forEach(key => {
          const raw = currentMargin?.[key];
          if (!raw) {
            return;
          }
          const numeric = parseFloat(raw);
          if (!Number.isFinite(numeric)) {
            return;
          }
          nextMargin[key] = `${numeric}${unit}`;
        });
        setAttributes({
          [marginValueKey]: nextMargin,
          marginUnit: unit,
          madeitHasUserEdits: true
        });
      }
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-controls",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      maxWidth: 'calc(100% - 35px)'
    }
  }, [{
    label: 'Bovenaan',
    key: 'top',
    status: 'default'
  }, {
    label: 'Rechts',
    key: 'right',
    status: 'disabled'
  }, {
    label: 'Onderaan',
    key: 'bottom',
    status: 'default'
  }, {
    label: 'Links',
    key: 'left',
    status: 'disabled'
  }].map(item => {
    const currentMargin = attributes?.[marginValueKey] || {};
    const rawValue = currentMargin?.[item.key];
    const numericValue = parseFloat(rawValue);
    const displayValue = Number.isFinite(numericValue) ? numericValue : '';
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: item.key,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
      },
      className: "control-item"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "number",
      value: displayValue,
      min: -9999,
      disabled: item.status === 'disabled',
      onChange: e => {
        const val = e.target.value;
        const currentMargin = attributes?.[marginValueKey] || {};
        setAttributes({
          [marginValueKey]: {
            ...currentMargin,
            [item.key]: val === '' ? undefined : `${val}${marginUnit || 'px'}`
          }
        });
      },
      style: {
        width: '100%',
        height: '27px',
        minHeight: '27px',
        fontSize: '.85em',
        textAlign: 'center'
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        fontSize: '9px',
        marginTop: '4px'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)(item.label, 'madeit')));
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
    title: "Waarden koppelen",
    variant: "tertiary",
    onClick: () => {
      const currentMargin = attributes?.[marginValueKey] || {};
      const values = [currentMargin.top, currentMargin.right, currentMargin.bottom, currentMargin.left];
      const allEqual = values.every(val => val === values[0]);
      if (allEqual) {
        setAttributes({
          [marginValueKey]: {
            top: undefined,
            right: undefined,
            bottom: undefined,
            left: undefined
          }
        });
      } else {
        const firstValue = values.find(val => val) || '';
        setAttributes({
          [marginValueKey]: {
            top: firstValue,
            right: firstValue,
            bottom: firstValue,
            left: firstValue
          }
        });
      }
    },
    style: {
      height: 'fit-content',
      marginLeft: '10px',
      marginTop: '9px',
      padding: '0'
    },
    showTooltip: true
  }, (() => {
    const currentMargin = attributes?.[marginValueKey] || {};
    const values = [currentMargin.top, currentMargin.right, currentMargin.bottom, currentMargin.left];
    const allEqual = values.every(val => val === values[0] && val !== undefined);
    return allEqual ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "dashicons dashicons-editor-unlink",
      style: {
        fontSize: '15px',
        width: 'min-content'
      }
    }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "dashicons dashicons-admin-links",
      style: {
        fontSize: '15px',
        width: 'min-content'
      }
    });
  })())))), activeTab === 'advanced' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_11__.ResponsiveVisibilityPanel, {
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
    // if ( hasInnerBlocks ) return;

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
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
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
 * DEPRECATED VERSIES — van meest recent naar oudst
 * ─────────────────────────────────────────────────
 * Elke entry heeft een migrate() die madeitHasUserEdits: true zet en de
 * correcte size afleidt. Hierdoor migreert Gutenberg de content automatisch
 * naar de nieuwe structuur zodra een pagina wordt ingeladen — zonder dat de
 * gebruiker hoeft op te slaan.
 *
 * VERSIES (6 i.p.v. 16):
 *   VnoDir – Standaard markup, geen data-madeit-dir-tablet/mobile
 *   Vboxed – Boxed markup met .col wrapper en inner row zonder data attrs
 *   Vdirect – Directe row + inline margin styles
 *   Vpre0b – Inner div aanwezig, normale classes, partial CSS-vars
 *   Vpre0  – Inner div aanwezig, dubbele classes (bug)
 *   V9     – Inline margin (geen CSS-var), container-fluid + frontend-class
 *   V12    ⭐ LIVE: wrapper = container, geen frontend-class, JSX typo
 *   V13    ⭐ LIVE: numerieke attributen (alleroudst)
 *
 * VERWIJDERD (intern, nooit live gegaan):
 *   V1, V2, V3, V5, V7, V8, V9, V10, V11, V14, V15
 */









// ─── Hulpfuncties ─────────────────────────────────────────────────────────────

const normalizeCssLength = (value, unit = 'px') => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}${unit}`;
  if (typeof value !== 'string') return undefined;
  const t = value.trim();
  if (!t) return undefined;
  if (/^-?\d+(?:\.\d+)?$/.test(t)) return `${t}${unit}`;
  if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(t)) return t;
  return undefined;
};
const normalizeSpacingObject = s => {
  var _normalizeCssLength, _normalizeCssLength2, _normalizeCssLength3, _normalizeCssLength4;
  if (!s || typeof s !== 'object') return undefined;
  const {
    top,
    right,
    bottom,
    left
  } = s;
  if (![top, right, bottom, left].some(v => v !== undefined && v !== null && String(v).trim())) return undefined;
  return {
    top: (_normalizeCssLength = normalizeCssLength(top)) !== null && _normalizeCssLength !== void 0 ? _normalizeCssLength : '0px',
    right: (_normalizeCssLength2 = normalizeCssLength(right)) !== null && _normalizeCssLength2 !== void 0 ? _normalizeCssLength2 : '0px',
    bottom: (_normalizeCssLength3 = normalizeCssLength(bottom)) !== null && _normalizeCssLength3 !== void 0 ? _normalizeCssLength3 : '0px',
    left: (_normalizeCssLength4 = normalizeCssLength(left)) !== null && _normalizeCssLength4 !== void 0 ? _normalizeCssLength4 : '0px'
  };
};
const normalizeSpacing = attrs => {
  const n = {
    ...(attrs || {})
  };
  n.containerMargin = normalizeSpacingObject(n.containerMargin);
  n.containerMarginTablet = normalizeSpacingObject(n.containerMarginTablet);
  n.containerMarginMobile = normalizeSpacingObject(n.containerMarginMobile);
  n.containerPadding = normalizeSpacingObject(n.containerPadding);
  n.containerPaddingTablet = normalizeSpacingObject(n.containerPaddingTablet);
  n.containerPaddingMobile = normalizeSpacingObject(n.containerPaddingMobile);
  n.rowMargin = normalizeSpacingObject(n.rowMargin);
  n.rowPadding = normalizeSpacingObject(n.rowPadding);
  return n;
};

/**
 * Leidt de correcte `size` af uit wrapperClassName.
 * Zo weet de nieuwe save() of hij container of container-fluid moet renderen.
 */
const resolveSize = attrs => {
  const {
    size,
    wrapperClassName
  } = attrs;
  // Vertrouw een expliciete niet-boxed size
  if (size === 'container-fluid') return 'container-fluid';
  // Afleiden uit opgeslagen wrapper klassen
  const tokens = typeof wrapperClassName === 'string' ? wrapperClassName.trim().split(/\s+/) : [];
  if (tokens.includes('container-fluid')) return 'container-fluid';
  if (tokens.includes('container')) return 'container';
  return 'container'; // fallback
};

/**
 * Standaard migrate: normaliseer spacing + zet madeitHasUserEdits.
 * Dit zorgt dat de nieuwe save() de juiste markup genereert zonder opslaan.
 */
const migrate = attrs => ({
  ...normalizeSpacing(attrs),
  size: resolveSize(attrs),
  madeitHasUserEdits: true
});

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
  // ── Vpre0b ────────────────────────────────────────────────────────────
  // Inner container div aanwezig, normale klassen, partial CSS-vars.
  // Meest recente tussenfase vóór de huidige save.
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    isEligible(attrs) {
      var _attrs$wrapperClassNa;
      if (attrs?.madeitHasUserEdits) return false;
      const tokens = ((_attrs$wrapperClassNa = attrs?.wrapperClassName) !== null && _attrs$wrapperClassNa !== void 0 ? _attrs$wrapperClassNa : '').trim().split(/\s+/).filter(Boolean);
      // Niet matchen als klassen verdubbeld zijn (dat is Vpre0)
      if (tokens.filter(t => t === 'wp-block-madeit-block-content').length >= 2) return false;
      return tokens.includes('madeit-block-content--frontend') || tokens.length === 0;
    },
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveVpre0b,
    migrate
  },
  // ── Vpre0 ─────────────────────────────────────────────────────────────
  // Inner container div aanwezig maar klassen zijn verdubbeld door een bug
  // (blockProps.className werd samengevoegd met wrapperClass).
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    isEligible(attrs) {
      var _attrs$wrapperClassNa2;
      const tokens = ((_attrs$wrapperClassNa2 = attrs?.wrapperClassName) !== null && _attrs$wrapperClassNa2 !== void 0 ? _attrs$wrapperClassNa2 : '').trim().split(/\s+/).filter(Boolean);
      return tokens.filter(t => t === 'wp-block-madeit-block-content').length >= 2;
    },
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveVpre0,
    migrate
  },
  // ── VnoDir ───────────────────────────────────────────────────────────
  // Standaard markup maar zonder data-madeit-dir-tablet/mobile.
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    isEligible(attrs) {
      var _attrs$wrapperClassNa3;
      if (attrs?.madeitHasUserEdits) return false;
      if (attrs?.flexDirectionTablet !== undefined && attrs?.flexDirectionTablet !== null) return false;
      if (attrs?.flexDirectionMobile !== undefined && attrs?.flexDirectionMobile !== null) return false;
      const tokens = ((_attrs$wrapperClassNa3 = attrs?.wrapperClassName) !== null && _attrs$wrapperClassNa3 !== void 0 ? _attrs$wrapperClassNa3 : '').trim().split(/\s+/).filter(Boolean);
      return tokens.includes('madeit-block-content--frontend');
    },
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveVnoResponsiveDir,
    migrate
  },
  // ── Vboxed ───────────────────────────────────────────────────────────
  // Boxed markup met .col wrapper en inner row zonder data attrs.
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    isEligible(attrs) {
      if (attrs?.madeitHasUserEdits) return false;
      const boxedInnerRow = typeof attrs?.boxedInnerRowClassName === 'string' ? attrs.boxedInnerRowClassName.trim() : '';
      const boxedInnerContainer = typeof attrs?.boxedInnerContainerClassName === 'string' ? attrs.boxedInnerContainerClassName.trim() : '';
      if (!boxedInnerRow) return false;
      if (!boxedInnerContainer) return false;
      return true;
    },
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveVlegacyBoxedInnerRow,
    migrate(attrs) {
      return {
        ...migrate(attrs),
        size: 'container'
      };
    }
  },
  // ── Vdirect ──────────────────────────────────────────────────────────
  // Directe row + inline margin styles op wrapper (geen CSS-var margins).
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    isEligible(attrs) {
      if (attrs?.madeitHasUserEdits) return false;
      const directRowClass = typeof attrs?.directRowClassName === 'string' ? attrs.directRowClassName.trim() : '';
      if (!directRowClass) return false;
      const ws = typeof attrs?.wrapperStyle === 'string' ? attrs.wrapperStyle.replace(/\s+/g, '') : '';
      if (!ws) return false;
      if (ws.includes('--madeit-container-margin')) return false;
      return ws.includes('margin-top:') || ws.includes('margin-bottom:') || ws.includes('margin-left:') || ws.includes('margin-right:');
    },
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveVlegacyDirectRowInlineStyle,
    migrate
  },
  // ── V9 ────────────────────────────────────────────────────────────────
  // Container-fluid wrapper MET frontend-class, maar margin als inline stijl
  // (margin-bottom:30px) i.p.v. CSS-var. Geen inner container div.
  // isEligible herkent de inline margin in de opgeslagen wrapperStyle.
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    isEligible(attrs) {
      var _attrs$wrapperStyle;
      const ws = ((_attrs$wrapperStyle = attrs?.wrapperStyle) !== null && _attrs$wrapperStyle !== void 0 ? _attrs$wrapperStyle : '').replace(/\s+/g, '');
      if (!ws) return false;
      // Matcht als er inline margin staat (geen CSS-var voor margin)
      return (ws.includes('margin-top:') || ws.includes('margin-bottom:')) && !ws.includes('--madeit-container-margin');
    },
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV9,
    migrate
  },
  // ── V12 ⭐ LIVE OP WEBSITES ────────────────────────────────────────────
  // Wrapper = container (niet container-fluid), geen madeit-block-content--frontend
  // klasse, JSX typo `class="row"` i.p.v. `className="row"`, geen CSS-vars.
  // Dit is de versie die op alle huidige live websites staat.
  {
    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
    save: _save_versions__WEBPACK_IMPORTED_MODULE_6__.saveV12,
    migrate
  },
  // ── V13 ⭐ LIVE OP WEBSITES ────────────────────────────────────────────
  // Alleroudste versie met afzonderlijke numerieke attributen
  // (containerPaddingTop, containerMarginBottom, etc.).
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
    migrate(attrs) {
      const px = v => v !== null && v !== undefined && v > 0 ? `${v}px` : undefined;
      return {
        containerPadding: {
          top: px(attrs.containerPaddingTop),
          bottom: px(attrs.containerPaddingBottom),
          left: px(attrs.containerPaddingLeft),
          right: px(attrs.containerPaddingRight)
        },
        containerMargin: {
          top: px(attrs.containerMarginTop),
          bottom: px(attrs.containerMarginBottom),
          left: px(attrs.containerMarginLeft),
          right: px(attrs.containerMarginRight)
        },
        rowPadding: {
          top: px(attrs.rowPaddingTop),
          bottom: px(attrs.rowPaddingBottom),
          left: px(attrs.rowPaddingLeft),
          right: px(attrs.rowPaddingRight)
        },
        rowMargin: {
          top: px(attrs.rowMarginTop),
          bottom: px(attrs.rowMarginBottom),
          left: px(attrs.rowMarginLeft),
          right: px(attrs.rowMarginRight)
        },
        size: resolveSize(attrs),
        verticalAlignment: attrs.verticalAlignment,
        containerBackgroundColor: attrs.containerBackgroundColor,
        customContainerBackgroundColor: attrs.customContainerBackgroundColor,
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
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   saveV12: () => (/* reexport safe */ _saveV2__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   saveV13: () => (/* reexport safe */ _saveV1__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   saveV9: () => (/* reexport safe */ _saveV3__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   saveVlegacyBoxedInnerRow: () => (/* reexport safe */ _saveVlegacy_boxed_inner_row__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   saveVlegacyDirectRowInlineStyle: () => (/* reexport safe */ _saveVlegacy_direct_row_inline_style__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   saveVnoResponsiveDir: () => (/* reexport safe */ _saveVno_responsive_dir__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   saveVpre0: () => (/* reexport safe */ _saveV7__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   saveVpre0b: () => (/* reexport safe */ _saveV8__WEBPACK_IMPORTED_MODULE_3__["default"])
/* harmony export */ });
/* harmony import */ var _saveVno_responsive_dir__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./saveVno-responsive-dir */ "./src/save-versions/saveVno-responsive-dir.js");
/* harmony import */ var _saveVlegacy_boxed_inner_row__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./saveVlegacy-boxed-inner-row */ "./src/save-versions/saveVlegacy-boxed-inner-row.js");
/* harmony import */ var _saveVlegacy_direct_row_inline_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./saveVlegacy-direct-row-inline-style */ "./src/save-versions/saveVlegacy-direct-row-inline-style.js");
/* harmony import */ var _saveV8__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./saveV8 */ "./src/save-versions/saveV8.js");
/* harmony import */ var _saveV7__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./saveV7 */ "./src/save-versions/saveV7.js");
/* harmony import */ var _saveV3__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./saveV3 */ "./src/save-versions/saveV3.js");
/* harmony import */ var _saveV2__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./saveV2 */ "./src/save-versions/saveV2.js");
/* harmony import */ var _saveV1__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./saveV1 */ "./src/save-versions/saveV1.js");
/**
 * save-versions/index.js — madeit/block-content
 *
 *   saveVnoResponsiveDir – Standaard markup, geen data-madeit-dir-tablet/mobile
 *   saveVlegacyBoxedInnerRow – Boxed markup met .col wrapper en inner row zonder data attrs
 *   saveVlegacyDirectRowInlineStyle – Directe row + inline margin styles
 *   saveVpre0b – Inner div aanwezig, normale klassen, partial CSS-vars
 *   saveVpre0  – Inner div aanwezig, dubbele klassen (bug)
 *   saveV9     – Inline margin (geen CSS-var), container-fluid + frontend-class
 *   saveV12    – ⭐ LIVE: wrapper = container, geen frontend-class, JSX typo
 *   saveV13    – ⭐ LIVE: numerieke attributen (alleroudst)
 */










/***/ },

/***/ "./src/save-versions/saveV1.js"
/*!*************************************!*\
  !*** ./src/save-versions/saveV1.js ***!
  \*************************************/
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

// Save V1




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

/***/ "./src/save-versions/saveV2.js"
/*!*************************************!*\
  !*** ./src/save-versions/saveV2.js ***!
  \*************************************/
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

// Save V2

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

/***/ "./src/save-versions/saveV3.js"
/*!*************************************!*\
  !*** ./src/save-versions/saveV3.js ***!
  \*************************************/
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

// Save V3




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

/***/ "./src/save-versions/saveV7.js"
/*!*************************************!*\
  !*** ./src/save-versions/saveV7.js ***!
  \*************************************/
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

// Save V7

/**
 * MET inner container div + partial CSS-vars
 *
 * Dit matcht de eerste versie NADAT de inner container div werd toegevoegd,
 * maar VOORDAT de volledige set CSS-vars (row-gap tablet/mobile,
 * flex-direction desktop/tablet/mobile, flex-wrap) werd uitgebreid.
 *
 * Patroon in opgeslagen markup (inner div aanwezig, partial vars):
 *   <div class="wp-block-madeit-block-content container-fluid madeit-block-content--frontend" style="...;--madeit-align-items-desktop:center">
 *     <div class="container">
 *       <div class="row ...">
 *
 * Vars die ONTBRAKEN in deze versie (t.o.v. huidige save):
 * - --madeit-row-gap-tablet, --madeit-row-gap-mobile
 * - --madeit-flex-direction-desktop, tablet, mobile
 * - --madeit-flex-wrap-desktop, tablet, mobile
 * - --madeit-justify-content-tablet, mobile
 * - --madeit-align-items-tablet, mobile
 */



const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
const ALLOWED_HTML_TAGS = ['div', 'section', 'article', 'main', 'header', 'footer'];
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
function toCssLength(value, unit = 'px') {
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}${unit || 'px'}`;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return `${trimmed}${unit || 'px'}`;
  if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(trimmed)) return trimmed;
  return undefined;
}
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
function save(props) {
  const {
    attributes,
    className
  } = props;
  const containerBgClass = attributes.containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', attributes.containerBackgroundColor) : undefined;
  const rowTextClass = attributes.rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', attributes.rowTextColor) : undefined;
  const customClassNames = [typeof attributes.className === 'string' && attributes.className.trim() ? attributes.className.trim() : '', typeof className === 'string' && className.trim() ? className.trim() : ''].filter(Boolean).join(' ');
  const extraClass = filterExtraClasses(customClassNames);
  const {
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = attributes;
  const wrapperClass = classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content', 'container-fluid', FRONTEND_WRAPPER_CLASS, extraClass, {
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile,
    'has-text-color': !!rowTextClass,
    [rowTextClass]: !!rowTextClass,
    'has-background': !!containerBgClass,
    [containerBgClass]: !!containerBgClass
  });

  // ── PARTIAL stijl: alleen de vars die in deze versie bestonden ─────────────
  const backgroundStyle = buildBackgroundStyle(attributes);
  const {
    overflow,
    minHeight,
    minHeightUnit,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    rowGap,
    rowGapUnit,
    // alignItems desktop was aanwezig, tablet/mobile niet
    alignItems,
    // justifyContent desktop was aanwezig, tablet/mobile niet
    justifyContent,
    // flex-direction bestond NIET in deze versie
    // flex-wrap bestond NIET in deze versie
    // row-gap tablet/mobile bestonden NIET in deze versie
    containerMargin,
    containerMarginTablet,
    containerMarginMobile,
    containerPadding,
    containerPaddingTablet,
    containerPaddingMobile,
    containerPaddingOnRow,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    columnsCount
  } = attributes;
  const wrapperStyle = {
    ...backgroundStyle
  };
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') {
    wrapperStyle.overflow = overflow;
  }
  const minHeightDesktopV = toCssLength(minHeight, minHeightUnit || 'px');
  const minHeightMobileVV = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnit || 'px');
  if (minHeightDesktopV) setCssVar(wrapperStyle, '--madeit-min-height-desktop', minHeightDesktopV);
  if (minHeightMobileVV) setCssVar(wrapperStyle, '--madeit-min-height-mobile', minHeightMobileVV);
  if (typeof maxWidth === 'number') setCssVar(wrapperStyle, '--madeit-max-width-desktop', `${maxWidth}${maxWidthUnit || 'px'}`);

  // Row-gap: alleen desktop in deze versie
  if (typeof rowGap === 'number') setCssVar(wrapperStyle, '--madeit-row-gap-desktop', `${rowGap}${rowGapUnit || 'px'}`);

  // Align-items: alleen desktop in deze versie
  if (typeof alignItems === 'string' && alignItems.length > 0) setCssVar(wrapperStyle, '--madeit-align-items-desktop', alignItems);

  // Justify-content: alleen desktop in deze versie
  if (typeof justifyContent === 'string' && justifyContent.length > 0) setCssVar(wrapperStyle, '--madeit-justify-content-desktop', justifyContent);

  // Container margin als CSS-vars
  if (containerMargin && typeof containerMargin === 'object') {
    if (containerMargin.top !== undefined) setCssVar(wrapperStyle, '--madeit-container-margin-top-desktop', containerMargin.top);
    if (containerMargin.bottom !== undefined) setCssVar(wrapperStyle, '--madeit-container-margin-bottom-desktop', containerMargin.bottom);
  }
  if (containerMarginTablet && typeof containerMarginTablet === 'object') {
    setCssVar(wrapperStyle, '--madeit-container-margin-top-tablet', containerMarginTablet.top);
    setCssVar(wrapperStyle, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom);
  }
  if (containerMarginMobile && typeof containerMarginMobile === 'object') {
    setCssVar(wrapperStyle, '--madeit-container-margin-top-mobile', containerMarginMobile.top);
    setCssVar(wrapperStyle, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom);
  }
  if (containerPaddingOnRow !== true) {
    setSpacingVars(wrapperStyle, 'madeit-container-padding', containerPadding, 'desktop');
  }
  const hasStyleProps = Object.keys(wrapperStyle).length > 0;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: wrapperClass,
    style: hasStyleProps ? wrapperStyle : undefined
  });
  const HtmlTag = ALLOWED_HTML_TAGS.includes(attributes.htmlTag) ? attributes.htmlTag : 'div';
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
  const rowStyle = {};
  if (containerPaddingOnRow === true) {
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPadding, 'desktop');
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile');
  }
  const hasRowStyleProps = Object.keys(rowStyle).length > 0;
  const outerRowProps = hasRowStyleProps ? {
    ...baseRowProps,
    style: rowStyle
  } : baseRowProps;
  const rawSize = typeof attributes.size === 'string' ? attributes.size.trim() : '';
  const innerDivClass = rawSize === 'container-fluid' ? 'container-fluid' : 'container';
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerDivClass
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...outerRowProps
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n')));
}

/***/ },

/***/ "./src/save-versions/saveV8.js"
/*!*************************************!*\
  !*** ./src/save-versions/saveV8.js ***!
  \*************************************/
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

// Save V8

/**
 * Geen dubbele classes + inner container div + partial CSS-vars
 *
 * Kenmerken in opgeslagen markup:
 * - Normale (niet dubbele) classes op wrapper
 * - WEL inner <div class="container"> aanwezig
 * - Slechts partial CSS-vars: alleen --madeit-align-items-desktop en/of
 *   --madeit-justify-content-desktop, --madeit-min-height-*, --madeit-row-gap-desktop
 *   (maar GEEN row-gap tablet/mobile, GEEN flex-direction vars, GEEN flex-wrap)
 */



const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
const ALLOWED_HTML_TAGS = ['div', 'section', 'article', 'main', 'header', 'footer'];
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
function toCssLength(value, unit = 'px') {
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}${unit || 'px'}`;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return `${trimmed}${unit || 'px'}`;
  if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(trimmed)) return trimmed;
  return undefined;
}
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
function save(props) {
  const {
    attributes,
    className
  } = props;
  const containerBgClass = attributes.containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', attributes.containerBackgroundColor) : undefined;
  const rowTextClass = attributes.rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', attributes.rowTextColor) : undefined;
  const customClassNames = [typeof attributes.className === 'string' && attributes.className.trim() ? attributes.className.trim() : '', typeof className === 'string' && className.trim() ? className.trim() : ''].filter(Boolean).join(' ');
  const extraClass = filterExtraClasses(customClassNames);
  const {
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = attributes;
  const wrapperClass = classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content', 'container-fluid', FRONTEND_WRAPPER_CLASS, extraClass, {
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile,
    'has-text-color': !!rowTextClass,
    [rowTextClass]: !!rowTextClass,
    'has-background': !!containerBgClass,
    [containerBgClass]: !!containerBgClass
  });

  // ── Partial stijl: alleen de vars die in deze versie bestonden ─────────────
  const backgroundStyle = buildBackgroundStyle(attributes);
  const {
    overflow,
    minHeight,
    minHeightUnit,
    minHeightMobile,
    minHeightUnitMobile,
    maxWidth,
    maxWidthUnit,
    rowGap,
    rowGapUnit,
    alignItems,
    justifyContent,
    containerMargin,
    containerMarginTablet,
    containerMarginMobile,
    containerPadding,
    containerPaddingTablet,
    containerPaddingMobile,
    containerPaddingOnRow,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    columnsCount
  } = attributes;
  const wrapperStyle = {
    ...backgroundStyle
  };
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') {
    wrapperStyle.overflow = overflow;
  }
  const minHeightDesktopV = toCssLength(minHeight, minHeightUnit || 'px');
  const minHeightMobileVV = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnit || 'px');
  if (minHeightDesktopV) setCssVar(wrapperStyle, '--madeit-min-height-desktop', minHeightDesktopV);
  if (minHeightMobileVV) setCssVar(wrapperStyle, '--madeit-min-height-mobile', minHeightMobileVV);
  if (typeof maxWidth === 'number') setCssVar(wrapperStyle, '--madeit-max-width-desktop', `${maxWidth}${maxWidthUnit || 'px'}`);

  // row-gap: alleen desktop in deze versie
  if (typeof rowGap === 'number') setCssVar(wrapperStyle, '--madeit-row-gap-desktop', `${rowGap}${rowGapUnit || 'px'}`);

  // align-items + justify-content: alleen desktop
  if (typeof alignItems === 'string' && alignItems.length > 0) setCssVar(wrapperStyle, '--madeit-align-items-desktop', alignItems);
  if (typeof justifyContent === 'string' && justifyContent.length > 0) setCssVar(wrapperStyle, '--madeit-justify-content-desktop', justifyContent);

  // container margin als CSS-vars
  if (containerMargin && typeof containerMargin === 'object') {
    if (containerMargin.top !== undefined) setCssVar(wrapperStyle, '--madeit-container-margin-top-desktop', containerMargin.top);
    if (containerMargin.bottom !== undefined) setCssVar(wrapperStyle, '--madeit-container-margin-bottom-desktop', containerMargin.bottom);
  }
  if (containerMarginTablet && typeof containerMarginTablet === 'object') {
    setCssVar(wrapperStyle, '--madeit-container-margin-top-tablet', containerMarginTablet.top);
    setCssVar(wrapperStyle, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom);
  }
  if (containerMarginMobile && typeof containerMarginMobile === 'object') {
    setCssVar(wrapperStyle, '--madeit-container-margin-top-mobile', containerMarginMobile.top);
    setCssVar(wrapperStyle, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom);
  }
  if (containerPaddingOnRow !== true) {
    setSpacingVars(wrapperStyle, 'madeit-container-padding', containerPadding, 'desktop');
  }
  const hasStyleProps = Object.keys(wrapperStyle).length > 0;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: wrapperClass,
    style: hasStyleProps ? wrapperStyle : undefined
  });
  const HtmlTag = ALLOWED_HTML_TAGS.includes(attributes.htmlTag) ? attributes.htmlTag : 'div';
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
  const rowStyle = {};
  if (containerPaddingOnRow === true) {
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPadding, 'desktop');
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile');
  }
  const hasRowStyleProps = Object.keys(rowStyle).length > 0;
  const outerRowProps = hasRowStyleProps ? {
    ...baseRowProps,
    style: rowStyle
  } : baseRowProps;

  // In deze versie was de inner div altijd 'container', ongeacht de size-instelling.
  // De size werd pas later doorvertaald naar de inner div class.
  const innerDivClass = 'container';
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerDivClass
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...outerRowProps
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n')));
}

/***/ },

/***/ "./src/save-versions/saveVlegacy-boxed-inner-row.js"
/*!**********************************************************!*\
  !*** ./src/save-versions/saveVlegacy-boxed-inner-row.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveVlegacyBoxedInnerRow)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);

/**
 * saveVlegacy-boxed-inner-row.js — madeit-block-content
 *
 * Legacy boxed markup with extra .col wrapper and inner row without data attrs.
 */



const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
const ALLOWED_HTML_TAGS = ['div', 'section', 'article', 'main', 'header', 'footer'];
function toCssLength(value, unit = 'px') {
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}${unit || 'px'}`;
  if (typeof value !== 'string') return undefined;
  const t = value.trim();
  if (!t) return undefined;
  if (/^-?\d+(?:\.\d+)?$/.test(t)) return `${t}${unit || 'px'}`;
  if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(t)) return t;
  return undefined;
}
function setCssVar(s, k, v) {
  if (v === undefined || v === null) return;
  if (typeof v === 'number' && Number.isFinite(v)) {
    s[k] = `${v}px`;
    return;
  }
  if (typeof v !== 'string') return;
  const t = v.trim();
  if (t) s[k] = t;
}
function setSpacingVars(s, prefix, spacing, bp) {
  if (!spacing || typeof spacing !== 'object') return;
  const {
    top,
    right,
    bottom,
    left
  } = spacing;
  if (![top, right, bottom, left].some(v => v !== undefined && v !== null && String(v).trim())) return;
  const fb = v => v === undefined || v === null || !String(v).trim() ? '0px' : v;
  setCssVar(s, `--${prefix}-top-${bp}`, fb(top));
  setCssVar(s, `--${prefix}-right-${bp}`, fb(right));
  setCssVar(s, `--${prefix}-bottom-${bp}`, fb(bottom));
  setCssVar(s, `--${prefix}-left-${bp}`, fb(left));
}
function filterExtraClasses(className) {
  if (typeof className !== 'string' || !className.trim()) return '';
  return className.trim().split(/\s+/).filter(Boolean).filter(t => {
    if (t === 'wp-block-madeit-block-content') return false;
    if (t === 'container' || t === 'container-fluid') return false;
    if (t === FRONTEND_WRAPPER_CLASS) return false;
    if (t.startsWith('are-vertically-aligned-')) return false;
    if (t.startsWith('is-hidden-')) return false;
    return true;
  }).join(' ');
}
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
  const hasClassic = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const bgType = backgroundType || (hasClassic ? 'classic' : undefined);
  const bgClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const style = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : bgClass ? undefined : customContainerBackgroundColor
  };
  if (bgType === 'classic' && containerBackgroundImage?.url) {
    style.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (containerBackgroundPosition) style.backgroundPosition = containerBackgroundPosition;
    if (containerBackgroundRepeat) style.backgroundRepeat = containerBackgroundRepeat;
    if (containerBackgroundSize) style.backgroundSize = containerBackgroundSize;
  }
  const gradVal = typeof containerBackgroundGradient?.gradient === 'string' && containerBackgroundGradient.gradient.trim() ? containerBackgroundGradient.gradient : undefined;
  if (bgType === 'gradient' && gradVal) style.backgroundImage = gradVal;
  return style;
}
function saveVlegacyBoxedInnerRow(props) {
  const {
    attributes,
    className
  } = props;
  const containerBgClass = attributes.containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', attributes.containerBackgroundColor) : undefined;
  const rowTextClass = attributes.rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', attributes.rowTextColor) : undefined;
  const extraClass = filterExtraClasses([typeof attributes.className === 'string' ? attributes.className : '', typeof className === 'string' ? className : ''].filter(Boolean).join(' '));
  const {
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = attributes;
  const wrapperClass = classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content', 'container-fluid', FRONTEND_WRAPPER_CLASS, extraClass, {
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile,
    'has-text-color': !!rowTextClass,
    [rowTextClass]: !!rowTextClass,
    'has-background': !!containerBgClass,
    [containerBgClass]: !!containerBgClass
  });
  const bgStyle = buildBackgroundStyle(attributes);
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
    containerPaddingOnRow,
    columnsCount,
    htmlTag,
    rowMargin,
    rowPadding
  } = attributes;
  const ws = {
    ...bgStyle
  };
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') ws.overflow = overflow;
  const mhD = toCssLength(minHeight, minHeightUnit || 'px');
  const mhT = toCssLength(minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px');
  const mhM = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px');
  if (mhD) setCssVar(ws, '--madeit-min-height-desktop', mhD);
  if (mhT) setCssVar(ws, '--madeit-min-height-tablet', mhT);
  if (mhM) setCssVar(ws, '--madeit-min-height-mobile', mhM);
  if (typeof maxWidth === 'number') setCssVar(ws, '--madeit-max-width-desktop', `${maxWidth}${maxWidthUnit || 'px'}`);
  if (typeof maxWidthTablet === 'number') setCssVar(ws, '--madeit-max-width-tablet', `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`);
  if (typeof maxWidthMobile === 'number') setCssVar(ws, '--madeit-max-width-mobile', `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`);
  if (typeof rowGap === 'number') {
    setCssVar(ws, '--madeit-row-gap-desktop', `${rowGap}${rowGapUnit || 'px'}`);
    if (typeof rowGapTablet === 'number') setCssVar(ws, '--madeit-row-gap-tablet', `${rowGapTablet}${rowGapUnitTablet || 'px'}`);
    if (typeof rowGapMobile === 'number') setCssVar(ws, '--madeit-row-gap-mobile', `${rowGapMobile}${rowGapUnitMobile || 'px'}`);
  }
  const str = v => typeof v === 'string' && v.length > 0;
  if (str(flexDirection)) setCssVar(ws, '--madeit-flex-direction-desktop', flexDirection);
  if (str(flexDirectionTablet)) setCssVar(ws, '--madeit-flex-direction-tablet', flexDirectionTablet);
  if (str(flexDirectionMobile)) setCssVar(ws, '--madeit-flex-direction-mobile', flexDirectionMobile);
  if (str(alignItems)) setCssVar(ws, '--madeit-align-items-desktop', alignItems);
  if (str(alignItemsTablet)) setCssVar(ws, '--madeit-align-items-tablet', alignItemsTablet);
  if (str(alignItemsMobile)) setCssVar(ws, '--madeit-align-items-mobile', alignItemsMobile);
  if (str(justifyContent)) setCssVar(ws, '--madeit-justify-content-desktop', justifyContent);
  if (str(justifyContentTablet)) setCssVar(ws, '--madeit-justify-content-tablet', justifyContentTablet);
  if (str(justifyContentMobile)) setCssVar(ws, '--madeit-justify-content-mobile', justifyContentMobile);
  if (str(flexWrap)) setCssVar(ws, '--madeit-flex-wrap-desktop', flexWrap);
  if (str(flexWrapTablet)) setCssVar(ws, '--madeit-flex-wrap-tablet', flexWrapTablet);
  if (str(flexWrapMobile)) setCssVar(ws, '--madeit-flex-wrap-mobile', flexWrapMobile);
  if (containerMargin?.top !== undefined) setCssVar(ws, '--madeit-container-margin-top-desktop', containerMargin.top);
  if (containerMargin?.bottom !== undefined) setCssVar(ws, '--madeit-container-margin-bottom-desktop', containerMargin.bottom);
  if (containerMarginTablet?.top) setCssVar(ws, '--madeit-container-margin-top-tablet', containerMarginTablet.top);
  if (containerMarginTablet?.bottom) setCssVar(ws, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom);
  if (containerMarginMobile?.top) setCssVar(ws, '--madeit-container-margin-top-mobile', containerMarginMobile.top);
  if (containerMarginMobile?.bottom) setCssVar(ws, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom);
  if (containerPaddingOnRow !== true) {
    setSpacingVars(ws, 'madeit-container-padding', containerPadding, 'desktop');
    setSpacingVars(ws, 'madeit-container-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(ws, 'madeit-container-padding', containerPaddingMobile, 'mobile');
  }
  const rs = {};
  if (containerPaddingOnRow === true) {
    setSpacingVars(rs, 'madeit-container-row-padding', containerPadding, 'desktop');
    setSpacingVars(rs, 'madeit-container-row-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(rs, 'madeit-container-row-padding', containerPaddingMobile, 'mobile');
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: wrapperClass,
    style: Object.keys(ws).length > 0 ? ws : undefined
  });
  blockProps.className = wrapperClass;
  const HtmlTag = ALLOWED_HTML_TAGS.includes(htmlTag) ? htmlTag : 'div';
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const dirD = str(flexDirection) ? flexDirection : 'row';
  const dirT = str(flexDirectionTablet) ? flexDirectionTablet : undefined;
  const dirM = str(flexDirectionMobile) ? flexDirectionMobile : undefined;
  const rowProps = {
    className: `row madeit-container-row rows-${rowsCount}`,
    'data-madeit-dir': dirD,
    'data-madeit-dir-tablet': dirT,
    'data-madeit-dir-mobile': dirM,
    ...(Object.keys(rs).length > 0 ? {
      style: rs
    } : {})
  };
  const childStyle = {};
  if (rowMargin?.top !== undefined) childStyle.marginTop = rowMargin.top;
  if (rowMargin?.right !== undefined) childStyle.marginRight = rowMargin.right;
  if (rowMargin?.bottom !== undefined) childStyle.marginBottom = rowMargin.bottom;
  if (rowMargin?.left !== undefined) childStyle.marginLeft = rowMargin.left;
  if (rowPadding?.top !== undefined) childStyle.paddingTop = rowPadding.top;
  if (rowPadding?.right !== undefined) childStyle.paddingRight = rowPadding.right;
  if (rowPadding?.bottom !== undefined) childStyle.paddingBottom = rowPadding.bottom;
  if (rowPadding?.left !== undefined) childStyle.paddingLeft = rowPadding.left;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "container"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...rowProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "col"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "",
    style: childStyle
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `row madeit-container-row rows-${rowsCount}`
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n'))))));
}

/***/ },

/***/ "./src/save-versions/saveVlegacy-direct-row-inline-style.js"
/*!******************************************************************!*\
  !*** ./src/save-versions/saveVlegacy-direct-row-inline-style.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveVlegacyDirectRowInlineStyle)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);

/**
 * saveVlegacy-direct-row-inline-style.js — madeit-block-content
 *
 * Legacy markup:
 * - Direct .row child (no inner container)
 * - Inline margin styles on the wrapper (no CSS vars for margins)
 */



const ALLOWED_HTML_TAGS = ['div', 'section', 'article', 'main', 'header', 'footer'];
function parseInlineStyle(styleText) {
  if (typeof styleText !== 'string' || !styleText.trim()) return undefined;
  const style = {};
  const parts = styleText.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(':');
    if (idx === -1) continue;
    const rawProp = trimmed.slice(0, idx).trim();
    const rawVal = trimmed.slice(idx + 1).trim();
    if (!rawProp || !rawVal) continue;
    const prop = rawProp.startsWith('--') ? rawProp : rawProp.replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
    style[prop] = rawVal;
  }
  return Object.keys(style).length > 0 ? style : undefined;
}
function saveVlegacyDirectRowInlineStyle(props) {
  const {
    attributes,
    className
  } = props;
  const {
    wrapperClassName,
    wrapperStyle,
    directRowClassName,
    flexDirection,
    flexDirectionTablet,
    flexDirectionMobile,
    columnsCount,
    htmlTag
  } = attributes;
  const HtmlTag = ALLOWED_HTML_TAGS.includes(htmlTag) ? htmlTag : 'div';
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const rowClassName = typeof directRowClassName === 'string' && directRowClassName.trim() ? directRowClassName.trim() : `row madeit-container-row rows-${rowsCount}`;
  const wrapperClass = typeof wrapperClassName === 'string' && wrapperClassName.trim() ? wrapperClassName.trim() : classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content', 'container-fluid');
  const style = parseInlineStyle(wrapperStyle);
  const rowProps = {
    className: rowClassName,
    'data-madeit-dir': flexDirection || 'row',
    'data-madeit-dir-tablet': flexDirectionTablet || undefined,
    'data-madeit-dir-mobile': flexDirectionMobile || undefined
  };
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: wrapperClass,
    style
  });
  blockProps.className = wrapperClass;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...rowProps
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n'));
}

/***/ },

/***/ "./src/save-versions/saveVno-responsive-dir.js"
/*!*****************************************************!*\
  !*** ./src/save-versions/saveVno-responsive-dir.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveVnoResponsiveDir)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);

/**
 * saveVno-responsive-dir.js — madeit-block-content
 *
 * Legacy markup variant:
 * - Standard wrapper + inner container markup
 * - Row has only data-madeit-dir (no tablet/mobile data attrs)
 */



const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
const ALLOWED_HTML_TAGS = ['div', 'section', 'article', 'main', 'header', 'footer'];
function toCssLength(value, unit = 'px') {
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}${unit || 'px'}`;
  if (typeof value !== 'string') return undefined;
  const t = value.trim();
  if (!t) return undefined;
  if (/^-?\d+(?:\.\d+)?$/.test(t)) return `${t}${unit || 'px'}`;
  if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(t)) return t;
  return undefined;
}
function setCssVar(s, k, v) {
  if (v === undefined || v === null) return;
  if (typeof v === 'number' && Number.isFinite(v)) {
    s[k] = `${v}px`;
    return;
  }
  if (typeof v !== 'string') return;
  const t = v.trim();
  if (t) s[k] = t;
}
function setSpacingVars(s, prefix, spacing, bp) {
  if (!spacing || typeof spacing !== 'object') return;
  const {
    top,
    right,
    bottom,
    left
  } = spacing;
  if (![top, right, bottom, left].some(v => v !== undefined && v !== null && String(v).trim())) return;
  const fb = v => v === undefined || v === null || !String(v).trim() ? '0px' : v;
  setCssVar(s, `--${prefix}-top-${bp}`, fb(top));
  setCssVar(s, `--${prefix}-right-${bp}`, fb(right));
  setCssVar(s, `--${prefix}-bottom-${bp}`, fb(bottom));
  setCssVar(s, `--${prefix}-left-${bp}`, fb(left));
}
function filterExtraClasses(className) {
  if (typeof className !== 'string' || !className.trim()) return '';
  return className.trim().split(/\s+/).filter(Boolean).filter(t => {
    if (t === 'wp-block-madeit-block-content') return false;
    if (t === 'container' || t === 'container-fluid') return false;
    if (t === FRONTEND_WRAPPER_CLASS) return false;
    if (t.startsWith('are-vertically-aligned-')) return false;
    if (t.startsWith('is-hidden-')) return false;
    return true;
  }).join(' ');
}
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
  const hasClassic = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const bgType = backgroundType || (hasClassic ? 'classic' : undefined);
  const bgClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const style = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : bgClass ? undefined : customContainerBackgroundColor
  };
  if (bgType === 'classic' && containerBackgroundImage?.url) {
    style.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (containerBackgroundPosition) style.backgroundPosition = containerBackgroundPosition;
    if (containerBackgroundRepeat) style.backgroundRepeat = containerBackgroundRepeat;
    if (containerBackgroundSize) style.backgroundSize = containerBackgroundSize;
  }
  const gradVal = typeof containerBackgroundGradient?.gradient === 'string' && containerBackgroundGradient.gradient.trim() ? containerBackgroundGradient.gradient : undefined;
  if (bgType === 'gradient' && gradVal) style.backgroundImage = gradVal;
  return style;
}
function saveVnoResponsiveDir(props) {
  const {
    attributes,
    className
  } = props;
  const containerBgClass = attributes.containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', attributes.containerBackgroundColor) : undefined;
  const rowTextClass = attributes.rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', attributes.rowTextColor) : undefined;
  const rawSize = typeof attributes.size === 'string' ? attributes.size.trim() : '';
  const size = rawSize === 'container-fluid' ? 'container-fluid' : 'container';
  const innerDivClass = size === 'container-fluid' ? 'container-fluid' : 'container';
  const extraClass = filterExtraClasses([typeof attributes.className === 'string' ? attributes.className : '', typeof className === 'string' ? className : ''].filter(Boolean).join(' '));
  const {
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = attributes;
  const wrapperClass = classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content', 'container-fluid', FRONTEND_WRAPPER_CLASS, extraClass, {
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile,
    'has-text-color': !!rowTextClass,
    [rowTextClass]: !!rowTextClass,
    'has-background': !!containerBgClass,
    [containerBgClass]: !!containerBgClass
  });
  const bgStyle = buildBackgroundStyle(attributes);
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
    containerPaddingOnRow,
    columnsCount,
    htmlTag
  } = attributes;
  const ws = {
    ...bgStyle
  };
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') ws.overflow = overflow;
  const mhD = toCssLength(minHeight, minHeightUnit || 'px');
  const mhT = toCssLength(minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px');
  const mhM = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px');
  if (mhD) setCssVar(ws, '--madeit-min-height-desktop', mhD);
  if (mhT) setCssVar(ws, '--madeit-min-height-tablet', mhT);
  if (mhM) setCssVar(ws, '--madeit-min-height-mobile', mhM);
  if (typeof maxWidth === 'number') setCssVar(ws, '--madeit-max-width-desktop', `${maxWidth}${maxWidthUnit || 'px'}`);
  if (typeof maxWidthTablet === 'number') setCssVar(ws, '--madeit-max-width-tablet', `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`);
  if (typeof maxWidthMobile === 'number') setCssVar(ws, '--madeit-max-width-mobile', `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`);
  if (typeof rowGap === 'number') {
    setCssVar(ws, '--madeit-row-gap-desktop', `${rowGap}${rowGapUnit || 'px'}`);
    if (typeof rowGapTablet === 'number') setCssVar(ws, '--madeit-row-gap-tablet', `${rowGapTablet}${rowGapUnitTablet || 'px'}`);
    if (typeof rowGapMobile === 'number') setCssVar(ws, '--madeit-row-gap-mobile', `${rowGapMobile}${rowGapUnitMobile || 'px'}`);
  }
  const str = v => typeof v === 'string' && v.length > 0;
  if (str(flexDirection)) setCssVar(ws, '--madeit-flex-direction-desktop', flexDirection);
  if (str(flexDirectionTablet)) setCssVar(ws, '--madeit-flex-direction-tablet', flexDirectionTablet);
  if (str(flexDirectionMobile)) setCssVar(ws, '--madeit-flex-direction-mobile', flexDirectionMobile);
  if (str(alignItems)) setCssVar(ws, '--madeit-align-items-desktop', alignItems);
  if (str(alignItemsTablet)) setCssVar(ws, '--madeit-align-items-tablet', alignItemsTablet);
  if (str(alignItemsMobile)) setCssVar(ws, '--madeit-align-items-mobile', alignItemsMobile);
  if (str(justifyContent)) setCssVar(ws, '--madeit-justify-content-desktop', justifyContent);
  if (str(justifyContentTablet)) setCssVar(ws, '--madeit-justify-content-tablet', justifyContentTablet);
  if (str(justifyContentMobile)) setCssVar(ws, '--madeit-justify-content-mobile', justifyContentMobile);
  if (str(flexWrap)) setCssVar(ws, '--madeit-flex-wrap-desktop', flexWrap);
  if (str(flexWrapTablet)) setCssVar(ws, '--madeit-flex-wrap-tablet', flexWrapTablet);
  if (str(flexWrapMobile)) setCssVar(ws, '--madeit-flex-wrap-mobile', flexWrapMobile);
  if (containerMargin?.top !== undefined) setCssVar(ws, '--madeit-container-margin-top-desktop', containerMargin.top);
  if (containerMargin?.bottom !== undefined) setCssVar(ws, '--madeit-container-margin-bottom-desktop', containerMargin.bottom);
  if (containerMarginTablet?.top) setCssVar(ws, '--madeit-container-margin-top-tablet', containerMarginTablet.top);
  if (containerMarginTablet?.bottom) setCssVar(ws, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom);
  if (containerMarginMobile?.top) setCssVar(ws, '--madeit-container-margin-top-mobile', containerMarginMobile.top);
  if (containerMarginMobile?.bottom) setCssVar(ws, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom);
  if (containerPaddingOnRow !== true) {
    setSpacingVars(ws, 'madeit-container-padding', containerPadding, 'desktop');
    setSpacingVars(ws, 'madeit-container-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(ws, 'madeit-container-padding', containerPaddingMobile, 'mobile');
  }
  const rs = {};
  if (containerPaddingOnRow === true) {
    setSpacingVars(rs, 'madeit-container-row-padding', containerPadding, 'desktop');
    setSpacingVars(rs, 'madeit-container-row-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(rs, 'madeit-container-row-padding', containerPaddingMobile, 'mobile');
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: wrapperClass,
    style: Object.keys(ws).length > 0 ? ws : undefined
  });
  blockProps.className = wrapperClass;
  const HtmlTag = ALLOWED_HTML_TAGS.includes(htmlTag) ? htmlTag : 'div';
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const dirD = str(flexDirection) ? flexDirection : 'row';
  const rowProps = {
    className: `row madeit-container-row rows-${rowsCount}`,
    'data-madeit-dir': dirD,
    ...(Object.keys(rs).length > 0 ? {
      style: rs
    } : {})
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerDivClass
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...rowProps
  }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n')));
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
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);

/**
 * save.js — madeit-block-content
 *
 * OUTPUT STRUCTUUR (altijd):
 *
 *   <HtmlTag class="wp-block-madeit-block-content container-fluid madeit-block-content--frontend ...">
 *     <div class="container | container-fluid">   ← bepaald door `size`
 *       <div class="row madeit-container-row rows-N" data-madeit-dir="...">
 *         <InnerBlocks />
 *       </div>
 *     </div>
 *   </HtmlTag>
 *
 * De outer HtmlTag is ALTIJD container-fluid.
 * De inner div = container of container-fluid op basis van het `size` attribuut.
 */



const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
const ALLOWED_HTML_TAGS = ['div', 'section', 'article', 'main', 'header', 'footer'];
function toCssLength(value, unit = 'px') {
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}${unit || 'px'}`;
  if (typeof value !== 'string') return undefined;
  const t = value.trim();
  if (!t) return undefined;
  if (/^-?\d+(?:\.\d+)?$/.test(t)) return `${t}${unit || 'px'}`;
  if (/^-?\d+(?:\.\d+)?[a-z%]+$/i.test(t)) return t;
  return undefined;
}
function setCssVar(s, k, v) {
  if (v === undefined || v === null) return;
  if (typeof v === 'number' && Number.isFinite(v)) {
    s[k] = `${v}px`;
    return;
  }
  if (typeof v !== 'string') return;
  const t = v.trim();
  if (t) s[k] = t;
}
function setSpacingVars(s, prefix, spacing, bp) {
  if (!spacing || typeof spacing !== 'object') return;
  const {
    top,
    right,
    bottom,
    left
  } = spacing;
  if (![top, right, bottom, left].some(v => v !== undefined && v !== null && String(v).trim())) return;
  const fb = v => v === undefined || v === null || !String(v).trim() ? '0px' : v;
  setCssVar(s, `--${prefix}-top-${bp}`, fb(top));
  setCssVar(s, `--${prefix}-right-${bp}`, fb(right));
  setCssVar(s, `--${prefix}-bottom-${bp}`, fb(bottom));
  setCssVar(s, `--${prefix}-left-${bp}`, fb(left));
}
function filterExtraClasses(className) {
  if (typeof className !== 'string' || !className.trim()) return '';
  return className.trim().split(/\s+/).filter(Boolean).filter(t => {
    if (t === 'wp-block-madeit-block-content') return false;
    if (t === 'container' || t === 'container-fluid') return false;
    if (t === FRONTEND_WRAPPER_CLASS) return false;
    // has-text-color en has-background worden verderop via wrapperClass
    // opnieuw correct gezet op basis van kleur-attributen — hier NIET filteren.
    if (t.startsWith('are-vertically-aligned-')) return false;
    if (t.startsWith('is-hidden-')) return false;
    return true;
  }).join(' ');
}
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
  const hasClassic = !!(containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor);
  const bgType = backgroundType || (hasClassic ? 'classic' : undefined);
  const bgClass = containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', containerBackgroundColor) : undefined;
  const style = {
    backgroundColor: backgroundType === 'transparent' ? 'transparent' : bgClass ? undefined : customContainerBackgroundColor
  };
  if (bgType === 'classic' && containerBackgroundImage?.url) {
    style.backgroundImage = `url(${containerBackgroundImage.url})`;
    if (containerBackgroundPosition) style.backgroundPosition = containerBackgroundPosition;
    if (containerBackgroundRepeat) style.backgroundRepeat = containerBackgroundRepeat;
    if (containerBackgroundSize) style.backgroundSize = containerBackgroundSize;
  }
  const gradVal = typeof containerBackgroundGradient?.gradient === 'string' && containerBackgroundGradient.gradient.trim() ? containerBackgroundGradient.gradient : undefined;
  if (bgType === 'gradient' && gradVal) style.backgroundImage = gradVal;
  return style;
}
function save(props) {
  const {
    attributes,
    className
  } = props;

  // Kleur classes
  const containerBgClass = attributes.containerBackgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', attributes.containerBackgroundColor) : undefined;
  const rowTextClass = attributes.rowTextColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', attributes.rowTextColor) : undefined;

  // Size → inner div klasse (outer is altijd container-fluid)
  const rawSize = typeof attributes.size === 'string' ? attributes.size.trim() : '';
  const size = rawSize === 'container-fluid' ? 'container-fluid' : 'container';
  const innerDivClass = size === 'container-fluid' ? 'container-fluid' : 'container';

  // Outer wrapper klassen
  const extraClass = filterExtraClasses([typeof attributes.className === 'string' ? attributes.className : '', typeof className === 'string' ? className : ''].filter(Boolean).join(' '));
  const {
    hideOnDesktop,
    hideOnTablet,
    hideOnMobile
  } = attributes;
  const wrapperClass = classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content', 'container-fluid', FRONTEND_WRAPPER_CLASS, extraClass, {
    'is-hidden-desktop': !!hideOnDesktop,
    'is-hidden-tablet': !!hideOnTablet,
    'is-hidden-mobile': !!hideOnMobile,
    'has-text-color': !!rowTextClass,
    [rowTextClass]: !!rowTextClass,
    'has-background': !!containerBgClass,
    [containerBgClass]: !!containerBgClass
  });

  // Wrapper stijl
  const bgStyle = buildBackgroundStyle(attributes);
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
    containerPaddingOnRow,
    columnsCount,
    htmlTag
  } = attributes;
  const ws = {
    ...bgStyle
  };
  if (typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible') ws.overflow = overflow;
  const mhD = toCssLength(minHeight, minHeightUnit || 'px');
  const mhT = toCssLength(minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px');
  const mhM = toCssLength(minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px');
  if (mhD) setCssVar(ws, '--madeit-min-height-desktop', mhD);
  if (mhT) setCssVar(ws, '--madeit-min-height-tablet', mhT);
  if (mhM) setCssVar(ws, '--madeit-min-height-mobile', mhM);
  if (typeof maxWidth === 'number') setCssVar(ws, '--madeit-max-width-desktop', `${maxWidth}${maxWidthUnit || 'px'}`);
  if (typeof maxWidthTablet === 'number') setCssVar(ws, '--madeit-max-width-tablet', `${maxWidthTablet}${maxWidthUnitTablet || 'px'}`);
  if (typeof maxWidthMobile === 'number') setCssVar(ws, '--madeit-max-width-mobile', `${maxWidthMobile}${maxWidthUnitMobile || 'px'}`);
  if (typeof rowGap === 'number') {
    setCssVar(ws, '--madeit-row-gap-desktop', `${rowGap}${rowGapUnit || 'px'}`);
    if (typeof rowGapTablet === 'number') setCssVar(ws, '--madeit-row-gap-tablet', `${rowGapTablet}${rowGapUnitTablet || 'px'}`);
    if (typeof rowGapMobile === 'number') setCssVar(ws, '--madeit-row-gap-mobile', `${rowGapMobile}${rowGapUnitMobile || 'px'}`);
  }
  const str = v => typeof v === 'string' && v.length > 0;
  if (str(flexDirection)) setCssVar(ws, '--madeit-flex-direction-desktop', flexDirection);
  if (str(flexDirectionTablet)) setCssVar(ws, '--madeit-flex-direction-tablet', flexDirectionTablet);
  if (str(flexDirectionMobile)) setCssVar(ws, '--madeit-flex-direction-mobile', flexDirectionMobile);
  if (str(alignItems)) setCssVar(ws, '--madeit-align-items-desktop', alignItems);
  if (str(alignItemsTablet)) setCssVar(ws, '--madeit-align-items-tablet', alignItemsTablet);
  if (str(alignItemsMobile)) setCssVar(ws, '--madeit-align-items-mobile', alignItemsMobile);
  if (str(justifyContent)) setCssVar(ws, '--madeit-justify-content-desktop', justifyContent);
  if (str(justifyContentTablet)) setCssVar(ws, '--madeit-justify-content-tablet', justifyContentTablet);
  if (str(justifyContentMobile)) setCssVar(ws, '--madeit-justify-content-mobile', justifyContentMobile);
  if (str(flexWrap)) setCssVar(ws, '--madeit-flex-wrap-desktop', flexWrap);
  if (str(flexWrapTablet)) setCssVar(ws, '--madeit-flex-wrap-tablet', flexWrapTablet);
  if (str(flexWrapMobile)) setCssVar(ws, '--madeit-flex-wrap-mobile', flexWrapMobile);
  if (containerMargin?.top !== undefined) setCssVar(ws, '--madeit-container-margin-top-desktop', containerMargin.top);
  if (containerMargin?.bottom !== undefined) setCssVar(ws, '--madeit-container-margin-bottom-desktop', containerMargin.bottom);
  if (containerMarginTablet?.top) setCssVar(ws, '--madeit-container-margin-top-tablet', containerMarginTablet.top);
  if (containerMarginTablet?.bottom) setCssVar(ws, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom);
  if (containerMarginMobile?.top) setCssVar(ws, '--madeit-container-margin-top-mobile', containerMarginMobile.top);
  if (containerMarginMobile?.bottom) setCssVar(ws, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom);
  if (containerPaddingOnRow !== true) {
    setSpacingVars(ws, 'madeit-container-padding', containerPadding, 'desktop');
    setSpacingVars(ws, 'madeit-container-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(ws, 'madeit-container-padding', containerPaddingMobile, 'mobile');
  }

  // Row stijl
  const rs = {};
  if (containerPaddingOnRow === true) {
    setSpacingVars(rs, 'madeit-container-row-padding', containerPadding, 'desktop');
    setSpacingVars(rs, 'madeit-container-row-padding', containerPaddingTablet, 'tablet');
    setSpacingVars(rs, 'madeit-container-row-padding', containerPaddingMobile, 'mobile');
  }

  // Block props — forceer onze className zodat Gutenberg geen stale klassen injecteert
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: wrapperClass,
    style: Object.keys(ws).length > 0 ? ws : undefined
  });
  blockProps.className = wrapperClass;
  const HtmlTag = ALLOWED_HTML_TAGS.includes(htmlTag) ? htmlTag : 'div';
  const rowsCount = Number.isFinite(columnsCount) ? columnsCount : 0;
  const dirD = str(flexDirection) ? flexDirection : 'row';
  const dirT = str(flexDirectionTablet) ? flexDirectionTablet : undefined;
  const dirM = str(flexDirectionMobile) ? flexDirectionMobile : undefined;
  const rowProps = {
    className: `row madeit-container-row rows-${rowsCount}`,
    'data-madeit-dir': dirD,
    'data-madeit-dir-tablet': dirT,
    'data-madeit-dir-mobile': dirM,
    ...(Object.keys(rs).length > 0 ? {
      style: rs
    } : {})
  };

  // Standaard: container of container-fluid inner div
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTag, {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerDivClass
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...rowProps
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
 * utils.js — madeit-block-content
 *
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
 * variations.js — madeit-block-content
 *
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
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"madeit/block-content","version":"2.0.0","title":"Made I.T. Container","category":"madeit","icon":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" xmlns:serif=\\"http://www.serif.com/\\" width=\\"30\\" height=\\"30\\" viewBox=\\"0 0 135 135\\" version=\\"1.1\\" xml:space=\\"preserve\\" style=\\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\\"><g transform=\\"matrix(1,0,0,1,-282.404386,-214.957044)\\"><g id=\\"SVGRepo_iconCarrier\\" transform=\\"matrix(7.458333,0,0,7.458333,260.029386,192.582044)\\"><path id=\\"形状\\" d=\\"M3,5C3,3.895 3.895,3 5,3L19,3C20.105,3 21,3.895 21,5L21,19C21,20.105 20.105,21 19,21L5,21C3.895,21 3,20.105 3,19L3,5ZM14,5L10,5L10,19L14,19L14,5ZM16,5L19,5L19,19L16,19L16,5ZM8,19L8,5L5,5L5,19L8,19Z\\" style=\\"fill:rgb(71,106,138);\\"/></g></g></svg>","description":"A container block with multiple options for styling and layout.","keywords":["content","columns","madeit"],"supports":{"html":false},"textdomain":"content-container","editorScript":"file:./build/index.js","editorStyle":"file:./build/index.css","style":"file:./build/style-index.css","attributes":{"wrapperClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content","attribute":"class"},"wrapperStyle":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content","attribute":"style"},"directRowClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content > .row","attribute":"class"},"boxedInnerContainerClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content > .row > .col > .container","attribute":"class"},"boxedInnerRowClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content > .row > .col > .container > .row","attribute":"class"},"verticalAlignment":{"type":"string"},"backgroundType":{"type":"string"},"containerBackgroundColor":{"type":"string"},"customContainerBackgroundColor":{"type":"string"},"containerBackgroundImage":{"type":"object"},"containerBackgroundPosition":{"type":"string"},"containerBackgroundRepeat":{"type":"string"},"containerBackgroundSize":{"type":"string"},"containerBackgroundGradient":{"type":"object"},"size":{"type":"string","default":"container"},"contentWidth":{"type":"string"},"containerMargin":{"type":"object"},"containerMarginTablet":{"type":"object"},"containerMarginMobile":{"type":"object"},"marginUnit":{"type":"string","default":"px"},"containerPadding":{"type":"object"},"containerPaddingTablet":{"type":"object"},"containerPaddingMobile":{"type":"object"},"containerPaddingOnRow":{"type":"boolean"},"paddingUnit":{"type":"string","default":"px"},"rowBackgroundColor":{"type":"string"},"customRowBackgroundColor":{"type":"string"},"rowTextColor":{"type":"string"},"customRowTextColor":{"type":"string"},"rowMargin":{"type":"object"},"rowPadding":{"type":"object"},"overflow":{"type":"string"},"htmlTag":{"type":"string","default":"div"},"flexDirection":{"type":"string"},"flexDirectionTablet":{"type":"string"},"flexDirectionMobile":{"type":"string"},"alignItems":{"type":"string"},"alignItemsTablet":{"type":"string"},"alignItemsMobile":{"type":"string"},"justifyContent":{"type":"string"},"justifyContentTablet":{"type":"string"},"justifyContentMobile":{"type":"string"},"minHeight":{"type":"number"},"minHeightUnit":{"type":"string","default":"px"},"minHeightTablet":{"type":"number"},"minHeightUnitTablet":{"type":"string","default":"px"},"minHeightMobile":{"type":"number"},"minHeightUnitMobile":{"type":"string","default":"px"},"maxWidth":{"type":"number"},"maxWidthUnit":{"type":"string","default":"px"},"maxWidthTablet":{"type":"number"},"maxWidthUnitTablet":{"type":"string","default":"px"},"maxWidthMobile":{"type":"number"},"maxWidthUnitMobile":{"type":"string","default":"px"},"rowGap":{"type":"number"},"rowGapUnit":{"type":"string","default":"px"},"rowGapTablet":{"type":"number"},"rowGapUnitTablet":{"type":"string","default":"px"},"rowGapMobile":{"type":"number"},"rowGapUnitMobile":{"type":"string","default":"px"},"columnsCount":{"type":"number"},"flexWrap":{"type":"string"},"flexWrapTablet":{"type":"string"},"flexWrapMobile":{"type":"string"},"hideOnDesktop":{"type":"boolean"},"hideOnTablet":{"type":"boolean"},"hideOnMobile":{"type":"boolean"},"madeitHasUserEdits":{"type":"boolean","default":false},"className":{"type":"string"}}}');

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
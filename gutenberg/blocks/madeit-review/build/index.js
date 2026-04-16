/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../shared/BreakpointSwitcher.js"
/*!******************************************!*\
  !*** ../../shared/BreakpointSwitcher.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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

/***/ "../../shared/ControlHeader.js"
/*!*************************************!*\
  !*** ../../shared/ControlHeader.js ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BreakpointSwitcher */ "../../shared/BreakpointSwitcher.js");




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

/***/ "../../shared/ResponsiveBoxControl.js"
/*!********************************************!*\
  !*** ../../shared/ResponsiveBoxControl.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
/* harmony import */ var _ControlHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ControlHeader */ "../../shared/ControlHeader.js");




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

/***/ "../../shared/index.js"
/*!*****************************!*\
  !*** ../../shared/index.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BreakpointSwitcher: () => (/* reexport safe */ _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   ControlHeader: () => (/* reexport safe */ _ControlHeader__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   ResponsiveBoxControl: () => (/* reexport safe */ _ResponsiveBoxControl__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _BreakpointSwitcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BreakpointSwitcher */ "../../shared/BreakpointSwitcher.js");
/* harmony import */ var _ControlHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ControlHeader */ "../../shared/ControlHeader.js");
/* harmony import */ var _ResponsiveBoxControl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ResponsiveBoxControl */ "../../shared/ResponsiveBoxControl.js");




/***/ },

/***/ "./src/edit.js"
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/server-side-render */ "@wordpress/server-side-render");
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared */ "../../shared/index.js");








const DIMENSION_UNITS = [{
  value: 'px',
  label: 'px',
  default: 0
}, {
  value: 'em',
  label: 'em',
  default: 0
}, {
  value: 'rem',
  label: 'rem',
  default: 0
}, {
  value: 'vh',
  label: 'vh',
  default: 0
}, {
  value: '%',
  label: '%',
  default: 0
}];

// Layout images: keep as a single mapping so you can swap to SVGs later.
// NOTE: these are lightweight inline SVG placeholders (no visible names in UI).
const LAYOUT_IMAGES = {
  standaard: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="22" width="64" height="64" rx="32" fill="#E5E7EB"/><rect x="96" y="28" width="126" height="10" rx="5" fill="#D1D5DB"/><rect x="96" y="48" width="98" height="10" rx="5" fill="#D1D5DB"/><rect x="18" y="100" width="204" height="10" rx="5" fill="#D1D5DB"/></svg>'),
  klassiek: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="18" width="204" height="14" rx="7" fill="#D1D5DB"/><rect x="18" y="44" width="204" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="62" width="170" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="80" width="190" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="104" width="120" height="10" rx="5" fill="#D1D5DB"/></svg>'),
  'inhoud | afbeelding | bio': 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="22" width="140" height="12" rx="6" fill="#D1D5DB"/><rect x="18" y="44" width="140" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="62" width="120" height="10" rx="5" fill="#E5E7EB"/><rect x="172" y="22" width="50" height="50" rx="10" fill="#E5E7EB"/><rect x="172" y="84" width="50" height="10" rx="5" fill="#D1D5DB"/></svg>'),
  'afbeelding | inhoud': 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="22" width="70" height="96" rx="12" fill="#E5E7EB"/><rect x="104" y="26" width="118" height="12" rx="6" fill="#D1D5DB"/><rect x="104" y="48" width="102" height="10" rx="5" fill="#E5E7EB"/><rect x="104" y="66" width="110" height="10" rx="5" fill="#E5E7EB"/><rect x="104" y="84" width="86" height="10" rx="5" fill="#E5E7EB"/><rect x="104" y="108" width="74" height="10" rx="5" fill="#D1D5DB"/></svg>'),
  'inhoud | afbeelding': 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="26" width="140" height="12" rx="6" fill="#D1D5DB"/><rect x="18" y="48" width="122" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="66" width="134" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="84" width="98" height="10" rx="5" fill="#E5E7EB"/><rect x="172" y="26" width="50" height="50" rx="10" fill="#E5E7EB"/></svg>'),
  'icoon titel inline': 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="22" width="18" height="18" rx="9" fill="#D1D5DB"/><rect x="44" y="24" width="178" height="14" rx="7" fill="#D1D5DB"/><rect x="18" y="52" width="204" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="70" width="190" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="100" width="120" height="10" rx="5" fill="#D1D5DB"/></svg>')
};
function Edit({
  attributes,
  setAttributes
}) {
  const {
    layout = 'standaard',
    slidesDesktop = 3,
    slidesTablet = 2,
    slidesMobile = 1,
    showArrows = true,
    paginationType = 'bullets',
    transitionDuration = 500,
    autoplay = true,
    autoplaySpeed = 5000,
    infiniteLoop = false,
    pauseOnInteraction = true,
    textColor = '',
    containerBackgroundColor = '',
    showImage = true,
    width = '48px',
    height = '48px',
    objectFit = 'cover',
    borderRadius_leftTop = '50%',
    borderRadius_rightTop = '50%',
    borderRadius_rightBottom = '50%',
    borderRadius_leftBottom = '50%',
    arrowSize = '24px',
    arrowColor = '',
    paginationSize = '8px',
    paginationColor = '',
    categoryIds = []
  } = attributes;
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)('layout');
  const [activeSlidesPerViewBreakpoint, setActiveSlidesPerViewBreakpoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)('desktop');
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    style: {
      '--madeit-review-text-color': textColor || undefined,
      '--madeit-review-bg-color': containerBackgroundColor || undefined,
      '--madeit-review-arrow-size': arrowSize || undefined,
      '--madeit-review-arrow-color': arrowColor || undefined,
      '--madeit-review-pagination-size': paginationSize || undefined,
      '--madeit-review-pagination-color': paginationColor || undefined
    }
  });
  const reviewCategories = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useSelect)(select => select('core')?.getEntityRecords?.('taxonomy', 'review_category', {
    per_page: 100,
    orderby: 'name',
    order: 'asc'
  }), []);
  const valueMap = {
    desktop: slidesDesktop,
    tablet: slidesTablet,
    mobile: slidesMobile
  };
  const resetSlidesPerView = () => {
    setAttributes({
      slidesDesktop: 3,
      slidesTablet: 2,
      slidesMobile: 1
    });
  };
  const DISABLED_LAYOUTS = ['inhoud | afbeelding | bio', 'afbeelding | inhoud', 'inhoud | afbeelding', 'icoon titel inline'];
  const reviewLayoutSelector = ({
    selectedLayout,
    onChange
  }) => {
    const layouts = ['standaard', 'klassiek', 'inhoud | afbeelding | bio', 'afbeelding | inhoud', 'inhoud | afbeelding', 'icoon titel inline'];
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "layout-selector"
    }, layouts.map(layoutOption => {
      const isDisabled = DISABLED_LAYOUTS.includes(layoutOption);
      const isActive = selectedLayout === layoutOption;
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        key: layoutOption,
        className: 'layout-box ' + layoutOption.replace(/\s/g, '-').toLowerCase() + (isActive ? ' active' : '') + (isDisabled ? ' is-disabled' : ''),
        onClick: () => {
          if (!isDisabled) {
            onChange(layoutOption);
          }
        },
        role: "button",
        "aria-disabled": isDisabled,
        "aria-label": layoutOption
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: "screen-reader-text"
      }, layoutOption), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'review review-' + layoutOption.replace(/\s/g, '-').toLowerCase()
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "card"
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "card-body"
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "inner-content"
      }, LAYOUT_IMAGES[layoutOption] ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
        src: LAYOUT_IMAGES[layoutOption],
        alt: layoutOption,
        className: "review-image"
      }) : null)))), isDisabled ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "layout-overlay"
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Binnenkort beschikbaar', 'madeit-review'))) : null);
    }));
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-evenly'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    isPrimary: activeTab === 'layout',
    onClick: () => setActiveTab('layout'),
    style: {
      marginRight: '5px'
    }
  }, "Layout"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    isPrimary: activeTab === 'style',
    onClick: () => setActiveTab('style'),
    style: {
      marginRight: '5px'
    }
  }, "Style"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    isPrimary: activeTab === 'advanced',
    onClick: () => setActiveTab('advanced')
  }, "Advanced")), activeTab === 'layout' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('reviews', 'madeit-review'),
    initialOpen: true
  }, reviewLayoutSelector({
    selectedLayout: layout,
    onChange: val => setAttributes({
      layout: val
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      borderBottom: '1px solid #eee',
      margin: '20px 0'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_7__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Slides per view'),
    breakpoint: activeSlidesPerViewBreakpoint,
    onBreakpointChange: setActiveSlidesPerViewBreakpoint
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control-rangeRow"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
    value: valueMap[activeSlidesPerViewBreakpoint],
    onChange: val => {
      if (activeSlidesPerViewBreakpoint === 'desktop') setAttributes({
        slidesDesktop: val
      });else if (activeSlidesPerViewBreakpoint === 'tablet') setAttributes({
        slidesTablet: val
      });else if (activeSlidesPerViewBreakpoint === 'mobile') setAttributes({
        slidesMobile: val
      });
    },
    min: 1,
    max: 10,
    step: 0.5
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    className: "madeit-control-rangeRow__reset",
    icon: "undo",
    variant: "tertiary",
    onClick: resetSlidesPerView,
    showTooltip: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reset slides per view')
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('extra opties', 'madeit-review'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Navigatie', 'madeit-review'),
    checked: showArrows,
    onChange: val => setAttributes({
      showArrows: val
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pagination', 'madeit-review'),
    value: paginationType,
    options: [{
      label: 'Geen',
      value: 'none'
    }, {
      label: 'Stippen',
      value: 'bullets'
    }, {
      label: 'Nummers',
      value: 'fraction'
    }, {
      label: 'Progress bar',
      value: 'progressbar'
    }],
    onChange: val => setAttributes({
      paginationType: val
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_7__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Transition duur (ms)')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
    value: transitionDuration,
    onChange: val => setAttributes({
      transitionDuration: val
    }),
    min: 100,
    max: 5000,
    step: 100
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      borderBottom: '1px solid #eee',
      margin: '20px 0'
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Autoplay', 'madeit-review'),
    checked: autoplay,
    onChange: val => setAttributes({
      autoplay: val
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Autoplay snelheid (ms)', 'madeit-review'),
    value: autoplaySpeed,
    onChange: val => setAttributes({
      autoplaySpeed: val
    }),
    min: 100,
    max: 10000,
    step: 100
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Oneindige loop', 'madeit-review'),
    checked: infiniteLoop,
    onChange: val => setAttributes({
      infiniteLoop: val
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pauzeren bij interactie', 'madeit-review'),
    checked: pauseOnInteraction,
    onChange: val => setAttributes({
      pauseOnInteraction: val
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      borderBottom: '1px solid #eee',
      margin: '20px 0'
    }
  }), Array.isArray(reviewCategories) ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    style: {
      margin: '0 0 8px'
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Categorieën', 'madeit-review')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    style: {
      margin: '0 0 12px',
      opacity: 0.8
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Laat alles uitgevinkt om alle categorieën te tonen.', 'madeit-review')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'grid',
      gap: '8px',
      maxHeight: '220px',
      overflow: 'auto'
    }
  }, (reviewCategories || []).map(term => {
    var _term$name;
    const termId = term?.id;
    if (!termId) return null;
    const checked = Array.isArray(categoryIds) ? categoryIds.includes(termId) : false;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.CheckboxControl, {
      key: termId,
      label: (_term$name = term?.name) !== null && _term$name !== void 0 ? _term$name : String(termId),
      checked: checked,
      onChange: isChecked => {
        const current = Array.isArray(categoryIds) ? categoryIds : [];
        const next = isChecked ? Array.from(new Set([...current, termId])) : current.filter(id => id !== termId);
        setAttributes({
          categoryIds: next
        });
      }
    });
  }))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Categorieën laden…', 'madeit-review')))), activeTab === 'style' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Stijl', 'madeit-review'),
    initialOpen: true
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.PanelColorSettings, {
    initialOpen: true,
    colorSettings: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Tekst kleur'),
      value: textColor,
      onChange: value => setAttributes({
        textColor: value
      })
    }]
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.PanelColorSettings, {
    initialOpen: true,
    colorSettings: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Achtergrond kleur'),
      value: containerBackgroundColor,
      onChange: value => setAttributes({
        containerBackgroundColor: value
      })
    }]
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Afbeelding', 'madeit-review'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Toon afbeelding', 'madeit-review'),
    checked: showImage,
    onChange: val => setAttributes({
      showImage: val
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "afbeelding-settings",
    style: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalUnitControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Breedte', 'madeit-review'),
    value: width,
    onChange: val => setAttributes({
      width: val
    }),
    units: DIMENSION_UNITS
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalUnitControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hoogte', 'madeit-review'),
    value: height,
    onChange: val => setAttributes({
      height: val
    }),
    units: DIMENSION_UNITS
  })), height && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      marginTop: '20px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Object-fit', 'madeit-review'),
    value: objectFit,
    onChange: val => setAttributes({
      objectFit: val
    }),
    options: [{
      label: 'cover',
      value: 'cover'
    }, {
      label: 'contain',
      value: 'contain'
    }, {
      label: 'fill',
      value: 'fill'
    }, {
      label: 'none',
      value: 'none'
    }, {
      label: 'scale-down',
      value: 'scale-down'
    }]
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      marginTop: '20px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_shared__WEBPACK_IMPORTED_MODULE_7__.ControlHeader, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Border radius')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalUnitControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Links boven', 'madeit-review'),
    value: borderRadius_leftTop,
    onChange: val => setAttributes({
      borderRadius_leftTop: val
    }),
    units: DIMENSION_UNITS
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalUnitControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Rechts boven', 'madeit-review'),
    value: borderRadius_rightTop,
    onChange: val => setAttributes({
      borderRadius_rightTop: val
    }),
    units: DIMENSION_UNITS
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalUnitControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Rechts onder', 'madeit-review'),
    value: borderRadius_rightBottom,
    onChange: val => setAttributes({
      borderRadius_rightBottom: val
    }),
    units: DIMENSION_UNITS
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalUnitControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Links onder', 'madeit-review'),
    value: borderRadius_leftBottom,
    onChange: val => setAttributes({
      borderRadius_leftBottom: val
    }),
    units: DIMENSION_UNITS
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Navigation', 'madeit-review'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalUnitControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pijl grootte', 'madeit-review'),
    value: arrowSize,
    onChange: val => setAttributes({
      arrowSize: val
    }),
    units: DIMENSION_UNITS
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.PanelColorSettings, {
    initialOpen: true,
    colorSettings: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pijl kleur'),
      value: arrowColor,
      onChange: value => setAttributes({
        arrowColor: value
      })
    }]
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalUnitControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pagination grootte', 'madeit-review'),
    value: paginationSize,
    onChange: val => setAttributes({
      paginationSize: val
    }),
    units: DIMENSION_UNITS
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "madeit-control"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.PanelColorSettings, {
    initialOpen: true,
    colorSettings: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pagination kleur'),
      value: paginationColor,
      onChange: value => setAttributes({
        paginationColor: value
      })
    }]
  })))), activeTab === 'advanced' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Geavanceerd', 'madeit-review'),
    initialOpen: true
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Binnenkort beschikbaar', 'madeit-review'))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)((_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_3___default()), {
    block: "madeit/reviews",
    attributes: attributes
  })));
}

/***/ },

/***/ "./src/index.js"
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./src/editor.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./src/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Editor-only styles.
 */


/**
 * Internal dependencies
 */




/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ },

/***/ "./src/save.js"
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
function save() {
  return null;
}

/***/ },

/***/ "./src/editor.scss"
/*!*************************!*\
  !*** ./src/editor.scss ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/style.scss"
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "@wordpress/server-side-render"
/*!******************************************!*\
  !*** external ["wp","serverSideRender"] ***!
  \******************************************/
(module) {

module.exports = window["wp"]["serverSideRender"];

/***/ },

/***/ "./src/block.json"
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"madeit/reviews","title":"Madeit reviews","category":"madeit","keywords":["review","reviews","recensie","recensies","testimonial","klantreview"],"icon":"star-filled","description":"Haal reviews op van een externe bron en toon deze in een mooie layout.","status":"nieuw","version":"1.0.0","madeit":{"changelog":{"1.0.0":["Eerste versie van de reviews block"]}},"example":{},"attributes":{"layout":{"type":"string","default":"standaard"},"slidesDesktop":{"type":"number","default":3},"slidesTablet":{"type":"number","default":2},"slidesMobile":{"type":"number","default":1},"showArrows":{"type":"boolean","default":true},"paginationType":{"type":"string","default":"bullets"},"transitionDuration":{"type":"number","default":500},"autoplay":{"type":"boolean","default":true},"autoplaySpeed":{"type":"number","default":5000},"infiniteLoop":{"type":"boolean","default":false},"pauseOnInteraction":{"type":"boolean","default":true},"textColor":{"type":"string","default":""},"containerBackgroundColor":{"type":"string","default":""},"showImage":{"type":"boolean","default":true},"width":{"type":"string","default":"48px"},"height":{"type":"string","default":"48px"},"objectFit":{"type":"string","default":"cover"},"borderRadius_leftTop":{"type":"string","default":"50%"},"borderRadius_rightTop":{"type":"string","default":"50%"},"borderRadius_rightBottom":{"type":"string","default":"50%"},"borderRadius_leftBottom":{"type":"string","default":"50%"},"arrowSize":{"type":"string","default":"24px"},"arrowColor":{"type":"string","default":""},"paginationSize":{"type":"string","default":"8px"},"paginationColor":{"type":"string","default":""},"categoryIds":{"type":"array","items":{"type":"number"},"default":[]}},"supports":{"html":false},"textdomain":"madeit-review","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","render":"file:./render.php"}');

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
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkmadeit_review"] = globalThis["webpackChunkmadeit_review"] || [];
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
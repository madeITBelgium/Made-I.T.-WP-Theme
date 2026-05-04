/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../content-container/src/utils.js"
/*!*****************************************!*\
  !*** ../content-container/src/utils.js ***!
  \*****************************************/
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
/* harmony import */ var memize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! memize */ "../content-container/node_modules/memize/dist/index.js");
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

/***/ "./src/edit.js"
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _content_container_src_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../content-container/src/utils */ "../content-container/src/utils.js");

/**
 * External dependencies
 */



/**
 * WordPress dependencies
 */







/**
 * Internal dependencies
 */

const stripBackgroundClasses = (className = '') => className.split(/\s+/).filter(Boolean).filter(token => token !== 'has-background' && !/^has-.*-background-color$/.test(token)).join(' ');
const inferWidthFromClassNames = (...classNameCandidates) => {
  const className = classNameCandidates.filter(value => typeof value === 'string' && value.trim().length > 0).join(' ');
  if (!className) {
    return undefined;
  }
  const breakpointMatch = className.match(/\bcol-(?:lg|md|sm|xl|xxl)-(\d{1,2})\b/);
  if (breakpointMatch) {
    return Number(breakpointMatch[1]);
  }
  if (/\bcol-12\b/.test(className)) {
    return 12;
  }
  return undefined;
};
function ColumnEdit(props) {
  const {
    attributes,
    updateAlignment,
    updateWidth,
    hasChildBlocks,
    backgroundColor,
    setBackgroundColor,
    textColor,
    setTextColor,
    className,
    setAttributes
  } = props;
  const outerClassName = stripBackgroundClasses(className || '');
  const {
    verticalAlignment,
    hasCustomVerticalAlignment,
    width,
    margin,
    padding,
    maxContainerSize
  } = attributes;
  const inferredWidth = inferWidthFromClassNames(className, attributes.wrapperClassName);
  const effectiveWidth = Number.isFinite(width) ? width : inferredWidth;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.useEffect)(() => {
    if (Number.isFinite(width) || !Number.isFinite(inferredWidth)) {
      return;
    }
    setAttributes({
      width: inferredWidth
    });
  }, [width, inferredWidth, setAttributes]);
  const widthRounded = Math.round(effectiveWidth);
  const setPadding = padding => {
    setAttributes({
      padding
    });
  };
  const setMargin = margin => {
    setAttributes({
      margin
    });
  };
  const resetAll = () => {
    setPadding(undefined);
    setMargin(undefined);
  };
  const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(outerClassName, classnames__WEBPACK_IMPORTED_MODULE_1___default()('block-core-columns', {
    [`is-vertically-aligned-${verticalAlignment}`]: !!hasCustomVerticalAlignment && !!verticalAlignment,
    [`col-12`]: true,
    [`col-lg-${widthRounded}`]: Number.isFinite(widthRounded),
    [`is-width-${widthRounded}`]: Number.isFinite(widthRounded),
    ['keep-max-container-size']: !!maxContainerSize
  }));
  const fallbackTextColor = '#FFFFFF';
  const fallbackBackgroundColor = '#000000';
  const outerStyle = {
    color: textColor?.color
  };
  const innerStyle = {
    backgroundColor: backgroundColor?.color,
    height: '100%'
  };
  if (margin !== undefined && margin.top !== undefined) {
    outerStyle.marginTop = margin.top;
  }
  if (margin !== undefined && margin.bottom !== undefined) {
    outerStyle.marginBottom = margin.bottom;
  }
  if (padding !== undefined && padding.top !== undefined) {
    innerStyle.paddingTop = padding.top;
  }
  if (padding !== undefined && padding.bottom !== undefined) {
    innerStyle.paddingBottom = padding.bottom;
  }
  if (padding !== undefined && padding.left !== undefined) {
    innerStyle.paddingLeft = padding.left;
  }
  if (padding !== undefined && padding.right !== undefined) {
    innerStyle.paddingRight = padding.right;
  }
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)({
    className: classes,
    style: outerStyle
  });
  const sanitizedBlockProps = {
    ...blockProps,
    className: stripBackgroundClasses(blockProps.className)
  };
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useInnerBlocksProps)({
    style: innerStyle
  }, {
    templateLock: false,
    renderAppender: hasChildBlocks ? undefined : () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.ButtonBlockAppender, null)
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...sanitizedBlockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockVerticalAlignmentToolbar, {
    onChange: updateAlignment,
    value: verticalAlignment
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Column Settings')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Percentage width'),
    value: effectiveWidth || '',
    onChange: updateWidth,
    min: 1,
    max: 12,
    required: true,
    allowReset: true
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.PanelColorSettings, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Column Color Settings'),
    initialOpen: false,
    colorSettings: [{
      value: backgroundColor.color,
      onChange: value => setBackgroundColor(value),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Background Color')
    }, {
      value: textColor.color,
      onChange: value => setTextColor(value),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Text Color')
    }]
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.ContrastChecker, {
    textColor: textColor.color,
    backgroundColor: backgroundColor.color,
    fallbackTextColor,
    fallbackBackgroundColor
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalToolsPanel, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Dimensions'),
    resetAll: resetAll
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalToolsPanelItem, {
    hasValue: () => !!padding,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Padding'),
    onDeselect: () => setPadding(undefined)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalBoxControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Padding'),
    onChange: setPadding,
    values: padding,
    allowReset: false
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalToolsPanelItem, {
    hasValue: () => !!margin,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Margin'),
    onDeselect: () => setMargin(undefined)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalBoxControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Margin'),
    onChange: setMargin,
    values: margin,
    allowReset: false,
    sides: ['bottom', 'top']
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...innerBlocksProps
  }));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_6__.compose)((0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.withColors)('backgroundColor', 'textColor'), (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.withSelect)((select, ownProps) => {
  const {
    clientId
  } = ownProps;
  const {
    getBlockOrder
  } = select('core/block-editor');
  return {
    hasChildBlocks: getBlockOrder(clientId).length > 0
  };
}), (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.withDispatch)((dispatch, ownProps, registry) => {
  return {
    updateAlignment(verticalAlignment) {
      const {
        clientId,
        setAttributes
      } = ownProps;
      const {
        updateBlockAttributes
      } = dispatch('core/block-editor');
      const {
        getBlockRootClientId
      } = registry.select('core/block-editor');

      // Update own alignment.
      if (verticalAlignment) {
        setAttributes({
          verticalAlignment,
          hasCustomVerticalAlignment: true
        });
      } else {
        setAttributes({
          verticalAlignment,
          hasCustomVerticalAlignment: false
        });
      }

      // Reset Parent Columns Block
      const rootClientId = getBlockRootClientId(clientId);
      updateBlockAttributes(rootClientId, {
        verticalAlignment: null
      });
    },
    updateWidth(width) {
      const {
        clientId
      } = ownProps;
      const {
        updateBlockAttributes
      } = dispatch('core/block-editor');
      const {
        getBlockRootClientId,
        getBlocks
      } = registry.select('core/block-editor');

      // Constrain or expand siblings to account for gain or loss of
      // total columns area.
      const columns = getBlocks(getBlockRootClientId(clientId));
      const adjacentColumns = (0,_content_container_src_utils__WEBPACK_IMPORTED_MODULE_9__.getAdjacentBlocks)(columns, clientId);

      // The occupied width is calculated as the sum of the new width
      // and the total width of blocks _not_ in the adjacent set.
      const occupiedWidth = width + (0,_content_container_src_utils__WEBPACK_IMPORTED_MODULE_9__.getTotalColumnsWidth)((0,lodash__WEBPACK_IMPORTED_MODULE_2__.difference)(columns, [(0,lodash__WEBPACK_IMPORTED_MODULE_2__.find)(columns, {
        clientId
      }), ...adjacentColumns]));

      // Compute _all_ next column widths, in case the updated column
      // is in the middle of a set of columns which don't yet have
      // any explicit widths assigned (include updates to those not
      // part of the adjacent blocks).
      const nextColumnWidths = {
        ...(0,_content_container_src_utils__WEBPACK_IMPORTED_MODULE_9__.getColumnWidths)(columns, columns.length),
        [clientId]: (0,_content_container_src_utils__WEBPACK_IMPORTED_MODULE_9__.toWidthPrecision)(width),
        ...(0,_content_container_src_utils__WEBPACK_IMPORTED_MODULE_9__.getRedistributedColumnWidths)(adjacentColumns, 12 - occupiedWidth, columns.length)
      };
      (0,lodash__WEBPACK_IMPORTED_MODULE_2__.forEach)(nextColumnWidths, (nextColumnWidth, columnClientId) => {
        updateBlockAttributes(columnClientId, {
          width: nextColumnWidth
        });
      });
    }
  };
}))(ColumnEdit));

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

/**
 * WordPress dependencies
 */
const {
  Path,
  SVG
} = wp.components;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  fill: "none",
  d: "M0 0h24v24H0V0z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  d: "M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z"
})));

/***/ },

/***/ "./src/index.js"
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./save */ "./src/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../block.json */ "./block.json");
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./icon */ "./src/icon.js");
/* harmony import */ var _save_versions_save_20260407__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./save-versions/save_20260407 */ "./src/save-versions/save_20260407.js");
/* harmony import */ var _save_versions_save_20260422__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./save-versions/save_20260422 */ "./src/save-versions/save_20260422.js");
/* harmony import */ var _save_versions_save_20260422_color_legacy_duplicates__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./save-versions/save_20260422_color_legacy_duplicates */ "./src/save-versions/save_20260422_color_legacy_duplicates.js");

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
 * Internal dependencies
 */





// Oude save versies importeren



const stripBackgroundClasses = (className = '') => className.split(/\s+/).filter(Boolean).filter(token => token !== 'has-background' && !/^has-.*-background-color$/.test(token)).join(' ');
const inferWidthFromClassNames = (...classNameCandidates) => {
  const className = classNameCandidates.filter(value => typeof value === 'string' && value.trim().length > 0).join(' ');
  if (!className) {
    return undefined;
  }
  const breakpointMatch = className.match(/\bcol-(?:lg|md|sm|xl|xxl)-(\d{1,2})\b/);
  if (breakpointMatch) {
    return Number(breakpointMatch[1]);
  }
  if (/\bcol-12\b/.test(className)) {
    return 12;
  }
  return undefined;
};

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_7__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_7__,
  icon: _icon__WEBPACK_IMPORTED_MODULE_8__["default"],
  getEditWrapperProps(attributes) {
    const {
      width,
      wrapperClassName
    } = attributes;
    const effectiveWidth = Number.isFinite(width) ? width : inferWidthFromClassNames(wrapperClassName);
    if (Number.isFinite(effectiveWidth)) {
      const widthRounded = Math.round(effectiveWidth);
      const widthPercent = effectiveWidth * (100 / 12) + '%';
      return {
        className: `is-width-${widthRounded}`,
        style: {
          flexBasis: widthPercent
          // maxWidth: widthPercent,
        }
      };
    }
  },
  // The "edit" property must be a valid function.
  edit: _edit__WEBPACK_IMPORTED_MODULE_5__["default"],
  // The "save" property must be  valid function.
  save: _save__WEBPACK_IMPORTED_MODULE_6__["default"],
  deprecated: [{
    // Deprecated (2026-04-22): early color support could serialize
    // duplicated/conflicting background classes on the inner wrapper.
    // Keep as-is so existing posts validate.
    save: _save_versions_save_20260422_color_legacy_duplicates__WEBPACK_IMPORTED_MODULE_11__["default"]
  }, {
    // Deprecated (2026-04-22): previous save did not output
    // background/text colors to the frontend.
    save: _save_versions_save_20260422__WEBPACK_IMPORTED_MODULE_10__["default"]
  }, {
    // Deprecated (width default compatibility): before `width`
    // defaulted to 12, legacy content could be saved without
    // `col-lg-12`. Keep raw wrapper classes to match that markup.
    attributes: {
      wrapperClassName: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-madeit-block-content-column',
        attribute: 'class'
      },
      legacyWrapperStyle: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-madeit-block-content-column',
        attribute: 'style'
      },
      innerWrapperClassName: {
        type: 'string',
        source: 'attribute',
        selector: '.madeit-content-column__inner',
        attribute: 'class'
      },
      legacyInnerStyle: {
        type: 'string',
        source: 'attribute',
        selector: '.madeit-content-column__inner',
        attribute: 'style'
      },
      verticalAlignment: {
        type: 'string'
      },
      width: {
        type: 'number',
        min: 0,
        max: 12
      },
      margin: {
        type: 'object'
      },
      padding: {
        type: 'object'
      },
      maxContainerSize: {
        type: 'boolean'
      }
    },
    save: function (props) {
      const {
        wrapperClassName,
        legacyWrapperStyle,
        innerWrapperClassName,
        legacyInnerStyle,
        margin,
        padding
      } = props.attributes;
      const rawOuterClassName = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0 ? wrapperClassName.trim() : 'wp-block-madeit-block-content-column col-12';
      const outerStyle = {};
      if (margin?.top !== undefined) outerStyle.marginTop = margin.top;
      if (margin?.bottom !== undefined) outerStyle.marginBottom = margin.bottom;
      if (legacyWrapperStyle && Object.keys(outerStyle).length === 0) {
        const readPx = key => {
          const re = new RegExp(`${key}\\s*:\\s*([0-9.]+)px`, 'i');
          const m = String(legacyWrapperStyle).match(re);
          return m ? `${m[1]}px` : undefined;
        };
        const mt = readPx('margin-top');
        const mb = readPx('margin-bottom');
        if (mt !== undefined) outerStyle.marginTop = mt;
        if (mb !== undefined) outerStyle.marginBottom = mb;
      }
      const rawInnerClassName = typeof innerWrapperClassName === 'string' && innerWrapperClassName.trim().length > 0 ? innerWrapperClassName.trim() : 'madeit-content-column__inner';
      const innerStyle = {};
      if (padding?.top !== undefined) innerStyle.paddingTop = padding.top;
      if (padding?.bottom !== undefined) innerStyle.paddingBottom = padding.bottom;
      if (padding?.left !== undefined) innerStyle.paddingLeft = padding.left;
      if (padding?.right !== undefined) innerStyle.paddingRight = padding.right;
      if (legacyInnerStyle) {
        const readCssValue = key => {
          const re = new RegExp(`(?:^|;)\\s*${key}\\s*:\\s*([^;]+)`, 'i');
          const m = String(legacyInnerStyle).match(re);
          return m ? String(m[1]).trim() : undefined;
        };
        const legacyColor = readCssValue('color');
        const legacyBackgroundColor = readCssValue('background-color');
        if (legacyColor !== undefined && innerStyle.color === undefined) {
          innerStyle.color = legacyColor;
        }
        if (legacyBackgroundColor !== undefined && innerStyle.backgroundColor === undefined) {
          innerStyle.backgroundColor = legacyBackgroundColor;
        }
      }
      const hasPaddingFromAttributes = innerStyle.paddingTop !== undefined || innerStyle.paddingBottom !== undefined || innerStyle.paddingLeft !== undefined || innerStyle.paddingRight !== undefined;
      if (legacyInnerStyle && !hasPaddingFromAttributes) {
        const readPx = key => {
          const re = new RegExp(`${key}\\s*:\\s*([0-9.]+)px`, 'i');
          const m = String(legacyInnerStyle).match(re);
          return m ? `${m[1]}px` : undefined;
        };
        const pt = readPx('padding-top');
        const pb = readPx('padding-bottom');
        const pl = readPx('padding-left');
        const pr = readPx('padding-right');
        if (pt !== undefined) innerStyle.paddingTop = pt;
        if (pb !== undefined) innerStyle.paddingBottom = pb;
        if (pl !== undefined) innerStyle.paddingLeft = pl;
        if (pr !== undefined) innerStyle.paddingRight = pr;
      }
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: rawOuterClassName,
        style: outerStyle
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: rawInnerClassName,
        style: innerStyle
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)));
    }
  }, {
    // Deprecated (legacy whitespace + raw wrapper classes): some older
    // saved blocks did not include `col-lg-12` when width was 12, and
    // kept an empty line inside the inner wrapper when no inner blocks
    // were present. Keep this to avoid block validation errors.
    attributes: {
      wrapperClassName: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-madeit-block-content-column',
        attribute: 'class'
      },
      legacyWrapperStyle: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-madeit-block-content-column',
        attribute: 'style'
      },
      innerWrapperClassName: {
        type: 'string',
        source: 'attribute',
        selector: '.madeit-content-column__inner',
        attribute: 'class'
      },
      legacyInnerStyle: {
        type: 'string',
        source: 'attribute',
        selector: '.madeit-content-column__inner',
        attribute: 'style'
      },
      verticalAlignment: {
        type: 'string'
      },
      width: {
        type: 'number',
        min: 0,
        max: 12
      },
      margin: {
        type: 'object'
      },
      padding: {
        type: 'object'
      },
      maxContainerSize: {
        type: 'boolean'
      }
    },
    save: function (props) {
      const {
        wrapperClassName,
        legacyWrapperStyle,
        innerWrapperClassName,
        legacyInnerStyle,
        margin,
        padding
      } = props.attributes;
      const rawOuterClassName = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0 ? wrapperClassName.trim() : 'wp-block-madeit-block-content-column col-12';
      const outerStyle = {};
      if (margin?.top !== undefined) outerStyle.marginTop = margin.top;
      if (margin?.bottom !== undefined) outerStyle.marginBottom = margin.bottom;
      if (legacyWrapperStyle && Object.keys(outerStyle).length === 0) {
        const readPx = key => {
          const re = new RegExp(`${key}\\s*:\\s*([0-9.]+)px`, 'i');
          const m = String(legacyWrapperStyle).match(re);
          return m ? `${m[1]}px` : undefined;
        };
        const mt = readPx('margin-top');
        const mb = readPx('margin-bottom');
        if (mt !== undefined) outerStyle.marginTop = mt;
        if (mb !== undefined) outerStyle.marginBottom = mb;
      }
      const rawInnerClassName = typeof innerWrapperClassName === 'string' && innerWrapperClassName.trim().length > 0 ? innerWrapperClassName.trim() : 'madeit-content-column__inner';
      const innerStyle = {};
      if (padding?.top !== undefined) innerStyle.paddingTop = padding.top;
      if (padding?.bottom !== undefined) innerStyle.paddingBottom = padding.bottom;
      if (padding?.left !== undefined) innerStyle.paddingLeft = padding.left;
      if (padding?.right !== undefined) innerStyle.paddingRight = padding.right;
      if (legacyInnerStyle) {
        const readCssValue = key => {
          const re = new RegExp(`(?:^|;)\\s*${key}\\s*:\\s*([^;]+)`, 'i');
          const m = String(legacyInnerStyle).match(re);
          return m ? String(m[1]).trim() : undefined;
        };
        const legacyColor = readCssValue('color');
        const legacyBackgroundColor = readCssValue('background-color');
        if (legacyColor !== undefined && innerStyle.color === undefined) {
          innerStyle.color = legacyColor;
        }
        if (legacyBackgroundColor !== undefined && innerStyle.backgroundColor === undefined) {
          innerStyle.backgroundColor = legacyBackgroundColor;
        }
      }
      const hasPaddingFromAttributes = innerStyle.paddingTop !== undefined || innerStyle.paddingBottom !== undefined || innerStyle.paddingLeft !== undefined || innerStyle.paddingRight !== undefined;
      if (legacyInnerStyle && !hasPaddingFromAttributes) {
        const readPx = key => {
          const re = new RegExp(`${key}\\s*:\\s*([0-9.]+)px`, 'i');
          const m = String(legacyInnerStyle).match(re);
          return m ? `${m[1]}px` : undefined;
        };
        const pt = readPx('padding-top');
        const pb = readPx('padding-bottom');
        const pl = readPx('padding-left');
        const pr = readPx('padding-right');
        if (pt !== undefined) innerStyle.paddingTop = pt;
        if (pb !== undefined) innerStyle.paddingBottom = pb;
        if (pl !== undefined) innerStyle.paddingLeft = pl;
        if (pr !== undefined) innerStyle.paddingRight = pr;
      }
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: rawOuterClassName,
        style: outerStyle
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: rawInnerClassName,
        style: innerStyle
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)));
    }
  }, {
    // Deprecated (previous markup): padding was saved on the OUTER wrapper,
    // while background classes were stored on the INNER wrapper.
    //
    // This must use the raw `innerWrapperClassName` to preserve legacy
    // duplicated tokens and exact class strings from post content.
    attributes: {
      wrapperClassName: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-madeit-block-content-column',
        attribute: 'class'
      },
      // Legacy HTML stored padding/margins on the wrapper `style`.
      legacyWrapperStyle: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-madeit-block-content-column',
        attribute: 'style'
      },
      innerWrapperClassName: {
        type: 'string',
        source: 'attribute',
        selector: '.madeit-content-column__inner',
        attribute: 'class'
      },
      verticalAlignment: {
        type: 'string'
      },
      hasCustomVerticalAlignment: {
        type: 'boolean'
      },
      width: {
        type: 'number',
        min: 0,
        max: 12
      },
      backgroundColor: {
        type: 'string'
      },
      customBackgroundColor: {
        type: 'string'
      },
      textColor: {
        type: 'string'
      },
      customTextColor: {
        type: 'string'
      },
      margin: {
        type: 'object'
      },
      padding: {
        type: 'object'
      },
      maxContainerSize: {
        type: 'boolean'
      }
    },
    save: function (props) {
      const {
        wrapperClassName,
        legacyWrapperStyle,
        verticalAlignment,
        width,
        margin,
        padding,
        maxContainerSize,
        innerWrapperClassName
      } = props.attributes;

      // Prefer the raw class string sourced from saved HTML so we don't
      // accidentally normalize, reorder, or dedupe legacy tokens.
      const rawOuterClassName = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0 ? wrapperClassName.trim() : typeof props?.className === 'string' && props.className.trim().length > 0 ? props.className.trim() : classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content-column', {
        'col-12': true,
        [`col-lg-${Math.round(width)}`]: Number.isFinite(width),
        [`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
        'keep-max-container-size': maxContainerSize
      });
      const style = {};
      if (margin?.top !== undefined) style.marginTop = margin.top;
      if (margin?.bottom !== undefined) style.marginBottom = margin.bottom;
      if (padding?.top !== undefined) style.paddingTop = padding.top;
      if (padding?.bottom !== undefined) style.paddingBottom = padding.bottom;
      if (padding?.left !== undefined) style.paddingLeft = padding.left;
      if (padding?.right !== undefined) style.paddingRight = padding.right;

      // If this legacy block stored spacing only on the wrapper style
      // attribute (without JSON attributes), fall back to parsing it.
      if (legacyWrapperStyle && Object.keys(style).length === 0) {
        const readPx = key => {
          const re = new RegExp(`${key}\\s*:\\s*([0-9.]+)px`, 'i');
          const m = String(legacyWrapperStyle).match(re);
          return m ? `${m[1]}px` : undefined;
        };
        const pt = readPx('padding-top');
        const pb = readPx('padding-bottom');
        const pl = readPx('padding-left');
        const pr = readPx('padding-right');
        const mt = readPx('margin-top');
        const mb = readPx('margin-bottom');
        if (pt !== undefined) style.paddingTop = pt;
        if (pb !== undefined) style.paddingBottom = pb;
        if (pl !== undefined) style.paddingLeft = pl;
        if (pr !== undefined) style.paddingRight = pr;
        if (mt !== undefined) style.marginTop = mt;
        if (mb !== undefined) style.marginBottom = mb;
      }
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: rawOuterClassName,
        style: style
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: innerWrapperClassName || 'madeit-content-column__inner'
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n'));
    }
  }, {
    // Deprecated (ultra-legacy markup): keep the exact wrapper class
    // string from stored HTML (including duplicates / legacy grid
    // classes) when there is NO inner wrapper and NO `col-md-*`.
    // This prevents block validation errors on very old content.
    attributes: {
      wrapperClassName: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-madeit-block-content-column',
        attribute: 'class'
      },
      verticalAlignment: {
        type: 'string'
      },
      hasCustomVerticalAlignment: {
        type: 'boolean'
      },
      margin: {
        type: 'object'
      },
      padding: {
        type: 'object'
      }
    },
    save: function (props) {
      const {
        wrapperClassName,
        margin,
        padding
      } = props.attributes;
      const rawWrapperClassName = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0 ? wrapperClassName.trim() : typeof props?.className === 'string' && props.className.trim().length > 0 ? props.className.trim() : '';

      // Only target the legacy variants we know can be matched safely.
      if (rawWrapperClassName === '' || /\bcol-md-\d+\b/.test(rawWrapperClassName)) {
        return (0,_save__WEBPACK_IMPORTED_MODULE_6__["default"])(props);
      }
      const style = {};
      if (margin !== undefined && margin.top !== undefined) {
        style.marginTop = margin.top;
      }
      if (margin !== undefined && margin.bottom !== undefined) {
        style.marginBottom = margin.bottom;
      }
      if (padding !== undefined && padding.top !== undefined) {
        style.paddingTop = padding.top;
      }
      if (padding !== undefined && padding.bottom !== undefined) {
        style.paddingBottom = padding.bottom;
      }
      if (padding !== undefined && padding.left !== undefined) {
        style.paddingLeft = padding.left;
      }
      if (padding !== undefined && padding.right !== undefined) {
        style.paddingRight = padding.right;
      }

      // Do NOT use useBlockProps.save here, as it may normalize
      // className and break exact legacy matching.
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: rawWrapperClassName,
        style: style
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n');
    }
  }, {
    // Deprecated (previous current markup): same as the modern markup but
    // WITHOUT `col-md-*` classes. Keep to avoid block validation errors.
    save: function (props) {
      const {
        verticalAlignment,
        width,
        customBackgroundColor,
        backgroundColor,
        customTextColor,
        textColor,
        margin,
        padding,
        maxContainerSize,
        innerWrapperClassName
      } = props.attributes;
      const {
        className
      } = props;
      const defaultBlockClassName = 'wp-block-madeit-block-content-column';
      const extraClasses = stripBackgroundClasses(className || '').split(/\s+/).filter(Boolean).filter(token => token !== defaultBlockClassName).filter(token => token !== 'has-text-color').filter(token => token !== 'keep-max-container-size').filter(token => token !== 'col-12').filter(token => !/^col-(?:sm|md|lg|xl|xxl)-\d+$/.test(token)).filter(token => !/^is-vertically-aligned-/.test(token)).join(' ');
      const backgroundColorClass = backgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', backgroundColor) : undefined;
      const textColorClass = textColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', textColor) : undefined;
      const widthRounded = Math.round(width);
      const wrapperClasses = [defaultBlockClassName, verticalAlignment ? `is-vertically-aligned-${verticalAlignment}` : null, 'col-12', widthRounded ? `col-lg-${widthRounded}` : null, extraClasses || null, maxContainerSize ? 'keep-max-container-size' : null, textColorClass ? 'has-text-color' : null, textColorClass || null].filter(Boolean).join(' ');
      const hasBackground = !!(backgroundColorClass || customBackgroundColor);
      const hasInnerWrapper = !!innerWrapperClassName;
      const innerClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()('madeit-content-column__inner', {
        'has-background': backgroundColorClass,
        [backgroundColorClass]: backgroundColorClass
      });
      const style = {
        color: textColorClass ? undefined : customTextColor
      };
      const innerStyle = {
        backgroundColor: backgroundColorClass ? undefined : customBackgroundColor
      };
      if (margin !== undefined && margin.top !== undefined) {
        style.marginTop = margin.top;
      }
      if (margin !== undefined && margin.bottom !== undefined) {
        style.marginBottom = margin.bottom;
      }
      if (padding !== undefined && padding.top !== undefined) {
        style.paddingTop = padding.top;
      }
      if (padding !== undefined && padding.bottom !== undefined) {
        style.paddingBottom = padding.bottom;
      }
      if (padding !== undefined && padding.left !== undefined) {
        style.paddingLeft = padding.left;
      }
      if (padding !== undefined && padding.right !== undefined) {
        style.paddingRight = padding.right;
      }
      const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
        className: wrapperClasses,
        style
      });
      if (!hasBackground) {
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          ...blockProps
        }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n');
      }
      if (hasBackground && !hasInnerWrapper) {
        const legacyWrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(wrapperClasses, {
          'has-background': !!backgroundColorClass,
          [backgroundColorClass]: backgroundColorClass
        });
        const legacyStyle = {
          ...style,
          backgroundColor: backgroundColorClass ? undefined : customBackgroundColor
        };
        const legacyBlockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
          className: legacyWrapperClasses,
          style: legacyStyle
        });
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          ...legacyBlockProps
        }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n');
      }
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: innerClasses,
        style: innerStyle
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)));
    }
  }, {
    // Deprecated (legacy markup): background classes were saved on the
    // outer wrapper and there was no `.madeit-content-column__inner`.
    // This must match older post content to avoid requiring recovery.
    save: function (props) {
      const {
        verticalAlignment,
        width,
        customBackgroundColor,
        backgroundColor,
        customTextColor,
        textColor,
        margin,
        padding,
        maxContainerSize
      } = props.attributes;
      const {
        className
      } = props;
      const defaultBlockClassName = 'wp-block-madeit-block-content-column';
      const outerClassName = stripBackgroundClasses(className || '').split(/\s+/).filter(Boolean).filter(token => token !== defaultBlockClassName).join(' ');
      const backgroundColorClass = backgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', backgroundColor) : undefined;
      const textColorClass = textColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', textColor) : undefined;
      const widthRounded = Math.round(width);
      let wrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(defaultBlockClassName, outerClassName, {
        [`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
        'col-12': true,
        [`col-lg-${widthRounded}`]: widthRounded,
        'keep-max-container-size': !!maxContainerSize
      });
      wrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(wrapperClasses, {
        'has-text-color': textColorClass,
        [textColorClass]: textColorClass,
        'has-background': !!(backgroundColorClass || customBackgroundColor),
        [backgroundColorClass]: backgroundColorClass
      });
      const style = {
        backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
        color: textColorClass ? undefined : customTextColor
      };
      if (margin !== undefined && margin.top !== undefined) {
        style.marginTop = margin.top;
      }
      if (margin !== undefined && margin.bottom !== undefined) {
        style.marginBottom = margin.bottom;
      }
      if (padding !== undefined && padding.top !== undefined) {
        style.paddingTop = padding.top;
      }
      if (padding !== undefined && padding.bottom !== undefined) {
        style.paddingBottom = padding.bottom;
      }
      if (padding !== undefined && padding.left !== undefined) {
        style.paddingLeft = padding.left;
      }
      if (padding !== undefined && padding.right !== undefined) {
        style.paddingRight = padding.right;
      }
      const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
        className: wrapperClasses,
        style
      });
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...blockProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n');
    }
  }, {
    // Deprecated (legacy markup): columns were saved without the
    // `.madeit-content-column__inner` wrapper.
    // Needed so copy/pasting older content does not require recovery.
    save: function (props) {
      const {
        verticalAlignment,
        width,
        customBackgroundColor,
        backgroundColor,
        customTextColor,
        textColor,
        margin,
        padding,
        maxContainerSize
      } = props.attributes;
      const {
        className
      } = props;
      const defaultBlockClassName = 'wp-block-madeit-block-content-column';
      const outerClassName = (className || '').split(/\s+/).filter(Boolean).filter(token => token !== 'has-background' && !/^has-.*-background-color$/.test(token)).join(' ');
      const textColorClass = textColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', textColor) : undefined;
      const backgroundColorClass = backgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', backgroundColor) : undefined;
      const widthRounded = Math.round(width);
      let wrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(defaultBlockClassName, outerClassName, {
        [`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
        'col-12': true,
        [`col-lg-${widthRounded}`]: widthRounded,
        'keep-max-container-size': !!maxContainerSize
      });
      wrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(wrapperClasses, {
        'has-text-color': textColorClass,
        [textColorClass]: textColorClass
      });
      const style = {
        backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
        color: textColorClass ? undefined : customTextColor
      };
      if (margin !== undefined && margin.top !== undefined) {
        style.marginTop = margin.top;
      }
      if (margin !== undefined && margin.bottom !== undefined) {
        style.marginBottom = margin.bottom;
      }
      if (padding !== undefined && padding.top !== undefined) {
        style.paddingTop = padding.top;
      }
      if (padding !== undefined && padding.bottom !== undefined) {
        style.paddingBottom = padding.bottom;
      }
      if (padding !== undefined && padding.left !== undefined) {
        style.paddingLeft = padding.left;
      }
      if (padding !== undefined && padding.right !== undefined) {
        style.paddingRight = padding.right;
      }
      const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
        className: wrapperClasses,
        style
      });
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...blockProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null), '\n\n');
    }
  }, {
    save: _save_versions_save_20260407__WEBPACK_IMPORTED_MODULE_9__["default"]
  }, {
    supports: {
      inserter: false,
      reusable: false,
      html: false
    },
    attributes: {
      verticalAlignment: {
        type: "string"
      },
      width: {
        "type": "number",
        "min": 0,
        "max": 12
      },
      backgroundColor: {
        type: 'string'
      },
      customBackgroundColor: {
        type: 'string'
      },
      textColor: {
        type: 'string'
      },
      customTextColor: {
        type: 'string'
      },
      marginBottom: {
        type: 'number',
        default: 0
      },
      marginTop: {
        type: 'number',
        default: 0
      },
      paddingTop: {
        type: 'number',
        default: 0
      },
      paddingBottom: {
        type: 'number',
        default: 0
      },
      paddingLeft: {
        type: 'number',
        default: 0
      },
      paddingRight: {
        type: 'number',
        default: 0
      }
    },
    migrate(attributes, innerBlocks) {
      return [{
        padding: {
          top: attributes.paddingTop !== null && attributes.paddingTop !== undefined ? attributes.paddingTop + 'px' : undefined,
          bottom: attributes.paddingBottom !== null && attributes.paddingBottom !== undefined ? attributes.paddingBottom + 'px' : undefined,
          left: attributes.paddingLeft !== null && attributes.paddingLeft !== undefined ? attributes.paddingLeft + 'px' : undefined,
          right: attributes.paddingRight !== null && attributes.paddingRight !== undefined ? attributes.paddingRight + 'px' : undefined
        },
        margin: {
          top: attributes.marginTop !== null && attributes.marginTop !== undefined ? attributes.marginTop + 'px' : undefined,
          bottom: attributes.marginBottom !== null && attributes.marginBottom !== undefined ? attributes.marginBottom + 'px' : undefined,
          left: undefined,
          right: undefined
        },
        verticalAlignment: attributes.verticalAlignment,
        width: attributes.width,
        backgroundColor: attributes.backgroundColor,
        customBackgroundColor: attributes.customBackgroundColor,
        textColor: attributes.textColor,
        customTextColor: attributes.customTextColor
      }, innerBlocks];
    },
    save: function (props) {
      const {
        verticalAlignment,
        width,
        customBackgroundColor,
        backgroundColor,
        customTextColor,
        textColor,
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight
      } = props.attributes;
      const {
        className
      } = props;
      const backgroundColorClass = backgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', backgroundColor) : undefined;
      const textColorClass = textColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', textColor) : undefined;
      var widthRounded = Math.round(width);
      var wrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, {
        [`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
        [`col-12`]: true,
        [`col-lg-${widthRounded}`]: widthRounded
      });
      wrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(wrapperClasses, {
        'has-text-color': textColorClass,
        'has-background': backgroundColorClass,
        [backgroundColorClass]: backgroundColorClass,
        [textColorClass]: textColorClass
      });
      var style = {
        backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
        color: textColorClass ? undefined : customTextColor
      };
      if (marginTop > 0) {
        style.marginTop = marginTop + 28 + 'px';
      }
      if (marginBottom > 0) {
        style.marginBottom = marginBottom + 28 + 'px';
      }
      if (paddingTop > 0) {
        style.paddingTop = paddingTop + 'px';
      }
      if (paddingBottom > 0) {
        style.paddingBottom = paddingBottom + 'px';
      }
      if (paddingLeft > 0) {
        style.paddingLeft = paddingLeft + 'px';
      }
      if (paddingRight > 0) {
        style.paddingRight = paddingRight + 'px';
      }
      const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
        className: wrapperClasses,
        style: style
      });
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...blockProps
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null));
    }
  }, {
    supports: {
      inserter: false,
      reusable: false,
      html: false
    },
    attributes: {
      verticalAlignment: {
        type: "string"
      },
      width: {
        "type": "number",
        "min": 0,
        "max": 12
      },
      backgroundColor: {
        type: 'string'
      },
      customBackgroundColor: {
        type: 'string'
      },
      textColor: {
        type: 'string'
      },
      customTextColor: {
        type: 'string'
      },
      marginBottom: {
        type: 'number',
        default: 0
      },
      marginTop: {
        type: 'number',
        default: 0
      },
      paddingTop: {
        type: 'number',
        default: 0
      },
      paddingBottom: {
        type: 'number',
        default: 0
      },
      paddingLeft: {
        type: 'number',
        default: 0
      },
      paddingRight: {
        type: 'number',
        default: 0
      }
    },
    save: function ({
      attributes
    }) {
      const {
        verticalAlignment,
        width
      } = attributes;
      var wrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()('col', {
        [`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
        [`col-md-${width}`]: width
      });
      let style;
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: wrapperClasses,
        style: style
      }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null));
    }
  }]
});

// Ensure background color classes never stick to the outer wrapper.
if (typeof window !== 'undefined' && window.wp?.hooks?.addFilter) {
  window.wp.hooks.addFilter('blocks.getSaveContent.extraProps', 'madeit/block-content-column/strip-bg-save-props', (extraProps, blockType, attributes) => {
    if (blockType?.name !== _block_json__WEBPACK_IMPORTED_MODULE_7__.name) {
      return extraProps;
    }

    // WordPress core may inject `has-background` + `has-*-background-color`
    // classes on the outer wrapper via block supports. For the CURRENT
    // version of this block we explicitly want background classes only
    // on the inner wrapper.
    //
    // IMPORTANT: do NOT strip for deprecated saves, because legacy posts
    // legitimately rely on these classes on the outer wrapper.
    if (blockType?.save !== _save__WEBPACK_IMPORTED_MODULE_6__["default"]) {
      return extraProps;
    }

    // Only strip when using the new markup (inner wrapper exists).
    // Legacy blocks intentionally keep background classes on the outer
    // wrapper for backwards-compatible serialization.
    if (!attributes?.innerWrapperClassName) {
      return extraProps;
    }
    if (typeof extraProps?.className === 'string') {
      extraProps.className = stripBackgroundClasses(extraProps.className);
    }
    return extraProps;
  }, 100);

  // NOTE: Do not strip background classes at save-time via extraProps.
  // Deprecated versions of this block legitimately saved background classes
  // on the outer wrapper. Stripping here breaks deprecated matching and
  // triggers “Block herstellen” in the editor.

  window.wp.hooks.addFilter('editor.BlockListBlock', 'madeit/block-content-column/strip-bg-editor-wrapper', BlockListBlock => props => {
    if (props?.name !== _block_json__WEBPACK_IMPORTED_MODULE_7__.name) {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockListBlock, {
        ...props
      });
    }
    const nextProps = {
      ...props
    };
    if (typeof nextProps.className === 'string') {
      nextProps.className = stripBackgroundClasses(nextProps.className);
    }
    if (nextProps.wrapperProps && typeof nextProps.wrapperProps.className === 'string') {
      nextProps.wrapperProps = {
        ...nextProps.wrapperProps,
        className: stripBackgroundClasses(nextProps.wrapperProps.className)
      };
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockListBlock, {
      ...nextProps
    });
  }, 100);
}

/***/ },

/***/ "./src/save-versions/save_20260407.js"
/*!********************************************!*\
  !*** ./src/save-versions/save_20260407.js ***!
  \********************************************/
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



function save(props) {
  const {
    wrapperClassName,
    verticalAlignment,
    hasCustomVerticalAlignment,
    width,
    customBackgroundColor,
    backgroundColor,
    customTextColor,
    textColor,
    margin,
    padding,
    maxContainerSize,
    innerWrapperClassName
  } = props.attributes;
  const {
    className
  } = props;
  const defaultBlockClassName = 'wp-block-madeit-block-content-column';
  const tokenizeClassString = (value = '') => String(value || '').split(/\s+/).map(t => t.trim()).filter(Boolean);
  const uniqClassString = (value = '') => {
    const seen = new Set();
    const tokens = [];
    tokenizeClassString(value).forEach(token => {
      if (seen.has(token)) return;
      seen.add(token);
      tokens.push(token);
    });
    return tokens.join(' ');
  };
  const stripManagedTokens = (value = '') => value.split(/\s+/).filter(Boolean).filter(token => token !== defaultBlockClassName).filter(token => token !== 'col-12').filter(token => token !== 'keep-max-container-size').filter(token => token !== 'has-background').filter(token => token !== 'has-text-color').filter(token => !/^col-(?:sm|md|lg|xl|xxl)-\d+$/.test(token)).filter(token => !/^is-vertically-aligned-/.test(token)).filter(token => !/^has-.*-background-color$/.test(token)).filter(token => !/^has-.*-color$/.test(token)).join(' ');

  // Merge any extra classes coming from both Gutenberg (props.className) and
  // our legacy/custom attribute (wrapperClassName). Strip WP-managed tokens
  // to avoid duplicating background/text color classes.
  const outerClassName = uniqClassString(classnames__WEBPACK_IMPORTED_MODULE_1___default()(stripManagedTokens(className || ''), stripManagedTokens(wrapperClassName || '')));
  const backgroundColorClass = backgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', backgroundColor) : undefined;
  const textColorClass = textColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', textColor) : undefined;
  const widthRounded = Number.isFinite(width) ? Math.round(width) : undefined;
  const upsertVerticalAlignmentClass = (rawClassString = '') => {
    const base = String(rawClassString || '').split(/\s+/).filter(Boolean).filter(token => !/^is-vertically-aligned-/.test(token));
    if (hasCustomVerticalAlignment && verticalAlignment) {
      base.push(`is-vertically-aligned-${verticalAlignment}`);
    }
    return base.join(' ');
  };

  // TODO: Fix the column classes, and update
  let wrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(defaultBlockClassName, outerClassName, {
    [`is-vertically-aligned-${verticalAlignment}`]: !!hasCustomVerticalAlignment && !!verticalAlignment,
    ['col-12']: true,
    [`col-lg-${widthRounded}`]: widthRounded,
    ['keep-max-container-size']: !!maxContainerSize
    // [ 'madeit-block-content--frontend' ]: true,
  });
  wrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(wrapperClasses, {
    'has-text-color': textColorClass,
    [textColorClass]: textColorClass
  });
  const hasBackground = !!(backgroundColorClass || customBackgroundColor);
  const hasInnerWrapper = !!innerWrapperClassName;
  const innerClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()('madeit-content-column__inner', {
    'has-background': hasBackground,
    [backgroundColorClass]: backgroundColorClass
  });
  var style = {
    color: textColorClass ? undefined : customTextColor
  };
  const innerStyle = {
    backgroundColor: backgroundColorClass ? undefined : customBackgroundColor
  };
  if (margin !== undefined && margin.top !== undefined) {
    style.marginTop = margin.top;
  }
  if (margin !== undefined && margin.bottom !== undefined) {
    style.marginBottom = margin.bottom;
  }
  if (padding !== undefined && padding.top !== undefined) {
    style.paddingTop = padding.top;
  }
  if (padding !== undefined && padding.bottom !== undefined) {
    style.paddingBottom = padding.bottom;
  }
  if (padding !== undefined && padding.left !== undefined) {
    style.paddingLeft = padding.left;
  }
  if (padding !== undefined && padding.right !== undefined) {
    style.paddingRight = padding.right;
  }
  const blockProps = {
    className: wrapperClasses,
    style: style
  };

  // Legacy markup: no inner wrapper when no background.
  if (!hasBackground) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n');
  }

  // Legacy markup (older saved posts): background classes lived on the OUTER
  // wrapper and there was no inner wrapper.
  // We keep this output for legacy blocks to avoid validation errors.
  if (hasBackground && !hasInnerWrapper) {
    const rawWrapperClassName = typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0 ? wrapperClassName.trim() : '';
    if (rawWrapperClassName) {
      const legacyStyle = {
        ...style,
        backgroundColor: backgroundColorClass ? undefined : customBackgroundColor
      };
      const wrapperAlreadyHasBgClass = !!backgroundColorClass && tokenizeClassString(rawWrapperClassName).includes(backgroundColorClass);
      const legacyBlockProps = {
        className: upsertVerticalAlignmentClass(rawWrapperClassName) + (backgroundColorClass && !wrapperAlreadyHasBgClass ? ` ${backgroundColorClass}` : ''),
        style: legacyStyle
      };
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        ...legacyBlockProps
      }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n');
    }
    const legacyWrapperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(wrapperClasses, {
      'has-background': !!backgroundColorClass,
      [backgroundColorClass]: backgroundColorClass
    });
    const legacyStyle = {
      ...style,
      backgroundColor: backgroundColorClass ? undefined : customBackgroundColor
    };
    const legacyBlockProps = {
      className: legacyWrapperClasses,
      style: legacyStyle
    };
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...legacyBlockProps
    }, '\n\n', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null), '\n\n');
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerClasses,
    style: innerStyle
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)));
}

/***/ },

/***/ "./src/save-versions/save_20260422.js"
/*!********************************************!*\
  !*** ./src/save-versions/save_20260422.js ***!
  \********************************************/
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




// Deprecated save (pre-2026-04-22): text/background colors were NOT output to
// frontend (only generic tokens were present).
function save({
  attributes
}) {
  const {
    verticalAlignment,
    width,
    margin,
    padding,
    maxContainerSize,
    innerWrapperClassName,
    textColor,
    backgroundColor
  } = attributes;
  const widthRounded = Math.round(width);
  const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content-column', {
    'col-12': true,
    [`col-lg-${widthRounded}`]: widthRounded,
    [`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
    'keep-max-container-size': maxContainerSize,
    [`has-text-color`]: textColor,
    [`has-background-color`]: backgroundColor
  });
  const outerStyle = {
    marginTop: margin?.top,
    marginBottom: margin?.bottom
  };
  const innerStyle = {
    paddingTop: padding?.top,
    paddingBottom: padding?.bottom,
    paddingLeft: padding?.left,
    paddingRight: padding?.right
  };
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classes,
    style: outerStyle
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerWrapperClassName || 'madeit-content-column__inner',
    style: innerStyle
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)));
}

/***/ },

/***/ "./src/save-versions/save_20260422_color_legacy_duplicates.js"
/*!********************************************************************!*\
  !*** ./src/save-versions/save_20260422_color_legacy_duplicates.js ***!
  \********************************************************************/
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




// Deprecated save (2026-04-22, earlier iteration): added text/background colors
// but could serialize duplicated/conflicting background classes when legacy
// `innerWrapperClassName` already contained `has-background` / `has-*-background-color`.
function save({
  attributes
}) {
  const {
    verticalAlignment,
    width,
    customTextColor,
    customBackgroundColor,
    margin,
    padding,
    maxContainerSize,
    innerWrapperClassName,
    textColor,
    backgroundColor
  } = attributes;
  const widthRounded = Number.isFinite(width) ? Math.round(width) : undefined;
  const textColorClass = textColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', textColor) : undefined;
  const backgroundColorClass = backgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', backgroundColor) : undefined;
  const hasTextColor = !!(textColorClass || customTextColor);
  const hasBackground = !!(backgroundColorClass || customBackgroundColor);
  const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content-column', {
    'col-12': true,
    [`col-lg-${widthRounded}`]: Number.isFinite(widthRounded),
    [`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
    'keep-max-container-size': maxContainerSize,
    'has-text-color': hasTextColor,
    [textColorClass]: !!textColorClass
  });
  const outerStyle = {
    marginTop: margin?.top,
    marginBottom: margin?.bottom,
    color: textColorClass ? undefined : customTextColor
  };
  const innerStyle = {
    paddingTop: padding?.top,
    paddingBottom: padding?.bottom,
    paddingLeft: padding?.left,
    paddingRight: padding?.right,
    backgroundColor: backgroundColorClass ? undefined : customBackgroundColor
  };

  // NOTE: keep legacy duplication behavior for exact matching.
  const innerClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(innerWrapperClassName || 'madeit-content-column__inner', {
    'has-background': hasBackground,
    [backgroundColorClass]: !!backgroundColorClass
  });
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classes,
    style: outerStyle
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerClasses,
    style: innerStyle
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)));
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



function save({
  attributes
}) {
  const {
    verticalAlignment,
    width,
    customTextColor,
    customBackgroundColor,
    margin,
    padding,
    maxContainerSize,
    innerWrapperClassName,
    textColor,
    backgroundColor
  } = attributes;
  const widthRounded = Number.isFinite(width) ? Math.round(width) : undefined;
  const textColorClass = textColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('color', textColor) : undefined;
  const backgroundColorClass = backgroundColor ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.getColorClassName)('background-color', backgroundColor) : undefined;
  const hasTextColor = !!(textColorClass || customTextColor);
  const hasBackground = !!(backgroundColorClass || customBackgroundColor);
  const tokenizeClassString = (value = '') => String(value || '').split(/\s+/).map(token => token.trim()).filter(Boolean);
  const uniqClassString = (value = '') => {
    const seen = new Set();
    const tokens = [];
    tokenizeClassString(value).forEach(token => {
      if (seen.has(token)) return;
      seen.add(token);
      tokens.push(token);
    });
    return tokens.join(' ');
  };

  // Ensure we don't end up with conflicting/duplicated background tokens
  // coming from legacy markup stored in `innerWrapperClassName`.
  const stripBackgroundTokens = (className = '') => tokenizeClassString(className).filter(token => token !== 'has-background').filter(token => !/^has-.*-background-color$/.test(token)).join(' ');
  const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()('wp-block-madeit-block-content-column', {
    'col-12': true,
    [`col-lg-${widthRounded}`]: Number.isFinite(widthRounded),
    [`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
    'keep-max-container-size': maxContainerSize,
    'has-text-color': hasTextColor,
    [textColorClass]: !!textColorClass
  });
  const outerStyle = {
    marginTop: margin?.top,
    marginBottom: margin?.bottom,
    color: textColorClass ? undefined : customTextColor
  };
  const innerStyle = {
    paddingTop: padding?.top,
    paddingBottom: padding?.bottom,
    paddingLeft: padding?.left,
    paddingRight: padding?.right,
    backgroundColor: backgroundColorClass ? undefined : customBackgroundColor
  };
  const innerBaseClassName = stripBackgroundTokens(innerWrapperClassName || 'madeit-content-column__inner');
  const innerClasses = uniqClassString(classnames__WEBPACK_IMPORTED_MODULE_1___default()(innerBaseClassName, {
    'has-background': hasBackground,
    [backgroundColorClass]: !!backgroundColorClass
  }));
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classes,
    style: outerStyle
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerClasses,
    style: innerStyle
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)));
}

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

/***/ "../content-container/node_modules/memize/dist/index.js"
/*!**************************************************************!*\
  !*** ../content-container/node_modules/memize/dist/index.js ***!
  \**************************************************************/
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
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"madeit/block-content-column","version":"2.0.0","title":"Made I.T. Inner Column","category":"madeit","icon":"<svg style=\'max-width:30px;\' xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" role=\\"img\\" aria-label=\\"Column\\"><path fill=\\"none\\" d=\\"M0 0h24v24H0V0z\\"/><path d=\\"M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z\\"/></svg>","description":"A column block designed to be used within the Made I.T. Container block, with options for styling and layout.","keywords":["content","column","madeit"],"supports":{"inserter":false,"reusable":false,"html":false},"textdomain":"madeit","editorScript":"file:./build/index.js","editorStyle":"file:./build/index.css","style":"file:./build/style-index.css","attributes":{"wrapperClassName":{"type":"string","source":"attribute","selector":".wp-block-madeit-block-content-column","attribute":"class"},"verticalAlignment":{"type":"string"},"hasCustomVerticalAlignment":{"type":"boolean"},"width":{"type":"number","default":12,"min":0,"max":12},"backgroundColor":{"type":"string"},"customBackgroundColor":{"type":"string"},"textColor":{"type":"string"},"customTextColor":{"type":"string"},"margin":{"type":"object"},"padding":{"type":"object"},"innerWrapperClassName":{"type":"string","source":"attribute","selector":".madeit-content-column__inner","attribute":"class"}}}');

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
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkcontent_column"] = globalThis["webpackChunkcontent_column"] || [];
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
(function (wp) {
    if (!wp || !wp.hooks || !wp.compose || !wp.element || !wp.components) {
        return;
    }

const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { Fragment, createElement, useEffect, useState } = wp.element;
//const blockEditor = wp.blockEditor || wp.editor;
const { InspectorControls } = wp.blockEditor; // = blockEditor;

const {
    RangeControl,
    SelectControl,
    PanelBody,
    __experimentalToolsPanelItem,
    Button,
    ButtonGroup,
} = wp.components;

function ensureResponsiveTypographyUIStyles() {
    try {
        if (!document || document.getElementById('madeit-responsive-typo-ui-styles')) return;
        const styleEl = document.createElement('style');
        styleEl.id = 'madeit-responsive-typo-ui-styles';
        styleEl.textContent = `
            .components-panel__body.responsive-typo { grid-column: 1 / -1; }
            .components-panel__body.responsive-typo .madeit-control { display: grid; gap: 10px; }
            .components-panel__body.responsive-typo .madeit-control-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
            .components-panel__body.responsive-typo .madeit-control-header__left { display: flex; align-items: center; gap: 10px; min-width: 0; }
            .components-panel__body.responsive-typo .madeit-control-title { font-weight: 600; white-space: nowrap; }
            .components-panel__body.responsive-typo .madeit-control-header__right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
            .components-panel__body.responsive-typo .madeit-control-units .components-button { min-width: 38px; justify-content: center; }
            .components-panel__body.responsive-typo .madeit-control-rangeRow { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; }
            .components-panel__body.responsive-typo .madeit-control-rangeRow__reset.components-button { min-width: 34px; }

            .components-panel__body.responsive-typo .madeit-breakpoint-switcher { display: inline-flex; gap: 4px; }
            .components-panel__body.responsive-typo .madeit-bp-btn { padding: 0; height: 20px; border-radius: 50px; border: 1px solid var(--wp-components-color-border, #ddd); background: transparent; cursor: pointer; }
            .components-panel__body.responsive-typo .madeit-bp-btn.is-active { background: var(--wp-admin-theme-color, #2271b1); color: #fff; border-color: var(--wp-admin-theme-color, #2271b1); }
            .components-panel__body.responsive-typo .madeit-bp-btn .dashicons { line-height: 20px; font-size: 12px; }
        `;
        document.head.appendChild(styleEl);
    } catch (e) {
        // no-op
    }
}

ensureResponsiveTypographyUIStyles();

function ensureResponsiveTypographyPanelStyles() {
    try {
        if (!document) return;

        const ensureStyleEl = () => {
            let styleEl = document.getElementById('madeit-responsive-typo-styles');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'madeit-responsive-typo-styles';
                document.head.appendChild(styleEl);
            }
            return styleEl;
        };

        const update = () => {
            const hasFontControl = !!document.querySelector('.block-editor-font-family-control');
            const gridRow = hasFontControl ? 4 : 2;
            const styleEl = ensureStyleEl();
            if (!styleEl) return;
            styleEl.textContent = `
                .components-panel__body.responsive-typo { grid-row: ${gridRow}; }
            `;
        };

        update();

        if (document.getElementById('madeit-responsive-typo-styles-observer')) return;
        const marker = document.createElement('div');
        marker.id = 'madeit-responsive-typo-styles-observer';
        marker.style.display = 'none';
        document.body.appendChild(marker);

        const observer = new MutationObserver(update);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    } catch (e) {
        // no-op
    }
}

ensureResponsiveTypographyPanelStyles();

function ensureResponsiveTypographyPanelBodyClass() {
    try {
        if (!document) return;

        const apply = () => {
            document
                .querySelectorAll('.madeit-typo-tools-panel-item .components-panel__body')
                .forEach((node) => node.classList.add('responsive-typo'));
        };

        apply();

        if (document.getElementById('madeit-responsive-typo-observer')) return;
        const marker = document.createElement('div');
        marker.id = 'madeit-responsive-typo-observer';
        marker.style.display = 'none';
        document.body.appendChild(marker);

        const observer = new MutationObserver(apply);
        observer.observe(document.body, { childList: true, subtree: true });
    } catch (e) {
        // no-op
    }
}

ensureResponsiveTypographyPanelBodyClass();

function stableSuffix7(seed) {
    // Deterministic 7-char base36 hash (0-9a-z).
    const str = String(seed ?? '');
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    const out = (hash >>> 0).toString(36);
    return out.padStart(7, '0').slice(0, 7);
}

function suffixFromClientId7(clientId) {
    const cleaned = String(clientId ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
    if (!cleaned) return '';
    return cleaned.length >= 7 ? cleaned.slice(-7) : cleaned.padStart(7, '0');
}


const TYPO_BLOCKS = [
    "core/paragraph",
    "core/heading",
];



/* --------------------------------------------------
   BREAKPOINT SWITCHER
-------------------------------------------------- */
const BreakpointSwitcher = ({ active, onChange }) =>
    createElement(
        "div",
        { className: "madeit-breakpoint-switcher" },
        [
            // { key: "desktop", icon: "desktop" },
            { key: "tablet", icon: "tablet" },
            { key: "mobile", icon: "smartphone" },
        ].map(({ key, icon }) =>
            createElement(
                "button",
                {
                    key,
                    type: "button",
                    className:
                        "madeit-bp-btn" +
                        (active === key ? " is-active" : ""),
                    onClick: () => onChange(key),
                },
                createElement("span", {
                    className: `dashicons dashicons-${icon}`,
                })
            )
        )
    );


/* --------------------------------------------------
   CONTROL HEADER
-------------------------------------------------- */
const ControlHeader = ({ title, breakpoint, onBreakpointChange, afterBreakpoint }) =>
    createElement(
        'div',
        { className: 'madeit-control-header' },
        createElement(
            'div',
            { className: 'madeit-control-header__left' },
            createElement('div', { className: 'madeit-control-title' }, title),
            createElement(BreakpointSwitcher, {
                active: breakpoint,
                onChange: onBreakpointChange,
            })
        ),
        createElement(
            'div',
            { className: 'madeit-control-header__right' },
            afterBreakpoint || null
        )
    );



/* --------------------------------------------------
    TYPOGRAPHY CONTROLS
-------------------------------------------------- */
const withTypographyControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (!TYPO_BLOCKS.includes(props.name)) {
            return createElement(BlockEdit, props);
        }

        const { attributes, setAttributes, clientId } = props;
        const [active, setActive] = useState("tablet");

        useEffect(() => {
            if (attributes?.madeitTypoClass) return;

            const suf = suffixFromClientId7(clientId) || stableSuffix7(`typo:${clientId}`);
            setAttributes({ madeitTypoClass: `madeit-typo-${suf}` });
        }, [clientId, attributes?.madeitTypoClass]);

        const map = {
            // desktop: "typoDesktop",
            tablet: "typoTablet",
            mobile: "typoMobile",
        };

        const current = attributes[map[active]] || { value: null, unit: 'rem' };
        const currentUnit = current?.unit || 'rem';

        const update = (data) =>
            setAttributes({
                [map[active]]: { ...current, ...data },
            });

        const resetFontSize = () => update({ value: null });

        const unitButtons = createElement(
            ButtonGroup,
            { className: 'madeit-control-units' },
            ['rem', 'px', 'em'].map((unit) =>
                createElement(
                    Button,
                    {
                        key: unit,
                        isPressed: currentUnit === unit,
                        onClick: () => update({ unit }),
                    },
                    unit
                )
            )
        );

        const controls = createElement(
            'div',
            { className: 'madeit-control' },
            createElement(ControlHeader, {
                title: 'Font size',
                breakpoint: active,
                onBreakpointChange: setActive,
                afterBreakpoint: unitButtons,
            }),
            createElement(
                'div',
                { className: 'madeit-control-rangeRow' },
                createElement(RangeControl, {
                    label: '',
                    value: typeof current.value === 'number' ? current.value : 0,
                    onChange: (val) => update({ value: val }),
                    min: 0,
                    max: 120,
                    step: 0.01,
                }),
                createElement(Button, {
                    className: 'madeit-control-rangeRow__reset',
                    icon: 'undo',
                    variant: 'tertiary',
                    onClick: resetFontSize,
                    showTooltip: true,
                    label: 'Reset font size',
                })
            )
        );

        const panelItem =
            typeof __experimentalToolsPanelItem === "function"
                ? createElement(
                    __experimentalToolsPanelItem,
                    {
                        label: "Responsive",
                        hasValue: () => false,
                        onDeselect: () => {},
                        isShownByDefault: true,
                        panelId: "typography",
                        className: "madeit-typo-tools-panel-item",
                    },
                    controls
                )
                : createElement(    
                    PanelBody,
                    { title: "Responsive", initialOpen: false, className: "responsive-typo" },
                    controls
                );

        return createElement(
            Fragment,
            null,
            createElement(BlockEdit, props),
            createElement(
                InspectorControls,
                { group: "typography" },
                panelItem
            )
        );
    };
}, "withTypographyControls");

addFilter(
    "editor.BlockEdit",
    "madeit/typography-controls",
    withTypographyControls
);






/* --------------------------------------------------
    TYPOGRAPHY ATTRIBUTES
-------------------------------------------------- */
addFilter(
    "blocks.registerBlockType",
    "madeit/typography-attributes",
    (settings, name) => {
        if (!TYPO_BLOCKS.includes(name)) return settings;

        settings.attributes = {
            ...settings.attributes,

            madeitTypoClass: {
                type: "string",
                default: "",
            },

            // typoDesktop: {
            //     type: "object",
            //     default: { value: null, unit: "rem" },
            // },
            typoTablet: {
                type: "object",
                default: { value: null, unit: "rem" },
            },
            typoMobile: {
                type: "object",
                default: { value: null, unit: "rem" },
            },
        };

        return settings;
    }
);





/* --------------------------------------------------
   FRONTEND RENDER
-------------------------------------------------- */
// NOTE: We intentionally do NOT modify the save output of core blocks.
// Doing so causes Block Validation errors for existing content.


/* --------------------------------------------------
   BACKEND RENDER (EDITOR)
-------------------------------------------------- */
const withTypographyEditorRender = createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
        if (!TYPO_BLOCKS.includes(props.name)) {
            return createElement(BlockListBlock, props);
        }

        const { attributes = {}, clientId } = props;

        const currentClassName = props.className || "";
        const classes = currentClassName.split(/\s+/).filter(Boolean);
        const typoMatches = classes.filter((c) => /^(madeit-typo-[a-z0-9]{7})$/i.test(c));
        const uniqueClass =
            attributes.madeitTypoClass ||
            (typoMatches.length ? typoMatches[0] : null) ||
            `madeit-typo-${suffixFromClientId7(clientId) || stableSuffix7(`typo:${clientId}`)}`;

        const normalized = classes
            .filter((c) => !/^(madeit-typo-[a-z0-9]{7})$/i.test(c))
            .concat(uniqueClass);

        const mergedClassName = Array.from(new Set(normalized)).join(" ");

        const build = (bp, max) => {
            const t = attributes[bp];
            if (!t?.value) return "";

            const size = `${t.value}${t.unit}`;

            return max
                ? `
                @media (max-width: ${max}px) {
                    .editor-styles-wrapper .${uniqueClass} { font-size: ${size}; }
                }`
                : `
                .editor-styles-wrapper .${uniqueClass} { font-size: ${size}; }`;
        };

        const css = build("typoTablet", 991) + build("typoMobile", 767);

        const nextProps = {
            ...props,
            className: mergedClassName,
        };

        return createElement(
            Fragment,
            null,
            css && createElement("style", null, css),
            createElement(BlockListBlock, nextProps)
        );
    };
}, "withTypographyEditorRender");

addFilter(
    "editor.BlockListBlock",
    "madeit/typography-editor-render",
    withTypographyEditorRender
);

})(window.wp);
import '@fortawesome/fontawesome-free/css/all.min.css';
import allIcons from '@fortawesome/fontawesome-free/metadata/icons.json';
import {
    useBlockProps,
    InnerBlocks,
    InspectorControls,
    PanelColorSettings,
} from '@wordpress/block-editor';
import { createBlock, parse } from '@wordpress/blocks';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { useState, useEffect, useMemo } from '@wordpress/element';
import { RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    Button,
    ButtonGroup,
    SelectControl,
    RangeControl,
    TextControl,
    TextareaControl,
    ToggleControl,
    Flex,
    FlexBlock,
    FlexItem,
    Modal,
    ColorPalette,
    Popover,
    __experimentalToggleGroupControl as ToggleGroupControl,
} from '@wordpress/components';

import { ControlHeader } from '../../../shared';

const LEGACY_TITLES_WRAPPER = 'madeit/block-tabs-titles';
const LEGACY_CONTENTS_WRAPPER = 'madeit/block-tabs-contents';
const LEGACY_TITLE_BLOCK = 'madeit/block-tabs-title';
const LEGACY_CONTENT_BLOCK = 'madeit/block-tabs-content';

const logEditorMigration = (message, payload) => {
    if (typeof payload === 'undefined') {
        console.log('[madeit-tabs:editor-migration]', message);
        return;
    }

    console.log('[madeit-tabs:editor-migration]', message, payload);
};

const normalizeLegacyTitle = (value) => {
    const raw = Array.isArray(value)
        ? value
            .map((part) => (typeof part === 'string' ? part : ''))
            .join('')
        : (value || '');

    const element = document.createElement('div');
    element.innerHTML = String(raw);
    return (element.textContent || element.innerText || '').replace(/\u00a0/g, ' ').trim();
};

const getLegacyMapKey = (tabId, fallbackIndex) => {
    const parsed = Number.parseInt(tabId, 10);
    return Number.isInteger(parsed) ? `id:${parsed}` : `index:${fallbackIndex}`;
};

const getLegacyAliasIdKey = (key, fallbackIndex) => {
    if (typeof key !== 'string' || !key.startsWith('index:')) {
        return null;
    }

    return Number.isInteger(fallbackIndex) ? `id:${fallbackIndex}` : null;
};

const buildTabsFromLegacyWrappers = (innerBlocks = []) => {
    const titlesWrapper = innerBlocks.find((block) => block?.name === LEGACY_TITLES_WRAPPER);
    const contentsWrapper = innerBlocks.find((block) => block?.name === LEGACY_CONTENTS_WRAPPER);

    const legacyTitles = (titlesWrapper?.innerBlocks || []).filter(
        (block) => block?.name === LEGACY_TITLE_BLOCK
    );
    const legacyContents = (contentsWrapper?.innerBlocks || []).filter(
        (block) => block?.name === LEGACY_CONTENT_BLOCK
    );

    logEditorMigration('Wrappers uitgelezen', {
        hasTitlesWrapper: Boolean(titlesWrapper),
        hasContentsWrapper: Boolean(contentsWrapper),
        legacyTitleCount: legacyTitles.length,
        legacyContentCount: legacyContents.length,
    });

    if (!legacyTitles.length && !legacyContents.length) {
        return [];
    }

    const titleByKey = new Map();
    legacyTitles.forEach((block, index) => {
        const key = getLegacyMapKey(block?.attributes?.tabid, index);
        const value = normalizeLegacyTitle(block?.attributes?.content);

        titleByKey.set(key, value);

        const aliasKey = getLegacyAliasIdKey(key, index);
        if (aliasKey && !titleByKey.has(aliasKey)) {
            titleByKey.set(aliasKey, value);
        }
    });

    const contentByKey = new Map();
    legacyContents.forEach((block, index) => {
        const key = getLegacyMapKey(block?.attributes?.tabid, index);
        contentByKey.set(key, block?.innerBlocks || []);
    });

    const orderedKeys = [];
    titleByKey.forEach((_, key) => orderedKeys.push(key));
    contentByKey.forEach((_, key) => {
        if (!orderedKeys.includes(key)) {
            orderedKeys.push(key);
        }
    });

    return orderedKeys.map((key) => createBlock(
        'madeit/block-tab',
        {
            ...(titleByKey.get(key) ? { title: titleByKey.get(key) } : {}),
        },
        contentByKey.get(key) || []
    ));
};

const buildTabsFromLegacyRaw = (innerBlocks = []) => {
    const missingParts = innerBlocks
        .filter((block) => block?.name === 'core/missing')
        .map((block) => block?.attributes?.originalContent || block?.originalContent || '')
        .filter(Boolean);

    const freeformParts = innerBlocks
        .filter((block) => block?.name === 'core/freeform')
        .map((block) => block?.attributes?.content || '')
        .filter(Boolean);

    const missingRaw = missingParts.join('\n');
    const freeformRaw = freeformParts.join('\n');

    const raw =
        (missingRaw.includes('madeit/block-tabs-title') || missingRaw.includes('madeit/block-tabs-content'))
            ? missingRaw
            : freeformRaw;

    logEditorMigration('Raw fallback input', {
        source: raw === missingRaw ? 'core/missing' : 'core/freeform',
        rawLength: raw.length,
        hasTitleToken: raw.includes('madeit/block-tabs-title'),
        hasContentToken: raw.includes('madeit/block-tabs-content'),
    });

    if (!raw.includes('madeit/block-tabs-title') && !raw.includes('madeit/block-tabs-content')) {
        return [];
    }

    const titleByKey = new Map();
    const titleRegex = /<!--\s*wp:madeit\/block-tabs-title(?:\s+(\{[\s\S]*?\}))?\s*-->([\s\S]*?)<!--\s*\/wp:madeit\/block-tabs-title\s*-->/g;
    let titleMatch;
    let titleIndex = 0;
    const seenTitleKeys = new Set();

    while ((titleMatch = titleRegex.exec(raw)) !== null) {
        let parsedAttributes = {};
        if (titleMatch[1]) {
            try {
                parsedAttributes = JSON.parse(titleMatch[1]);
            } catch (error) {
                parsedAttributes = {};
            }
        }

        const key = getLegacyMapKey(parsedAttributes?.tabid, titleIndex);
        if (seenTitleKeys.has(key)) {
            titleIndex += 1;
            continue;
        }

        const titleMarkup = titleMatch[2] || '';
        const anchorMatch = titleMarkup.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
        const titleText = normalizeLegacyTitle(anchorMatch?.[1] || titleMarkup);

        titleByKey.set(key, titleText);

        const aliasKey = getLegacyAliasIdKey(key, titleIndex);
        if (aliasKey && !titleByKey.has(aliasKey)) {
            titleByKey.set(aliasKey, titleText);
        }

        seenTitleKeys.add(key);
        titleIndex += 1;
    }

    const tabs = [];
    const contentRegex = /<!--\s*wp:madeit\/block-tabs-content(?:\s+(\{[\s\S]*?\}))?\s*-->([\s\S]*?)<!--\s*\/wp:madeit\/block-tabs-content\s*-->/g;
    let contentMatch;
    let contentIndex = 0;
    const seenContentSignatures = new Set();

    while ((contentMatch = contentRegex.exec(raw)) !== null) {
        let parsedAttributes = {};
        if (contentMatch[1]) {
            try {
                parsedAttributes = JSON.parse(contentMatch[1]);
            } catch (error) {
                parsedAttributes = {};
            }
        }

        const key = getLegacyMapKey(parsedAttributes?.tabid, contentIndex);
        const innerRaw = contentMatch[2] || '';
        const signature = `${key}::${innerRaw.trim()}`;

        if (seenContentSignatures.has(signature)) {
            contentIndex += 1;
            continue;
        }

        let parsedInnerBlocks = [];
        try {
            parsedInnerBlocks = parse(innerRaw);
        } catch (error) {
            parsedInnerBlocks = [];
        }

        tabs.push(
            createBlock(
                'madeit/block-tab',
                {
                    ...(titleByKey.get(key) ? { title: titleByKey.get(key) } : {}),
                },
                parsedInnerBlocks
            )
        );

        seenContentSignatures.add(signature);
        contentIndex += 1;
    }

    if (!tabs.length && titleByKey.size > 0) {
        titleByKey.forEach((title) => {
            tabs.push(createBlock('madeit/block-tab', { ...(title ? { title } : {}) }, []));
        });
    }

    logEditorMigration('Raw fallback resultaat', {
        titleCount: titleByKey.size,
        tabCount: tabs.length,
        tabNames: tabs.map((block) => block?.name),
    });

    return tabs;
};

export default function Edit({ clientId, attributes, setAttributes }) {

    useEffect(() => {
        logEditorMigration('Edit mounted', { clientId });
    }, [clientId]);

    const themeColors = select('core/block-editor').getSettings().colors || [];

    const justifyDesktop = attributes?.justifyContent ?? 'flex-start';
    const justifyTablet = attributes?.justifyContentTablet ?? justifyDesktop;
    const justifyMobile = attributes?.justifyContentMobile ?? justifyTablet;

    const titleBorderStyle = attributes?.titleBorderStyle ?? 'full';
    const titleBorderWidth = Number.isFinite(attributes?.titleBorderWidth)
        ? attributes.titleBorderWidth
        : 1;
    const contentBorderWidth = Number.isFinite(attributes?.contentBorderWidth)
        ? attributes.contentBorderWidth
        : 1;

    const titleBorderSideWidths = useMemo(() => {
        const width = Math.max(0, titleBorderWidth);

        switch (titleBorderStyle) {
            case 'top':
                return { top: width, right: 0, bottom: 0, left: 0 };
            case 'bottom':
                return { top: 0, right: 0, bottom: width, left: 0 };
            case 'left':
                return { top: 0, right: 0, bottom: 0, left: width };
            case 'right':
                return { top: 0, right: width, bottom: 0, left: 0 };
            case 'full':
                return { top: width, right: width, bottom: width, left: width };
            case 'none':
                return { top: 0, right: 0, bottom: 0, left: 0 };
            default:
                return { top: 0, right: 0, bottom: 0, left: 0 };
        }
    }, [titleBorderStyle, titleBorderWidth]);

    const blockClassName = [
        'madeit-tabs-editor',
        attributes?.tabPosition ? `is-tab-position-desktop-${attributes.tabPosition}` : null,
        attributes?.tabPositionTablet ? `is-tab-position-tablet-${attributes.tabPositionTablet}` : null,
        attributes?.tabPositionMobile ? `is-tab-position-mobile-${attributes.tabPositionMobile}` : null,
    ]
        .filter(Boolean)
        .join(' ');

    const blockProps = useBlockProps({
        className: blockClassName,
        style: {
            '--madeit-tabs-justify-desktop': justifyDesktop,
            '--madeit-tabs-justify-tablet': justifyTablet,
            '--madeit-tabs-justify-mobile': justifyMobile,

            ...(attributes?.titleFontSize
                ? { '--madeit-tabs-title-font-size': attributes.titleFontSize }
                : {}),
            ...(attributes?.titleBold
                ? { '--madeit-tabs-title-font-weight': '700' }
                : {}),
            ...(attributes?.titleItalic
                ? { '--madeit-tabs-title-font-style': 'italic' }
                : {}),
            ...(attributes?.titleUnderline
                ? { '--madeit-tabs-title-text-decoration': 'underline' }
                : {}),
            ...(Number.isFinite(attributes?.titleGap)
                ? { '--madeit-tabs-title-gap': `${attributes.titleGap}px` }
                : {}),

            ...(attributes?.activeTabBackgroundColor
                ? { '--madeit-tabs-tab-active-bg': attributes.activeTabBackgroundColor }
                : {}),
            ...(attributes?.activeTabTextColor
                ? { '--madeit-tabs-tab-active-color': attributes.activeTabTextColor }
                : {}),
            ...(attributes?.inactiveTabBackgroundColor
                ? { '--madeit-tabs-tab-bg': attributes.inactiveTabBackgroundColor }
                : {}),
            ...(attributes?.inactiveTabTextColor
                ? { '--madeit-tabs-tab-color': attributes.inactiveTabTextColor }
                : {}),
            ...(attributes?.contentBackgroundColor
                ? { '--madeit-tabs-content-bg': attributes.contentBackgroundColor }
                : {}),

            ...(attributes?.titleBorderColor
                ? { '--madeit-tabs-title-border-color': attributes.titleBorderColor }
                : {}),
            '--madeit-tabs-title-border-top-width': `${titleBorderSideWidths.top}px`,
            '--madeit-tabs-title-border-right-width': `${titleBorderSideWidths.right}px`,
            '--madeit-tabs-title-border-bottom-width': `${titleBorderSideWidths.bottom}px`,
            '--madeit-tabs-title-border-left-width': `${titleBorderSideWidths.left}px`,
            '--madeit-tabs-nav-border-width': `${titleBorderSideWidths.bottom}px`,
            '--madeit-tabs-nav-border-top-width': `${titleBorderSideWidths.top}px`,
            '--madeit-tabs-nav-border-right-width': `${titleBorderSideWidths.right}px`,
            '--madeit-tabs-nav-border-bottom-width': `${titleBorderSideWidths.bottom}px`,
            '--madeit-tabs-nav-border-left-width': `${titleBorderSideWidths.left}px`,

            ...(attributes?.contentBorderColor
                ? { '--madeit-tabs-content-border-color': attributes.contentBorderColor }
                : {}),
            '--madeit-tabs-content-border-width': `${Math.max(0, contentBorderWidth)}px`,
        },
    });

    const tabs = useSelect(
        (select) => select('core/block-editor').getBlocks(clientId),
        [clientId]
    );

    const { insertBlocks, removeBlock, moveBlockToPosition, updateBlockAttributes, replaceInnerBlocks } = useDispatch(
        'core/block-editor'
    );

    useEffect(() => {
        if (!Array.isArray(tabs) || tabs.length === 0) return;

        logEditorMigration('Inner blocks snapshot', {
            clientId,
            count: tabs.length,
            names: tabs.map((block) => block?.name),
        });

        const hasNewTabs = tabs.some((block) => block?.name === 'madeit/block-tab');
        if (hasNewTabs) {
            logEditorMigration('Skip migratie: nieuwe block-tab children al aanwezig');
            return;
        }

        const hasLegacyWrappers = tabs.some((block) =>
            block?.name === LEGACY_TITLES_WRAPPER || block?.name === LEGACY_CONTENTS_WRAPPER
        );

        logEditorMigration('Wrapper detectie', { hasLegacyWrappers });

        if (!hasLegacyWrappers) {
            logEditorMigration('Geen legacy wrappers gevonden, probeer raw fallback');

            const rawMigratedTabs = buildTabsFromLegacyRaw(tabs);

            if (!rawMigratedTabs.length) {
                logEditorMigration('Skip migratie: raw fallback gaf geen tabs');
                return;
            }

            logEditorMigration('replaceInnerBlocks uitvoeren via raw fallback', {
                clientId,
                migratedCount: rawMigratedTabs.length,
            });

            replaceInnerBlocks(clientId, rawMigratedTabs, false);
            return;
        }

        const migratedTabs = buildTabsFromLegacyWrappers(tabs);
        logEditorMigration('Migratie resultaat', {
            migratedCount: migratedTabs.length,
            migratedNames: migratedTabs.map((block) => block?.name),
        });

        if (!migratedTabs.length) {
            logEditorMigration('Skip replaceInnerBlocks: migratie gaf 0 tabs terug');
            return;
        }

        logEditorMigration('replaceInnerBlocks uitvoeren', {
            clientId,
            migratedCount: migratedTabs.length,
        });
        replaceInnerBlocks(clientId, migratedTabs, false);
    }, [tabs, clientId, replaceInnerBlocks]);

    // Ensure there's always a valid active tab clientId for editor rendering.
    useEffect(() => {
        if (!Array.isArray(tabs) || tabs.length === 0) return;

        const ids = tabs.map((t) => t.clientId);
        const current = attributes?.activeTabClientId;

        if (!current || !ids.includes(current)) {
            setAttributes({ activeTabClientId: ids[0] });
        }
    }, [tabs, attributes?.activeTabClientId, setAttributes]);

    // Keep per-type icon values so switching between icon types doesn't overwrite the other value.
    useEffect(() => {
        if (!Array.isArray(tabs) || tabs.length === 0) return;

        tabs.forEach((tab) => {
            const tabAttrs = tab?.attributes || {};
            const iconType = tabAttrs.iconType;
            const icon = tabAttrs.icon;

            if (!iconType || !icon) return;

            if (iconType === 'fontawesome' && !tabAttrs.fontawesome) {
                updateBlockAttributes(tab.clientId, { fontawesome: icon });
            }

            if (iconType === 'custom' && !tabAttrs.customSvg) {
                updateBlockAttributes(tab.clientId, { customSvg: icon });
            }
        });
        // Intentionally depend on `tabs` so it runs when the editor updates child blocks.
    }, [tabs, updateBlockAttributes]);

    const addTab = () => {
        insertBlocks(createBlock('madeit/block-tab', {}), tabs.length, clientId);
    };

    const moveTab = (tabClientId, newIndex) => {
        if (newIndex < 0 || newIndex >= tabs.length) return;
        moveBlockToPosition(tabClientId, clientId, clientId, newIndex);
    };

    const [collapsedTabs, setCollapsedTabs] = useState({});

    const FontAwesomePicker = ({ label, value, onChange }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [search, setSearch] = useState('');
        const [styleFilter, setStyleFilter] = useState('solid');

        const icons = useMemo(() => {
            return Object.entries(allIcons)
                .filter(([name, data]) => {
                    if (!data.styles.includes(styleFilter)) return false;
                    return name.includes(search.toLowerCase());
                })
                .slice(0, 500); // performance safety
        }, [search, styleFilter]);

        return (<>
            <Button variant="secondary" onClick={() => setIsOpen(true)} style={{aspectRatio: 1, width: '100%', height: 'auto', justifyContent: 'center'}}>
                {label}
            </Button>

            {isOpen && (
                <Modal
                    title="Select FontAwesome Icon"
                    onRequestClose={() => setIsOpen(false)}
                    isFullScreen={true}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <TextControl
                            placeholder="Search icons..."
                            value={search}
                            onChange={setSearch}
                        />
                        <ButtonGroup style={{ marginTop: '8px' }}>
                            <Button
                                variant={styleFilter === 'solid' ? 'primary' : 'secondary'}
                                onClick={() => setStyleFilter('solid')}
                            >
                                Solid
                            </Button>
                            <Button
                                variant={styleFilter === 'regular' ? 'primary' : 'secondary'}
                                onClick={() => setStyleFilter('regular')}
                            >
                                Regular
                            </Button>
                            <Button
                                variant={styleFilter === 'brands' ? 'primary' : 'secondary'}
                                onClick={() => setStyleFilter('brands')}
                            >
                                Brands
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {icons.map(([name, data]) => (
                            <Button
                                key={name}
                                variant="tertiary"
                                onClick={() => {
                                    const prefix = styleFilter === 'solid' ? 'fas' : styleFilter === 'regular' ? 'far' : 'fab';
                                    onChange(`${prefix} fa-${name}`);
                                    setIsOpen(false);
                                }}
                                style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <i className={`${styleFilter === 'solid' ? 'fas' : styleFilter === 'regular' ? 'far' : 'fab'} fa-${name}`} style={{ fontSize: '24px' }}></i>
                            </Button>
                        ))}
                    </div>
                </Modal>
            )}
        </>);
    };

    const IconColor = ({ value, onChange, themeColors }) => {
        const [isVisible, setIsVisible] = useState(false);

        return (
            <Button onClick={() => setIsVisible((v) => !v)}>
                <span
                    style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: value || '#000',
                        borderRadius: '50%',
                        border: '1px solid #ccc'
                    }}
                ></span>
                {isVisible && (
                    <Popover>
                        <ColorPalette
                            colors={themeColors}
                            value={value}
                            onChange={onChange}
                            enableAlpha
                        />
                    </Popover>
                )}
            </Button>
        );
    };

    const [activeTab, setActiveTab] = useState('layout');

    const isBlockSelected = useSelect(
        ( select ) => select( 'core/block-editor' )?.isBlockSelected?.( clientId ),
        [ clientId ]
    );

    useEffect( () => {
        const bodyClass = 'madeit-content-container-advanced-tabs';
        if ( isBlockSelected ) {
            document.body.classList.add( bodyClass );
        } else {
            document.body.classList.remove( bodyClass );
        }

        return () => {
            document.body.classList.remove( bodyClass );
        };
    }, [ isBlockSelected ] );

    useEffect( () => {
        if (!isBlockSelected) return;

        const advancedPanel = document.querySelector(
            '.block-editor-block-inspector__advanced'
        );

        if (!advancedPanel) return;

        advancedPanel.style.display = activeTab === 'advanced' ? 'block' : 'none';
    }, [ activeTab, isBlockSelected ] );

    const JustifyStartIcon = () => (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-start</title><path d="M8 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM15.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888z"></path></svg>
    );
    const JustifyCenterIcon = () => (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-center</title><path d="M16 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
    );
    const JustifyEndIcon = () => (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-end</title><path d="M24 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM18.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
    );

    const TabRightIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 161 368" version="1.1">
            <g transform="matrix(1,0,0,1,-897.047131,-1231.324163)">
                <g transform="matrix(7.666667,0,0,7.666667,488.252874,1319.390805)">
                    <g transform="matrix(-0,1,-1,-0,76.32099,-13.494528)">
                        <path d="M31.6,2L20.4,2C19.7,2 19.2,2.6 19.2,3.3L19.2,5.8C19.2,6.5 19.8,7.1 20.4,7.1L31.6,7.1C32.3,7.1 32.8,6.5 32.8,5.8L32.8,3.3C32.9,2.6 32.3,2 31.6,2Z"/>
                    </g>
                </g>
                <g transform="matrix(7.666667,0,0,7.666667,488.252874,1319.390805)">
                    <g transform="matrix(-0,1,-1,-0,76.32099,-30.686953)">
                        <path d="M31.6,2L20.4,2C19.7,2 19.2,2.6 19.2,3.3L19.2,5.8C19.2,6.5 19.8,7.1 20.4,7.1L31.6,7.1C32.3,7.1 32.8,6.5 32.8,5.8L32.8,3.3C32.9,2.6 32.3,2 31.6,2Z"/>
                        <g transform="matrix(0,0.130435,0.117839,-0,-121.264287,-84.240863)">
                            <path d="M822.18,1203.739C822.18,1197.26 817.428,1192 811.575,1192L734.172,1192C728.319,1192 723.567,1197.26 723.567,1203.739L723.567,1587.485C723.567,1593.964 728.319,1599.224 734.172,1599.224L811.575,1599.224C817.428,1599.224 822.18,1593.964 822.18,1587.485L822.18,1203.739Z"/>
                        </g>
                    </g>
                </g>
                <g transform="matrix(7.666667,0,0,7.666667,488.252874,1319.390805)">
                    <g transform="matrix(-0,1,-1,-0,76.32099,-13.494528)">
                        <path d="M48.7,2L37.5,2C36.8,2 36.2,2.6 36.2,3.3L36.2,5.8C36.2,6.5 36.8,7.1 37.5,7.1L48.7,7.1C49.4,7 50,6.5 50,5.8L50,3.3C50,2.6 49.4,2 48.7,2Z"/>
                    </g>
                </g>
            </g>
        </svg>
    );

    const TabTopIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 368 161" version="1.1">
            <g transform="matrix(1,0,0,1,-159.037116,-1240.366089)">
                <g transform="matrix(7.666667,0,0,7.666667,488.252874,1319.390805)">
                    <g transform="matrix(-1,0,0,1,7.058814,-12.307572)">
                        <path d="M31.6,2L20.4,2C19.7,2 19.2,2.6 19.2,3.3L19.2,5.8C19.2,6.5 19.8,7.1 20.4,7.1L31.6,7.1C32.3,7.1 32.8,6.5 32.8,5.8L32.8,3.3C32.9,2.6 32.3,2 31.6,2Z"/>
                    </g>
                </g>
                <g transform="matrix(7.666667,0,0,7.666667,488.252874,1319.390805)">
                    <g transform="matrix(-1,0,0,1,24.251239,-12.307572)">
                        <path d="M31.6,2L20.4,2C19.7,2 19.2,2.6 19.2,3.3L19.2,5.8C19.2,6.5 19.8,7.1 20.4,7.1L31.6,7.1C32.3,7.1 32.8,6.5 32.8,5.8L32.8,3.3C32.9,2.6 32.3,2 31.6,2Z"/>
                        <g transform="matrix(0,0.130435,0.117839,-0,-121.264287,-84.240863)">
                            <path d="M822.18,1203.739C822.18,1197.26 817.428,1192 811.575,1192L734.172,1192C728.319,1192 723.567,1197.26 723.567,1203.739L723.567,1587.485C723.567,1593.964 728.319,1599.224 734.172,1599.224L811.575,1599.224C817.428,1599.224 822.18,1593.964 822.18,1587.485L822.18,1203.739Z"/>
                        </g>
                    </g>
                </g>
                <g transform="matrix(7.666667,0,0,7.666667,488.252874,1319.390805)">
                    <g transform="matrix(-1,0,0,1,7.058814,-12.307572)">
                        <path d="M48.7,2L37.5,2C36.8,2 36.2,2.6 36.2,3.3L36.2,5.8C36.2,6.5 36.8,7.1 37.5,7.1L48.7,7.1C49.4,7 50,6.5 50,5.8L50,3.3C50,2.6 49.4,2 48.7,2Z"/>
                    </g>
                </g>
            </g>
        </svg>
    );

    const TabLeftIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 161 368" version="1.1">
            <g transform="matrix(1,0,0,1,-661.179947,-1231.324163)">
                <g transform="matrix(7.666667,0,0,7.666667,488.252874,1319.390805)">
                    <g transform="matrix(0,1,1,-0,20.555705,-13.494528)">
                        <path d="M31.6,2L20.4,2C19.7,2 19.2,2.6 19.2,3.3L19.2,5.8C19.2,6.5 19.8,7.1 20.4,7.1L31.6,7.1C32.3,7.1 32.8,6.5 32.8,5.8L32.8,3.3C32.9,2.6 32.3,2 31.6,2Z"/>
                    </g>
                </g>
                <g transform="matrix(7.666667,0,0,7.666667,488.252874,1319.390805)">
                    <g transform="matrix(0,1,1,-0,20.555705,-30.686953)">
                        <path d="M31.6,2L20.4,2C19.7,2 19.2,2.6 19.2,3.3L19.2,5.8C19.2,6.5 19.8,7.1 20.4,7.1L31.6,7.1C32.3,7.1 32.8,6.5 32.8,5.8L32.8,3.3C32.9,2.6 32.3,2 31.6,2Z"/>
                        <g transform="matrix(0,0.130435,0.117839,-0,-121.264287,-84.240863)">
                            <path d="M822.18,1203.739C822.18,1197.26 817.428,1192 811.575,1192L734.172,1192C728.319,1192 723.567,1197.26 723.567,1203.739L723.567,1587.485C723.567,1593.964 728.319,1599.224 734.172,1599.224L811.575,1599.224C817.428,1599.224 822.18,1593.964 822.18,1587.485L822.18,1203.739Z"/>
                        </g>
                    </g>
                </g>
                <g transform="matrix(7.666667,0,0,7.666667,488.252874,1319.390805)">
                    <g transform="matrix(0,1,1,-0,20.555705,-13.494528)">
                        <path d="M48.7,2L37.5,2C36.8,2 36.2,2.6 36.2,3.3L36.2,5.8C36.2,6.5 36.8,7.1 37.5,7.1L48.7,7.1C49.4,7 50,6.5 50,5.8L50,3.3C50,2.6 49.4,2 48.7,2Z"/>
                    </g>
                </g>
            </g>
        </svg>
    );

    const [ activeDirectionBreakpoint, setActiveDirectionBreakpoint ] = useState( 'desktop' );
    const [ activeTabDisplayBreakpoint, setActiveTabDisplayBreakpoint ] = useState( 'desktop' );
    const justifyContentValueKey =
        activeDirectionBreakpoint === 'tablet'
            ? 'justifyContentTablet'
            : activeDirectionBreakpoint === 'mobile'
                ? 'justifyContentMobile'
                : 'justifyContent';

    const tabPositionValueKey =
        activeTabDisplayBreakpoint === 'tablet'
            ? 'tabPositionTablet'
            : activeTabDisplayBreakpoint === 'mobile'
                ? 'tabPositionMobile'
                : 'tabPosition';

    const currentJustifyContent =
        attributes?.[ justifyContentValueKey ] ??
        attributes?.justifyContent ??
        'flex-start';

    const currentTabPosition =
        attributes?.[ tabPositionValueKey ] ??
        attributes?.tabPosition ??
        'top';

    const resetJustifyContent = () =>
        setAttributes( {
            [ justifyContentValueKey ]:
                activeDirectionBreakpoint === 'desktop' ? 'flex-start' : undefined,
        } );
    
    const resetTabPosition = () =>
        setAttributes( {
            [ tabPositionValueKey ]:
                activeTabDisplayBreakpoint === 'desktop' ? 'top' : undefined,
        } );

    const resetTitleStyling = () =>
        setAttributes( {
            titleFontSize: undefined,
            titleBold: undefined,
            titleItalic: undefined,
            titleUnderline: undefined,
            titleGap: undefined,
        } );


    return (
        <>
            {/* Tab items */}
            <InspectorControls>
                {/* Tab buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button 
                        isPrimary={activeTab === 'layout'} 
                        onClick={() => setActiveTab('layout')}
                        style={{ marginRight: '5px' }}
                    >
                        Layout
                    </Button>
                    <Button 
                        isPrimary={activeTab === 'style'} 
                        onClick={() => setActiveTab('style')}
                        style={{ marginRight: '5px' }}
                    >
                        Style
                    </Button>
                    <Button 
                        isPrimary={activeTab === 'advanced'} 
                        onClick={() => setActiveTab('advanced')}
                    >
                        Advanced
                    </Button>
                </div>

                {activeTab === 'layout' && (
                    <>
                        <PanelBody title="Tab items" initialOpen={true}>

                            {tabs.length === 0 ? (
                                <p>No tabs yet.</p>
                            ) : (
                                <div
                                    style={{
                                        borderRadius: '2px',
                                        padding: '8px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                    }}
                                >
                                    {tabs.map((tab, index) => (
                                        <div
                                            key={tab.clientId}
                                            style={{
                                                border: '1px solid rgba(0,0,0,0.08)',
                                                borderRadius: '2px',
                                                padding: '8px',
                                            }}
                                        >
                                            <Flex>
                                                {/* Remove */}
                                                <FlexItem>
                                                    <Button
                                                        style={{ padding: '0' }}
                                                        variant="tertiary"
                                                        isDestructive
                                                        onClick={() => removeBlock(tab.clientId)}
                                                    >
                                                        <span className="dashicons dashicons-trash" style={{ color: 'grey', fontSize: '16px', verticalAlign: 'middle', alignContent: 'center' }}></span>
                                                    </Button>
                                                </FlexItem>

                                                {/* Title */}
                                                <FlexBlock>
                                                    <strong>{tab.attributes?.title || `Tab ${index + 1}`}</strong>
                                                </FlexBlock>
                                                
                                                {/* Move item */}
                                                <FlexItem style={{ display: 'flex',  flexDirection: 'column', gap: '4px' }}>
                                                    <Button
                                                        style={{ padding: '0', boxShadow: 'none', height: 'auto' }}
                                                        variant="secondary"
                                                        onClick={() => moveTab(tab.clientId, index - 1)}
                                                        disabled={index === 0}
                                                    >
                                                        <span className="dashicons dashicons-arrow-up" style={{ color: 'grey', fontSize: '16px', verticalAlign: 'middle', alignContent: 'center' }}></span>
                                                    </Button>

                                                    <Button
                                                        style={{ padding: '0', boxShadow: 'none', height: 'auto' }}
                                                        variant="secondary"
                                                        onClick={() => moveTab(tab.clientId, index + 1)}
                                                        disabled={index === tabs.length - 1}
                                                    >
                                                        <span className="dashicons dashicons-arrow-down" style={{ color: 'grey', fontSize: '16px', verticalAlign: 'middle', alignContent: 'center' }}></span>
                                                    </Button>
                                                </FlexItem>

                                                {/* Arrow to collapse item */}
                                                <FlexItem>
                                                    <Button 
                                                    style={{ padding: '0', boxShadow: 'none' }}
                                                    variant="secondary" 
                                                    onClick={() => setCollapsedTabs((prev) => ({
                                                        ...prev,
                                                        [tab.clientId]: !prev[tab.clientId],
                                                    }))}>

                                                        <span className="dashicons dashicons-arrow-down-alt2" style={{ color: 'grey', fontSize: '16px', verticalAlign: 'middle', alignContent: 'center' }}></span>
                                                    </Button>
                                                </FlexItem>
                                            </Flex>

                                                                                    
                                            {/* Body of collapsed item */}
                                            {collapsedTabs[tab.clientId] && (
                                                <>
                                                    <hr></hr>
                                                    <TextControl
                                                        label={`Tab title`}
                                                        value={tab.attributes?.title || ''}
                                                        onChange={(value) =>
                                                            updateBlockAttributes(tab.clientId, { title: value })
                                                        }
                                                    />

                                                    {/* Show icon boolean */}
                                                    <ToggleControl
                                                        label="Show icon"
                                                        checked={tab.attributes?.showIcon || false}
                                                        onChange={(value) =>
                                                            updateBlockAttributes(tab.clientId, {
                                                                showIcon: value,
                                                                ...(value
                                                                    ? {
                                                                        iconType: tab.attributes?.iconType || 'fontawesome',
                                                                    }
                                                                    : {}),
                                                            })
                                                        }
                                                    />

                                                    {/* Icon picker */}
                                                    {tab.attributes?.showIcon === true && (
                                                        <>
                                                            {/* Icon type */}
                                                            <ButtonGroup>
                                                                <Button
                                                                    variant={tab.attributes?.iconType === 'fontawesome' ? 'primary' : 'secondary'}
                                                                    onClick={() =>
                                                                        updateBlockAttributes(tab.clientId, {
                                                                            iconType: 'fontawesome',
                                                                            icon: tab.attributes?.fontawesome || '',
                                                                        })
                                                                    }
                                                                >
                                                                    FontAwesome
                                                                </Button>
                                                                <Button
                                                                    variant={tab.attributes?.iconType === 'custom' ? 'primary' : 'secondary'}
                                                                    onClick={() =>
                                                                        updateBlockAttributes(tab.clientId, {
                                                                            iconType: 'custom',
                                                                            icon: tab.attributes?.customSvg || '',
                                                                        })
                                                                    }
                                                                >
                                                                    Custom SVG
                                                                </Button>
                                                            </ButtonGroup>

                                                            <br/> <br/>
                                                            {/* If custom SVG is selected */}
                                                            {tab.attributes?.iconType === 'custom' && (
                                                                <>
                                                                    <TextareaControl
                                                                        style={{ marginTop: '8px' }}
                                                                        label="Plaats SVG code"
                                                                        value={tab.attributes?.customSvg || ''}
                                                                        onChange={(value) =>
                                                                            updateBlockAttributes(tab.clientId, {
                                                                                customSvg: value || '',
                                                                                // Keep `icon` in sync with the selected icon type so it is saved and rendered on the frontend.
                                                                                icon: value || '',
                                                                            })
                                                                        }
                                                                        help="Plaats hier de SVG code voor het tab icoon. Zorg ervoor dat de SVG code alleen het <svg> element bevat zonder extra wrapper of styles."
                                                                    />
                                                                </>
                                                            )}

                                                            {tab.attributes?.iconType === 'fontawesome' && (
                                                                <div style={{ position: 'relative' }}>
                                                                    <>
                                                                        <FontAwesomePicker
                                                                            style={{aspectRatio: 1, width: '100%', height: 'auto', justifyContent: 'center'}}
                                                                            label={tab.attributes?.fontawesome ? '' : 'Select FontAwesome Icon'}
                                                                            value={tab.attributes?.fontawesome || ''}
                                                                            onChange={(value) =>
                                                                                updateBlockAttributes(tab.clientId, {
                                                                                    icon: value || '',
                                                                                    fontawesome: value || '',
                                                                                })
                                                                            }
                                                                        />
                                                                        {tab.attributes?.fontawesome && (
                                                                            <div style={{ marginTop: '8px', padding: '8px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '2px', display: 'flex', justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto', alignItems: 'center', pointerEvents: 'none' }}>
                                                                                <i className={tab.attributes.fontawesome} style={{ fontSize: '32px', color: tab.attributes.iconColor }}></i>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                </div>
                                                            )}

                                                            {/* Icon color (used by frontend renderer for all icon types) */}
                                                            {tab.attributes?.showIcon === true && (
                                                                <>
                                                                    <p style={{ marginBottom: '4px' }}>Icon Color</p>
                                                                    <IconColor
                                                                        value={tab.attributes?.iconColor}
                                                                        onChange={(value) =>
                                                                            updateBlockAttributes(tab.clientId, {
                                                                                iconColor: value,
                                                                            })
                                                                        }
                                                                        themeColors={themeColors}
                                                                    />
                                                                </>
                                                            )}
                                                        </>
                                                    )}

                                                    
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Button variant="primary" onClick={addTab} style={{ marginTop: '16px' }}>
                                Add New Tab Item
                            </Button>
                        </PanelBody>

                        <PanelBody title="Tab settings" initialOpen={false}>
                            {/* position tab titles: left, center, right */}
                            <div className="madeit-control">
                                <ControlHeader
                                    title={ __( 'Justify items' ) }
                                    breakpoint={ activeDirectionBreakpoint }
                                    onBreakpointChange={ setActiveDirectionBreakpoint }
                                    onReset={ resetJustifyContent }
                                    resetLabel={ __( 'Reset justify items' ) }
                                />
                                <ButtonGroup className="madeit-control-buttonGroup">
                                    <Button
                                        icon={<JustifyStartIcon />}
                                        variant={currentJustifyContent === 'flex-start' ? 'primary' : 'secondary'}
                                        onClick={() =>
                                            setAttributes({
                                                [justifyContentValueKey]: 'flex-start',
                                            })
                                        }
                                        aria-label={ __( 'Justify start' ) }
                                    >
                                        
                                    </Button>
                                    <Button
                                        icon={<JustifyCenterIcon />}
                                        variant={currentJustifyContent === 'center' ? 'primary' : 'secondary'}
                                        onClick={() =>
                                            setAttributes({
                                                [justifyContentValueKey]: 'center',
                                            })
                                        }
                                        aria-label={ __( 'Justify center' ) }
                                    >
                                        
                                    </Button>
                                    <Button
                                        icon={<JustifyEndIcon />}
                                        variant={currentJustifyContent === 'flex-end' ? 'primary' : 'secondary'}
                                        onClick={() =>
                                            setAttributes({
                                                [justifyContentValueKey]: 'flex-end',
                                            })
                                        }
                                        aria-label={ __( 'Justify end' ) }
                                    >
                                        
                                    </Button>
                                </ButtonGroup>
                            </div>

                            {/* Tab display: default(top), left, right */}
                            <div className="madeit-control" style={{ marginTop: '16px' }}>
                                <ControlHeader 
                                    title="Tab position"
                                    breakpoint={ activeTabDisplayBreakpoint }
                                    onBreakpointChange={ setActiveTabDisplayBreakpoint }
                                    onReset={ resetTabPosition }
                                    resetLabel={ __( 'Reset tab position' ) }
                                />

                                <ButtonGroup className="madeit-control-buttonGroup">
                                    <Button
                                        icon={<TabTopIcon />}
                                        variant={currentTabPosition === 'top' ? 'primary' : 'secondary'}
                                        onClick={() =>
                                            setAttributes({
                                                [tabPositionValueKey]: 'top',
                                            })
                                        }
                                    >
                                    </Button>
                                    <Button
                                        icon={<TabLeftIcon />}
                                        variant={currentTabPosition === 'left' ? 'primary' : 'secondary'}
                                        onClick={() =>
                                            setAttributes({
                                                [tabPositionValueKey]: 'left',
                                            })
                                        }
                                    >
                                    </Button>
                                    <Button
                                        icon={<TabRightIcon />} 
                                        variant={currentTabPosition === 'right' ? 'primary' : 'secondary'}
                                        onClick={() =>
                                            setAttributes({
                                                [tabPositionValueKey]: 'right',
                                            })
                                        }
                                    >
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </PanelBody>
                    </>
                )}

                 {/* Style settings */}
                {activeTab === 'style' && (
                    <PanelBody title="Style settings" initialOpen={true}>
                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <ControlHeader 
                                title="Title styling"
                                onReset={ resetTitleStyling }
                                resetLabel={ __( 'Reset title styling' ) }
                            />
                            <Flex>
                                <>
                                <FlexItem>
                                    <SelectControl
                                        value={attributes?.titleFontSize || ''}
                                        options={[
                                            // add the options of H1 - H6 as font size options set as class on the frontend, plus a default option that resets to the default font size
                                            { label: 'p', value: '' },
                                            { label: 'H1', value: 'var(--wp--preset--font-size--h1)' },
                                            { label: 'H2', value: 'var(--wp--preset--font-size--h2)' },
                                            { label: 'H3', value: 'var(--wp--preset--font-size--h3)' },
                                            { label: 'H4', value: 'var(--wp--preset--font-size--h4)' },
                                            { label: 'H5', value: 'var(--wp--preset--font-size--h5)' },
                                            { label: 'H6', value: 'var(--wp--preset--font-size--h6)' },
                                        ]}
                                        onChange={(value) =>
                                            setAttributes({
                                                titleFontSize: value || undefined,
                                            })
                                        }
                                    />
                                </FlexItem>

                                <FlexItem>
                                    <ButtonGroup aria-label={ __( 'Title emphasis' ) }>
                                        <Button
                                            icon="editor-bold"
                                            variant={ attributes?.titleBold ? 'primary' : 'secondary' }
                                            aria-label={ __( 'Bold' ) }
                                            onClick={ () =>
                                                setAttributes( { titleBold: ! attributes?.titleBold } )
                                            }
                                        />
                                        <Button
                                            icon="editor-italic"
                                            variant={ attributes?.titleItalic ? 'primary' : 'secondary' }
                                            aria-label={ __( 'Italic' ) }
                                            onClick={ () =>
                                                setAttributes( { titleItalic: ! attributes?.titleItalic } )
                                            }
                                        />
                                        <Button
                                            icon="editor-underline"
                                            variant={ attributes?.titleUnderline ? 'primary' : 'secondary' }
                                            aria-label={ __( 'Underline' ) }
                                            onClick={ () =>
                                                setAttributes( { titleUnderline: ! attributes?.titleUnderline } )
                                            }
                                        />
                                    </ButtonGroup>
                                </FlexItem>
                                </>
                            </Flex>
                        </div>

                        

                        
                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <RangeControl
                                label="Spacing between titles (px)"
                                value={Number.isFinite(attributes?.titleGap) ? attributes.titleGap : 4}
                                onChange={(value) => setAttributes({ titleGap: value })}
                                min={0}
                                max={40}
                            />
                        </div>

                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <PanelColorSettings
                                style={{ padding: '0', borderTop: 'none'}}
                                initialOpen={ true }
                                colorSettings={ [
                                    {
                                        label: __( 'Active tab background' ),
                                        value: attributes?.activeTabBackgroundColor,
                                        onChange: ( value ) =>
                                            setAttributes( {
                                                activeTabBackgroundColor: value || undefined,
                                            } ),
                                    },
                                ] }
                            />
                        </div>

                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <PanelColorSettings
                                style={{ padding: '0', borderTop: 'none'}}
                                initialOpen={ true }
                                colorSettings={ [
                                    {
                                        label: __( 'Tab background' ),
                                        value: attributes?.inactiveTabBackgroundColor,
                                        onChange: ( value ) =>
                                            setAttributes( {
                                                inactiveTabBackgroundColor: value || undefined,
                                            } ),
                                    },
                                ] }
                            />
                        </div>

                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <PanelColorSettings
                                style={{ padding: '0', borderTop: 'none'}}
                                initialOpen={ true }
                                colorSettings={ [
                                    {
                                        label: __( 'Active tab text' ),
                                        value: attributes?.activeTabTextColor,
                                        onChange: ( value ) =>
                                            setAttributes( {
                                                activeTabTextColor: value || undefined,
                                            } ),
                                    },
                                ] }
                            />
                        </div>

                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <PanelColorSettings
                                style={{ padding: '0', borderTop: 'none'}}
                                initialOpen={ true }
                                colorSettings={ [
                                    {
                                        label: __( 'Inactive tab text' ),
                                        value: attributes?.inactiveTabTextColor,
                                        onChange: ( value ) =>
                                            setAttributes( {
                                                inactiveTabTextColor: value || undefined,
                                            } ),
                                    },
                                ] }
                            />
                        </div>

                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <PanelColorSettings
                                style={{ padding: '0', borderTop: 'none'}}
                                initialOpen={ true }
                                colorSettings={ [
                                    {
                                        label: __( 'Tab content background' ),
                                        value: attributes?.contentBackgroundColor,
                                        onChange: ( value ) =>
                                            setAttributes( {
                                                contentBackgroundColor: value || undefined,
                                            } ),
                                    },
                                ] }
                            />
                        </div>


                        <hr style={{ margin: '16px 0' }} />

                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <SelectControl
                                label="Title border"
                                value={titleBorderStyle}
                                options={[
                                    { label: 'None', value: 'none' },
                                    { label: 'Full', value: 'full' },
                                    { label: 'Top', value: 'top' },
                                    { label: 'Bottom', value: 'bottom' },
                                    { label: 'Left', value: 'left' },
                                    { label: 'Right', value: 'right' },
                                ]}
                                onChange={(value) => setAttributes({ titleBorderStyle: value })}
                            />
                        </div>

                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <PanelColorSettings
                                style={{ padding: '0', borderTop: 'none'}}
                                initialOpen={ true }
                                colorSettings={ [
                                    {
                                        label: __( 'Title border color' ),
                                        value: attributes?.titleBorderColor,
                                        onChange: ( value ) =>
                                            setAttributes( {
                                                titleBorderColor: value || undefined,
                                            } ),
                                    },
                                ] }
                            />
                        </div>

                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <RangeControl
                                label="Title border width (px)"
                                value={Number.isFinite(attributes?.titleBorderWidth) ? attributes.titleBorderWidth : 1}
                                onChange={(value) => setAttributes({ titleBorderWidth: value })}
                                min={0}
                                max={10}
                            />
                        </div>

                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <PanelColorSettings
                                style={{ padding: '0', borderTop: 'none'}}
                                initialOpen={ true }
                                colorSettings={ [
                                    {
                                        label: __( 'Content border color' ),
                                        value: attributes?.contentBorderColor,
                                        onChange: ( value ) =>
                                            setAttributes( {
                                                contentBorderColor: value || undefined,
                                            } ),
                                    },
                                ] }
                            />
                        </div>

                        <div className="madeit-control" style={{ marginTop: '16px' }}>
                            <RangeControl
                                label="Content border width (px)"
                                value={Number.isFinite(attributes?.contentBorderWidth) ? attributes.contentBorderWidth : 1}
                                onChange={(value) => setAttributes({ contentBorderWidth: value })}
                                min={0}
                                max={10}
                            />
                        </div>
                    </PanelBody>
                )}

                {/* Advanced settings */}
                {activeTab === 'advanced' && (
                    <>
                        <PanelBody title="Responsive" initialOpen={true}>
                            {/* Hide on Desktop */}
                            <ToggleControl
                                label={ __( 'Hide on Desktop' ) }
                                checked={ attributes.hideOnDesktop }
                                onChange={ () => setAttributes( { hideOnDesktop: ! attributes.hideOnDesktop } ) }
                            />

                            {/* Hide on Tablet */}
                            <ToggleControl
                                label={ __( 'Hide on Tablet' )}
                                checked={ attributes.hideOnTablet }
                                onChange={ () => setAttributes( { hideOnTablet: ! attributes.hideOnTablet } ) }
                            />

                            {/* Hide on Mobile */}
                            <ToggleControl
                                label={ __( 'Hide on Mobile' )}
                                checked={ attributes.hideOnMobile }
                                onChange={ () => setAttributes( { hideOnMobile: ! attributes.hideOnMobile } ) }
                            />

                        </PanelBody>

                        <PanelBody className="disabledPanel" title="Binnenkomende animatie" initialOpen={false}>
                            {/* Animatie type */}

                            {/* Animatie duur */}

                            {/* Animatie vertraging */}
                        </PanelBody>
                    </>
                )}
            </InspectorControls>

            <div { ...blockProps }>
                <ul className="nav nav-tabs" role="tablist">
                    {tabs.map((tab) => {
                        const tabTitle = tab.attributes?.title || 'Tab';
                        const showIcon = tab.attributes?.showIcon === true;
                        const iconType = tab.attributes?.iconType || 'fontawesome';
                        const iconValue = tab.attributes?.icon || '';
                        const iconColor = tab.attributes?.iconColor || '';
                        const isActive = attributes?.activeTabClientId
                            ? attributes.activeTabClientId === tab.clientId
                            : false;

                        return (
                            <li className="nav-item" key={tab.clientId}>
                                <a
                                    className={`nav-link${isActive ? ' active' : ''}`}
                                    role="tab"
                                    aria-selected={isActive ? 'true' : 'false'}
                                    href="#"
                                    data-toggle="tab"
                                    data-bs-toggle="tab"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setAttributes({ activeTabClientId: tab.clientId });
                                    }}
                                >
                                    {showIcon && (
                                        <span
                                            className="madeit-tab-icon"
                                            aria-hidden="true"
                                            style={iconColor ? { color: iconColor } : undefined}
                                        >
                                            {iconType === 'custom' && iconValue ? (
                                                <RawHTML>{iconValue}</RawHTML>
                                            ) : null}
                                            {iconType === 'fontawesome' && iconValue ? (
                                                <i className={iconValue}></i>
                                            ) : null}
                                            {iconType === 'dashicons' && iconValue ? (
                                                <span className={`dashicons dashicons-${iconValue}`}></span>
                                            ) : null}
                                        </span>
                                    )}
                                    <span className="madeit-tab-title">{tabTitle}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>

                <div className="tab-content">
                    <InnerBlocks
                        allowedBlocks={['madeit/block-tab']}
                        template={[['madeit/block-tab']]}
                        templateLock={false}
                        renderAppender={false}
                    />
                </div>
            </div>
        </>
    );
}

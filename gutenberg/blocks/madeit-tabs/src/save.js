import {
    useBlockProps,
    InnerBlocks
} from '@wordpress/block-editor';
import { createBlock, parse } from '@wordpress/blocks';

const LEGACY_TITLES_WRAPPER = 'madeit/block-tabs-titles';
const LEGACY_CONTENTS_WRAPPER = 'madeit/block-tabs-contents';
const LEGACY_TITLE_BLOCK = 'madeit/block-tabs-title';
const LEGACY_CONTENT_BLOCK = 'madeit/block-tabs-content';

const isMigrationDebugEnabled = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    if (window.MADEIT_TABS_MIGRATION_DEBUG === true) {
        return true;
    }

    try {
        return window.localStorage?.getItem('madeit-tabs-migration-debug') === '1';
    } catch (error) {
        return false;
    }
};

const logMigration = (message, payload) => {
    if (!isMigrationDebugEnabled()) {
        return;
    }

    if (typeof payload === 'undefined') {
        console.log('[madeit-tabs:migration]', message);
        return;
    }

    console.log('[madeit-tabs:migration]', message, payload);
};

const flattenBlocks = (blocks = []) => {
    return blocks.reduce((all, block) => {
        if (!block) return all;
        all.push(block);
        if (Array.isArray(block.innerBlocks) && block.innerBlocks.length) {
            all.push(...flattenBlocks(block.innerBlocks));
        }
        return all;
    }, []);
};

const normalizeLegacyTitle = (value) => {
    const raw = Array.isArray(value)
        ? value
            .map((part) => (typeof part === 'string' ? part : ''))
            .join('')
        : (value || '');

    return String(raw)
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();
};

const getLegacyTitleAndContentBlocks = (innerBlocks = []) => {
    const titlesWrapper = innerBlocks.find((block) => block?.name === LEGACY_TITLES_WRAPPER);
    const contentsWrapper = innerBlocks.find((block) => block?.name === LEGACY_CONTENTS_WRAPPER);

    const wrapperTitleBlocks = (titlesWrapper?.innerBlocks || []).filter(
        (block) => block?.name === LEGACY_TITLE_BLOCK
    );
    const wrapperContentBlocks = (contentsWrapper?.innerBlocks || []).filter(
        (block) => block?.name === LEGACY_CONTENT_BLOCK
    );

    if (wrapperTitleBlocks.length || wrapperContentBlocks.length) {
        logMigration('Legacy wrappers gevonden', {
            titleCount: wrapperTitleBlocks.length,
            contentCount: wrapperContentBlocks.length,
        });

        return {
            titleBlocks: wrapperTitleBlocks,
            contentBlocks: wrapperContentBlocks,
        };
    }

    const all = flattenBlocks(innerBlocks);

    const titleBlocks = all.filter((block) => block?.name === LEGACY_TITLE_BLOCK);
    const contentBlocks = all.filter((block) => block?.name === LEGACY_CONTENT_BLOCK);

    logMigration('Legacy blocks gevonden via flatten', {
        total: all.length,
        titleCount: titleBlocks.length,
        contentCount: contentBlocks.length,
    });

    return {
        titleBlocks,
        contentBlocks,
    };
};

const getMapKey = (tabId, fallbackIndex) => {
    const parsed = Number.parseInt(tabId, 10);
    return Number.isInteger(parsed) ? `id:${parsed}` : `index:${fallbackIndex}`;
};

const getAliasIdKey = (key, fallbackIndex) => {
    if (typeof key !== 'string' || !key.startsWith('index:')) {
        return null;
    }

    return Number.isInteger(fallbackIndex) ? `id:${fallbackIndex}` : null;
};

const migrateLegacyTabInnerBlocks = (innerBlocks = []) => {
    const { titleBlocks, contentBlocks } = getLegacyTitleAndContentBlocks(innerBlocks);

    logMigration('Start migrateLegacyTabInnerBlocks', {
        titleCount: titleBlocks.length,
        contentCount: contentBlocks.length,
    });

    if (!titleBlocks.length && !contentBlocks.length) {
        logMigration('Geen legacy blocks om te migreren');
        return innerBlocks;
    }

    const titleByKey = new Map();
    titleBlocks.forEach((block, index) => {
        const key = getMapKey(block?.attributes?.tabid, index);
        const value = normalizeLegacyTitle(block?.attributes?.content);

        titleByKey.set(key, value);

        const aliasKey = getAliasIdKey(key, index);
        if (aliasKey && !titleByKey.has(aliasKey)) {
            titleByKey.set(aliasKey, value);
        }
    });

    const contentByKey = new Map();
    contentBlocks.forEach((block, index) => {
        const key = getMapKey(block?.attributes?.tabid, index);
        contentByKey.set(key, block?.innerBlocks || []);
    });

    logMigration('Koppeling opgebouwd', {
        titleKeys: Array.from(titleByKey.keys()),
        contentKeys: Array.from(contentByKey.keys()),
    });

    const orderedKeys = [];
    contentByKey.forEach((_, key) => orderedKeys.push(key));
    titleByKey.forEach((_, key) => {
        if (!orderedKeys.includes(key)) {
            orderedKeys.push(key);
        }
    });

    if (!orderedKeys.length) {
        logMigration('Geen keys voor migratie, originele innerBlocks blijven staan');
        return innerBlocks;
    }

    logMigration('Migratie output keys', {
        orderedKeys,
    });

    return orderedKeys.map((key) => createBlock('madeit/block-tab', {
        ...(titleByKey.get(key) ? { title: titleByKey.get(key) } : {}),
    }, contentByKey.get(key) || []));
};

const hasLegacyTabs = (innerBlocks = []) => {
    const all = flattenBlocks(innerBlocks);
    const found = all.some((block) => {
        const name = block?.name;
        return (
            name === LEGACY_TITLES_WRAPPER ||
            name === LEGACY_CONTENTS_WRAPPER ||
            name === LEGACY_TITLE_BLOCK ||
            name === LEGACY_CONTENT_BLOCK
        );
    });

    logMigration('hasLegacyTabs check', {
        blockCount: all.length,
        found,
    });

    return found;
};

const parseLegacyTabCommentsFromRaw = (innerBlocks = []) => {
    const all = flattenBlocks(innerBlocks);
    const raw = all
        .map((block) => block?.originalContent || block?.attributes?.originalContent || '')
        .join('\n');

    if (!raw.includes('madeit/block-tabs-title') && !raw.includes('madeit/block-tabs-content')) {
        logMigration('Geen legacy comments in raw content');
        return [];
    }

    const parsedBlocks = parse(raw);
    const migrated = migrateLegacyTabInnerBlocks(parsedBlocks);

    logMigration('Raw comment parse uitgevoerd', {
        rawLength: raw.length,
        parsedCount: Array.isArray(parsedBlocks) ? parsedBlocks.length : 0,
        migratedCount: Array.isArray(migrated) ? migrated.length : 0,
    });

    return migrated;
};

export default function Save({ attributes }) {
    const {
        hideOnDesktop,
        hideOnTablet,
        hideOnMobile,
        justifyContent = 'flex-start',
        justifyContentTablet,
        justifyContentMobile,
        tabPosition,
        tabPositionTablet,
        tabPositionMobile,

        titleFontSize,
        titleBold,
        titleItalic,
        titleUnderline,
        titleGap,

        activeTabBackgroundColor,
        activeTabTextColor,
        inactiveTabBackgroundColor,
        inactiveTabTextColor,
        contentBackgroundColor,

        titleBorderStyle = 'full',
        titleBorderColor,
        titleBorderWidth = 1,
        contentBorderColor,
        contentBorderWidth = 1,
    } = attributes;

    const justifyDesktop = justifyContent || 'flex-start';
    const justifyTablet = justifyContentTablet ?? justifyDesktop;
    const justifyMobile = justifyContentMobile ?? justifyTablet;

    const safeTitleBorderWidth = Number.isFinite(titleBorderWidth) ? Math.max(0, titleBorderWidth) : 1;
    const safeContentBorderWidth = Number.isFinite(contentBorderWidth)
        ? Math.max(0, contentBorderWidth)
        : 1;

    const titleBorderSideWidths = (() => {
        switch (titleBorderStyle) {
            case 'top':
                return { top: safeTitleBorderWidth, right: 0, bottom: 0, left: 0 };
            case 'bottom':
                return { top: 0, right: 0, bottom: safeTitleBorderWidth, left: 0 };
            case 'left':
                return { top: 0, right: 0, bottom: 0, left: safeTitleBorderWidth };
            case 'right':
                return { top: 0, right: safeTitleBorderWidth, bottom: 0, left: 0 };
            case 'full':
            default:
                return {
                    top: safeTitleBorderWidth,
                    right: safeTitleBorderWidth,
                    bottom: safeTitleBorderWidth,
                    left: safeTitleBorderWidth,
                };
        }
    })();

    const classes = [
        'madeit-tabs',
        hideOnDesktop ? 'is-hidden-desktop' : null,
        hideOnTablet ? 'is-hidden-tablet' : null,
        hideOnMobile ? 'is-hidden-mobile' : null,

        tabPosition && `is-tab-position-desktop-${tabPosition}`,
        tabPositionTablet && `is-tab-position-tablet-${tabPositionTablet}`,
        tabPositionMobile && `is-tab-position-mobile-${tabPositionMobile}`,
    ]
        .filter(Boolean)
        .join(' ');

    const blockProps = useBlockProps.save({
        style: {
            '--madeit-tabs-justify-desktop': justifyDesktop,
            '--madeit-tabs-justify-tablet': justifyTablet,
            '--madeit-tabs-justify-mobile': justifyMobile,

            ...(titleFontSize ? { '--madeit-tabs-title-font-size': titleFontSize } : {}),
            ...(titleBold ? { '--madeit-tabs-title-font-weight': '700' } : {}),
            ...(titleItalic ? { '--madeit-tabs-title-font-style': 'italic' } : {}),
            ...(titleUnderline ? { '--madeit-tabs-title-text-decoration': 'underline' } : {}),
            ...(Number.isFinite(titleGap) ? { '--madeit-tabs-title-gap': `${titleGap}px` } : {}),

            ...(activeTabBackgroundColor
                ? { '--madeit-tabs-tab-active-bg': activeTabBackgroundColor }
                : {}),
            ...(activeTabTextColor ? { '--madeit-tabs-tab-active-color': activeTabTextColor } : {}),
            ...(inactiveTabBackgroundColor ? { '--madeit-tabs-tab-bg': inactiveTabBackgroundColor } : {}),
            ...(inactiveTabTextColor ? { '--madeit-tabs-tab-color': inactiveTabTextColor } : {}),
            ...(contentBackgroundColor ? { '--madeit-tabs-content-bg': contentBackgroundColor } : {}),

            ...(titleBorderColor ? { '--madeit-tabs-title-border-color': titleBorderColor } : {}),
            '--madeit-tabs-title-border-top-width': `${titleBorderSideWidths.top}px`,
            '--madeit-tabs-title-border-right-width': `${titleBorderSideWidths.right}px`,
            '--madeit-tabs-title-border-bottom-width': `${titleBorderSideWidths.bottom}px`,
            '--madeit-tabs-title-border-left-width': `${titleBorderSideWidths.left}px`,
            '--madeit-tabs-nav-border-width': `${titleBorderSideWidths.bottom}px`,
            '--madeit-tabs-nav-border-top-width': `${titleBorderSideWidths.top}px`,
            '--madeit-tabs-nav-border-right-width': `${titleBorderSideWidths.right}px`,
            '--madeit-tabs-nav-border-bottom-width': `${titleBorderSideWidths.bottom}px`,
            '--madeit-tabs-nav-border-left-width': `${titleBorderSideWidths.left}px`,

            ...(contentBorderColor ? { '--madeit-tabs-content-border-color': contentBorderColor } : {}),
            '--madeit-tabs-content-border-width': `${safeContentBorderWidth}px`,
        },
    });
    const className = [blockProps.className, classes].filter(Boolean).join(' ');

    return (
        <div
            {...blockProps}
            className={className}
        >
            <InnerBlocks.Content />
        </div>
    );
}

export const deprecated = [
    {
        save({ attributes }) {
            const { hideOnDesktop, hideOnTablet, hideOnMobile } = attributes;

            const classes = [
                'madeit-tabs',
                hideOnDesktop ? 'is-hidden-desktop' : null,
                hideOnTablet ? 'is-hidden-tablet' : null,
                hideOnMobile ? 'is-hidden-mobile' : null,
            ]
                .filter(Boolean)
                .join(' ');

            const blockProps = useBlockProps.save();
            const className = [blockProps.className, classes]
                .filter(Boolean)
                .join(' ');

            return (
                <div {...blockProps} className={className}>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
    {
        attributes: {
            aantaltabs: {
                type: 'number',
                default: 3,
            },
        },
        isEligible(attributes, innerBlocks) {
            logMigration('deprecated.isEligible start', {
                attributeKeys: Object.keys(attributes || {}),
                innerBlocksCount: Array.isArray(innerBlocks) ? innerBlocks.length : 0,
            });

            if (hasLegacyTabs(innerBlocks)) {
                logMigration('deprecated.isEligible: true via hasLegacyTabs');
                return true;
            }

            const parsed = parseLegacyTabCommentsFromRaw(innerBlocks);
            const eligible = Array.isArray(parsed) && parsed.length > 0;

            logMigration('deprecated.isEligible resultaat', {
                eligible,
                parsedCount: Array.isArray(parsed) ? parsed.length : 0,
            });

            return eligible;
        },
        migrate(attributes, innerBlocks) {
            logMigration('deprecated.migrate start', {
                attributeKeys: Object.keys(attributes || {}),
                innerBlocksCount: Array.isArray(innerBlocks) ? innerBlocks.length : 0,
            });

            let migrated = migrateLegacyTabInnerBlocks(innerBlocks);

            if (migrated === innerBlocks) {
                const fromRaw = parseLegacyTabCommentsFromRaw(innerBlocks);
                if (Array.isArray(fromRaw) && fromRaw.length > 0) {
                    migrated = fromRaw;
                }
            }

            logMigration('deprecated.migrate resultaat', {
                migratedCount: Array.isArray(migrated) ? migrated.length : 0,
                usedOriginalReference: migrated === innerBlocks,
                migratedBlockNames: Array.isArray(migrated)
                    ? migrated.map((block) => block?.name)
                    : [],
            });

            return [attributes, migrated];
        },
        save({ className }) {
            return (
                <div className={className}>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
    {
        save() {
            return (
                <div className="madeit-tabs">
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
];

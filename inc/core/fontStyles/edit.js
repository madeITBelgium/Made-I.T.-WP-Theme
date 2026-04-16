
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { Fragment, useState, useEffect, createElement } = wp.element;
const apiFetch = wp.apiFetch;

//const blockEditor = wp.blockEditor || wp.editor;
const { InspectorControls } = wp.blockEditor; //= blockEditor;

const {
    PanelBody,
    TextControl,
    Button,
    Spinner,
    Notice,
    FormFileUpload,
    __experimentalToolsPanelItem,
} = wp.components;

const TARGET_BLOCKS = [
    'core/paragraph',
    'core/heading',
    'core/list',
    'core/quote',
    'core/code',
    'core/preformatted',
    'core/pullquote',
    'core/table',
    'core/verse',
];

const ALLOWED_EXTENSIONS = ['otf', 'ttf', 'woff', 'woff2'];
const LOCAL_FONTS_UPLOAD_URL = '/thema-1/v1/fonts/upload';

function ensureFontUploadStyles() {
    try {
        if (!document || document.getElementById('madeit-font-upload-styles')) return;
        const styleEl = document.createElement('style');
        styleEl.id = 'madeit-font-upload-styles';
        styleEl.textContent = `
            .components-panel__body { grid-column: 1 / -1; grid-row: 2; }
            .madeit-font-upload-tools-panel-item .components-panel__body { grid-column: 1 / -1; }
        `;
        document.head.appendChild(styleEl);
    } catch (e) {
        // no-op
    }
}

ensureFontUploadStyles();

function slugify(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/['"`]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function formatFontFamilyCSS(fontName) {
    const name = String(fontName || '').trim();
    if (!name) return '';
    return /\s/.test(name) ? `"${name}"` : name;
}

function humanizeFontFamilyName(value) {
    return String(value || '')
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .trim();
}

function inferFontVariantFromFilename(filename) {
    const base = String(filename || '').replace(/\.[^/.]+$/, '');
    const lower = base.toLowerCase();

    // Style
    let fontStyle = 'normal';
    if (lower.includes('italic')) {
        fontStyle = 'italic';
    } else if (lower.includes('oblique')) {
        fontStyle = 'oblique';
    }

    // Weight
    let fontWeight = '400';
    const numericMatch = lower.match(/(^|[^0-9])([1-9]00)([^0-9]|$)/);
    if (numericMatch?.[2]) {
        fontWeight = numericMatch[2];
    } else {
        const weightMap = [
            { re: /(thin|hairline)/, value: '100' },
            { re: /(extra\s*light|ultra\s*light|extralight|ultralight)/, value: '200' },
            { re: /(light)/, value: '300' },
            { re: /(regular|normal|book|roman)/, value: '400' },
            { re: /(medium)/, value: '500' },
            { re: /(semi\s*bold|demi\s*bold|semibold|demibold)/, value: '600' },
            { re: /(bold)/, value: '700' },
            { re: /(extra\s*bold|ultra\s*bold|extrabold|ultrabold)/, value: '800' },
            { re: /(black|heavy)/, value: '900' },
        ];
        const hit = weightMap.find((w) => w.re.test(lower));
        if (hit) fontWeight = hit.value;
    }

    // Family name guess: take first chunk before '-' or '_' (common font naming), otherwise use full base.
    const normalized = base.replace(/_+/g, '-');
    const chunks = normalized.split('-').filter(Boolean);
    const familyChunk = chunks.length ? chunks[0] : base;
    const familyName = humanizeFontFamilyName(familyChunk);

    return {
        familyName,
        fontWeight,
        fontStyle,
    };
}

function inferFamilyNameFromFiles(files) {
    const names = (files || [])
        .map((f) => inferFontVariantFromFilename(f?.name || '').familyName)
        .filter(Boolean);

    if (!names.length) return '';
    const unique = Array.from(new Set(names));
    return unique.length === 1 ? unique[0] : unique[0];
}

function UploadFontFamily() {
    const [name, setName] = useState('');
    const [files, setFiles] = useState([]);
    const [isBusy, setIsBusy] = useState(false);
    const [notice, setNotice] = useState(null); // { status, message }

    const onPickFile = (event) => {
        const pickedFiles = Array.from(event?.target?.files || []);
        if (!pickedFiles.length) return;
        setNotice(null);

        const invalid = pickedFiles.find((f) => {
            const ext = (f.name.split('.').pop() || '').toLowerCase();
            return !ALLOWED_EXTENSIONS.includes(ext);
        });
        if (invalid) {
            setFiles([]);
            setNotice({ status: 'error', message: __('Ongeldig bestandstype. Gebruik otf, ttf, woff of woff2.', 'madeit') });
            return;
        }

        setFiles(pickedFiles);

        // Infer family from file(s)
        const inferredFamily = inferFamilyNameFromFiles(pickedFiles);
        if (inferredFamily && !name) {
            setName(inferredFamily);
        } else if (!name && pickedFiles[0]?.name) {
            setName(humanizeFontFamilyName(pickedFiles[0].name));
        }
    };

    const uploadLocalFontFile = async (fontFile) => {
        if (!fontFile) {
            throw new Error(__('Kies eerst één of meerdere fontbestanden.', 'madeit'));
        }

        const body = new FormData();
        body.append('file', fontFile, fontFile.name);

        // Optional: keep this value for future use; server currently infers family/weight/style from the filename.
        const familyName = String(name || '').trim();
        if (familyName) {
            body.append('family', familyName);
        }

        return apiFetch({
            path: LOCAL_FONTS_UPLOAD_URL,
            method: 'POST',
            body,
        });
    };

    const onUpload = async () => {
        setIsBusy(true);
        setNotice(null);
        try {
            if (!files.length) {
                throw new Error(__('Kies eerst één of meerdere fontbestanden.', 'madeit'));
            }

            for (const f of files) {
                await uploadLocalFontFile(f);
            }

            setNotice({
                status: 'success',
                message: __('Font(s) geüpload naar het child theme (assets/fonts) en toegevoegd aan theme.json. Herlaad de editor om ze meteen in de dropdown te zien.', 'madeit'),
            });
        } catch (e) {
            const message = e?.message || __('Upload mislukt.', 'madeit');
            setNotice({ status: 'error', message });
        } finally {
            setIsBusy(false);
        }
    };

    const el = createElement;

    // In the Typography panel (ToolsPanel), PanelBody nesting is awkward.
    // We render a compact control block instead.
    return el(
        Fragment,
        null,
        notice
            ? el(
                Notice,
                {
                    status: notice.status,
                    isDismissible: true,
                    onRemove: () => setNotice(null),
                },
                notice.message
            )
            : null,
        el(TextControl, {
            label: __('Font naam', 'madeit'),
            value: name,
            onChange: (val) => {
                setName(val);
            },
            help: __('Wordt automatisch uit de bestandsnaam gehaald (bv. Mayfest.ttf).', 'madeit'),
        }),
        el(
            FormFileUpload,
            {
                accept: ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(','),
                onChange: onPickFile,
                disabled: isBusy,
                multiple: true,
            },
            files.length
                ? (files.length === 1
                    ? __('Bestand gekozen: ', 'madeit') + files[0].name
                    : __('Bestanden gekozen: ', 'madeit') + files.length)
                : __('Kies fontbestand(en)…', 'madeit')
        ),
        el(
            'div',
            { style: { marginTop: '12px' } },
            el(
                Button,
                {
                    variant: 'primary',
                    onClick: onUpload,
                    disabled: isBusy || !files.length,
                },
                isBusy ? __('Uploaden…', 'madeit') : __('Upload', 'madeit')
            ),
            isBusy ? el(Spinner, null) : null
        )
    );
}

function UploadFontFamilyTypographyItem() {
    const el = createElement;

    const [hasFontFamilyControl, setHasFontFamilyControl] = useState(false);

    // Only show this upload UI when the core font family control exists in the current Typography panel.
    // This matches the request: show only if `.block-editor-font-family-control` is present.
    useEffect(() => {
        const check = () => {
            setHasFontFamilyControl(!!document.querySelector('.block-editor-font-family-control'));
        };

        check();

        const observer = new MutationObserver(check);
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    if (!hasFontFamilyControl) {
        return null;
    }

    if (typeof __experimentalToolsPanelItem !== 'function') {
        // Fallback: still show something if ToolsPanelItem isn't available.
        return el(
            PanelBody,
            { title: __('Upload font', 'madeit'), initialOpen: false, style: { gridColumn: '1 / -1' } },
            el(UploadFontFamily, null)
        );
    }

    return el(
        __experimentalToolsPanelItem,
        {
            label: __('Upload font', 'madeit'),
            hasValue: () => false,
            onDeselect: () => {},
            isShownByDefault: true,
            panelId: 'typography',
            className: 'madeit-font-upload-tools-panel-item',
        },
        el(UploadFontFamily, null)
    );
}

const withFontUploadInspector = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (!TARGET_BLOCKS.includes(props.name)) {
            return createElement(BlockEdit, props);
        }

        return createElement(
            Fragment,
            null,
            createElement(BlockEdit, props),
            createElement(
                InspectorControls,
                { group: 'typography' },
                createElement(UploadFontFamilyTypographyItem, null)
            )
        );
    };
}, 'withFontUploadInspector');

addFilter(
    'editor.BlockEdit',
    'madeit/fontstyles/upload-font-family',
    withFontUploadInspector
);
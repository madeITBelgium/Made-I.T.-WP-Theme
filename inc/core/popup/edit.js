const { ToolbarButton, ToolbarGroup, Modal } = wp.components;

//const blockEditor = wp.blockEditor || wp.editor;
const { BlockControls } = wp.blockEditor; //= blockEditor;

const TARGET_BLOCK = 'core/button';

/**
 * Attributes toevoegen
 */
addFilter(
    'blocks.registerBlockType',
    'madeit/add-popup-attributes',
    (settings, name) => {
        if (name !== TARGET_BLOCK) return settings;

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                hasPopup: { type: 'boolean', default: false },
                popupId: { type: 'number', default: 0 }
            }
        };
    }
);

/**
 * HOC
 */
const withPopupToolbarButton = createHigherOrderComponent((BlockEdit) => {
    return (props) => {

        if (props.name !== TARGET_BLOCK) {
            return createElement(BlockEdit, props);
        }

        const { attributes, setAttributes } = props;
        const { hasPopup, popupId } = attributes;

        const [isOpen, setIsOpen] = useState(false);
        const [selectedPopupId, setSelectedPopupId] = useState(popupId || 0);
        const [popups, setPopups] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const [errorMessage, setErrorMessage] = useState('');
        const [view, setView] = useState('select'); // select | edit

        /**
         * Popups ophalen
         */
        useEffect(() => {
            if (!isOpen) return;

            setIsLoading(true);
            setErrorMessage('');

            apiFetch({
                path: '/wp/v2/popup?per_page=100&_fields=id,title'
            })
            .then((data) => {
                setPopups(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                setErrorMessage('Fout bij ophalen van popups.');
            })
            .finally(() => {
                setIsLoading(false);
            });

        }, [isOpen]);

        /**
         * Nieuwe popup maken
         */
        const createNewPopup = () => {
            apiFetch({
                path: '/wp/v2/popup',
                method: 'POST',
                data: {
                    title: 'Nieuwe popup',
                    status: 'draft'
                }
            })
            .then((data) => {
                if (!data?.id) throw new Error();

                setPopups(prev => [data, ...prev]);
                setSelectedPopupId(data.id);
                setView('edit'); // direct naar iframe
            })
            .catch(() => {
                alert('Fout bij aanmaken popup.');
            });
        };

        /**
         * Popup koppelen
         */
        const savePopup = () => {
            setAttributes({
                hasPopup: true,
                popupId: selectedPopupId
            });

            setIsOpen(false);
            setView('select');
        };

        return createElement(
            Fragment,
            null,

            // Toolbar knop
            createElement(
                BlockControls,
                null,
                createElement(
                    ToolbarGroup,
                    null,
                    createElement(ToolbarButton, {
                        className: hasPopup ? 'has-popup' : '',
                        icon: 'welcome-view-site',
                        label: 'Popup',
                        text: hasPopup ? 'Popup bewerken' : 'Popup toevoegen',
                        isPressed: !!hasPopup,
                        onClick: () => setIsOpen(true),
                    })
                )
            ),

            createElement(BlockEdit, props),

            // Modal
            isOpen && createElement(
                Modal,
                {
                    title: null,
                    // title: view === 'edit' ? 'Popup bewerken' : 'Popup koppelen',
                    onRequestClose: () => {
                        setIsOpen(false);
                        setView('select');
                    },
                    className: 'madeit-popup-modal',
                    style: { width: '90vw', height: '90vh' }
                },

                // 👇 Eigen header
                createElement(
                    'div',
                    {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #ddd',
                            paddingBottom: '10px',
                            marginBottom: '20px'
                        }
                    },

                    createElement(
                        'h2',
                        { style: { margin: 0 } },
                        view === 'edit' ? 'Popup bewerken' : 'Popup koppelen'
                    ),

                    createElement(
                        'div',
                        null,

                        // only show "Vorige" in edit view
                        view === 'edit' &&
                        createElement(
                            Button,
                            {
                                variant: 'primary',
                                onClick: () => {
                                    if (view === 'edit') {
                                        setView('select');
                                    } else {
                                        savePopup();
                                    }
                                },
                                style: { marginRight: '10px' }
                            },
                            'Vorige'
                        ),

                        createElement(
                            Button,
                            {
                                variant: 'secondary',
                                onClick: createNewPopup,
                                style: { marginRight: '10px' }
                            },
                            'Nieuwe popup aanmaken'
                        ),

                        createElement(
                            Button,
                            {
                                variant: '',
                                style: { backgroundColor: 'transparent', border: 'none', color: '#888', fontSize: '25px' },
                                onClick: () => {
                                    setIsOpen(false);
                                    setView('select');
                                }
                            },
                            'x'
                        )
                    )
                ),

                // === SELECT VIEW ===
                view === 'select' && createElement(
                    Fragment,
                    null,

                    errorMessage && createElement(Notice, { status: 'error' }, errorMessage),
                    isLoading && createElement(Spinner),

                    createElement(SelectControl, {
                        label: 'Kies een popup',
                        value: String(selectedPopupId),
                        options: [
                            { label: 'Selecteer...', value: '0' },
                            ...popups.map(p => ({
                                label: p.title?.rendered || `Popup #${p.id}`,
                                value: String(p.id)
                            }))
                        ],
                        onChange: (value) => {
                            setSelectedPopupId(parseInt(value, 10) || 0);
                        }
                    }),


                    selectedPopupId > 0 &&
                    createElement(
                        Button,
                        {
                            variant: 'secondary',
                            onClick: () => setView('edit'),
                            style: { marginTop: '10px', marginRight: '10px' }
                        },
                        'Popup bewerken'
                    ),

                    view === 'select' && hasPopup &&
                    createElement(
                        Button,
                        {
                            variant: 'secondary',
                            onClick: () => {
                                setSelectedPopupId(0);
                                setAttributes({
                                    hasPopup: false,
                                    popupId: 0
                                });
                                setIsOpen(false);
                            },
                            style: { marginTop: '10px', marginRight: '10px' }
                        },
                        'Popup verwijderen'
                    ),

                    createElement(
                        Button,
                        {
                            variant: 'primary',
                            onClick: savePopup,
                            style: { marginTop: '10px' }
                        },
                        'Opslaan'
                    )
                ),

                // === EDIT VIEW (IFRAME) ===
                view === 'edit' && selectedPopupId > 0 &&
                createElement(
                    Fragment,
                    null,

                    createElement('iframe', {
                        src: `/wp-admin/post.php?post=${selectedPopupId}&action=edit`,
                        style: {
                            width: '100%',
                            height: '75vh',
                            border: '1px solid #ddd'
                        }
                    })
                )
            )
        );
    };
}, 'withPopupToolbarButton');

addFilter(
    'editor.BlockEdit',
    'madeit/add-popup-toolbar-button',
    withPopupToolbarButton
);

// CSS voor de toolbar knop als er een popup is gekoppeld
const style = document.createElement('style');
style.innerHTML = `
    button.has-popup {
        padding: 0 10px 0 5px !important;
        min-width: 146px;
    }
    button.has-popup::before {
        background-color: #1cacb4 !important;
    }


    .components-modal__frame.madeit-popup-modal .components-modal__header {
        display: none;
    }
    .components-modal__frame.madeit-popup-modal .components-modal__content {
        margin-top: 20px;
    }
`;
document.head.appendChild(style);
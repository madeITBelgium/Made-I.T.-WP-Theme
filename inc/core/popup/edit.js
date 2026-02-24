const { SelectControl } = wp.components;

const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;

// WordPress exposes editor components on wp.blockEditor (WP 5.3+) and historically on wp.editor.
const blockEditor = wp.blockEditor || wp.editor;
const { BlockControls } = blockEditor;

const { ToolbarButton, ToolbarGroup, Modal, Button } = wp.components;
const { Fragment, useState, createElement } = wp.element;

const TARGET_BLOCK = 'core/button';

const addPopupAttributes = (settings, name) => {
    if (name !== TARGET_BLOCK) {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            hasPopup: {
                type: 'boolean',
                default: false
            },
            popupContent: {
                type: 'string',
                default: ''
            }
        }
    };
};

addFilter(
    'blocks.registerBlockType',
    'madeit/add-popup-attributes',
    addPopupAttributes
);

// get all the popups from the database and show them in a select dropdown, or allow the user to create a new one by entering content in a textarea



const withPopupToolbarButton = createHigherOrderComponent((BlockEdit) => {
    return (props) => {

        if (props.name !== TARGET_BLOCK) {
            return createElement(BlockEdit, props);
        }

        // If editor primitives are not available for some reason, don't break the editor UI.
        if (!BlockControls || !ToolbarButton || !ToolbarGroup) {
            return createElement(BlockEdit, props);
        }

        const { attributes, setAttributes } = props;
        const { hasPopup, popupContent } = attributes;

        const [isOpen, setIsOpen] = useState(false);
        const [tempContent, setTempContent] = useState(popupContent || '');

        const savePopup = () => {
            setAttributes({
                hasPopup: true,
                popupContent: tempContent
            });
            setIsOpen(false);
        };

        return createElement(
            Fragment,
            null,
            createElement(
                BlockControls,
                null,
                createElement(
                    ToolbarGroup,
                    {
                        className: 'madeit-popup-toolbar-group',
                        style: { background: 'grey', borderRadius: '4px', color: 'white' }
                    },
                    null,
                    createElement(ToolbarButton, {
                        icon: 'welcome-view-site',
                        label: 'Popup toevoegen',
                        text: 'Popup toevoegen',
                        isPressed: !!hasPopup,
                        onClick: () => setIsOpen(true),
                    })
                )
            ),
            createElement(BlockEdit, props),
            isOpen
                ? createElement(
                    Modal,
                    {
                        title: 'Popup toevoegen',
                        onRequestClose: () => setIsOpen(false),
                    },

                    //TODO: FIX this, we need to fetch the popups from the database and show them in a select dropdown, or allow the user to create a new one by entering content in a textarea
                    createElement(SelectControl, {
                        label: 'Kies jouw popup',
                        value: '',
                        options: [
                            { label: 'Kies jouw popup', value: 0 },
                            ...popup.map((popup) => ({
                                label: popup.name,
                                value: popup.id,
                            })),
                        ],
                        onChange: (value) => {
                            const selectedPopup = popup.find(p => p.id === parseInt(value, 10));
                            if (selectedPopup) {
                                setTempContent(selectedPopup.content);
                            }
                        },
                    }),

                    // Nieuw popup aanmaken
                    createElement(Button, {
                        variant: 'primary',
                        onClick: () => {
                            apiFetch({ path: '/madeit/v1/popups', method: 'POST' })
                                .then((data) => {
                                    if (!data || !data.id) {
                                        throw new Error();
                                    }
                                    // Nieuwe popup content instellen
                                    setTempContent(data.content);
                                })
                                .catch(() => {
                                    alert('Er is een fout opgetreden bij het aanmaken van de popup.');
                                });
                        },
                    }, 'Nieuw popup'    
                    ),

                    createElement(Button, {
                        variant: 'secondary',
                        onClick: () => setIsOpen(false),
                        style: { marginLeft: '10px' }
                    }, 'Annuleren'),
                    createElement(Button, {
                        variant: 'primary',
                        onClick: savePopup,
                        style: { marginLeft: '10px' }
                    }, 'Opslaan')
                )
                : null
        );
    };
}, 'withPopupToolbarButton');

addFilter(
    'editor.BlockEdit',
    'madeit/add-popup-toolbar-button',
    withPopupToolbarButton
);
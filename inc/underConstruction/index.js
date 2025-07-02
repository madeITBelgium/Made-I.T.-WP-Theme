jQuery(document).ready(function ($) {
    let logo_frame;
    let background_frame;

    $('#upload_logo_button').on('click', function (e) {
        e.preventDefault();

        // Als het frame al bestaat, open het
        if (logo_frame) {
            logo_frame.open();
            return;
        }

        // Maak nieuw media frame
        logo_frame = wp.media({
            title: 'Kies een logo',
            button: {
                text: 'Gebruik dit logo'
            },
            multiple: false
        });

        // Als een afbeelding gekozen is
        logo_frame.on('select', function () {
            const attachment = logo_frame.state().get('selection').first().toJSON();
            $('#under_construction_logo').val(attachment.url);
        });

        logo_frame.open();
    });

    $('#upload_background_image_button').on('click', function (e) {
        e.preventDefault();

        // Als het frame al bestaat, open het
        if (background_frame) {
            background_frame.open();
            return;
        }

        // Maak nieuw media frame
        background_frame = wp.media({
            title: 'Kies een achtergrondafbeelding',
            button: {
                text: 'Gebruik deze afbeelding'
            },
            multiple: false
        });

        // Als een afbeelding gekozen is
        background_frame.on('select', function () {
            const attachment = background_frame.state().get('selection').first().toJSON();
            $('#under_construction_background_image').val(attachment.url);
        });

        background_frame.open();
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Tabs
    const tabs = document.querySelectorAll('.nav-tab');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('nav-tab-active'));
            panes.forEach(p => p.classList.remove('active'));

            this.classList.add('nav-tab-active');
            const target = this.getAttribute('href').substring(1);
            document.getElementById(target).classList.add('active');
        });
    });

    // Accordion
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function () {
            accordionButtons.forEach(btn => {
                if (btn !== this) {
                    btn.classList.remove('collapsed');
                    const target = btn.getAttribute('data-bs-target');
                    if (document.querySelector(target)) {
                        document.querySelector(target).classList.remove('show');
                    }
                }
            });
        });
    });

    // Template radio buttons
    const radioButtons = document.querySelectorAll('input[name="under_construction_template"]');

    function updateActiveState() {
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });

        radioButtons.forEach(radio => {
            if (radio.checked) {
                const item = radio.closest('.template-item');
                if (item) {
                    item.classList.add('active');
                }
            }
        });
    }

    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateActiveState);
    });

    updateActiveState();

    // Tekst color
    const bgColorInput = document.getElementById('under_construction_background_color');
    const textColorInput = document.getElementById('under_construction_text_color');

    function getContrastYIQ(hexcolor) {
        hexcolor = hexcolor.replace('#', '');
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#000000' : '#ffffff'; // zwart of wit
    }

    function updateTextColor() {
        const bgColor = bgColorInput.value;
        const contrastColor = getContrastYIQ(bgColor);
        textColorInput.value = contrastColor;
    }

    if (bgColorInput) {
        updateTextColor(); // initieel bij laden
        bgColorInput.addEventListener('input', updateTextColor);
    }
});

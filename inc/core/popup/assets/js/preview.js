(function () {
    'use strict';

    function init() {
        const panel = document.getElementById('mp-popup-preview-panel');
        if (!panel) {
            return;
        }

        const __ = wp.i18n.__;
        const frame = panel.querySelector('iframe');
        const status = panel.querySelector('[data-preview-status]');
        const live = panel.querySelector('[data-preview-live]');
        let timer;
        let controller;
        let lastState = '';
        let started = false;

        function readState() {
            const editor = wp.data.select('core/editor');
            const isBlockEditor = editor && editor.getCurrentPostId() === Number(panel.dataset.postId);
            const classicTitle = document.getElementById('title');
            const classicContent = document.getElementById('content');
            const tinyEditor = window.tinymce && window.tinymce.get('content');
            const css = document.querySelector('[data-key="field_popup_custom_css"] textarea');
            return {
                title: isBlockEditor ? editor.getEditedPostAttribute('title') : (classicTitle ? classicTitle.value : ''),
                content: isBlockEditor ? editor.getEditedPostContent() : (
                    tinyEditor && !tinyEditor.isHidden() ? tinyEditor.getContent() : (classicContent ? classicContent.value : '')
                ),
                css: css ? css.value : ''
            };
        }

        async function refresh() {
            started = true;
            clearTimeout(timer);
            if (controller) {
                controller.abort();
            }
            controller = new AbortController();
            const request = controller;
            status.classList.remove('is-error');
            status.textContent = __('Voorbeeld laden...', 'madeit');
            panel.setAttribute('aria-busy', 'true');
            const state = readState();
            lastState = JSON.stringify(state);
            const body = new URLSearchParams({
                post_id: panel.dataset.postId,
                nonce: panel.dataset.nonce,
                ...state
            });

            try {
                const response = await fetch(panel.dataset.url, {
                    method: 'POST',
                    credentials: 'same-origin',
                    body: body,
                    signal: request.signal
                });
                const result = await response.json();
                if (!response.ok || !result.success || !result.data || typeof result.data.html !== 'string') {
                    throw new Error(result.data && result.data.message ? result.data.message : __('Het voorbeeld kon niet geladen worden.', 'madeit'));
                }
                if (request.signal.aborted) {
                    return;
                }
                frame.srcdoc = result.data.html;
                frame.hidden = false;
                status.textContent = __('Voorbeeld bijgewerkt. Wijzigingen zijn niet opgeslagen.', 'madeit');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    frame.hidden = true;
                    status.classList.add('is-error');
                    status.textContent = __('Voorbeeld mislukt: ', 'madeit') + error.message;
                }
            } finally {
                if (controller === request) {
                    panel.removeAttribute('aria-busy');
                }
            }
        }

        function changed() {
            if (!started || !live.checked) {
                return;
            }
            const state = JSON.stringify(readState());
            if (state !== lastState) {
                lastState = state;
                clearTimeout(timer);
                timer = setTimeout(refresh, 600);
            }
        }

        panel.querySelector('[data-preview-refresh]').addEventListener('click', refresh);
        panel.querySelector('[data-preview-size]').addEventListener('change', function (event) {
            frame.classList.toggle('is-mobile', event.target.value === 'mobile');
        });
        live.addEventListener('change', function () {
            clearTimeout(timer);
            if (live.checked && started) {
                lastState = '';
                changed();
            }
        });
        document.addEventListener('input', changed);
        document.addEventListener('change', changed);
        wp.data.subscribe(changed);
        if (window.jQuery) {
            window.jQuery(document).on('tinymce-editor-init', function (event, editor) {
                if (editor.id === 'content') {
                    editor.on('input change undo redo', changed);
                }
            });
            if (window.tinymce && window.tinymce.get('content')) {
                window.tinymce.get('content').on('input change undo redo', changed);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

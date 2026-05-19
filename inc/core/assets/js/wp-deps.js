window.MADEIT = window.MADEIT || {};

window.MADEIT.wp = {

    // WordPress packages
    components: wp.components,
    blockEditor: wp.blockEditor,
    element: wp.element,
    hooks: wp.hooks,
    compose: wp.compose,
    data: wp.data,

    // Utilities
    apiFetch: wp.apiFetch,
    React: window.React || wp.element,

};
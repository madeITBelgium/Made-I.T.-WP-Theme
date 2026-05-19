document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.m-popup').forEach(popup => {

        const delay = parseInt(popup.dataset.delay || 0, 10);

        setTimeout(() => {
            if (typeof bootstrap !== 'undefined') {
                const modal = new bootstrap.Modal(popup);
                modal.show();
            } else {
                console.error('Bootstrap JS niet geladen');
            }
        }, delay);

    });

});

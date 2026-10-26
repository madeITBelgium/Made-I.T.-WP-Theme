
document.addEventListener('DOMContentLoaded', function () {
    // PREVIEW

    // when scrolling, adjust preview position if needed
    const preview = document.getElementById('preview');
    const MI_header = document.querySelector('.MI_header');
    window.addEventListener('scroll', () => {
        if (preview) {
            // Neem de hoogte van de header, zodat de preview eronder begint. Wanneer je scrollt moet de preview altijd onder de header blijven. Dus uiteindelijk moet de top van de preview altijd gelijk zijn aan de hoogte van de header.
            const headerHeight = MI_header ? MI_header.offsetHeight : 88;
            preview.style.height = `calc(100vh - ${headerHeight}px)`;
            preview.style.top = `${headerHeight}px`;

            // als je scrollt moet de preview ook mee 'scrollen' dus er moet altijd rekening worden gehouden met de hoogte van de header die effectief zichtbaar is op het scherm
            const scrollOffset = window.scrollY;
            preview.style.top = `${headerHeight - scrollOffset}px`;
            // Zorg ervoor dat de preview niet boven de top van het scherm gaat
            if (headerHeight - scrollOffset < 0) {
                preview.style.top = '0px';
            }
            preview.style.height = `calc(100vh - ${Math.max(headerHeight - scrollOffset, 0)}px)`;
            // Zorg ervoor dat de preview altijd minimaal 0px hoog is, zelfs als de header groter is dan het venster
            if (parseInt(preview.style.height) < 0) {
                preview.style.height = '0px';
            }
        }

       

    });



    const navigation = document.querySelector('.MI_navigation');
    const navigationLinks = navigation
        ? navigation.querySelectorAll('a')
        : [];

    // Alle contentsecties ophalen
    const sections = document.querySelectorAll('[id^="MI_"]');

    function showTab(path) {
        // De slash verwijderen: /cart wordt cart
        const tabName = path.replace(/^\/+|\/+$/g, '');
        const targetId = 'MI_' + tabName;

        // Alle secties verbergen
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Alle menu-items inactief maken
        navigationLinks.forEach(link => {
            link.classList.remove('MI_navigation_active');
        });

        // De juiste sectie tonen
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Het bijbehorende menu-item actief maken
        navigationLinks.forEach(link => {
            const href = link.getAttribute('href');

            if (!href || href === '#') {
                return;
            }

            const url = new URL(href, window.location.origin);
            const linkPath = url.searchParams.get('path');

            if (linkPath === '/' + tabName) {
                link.classList.add('MI_navigation_active');
            }
        });
    }

    // Bepalen welke tab getoond moet worden op basis van de huidige URL
    const currentUrl = new URL(window.location.href);
    const currentPath = currentUrl.searchParams.get('path');

    if (currentPath) {
        showTab(currentPath);
    } else {
        // Standaardtab wanneer er geen path in de URL staat
        showTab('/store-checkout');
    }


    // CART CHECKER
    var cartCheck = document.getElementById('cartCheck');
    var cartCheckInput = document.getElementsByClassName('MI-disable-cart-info');

    if (cartCheck && cartCheckInput.length > 0) {
        cartCheck.addEventListener('click', function () {
            for (var i = 0; i < cartCheckInput.length; i++) {
                cartCheckInput[i].style.display = cartCheck.classList.contains('is-checked') ? 'none' : 'block';
            }
        });
    }



    // TOOLTIP
    const tooltips = document.querySelectorAll('.tooltip');

    // standaard display none wanneer nog geen actie
    tooltips.forEach(tooltip => {
        const span = tooltip.querySelector('span');
        if (span) {
            span.style.display = 'none';
        }
    });
    tooltips.forEach(tooltip => {
        const span = tooltip.querySelector('span');
        tooltip.addEventListener('mouseenter', () => {
            if (span) {
                span.style.display = 'inline-block';
            }
        });
        tooltip.addEventListener('mouseleave', () => {
            if (span) {
                span.style.display = 'none';
            }
        });
    });

});

const primaryNav = document.querySelector('.nav');
const navToggle = primaryNav ? primaryNav.querySelector('.nav__toggle') : null;
const navLinks = primaryNav ? primaryNav.querySelector('.nav__links') : null;
const yearNode = document.querySelector('[data-year]');

if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
    const desktopQuery = window.matchMedia('(min-width: 769px)');

    const setExpandedState = (expanded) => {
        navLinks.dataset.open = String(expanded);
        navToggle.setAttribute('aria-expanded', String(expanded));
        navLinks.style.display = expanded ? 'flex' : 'none';
    };

    const syncMenuForViewport = (mq) => {
        if (mq.matches) {
            navLinks.dataset.open = 'true';
            navToggle.setAttribute('aria-expanded', 'false');
            navLinks.style.display = '';
        } else {
            setExpandedState(false);
        }
    };

    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.dataset.open === 'true';
        setExpandedState(!isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (!desktopQuery.matches) {
                setExpandedState(false);
            }
        });
    });

    const handleViewportChange = (event) => syncMenuForViewport(event);

    if (typeof desktopQuery.addEventListener === 'function') {
        desktopQuery.addEventListener('change', handleViewportChange);
    } else if (typeof desktopQuery.addListener === 'function') {
        desktopQuery.addListener(handleViewportChange);
    }

    syncMenuForViewport(desktopQuery);
}

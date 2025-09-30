document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const DEBOUNCE_DELAY = 200;

    // Utility: Debounce
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(null, args), delay);
        };
    };

    // Preloader Logic
    const initPreloader = () => {
        if (sessionStorage.getItem('preloaderShown') !== 'true') {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                document.body.classList.add('preloading');
                document.querySelectorAll('.site-header, .hero-section, section, footer').forEach((el) => {
                    el.style.display = 'none';
                });

                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    if (progress >= 100) {
                        clearInterval(interval);
                        preloader.style.opacity = '0';
                        setTimeout(() => {
                            preloader.style.display = 'none';
                            document.body.classList.remove('preloading');
                            document.querySelectorAll('.site-header, .hero-section, section, footer').forEach((el) => {
                                el.style.display = '';
                            });
                            sessionStorage.setItem('preloaderShown', 'true');
                        }, 300);
                    }
                }, 50);
            }
        } else {
            const preloader = document.querySelector('.preloader');
            if (preloader) preloader.style.display = 'none';
            document.body.classList.remove('preloading');
            document.querySelectorAll('.site-header, .hero-section, section, footer').forEach((el) => {
                el.style.display = '';
            });
        }
    };

    // Preload Images
    const preloadImages = (container) => {
        const images = container.querySelectorAll('img');
        images.forEach((img) => {
            const preloadImg = new Image();
            preloadImg.src = img.src;
            preloadImg.onerror = () => {
                console.warn(`Failed to preload image: ${img.src}`);
                img.src = 'images/fallback.jpg';
            };
        });
    };

    // Mobile Menu Logic
    const initMobileMenu = () => {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav-container');
        const dropdowns = document.querySelectorAll('.has-dropdown');

        if (!toggle || !nav) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        dropdowns.forEach((dropdown) => {
            const link = dropdown.querySelector('a');
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    const submenu = dropdown.querySelector('.dropdown-menu');
                    submenu.style.display = dropdown.classList.contains('active') ? 'flex' : 'none';
                }
            });
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && !link.parentElement.classList.contains('has-dropdown')) {
                    toggle.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    };

    // Header Scroll Effect
    const initHeaderScroll = () => {
        const header = document.querySelector('.site-header');
        let lastScroll = 0;

        window.addEventListener('scroll', debounce(() => {
            const currentScroll = window.pageYOffset;
            header.classList.toggle('scrolled', currentScroll > 50);
            lastScroll = currentScroll;
        }, 50));
    };

    // Smooth Scroll for Discover Attractions
    const initSmoothScroll = () => {
        const discoverAttractions = document.querySelector('.hero-content .btn-primary');
        if (discoverAttractions) {
            discoverAttractions.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(discoverAttractions.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        }
    };

    // Modal Functionality
    const modal = document.getElementById('attractionModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDetails = document.getElementById('modalDetails');
    const closeModal = document.querySelector('.modal-close');

    const attractionDetails = {
        'old-trafford': {
            title: 'Old Trafford',
            details: 'The iconic home of Manchester United, just a 10-minute drive from the hotel. Experience stadium tours, the museum, or the thrill of a matchday at this legendary football ground.'
        },
        'etihad-stadium': {
            title: 'Etihad Stadium',
            details: 'Home to Manchester City, this modern stadium is a 10-minute drive or tram ride from the hotel. Enjoy guided tours, interactive exhibits, or live football matches.'
        },
        'co-op-live': {
            title: 'Co-op Live',
            details: 'Manchester’s newest entertainment venue, hosting world-class concerts and events. Easily accessible via a short tram ride from Piccadilly Station, just 5 minutes from the hotel.'
        },
        'mcc': {
            title: 'Manchester Central (MCC)',
            details: 'A premier event and conference venue in the heart of Manchester, just a 10-minute walk from the hotel. Ideal for exhibitions, trade shows, and cultural events.'
        },
        'aviva-studios': {
            title: 'Aviva Studios',
            details: 'A cutting-edge cultural hub for art, theatre, and performances, located a 15-minute walk or short tram ride from the hotel. Perfect for creative and immersive experiences.'
        }
    };

    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', () => {
            const attraction = button.getAttribute('data-attraction');
            modalTitle.textContent = attractionDetails[attraction].title;
            modalDetails.textContent = attractionDetails[attraction].details;
            modal.classList.add('active');
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Animation on Scroll
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    animatedElements.forEach(element => observer.observe(element));

    // Initialize
    initPreloader();
    preloadImages(document.querySelector('.attractions-section'));
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
});

// Handle no-scroll class
document.body.classList.add('no-scroll');
setTimeout(() => {
    if (!document.body.classList.contains('preloading')) {
        document.body.classList.remove('no-scroll');
    }
}, 1000);
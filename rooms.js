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

    // Smooth Scroll for Explore Rooms
    const initSmoothScroll = () => {
        const exploreRooms = document.querySelector('.hero-content .btn-primary');
        if (exploreRooms) {
            exploreRooms.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(exploreRooms.getAttribute('href'));
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
    const modal = document.getElementById('roomModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDetails = document.getElementById('modalDetails');
    const closeModal = document.querySelector('.modal-close');

    const roomDetails = {
    'double-room': {
        title: 'Double Room',
        details: 'Approx 200 sqft | 1 Double Bed<br>Enjoy a cozy stay with quirky weather-themed decor, high-speed WiFi, private bathroom with free toiletries, flat-screen LCD TV, tea/coffee maker, air conditioning, hairdryer, and work desk. Non-smoking. Pet-friendly options available.'
    },
    'twin-room': {
        title: 'Twin Room',
        details: 'Approx 200 sqft | 2 Single Beds<br>Perfect for sharing, featuring quirky weather-themed decor, high-speed WiFi, private bathroom with free toiletries, flat-screen LCD TV, tea/coffee maker, air conditioning, hairdryer, and work desk. Non-smoking. Pet-friendly options available.'
    },
    'single-room': {
        title: 'Single Room',
        details: 'Approx 150 sqft | 1 Single Bed<br>Ideal for solo travellers, featuring quirky weather-themed decor, high-speed WiFi, private bathroom with complimentary toiletries, flat-screen LCD TV, tea/coffee maker, air conditioning, hairdryer, and work desk. Non-smoking.'
    },
    'compact-double-room': {
        title: 'Compact Double Room',
        details: 'Approx 170 sqft | 1 Double Bed<br>Smart, space-efficient design with quirky weather-themed decor, high-speed WiFi, ensuite bathroom with shower, smart TV, tea/coffee maker, air conditioning, and hairdryer. Non-smoking.'
    }
};


    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', () => {
            const room = button.getAttribute('data-room');
            modalTitle.textContent = roomDetails[room].title;
            modalDetails.innerHTML = roomDetails[room].details;
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

    // Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const roomCards = document.querySelectorAll('.room-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            roomCards.forEach(card => {
                const type = card.getAttribute('data-type');
                if (filter === 'all' || type === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
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
    preloadImages(document.querySelector('.rooms-section'));
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
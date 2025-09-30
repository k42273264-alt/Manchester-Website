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

    // Smooth Scroll for Explore Gallery
    const initSmoothScroll = () => {
        const exploreGallery = document.querySelector('.hero-content .btn-primary');
        if (exploreGallery) {
            exploreGallery.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(exploreGallery.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        }
    };

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

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentIndex = 0;
    const galleryItems = document.querySelectorAll('.gallery-item img');

    const showLightbox = (index) => {
        currentIndex = index;
        lightboxImage.src = galleryItems[index].src;
        lightboxCaption.textContent = galleryItems[index].getAttribute('data-caption') || '';
        lightbox.classList.add('active');
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => showLightbox(index));
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    lightboxPrev.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
        showLightbox(currentIndex);
    });

    lightboxNext.addEventListener('click', () => {
        currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
        showLightbox(currentIndex);
    });

    // Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryContainer = document.querySelector('.gallery-container');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const filter = button.getAttribute('data-filter');
            galleryContainer.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Initialize
    initPreloader();
    preloadImages(document.querySelector('.gallery-section'));
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
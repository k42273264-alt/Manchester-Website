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

  // Smooth Scroll for Contact Form Link
  const initSmoothScroll = () => {
    const contactLink = document.querySelector('.hero-content .btn-primary');
    if (contactLink) {
      contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(contactLink.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    }
  };

  // Form Submission and Modal
  const form = document.getElementById('contactForm');
  const modal = document.getElementById('formModal');
  const closeModal = document.querySelector('.modal-close');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      form.reset();
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Collapsible Functionality
  const collapsibleToggles = document.querySelectorAll('.collapsible-toggle');
  collapsibleToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const isActive = toggle.classList.contains('active');
      
      collapsibleToggles.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.classList.remove('active');
      });

      if (!isActive) {
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        content.classList.add('active');
      }
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
  preloadImages(document.querySelector('.contact-details-section'));
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
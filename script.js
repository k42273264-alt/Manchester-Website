document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const SLIDE_INTERVAL = 6000;
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
        document.querySelectorAll('.site-header, .hero-slider, section, footer').forEach((el) => {
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
              document.querySelectorAll('.site-header, .hero-slider, section, footer').forEach((el) => {
                el.style.display = '';
              });
              sessionStorage.setItem('preloaderShown', 'true');
            }, 300);
          }
        }, 50);
      }
    } else {
      const preloader = document.querySelector('.preloader');
      if (preloader) {
        preloader.style.display = 'none';
      }
      document.body.classList.remove('preloading');
      document.querySelectorAll('.site-header, .hero-slider, section, footer').forEach((el) => {
        el.style.display = '';
      });
    }
  };

  // Preload Images
  const preloadImages = (slides) => {
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img) {
        const preloadImg = new Image();
        preloadImg.src = img.src;
        preloadImg.onerror = () => {
          console.warn(`Failed to preload image: ${img.src}`);
          img.src = 'images/fallback.jpg';
        };
      }
    });
  };

  // Hero Slider Logic
  const initHeroSlider = () => {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const dotsContainer = slider.querySelector('.slider-dots');
    const prevButton = slider.querySelector('.prev-slide');
    const nextButton = slider.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;
    if (!dotsContainer) console.warn('Slider dots container not found.');
    if (!prevButton) console.warn('Previous button not found.');
    if (!nextButton) console.warn('Next button not found.');

    preloadImages(slides);

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        const isActive = i === index;
        slide.classList.toggle('active', isActive);
        const img = slide.querySelector('img');
        if (img && slide.hasAttribute('data-zoom')) {
          img.style.transform = isActive ? 'scale(1)' : 'scale(1.05)';
        }
      });
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      }
      currentSlide = index;
    };

    const nextSlide = () => {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    };

    const prevSlide = () => {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    };

    const startSlideShow = () => {
      slideInterval = setInterval(nextSlide, SLIDE_INTERVAL);
    };

    const stopSlideShow = () => {
      clearInterval(slideInterval);
    };

    if (prevButton) {
      prevButton.addEventListener('click', debounce(() => {
        stopSlideShow();
        prevSlide();
        startSlideShow();
      }, DEBOUNCE_DELAY));
    }

    if (nextButton) {
      nextButton.addEventListener('click', debounce(() => {
        stopSlideShow();
        nextSlide();
        startSlideShow();
      }, DEBOUNCE_DELAY));
    }

    if (dotsContainer) {
      dotsContainer.addEventListener('click', debounce((e) => {
        const dot = e.target.closest('.dot');
        if (dot) {
          const index = Array.from(dotsContainer.querySelectorAll('.dot')).indexOf(dot);
          if (index !== -1) {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
          }
        }
      }, DEBOUNCE_DELAY));

      dotsContainer.addEventListener('keydown', (e) => {
        const dot = e.target.closest('.dot');
        if (dot && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          const index = Array.from(dotsContainer.querySelectorAll('.dot')).indexOf(dot);
          if (index !== -1) {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
          }
        }
      });
    }

    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        stopSlideShow();
        nextSlide();
        startSlideShow();
      } else if (touchEndX - touchStartX > 50) {
        stopSlideShow();
        prevSlide();
        startSlideShow();
      }
    });

    showSlide(0);
    startSlideShow();

    slider.addEventListener('mouseenter', stopSlideShow);
    slider.addEventListener('mouseleave', startSlideShow);
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
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
            const submenu = dropdown.querySelector('.dropdown-menu');
            if (submenu) {
              submenu.style.display = dropdown.classList.contains('active') ? 'flex' : 'none';
            }
          }
        });
      }
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
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });
  };

  // Newsletter Form Validation
  const initNewsletterForm = () => {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      const email = form.querySelector('input[type="email"]').value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        e.preventDefault();
        alert('Please enter a valid email address.');
      }
    });
  };

  // Image Modal Logic
  const initImageModal = () => {
    const images = document.querySelectorAll('.highlight-card img, .thing-card img');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal-content">
        <img src="" alt="Modal Image">
        <p></p>
        <button>Close</button>
      </div>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    const modalText = modal.querySelector('p');
    const closeButton = modal.querySelector('button');

    images.forEach((img) => {
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalText.textContent = img.alt;
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
      });
    });

    closeButton.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  };

  // Accordion Logic
  const initAccordion = () => {
    const toggles = document.querySelectorAll('.accordion-toggle');
    if (toggles.length === 0) return;

    toggles.forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', () => {
        const content = toggle.nextElementSibling;
        if (!content || !content.classList.contains('accordion-content')) return;

        const isActive = content.classList.contains('active');

        document.querySelectorAll('.accordion-content').forEach(item => {
          item.classList.remove('active');
          item.previousElementSibling.setAttribute('aria-expanded', 'false');
          item.previousElementSibling.classList.remove('active');
        });

        if (!isActive) {
          content.classList.add('active');
          toggle.setAttribute('aria-expanded', 'true');
          toggle.classList.add('active');
        }
      });
    });
  };

  initPreloader();
  initHeroSlider();
  initMobileMenu();
  initHeaderScroll();
  initNewsletterForm();
  initImageModal();
  initAccordion();
});

document.body.classList.add('no-scroll');
setTimeout(() => {
  if (!document.body.classList.contains('preloading')) {
    document.body.classList.remove('no-scroll');
  }
}, 1000);
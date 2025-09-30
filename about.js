document.addEventListener('DOMContentLoaded', () => {
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

    // Accordion functionality
    document.querySelectorAll('.accordion-toggle').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const item = this.parentElement;
            const expanded = this.getAttribute('aria-expanded') === 'true';
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
            });
            if (!expanded) {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
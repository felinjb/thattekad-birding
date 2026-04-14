// Opener / Preloader Logic
document.addEventListener("DOMContentLoaded", () => {
    // Opener fade out
    const opener = document.querySelector('.page-opener');
    if (opener) {
        // Reduced to 400ms for a snappy premium feel
        setTimeout(() => {
            opener.classList.add('fade-out');
        }, 400); 
    }

    // Auto-add animation classes to elements that need it
    const elementsToAnimate = document.querySelectorAll(
        '.tour-item, .gallery-grid img, .about-text, .about-image, .banner-promo h2, .slide-content, .subpage-banner h1'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-item');
    });

    // Intersection Observer for Smooth Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a slight delay for grid items to create a waterfall effect
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    // Observe all animate items
    document.querySelectorAll('.animate-item').forEach((el, index) => {
        // Optional staggered delay based on index for grid elements
        if(el.tagName === 'IMG' && el.closest('.gallery-grid')) {
            el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        }
        observer.observe(el);
    });
});

// Opener / Preloader Logic
document.addEventListener("DOMContentLoaded", () => {
    // Opener fade out
    const opener = document.querySelector('.page-opener');
    if (opener) {
        // Delayed to 2.2 seconds to allow the minimalist line bird to finish drawing
        setTimeout(() => {
            opener.classList.add('fade-out');
        }, 2200); 
    }

    // Auto-add animation classes to elements that need it
    const elementsToAnimate = document.querySelectorAll(
        '.tour-item, .gallery-grid img, .about-text, .about-image, .banner-promo h2, .slide-content, .subpage-banner h1, .elegant-staggered'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-item');
    });

    // Intersection Observer for Smooth Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
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

    // Inject Glassmorphism Modal globally
    const modalHTML = `
    <div class="glass-modal-overlay" id="bookingModal">
        <div class="glass-modal">
            <i class="fas fa-times modal-close"></i>
            <h3>PLAN YOUR EXPEDITION</h3>
            <p style="margin-bottom: 20px; color: #666;">Leave your details and target species, and our experts will contact you directly.</p>
            <form class="glass-form" action="javascript:void(0);">
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Email Address" required>
                <textarea rows="3" placeholder="Which birds are on your checklist? (e.g., Sri Lanka Frogmouth)"></textarea>
                <button type="submit" class="btn-primary" style="margin-bottom: 15px;">REQUEST ITINERARY</button>
                <a href="https://wa.me/918921243251" class="btn-secondary" style="width:100%; display:block; text-align:center; background:#1C3A27; color:#fff; border: none;">OR WHATSAPP US</a>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Modal Interaction Logic
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.modal-close');
    
    // Bind all buttons with modal-trigger class
    document.querySelectorAll('.modal-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Initialize Swiper
    if(document.querySelector('.swiper')) {
        new Swiper('.swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Advanced Scroll Animations
    // Selects all elements with our animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    animatedElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // 3. Gallery Lightbox Functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox) {
        // Open lightbox when an image is clicked
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgTag = item.querySelector('img');
                lightboxImg.src = imgTag.src;
                lightbox.classList.remove('hidden');
            });
        });

        // Close lightbox when X is clicked
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.add('hidden');
        });

        // Close lightbox when clicking anywhere outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('hidden');
            }
        });
    }

    // 4. WhatsApp Form Routing 
    const form = document.getElementById('booking-form');
    const messageDiv = document.getElementById('form-message');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('date').value;
            
            const tourSelect = document.getElementById('tour-type');
            const tourName = tourSelect.options[tourSelect.selectedIndex].text;
            
            const whatsappMessage = `Hello Thattekad Birding!\n\nI would like to book an expedition:\n\n*Name:* ${name}\n*Email:* ${email}\n*Date:* ${date}\n*Expedition:* ${tourName}\n\nPlease let me know the availability and pricing details.`;
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappNumber = "918921243251";
            
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
            
            form.style.display = 'none';
            messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: #d4a373; margin-bottom: 1rem; display:block;"></i> 
            Thank you, ${name}! <br> Your request has been formatted and opened in WhatsApp.`;
            messageDiv.className = 'success-msg';
            messageDiv.classList.remove('hidden');
        });
    }
});

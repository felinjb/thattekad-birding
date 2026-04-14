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

    // 3. Tour Details Modal (For the Expeditions Page)
    const tourBtns = document.querySelectorAll('.view-details-btn');
    const tourModal = document.getElementById('tour-modal');
    
    if (tourModal) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const tourModalClose = document.getElementById('modal-close');

        tourBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Pull data from the button attributes
                modalTitle.textContent = btn.getAttribute('data-title');
                modalImg.src = btn.getAttribute('data-img');
                modalDesc.textContent = btn.getAttribute('data-desc');
                
                // Show modal
                tourModal.classList.remove('hidden');
            });
        });

        // Close on X click
        tourModalClose.addEventListener('click', () => {
            tourModal.classList.add('hidden');
        });

        // Close on outside click
        tourModal.addEventListener('click', (e) => {
            if (e.target === tourModal) {
                tourModal.classList.add('hidden');
            }
        });
    }

    // 4. Gallery Lightbox Functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgTag = item.querySelector('img');
                lightboxImg.src = imgTag.src;
                lightbox.classList.remove('hidden');
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.add('hidden');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('hidden');
            }
        });
    }

    // 5. Dual Form Routing (WhatsApp or Email on Booking Page)
    const form = document.getElementById('booking-form');
    const messageDiv = document.getElementById('form-message');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const submitter = e.submitter; 
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('date').value;
            
            const tourSelect = document.getElementById('tour-type');
            const tourName = tourSelect.options[tourSelect.selectedIndex].text;
            
            form.style.display = 'none';

            if (submitter.id === 'btn-whatsapp') {
                const whatsappMessage = `Hello Thattekad Birding!\n\nI would like to book an expedition:\n\n*Name:* ${name}\n*Email:* ${email}\n*Date:* ${date}\n*Expedition:* ${tourName}\n\nPlease let me know the availability.`;
                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappNumber = "918921243251";
                
                window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
                
                messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: #25D366; margin-bottom: 1rem; display:block;"></i> 
                Thank you, ${name}! <br> Your request has been opened in WhatsApp.`;
                messageDiv.className = 'success-msg';
                messageDiv.classList.remove('hidden');
            } 
            else if (submitter.id === 'btn-email') {
                const emailSubject = `New Booking Request: ${tourName} - ${name}`;
                const emailBody = `Hello Thattekad Birding,\n\nI would like to book an expedition:\n\nName: ${name}\nEmail: ${email}\nDate: ${date}\nExpedition: ${tourName}\n\nPlease let me know the availability and pricing details.\n\nThank you,\n${name}`;
                
                const encodedSubject = encodeURIComponent(emailSubject);
                const encodedBody = encodeURIComponent(emailBody);
                const emailAddress = "info@thattekadbirding.com";
                
                window.location.href = `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`;
                
                messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem; display:block;"></i> 
                Thank you, ${name}! <br> Your email app has been opened to send the request.`;
                messageDiv.className = 'success-msg';
                messageDiv.classList.remove('hidden');
            }
        });
    }
});

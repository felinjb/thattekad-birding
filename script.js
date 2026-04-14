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

    // 2. Smooth Fade-In Animations on Scroll (Includes Gallery Images)
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 3. WhatsApp Form Routing
    const form = document.getElementById('booking-form');
    const messageDiv = document.getElementById('form-message');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page reload
            
            // Gather the data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('date').value;
            
            // Get the actual text name of the tour
            const tourSelect = document.getElementById('tour-type');
            const tourName = tourSelect.options[tourSelect.selectedIndex].text;
            
            // Format the message for WhatsApp
            const whatsappMessage = `Hello Thattekad Birding!\n\nI would like to book an expedition:\n\n*Name:* ${name}\n*Email:* ${email}\n*Date:* ${date}\n*Expedition:* ${tourName}\n\nPlease let me know the availability and pricing details.`;
            
            // Encode the text so it safely passes through the URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Your WhatsApp Number
            const whatsappNumber = "918921243251";
            
            // Open WhatsApp
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
            
            // Hide form and show success message on the website
            form.style.display = 'none';
            messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem; display:block;"></i> 
            Thank you, ${name}! <br> Your request has been formatted and opened in WhatsApp.`;
            messageDiv.className = 'success-msg';
            messageDiv.classList.remove('hidden');
        });
    }
});

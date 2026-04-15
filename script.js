// Global function for the Tour Accordion Cards
function toggleDetails(detailsId, btnElement) {
    const detailsDiv = document.getElementById(detailsId);
    
    if (!detailsDiv.classList.contains('active')) {
        // Open it
        detailsDiv.classList.add('active');
        btnElement.innerHTML = 'Hide Details <i class="fa-solid fa-chevron-up"></i>';
        btnElement.style.backgroundColor = '#2d6a4f';
        btnElement.style.color = 'white';
    } else {
        // Close it
        detailsDiv.classList.remove('active');
        btnElement.innerHTML = 'Explore Details <i class="fa-solid fa-chevron-down"></i>';
        btnElement.style.backgroundColor = 'transparent';
        btnElement.style.color = '#2d6a4f';
    }
}

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

    // 2. Mobile Hamburger Menu Toggle
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');
    
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            
            const icon = menuIcon.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                menuIcon.querySelector('i').classList.remove('fa-xmark');
                menuIcon.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // 3. Gallery Lightbox Functionality
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

    // 4. Booking Form Routing (WhatsApp & Automated Email)
    const form = document.getElementById('booking-form');
    const messageDiv = document.getElementById('form-message');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            // Find out which button the user clicked
            const submitter = e.submitter; 
            
            // Collect the data from the form
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('date').value;
            
            const tourSelect = document.getElementById('tour-type');
            const tourName = tourSelect.options[tourSelect.selectedIndex].text;
            
            // Capture the new Additional Details box
            let detailsText = document.getElementById('additional-details').value;
            if (!detailsText) {
                detailsText = "None provided.";
            }
            
            // Hide the form to show a clean success message
            form.style.display = 'none'; 

            // ROUTE 1: WHATSAPP
            if (submitter.id === 'btn-whatsapp') {
                const whatsappMessage = `Hello Thattekad Birding!\n\nI would like to send an enquiry for a tour:\n\n*Name:* ${name}\n*Email:* ${email}\n*Date:* ${date}\n*Tour:* ${tourName}\n*Additional Details:* ${detailsText}\n\nPlease let me know the availability and pricing.`;
                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappNumber = "918921243251"; 
                
                window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
                
                messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: #25D366; margin-bottom: 1rem; display:block;"></i> 
                Thank you, ${name}! <br> Your enquiry has been opened in WhatsApp.`;
                messageDiv.className = 'success-msg';
                messageDiv.classList.remove('hidden');
            } 
            
            // ROUTE 2: EMAIL
            else if (submitter.id === 'btn-email') {
                // Ensure spaces are safely encoded using %20 for email links
                const emailSubject = encodeURIComponent(`New Tour Enquiry: ${tourName} - ${name}`);
                
                // Build the email body text
                const rawBody = `Hello Thattekad Birding,\n\nI would like to send an enquiry for a tour:\n\nName: ${name}\nEmail: ${email}\nDate: ${date}\nTour: ${tourName}\nAdditional Details: ${detailsText}\n\nPlease let me know the availability and pricing details.\n\nThank you,\n${name}`;
                
                // Use encodeURIComponent to safely package the body for the mailto link
                const encodedBody = encodeURIComponent(rawBody);
                
                // The destination email address
                const emailAddress = "info@thattekadbirding.com";
                
                // Trigger the device's default mail app 
                window.location.href = `mailto:${emailAddress}?subject=${emailSubject}&body=${encodedBody}`;
                
                // Show Success Message
                messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem; display:block;"></i> 
                Thank you, ${name}! <br> Your email application has been opened to send the enquiry.`;
                messageDiv.className = 'success-msg';
                messageDiv.classList.remove('hidden');
            }
        });
    }
});

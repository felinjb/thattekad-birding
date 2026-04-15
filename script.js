// 1. Global function for the Tour Accordion Cards
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
    
    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Hamburger Menu Toggle
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');
    
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            // Show/Hide the menu
            navLinks.classList.toggle('nav-active');
            
            // Change icon to 'X' when open
            const icon = menuIcon.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu automatically if they click a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                menuIcon.querySelector('i').classList.remove('fa-xmark');
                menuIcon.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // 4. Booking Form WhatsApp/Email Routing
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
            
            form.style.display = 'none'; // Hide form

            if (submitter.id === 'btn-whatsapp') {
                const whatsappMessage = `Hello Thattekad Birding!\n\nI would like to book a tour:\n\n*Name:* ${name}\n*Email:* ${email}\n*Date:* ${date}\n*Tour:* ${tourName}\n\nPlease let me know the availability.`;
                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappNumber = "918921243251";
                
                window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
                
                messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: #25D366; margin-bottom: 1rem; display:block;"></i> Thank you, ${name}! <br> Your request has been opened in WhatsApp.`;
                messageDiv.className = 'success-msg';
                messageDiv.classList.remove('hidden');
            } 
            else if (submitter.id === 'btn-email') {
                const emailSubject = `New Booking Request: ${tourName} - ${name}`;
                const emailBody = `Hello Thattekad Birding,\n\nI would like to book a tour:\n\nName: ${name}\nEmail: ${email}\nDate: ${date}\nTour: ${tourName}\n\nPlease let me know the availability and pricing details.\n\nThank you,\n${name}`;
                
                const encodedSubject = encodeURIComponent(emailSubject);
                const encodedBody = encodeURIComponent(emailBody);
                const emailAddress = "info@thattekadbirding.com";
                
                window.location.href = `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`;
                
                messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem; display:block;"></i> Thank you, ${name}! <br> Your email app has been opened to send the request.`;
                messageDiv.className = 'success-msg';
                messageDiv.classList.remove('hidden');
            }
        });
    }
});

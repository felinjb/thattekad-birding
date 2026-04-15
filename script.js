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

    // 5. Booking Form Routing (WhatsApp & Silent Email)
    const form = document.getElementById('booking-form');
    const messageDiv = document.getElementById('form-message');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const submitter = e.submitter; 
            
            // Collect the data from the form
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('date').value;
            const tourSelect = document.getElementById('tour-type');
            const tourName = tourSelect.options[tourSelect.selectedIndex].text;
            
            let detailsText = document.getElementById('additional-details').value;
            if (!detailsText) { detailsText = "None provided."; }
            
            // Hide the form to show loading/success message
            form.style.display = 'none'; 

            // ==========================================
            // ROUTE 1: WHATSAPP (Opens App)
            // ==========================================
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
            
            // ==========================================
            // ROUTE 2: SILENT BACKGROUND EMAIL API
            // ==========================================
            else if (submitter.id === 'btn-email') {
                
                // Show a loading message so the user knows it is working
                messageDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem; display:block;"></i> Sending your enquiry...`;
                messageDiv.className = 'success-msg';
                messageDiv.classList.remove('hidden');

                // Package the data for Web3Forms
                const formData = new FormData();
                
                // ⚠️ IMPORTANT: PASTE YOUR ACCESS KEY IN THE QUOTES BELOW ⚠️
                formData.append("access_key", "0f708846-4d24-4ff1-bff5-e038dd1a925c"); 
                
                formData.append("subject", `New Tour Enquiry: ${tourName} - ${name}`);
                formData.append("from_name", "Thattekad Birding Website");
                formData.append("Name", name);
                formData.append("Email_Address", email);
                formData.append("Preferred_Date", date);
                formData.append("Requested_Tour", tourName);
                formData.append("Additional_Details", detailsText);

                // Send the data silently in the background
                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        // Success! Update the message on the screen
                        messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem; display:block;"></i> 
                        Success, ${name}! <br> Your enquiry has been sent directly to our team. We will email you back shortly.`;
                    } else {
                        // API Error
                        console.log(response);
                        messageDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: red; margin-bottom: 1rem; display:block;"></i> 
                        Oops! Something went wrong. Please try contacting us via WhatsApp instead.`;
                    }
                })
                .catch(error => {
                    // Network Error
                    console.log(error);
                    messageDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: red; margin-bottom: 1rem; display:block;"></i> 
                    Oops! Something went wrong. Please check your internet connection and try again.`;
                });
            }
        });
    }
    // 6. Smooth Interactive FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            
            // Close all other FAQs so only one stays open at a time
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.classList.remove('active');
                    q.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle the clicked FAQ
            question.classList.toggle('active');
            
            if (question.classList.contains('active')) {
                // Open it (scrollHeight calculates the exact height of the text inside)
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                // Close it
                answer.style.maxHeight = null;
            }
        });
    });
});

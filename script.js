// 1. Global function for Tour Accordion Cards
function toggleDetails(detailsId, btnElement) {
    const detailsDiv = document.getElementById(detailsId);
    
    if (!detailsDiv.classList.contains('active')) {
        detailsDiv.classList.add('active');
        btnElement.innerHTML = 'Hide Details <i class="fa-solid fa-chevron-up"></i>';
        btnElement.style.backgroundColor = '#2d6a4f';
        btnElement.style.color = 'white';
    } else {
        detailsDiv.classList.remove('active');
        btnElement.innerHTML = 'Explore Details <i class="fa-solid fa-chevron-down"></i>';
        btnElement.style.backgroundColor = 'transparent';
        btnElement.style.color = '#2d6a4f';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

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
                if(imgTag) {
                    lightboxImg.src = imgTag.src;
                    lightbox.classList.remove('hidden');
                }
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

    // 5. Smooth Interactive FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.classList.remove('active');
                        if (q.nextElementSibling) {
                            q.nextElementSibling.style.maxHeight = null;
                        }
                    }
                });

                question.classList.toggle('active');
                
                if (question.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    answer.style.maxHeight = null;
                }
            });
        });
    }

    // 6. MAIN BOOKING FORM (On book.html)
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
            
            let detailsText = document.getElementById('additional-details')?.value;
            if (!detailsText) { detailsText = "None provided."; }
            
            form.style.display = 'none'; 

            if (submitter.id === 'btn-whatsapp') {
                const whatsappMessage = `Hello Thattekad Birding!\n\nI would like to send an enquiry for a tour:\n\n*Name:* ${name}\n*Email:* ${email}\n*Date:* ${date}\n*Tour:* ${tourName}\n*Additional Details:* ${detailsText}\n\nPlease let me know the availability and pricing.`;
                const encodedMessage = encodeURIComponent(whatsappMessage);
                window.open(`https://wa.me/918921243251?text=${encodedMessage}`, '_blank');
                
                messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: #25D366; margin-bottom: 1rem; display:block;"></i> Thank you, ${name}! <br> Your enquiry has been opened in WhatsApp.`;
                messageDiv.className = 'success-msg';
                messageDiv.classList.remove('hidden');
            } 
            else if (submitter.id === 'btn-email') {
                messageDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem; display:block;"></i> Sending your enquiry...`;
                messageDiv.className = 'success-msg';
                messageDiv.classList.remove('hidden');

                // Package data as JSON for Web3Forms
                const payload = {
                    access_key: "0f708846-4d24-4ff1-bff5-e038dd1a925c",
                    subject: `New Tour Enquiry: ${tourName} - ${name}`,
                    from_name: "Thattekad Birding Website",
                    Name: name,
                    Email: email,
                    Date: date,
                    Requested_Tour: tourName,
                    Additional_Details: detailsText
                };

                fetch("https://api.web3forms.com/submit", { 
                    method: "POST", 
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload) 
                })
                .then(async (response) => {
                    if (response.status == 200) {
                        messageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem; display:block;"></i> Success, ${name}! <br> Your enquiry has been sent directly to our team. We will email you back shortly.`;
                    } else {
                        messageDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: red; margin-bottom: 1rem; display:block;"></i> Oops! Something went wrong. Please try contacting us via WhatsApp instead.`;
                    }
                })
                .catch(error => {
                    messageDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: red; margin-bottom: 1rem; display:block;"></i> Oops! Something went wrong. Please check your internet connection.`;
                });
            }
        });
    }

    // 7. QUICK EMAIL POPUP FORM (On all pages)
    const quickForm = document.getElementById('quick-email-form');
    const quickMessageDiv = document.getElementById('quick-form-message');

    if(quickForm) {
        quickForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const name = document.getElementById('quick-name').value;
            const email = document.getElementById('quick-email').value;
            const message = document.getElementById('quick-message').value;
            
            quickForm.style.display = 'none'; 
            quickMessageDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--accent); margin-bottom: 0.5rem; display:block;"></i> Sending message...`;
            quickMessageDiv.classList.remove('hidden');

            // Package data as JSON for Web3Forms
            const payload = {
                access_key: "0f708846-4d24-4ff1-bff5-e038dd1a925c",
                subject: `Quick Enquiry from ${name}`,
                from_name: "Thattekad Birding Popup",
                Name: name,
                Email: email,
                Message: message
            };

            fetch("https://api.web3forms.com/submit", { 
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload) 
            })
            .then(async (response) => {
                if (response.status == 200) {
                    quickMessageDiv.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 2.5rem; color: var(--accent); margin-bottom: 0.5rem; display:block;"></i> <strong>Sent Successfully!</strong><br>We will reply to ${email} shortly.`;
                } else {
                    quickMessageDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="font-size: 2.5rem; color: red; margin-bottom: 0.5rem; display:block;"></i> Error sending. Please try WhatsApp.`;
                }
            })
            .catch(error => {
                quickMessageDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="font-size: 2.5rem; color: red; margin-bottom: 0.5rem; display:block;"></i> Connection error. Please try WhatsApp.`;
            });
        });
    }

    // 8. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll('.reveal');
    
    if(revealElements.length > 0) {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); 
                }
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }
});

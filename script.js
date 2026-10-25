// ===========================================================
// Thattekad Birding - shared site script
// NOTE: Cookie consent + analytics now live in consent.js (load it on every page).
// ===========================================================

// Tiny helper: show a status block (icon + text) without injecting user input as HTML
function renderStatus(div, { icon, color, size, lines }) {
    div.textContent = '';
    const i = document.createElement('i');
    i.className = icon;
    i.style.cssText = `font-size:${size};color:${color};margin-bottom:1rem;display:block;`;
    div.appendChild(i);
    lines.forEach((line, idx) => {
        if (idx > 0) div.appendChild(document.createElement('br'));
        div.appendChild(document.createTextNode(line));
    });
}

// Anti-spam honeypot: invisible field real visitors never fill in
function addHoneypot(form) {
    const hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'website_url';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;';
    form.appendChild(hp);
    return hp;
}

// Report an event, but only if the visitor accepted cookies (consent.js decides; it is a no-op otherwise)
function track(eventName, params) {
    if (typeof window.tbTrack === 'function') window.tbTrack(eventName, params);
}

function fireConversion() {
    track('conversion_event_contact_3');
}

// ---- Where did this visitor come from? (saved once per browser session, first visit wins) ----
const SOURCE_KEY = 'tb-source';

function describeSource() {
    const q = new URLSearchParams(window.location.search);
    const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
        .filter(k => q.get(k)).map(k => `${k.replace('utm_', '')}=${q.get(k)}`);
    const landing = window.location.pathname.split('/').pop() || 'index.html';

    let ref = '';
    try {
        if (document.referrer) {
            const host = new URL(document.referrer).hostname.replace(/^www\./, '');
            if (host !== window.location.hostname.replace(/^www\./, '')) ref = host;
        }
    } catch (e) { /* bad referrer */ }

    let label;
    if (q.get('gclid') || /^(cpc|ppc|paid)/i.test(q.get('utm_medium') || '')) label = 'Google Ads / paid';
    else if (utm.length) label = 'Campaign link';
    else if (/(google|bing|duckduckgo|yahoo|ecosia|baidu)\./i.test(ref)) label = 'Search (' + ref + ')';
    else if (/(facebook|instagram|t\.co|twitter|x\.com|youtube|linkedin|pinterest|whatsapp)/i.test(ref)) label = 'Social (' + ref + ')';
    else if (ref) label = 'Link from ' + ref;
    else label = 'Direct / unknown';

    return { label: label, details: utm.join(', '), landing: landing };
}

function getSource() {
    try {
        const saved = window.sessionStorage.getItem(SOURCE_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) { /* storage blocked */ }
    const fresh = describeSource();
    try { window.sessionStorage.setItem(SOURCE_KEY, JSON.stringify(fresh)); } catch (e) { /* ignore */ }
    return fresh;
}

function sourceText(s) {
    return s.label + (s.details ? ' [' + s.details + ']' : '') + ' -> landed on ' + s.landing;
}

function sendToWeb3Forms(payload) {
    return fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
    }).then(async (response) => {
        let data = {};
        try { data = await response.json(); } catch (e) { /* non-JSON reply */ }
        return response.ok && data.success !== false;
    });
}

// 1. Global function for Tour Accordion Cards
function toggleDetails(detailsId, btnElement) {
    const detailsDiv = document.getElementById(detailsId);
    if (!detailsDiv || !btnElement) return;

    const opening = !detailsDiv.classList.contains('active');
    detailsDiv.classList.toggle('active', opening);
    btnElement.setAttribute('aria-expanded', String(opening));

    if (opening) {
        btnElement.innerHTML = 'Hide Details <i class="fa-solid fa-chevron-up"></i>';
        btnElement.style.backgroundColor = '#2d6a4f';
        btnElement.style.color = 'white';
    } else {
        btnElement.innerHTML = 'Explore Details <i class="fa-solid fa-chevron-down"></i>';
        btnElement.style.backgroundColor = 'transparent';
        btnElement.style.color = '#2d6a4f';
    }
}

document.addEventListener("DOMContentLoaded", () => {

    getSource();   // remember how the visitor arrived (first page of the session)

    // Count taps on WhatsApp / email / phone links anywhere on the site (floating button, footer, buttons)
    document.addEventListener('click', (e) => {
        const a = e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        const href = a.getAttribute('href') || '';
        const where = a.classList.contains('whatsapp-float') ? 'floating_button'
                    : a.closest('footer') ? 'footer'
                    : 'page';
        if (href.indexOf('wa.me/') !== -1) {
            track('whatsapp_click', { link_location: where });
            fireConversion();
        } else if (href.indexOf('mailto:') === 0) {
            track('email_click', { link_location: where });
        } else if (href.indexOf('tel:') === 0) {
            track('phone_click', { link_location: where });
        }
    });

    // 2. Navbar Scroll Effect (also correct on reload part-way down the page)
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar();
    }

    // 3. Mobile Hamburger Menu Toggle
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');

    if (menuIcon && navLinks) {
        const setMenu = (open) => {
            navLinks.classList.toggle('nav-active', open);
            menuIcon.setAttribute('aria-expanded', String(open));
            const icon = menuIcon.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-xmark', open);
                icon.classList.toggle('fa-bars', !open);
            }
        };

        // Make the icon usable by keyboard and screen readers even if it is a <div>
        if (menuIcon.tagName !== 'BUTTON') {
            menuIcon.setAttribute('role', 'button');
            menuIcon.setAttribute('tabindex', '0');
        }
        menuIcon.setAttribute('aria-controls', 'nav-links');
        menuIcon.setAttribute('aria-expanded', 'false');
        if (!menuIcon.getAttribute('aria-label')) menuIcon.setAttribute('aria-label', 'Toggle Menu');

        menuIcon.addEventListener('click', () => setMenu(!navLinks.classList.contains('nav-active')));
        menuIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMenu(!navLinks.classList.contains('nav-active'));
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('nav-active')) setMenu(false);
        });
    }

    // 4. Gallery Lightbox Functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');

    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close');
        const closeLightbox = () => lightbox.classList.add('hidden');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgTag = item.querySelector('img');
                if (imgTag && lightboxImg) {
                    lightboxImg.src = imgTag.src;
                    lightbox.classList.remove('hidden');
                }
            });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
    }

    // 5. Smooth Interactive FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.setAttribute('aria-expanded', 'false');
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                if (!answer) return;

                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.classList.remove('active');
                        q.setAttribute('aria-expanded', 'false');
                        if (q.nextElementSibling) q.nextElementSibling.style.maxHeight = null;
                    }
                });

                const open = question.classList.toggle('active');
                question.setAttribute('aria-expanded', String(open));
                answer.style.maxHeight = open ? answer.scrollHeight + "px" : null;
            });
        });

        // Keep an open answer the right height if the window is resized / rotated
        window.addEventListener('resize', () => {
            faqQuestions.forEach(q => {
                if (q.classList.contains('active') && q.nextElementSibling) {
                    q.nextElementSibling.style.maxHeight = q.nextElementSibling.scrollHeight + "px";
                }
            });
        });
    }

    // 6. MAIN BOOKING FORM (On book.html)
    const form = document.getElementById('booking-form');
    const messageDiv = document.getElementById('form-message');

    if (form && messageDiv) {
        // Pre-select the tour when arriving from a tour page (book.html?tour=night-birding)
        const wanted = new URLSearchParams(window.location.search).get('tour');
        const tourPick = document.getElementById('tour-type');
        if (wanted && tourPick) {
            const idx = Array.from(tourPick.options).findIndex(o => o.value === wanted && !o.disabled);
            if (idx > 0) tourPick.selectedIndex = idx;
        }

        // No past dates
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const d = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            dateInput.min = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        }

        const honeypot = addHoneypot(form);
        let sending = false;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (honeypot.value || sending) return;   // bot, or double-click

            // e.submitter can be null (script-triggered submit / older browsers) -> default to WhatsApp
            const submitterId = e.submitter ? e.submitter.id : 'btn-whatsapp';

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const date = document.getElementById('date').value;
            const tourSelect = document.getElementById('tour-type');
            const tourName = tourSelect.options[tourSelect.selectedIndex].text;

            let detailsText = (document.getElementById('additional-details')?.value || '').trim();
            if (!detailsText) detailsText = "None provided.";

            const guests = (document.getElementById('guests')?.value || '').trim();
            const phone = (document.getElementById('phone')?.value || '').trim();
            const experience = document.getElementById('experience')?.value || '';
            const targets = (document.getElementById('target-species')?.value || '').trim();
            const source = getSource();

            if (submitterId === 'btn-whatsapp') {
                fireConversion();

                const whatsappMessage = `Hello Thattekad Birding!\n\nI would like to send an enquiry for a tour:\n\n*Name:* ${name}\n*Email:* ${email}\n*Date:* ${date}\n*Tour:* ${tourName}\n*Guests:* ${guests || 'Not given'}\n${phone ? `*Phone:* ${phone}\n` : ''}${experience ? `*Experience:* ${experience}\n` : ''}${targets ? `*Target species:* ${targets}\n` : ''}*Additional Details:* ${detailsText}\n\nPlease let me know the availability and pricing.\n\n(Ref: ${source.label})`;
                window.open(`https://wa.me/918921243251?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener');

                form.style.display = 'none';
                renderStatus(messageDiv, {
                    icon: 'fa-solid fa-circle-check', color: '#25D366', size: '3rem',
                    lines: [`Thank you, ${name}!`, 'Your enquiry has been opened in WhatsApp.']
                });
                messageDiv.className = 'success-msg';
            }
            else if (submitterId === 'btn-email') {
                sending = true;
                const buttons = form.querySelectorAll('button');
                buttons.forEach(b => b.disabled = true);

                renderStatus(messageDiv, {
                    icon: 'fa-solid fa-spinner fa-spin', color: 'var(--accent)', size: '3rem',
                    lines: ['Sending your enquiry...']
                });
                messageDiv.className = 'success-msg';

                sendToWeb3Forms({
                    access_key: "0f708846-4d24-4ff1-bff5-e038dd1a925c",
                    subject: `New Tour Enquiry: ${tourName} - ${name}`,
                    from_name: "Thattekad Birding Website",
                    replyto: email,
                    Name: name,
                    Email: email,
                    Date: date,
                    Requested_Tour: tourName,
                    Guests: guests,
                    Phone: phone || 'Not given',
                    Birding_Experience: experience || 'Not given',
                    Target_Species: targets || 'Not given',
                    Additional_Details: detailsText,
                    Traffic_Source: sourceText(source)
                })
                .then((ok) => {
                    if (ok) {
                        fireConversion();
                        form.style.display = 'none';
                        renderStatus(messageDiv, {
                            icon: 'fa-solid fa-circle-check', color: 'var(--accent)', size: '3rem',
                            lines: [`Success, ${name}!`, 'Your enquiry has been sent directly to our team. We will email you back shortly.']
                        });
                    } else {
                        throw new Error('rejected');
                    }
                })
                .catch((err) => {
                    // The form stays visible so the visitor keeps what they typed
                    buttons.forEach(b => b.disabled = false);
                    renderStatus(messageDiv, {
                        icon: 'fa-solid fa-circle-exclamation', color: 'red', size: '3rem',
                        lines: err && err.message === 'rejected'
                            ? ['Oops! Something went wrong.', 'Please try again, or contact us via WhatsApp instead.']
                            : ['Oops! Something went wrong.', 'Please check your internet connection and try again.']
                    });
                    messageDiv.className = 'success-msg';
                })
                .finally(() => { sending = false; });
            }

            messageDiv.classList.remove('hidden');
        });
    }

    // 7. QUICK EMAIL POPUP FORM (On all pages)
    const quickForm = document.getElementById('quick-email-form');
    const quickMessageDiv = document.getElementById('quick-form-message');

    if (quickForm && quickMessageDiv) {
        const honeypot = addHoneypot(quickForm);
        let sending = false;

        quickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (honeypot.value || sending) return;
            sending = true;

            const name = document.getElementById('quick-name').value.trim();
            const email = document.getElementById('quick-email').value.trim();
            const message = document.getElementById('quick-message').value.trim();
            const btn = quickForm.querySelector('button[type="submit"]');
            if (btn) btn.disabled = true;

            quickMessageDiv.classList.remove('hidden');
            renderStatus(quickMessageDiv, {
                icon: 'fa-solid fa-spinner fa-spin', color: 'var(--accent)', size: '2.5rem',
                lines: ['Sending message...']
            });

            sendToWeb3Forms({
                access_key: "0f708846-4d24-4ff1-bff5-e038dd1a925c",
                subject: `Quick Enquiry from ${name}`,
                from_name: "Thattekad Birding Popup",
                replyto: email,
                Name: name,
                Email: email,
                Message: message,
                Traffic_Source: sourceText(getSource())
            })
            .then((ok) => {
                if (!ok) throw new Error('rejected');
                fireConversion();
                quickForm.style.display = 'none';
                renderStatus(quickMessageDiv, {
                    icon: 'fa-solid fa-circle-check', color: 'var(--accent)', size: '2.5rem',
                    lines: ['Sent Successfully!', `We will reply to ${email} shortly.`]
                });
            })
            .catch((err) => {
                // Form stays visible so the message isn't lost
                if (btn) btn.disabled = false;
                renderStatus(quickMessageDiv, {
                    icon: 'fa-solid fa-circle-exclamation', color: 'red', size: '2.5rem',
                    lines: [err && err.message === 'rejected'
                        ? 'Error sending. Please try again or use WhatsApp.'
                        : 'Connection error. Please try again or use WhatsApp.']
                });
            })
            .finally(() => { sending = false; });
        });
    }

    // 8. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // No observer support, or the visitor prefers less motion: just show everything
        if (!('IntersectionObserver' in window) || reduceMotion) {
            revealElements.forEach(el => el.classList.add('active'));
        } else {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

            revealElements.forEach(el => revealObserver.observe(el));
        }
    }

    // 9. (Removed) The old cookie banner lived here. consent.js now handles consent.
});

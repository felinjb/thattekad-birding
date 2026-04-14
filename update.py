import os
import glob
import re

css_file = 'style.css'
html_files = glob.glob('*.html')
js_file = 'script.js'

# Update CSS colors
with open(css_file, 'r', encoding='utf-8') as f:
    css = f.read()

css = re.sub(r'(?i)#00BFA5', '#C09F5A', css) # Gold accent
css = re.sub(r'(?i)#FF3D00', '#1C3A27', css) # Deep green
css = re.sub(r'(?i)#e63600', '#132A1C', css) # Darker green for hover
# Make buttons luxurious
css = css.replace('border-radius: 50px;', 'border-radius: 2px;')

# Overwrite opener CSS
opener_css_new = '''
/* --- Minimalist Bird Opener --- */
.page-opener {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #FAFAFA;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
}

.bird-loader {
    width: 60px;
    height: 60px;
    animation: pulseBird 2.5s infinite ease-in-out;
}

.bird-loader path {
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation: drawBird 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes drawBird {
    0% { stroke-dashoffset: 400; opacity: 1; }
    80% { stroke-dashoffset: 0; fill: transparent; }
    100% { stroke-dashoffset: 0; fill: #C09F5A; }
}

@keyframes pulseBird {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.page-opener.fade-out {
    opacity: 0;
    visibility: hidden;
}
'''

# Find opacity 0.5s ease-out in opener and replace the opener block
css_lines = css.split('\n')
for i, line in enumerate(css_lines):
    if '/* --- Page Opener Preloader --- */' in line:
        start_opener = i
        break
for i, line in enumerate(css_lines[start_opener:]):
    if '/* --- Scroll Animations --- */' in line:
        end_opener = start_opener + i
        break

css = '\n'.join(css_lines[:start_opener]) + '\n' + opener_css_new + '\n' + '\n'.join(css_lines[end_opener:])

# Add staggered layout CSS for elegant home page
css += '''

/* --- Elegant Staggered Layout for Homepage --- */
.elegant-staggered {
    display: flex;
    align-items: center;
    gap: 4rem;
    margin-bottom: 6rem;
}
.elegant-staggered:nth-child(even) {
    flex-direction: row-reverse;
}
.elegant-img {
    flex: 1;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}
.elegant-img img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    transition: transform 0.6s ease;
    display: block;
}
.elegant-img:hover img {
    transform: scale(1.05);
}
.elegant-text {
    flex: 1;
    padding: 2rem;
}
.elegant-text h3 {
    font-size: 2rem;
    color: #1C3A27;
    margin-bottom: 1.5rem;
}
.elegant-text p {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 1.5rem;
    line-height: 1.8;
}
@media (max-width: 992px) {
    .elegant-staggered, .elegant-staggered:nth-child(even) {
        flex-direction: column;
        gap: 2rem;
    }
}
'''

with open(css_file, 'w', encoding='utf-8') as f:
    f.write(css)

# Update HTML files with new preloader and footer
new_preloader = '''<!-- Preloader Opener -->
    <div class="page-opener">
        <svg viewBox="0 0 150 150" class="bird-loader">
            <path d="M 20 70 C 40 30, 60 50, 75 60 C 90 50, 110 30, 130 70 C 110 90, 80 60, 75 60 C 70 60, 40 90, 20 70 Z" fill="none" stroke="#C09F5A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>'''

new_footer = '''<footer class="main-footer" id="contact" style="background-color: #1a1a1a;">
        <div class="footer-bottom" style="padding: 2rem;">
            <p style="margin-bottom: 10px; font-size: 1.1rem; letter-spacing: 1px;"><i class="fas fa-envelope"></i> info@thattekadbirding.com &nbsp;&nbsp;|&nbsp;&nbsp; <i class="fas fa-phone"></i> +91 8921243251</p>
            <p style="opacity: 0.6; font-size: 0.9rem;">© 2026 Thattekad Birding | Salim Ali Bird Sanctuary, Kerala</p>
        </div>
    </footer>'''

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace preloader
    html = re.sub(r'<!-- Preloader Opener -->.*?</div>', new_preloader, html, flags=re.DOTALL)
    
    # Replace footer
    html = re.sub(r'<footer class="main-footer".*?</footer>', new_footer, html, flags=re.DOTALL)

    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)

# Update script.js timeout to allow bird to finish drawing
with open(js_file, 'r', encoding='utf-8') as f:
    js = f.read()

js = re.sub(r'setTimeout\(\(\) => \{[\s\S]*?\}, 400\);', 'setTimeout(() => { opener.classList.add("fade-out"); }, 2000);', js)

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(js)

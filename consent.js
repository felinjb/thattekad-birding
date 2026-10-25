/*!
 * consent.js - Thattekad Birding
 *
 * Cookie banner + consent-gated tracking.
 * Google Analytics, Google Ads and Plerdy are NOT requested until the visitor
 * clicks "Accept". The choice is remembered in localStorage and can be changed
 * any time from the "Cookie settings" link in the footer.
 *
 * Add to a page with:   <script src="consent.js" defer></script>
 * (add data-plerdy="true" on the tag for pages that should also load Plerdy)
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'tb-cookie-consent';      // 'granted' | 'denied'
    var GA_ID  = 'G-WXGEJ9RLRT';
    var ADS_ID = 'AW-17993783369';

    var thisScript = document.currentScript;
    var usePlerdy = !!(thisScript && thisScript.getAttribute('data-plerdy') === 'true');

    /* ---------- stored choice ---------- */
    function getChoice() {
        try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }
    function setChoice(value) {
        try { window.localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* private mode: ask again next page */ }
    }

    /* ---------- tracking (only ever called after consent) ---------- */
    var trackingLoaded = false;

    function loadPlerdy() {
        // Same snippet that used to sit at the bottom of gallery.html.
        var p = document.createElement('script');
        p.type = 'text/javascript';
        p.setAttribute('data-plerdy_code', '1');
        p.text = `
            var _protocol="https:"==document.location.protocol?"https://":"http://";
            _site_hash_code = "e67f7ebc5c109baddac8810504c6e449",_suid=76336, plerdyScript=document.createElement("script");
            plerdyScript.setAttribute("defer",""),plerdyScript.dataset.plerdymainscript="plerdymainscript",
            plerdyScript.src="https://a.plerdy.com/public/js/click/main.js?v="+Math.random();
            var plerdymainscript=document.querySelector("[data-plerdymainscript='plerdymainscript']");
            plerdymainscript&&plerdymainscript.parentNode.removeChild(plerdymainscript);
            try{document.head.appendChild(plerdyScript)}catch(t){console.log(t,"unable add script tag")}
        `;
        document.body.appendChild(p);
    }

    function loadTracking() {
        if (trackingLoaded) return;
        trackingLoaded = true;

        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        // Global on purpose: script.js checks `typeof gtag === 'function'` before firing conversions.
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
        window.gtag('config', ADS_ID);

        if (usePlerdy) loadPlerdy();
    }

    // Visitors who already accepted: keep the old "wait for first interaction" behaviour
    // so tracking never competes with the first paint.
    function loadTrackingOnFirstInteraction() {
        ['scroll', 'mousemove', 'touchstart', 'click'].forEach(function (evt) {
            window.addEventListener(evt, loadTracking, { once: true, passive: true });
        });
        setTimeout(loadTracking, 4000);
    }

    /* ---------- banner ---------- */
    var CSS = [
        '#tb-consent{position:fixed;left:16px;bottom:16px;z-index:99998;max-width:440px;box-sizing:border-box;',
        'background:#112a20;color:rgba(255,255,255,.92);border:1px solid rgba(255,255,255,.14);border-radius:12px;',
        'padding:18px 18px 16px;box-shadow:0 12px 40px rgba(0,0,0,.35);',
        'font-family:"Poppins",-apple-system,"Segoe UI",sans-serif;font-size:.88rem;line-height:1.55}',
        '#tb-consent[hidden]{display:none}',
        '#tb-consent p{margin:0 0 14px}',
        '#tb-consent strong{color:#d4a373}',
        '#tb-consent a{color:#d4a373;text-decoration:underline}',
        '#tb-consent .tb-actions{display:flex;gap:10px}',
        '#tb-consent button{flex:1;font:600 .9rem "Poppins",-apple-system,"Segoe UI",sans-serif;padding:10px 14px;',
        'border-radius:8px;cursor:pointer;border:2px solid #d4a373;transition:background .2s,color .2s}',
        '#tb-accept{background:#d4a373;color:#0b1c15}',
        '#tb-accept:hover{background:#bc8a5f;border-color:#bc8a5f}',
        '#tb-decline{background:transparent;color:#fff;border-color:rgba(255,255,255,.55)}',
        '#tb-decline:hover{background:rgba(255,255,255,.1)}',
        '#tb-consent button:focus-visible,#tb-consent a:focus-visible{outline:3px solid #fff;outline-offset:2px}',
        '@media (max-width:600px){#tb-consent{left:12px;right:12px;bottom:12px;max-width:none}}'
    ].join('');

    var banner = null;

    function buildBanner() {
        if (banner) return banner;

        var style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        banner = document.createElement('div');
        banner.id = 'tb-consent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.hidden = true;
        banner.innerHTML =
            '<p><strong>Cookies on this site.</strong> With your OK we use Google Analytics, Google Ads and Plerdy ' +
            'to see how the site is used and to measure our ads. Nothing is loaded until you accept. ' +
            '<a href="legal.html">Privacy &amp; policies</a></p>' +
            '<div class="tb-actions">' +
            '<button type="button" id="tb-decline">Decline</button>' +
            '<button type="button" id="tb-accept">Accept</button>' +
            '</div>';
        document.body.appendChild(banner);

        banner.querySelector('#tb-accept').addEventListener('click', function () { choose('granted'); });
        banner.querySelector('#tb-decline').addEventListener('click', function () { choose('denied'); });
        return banner;
    }

    function showBanner(focusIt) {
        buildBanner().hidden = false;
        if (focusIt) banner.querySelector('#tb-accept').focus();
    }

    function hideBanner() {
        if (banner) banner.hidden = true;
    }

    function choose(value) {
        setChoice(value);
        hideBanner();
        if (value === 'granted') {
            loadTracking();
        } else if (trackingLoaded) {
            // Changed their mind after tracking started: switch it off and reload to drop the scripts.
            window['ga-disable-' + GA_ID] = true;
            window['ga-disable-' + ADS_ID] = true;
            window.location.reload();
        }
    }

    /* ---------- "Cookie settings" link in the footer (works whenever it is present) ---------- */
    document.addEventListener('click', function (e) {
        var link = e.target.closest ? e.target.closest('#cookie-settings') : null;
        if (!link) return;
        e.preventDefault();
        showBanner(true);
    });

    /* ---------- tbTrack(): lets other scripts report events, but only if the visitor accepted ---------- */
    window.tbTrack = function (eventName, params) {
        if (getChoice() !== 'granted') return;
        loadTracking();                       // safe to call repeatedly; defines window.gtag
        window.gtag('event', eventName, params || {});
    };

    /* ---------- start ---------- */
    function init() {
        var choice = getChoice();
        if (choice === 'granted') {
            loadTrackingOnFirstInteraction();
        } else if (choice !== 'denied') {
            showBanner(false);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

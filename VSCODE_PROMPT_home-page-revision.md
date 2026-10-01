You are working on the Aqua Doctor Solutions website (static HTML/CSS/JS, deployed on Vercel). Implement the client's Home Page Revision Brief described below. Read this whole prompt before changing anything, then work section by section.

## 0. Project rules (follow strictly)

- Edit ONLY the source files: `src/pages/*.html`, `src/partials/*.html`, `css/site.css`, `js/site.js`, `js/products.js`. Never edit the root `*.html` files by hand; they are generated.
- After every set of changes run `python build.py` so the root HTML files are regenerated.
- Keep the existing design system in `css/site.css` (colour tokens, spacing, fonts, `.section`, `.btn`, `.label`, `.flag`, `.reveal`, etc.). New sections must look like they belong to the same site. Do not add frameworks or new libraries.
- Keep existing line endings (CRLF) in the files you edit.
- Do not invent facts, numbers, testimonials or links. Where the client has not supplied something, use the site's existing "Client content required" orange flag pattern (`<span class="flag">Client content required</span>`) and a clearly named constant/placeholder that is easy to fill later.
- Keep accessibility at the current level: one `<h1>` per page, alt text on every content image, `aria-label` on icon-only buttons, keyboard-operable sliders, visible focus, and `prefers-reduced-motion` respected (no autoplay, no count-up, no auto-slide when reduced motion is on).
- Every new image: `loading="lazy"` (except the first hero slide), explicit `width` and `height` attributes, `object-fit` where needed.
- Mobile first. Test at 360px, 390px, 768px, 1280px and 1440px. Nothing may scroll sideways.

## 1. New asset files (already copied into the project)

- `images/hero/hero-01-matsya-launch.jpg` – Matsya Sathi launch event
- `images/hero/hero-02-startup-expo.jpg` – Startup expo stall
- `images/hero/hero-03-biofloc-women.jpg` – Biofloc tanks with women farmers
- `images/hero/hero-04-pondside-training.jpg` – Pond-side training
- `images/hero/hero-05-farmer-training.jpg` – Farmer training programme
- `images/recognition/rec-01-siliconindia.jpg` … `rec-06-samay-sangbad.jpg` – the six recognition slide photos (order in section 6 below)
- `_brief-reference/` – layout reference screenshots ONLY (recognition layout, logo carousel layout, client feedback layout, business card, current key numbers). Look at them for layout, but never use these files or their text on the site. Add `_brief-reference/` to both `.vercelignore` and `.gitignore`.

Existing assets to reuse: `images/matsya.webp` (Matsya Sathi logo, "Powered by ADS"), `images/hero-aer.jpg` (aerator photo, use as video poster), and the partner logos `images/logo-L*.webp`.

## 2. Site-wide config

At the top of `js/site.js`, next to `WA_NUMBER`, add clearly commented constants:

```js
var MATSYA_APP_URL = "";          // CLIENT TO SUPPLY: APK file path, Play Store or App Store link
var HERO_VIDEO_SRC = "images/hero/aerator.mp4"; // CLIENT TO SUPPLY: aerator video file
var VISITOR_API = "/api/visits";  // visitor counter endpoint (see section 9)
```

## 3. Header and navigation (`src/partials/header.html`)

1. Logos: show the ADS logo AND the Matsya Sathi logo (`images/matsya.webp`) side by side in the header on desktop and mobile, with a thin divider between them. Keep both logos crisp and vertically centred. On mobile, both logos must fit next to the menu button without wrapping.
2. The Matsya Sathi logo is a link that downloads the app:
   - It uses `MATSYA_APP_URL`. If the URL ends in `.apk`, add the `download` attribute so the download starts immediately. If it is a store link, open it in a new tab with `rel="noopener"`.
   - While `MATSYA_APP_URL` is empty, clicking scrolls to the Matsya Sathi app section on the home page (or goes to `index.html#matsya-sathi` from other pages). It must not be a dead `#` link.
   - Tooltip on hover and focus: "Download Matsya Sathi App" (use a real CSS tooltip plus `aria-label`, not only `title`).
   - The existing "Download Matsya Sathi" store button in the home page app section must use the same constant.
3. Navigation items, in this exact order: Home, About Us, Our Services, Our Products, Media, Careers, Join With Us. Keep the existing About Us dropdown. Remove "Achievements" from the main menu only. Keep `achievements.html` and its footer link. Keep the "Contact us" button.
4. Keep the hamburger menu on mobile and the active-page highlight (`data-nav`) working.
5. Fix while you are here: the header "Doctor-on-Call" phone block (`.header-call`) currently only appears from 1400px wide, and the phone icon only on mobile, so laptops at 1024–1399px show no phone number. Make the number or the phone icon visible at every width, and add `white-space:nowrap` so the number never wraps onto several lines.

## 4. Hero section (`src/pages/index.html`, `.hero`)

1. Remove the animated bubbles background completely (`<div class="hero-bubbles">` and all its CSS/JS).
2. Follow the layout and feel of the client's reference site (https://wfgn.thoondil-ecosystem.com/):
   - Full-width banner with a calm deep teal / water-blue background (a gradient with a very subtle slow water/ripple texture made in CSS; no bubbles, no external video files). Use the site's own petrol/cyan colour tokens.
   - LEFT column (about 55%): a small rounded "pill" badge above the heading (text: "Matsya Sathi app by Aqua Doctor Solutions"), then the large `<h1>` in white with the words "From Pond to Profit" highlighted in the site's cyan accent colour, then a short paragraph, a short list of 3–4 points with check icons (use existing site facts only: Doctor-on-Call fish health support, quality seed, feed and medicines, training and e-learning, farmer insurance and market linkage), and the buttons.
   - RIGHT column (about 45%): the slideshow inside a large rounded card with a soft shadow, sitting on the teal background (not full-bleed). The slide controls sit on/under this card.
   - The key numbers strip comes directly under the banner, like the stats row on the reference site.
   - On mobile: text first, then the slideshow card full width, then the buttons stay visible.
   - Take only the layout and feel from the reference. Do not copy its text, images, logo or colours exactly.
3. Slides (in the right-hand card), in this order:
   1. hero-01-matsya-launch.jpg
   2. hero-02-startup-expo.jpg
   3. **Aerator video slide** (`HERO_VIDEO_SRC`, `muted`, `playsinline`, `preload="none"`, poster `images/hero-aer.jpg`). It only loads and plays when it is the active slide, pauses when it leaves, and advances to the next slide when the video ends. If the file is missing or fails to load, it simply shows the poster image like a normal slide.
   4. hero-03-biofloc-women.jpg
   5. hero-04-pondside-training.jpg
   6. hero-05-farmer-training.jpg
   Write a short, factual alt text for each photo based on its file name.
4. Controls: previous/next arrow buttons, progress indicators (one per slide; the active one fills over the slide duration), auto-advance about every 6 seconds, pause on hover (desktop) and while touching (mobile), swipe left/right on touch devices, arrow keys when focused. No autoplay when reduced motion is on.
5. Left-side text:
   - Remove the Bengali tagline from the hero.
   - Remove the "One shop, one stop for modern aquaculture" heading.
   - The new `<h1>` is: **Matsya Sathi: From Pond to Profit**
   - Keep the short supporting paragraph below it.
   - Keep the Call, WhatsApp and Enquire buttons visible in the hero on ALL screen sizes (Call = `tel:+919875402885`, WhatsApp = `https://wa.me/919875402885` as a real href, Enquire = `join.html#enquiry`).
6. Remove the old hero caption box and slide counter if they no longer fit the new design.

## 5. Key numbers section (`.facts-section`)

1. Keep the five-counter layout. New values:
   - 2019 – Established on 14th July, in Kolkata (no change)
   - 6,000+ – Fish farmers connected to the ADS network
   - 15+ – FPCs and FFPOs connected to the network
   - 9+ – Fisheries institutes and KVKs with signed MoUs
   - 150+ – Online and offline training sessions last year
   Add an HTML comment above the section: `<!-- Figures to be confirmed by client -->`.
2. Delete the line "Source: Aqua Doctor Solutions Annual Report 2025".
3. Add a count-up animation that runs once when the section scrolls into view (IntersectionObserver). The final numbers must be in the HTML so they show correctly without JavaScript and for screen readers. The year 2019 must not count up from 0; animate only the four "+" numbers, keeping the comma format (6,000+). Skip the animation if reduced motion is on.

## 6. Our Core Areas (replaces the home "Our services" section)

1. Delete the home page "Our services" section (`aria-labelledby="svc-h"`). Do not touch `services.html`.
2. Add a new section in the same place: label "Our core areas", heading "Our Core Areas".
3. Five cards, icon + name only, no photographs:
   | Name | Icon (inline SVG, same stroke style as the existing `#i-*` symbols in `src/partials/head.html`) | Link |
   |---|---|---|
   | Trading | shopping cart / handshake | `products.html` |
   | Consultancy | speech bubbles | `services.html#consultancy` |
   | Technical Support | headset or wrench | `services.html#doctor-on-call` |
   | E-Learning | laptop with graduation cap | `services.html#training` |
   | Insurance | shield (with a small fish if it stays clean) | `services.html#insurance` |
4. Same icon size, colour and card style for all five. Grid: 5 across on desktop, 2 across on mobile (the 5th card centred or spanning both columns). Subtle hover and focus states.
5. Add the new icons as `<symbol>` entries in `src/partials/head.html`.

## 7. Remove sections from the home page

- Delete the "Who we work with" section (`aria-labelledby="who-h"`).
- Delete the "Our products" section (`aria-labelledby="prod-h"`). Products stay on `products.html`.
- Delete the old "Achievements and recognition" section (`aria-labelledby="ach-h"`), the old "Institutions we work with" logo grid (`aria-labelledby="partners-h"`) and the old "What farmers say about us" section (`aria-labelledby="fb-h"`). Sections 8–10 below replace them.
- Remove any CSS/JS that is now unused because of these deletions (keep anything still used on other pages).

## 8. Company Recognition (new section)

1. Heading: **Recognitions That Inspire Us to Do Better**. Light background panel.
2. Slider layout (see `_brief-reference/ref-recognition-layout.jpg`): slide title and write-up on the LEFT, photograph on the RIGHT, slide counter "1 / 6" with previous/next arrows under the text. On mobile, stack the photo above the text.
3. Photos have mixed shapes (some portrait), so show them in a fixed-ratio frame with `object-fit: contain` on a soft background. Never crop off text in the news cuttings. Clicking a photo opens it in the existing lightbox.
4. Slides, in this order, with this exact text:
   1. `rec-01-siliconindia.jpg`. **SiliconIndia: 10 Best Fisheries & Aquaculture Startups 2024**. MatsyaSathi was featured by SiliconIndia StartUp City among the 10 Best Fisheries and Aquaculture Startups of 2024, recognised for its one-stop solution for aquaculture. Featured: Dr. Debtanu Barman, Founder & CEO.
   2. `rec-02-up-summit.jpg`. **UP Fisheries Investment & Growth Summit 2025**. Dr. Debtanu Barman was felicitated at the UP Fisheries Investment & Growth Summit 2025, organised by the Government of Uttar Pradesh at ICAR-NBFGR, Lucknow (17-18 December).
   3. `rec-03-grant-20-lakh.jpg`. **Barman Aqua Clinics Pvt Ltd Receives ₹20 Lakh Grant**. Barman Aqua Clinics Pvt Ltd received a grant of ₹20 lakh, as reported by YourAgriStory, supporting our work in aquaculture healthcare and farmer services.
   4. `rec-04-mfoi-awards.jpg`. **Krishi Jagran MFOI Awards**. Dr. Debtanu Barman received an award at the Krishi Jagran MFOI Awards, honouring contribution to Indian agriculture and aquaculture.
   5. `rec-05-ifsic-2025.jpg`. **Fisheries Students' Innovation & Startup Conference 2025**. Honoured with a memento at the Fisheries Students' Innovation & Startup Conference 2025 (IFSIC), themed "Re-imagining Indian Fisheries 2047".
   6. `rec-06-samay-sangbad.jpg`. **Matsya Sathi Launch: Samay Sangbad Live**. The launch of Matsya Sathi at Kajla Janakalyan Samiti was covered by Samay Sangbad, highlighting our mission to improve the economic condition of fish farmers.
   Add an HTML comment: `<!-- Write-ups drafted from photos; client to confirm dates, award names and wording -->`.
5. Behaviour: arrows, keyboard arrows, touch swipe, `aria-live="polite"` on the counter. No auto-advance (the user reads the text). Add a "View all achievements" link to `achievements.html` below the slider.

## 9. Supported By / Associated With (new section, directly below Recognition)

1. Heading: **Supported By / Associated With**.
2. Auto-sliding logo carousel with left/right arrow buttons (see `_brief-reference/ref-logo-carousel-layout.jpg`): about 4 logos visible on desktop, 3 on tablet, 2 on mobile. Infinite loop, slides one logo at a time every ~3 seconds, pauses on hover/focus, no auto-slide with reduced motion.
3. Logos in greyscale by default, full colour on hover/focus. Optional one-line caption under each logo.
4. Logos, in this order:
   - ABIF IIT Kharagpur (Agri Business Incubation Foundation) – `logo-L40.webp`
   - Technology Innovation Hub – `logo-L26.webp` (caption from the brief says "IIT Kharagpur" but the current site says "IITG TIDF"; keep the current alt text and add `<!-- client to confirm: IIT Kharagpur or IIT Guwahati -->`)
   - NABARD – `logo-L32.webp`
   - BIONEST Life Sciences – `logo-L24.webp`
   - Pusa Krishi – `logo-L11.webp`
   - Department of Biotechnology, Government of India – NO FILE YET: show a neutral placeholder tile with the name in text and a "Client content required" flag
   - IIM Calcutta Innovation Park – `logo-L46.webp`
5. Keep the other existing partner logos out of this carousel, but leave them as a commented-out list in the HTML so they can be re-added quickly.

## 10. Client Feedback (new section)

1. Heading: **What Our Clients Say**. Subtitle: **Real feedback from our valued farmers and partners**.
2. Layout (see `_brief-reference/ref-client-feedback-layout.jpg`): four testimonial cards in a 2 × 2 grid on a water-themed background (use an existing pond photo from `images/` with a dark overlay, or a CSS water gradient). On mobile, cards stack in one column.
3. Each card: quote icon, feedback text, round initials badge, name, and role (e.g. Farmer, Fish Trader).
4. The client has NOT supplied real testimonials yet. Do not copy any text from the reference image (it belongs to another company) and do not write fake quotes. Build the four cards with clearly marked placeholder content: a "Client content required" flag, "Farmer feedback to be supplied" as the text, "Name" and "Role, village/district" as the details. Store the cards' content in an easy-to-edit array in JS or as simple repeated HTML.

## 11. Footer (`src/partials/footer.html`)

1. **Address.** Replace the old address everywhere it appears (footer, `src/pages/join.html`, `src/pages/about.html`, `src/pages/careers.html`; search the whole `src/` folder for "Arabinda") with:
   Regus Horizon, Unit 1B - Horizon,
   1005 Eastern Metropolitan Bypass, Level 1 & 3,
   Kolkata, West Bengal 700105
   Phone numbers stay the same.
2. **Visitor counter.** At the very end of the footer, add "Total Number of Visitors: N".
   - Create a Vercel serverless function `api/visits.js` that increments and returns a counter using Upstash Redis through its REST API (env vars `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`; plain `fetch`, no npm dependency). `POST` increments and returns the new total; `GET` only returns the total.
   - In `js/site.js`: on first page view in a browser session, `POST` (remember this in `sessionStorage` so one visit is not counted on every page); on later page views, `GET`. Format the number with Indian digit grouping (`toLocaleString("en-IN")`).
   - If the API fails or the env vars are missing, hide the counter line entirely. No error text and no "0".
   - Make sure `.vercelignore` does not exclude the `api/` folder.
   - Write short setup steps in `README.md`: create a free Upstash Redis database via the Vercel Marketplace, add the two env vars, redeploy.

## 12. Final home page order

Header → Hero → Key numbers → Our Core Areas → About ADS → Service journey → From our CEO's desk → Adopt the Village (impact) → Matsya Sathi app → Company Recognition → Supported By / Associated With → Client Feedback → Doctor-on-Call band → Footer (with visitor counter).
(The brief does not mention About ADS, Service journey, CEO's desk, Impact and the Matsya Sathi app section, so keep them as they are. Give the Matsya Sathi app section `id="matsya-sathi"`.)

## 13. Done checklist (verify each item before finishing)

- [ ] `python build.py` ran and all 9 root HTML pages were regenerated.
- [ ] No console errors on any page; no horizontal scrolling at 360px–1440px.
- [ ] Both logos are in the header on every page; the Matsya Sathi link and tooltip work; Achievements is gone from the menu but its page still works.
- [ ] No bubbles anywhere; hero has 5 photos + video slide with arrows, progress bars, swipe and pause; the H1 is "Matsya Sathi: From Pond to Profit"; no Bengali tagline or "One shop" text in the hero.
- [ ] Key numbers updated, source line gone, count-up runs once.
- [ ] Core Areas: 5 icon cards, 5 across desktop / 2 across mobile.
- [ ] "Who we work with" and home "Our products" sections removed.
- [ ] Recognition slider: 6 slides, correct photo with correct text, "1 / 6" counter.
- [ ] Logo carousel loops, greyscale to colour on hover, DBT placeholder shown.
- [ ] Feedback section has 4 placeholder cards, no copied text.
- [ ] New address on every page; visitor counter hides itself cleanly when the API is not configured.
- [ ] Reduced motion: no autoplay, no auto-slide, no count-up.
- [ ] Keyboard: every slider and button is reachable with Tab and usable with Enter/arrow keys.

When finished, give me a short summary of what changed per file, plus a list of everything still waiting for client content.

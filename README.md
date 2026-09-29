# Aqua Doctor Solutions website (design for client approval, v2)

Static HTML, CSS and JavaScript. No install needed.

## How to run
- **Quickest:** double-click `index.html` to open it in Chrome or Edge.
- **Local server (recommended):** in this folder run `python -m http.server 8000`, then open http://localhost:8000
- **VS Code:** install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".
- **On a real phone:** run `python -m http.server 8000 --bind 0.0.0.0`, find this computer's IPv4 address with `ipconfig`, then on a phone on the same Wi-Fi open `http://<that-address>:8000`. Windows may ask to allow Python through the firewall.
- **Phone preview on the computer:** in Chrome press F12, then Ctrl+Shift+M, and pick a device such as iPhone 12 Pro.

## Pages
`index.html` Home · `about.html` About us · `impact.html` Impact and projects · `services.html` Our services · `products.html` Our products · `achievements.html` Achievements · `media.html` Media · `careers.html` Career opportunities · `join.html` Join with us (contact)

## How the files are organised
- `src/pages/*.html`: the content of each page (only the part inside `<main>`).
- `src/partials/`: the shared head, header, Doctor-on-Call band and footer.
- `src/data/awards.json`: the awards register shown on the Achievements page.
- `build.py`: joins partials and pages into the finished HTML files in this folder.

**After editing anything in `src/`, run `python build.py`.** Do not edit the root `*.html` files directly; they are overwritten by the build.

- `css/site.css`: the whole design system. Brand colours (taken from the registered logo) are at the top.
- `js/site.js`: navigation, hero slideshow, lightbox, filters, forms. `WA_NUMBER` sets the WhatsApp number.
- `js/products.js`: the product catalogue. Add a product by adding one line.
- `images/ads-logo.jpg`: an unmodified copy of `ADS Registered Logo (1).jpeg`.
- `images/awards/`: award photographs exported from the awards document (resized only, never cropped).
- `_archive/v1-single-page/`: the previous single-page version, kept for reference.

## Content rules used
All facts come from the three client documents. Nothing was invented. Places where content is still missing are marked with an orange **CLIENT CONTENT REQUIRED** tag.

## Not built yet (after approval)
Form submission (forms currently show a confirmation only), video embeds, Google Map, social media links, app store link.

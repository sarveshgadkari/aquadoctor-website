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

App and legal pages (linked from the footer of every page): `matsya-sathi.html` Matsya Sathi app (a product of Aqua Doctor Solutions) · `privacy-policy.html` Privacy Policy · `terms.html` Terms of Use · `delete-account.html` Delete your Matsya Sathi account.
For the Google Play Console use: Privacy policy URL = `<site>/privacy-policy.html`, Delete account URL = `<site>/delete-account.html`. The deletion form has no backend: it opens a filled-in email or WhatsApp message to ADS.

## How the files are organised
- `src/pages/*.html`: the content of each page (only the part inside `<main>`).
- `src/partials/`: the shared head, header, Doctor-on-Call band and footer.
- `src/data/awards.json`: the awards register shown on the Achievements page.
- `build.py`: joins partials and pages into the finished HTML files in this folder.

**After editing anything in `src/`, run `python build.py`.** Do not edit the root `*.html` files directly; they are overwritten by the build.

- `css/site.css`: the whole design system. Brand colours (taken from the registered logo) are at the top.
- `js/site.js`: navigation, sliders, lightbox, filters, forms. The settings at the top of the file:
  - `WA_NUMBER`: the WhatsApp number.
  - `MATSYA_APP_URL`: the Matsya Sathi app download (an `.apk` file path, or a Play Store / App Store link). While it is empty, the header logo and the home page button scroll to the app section.
  - `HERO_VIDEO_SRC`: the aerator video for the home page slideshow (default `images/hero/aerator.mp4`). Until the file exists, the slide shows the poster photo.
  - `VISITOR_API`: the visitor counter endpoint (`/api/visits`).
- `api/visits.js`: the visitor counter (a Vercel serverless function, see below).
- `js/products.js`: the product catalogue. Add a product by adding one line.
- `images/ads-logo.jpg`: an unmodified copy of `ADS Registered Logo (1).jpeg`.
- `images/awards/`: award photographs exported from the awards document (resized only, never cropped).
- `_archive/v1-single-page/`: the previous single-page version, kept for reference.

## Content rules used
All facts come from the three client documents. Nothing was invented. Places where content is still missing are marked with an orange **CLIENT CONTENT REQUIRED** tag.

## Visitor counter setup (Vercel)
The footer shows "Total Number of Visitors: N". It stays hidden until these steps are done, and whenever the counter cannot be reached. It also stays hidden when the site is opened as a local file.
1. In the Vercel dashboard, open the project, go to **Storage** (Marketplace) and create a free **Upstash Redis** database. Connect it to this project.
2. Make sure the project has the two environment variables `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (Settings → Environment Variables). Connecting the database usually adds them; if not, copy them from the Upstash console ("REST API" section).
3. Redeploy the project (Deployments → … → Redeploy) so the function picks up the variables.

Each browser session counts once: the first page view sends a `POST` (adds one), later pages only `GET` the total.

## Not built yet (after approval)
Form submission (forms currently show a confirmation only), video embeds, Google Map, social media links, app store link.

## Adding the client's photos and videos

Copy each file into its folder, then run `python build.py`. Every folder has a `_PUT-FILES-HERE.txt` note with the exact names.

| Client Drive folder | Put files in | Notes |
|---|---|---|
| Homepage_Slideshow | `images/hero/` | Shown in file-name order. Add alt text in `src/data/hero_alts.json`. Name the aerator video `hero-02a-aerator.mp4`. |
| Our Team | `images/team/` | `01-debtanu-barman.jpg` … `08-krishnendu-mandal.jpg` (names in `src/data/team.json`) |
| Our Journey | `images/about/` | `journey-1.mp4`, `journey-2.mp4`, `ceo-6-years.mp4` (optional `ceo-photo.jpg`) |
| Our Service | `images/services/climate/`, `hitech/`, `insurance/`, `training/` | Any names. |
| Recognition | `images/recognition/` | Replace a photo by using the same file name |
| Brochure | `images/media/` | `ads-brochure.pdf`, `ads-brochure-cover.jpg` |

Large phone photos: run `python tools/optimize_images.py` (needs `pip install pillow`). Keep videos under about 15 MB (MP4, H.264).
Matsya Sathi app link: set `MATSYA_APP_URL` at the top of `js/site.js`.
Product uses and pack sizes: add `uses: [...]` and `pack: "..."` to a product in `js/products.js`.

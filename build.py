"""Aqua Doctor Solutions website: page assembler.

Each page in src/pages/ holds only its <main> content plus a small header
block (title, description, nav key). This script wraps every page with the
shared <head>, header and footer from src/partials/ and writes the finished
static HTML files to the project root.

Run:  python build.py
"""
import json
import html
import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"


def read(p):
    return (SRC / p).read_text(encoding="utf-8")


def parse_page(text):
    m = re.match(r"\s*<!--(.*?)-->", text, re.S)
    meta = {}
    if m:
        for line in m.group(1).strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        text = text[m.end():]
    return meta, text.strip() + "\n"


# ---------- awards register (data in src/data/awards.json) ----------
def awards_blocks():
    data = json.loads(read("data/awards.json"))
    items = data["items"]
    order = data["year_order"]
    kinds = {k["id"]: k["label"] for k in data["kinds"]}
    out = []
    for year in order:
        group = [i for i in items if i["group"] == year]
        if not group:
            continue
        label = "Year to be confirmed" if year == "undated" else year
        gid = "y-" + year
        cards = []
        for it in group:
            img = it["images"][0]
            extra = ""
            if len(it["images"]) > 1:
                extra = f'<span class="aw-more">+{len(it["images"]) - 1} photo</span>'
            org = f'<span class="aw-org">{html.escape(it["org"])}</span>' if it.get("org") else ""
            note = f'<span class="aw-note">{html.escape(it["note"])}</span>' if it.get("note") else ""
            when = html.escape(it.get("when", label))
            gallery = "|".join(it["images"])
            cap = it["title"] + (" — " + it["detail"] if it.get("detail") else "") + (". " + it["org"] if it.get("org") else "")
            cards.append(
                f'<li class="aw" data-kind="{it["kind"]}">'
                f'<button class="aw-btn" type="button" data-lightbox="{html.escape(gallery)}" data-caption="{html.escape(cap)}">'
                f'<span class="aw-pic"><img src="{img}" alt="{html.escape(it["alt"])}" loading="lazy">{extra}</span>'
                f'<span class="aw-body"><span class="aw-meta"><span class="aw-kind">{html.escape(kinds[it["kind"]])}</span><span class="aw-when">{when}</span></span>'
                f'<span class="aw-title">{html.escape(it["title"])}</span>'
                + (f'<span class="aw-detail">{html.escape(it["detail"])}</span>' if it.get("detail") else "")
                + f'{org}{note}</span></button></li>'
            )
        out.append(
            f'<section class="aw-year" id="{gid}" aria-labelledby="{gid}-h" data-year="{year}">'
            f'<header class="aw-year-head"><h3 id="{gid}-h">{label}</h3><span class="aw-count">{len(group)} {"entry" if len(group) == 1 else "entries"}</span></header>'
            f'<ul class="aw-grid">{"".join(cards)}</ul></section>'
        )
    return "\n".join(out)


def year_nav():
    data = json.loads(read("data/awards.json"))
    present = {i["group"] for i in data["items"]}
    links = []
    for y in data["year_order"]:
        if y in present:
            links.append(f'<li><a href="#y-{y}">{"Undated" if y == "undated" else y}</a></li>')
    return "".join(links)


# ---------- client media helpers ----------
# Photos and videos from the client are dropped into folders under images/.
# These helpers look at what is actually in each folder when you run
# `python build.py`, so adding a photo = copy the file in + rebuild.
IMG_EXT = (".jpg", ".jpeg", ".png", ".webp")
VID_EXT = (".mp4", ".webm", ".mov", ".m4v")


def media_files(folder):
    d = ROOT / folder
    if not d.is_dir():
        return []
    files = [f for f in sorted(d.iterdir(), key=lambda f: f.name.lower())
             if f.is_file() and f.suffix.lower() in IMG_EXT + VID_EXT and not f.name.startswith(("_", "."))]
    return [f"{folder}/{f.name}" for f in files]


def find_file(base, exts):
    """images/team/02-md-reazuddin  ->  first existing file with one of the extensions."""
    for e in exts:
        for cand in (base + e, base + e.upper()):
            if (ROOT / cand).is_file():
                return cand
    return None


def vid_type(path):
    return {"webm": "video/webm"}.get(path.rsplit(".", 1)[-1].lower(), "video/mp4")


def slideshow(arg):
    """{{slideshow:FOLDER|fallback.jpg::alt;fallback2.jpg::alt|Label}}
    Uses every photo/video in FOLDER; if the folder is empty, the fallback photos are shown."""
    parts = arg.split("|")
    folder, label = parts[0].strip(), (parts[2].strip() if len(parts) > 2 else "Photos")
    items = [(f, f"{label}, photo {i + 1}") for i, f in enumerate(media_files(folder))]
    if not items and len(parts) > 1 and parts[1].strip():
        for pair in parts[1].split(";"):
            src, _, alt = pair.partition("::")
            if (ROOT / src.strip()).is_file():
                items.append((src.strip(), alt.strip() or label))
    if not items:
        return (f'<div class="gal gal-empty"><span class="flag">Client content required</span>'
                f'<p>Add photos to <code>{html.escape(folder)}/</code> and run <code>python build.py</code>.</p></div>')
    n = len(items)
    slides, dots = [], []
    for i, (src, alt) in enumerate(items):
        on = " is-on" if i == 0 else ""
        lazy = "" if i == 0 else ' loading="lazy"'
        if src.lower().endswith(VID_EXT):
            body = (f'<video muted playsinline preload="none" controls data-src="{html.escape(src)}" '
                    f'aria-label="{html.escape(label)}, video"></video>')
            kind = ' data-kind="video"'
        else:
            body = (f'<button class="gal-zoom" type="button" data-lightbox="{html.escape(src)}" data-group="{html.escape(folder)}" '
                    f'data-caption="{html.escape(label)}" aria-label="Enlarge: {html.escape(alt)}">'
                    f'<img src="{html.escape(src)}" alt="{html.escape(alt)}"{lazy}></button>')
            kind = ""
        hid = "" if i == 0 else ' aria-hidden="true"'
        cur = ' aria-current="true"' if i == 0 else ""
        slides.append(f'<div class="gal-slide{on}"{kind} role="group" aria-roledescription="slide" aria-label="{i + 1} of {n}"{hid}>{body}</div>')
        dots.append(f'<button type="button" aria-label="Show {i + 1} of {n}"{cur}></button>')
    ctrl = ""
    if n > 1:
        ctrl = ('<div class="gal-ctrl">'
                '<button class="icon-btn" type="button" data-gal-prev aria-label="Previous"><svg><use href="#i-left"/></svg></button>'
                f'<div class="gal-dots">{"".join(dots)}</div>'
                f'<span class="gal-count" aria-live="polite">1 / {n}</span>'
                '<button class="icon-btn" type="button" data-gal-next aria-label="Next"><svg><use href="#i-right"/></svg></button></div>')
    return (f'<div class="gal" data-gal aria-roledescription="carousel" aria-label="{html.escape(label)}">'
            f'<div class="gal-stage">{"".join(slides)}</div>{ctrl}</div>')


def youtube_id(url):
    m = re.search(r"(?:youtu\.be/|youtube(?:-nocookie)?\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/|live/))([\w-]{11})", url)
    return m.group(1) if m else None


def video_slot(arg):
    """{{video:images/about/journey-1|poster.jpg|Label}}: shows the video if the file exists,
    otherwise a clearly marked placeholder telling you where to put it.
    The first part can also be a YouTube link; the video is then embedded from YouTube."""
    parts = arg.split("|")
    base = parts[0].strip()
    poster = parts[1].strip() if len(parts) > 1 and parts[1].strip() else ""
    label = parts[2].strip() if len(parts) > 2 else "Video"
    yt = youtube_id(base) if base.startswith("http") else None
    if yt:
        return (f'<figure class="vslot"><iframe src="https://www.youtube-nocookie.com/embed/{yt}?rel=0" title="{html.escape(label)}" '
                'loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" '
                'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
                f'<figcaption class="img-caption">{html.escape(label)}</figcaption></figure>')
    src = find_file(base, VID_EXT)
    if src:
        pa = f' poster="{html.escape(poster)}"' if poster and (ROOT / poster).is_file() else ""
        return (f'<figure class="vslot"><video controls playsinline preload="metadata"{pa} aria-label="{html.escape(label)}">'
                f'<source src="{html.escape(src)}" type="{vid_type(src)}"></video>'
                f'<figcaption class="img-caption">{html.escape(label)}</figcaption></figure>')
    bg = f'<img src="{html.escape(poster)}" alt="" loading="lazy">' if poster and (ROOT / poster).is_file() else ""
    return (f'<figure class="vslot vslot-empty"><div class="video">{bg}<span class="play" aria-hidden="true"><svg><use href="#i-play"/></svg></span>'
            f'<div class="video-meta"><span>{html.escape(label)}</span><span class="mono">Video to be added</span></div></div>'
            f'<figcaption class="img-caption"><span class="flag">Client content required</span> Put the file at <code>{html.escape(base)}.mp4</code></figcaption></figure>')


def team_grid():
    data = json.loads(read("data/team.json"))
    out = []
    for i, m in enumerate(data["members"]):
        photo = find_file("images/team/" + m["file"], IMG_EXT) or (m.get("fallback") if m.get("fallback") and (ROOT / m["fallback"]).is_file() else None)
        if photo:
            pic = f'<div class="img-frame"><img src="{html.escape(photo)}" alt="{html.escape(m["name"])}, {html.escape(m["role"])}" loading="lazy"></div>'
        else:
            initials = "".join(w[0] for w in m["name"].replace("Dr.", "").replace("Md.", "").split()[:2]).upper()
            pic = (f'<div class="img-frame member-ph" role="img" aria-label="Photo of {html.escape(m["name"])} to be added">'
                   f'<span>{initials}</span><small>Photo to be added</small></div>')
        out.append(f'{pic}<b>{html.escape(m["name"])}</b><span>{html.escape(m["role"])}</span>')
    # hierarchy: the first member (CEO) on top, everyone else in one row below
    lead, rest = out[0], out[1:]
    return (f'<div class="team-tree reveal"><div class="member team-lead">{lead}</div>'
            '<ul class="team-row">' + "".join(f'<li class="member">{m}</li>' for m in rest) + "</ul></div>")


def ceo_media(video):
    """{{ceo_media:VIDEO|Label}}: the CEO photo with a video player below it.
    VIDEO is a file path without extension (images/about/ceo-6-years) or a YouTube link."""
    photo = find_file("images/about/ceo-photo", IMG_EXT) or "images/ceo-portrait.jpg"
    img = f'<img class="cm-photo" src="{html.escape(photo)}" alt="Dr. Debtanu Barman, Founder and CEO" loading="lazy">'
    return f'<div class="ceo-media"><div class="img-frame">{img}</div>{video_slot(video)}</div>'


def brochure_block():
    pdf = find_file("images/media/ads-brochure", (".pdf",))
    cover = find_file("images/media/ads-brochure-cover", IMG_EXT)
    if cover:
        cov = f'<img src="{html.escape(cover)}" alt="Cover of the Aqua Doctor Solutions brochure" loading="lazy">'
    else:
        cov = ('<div class="bro-cover-ph"><img src="images/ads-logo.jpg" alt="" loading="lazy">'
               '<b>Aqua Doctor Solutions</b><span>Company brochure</span></div>')
    if pdf:
        btn = (f'<a class="btn btn-primary" href="{html.escape(pdf)}" download>'
               '<svg><use href="#i-download"/></svg>Download Brochure (PDF)</a>')
        note = ""
    else:
        btn = ('<span class="btn btn-primary is-disabled" aria-disabled="true">'
               '<svg><use href="#i-download"/></svg>Download Brochure (PDF)</span>')
        note = ('<p class="bro-note"><span class="flag">Client content required</span> Put the PDF at '
                '<code>images/media/ads-brochure.pdf</code> and the cover at <code>images/media/ads-brochure-cover.jpg</code>.</p>')
    return f'<div class="bro-cover">{cov}</div><div class="bro-copy">{{BRO_COPY}}<div class="btn-row">{btn}</div>{note}</div>'


def hero_slides():
    """Home slideshow: every photo/video in images/hero/, in file-name order."""
    files = media_files("images/hero")
    alts = json.loads(read("data/hero_alts.json"))
    n = len(files)
    slides, bars = [], []
    for i, f in enumerate(files):
        name = f.rsplit("/", 1)[-1]
        alt = alts.get(name, "Aqua Doctor Solutions at work")
        on = " is-on" if i == 0 else ""
        if f.lower().endswith(VID_EXT):
            poster = alts.get(name + ":poster", "")
            pa = f' poster="{html.escape(poster)}"' if poster else ""
            body = f'<video muted playsinline preload="none"{pa} data-src="{html.escape(f)}" aria-label="{html.escape(alt)}"></video>'
            extra = " data-video"
            bl = f"Slide {i + 1}, video"
        else:
            lz = "" if i == 0 else ' loading="lazy"'
            body = f'<img src="{html.escape(f)}" alt="{html.escape(alt)}"{lz}>'
            extra = ""
            bl = f"Slide {i + 1}"
        slides.append(f'<div class="hero-slide{on}" role="group" aria-roledescription="slide" aria-label="{i + 1} of {n}"{extra}>{body}</div>')
        bars.append(f'<button type="button" aria-label="{bl}"></button>')
    return "\n        ".join(slides), "".join(bars)


def large_media_warning():
    big = []
    for f in (ROOT / "images").rglob("*"):
        if f.is_file():
            mb = f.stat().st_size / 1048576
            limit = 15 if f.suffix.lower() in VID_EXT else (8 if f.suffix.lower() == ".pdf" else 1.5)
            if mb > limit:
                big.append(f"  {f.relative_to(ROOT)}  ({mb:.1f} MB)")
    if big:
        print("\nWARNING: these files are large and will slow the site down:")
        print("\n".join(big))
        print("Run  python tools/optimize_images.py  for photos; compress videos to under 15 MB.\n")


def build():
    head = read("partials/head.html")
    header = read("partials/header.html")
    cta = read("partials/cta.html")
    footer = read("partials/footer.html")
    for page in sorted((SRC / "pages").glob("*.html")):
        meta, body = parse_page(page.read_text(encoding="utf-8"))
        nav = meta.get("nav", "")
        h = header
        # mark the current page in the main navigation
        h = h.replace(f'data-nav="{nav}"', f'data-nav="{nav}" aria-current="page"')
        if meta.get("parent"):
            h = h.replace(f'data-nav="{meta["parent"]}"', f'data-nav="{meta["parent"]}" data-current-parent')
        body = body.replace("{{awards_register}}", awards_blocks()).replace("{{awards_years}}", year_nav())
        body = re.sub(r"\{\{slideshow:(.*?)\}\}", lambda m: slideshow(m.group(1)), body)
        body = re.sub(r"\{\{video:(.*?)\}\}", lambda m: video_slot(m.group(1)), body)
        if "{{team}}" in body:
            body = body.replace("{{team}}", team_grid())
        body = re.sub(r"\{\{ceo_media:(.*?)\}\}", lambda m: ceo_media(m.group(1)), body)
        if "{{brochure}}" in body:
            bm = re.search(r"\{\{brochure\}\}(.*?)\{\{/brochure\}\}", body, re.S)
            body = body[:bm.start()] + brochure_block().replace("{BRO_COPY}", bm.group(1).strip()) + body[bm.end():]
        if "{{hero_slides}}" in body:
            sl, bars = hero_slides()
            body = body.replace("{{hero_slides}}", sl).replace("{{hero_bars}}", bars)
        doc = (
            head.replace("{{title}}", html.escape(meta.get("title", "Aqua Doctor Solutions")))
            .replace("{{description}}", html.escape(meta.get("description", "")))
            .replace("{{page}}", nav or page.stem)
            + h
            + '<main id="main">\n' + body + "</main>\n"
            + (cta if meta.get("cta", "yes") != "no" else "")
            + footer
        )
        (ROOT / page.name).write_text(doc, encoding="utf-8")
        print("built", page.name)
    large_media_warning()


if __name__ == "__main__":
    build()

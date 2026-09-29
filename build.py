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


if __name__ == "__main__":
    build()

"""Shrink large photos so the website stays fast.

Run:  python tools/optimize_images.py
Needs Pillow:  pip install pillow

Every .jpg/.jpeg/.png/.webp under images/ that is wider or taller than 1800 px,
or bigger than 600 KB, is resized to fit 1800 px and saved again at good quality.
The file name stays the same, so nothing in the website needs to change.
Videos and PDFs are not touched.
"""
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    raise SystemExit("Pillow is not installed. Run:  pip install pillow")

ROOT = Path(__file__).resolve().parent.parent / "images"
MAX_SIDE = 1800
MAX_BYTES = 600 * 1024

changed = 0
for f in sorted(ROOT.rglob("*")):
    if f.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp") or not f.is_file():
        continue
    before = f.stat().st_size
    try:
        im = Image.open(f)
        im = ImageOps.exif_transpose(im)  # phone photos: keep them the right way up
    except Exception as e:
        print("skip", f.relative_to(ROOT.parent), e)
        continue
    if max(im.size) <= MAX_SIDE and before <= MAX_BYTES:
        continue
    im.thumbnail((MAX_SIDE, MAX_SIDE))
    fmt = {".jpg": "JPEG", ".jpeg": "JPEG", ".png": "PNG", ".webp": "WEBP"}[f.suffix.lower()]
    if fmt == "JPEG":
        im.convert("RGB").save(f, "JPEG", quality=82, optimize=True, progressive=True)
    elif fmt == "WEBP":
        im.save(f, "WEBP", quality=82)
    else:
        im.save(f, "PNG", optimize=True)
    changed += 1
    print(f"{f.relative_to(ROOT.parent)}: {before // 1024} KB -> {f.stat().st_size // 1024} KB")
print(f"Done. {changed} photo(s) optimised.")

/* Aqua Doctor Solutions — product catalogue
   To add a product: copy one line, change the fields, and put the photo in images/.
   Categories follow the client's content brief. Product names and photos come from
   the "Our Products and Services" page of the 2025 annual report. Pack sizes, prices
   and key features have not been supplied yet.
   Optional fields per product (shown in the detail view when filled in):
     uses: ["Use or benefit 1", "Use or benefit 2"],
     pack: "1 kg, 5 kg, 25 kg"
   Categories with no products are hidden automatically. */
window.ADS_CATEGORIES = [
  { id: "seed",      label: "Fish seed" },
  { id: "feed",      label: "Fish feed" },
  { id: "health",    label: "Medicines and health products" },
  { id: "testing",   label: "Water testing kits" },
  { id: "treatment", label: "Water treatment products" },
  { id: "aerators",  label: "Aerators and equipment" },
  { id: "pond",      label: "Pond management and Biofloc" },
  { id: "other",     label: "Other aquaculture products" }
];

window.ADS_PRODUCTS = [
  { cat: "seed",     name: "Fish spawn and fry",            img: "images/pr-seed.webp",       desc: "Live fish seed for nursery stocking." },
  { cat: "seed",     name: "Fingerlings",                   img: "images/pr-fingerling.webp", desc: "Fingerlings for stocking grow-out ponds." },
  { cat: "feed",     name: "Floating pellet feed",          img: "images/pr-floating.webp",   desc: "Floating pellet fish feed." },
  { cat: "feed",     name: "Sinking pellet feed",           img: "images/pr-sinking.webp",    desc: "Sinking pellet fish feed." },
  { cat: "feed",     name: "Powder feed",                   img: "images/pr-powder.webp",     desc: "Fine powder feed for early-stage fish." },
  { cat: "health",   name: "Ovafish hormone injection",     img: "images/pr-ovafish.webp",    desc: "Salmon gonadotropin releasing hormone analogue, labelled for induced breeding of fish." },
  { cat: "health",   name: "Fish medicines and health products", img: "images/pr-meds.webp", desc: "A range of fish medicines and health products." },
  { cat: "testing",  name: "Dissolved oxygen test kit",     img: "images/pr-do.webp",         desc: "Test kit for dissolved oxygen in pond water." },
  { cat: "testing",  name: "pH test kit",                   img: "images/pr-ph.webp",         desc: "Test kit for the pH of pond water." },
  { cat: "testing",  name: "Nitrite test kit",              img: "images/pr-no2.webp",        desc: "Test kit for nitrite in pond water." },
  { cat: "testing",  name: "General hardness test kit",     img: "images/pr-gh.webp",         desc: "Test kit for water hardness." },
  { cat: "aerators", name: "Solar paddlewheel aerator",     img: "images/pr-solaraer.webp",   desc: "Paddlewheel aerator powered by solar panels." },
  { cat: "aerators", name: "Floating fish feeder",          img: "images/pr-feeder.webp",     desc: "Feeder mounted on floats, for use on the pond." },
  { cat: "aerators", name: "Water pump",                    img: "images/pr-pump.webp",       desc: "Electric water pump." },
  { cat: "aerators", name: "Fish feed pellet machine",      img: "images/pr-pellet.webp",     desc: "Machine for making fish feed pellets." },
  { cat: "pond",     name: "Biofloc tank",                  img: "images/pr-bftank.webp",     desc: "Circular framed tank with lining, for Biofloc culture." },
  { cat: "pond",     name: "Air stones",                    img: "images/pr-airstone.webp",   desc: "Air diffuser stones for tank aeration." },
  { cat: "pond",     name: "Wire mesh",                     img: "images/pr-mesh.webp",       desc: "Welded wire mesh roll." },
  { cat: "pond",     name: "Pond liner sheet",              img: "images/pr-liner.webp",      desc: "Liner sheet for ponds and tanks." }
];

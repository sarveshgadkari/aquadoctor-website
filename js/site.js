/* Aqua Doctor Solutions — site behaviour (design approval build) */
(function () {
  "use strict";
  var WA_NUMBER = "919875402885"; // confirm the WhatsApp number with ADS
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- header shadow ---------- */
  var header = $("[data-header]");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- mobile navigation drawer ---------- */
  var nav = $("#site-nav"), openBtn = $("[data-nav-open]"), scrim = $(".nav-scrim");
  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add("show"); }); nav.querySelector("a").focus(); }
    else { scrim.classList.remove("show"); setTimeout(function () { if (!nav.classList.contains("is-open")) scrim.hidden = true; }, 260); }
  }
  if (openBtn) openBtn.addEventListener("click", function () { setNav(true); });
  $$("[data-nav-close]").forEach(function (b) { b.addEventListener("click", function () { setNav(false); openBtn.focus(); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav && nav.classList.contains("is-open")) { setNav(false); openBtn.focus(); } });
  if (nav) nav.addEventListener("click", function (e) { if (e.target.closest("a") && nav.classList.contains("is-open")) setNav(false); });

  /* ---------- WhatsApp links ---------- */
  document.addEventListener("click", function (e) {
    var w = e.target.closest("[data-wa]");
    if (w) { e.preventDefault(); window.open("https://wa.me/" + WA_NUMBER, "_blank", "noopener"); }
  });

  /* ---------- reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (r) { ro.observe(r); });
  } else { reveals.forEach(function (r) { r.classList.add("in"); }); }

  /* ---------- home hero slideshow ---------- */
  var hero = $("[data-hero]");
  if (hero) {
    var slides = $$(".hero-slide", hero), bars = $$(".hero-progress button", hero);
    var tTitle = $("[data-hero-title]", hero), tText = $("[data-hero-text]", hero), tCount = $("[data-hero-count]", hero);
    var idx = 0, timer = null, MS = 7000;
    hero.style.setProperty("--slide-ms", MS + "ms");
    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-on", i === idx); s.setAttribute("aria-hidden", i === idx ? "false" : "true"); });
      bars.forEach(function (b, i) {
        b.classList.remove("is-on"); b.classList.toggle("is-done", i < idx);
        b.setAttribute("aria-current", i === idx ? "true" : "false");
      });
      void hero.offsetWidth; // restart progress animation
      if (bars[idx]) bars[idx].classList.add("is-on");
      var s = slides[idx];
      tTitle.textContent = s.dataset.title; tText.textContent = s.dataset.text;
      tCount.innerHTML = "<b>" + String(idx + 1).padStart(2, "0") + "</b> / " + String(slides.length).padStart(2, "0");
    }
    function play() { stop(); if (reduce) return; timer = setInterval(function () { go(idx + 1); }, MS); hero.classList.remove("is-paused"); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } hero.classList.add("is-paused"); }
    $("[data-hero-prev]", hero).addEventListener("click", function () { go(idx - 1); play(); });
    $("[data-hero-next]", hero).addEventListener("click", function () { go(idx + 1); play(); });
    bars.forEach(function (b, i) { b.addEventListener("click", function () { go(i); play(); }); });
    var media = $(".hero-media", hero);
    media.addEventListener("mouseenter", stop); media.addEventListener("mouseleave", play);
    media.addEventListener("focusin", stop); media.addEventListener("focusout", play);
    go(0); play();
  }

  /* ---------- home hero: rising bubbles ---------- */
  var bubbleBox = $(".hero-bubbles");
  if (bubbleBox && !reduce) {
    var heroEl = bubbleBox.parentNode;
    var count = window.innerWidth < 640 ? 14 : 30;
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    for (var bi = 0; bi < count; bi++) {
      var bub = document.createElement("span");
      // mostly small bubbles, a few medium, the odd large one, as in real water
      var r = Math.random();
      var size = r < 0.4 ? rnd(3, 6) : r < 0.85 ? rnd(8, 16) : rnd(18, 30);
      bub.className = size < 7 ? "bubble is-tiny" : "bubble";
      bub.style.setProperty("--x", rnd(2, 98).toFixed(1) + "%");
      bub.style.setProperty("--s", size.toFixed(1) + "px");
      // bigger bubbles rise a little faster
      bub.style.setProperty("--d", (size > 16 ? rnd(9, 14) : rnd(12, 22)).toFixed(1) + "s");
      bub.style.setProperty("--delay", (-rnd(0, 22)).toFixed(1) + "s");
      bub.style.setProperty("--sway", rnd(-22, 22).toFixed(0) + "px");
      bub.style.setProperty("--sway-d", rnd(2, 4.5).toFixed(1) + "s");
      bub.style.setProperty("--o", rnd(.7, 1).toFixed(2));
      bubbleBox.appendChild(bub);
    }
    var setRise = function () { bubbleBox.style.setProperty("--rise", -(heroEl.offsetHeight + 60) + "px"); };
    setRise(); window.addEventListener("resize", setRise);
  }

  /* ---------- lightbox (awards, gallery, press) ---------- */
  var lb = $("#lightbox");
  if (lb) {
    var lbImg = $("img", lb), lbCap = $(".lb-cap", lb), lbCount = $(".lb-count", lb), lbClose = $("[data-lb-close]", lb);
    var set = [], pos = 0, opener = null;
    function show(i) {
      pos = (i + set.length) % set.length;
      lbImg.src = set[pos].src; lbImg.alt = set[pos].alt || "";
      lbCap.textContent = set[pos].cap || "";
      lbCount.textContent = set.length > 1 ? (pos + 1) + " / " + set.length : "";
      $("[data-lb-prev]", lb).hidden = set.length < 2; $("[data-lb-next]", lb).hidden = set.length < 2;
    }
    function open(items, start, from) {
      set = items; opener = from; lb.hidden = false; document.body.style.overflow = "hidden";
      show(start || 0); requestAnimationFrame(function () { lb.classList.add("is-open"); }); lbClose.focus();
    }
    function close() {
      lb.classList.remove("is-open"); document.body.style.overflow = "";
      setTimeout(function () { lb.hidden = true; }, 200); if (opener) opener.focus();
    }
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-lightbox]");
      if (!t) return;
      e.preventDefault();
      var group = t.getAttribute("data-group");
      if (group) {
        var members = $$('[data-group="' + group + '"]').filter(function (m) { return !m.closest("[hidden]"); });
        var items = members.map(function (m) { var im = $("img", m); return { src: m.getAttribute("data-lightbox"), alt: im ? im.alt : "", cap: m.getAttribute("data-caption") }; });
        open(items, members.indexOf(t), t);
      } else {
        var srcs = t.getAttribute("data-lightbox").split("|"), im0 = $("img", t);
        open(srcs.map(function (s) { return { src: s, alt: im0 ? im0.alt : "", cap: t.getAttribute("data-caption") }; }), 0, t);
      }
    });
    $("[data-lb-prev]", lb).addEventListener("click", function () { show(pos - 1); });
    $("[data-lb-next]", lb).addEventListener("click", function () { show(pos + 1); });
    lbClose.addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-stage")) close(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && set.length > 1) show(pos + 1);
      if (e.key === "ArrowLeft" && set.length > 1) show(pos - 1);
    });
  }

  /* ---------- scroll-spy for side / sub navigation ---------- */
  $$("[data-spy]").forEach(function (navEl) {
    var links = $$("a[href^='#']", navEl);
    if (!("IntersectionObserver" in window) || !links.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) {
            var on = l.getAttribute("href") === "#" + en.target.id;
            l.classList.toggle("is-current", on);
            if (on && navEl.scrollWidth > navEl.clientWidth) { var ol = l.closest("ol,ul"); if (ol) ol.scrollTo({ left: l.offsetLeft - 20, behavior: reduce ? "auto" : "smooth" }); }
          });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    links.forEach(function (l) { var t = document.getElementById(l.getAttribute("href").slice(1)); if (t) io.observe(t); });
  });

  /* ---------- awards: filter by type ---------- */
  var awFilter = $("[data-aw-filter]");
  if (awFilter) {
    var awBtns = $$("button", awFilter);
    awBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.dataset.kind;
        awBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        $$(".aw").forEach(function (a) { a.hidden = !(k === "all" || a.dataset.kind === k); });
        $$(".aw-year").forEach(function (y) {
          var vis = $$(".aw", y).filter(function (a) { return !a.hidden; }).length;
          y.hidden = vis === 0;
          var c = $(".aw-count", y); c.textContent = vis + (vis === 1 ? " entry" : " entries");
          var railLink = $('.aw-rail a[href="#' + y.id + '"]'); if (railLink) railLink.parentNode.hidden = vis === 0;
        });
      });
    });
  }

  /* ---------- media: gallery filter + tabs ---------- */
  var gFilter = $("[data-g-filter]");
  if (gFilter) {
    var gBtns = $$("button", gFilter);
    gBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        gBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        $$(".g-item").forEach(function (g) { g.hidden = !(b.dataset.f === "all" || g.dataset.c === b.dataset.f); });
      });
    });
  }
  var tabs = $$('[role="tab"]');
  function selTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t; x.setAttribute("aria-selected", on ? "true" : "false"); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) t.focus();
  }
  if (location.hash && tabs.length) { tabs.forEach(function (t) { if ("#" + t.getAttribute("aria-controls") === location.hash) selTab(t); }); }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selTab(t); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); selTab(tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length], true); }
    });
  });

  /* ---------- products catalogue ---------- */
  var pgrid = $("#product-grid");
  if (pgrid && window.ADS_PRODUCTS) {
    var P = window.ADS_PRODUCTS, cats = window.ADS_CATEGORIES, cur = "all", q = $("#product-search"), chipBox = $("#product-chips");
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    var params = new URLSearchParams(location.search); if (params.get("cat")) cur = params.get("cat");
    function chips() {
      var html = '<button class="chip" type="button" data-cat="all" aria-pressed="' + (cur === "all") + '">All products<span class="n">' + P.length + "</span></button>";
      cats.forEach(function (c) {
        var n = P.filter(function (p) { return p.cat === c.id; }).length;
        html += '<button class="chip" type="button" data-cat="' + c.id + '" aria-pressed="' + (cur === c.id) + '">' + esc(c.label) + '<span class="n">' + n + "</span></button>";
      });
      chipBox.innerHTML = html;
    }
    function catLabel(id) { var c = cats.filter(function (x) { return x.id === id; })[0]; return c ? c.label : id; }
    function render() {
      var term = (q.value || "").trim().toLowerCase();
      var list = P.filter(function (p) {
        return (cur === "all" || p.cat === cur) && (!term || (p.name + " " + p.desc + " " + p.cat).toLowerCase().indexOf(term) > -1);
      });
      var cnt = $("#product-count"); if (cnt) cnt.textContent = list.length + (list.length === 1 ? " product" : " products") + (cur === "all" ? "" : " in " + catLabel(cur));
      if (!list.length) {
        var pending = cur !== "all" && !term;
        pgrid.innerHTML = '<div class="prod-empty">' + (pending ? '<span class="flag">Client content required</span><h3>' + esc(catLabel(cur)) + '</h3><p class="muted" style="margin:8px auto 20px;max-width:46ch">Products for this category have not been supplied yet. ADS to share product names, photos, pack sizes and MRP.</p>' : '<h3>No products match “' + esc(term) + '”</h3><p class="muted" style="margin:8px auto 20px">Try another word, or ask us. We may stock it.</p>') + '<a class="btn btn-primary" href="join.html?type=Product%20enquiry#enquiry">Ask about a product</a></div>';
        return;
      }
      pgrid.innerHTML = list.map(function (p) {
        return '<article class="prod"><div class="prod-pic"><span class="mono">' + esc(catLabel(p.cat)) + '</span><img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
          '<div class="prod-body"><h3>' + esc(p.name) + "</h3><p>" + esc(p.desc) + "</p>" +
          '<dl class="prod-spec"><div><dt>Pack size</dt><dd>To be supplied</dd></div><div><dt>Price / MRP</dt><dd>To be supplied</dd></div></dl>' +
          '<a class="prod-enq" href="join.html?type=Product%20enquiry&amp;product=' + encodeURIComponent(p.name) + '#enquiry">Enquire now<svg><use href="#i-arrow"/></svg></a></div></article>';
      }).join("");
    }
    chipBox.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      cur = b.dataset.cat; $$(".chip", chipBox).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); render();
    });
    q.addEventListener("input", render);
    chips(); render();
  }

  /* ---------- join: enquiry type options ---------- */
  var typeSel = $("#e-type");
  if (typeSel) {
    var opts = $$("[data-type]");
    function setType(t) { typeSel.value = t; opts.forEach(function (o) { o.setAttribute("aria-pressed", o.dataset.type === t ? "true" : "false"); }); }
    opts.forEach(function (o) { o.addEventListener("click", function () { setType(o.dataset.type); $("#enquiry").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); setTimeout(function () { $("#e-name").focus({ preventScroll: true }); }, reduce ? 0 : 450); }); });
    typeSel.addEventListener("change", function () { setType(typeSel.value); });
    var sp = new URLSearchParams(location.search);
    if (sp.get("type")) setType(sp.get("type"));
    if (sp.get("product")) $("#e-msg").value = "I would like to know more about: " + sp.get("product");
  }
  var posField = $("#c-pos");
  if (posField) { var cp = new URLSearchParams(location.search); if (cp.get("position")) posField.value = cp.get("position"); }
  $$(".file-drop input").forEach(function (inp) {
    inp.addEventListener("change", function () { var b = inp.closest(".file-drop").querySelector("b"); if (inp.files.length) b.textContent = inp.files[0].name; });
  });

  /* ---------- forms (visual only — no backend in the approval build) ---------- */
  $$("form[data-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true, first = null;
      $$("[required]", f).forEach(function (inp) {
        var v = inp.type === "file" ? inp.files.length : inp.value.trim();
        var bad = !v || (inp.type === "tel" && inp.value.replace(/\D/g, "").length < 10);
        inp.closest(".field").classList.toggle("is-bad", !!bad);
        inp.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad && !first) first = inp;
        if (bad) ok = false;
      });
      var msg = $(".sent", f);
      if (!ok) { msg.classList.remove("show"); first.focus(); return; }
      var name = ($('[name="name"]', f).value.trim().split(" ")[0]) || "";
      msg.textContent = f.dataset.form === "cv"
        ? "Thank you, " + name + ". Your application has been received. (Design preview: the form is not connected yet.)"
        : "Thank you, " + name + ". Your enquiry has been received and our team will call you back. (Design preview: the form is not connected yet.)";
      msg.classList.add("show"); f.reset();
      if (typeSel && f.dataset.form === "enquiry") $$("[data-type]").forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
    });
  });
})();

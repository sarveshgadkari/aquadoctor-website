/* Aqua Doctor Solutions — site behaviour (design approval build) */
(function () {
  "use strict";
  var WA_NUMBER = "919875402885"; // confirm the WhatsApp number with ADS
  var MATSYA_APP_URL = "";          // CLIENT TO SUPPLY: APK file path, Play Store or App Store link
  var HERO_VIDEO_SRC = "images/hero/aerator.mp4"; // CLIENT TO SUPPLY: aerator video file
  var VISITOR_API = "/api/visits";  // visitor counter endpoint (Vercel function api/visits.js)
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

  /* ---------- Matsya Sathi app links (header logo + home page store button) ---------- */
  $$("[data-matsya-app]").forEach(function (a) {
    if (MATSYA_APP_URL) {
      a.href = MATSYA_APP_URL;
      if (/\.apk([?#].*)?$/i.test(MATSYA_APP_URL)) { a.setAttribute("download", ""); a.removeAttribute("target"); }
      else { a.target = "_blank"; a.rel = "noopener"; }
    } else if (document.getElementById("matsya-sathi")) {
      a.href = "#matsya-sathi"; // no link yet: on the home page, scroll to the app section
    }
  });
  $$("[data-matsya-pending]").forEach(function (el) { el.hidden = !!MATSYA_APP_URL; });

  /* small helper: horizontal swipe on touch devices */
  function onSwipe(el, left, right, start, end) {
    var x0 = null, y0 = null;
    el.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; if (start) start(); }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) left(); else right(); }
      if (end) end();
    }, { passive: true });
  }
  /* small helper: left / right arrow keys while focus is inside an element */
  function onArrows(el, prev, next) {
    el.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    });
  }

  /* ---------- home hero: full-width slideshow (5 photos + aerator video) ---------- */
  var hero = $("[data-hero]");
  if (hero) {
    var slides = $$(".hero-slide", hero), bars = $$(".hero-progress button", hero);
    var idx = 0, tm = null, MS = 6000, remaining = MS, startedAt = 0, paused = false;
    var vSlide = $("[data-video]", hero), video = vSlide ? $("video", vSlide) : null;
    var videoOk = !!(video && HERO_VIDEO_SRC), vPlaying = false;
    if (reduce) hero.classList.add("is-static");
    // watchdog: if the video has not started within one slide's time (missing file, slow or blocked load),
    // treat it as a photo slide and move on, so the slideshow never gets stuck
    function armWatchdog(ms) {
      clearTimeout(tm); remaining = ms; startedAt = Date.now();
      if (!paused) tm = setTimeout(function () { if (!vPlaying) { videoOk = false; go(idx + 1); } }, ms);
    }
    function videoActive() { return videoOk && !reduce && slides[idx] === vSlide; }
    function schedule(ms) {
      clearTimeout(tm); remaining = ms; startedAt = Date.now();
      if (!paused && !reduce) tm = setTimeout(function () { go(idx + 1); }, ms);
    }
    function restartBar(ms) {
      var b = bars[idx]; if (!b) return;
      hero.style.setProperty("--slide-ms", ms + "ms");
      b.classList.remove("is-on"); void b.offsetWidth; b.classList.add("is-on");
    }
    function videoFailed() { videoOk = false; if (slides[idx] === vSlide) { restartBar(MS); schedule(MS); } }
    if (video) {
      // a missing or broken file simply leaves the poster image showing, like a photo slide
      video.addEventListener("error", videoFailed);
      video.addEventListener("ended", function () { if (slides[idx] === vSlide) go(idx + 1); });
      video.addEventListener("playing", function () { vPlaying = true; if (slides[idx] === vSlide) clearTimeout(tm); });
      video.addEventListener("loadedmetadata", function () { if (videoActive() && isFinite(video.duration)) restartBar(video.duration * 1000); });
    }
    function go(n) {
      if (video && slides[idx] === vSlide) video.pause();
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-on", i === idx); s.setAttribute("aria-hidden", i === idx ? "false" : "true"); });
      bars.forEach(function (b, i) {
        b.classList.remove("is-on"); b.classList.toggle("is-done", i < idx);
        b.setAttribute("aria-current", i === idx ? "true" : "false");
      });
      restartBar(MS);
      clearTimeout(tm);
      if (reduce) return; // no autoplay and no video playback with reduced motion
      if (videoActive()) {
        vPlaying = false;
        if (!video.getAttribute("src")) video.src = HERO_VIDEO_SRC; // loads only when its slide is shown
        try { video.currentTime = 0; } catch (err) {}
        if (!paused) { var p = video.play(); if (p && p.catch) p.catch(videoFailed); }
        armWatchdog(MS);
      } else {
        schedule(MS);
      }
    }
    function pause() {
      if (paused) return;
      paused = true; hero.classList.add("is-paused");
      clearTimeout(tm); remaining = Math.max(remaining - (Date.now() - startedAt), 0);
      if (videoActive()) video.pause();
    }
    function resume() {
      if (!paused) return;
      paused = false; hero.classList.remove("is-paused");
      if (reduce) return;
      if (videoActive()) {
        var p = video.play(); if (p && p.catch) p.catch(videoFailed);
        if (!vPlaying) armWatchdog(Math.max(remaining, 500));
      } else schedule(Math.max(remaining, 500));
    }
    $("[data-hero-prev]", hero).addEventListener("click", function () { go(idx - 1); });
    $("[data-hero-next]", hero).addEventListener("click", function () { go(idx + 1); });
    bars.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
    // pause while the pointer is over the slideshow card or focus is in its controls; swipe on the card
    var heroMedia = $(".hero-media", hero) || hero;
    heroMedia.addEventListener("mouseenter", pause);
    heroMedia.addEventListener("mouseleave", resume);
    heroMedia.addEventListener("focusin", pause);
    heroMedia.addEventListener("focusout", function (e) { if (!heroMedia.contains(e.relatedTarget)) resume(); });
    onSwipe(heroMedia, function () { go(idx + 1); }, function () { go(idx - 1); }, pause, resume);
    onArrows($(".hero-controls", hero), function () { go(idx - 1); }, function () { go(idx + 1); });
    go(0);
  }

  /* ---------- key numbers: count up once when scrolled into view ---------- */
  var factsBox = $(".facts-section");
  if (factsBox && !reduce && "IntersectionObserver" in window) {
    var counters = $$("[data-count]", factsBox);
    var countIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      countIO.disconnect();
      counters.forEach(function (el) {
        var target = Number(el.dataset.count), suffix = el.dataset.suffix || "", finalText = el.textContent;
        // screen readers get the final figure; the animated digits are hidden from them
        var shown = document.createElement("span"), sr = document.createElement("span");
        shown.setAttribute("aria-hidden", "true"); sr.className = "sr"; sr.textContent = finalText;
        el.textContent = ""; el.appendChild(shown); el.appendChild(sr);
        var t0 = null, DUR = 1600;
        function step(t) {
          if (t0 === null) t0 = t;
          var k = Math.min(1, (t - t0) / DUR), eased = 1 - Math.pow(1 - k, 3);
          shown.textContent = k < 1 ? Math.round(target * eased).toLocaleString("en-IN") + suffix : finalText;
          if (k < 1) requestAnimationFrame(step);
        }
        shown.textContent = "0" + suffix;
        requestAnimationFrame(step);
      });
    }, { threshold: 0.35 });
    countIO.observe(factsBox);
  }

  /* ---------- company recognition slider (no auto-advance) ---------- */
  var rec = $("[data-rec]");
  if (rec) {
    var rTexts = $$(".rec-text", rec), rPhotos = $$(".rec-photo", rec), rCount = $("[data-rec-count]", rec), ri = 0;
    function recGo(n) {
      ri = (n + rTexts.length) % rTexts.length;
      rTexts.forEach(function (t, i) { t.hidden = i !== ri; t.classList.toggle("is-on", i === ri); });
      rPhotos.forEach(function (p, i) { p.hidden = i !== ri; p.classList.toggle("is-on", i === ri); });
      rCount.textContent = (ri + 1) + " / " + rTexts.length;
    }
    $("[data-rec-prev]", rec).addEventListener("click", function () { recGo(ri - 1); });
    $("[data-rec-next]", rec).addEventListener("click", function () { recGo(ri + 1); });
    onArrows(rec, function () { recGo(ri - 1); }, function () { recGo(ri + 1); });
    onSwipe($(".rec-photos", rec), function () { recGo(ri + 1); }, function () { recGo(ri - 1); });
  }

  /* ---------- supported by: looping logo carousel ---------- */
  var lc = $("[data-logo-carousel]");
  if (lc) {
    var track = $(".lc-track", lc), busy = false, lcTimer = null;
    var EASE = "transform .6s cubic-bezier(.2,.7,.2,1)";
    function stepPx() { return track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width : 0; }
    function settle(cb) {
      var done = false;
      function fin() { if (done) return; done = true; track.removeEventListener("transitionend", fin); cb(); }
      track.addEventListener("transitionend", fin);
      setTimeout(fin, 800); // in case transitionend does not fire (background tab)
    }
    function lcNext() {
      if (busy) return;
      if (reduce) { track.appendChild(track.firstElementChild); return; }
      busy = true;
      track.style.transition = EASE;
      track.style.transform = "translateX(" + (-stepPx()) + "px)";
      settle(function () {
        track.style.transition = "none";
        track.appendChild(track.firstElementChild); // the first logo moves to the end: an endless loop
        track.style.transform = "translateX(0)";
        busy = false;
      });
    }
    function lcPrev() {
      if (busy) return;
      if (reduce) { track.insertBefore(track.lastElementChild, track.firstElementChild); return; }
      busy = true;
      track.style.transition = "none";
      track.insertBefore(track.lastElementChild, track.firstElementChild);
      track.style.transform = "translateX(" + (-stepPx()) + "px)";
      void track.offsetWidth;
      track.style.transition = EASE;
      track.style.transform = "translateX(0)";
      settle(function () { busy = false; });
    }
    function lcStop() { if (lcTimer) { clearInterval(lcTimer); lcTimer = null; } }
    function lcPlay() { lcStop(); if (!reduce) lcTimer = setInterval(lcNext, 3000); }
    $("[data-lc-next]", lc).addEventListener("click", function () { lcNext(); });
    $("[data-lc-prev]", lc).addEventListener("click", function () { lcPrev(); });
    lc.addEventListener("mouseenter", lcStop);
    lc.addEventListener("mouseleave", function () { if (!lc.contains(document.activeElement)) lcPlay(); });
    lc.addEventListener("focusin", lcStop);
    lc.addEventListener("focusout", function (e) { if (!lc.contains(e.relatedTarget)) lcPlay(); });
    onArrows(lc, lcPrev, lcNext);
    onSwipe($(".lc-viewport", lc), lcNext, lcPrev, lcStop, lcPlay);
    document.addEventListener("visibilitychange", function () { if (document.hidden) lcStop(); else lcPlay(); });
    lcPlay();
  }

  /* ---------- footer: visitor counter ---------- */
  var visitsEl = $("[data-visits]");
  if (visitsEl && VISITOR_API && /^https?:$/.test(location.protocol) && window.fetch) {
    var counted = false;
    try { counted = sessionStorage.getItem("ads-visit-counted") === "1"; } catch (err) {}
    // the first page view of a browser session counts the visit; later pages only read the total
    fetch(VISITOR_API, { method: counted ? "GET" : "POST", headers: { Accept: "application/json" }, cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("visits " + r.status); return r.json(); })
      .then(function (d) {
        var n = Number(d && d.total);
        if (!(n > 0)) return; // stay hidden: never show "0"
        if (!counted) { try { sessionStorage.setItem("ads-visit-counted", "1"); } catch (err) {} }
        $("[data-visits-count]", visitsEl).textContent = n.toLocaleString("en-IN");
        visitsEl.hidden = false;
      })
      .catch(function () { /* API missing or failing: the line stays hidden */ });
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

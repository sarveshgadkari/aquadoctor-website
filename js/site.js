/* Aqua Doctor Solutions — site behaviour (design approval build) */
(function () {
  "use strict";
  var WA_NUMBER = "919875402885"; // confirm the WhatsApp number with ADS
  var MATSYA_APP_URL = "";          // CLIENT TO SUPPLY: APK file path, Play Store or App Store link
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

  /* ---------- home hero slideshow: photos + any number of videos (slides built from images/hero/ by build.py) ---------- */
  var hero = $("[data-hero]");
  if (hero) {
    var slides = $$(".hero-slide", hero), bars = $$(".hero-progress button", hero);
    var idx = 0, tm = null, MS = 6000, remaining = MS, startedAt = 0, paused = false;
    if (reduce) hero.classList.add("is-static");
    function vidOf(i) { var sl = slides[i]; return sl && sl.hasAttribute("data-video") ? $("video", sl) : null; }
    function curVid() { var v = vidOf(idx); return v && !v.dataset.failed && !reduce ? v : null; }
    function restartBar(ms) {
      var b = bars[idx]; if (!b) return;
      hero.style.setProperty("--slide-ms", ms + "ms");
      b.classList.remove("is-on"); void b.offsetWidth; b.classList.add("is-on");
    }
    function schedule(ms) {
      clearTimeout(tm); remaining = ms; startedAt = Date.now();
      if (!paused && !reduce) tm = setTimeout(function () { go(idx + 1); }, ms);
    }
    function failed(v) { v.dataset.failed = "1"; if (vidOf(idx) === v) { restartBar(MS); schedule(MS); } }
    slides.forEach(function (sl, i) {
      var v = vidOf(i); if (!v) return;
      v.addEventListener("error", function () { failed(v); }, true);
      v.addEventListener("ended", function () { if (vidOf(idx) === v) go(idx + 1); });
      v.addEventListener("playing", function () { v.dataset.playing = "1"; if (vidOf(idx) === v) clearTimeout(tm); });
      v.addEventListener("loadedmetadata", function () { if (vidOf(idx) === v && isFinite(v.duration)) restartBar(v.duration * 1000); });
    });
    function go(n) {
      var old = vidOf(idx); if (old) old.pause();
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-on", i === idx); s.setAttribute("aria-hidden", i === idx ? "false" : "true"); });
      bars.forEach(function (b, i) { b.classList.remove("is-on"); b.classList.toggle("is-done", i < idx); b.setAttribute("aria-current", i === idx ? "true" : "false"); });
      restartBar(MS); clearTimeout(tm);
      if (reduce) return; // no autoplay and no video playback with reduced motion
      var v = curVid();
      if (v) {
        if (!v.getAttribute("src")) v.src = v.dataset.src; // a video loads only when its slide is shown
        try { v.currentTime = 0; } catch (err) {}
        v.dataset.playing = "";
        if (!paused) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () { failed(v); }); }
        // watchdog: if the video has not started in one slide's time, move on so the slideshow never gets stuck
        clearTimeout(tm); remaining = MS; startedAt = Date.now();
        if (!paused) tm = setTimeout(function () { if (!v.dataset.playing) { failed(v); } }, MS);
      } else schedule(MS);
    }
    function pause() {
      if (paused) return;
      paused = true; hero.classList.add("is-paused");
      clearTimeout(tm); remaining = Math.max(remaining - (Date.now() - startedAt), 0);
      var v = curVid(); if (v) v.pause();
    }
    function resume() {
      if (!paused) return;
      paused = false; hero.classList.remove("is-paused");
      if (reduce) return;
      var v = curVid();
      if (v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () { failed(v); }); if (!v.dataset.playing) schedule(Math.max(remaining, 500)); }
      else schedule(Math.max(remaining, 500));
    }
    if (slides.length > 1) {
      $("[data-hero-prev]", hero).addEventListener("click", function () { go(idx - 1); });
      $("[data-hero-next]", hero).addEventListener("click", function () { go(idx + 1); });
      bars.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
      var heroMedia = $(".hero-media", hero) || hero;
      heroMedia.addEventListener("mouseenter", pause);
      heroMedia.addEventListener("mouseleave", resume);
      heroMedia.addEventListener("focusin", pause);
      heroMedia.addEventListener("focusout", function (e) { if (!heroMedia.contains(e.relatedTarget)) resume(); });
      onSwipe(heroMedia, function () { go(idx + 1); }, function () { go(idx - 1); }, pause, resume);
      onArrows($(".hero-controls", hero), function () { go(idx - 1); }, function () { go(idx + 1); });
      go(0);
    } else { var hc = $(".hero-controls", hero); if (hc) hc.hidden = true; }
  }

  /* ---------- photo / video slideshows on inner pages (built by build.py from images/... folders) ---------- */
  $$("[data-gal]").forEach(function (g) {
    var gs = $$(".gal-slide", g), dots = $$(".gal-dots button", g), cnt = $(".gal-count", g), gi = 0, gt = null, gPaused = false;
    if (gs.length < 2) return;
    function gVid(i) { return gs[i].getAttribute("data-kind") === "video" ? $("video", gs[i]) : null; }
    function gGo(n, user) {
      var ov = gVid(gi); if (ov) ov.pause();
      gi = (n + gs.length) % gs.length;
      gs.forEach(function (s, i) { s.classList.toggle("is-on", i === gi); s.setAttribute("aria-hidden", i === gi ? "false" : "true"); });
      dots.forEach(function (d, i) { d.setAttribute("aria-current", i === gi ? "true" : "false"); });
      if (cnt) cnt.textContent = (gi + 1) + " / " + gs.length;
      var v = gVid(gi); if (v && !v.getAttribute("src")) v.src = v.getAttribute("data-src");
      gSchedule();
    }
    function gSchedule() {
      clearTimeout(gt);
      var v = gVid(gi);
      if (reduce || gPaused || v) return; // videos are played by the visitor; the slideshow waits on a video slide
      gt = setTimeout(function () { gGo(gi + 1); }, 5000);
    }
    $("[data-gal-prev]", g).addEventListener("click", function () { gGo(gi - 1, true); });
    $("[data-gal-next]", g).addEventListener("click", function () { gGo(gi + 1, true); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { gGo(i, true); }); });
    g.addEventListener("mouseenter", function () { gPaused = true; clearTimeout(gt); });
    g.addEventListener("mouseleave", function () { if (!g.contains(document.activeElement)) { gPaused = false; gSchedule(); } });
    g.addEventListener("focusin", function () { gPaused = true; clearTimeout(gt); });
    g.addEventListener("focusout", function (e) { if (!g.contains(e.relatedTarget)) { gPaused = false; gSchedule(); } });
    onSwipe($(".gal-stage", g), function () { gGo(gi + 1, true); }, function () { gGo(gi - 1, true); }, function () { gPaused = true; clearTimeout(gt); }, function () { gPaused = false; gSchedule(); });
    onArrows(g, function () { gGo(gi - 1, true); }, function () { gGo(gi + 1, true); });
    // start only when the slideshow is on screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) gSchedule(); else clearTimeout(gt); }); }, { threshold: .3 }).observe(g);
    } else gSchedule();
  });

  /* ---------- About: CEO photo for a few seconds, then the 6 years video in the same place ---------- */
  $$("[data-ceo-media]").forEach(function (cm) {
    var v = $("video", cm), tg = $("[data-cm-toggle]", cm), snd = $("[data-cm-sound]", cm), started = false, timer = null;
    function sync() {
      var playing = !v.paused && !v.ended;
      cm.classList.toggle("is-playing", playing);
      tg.setAttribute("aria-label", playing ? "Pause the 6 years video" : "Play the 6 years video");
    }
    function start() {
      if (started) return; started = true;
      cm.classList.add("show-video");
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () { sync(); });
    }
    tg.addEventListener("click", function () {
      clearTimeout(timer);
      if (!started) { start(); return; }
      if (v.paused || v.ended) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause();
    });
    snd.addEventListener("click", function () {
      v.muted = !v.muted; snd.setAttribute("aria-pressed", v.muted ? "false" : "true");
      snd.setAttribute("aria-label", v.muted ? "Turn sound on" : "Turn sound off");
      cm.classList.toggle("is-unmuted", !v.muted);
    });
    ["play", "pause", "ended"].forEach(function (ev) { v.addEventListener(ev, sync); });
    v.addEventListener("ended", function () { cm.classList.remove("show-video"); started = false; });
    if (reduce) return; // with reduced motion the photo stays; the visitor can press play
    var delay = parseInt(cm.getAttribute("data-delay"), 10) || 4000;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (e.isIntersecting && !started) { timer = setTimeout(start, delay); io.disconnect(); }
        });
      }, { threshold: .5 });
      io.observe(cm);
    } else timer = setTimeout(start, delay);
  });

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
  function tabFromHash() {
    if (!location.hash || !tabs.length) return;
    tabs.forEach(function (t) {
      if ("#" + t.getAttribute("aria-controls") === location.hash) {
        selTab(t);
        var tl = t.closest('[role="tablist"]'); if (tl) setTimeout(function () { tl.scrollIntoView({ block: "start" }); }, 0);
      }
    });
  }
  tabFromHash(); window.addEventListener("hashchange", tabFromHash);
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selTab(t); if (history.replaceState) history.replaceState(null, "", "#" + t.getAttribute("aria-controls")); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); selTab(tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length], true); }
    });
  });

  /* ---------- products catalogue (TradeIndia style: categories, search, cards, detail view) ---------- */
  var pgrid = $("#product-grid");
  if (pgrid && window.ADS_PRODUCTS) {
    var P = window.ADS_PRODUCTS.map(function (p, i) { p._i = i; return p; });
    var cats = window.ADS_CATEGORIES.filter(function (c) { return P.some(function (p) { return p.cat === c.id; }); }); // empty categories are hidden
    var cur = "all", q = $("#product-search"), catBox = $("#product-cats");
    var WA_PHONE = WA_NUMBER, CALL = "tel:+919875402885";
    function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function catLabel(id) { var c = window.ADS_CATEGORIES.filter(function (x) { return x.id === id; })[0]; return c ? c.label : id; }
    function waLink(text) { return "https://wa.me/" + WA_PHONE + "?text=" + encodeURIComponent(text); }
    var params = new URLSearchParams(location.search);
    if (params.get("cat") && cats.some(function (c) { return c.id === params.get("cat"); })) cur = params.get("cat");
    function renderCats() {
      var html = '<button class="cat-btn" type="button" data-cat="all" aria-pressed="' + (cur === "all") + '"><span>All products</span><span class="n">' + P.length + "</span></button>";
      cats.forEach(function (c) {
        var n = P.filter(function (p) { return p.cat === c.id; }).length;
        html += '<button class="cat-btn" type="button" data-cat="' + c.id + '" aria-pressed="' + (cur === c.id) + '"><span>' + esc(c.label) + '</span><span class="n">' + n + "</span></button>";
      });
      catBox.innerHTML = html;
    }
    function render() {
      var term = (q.value || "").trim().toLowerCase();
      var list = P.filter(function (p) { return (term ? true : (cur === "all" || p.cat === cur)) && (!term || p.name.toLowerCase().indexOf(term) > -1 || (p.desc || "").toLowerCase().indexOf(term) > -1); });
      $("#product-cat-title").textContent = term ? "Search results" : (cur === "all" ? "All products" : catLabel(cur));
      $("#product-count").textContent = list.length + (list.length === 1 ? " product" : " products") + (term ? " for “" + q.value.trim() + "”" : "");
      if (!list.length) {
        pgrid.innerHTML = '<div class="prod-empty"><h3>No products match “' + esc(q.value.trim()) + '”</h3><p class="muted" style="margin:8px auto 20px">Try another word, or ask us. We may stock it.</p><a class="btn btn-wa" href="' + waLink("Hello Aqua Doctor Solutions, do you have: " + q.value.trim() + "?") + '" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg>Ask on WhatsApp</a></div>';
        return;
      }
      pgrid.innerHTML = list.map(function (p) {
        var msg = "Hello Aqua Doctor Solutions, I am interested in: " + p.name + ". Please share the best price.";
        return '<article class="pcard">' +
          '<button class="pcard-open" type="button" data-open="' + p._i + '" aria-label="View details: ' + esc(p.name) + '">' +
            '<span class="pcard-pic"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy"></span>' +
            '<span class="pcard-body"><span class="pcard-cat">' + esc(catLabel(p.cat)) + '</span><span class="pcard-name">' + esc(p.name) + '</span><span class="pcard-desc">' + esc(p.desc) + "</span></span>" +
          "</button>" +
          '<div class="pcard-actions">' +
            '<button class="btn btn-accent btn-sm pcard-enq" type="button" data-enquire="' + p._i + '">Enquire Now</button>' +
            '<a class="pc-ic pc-wa" href="' + waLink(msg) + '" target="_blank" rel="noopener" aria-label="WhatsApp about ' + esc(p.name) + '"><svg><use href="#i-wa"/></svg></a>' +
            '<a class="pc-ic pc-call" href="' + CALL + '" aria-label="Call about ' + esc(p.name) + '"><svg><use href="#i-phone"/></svg></a>' +
          "</div></article>";
      }).join("");
    }
    catBox.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      cur = b.dataset.cat; q.value = "";
      $$(".cat-btn", catBox).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      render();
      var top = $(".cat-main"); if (top && window.innerWidth < 861) top.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    q.addEventListener("input", render);

    /* detail view */
    var pm = $("#product-modal"), pmOpener = null, pmCur = null;
    function openProduct(i, toForm, from) {
      var p = P[i]; pmCur = p; pmOpener = from || null;
      $("#pm-img").src = p.img; $("#pm-img").alt = p.name;
      $("#pm-cat").textContent = catLabel(p.cat);
      $("#pm-title").textContent = p.name;
      $("#pm-desc").textContent = p.desc;
      $("#pm-uses").innerHTML = (p.uses && p.uses.length)
        ? p.uses.map(function (u) { return '<li><svg aria-hidden="true"><use href="#i-check"/></svg>' + esc(u) + "</li>"; }).join("")
        : '<li class="pm-tbs"><span class="flag">To be supplied</span>Uses and benefits will be added by ADS.</li>';
      $("#pm-pack").textContent = p.pack || "To be supplied";
      $("#pm-wa").href = waLink("Hello Aqua Doctor Solutions, I am interested in: " + p.name + ". Please share the best price.");
      $("#pm-full-form").href = "join.html?type=Product%20enquiry&product=" + encodeURIComponent(p.name) + "#enquiry";
      $("#pm-msg").value = "I would like the best price for: " + p.name;
      $$(".field", pm).forEach(function (f) { f.classList.remove("is-bad"); });
      pm.hidden = false; document.body.classList.add("pm-open");
      requestAnimationFrame(function () { pm.classList.add("is-open"); });
      var box = $(".pmodal-box", pm); box.scrollTop = 0;
      if (toForm) setTimeout(function () { $("#pm-form").scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); $("#pm-name").focus({ preventScroll: true }); }, 60);
      else $("[data-pm-close]", pm).focus();
    }
    function closeProduct() {
      pm.classList.remove("is-open"); document.body.classList.remove("pm-open");
      setTimeout(function () { pm.hidden = true; }, 200);
      if (pmOpener) pmOpener.focus();
    }
    pgrid.addEventListener("click", function (e) {
      var o = e.target.closest("[data-open]"), en = e.target.closest("[data-enquire]");
      if (o) openProduct(+o.dataset.open, false, o);
      else if (en) openProduct(+en.dataset.enquire, true, en);
    });
    $("[data-pm-close]", pm).addEventListener("click", closeProduct);
    pm.addEventListener("click", function (e) { if (e.target === pm) closeProduct(); });
    document.addEventListener("keydown", function (e) {
      if (pm.hidden) return;
      if (e.key === "Escape") closeProduct();
      if (e.key === "Tab") { // keep focus inside the dialog
        var f = $$('a[href],button,input,textarea,select', pm).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    $("[data-pm-quote]", pm).addEventListener("click", function (e) {
      e.preventDefault(); $("#pm-form").scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); $("#pm-name").focus({ preventScroll: true });
    });
    $("#pm-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#pm-name"), phone = $("#pm-phone"), ok = true;
      [[name, !name.value.trim()], [phone, phone.value.replace(/\D/g, "").length < 10]].forEach(function (pair) {
        pair[0].closest(".field").classList.toggle("is-bad", pair[1]); pair[0].setAttribute("aria-invalid", pair[1] ? "true" : "false");
        if (pair[1] && ok) { pair[0].focus(); ok = false; }
      });
      if (!ok) return;
      var t = "Product enquiry: " + pmCur.name + "\nName: " + name.value.trim() + "\nPhone: " + phone.value.trim() +
        ($("#pm-qty").value.trim() ? "\nQuantity: " + $("#pm-qty").value.trim() : "") +
        ($("#pm-place").value.trim() ? "\nVillage / district: " + $("#pm-place").value.trim() : "") +
        ($("#pm-msg").value.trim() ? "\nMessage: " + $("#pm-msg").value.trim() : "");
      window.open(waLink(t), "_blank", "noopener");
    });
    renderCats(); render();
    if (params.get("product")) { var hit = P.filter(function (p) { return p.name === params.get("product"); })[0]; if (hit) openProduct(hit._i, false); }
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

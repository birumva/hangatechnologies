/* ==========================================================================
   Hanga Technologies Ltd — site scripts
   Theme toggle, mobile navigation, scroll reveal, contact form handling.
   No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ------------------------------------------------------------------
     Theme
     The initial theme is applied inline in <head> (see theme-init.js)
     to avoid a flash of the wrong theme. This only handles the toggle.
     ------------------------------------------------------------------ */
  var THEME_KEY = "hanga-theme";
  var root = document.documentElement;

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ }
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      var next = theme === "dark" ? "light" : "dark";
      btn.setAttribute("aria-label", "Switch to " + next + " mode");
      btn.setAttribute("title", "Switch to " + next + " mode");
    });
  }

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  });
  setTheme(currentTheme());

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  function openNav() {
    mobileNav.hidden = false;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("nav-open");
    var first = mobileNav.querySelector("a, button");
    if (first) first.focus();
  }

  function closeNav(returnFocus) {
    mobileNav.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
    if (returnFocus) navToggle.focus();
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      if (mobileNav.hidden) openNav(); else closeNav(true);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobileNav.hidden) closeNav(true);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeNav(false); });
    });
  }

  /* Header ink switches once the dark hero has scrolled away */
  var stage = document.querySelector(".stage, .case-hero");
  if (stage) {
    var syncHeader = function () {
      document.body.classList.toggle("header-on-light", stage.getBoundingClientRect().bottom <= 72);
    };
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Case study carousel: the card nearest the centre is the active one */
  var track = document.querySelector(".work__track");
  var prevCase = document.querySelector("[data-cases='prev']");
  var nextCase = document.querySelector("[data-cases='next']");
  if (track && prevCase && nextCase) {
    var caseCards = Array.prototype.slice.call(track.querySelectorAll(".work-card"));
    var activeCase = 0;

    var nearestCase = function () {
      var mid = track.getBoundingClientRect().left + track.clientWidth / 2;
      var best = 0;
      var bestGap = Infinity;
      caseCards.forEach(function (card, i) {
        var box = card.getBoundingClientRect();
        var gap = Math.abs(box.left + box.width / 2 - mid);
        if (gap < bestGap) { bestGap = gap; best = i; }
      });
      return best;
    };

    var syncCases = function () {
      activeCase = nearestCase();
      caseCards.forEach(function (card, i) { card.classList.toggle("is-active", i === activeCase); });
      prevCase.disabled = activeCase === 0;
      nextCase.disabled = activeCase === caseCards.length - 1;
    };

    var goToCase = function (i) {
      var card = caseCards[Math.max(0, Math.min(caseCards.length - 1, i))];
      var left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      track.scrollTo({ left: left, behavior: reduceMotion ? "auto" : "smooth" });
    };

    var caseTick = null;
    track.addEventListener("scroll", function () {
      if (caseTick) return;
      caseTick = window.requestAnimationFrame(function () { caseTick = null; syncCases(); });
    }, { passive: true });
    window.addEventListener("resize", syncCases);
    prevCase.addEventListener("click", function () { goToCase(activeCase - 1); });
    nextCase.addEventListener("click", function () { goToCase(activeCase + 1); });
    syncCases();
  }

  /* ------------------------------------------------------------------
     Cookie consent
     The choice is kept in local storage. Analytics must only be loaded
     when hasConsent("analytics") is true; listen for "hanga:consent"
     to react when the visitor changes their choice.
     ------------------------------------------------------------------ */
  var CONSENT_KEY = "hanga-consent";
  var CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000;
  var cookieBanner = document.getElementById("cookie-banner");

  function readConsent() {
    try {
      var saved = JSON.parse(localStorage.getItem(CONSENT_KEY));
      if (saved && saved.date && Date.now() - new Date(saved.date).getTime() < CONSENT_MAX_AGE) return saved;
    } catch (e) { /* storage unavailable or value unreadable */ }
    return null;
  }

  window.hangaConsent = {
    hasConsent: function (category) {
      if (category === "essential") return true;
      var saved = readConsent();
      return !!(saved && saved[category]);
    }
  };

  if (cookieBanner) {
    var cookiePrefs = document.getElementById("cookie-prefs");
    var cookieAnalytics = document.getElementById("cookie-analytics");
    var cookieChoose = cookieBanner.querySelector("[data-cookie='choose']");
    var cookieSave = cookieBanner.querySelector("[data-cookie='save']");

    var showPrefs = function (show) {
      cookiePrefs.hidden = !show;
      cookieSave.hidden = !show;
      cookieChoose.hidden = show;
    };

    var saveConsent = function (analytics) {
      var choice = { essential: true, analytics: !!analytics, date: new Date().toISOString() };
      try { localStorage.setItem(CONSENT_KEY, JSON.stringify(choice)); } catch (e) { /* storage unavailable */ }
      cookieBanner.hidden = true;
      document.dispatchEvent(new CustomEvent("hanga:consent", { detail: choice }));
    };

    cookieBanner.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cookie]");
      if (!btn) return;
      var action = btn.getAttribute("data-cookie");
      if (action === "accept") saveConsent(true);
      else if (action === "reject") saveConsent(false);
      else if (action === "save") saveConsent(cookieAnalytics.checked);
      else if (action === "choose") showPrefs(true);
    });
    cookiePrefs.addEventListener("submit", function (e) { e.preventDefault(); saveConsent(cookieAnalytics.checked); });

    document.querySelectorAll("[data-cookie-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        cookieAnalytics.checked = window.hangaConsent.hasConsent("analytics");
        showPrefs(true);
        cookieBanner.hidden = false;
        cookieAnalytics.focus();
      });
    });

    if (!readConsent()) cookieBanner.hidden = false;
  }

  /* ------------------------------------------------------------------
     Scroll reveal (subtle, respects reduced motion)
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Contact form
     Set CONTACT_FORM_ENDPOINT to a form-handling endpoint (for example
     a serverless function or a form service that accepts JSON POSTs).
     Until it is configured, the form shows the direct contact details
     instead of pretending to send.
     ------------------------------------------------------------------ */
  var CONTACT_FORM_ENDPOINT = "";

  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    function setFieldState(field, valid) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.toggle("is-invalid", !valid);
      field.setAttribute("aria-invalid", valid ? "false" : "true");
    }

    function validate() {
      var ok = true;
      var firstInvalid = null;
      form.querySelectorAll("[required]").forEach(function (field) {
        var valid = field.type === "checkbox" ? field.checked : field.checkValidity();
        setFieldState(field, valid);
        if (!valid) {
          ok = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });
      if (firstInvalid) firstInvalid.focus();
      return ok;
    }

    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.closest(".field") && field.closest(".field").classList.contains("is-invalid")) {
          setFieldState(field, field.type === "checkbox" ? field.checked : field.checkValidity());
        }
      });
    });

    function showStatus(state) {
      status.setAttribute("data-state", state);
      status.querySelectorAll("[data-for]").forEach(function (el) {
        el.hidden = el.getAttribute("data-for") !== state;
      });
      status.focus();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      if (!CONTACT_FORM_ENDPOINT) {
        showStatus("unconfigured");
        return;
      }

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      data.page = window.location.href;

      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");

      fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        showStatus("success");
      }).catch(function () {
        showStatus("error");
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
      });
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------------
     Document side navigation: highlight the section in view
     ------------------------------------------------------------------ */
  var docLinks = document.querySelectorAll(".doc__aside nav a[href^='#']");
  if (docLinks.length && "IntersectionObserver" in window) {
    var map = {};
    docLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var sections = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          docLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          map[entry.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }
})();

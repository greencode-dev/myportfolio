(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initTheme() {
    const stored = localStorage.getItem("theme");
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const theme = stored || preferred;
    root.setAttribute("data-theme", theme);

    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const sync = () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("aria-label", isDark ? "Attiva tema chiaro" : "Attiva tema scuro");
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", isDark ? "#0b0d12" : "#ffffff");
    };

    sync();
    toggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      sync();
    });
  }

  function initNav() {
    const nav = document.getElementById("nav");
    const burger = document.getElementById("nav-toggle");
    if (!nav || !burger) return;

    const close = () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Apri menu");
    };

    burger.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) close();
    });
  }

  function initHeader() {
    const header = document.getElementById("header");
    const toTop = document.getElementById("to-top");
    if (!header) return;

    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);
      if (toTop) toTop.classList.toggle("is-visible", y > 600);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  }

  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll(".nav__link"));
    if (!links.length) return;

    const targets = links
      .map(function (link) {
        const id = link.getAttribute("href");
        return id && id.startsWith("#") ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
      observer.observe(el);
    });
  }

  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          obs.unobserve(el);

          const target = parseInt(el.dataset.count, 10) || 0;
          const suffix = el.dataset.suffix || "";
          if (reduceMotion) {
            el.textContent = target + suffix;
            return;
          }

          const duration = 1100;
          const start = performance.now();
          const step = function (now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initCopyEmail() {
    const button = document.getElementById("copy-email");
    const feedback = document.getElementById("copy-feedback");
    if (!button) return;

    button.addEventListener("click", function () {
      const email = button.dataset.email || button.textContent.trim();
      const done = function () {
        if (!feedback) return;
        feedback.textContent = "Email copiata negli appunti.";
        setTimeout(function () {
          feedback.textContent = "";
        }, 2600);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done).catch(function () {});
      } else {
        const helper = document.createElement("textarea");
        helper.value = email;
        helper.setAttribute("readonly", "");
        helper.style.position = "absolute";
        helper.style.left = "-9999px";
        document.body.appendChild(helper);
        helper.select();
        try {
          document.execCommand("copy");
          done();
        } catch (err) {}
        document.body.removeChild(helper);
      }
    });
  }

  function initForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    const submit = document.getElementById("form-submit");
    if (!form) return;

    const fallbackEmail = form.dataset.fallbackEmail || "";
    const keyField = form.querySelector("[data-web3forms-key]");
    const accessKey = keyField ? keyField.value.trim() : "";
    const endpoint = form.getAttribute("action") || "";
    const isConfigured = endpoint.indexOf("api.web3forms.com") > -1 && /^[\w-]{20,}$/.test(accessKey);
    const label = submit ? submit.textContent : "";
    const captcha = form.querySelector("[data-captcha]");

    const setStatus = function (message, state) {
      if (!status) return;
      status.textContent = message;
      status.classList.remove("is-ok", "is-err");
      if (state) status.classList.add(state);
    };

    const setBusy = function (busy, message) {
      if (!submit) return;
      submit.disabled = busy;
      submit.textContent = message || label;
    };

    const captchaSolved = function () {
      if (!captcha) return true;
      const response = form.querySelector('[name="h-captcha-response"]');
      return !!(response && response.value);
    };

    const resetCaptcha = function () {
      if (!captcha || !window.hcaptcha || typeof window.hcaptcha.reset !== "function") return;
      try {
        const id = typeof window.hcaptcha.getWidgetID === "function" ? window.hcaptcha.getWidgetID(captcha) : 0;
        window.hcaptcha.reset(id);
      } catch (err) {}
    };

    const clearInvalid = function (fields) {
      fields.forEach(function (field) {
        field.removeAttribute("aria-invalid");
      });
      form.reset();
      resetCaptcha();
    };

    const fallback = function (nome) {
      const data = new FormData(form);
      const body = ["Nome: " + data.get("nome"), "Email: " + data.get("email"), "", String(data.get("messaggio"))].join("\n");
      const href =
        "mailto:" + fallbackEmail +
        "?subject=" + encodeURIComponent("Richiesta dal portfolio — " + nome) +
        "&body=" + encodeURIComponent(body);
      window.location.href = href;
      setStatus("Si è aperto il tuo client email. Se non parte, scrivi a " + fallbackEmail, "is-ok");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const fields = Array.from(form.querySelectorAll("[data-validate]"));
      let valid = true;

      fields.forEach(function (field) {
        const value = field.value.trim();
        let ok = value.length > 0;
        if (ok && field.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        field.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && valid) {
          field.focus();
          valid = false;
        }
      });

      if (!valid) {
        setStatus("Controlla i campi evidenziati.", "is-err");
        return;
      }

      if (!isConfigured) {
        setBusy(true, "Apro l'email…");
        setTimeout(function () {
          fallback(new FormData(form).get("nome"));
          setBusy(false);
        }, 500);
        return;
      }

      if (!captchaSolved()) {
        setStatus("Completa il captcha prima di inviare.", "is-err");
        return;
      }

      const payload = new FormData(form);
      payload.set("access_key", accessKey);

      setBusy(true, "Invio in corso…");
      setStatus("");

      fetch(endpoint, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          return res.json().then(
            function (body) {
              return { ok: res.ok, body: body };
            },
            function () {
              return { ok: false, body: null };
            }
          );
        })
        .then(function (result) {
          setBusy(false);
          if (result.ok && result.body && result.body.success) {
            clearInvalid(fields);
            setStatus(result.body.message || "Messaggio inviato. Rispondo entro 24 ore.", "is-ok");
            return;
          }
          const reason = (result.body && result.body.message) || "il servizio non ha risposto";
          setStatus("Invio non riuscito (" + reason + "). Scrivi a " + fallbackEmail + ".", "is-err");
        })
        .catch(function () {
          setBusy(false);
          setStatus("Connessione non disponibile. Scrivi a " + fallbackEmail + ".", "is-err");
        });
    });
  }

  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  initTheme();
  initNav();
  initHeader();
  initScrollSpy();
  initReveal();
  initCounters();
  initCopyEmail();
  initForm();
  initYear();
})();

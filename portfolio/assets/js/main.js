/* =========================================================
   DilshadAli Ansari — portfolio interactions
   Vanilla JS · no dependencies
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;

  /* ---------- Theme ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  var themeColors = { dark: "#08080a", light: "#f4f1e8" };

  function applyTheme(theme) {
    var next = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    if (metaTheme) metaTheme.setAttribute("content", themeColors[next]);
    if (themeToggle) {
      var label = next === "dark" ? "Switch to light theme" : "Switch to dark theme";
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* storage may be unavailable */
    }
  }

  applyTheme(root.getAttribute("data-theme"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Mobile navigation ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var nav = document.getElementById("primaryNav");
  var mobileQuery = window.matchMedia("(max-width: 900px)");

  function openMenu() {
    body.classList.add("nav-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close menu");
    }
  }

  function closeMenu() {
    body.classList.remove("nav-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (body.classList.contains("nav-open")) closeMenu();
      else openMenu();
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
  }

  document.addEventListener("click", function (event) {
    if (!body.classList.contains("nav-open")) return;
    if (event.target.closest("#primaryNav") || event.target.closest("#menuToggle")) return;
    closeMenu();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      closeMenu();
      if (menuToggle) menuToggle.focus();
    }
  });

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", function (event) {
      if (!event.matches) closeMenu();
    });
  }

  /* ---------- Header + scroll progress ---------- */
  var header = document.getElementById("siteHeader");
  var progressBar = document.getElementById("scrollProgress");
  var scrollTicking = false;

  function handleScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 12);

    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
      progressBar.style.width = pct + "%";
    }

    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(handleScroll);
      }
    },
    { passive: true }
  );
  handleScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window && revealItems.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );

    revealItems.forEach(function (element) {
      var siblings = Array.prototype.filter.call(
        element.parentElement.children,
        function (child) {
          return child.classList.contains("reveal");
        }
      );
      var index = siblings.indexOf(element);
      if (index > 0) {
        element.style.setProperty("--reveal-delay", Math.min(index, 4) * 65 + "ms");
      }
      revealObserver.observe(element);
    });
  } else {
    revealItems.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  /* ---------- Active section in nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sectionIds = ["about", "experience", "work", "skills", "contact"];
  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  function setActiveSection(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (entry.target.id === "top") {
            navLinks.forEach(function (link) {
              link.removeAttribute("aria-current");
            });
          } else {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
    var hero = document.getElementById("top");
    if (hero) navObserver.observe(hero);
  }

  /* ---------- Spotlight on the profile card ---------- */
  var profileCard = document.querySelector(".profile-card");
  if (profileCard && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    profileCard.addEventListener("pointermove", function (event) {
      var rect = profileCard.getBoundingClientRect();
      var mx = ((event.clientX - rect.left) / rect.width) * 100;
      var my = ((event.clientY - rect.top) / rect.height) * 100;
      profileCard.style.setProperty("--mx", mx.toFixed(2) + "%");
      profileCard.style.setProperty("--my", my.toFixed(2) + "%");
    });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById("copyEmail");
  var copyTimer = null;

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      var label = copyBtn.querySelector(".copy-label");

      function showCopied() {
        copyBtn.classList.add("is-copied");
        copyBtn.setAttribute("aria-label", "Email address copied");
        if (label) label.textContent = "Copied";
        window.clearTimeout(copyTimer);
        copyTimer = window.setTimeout(function () {
          copyBtn.classList.remove("is-copied");
          copyBtn.setAttribute("aria-label", "Copy email address");
          if (label) label.textContent = "Copy";
        }, 2200);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(showCopied).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        var field = document.createElement("textarea");
        field.value = email;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.left = "-9999px";
        body.appendChild(field);
        field.select();
        try {
          document.execCommand("copy");
          showCopied();
        } catch (e) {
          window.location.href = "mailto:" + email;
        }
        field.remove();
      }
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalMarkup = submitBtn ? submitBtn.innerHTML : "";
      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var message = String(data.get("message") || "").trim();

      function openMailClient() {
        var subject = encodeURIComponent("Portfolio enquiry from " + name);
        var bodyText = encodeURIComponent(message + "\n\n— " + name + "\n" + email);
        if (formNote) {
          formNote.className = "form-note";
          formNote.textContent = "Opening your email app… if nothing happens, email dilshad24ansari@gmail.com.";
        }
        window.location.href =
          "mailto:dilshad24ansari@gmail.com?subject=" + subject + "&body=" + bodyText;
      }

      /* No server here (opened from disk) — hand off to the email client. */
      if (window.location.protocol === "file:") {
        openMailClient();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      if (formNote) {
        formNote.className = "form-note";
        formNote.textContent = "Sending your message…";
      }

      var payload = new URLSearchParams();
      data.forEach(function (value, key) {
        payload.append(key, value);
      });

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Form endpoint returned " + response.status);
          form.reset();
          if (formNote) {
            formNote.className = "form-note is-success";
            formNote.textContent = "Thanks — message received. I'll get back to you soon.";
          }
        })
        .catch(function () {
          openMailClient();
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalMarkup;
          }
        });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

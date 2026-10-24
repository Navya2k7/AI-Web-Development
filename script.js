/**
 * Navya Raghav — Personal Portfolio Script
 * Features:
 * 1. Scroll Reveal Animations (IntersectionObserver)
 * 2. Dark / Light Theme Toggle (with persistent localStorage)
 * 3. Mobile Navigation Menu (with hamburger / close icon toggle)
 * 4. Active Navigation Highlight (ScrollSpy)
 * 5. Certificate Preview Modal
 * 6. Dynamic Year Auto-Update
 * 7. Smooth Scroll with Header Offset
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     1. SCROLL REVEAL ANIMATION
  ======================================== */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Graceful fallback: show all elements if IntersectionObserver is unavailable
    revealElements.forEach((el) => el.classList.add("visible"));
  }


  /* ========================================
     2. DARK / LIGHT THEME TOGGLE
  ======================================== */
  const themeToggle = document.querySelector("#themeToggle, .theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.classList.toggle("light-theme", theme === "light");
    localStorage.setItem("portfolio-theme", theme);

    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
      themeToggle.setAttribute(
        "title",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }

    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "dark" ? "#080b16" : "#f8f7fd");
    }
  }

  // Initialize theme from localStorage or system preference (default dark)
  const savedTheme = localStorage.getItem("portfolio-theme");
  const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
    });
  }


  /* ========================================
     3. MOBILE NAVIGATION MENU
  ======================================== */
  const menuToggle = document.querySelector("#menuToggle, .menu-toggle");
  const navLinks = document.querySelector("#navLinks, .nav-links");

  function closeMenu() {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  function openMenu() {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.textContent = "✕";
    menuToggle.setAttribute("aria-label", "Close navigation menu");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.contains("active");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        closeMenu();
      }
    });
  }


  /* ========================================
     4. ACTIVE NAVIGATION LINK (SCROLLSPY)
  ======================================== */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    const headerOffset = 100;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerOffset;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach((link) => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink, { passive: true });
  updateActiveNavLink();


  /* ========================================
     5. CERTIFICATE PREVIEW MODAL
  ======================================== */
  const certificateDialog = document.getElementById("certificate-dialog");
  const certificateFrame = document.getElementById("certificate-frame");
  const certificateOpenLink = document.getElementById("certificate-open-link");
  const closeCertificate = document.getElementById("close-certificate");
  const certificateButtons = document.querySelectorAll(".certificate-btn[data-certificate]");

  function closeCertificatePreview() {
    if (certificateDialog && certificateDialog.open) {
      certificateDialog.close();
    }
    if (certificateFrame) {
      certificateFrame.src = "about:blank";
    }
  }

  certificateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const certificatePath = button.dataset.certificate;
      if (!certificatePath) return;

      // Fallback if browser doesn't support modal dialogs
      if (!certificateDialog || typeof certificateDialog.showModal !== "function") {
        window.open(certificatePath, "_blank", "noopener,noreferrer");
        return;
      }

      if (certificateFrame) {
        certificateFrame.src = certificatePath;
      }
      if (certificateOpenLink) {
        certificateOpenLink.href = certificatePath;
      }

      certificateDialog.showModal();
    });
  });

  if (closeCertificate) {
    closeCertificate.addEventListener("click", closeCertificatePreview);
  }

  if (certificateDialog) {
    certificateDialog.addEventListener("close", () => {
      if (certificateFrame) {
        certificateFrame.src = "about:blank";
      }
    });

    // Close when clicking the dark backdrop outside the dialog box
    certificateDialog.addEventListener("click", (event) => {
      const rect = certificateDialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        closeCertificatePreview();
      }
    });
  }


  /* ========================================
     6. DYNAMIC COPYRIGHT YEAR
  ======================================== */
  const currentYear = new Date().getFullYear();
  document.querySelectorAll("#year, #current-year, .footer-year").forEach((el) => {
    el.textContent = currentYear;
  });


  /* ========================================
     7. SMOOTH SCROLLING WITH HEADER OFFSET
  ======================================== */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        const headerHeight = 76;
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });

});
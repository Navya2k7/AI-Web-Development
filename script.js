/* ========================================
   1. MOBILE NAVIGATION
======================================== */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ========================================
   2. DARK / LIGHT THEME
======================================== */

const themeToggle = document.querySelector(
  "#theme-toggle, .theme-toggle"
);

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light" || savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function updateThemeButton() {
  if (!themeToggle) return;

  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";

  themeToggle.setAttribute(
    "aria-label",
    currentTheme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme"
  );
}

if (themeToggle) {
  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "dark";

    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("portfolio-theme", newTheme);

    updateThemeButton();
  });
}

/* ========================================
   3. CURRENT YEAR
======================================== */

const yearElement = document.querySelector("#current-year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* ========================================
   4. CERTIFICATE PREVIEW
======================================== */

const certificateDialog = document.getElementById(
  "certificate-dialog"
);

const certificateFrame = document.getElementById(
  "certificate-frame"
);

const certificateOpenLink = document.getElementById(
  "certificate-open-link"
);

const closeCertificate = document.getElementById(
  "close-certificate"
);

const certificateButtons = document.querySelectorAll(
  ".certificate-btn[data-certificate]"
);

// Open the selected certificate in the preview dialog.
certificateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const certificatePath = button.dataset.certificate;

    if (!certificatePath) return;

    // Fallback if the browser does not support dialog previews.
    if (
      !certificateDialog ||
      typeof certificateDialog.showModal !== "function"
    ) {
      window.open(certificatePath, "_blank", "noopener,noreferrer");
      return;
    }

    certificateFrame.src = certificatePath;
    certificateOpenLink.href = certificatePath;

    certificateDialog.showModal();
  });
});

// Close the certificate preview.
function closeCertificatePreview() {
  if (certificateDialog && certificateDialog.open) {
    certificateDialog.close();
  }

  if (certificateFrame) {
    certificateFrame.src = "about:blank";
  }
}

if (closeCertificate) {
  closeCertificate.addEventListener(
    "click",
    closeCertificatePreview
  );
}

// Also clean up when the user presses Escape.
if (certificateDialog) {
  certificateDialog.addEventListener("close", () => {
    if (certificateFrame) {
      certificateFrame.src = "about:blank";
    }
  });

  // Close when clicking the dialog backdrop.
  certificateDialog.addEventListener("click", (event) => {
    if (event.target === certificateDialog) {
      closeCertificatePreview();
    }
  });
}

/* ========================================
   5. CONTACT FORM
======================================== */

// This section provides basic validation.
// It does not send messages unless connected
// to a backend or email service.

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formMessage = document.querySelector("#form-message");

    if (formMessage) {
      formMessage.textContent =
        "Your form is valid, but message sending has not been configured yet.";
    }
  });
}

/* ========================================
   6. SMOOTH SCROLLING
======================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

/* ========================================
   7. UPDATE FOOTER YEAR
======================================== */

const footerYear = document.querySelector(".footer-year");

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}
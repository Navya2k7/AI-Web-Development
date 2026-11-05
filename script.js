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


  /* ========================================
     8. TOAST NOTIFICATION UTILITY
  ======================================== */
  const toastNotification = document.getElementById("toastNotification");
  let toastTimer = null;

  function showToast(message, duration = 3500) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove("show");
    }, duration);
  }


  /* ========================================
     9. 1-CLICK COPY EMAIL WITH FEEDBACK
  ======================================== */
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = "raghavnavya24@gmail.com";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = email;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        showToast("Email copied to clipboard: raghavnavya24@gmail.com ✓");
        copyEmailBtn.textContent = "Copied! ✓";
        setTimeout(() => {
          copyEmailBtn.textContent = "Copy 📋";
        }, 2500);
      } catch (err) {
        showToast("Email: raghavnavya24@gmail.com");
      }
    });
  }


  /* ========================================
     10. INTERACTIVE CONTACT FORM HANDLER
  ======================================== */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contactName")?.value.trim();
      const email = document.getElementById("contactEmail")?.value.trim();
      const subject = document.getElementById("contactSubject")?.value || "InAmigos Foundation Internship";
      const message = document.getElementById("contactMessage")?.value.trim();

      if (!name || !email || !message) {
        showToast("Please fill in all required fields.");
        return;
      }

      const mailtoUrl = `mailto:raghavnavya24@gmail.com?subject=${encodeURIComponent(
        `[Portfolio Contact] ${subject} - ${name}`
      )}&body=${encodeURIComponent(
        `Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`
      )}`;

      showToast("Opening email client... Thank you for reaching out! 🚀");
      window.location.href = mailtoUrl;
      contactForm.reset();
    });
  }


  /* ========================================
     11. INTERACTIVE AI PROFILE ASSISTANT
  ======================================== */
  const aiChatWindow = document.getElementById("aiChatWindow");
  const aiForm = document.getElementById("aiForm");
  const aiInput = document.getElementById("aiInput");
  const aiResetBtn = document.getElementById("aiResetBtn");
  const aiChips = document.querySelectorAll(".ai-chip");

  const aiKnowledgeBase = {
    skills: `
      ⚡ <strong>Navya's Technical Toolkit & Capabilities:</strong><br>
      <ul>
        <li><strong>AI &amp; Prompt Engineering:</strong> ChatGPT, Claude, GitHub Copilot, v0.dev, Wix AI, WordPress AI, Structured Prompting.</li>
        <li><strong>Web Development:</strong> Semantic HTML5, CSS3 (Flexbox/Grid, Responsive), Modern JavaScript (ES6+, DOM, Async/Await), REST APIs, Vite.</li>
        <li><strong>Core CS:</strong> C++ (OOPs, Data Structures), Python scripting, Problem Solving, IoT architecture.</li>
        <li><strong>Developer Tools:</strong> Git &amp; GitHub, SQL, MongoDB basics, Vercel cloud deployment.</li>
      </ul>
      <p>She specializes in leveraging modern AI workflows to rapidly scaffold, refine, and deploy robust web experiences!</p>
    `,
    inamigos: `
      🎯 <strong>Why InAmigos Foundation AI Web Development Internship?</strong><br>
      <p>Navya applied for this internship because she is passionate about putting AI tools into real-world web engineering practice. She is eager to:</p>
      <ul>
        <li>Harness AI web builders and intelligent code generation to build community-focused web platforms.</li>
        <li>Contribute with high discipline, proactive communication, and rapid turnaround on tasks.</li>
        <li>Collaborate with mentors and fellow interns while showcasing measurable technical outcomes.</li>
      </ul>
    `,
    education: `
      🎓 <strong>Academic Background &amp; Scores:</strong><br>
      <ul>
        <li><strong>Undergraduate:</strong> B.Tech in Computer Science Engineering (IoT) at <em>Dronacharya College of Engineering</em> (2025–2029).</li>
        <li><strong>Academic Excellence:</strong> Current Overall CGPA of <strong>8.84 / 10</strong>.</li>
        <li><strong>Schooling:</strong> Delhi Public School, Maruti Kunj — Class 10: <strong>90.4%</strong> | Class 12: <strong>85.4%</strong>.</li>
      </ul>
    `,
    research: `
      🏆 <strong>Research &amp; Academic Presentations:</strong><br>
      <ul>
        <li><strong>Anusandhan 3.0 (IIT Mandi):</strong> Presented an academic research paper, gaining hands-on defense and rigorous methodology skills.</li>
        <li><strong>ICMSCI 2026:</strong> Participated in the International Conference on Computing and Mathematical Sciences.</li>
      </ul>
      <p>You can preview both certificates right on this website under the <a href="#certifications">Certifications section</a>!</p>
    `,
    contact: `
      📬 <strong>How to Reach Navya:</strong><br>
      <ul>
        <li>✉️ <strong>Email:</strong> <a href="mailto:raghavnavya24@gmail.com">raghavnavya24@gmail.com</a></li>
        <li>💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/navya-raghav-691832377" target="_blank" rel="noopener">linkedin.com/in/navya-raghav-691832377 ↗</a></li>
        <li>🐙 <strong>GitHub:</strong> <a href="https://github.com/Navya2k7" target="_blank" rel="noopener">github.com/Navya2k7 ↗</a></li>
        <li>📄 <strong>Resume:</strong> <a href="resume.pdf" download="Navya_Raghav_Resume.pdf">Download PDF Resume ↓</a></li>
      </ul>
    `
  };

  function appendAiMessage(sender, htmlContent) {
    if (!aiChatWindow) return;
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-message ai-${sender}`;
    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "ai-bubble";
    bubbleDiv.innerHTML = htmlContent;
    msgDiv.appendChild(bubbleDiv);
    aiChatWindow.appendChild(msgDiv);
    aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
  }

  function appendTypingIndicator() {
    if (!aiChatWindow) return null;
    const typingDiv = document.createElement("div");
    typingDiv.className = "ai-message ai-bot ai-typing-msg";
    typingDiv.innerHTML = `
      <div class="ai-bubble ai-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    aiChatWindow.appendChild(typingDiv);
    aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
    return typingDiv;
  }

  function handleQuery(queryText, presetKey = null) {
    if (!queryText.trim()) return;

    appendAiMessage("user", queryText);

    const indicator = appendTypingIndicator();

    setTimeout(() => {
      if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }

      let responseHtml = "";
      if (presetKey && aiKnowledgeBase[presetKey]) {
        responseHtml = aiKnowledgeBase[presetKey];
      } else {
        const q = queryText.toLowerCase();
        if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("tool") || q.includes("html") || q.includes("python") || q.includes("c++") || q.includes("ai")) {
          responseHtml = aiKnowledgeBase.skills;
        } else if (q.includes("inamigos") || q.includes("intern") || q.includes("why") || q.includes("hire") || q.includes("task")) {
          responseHtml = aiKnowledgeBase.inamigos;
        } else if (q.includes("education") || q.includes("cgpa") || q.includes("college") || q.includes("school") || q.includes("marks") || q.includes("study")) {
          responseHtml = aiKnowledgeBase.education;
        } else if (q.includes("research") || q.includes("paper") || q.includes("iit") || q.includes("mandi") || q.includes("conference") || q.includes("certificate")) {
          responseHtml = aiKnowledgeBase.research;
        } else if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("phone") || q.includes("resume") || q.includes("linkedin")) {
          responseHtml = aiKnowledgeBase.contact;
        } else if (q.includes("project") || q.includes("work") || q.includes("noticeguard") || q.includes("iot")) {
          responseHtml = `
            🚀 <strong>Navya's Featured Projects:</strong><br>
            <ul>
              <li><strong>NoticeGuard:</strong> An AI-assisted student notice and opportunity verification system that protects students from false notices and fraudulent internship offers.</li>
              <li><strong>AI-Powered Personal Profile (Task 1):</strong> This live web application, built with clean responsive architecture, dark/light modes, and interactive AI widgets.</li>
              <li><strong>IoT Telemetry Visualizer:</strong> Hardware-connected browser interface for real-time sensor metrics.</li>
            </ul>
            <p>Explore the live cards in the <a href="#projects">Projects section</a>!</p>
          `;
        } else {
          responseHtml = `
            🤖 <em>"Thanks for asking! Navya is an enthusiastic AI Web Developer and CSE (IoT) student with an 8.84 CGPA."</em><br><br>
            You can explore her <a href="#skills">Skills</a>, <a href="#projects">Projects</a>, or get in touch directly at <a href="mailto:raghavnavya24@gmail.com">raghavnavya24@gmail.com</a>. Feel free to click any of the quick prompt chips above!
          `;
        }
      }

      appendAiMessage("bot", responseHtml);
    }, 450);
  }

  aiChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.query;
      const text = chip.textContent.trim();
      handleQuery(text, key);
    });
  });

  if (aiForm && aiInput) {
    aiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = aiInput.value.trim();
      if (!val) return;
      aiInput.value = "";
      handleQuery(val);
    });
  }

  if (aiResetBtn && aiChatWindow) {
    aiResetBtn.addEventListener("click", () => {
      aiChatWindow.innerHTML = `
        <div class="ai-message ai-bot">
          <div class="ai-bubble">
            <p>
              👋 <strong>Chat reset.</strong> How else can I assist you with Navya's AI Web Development portfolio?
            </p>
          </div>
        </div>
      `;
    });
  }

});
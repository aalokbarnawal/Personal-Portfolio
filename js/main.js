/**
 * Aalok Barnawal — Personal Portfolio Scripts
 * Modular Vanilla JavaScript for interactive UI, animations, forms, and dynamic Firestore hydration.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Global dynamic taglines list
  let currentTaglines = [
    "Graphic Designer",
    "Front-End Developer",
    "Brand Identity Creator",
    "Visual Storyteller",
    "Creative Thinker",
  ];

  // =========================================================
  // 1. DYNAMIC FIRESTORE HYDRATION
  // =========================================================
  if (typeof fetchPortfolioData === "function") {
    try {
      const data = await fetchPortfolioData();
      if (data) {
        hydrateDOM(data);
      }
    } catch (e) {
      console.warn(
        "Could not hydrate from Firestore, using initial markup:",
        e,
      );
    }
  }

  function formatPlainBioText(str) {
    if (!str) return "";
    // If it already has HTML <strong> or <b>, preserve it
    if (/<[a-z][\s\S]*>/i.test(str)) {
      return str;
    }
    // Support markdown **text** -> <strong>text</strong>
    let formatted = str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Automatically emphasize Aalok Barnawal if not already bolded
    if (!formatted.includes("<strong>Aalok Barnawal</strong>")) {
      formatted = formatted.replace(
        /Aalok Barnawal/g,
        "<strong>Aalok Barnawal</strong>",
      );
    }
    return formatted;
  }

  function hydrateDOM(data) {
    if (!data) return;

    // --- HERO ---
    if (data.hero) {
      const availText = document.getElementById("hero-availability-text");
      if (availText && data.hero.availabilityText) {
        availText.textContent = data.hero.availabilityText;
      }

      const hLine1 = document.getElementById("hero-line-1");
      const hLine2 = document.getElementById("hero-line-2");
      const hLine3 = document.getElementById("hero-line-3");
      if (hLine1 && data.hero.headlineLine1)
        hLine1.textContent = data.hero.headlineLine1;
      if (hLine2 && data.hero.headlineLine2)
        hLine2.textContent = data.hero.headlineLine2;
      if (hLine3 && data.hero.headlineLine3)
        hLine3.textContent = data.hero.headlineLine3;

      if (
        data.hero.taglines &&
        Array.isArray(data.hero.taglines) &&
        data.hero.taglines.length > 0
      ) {
        currentTaglines = data.hero.taglines;
      }

      const heroDesc = document.getElementById("hero-description");
      if (heroDesc && data.hero.description) {
        heroDesc.innerHTML = formatPlainBioText(data.hero.description);
      }

      const heroImg = document.getElementById("hero-img");
      if (heroImg && data.hero.heroImage) {
        heroImg.src = data.hero.heroImage;
      }

      const pLabelTop = document.getElementById("photo-label-top");
      const pLabelBottom = document.getElementById("photo-label-bottom");
      if (pLabelTop && data.hero.photoLabelTop)
        pLabelTop.textContent = data.hero.photoLabelTop;
      if (pLabelBottom && data.hero.photoLabelBottom)
        pLabelBottom.textContent = data.hero.photoLabelBottom;
    }

    // --- ABOUT ME ---
    if (data.about) {
      const aboutNum = document.getElementById("about-section-number");
      if (aboutNum && data.about.sectionNumber)
        aboutNum.textContent = data.about.sectionNumber;

      const aboutTitle = document.getElementById("about-section-title");
      if (aboutTitle) {
        if (data.about.sectionTitleLine1 || data.about.sectionTitleLine2) {
          const l1 = data.about.sectionTitleLine1 || "";
          const l2 = data.about.sectionTitleLine2 || "";
          aboutTitle.innerHTML = `${l1}<br />${l2}`;
        } else if (data.about.sectionTitle) {
          aboutTitle.innerHTML = data.about.sectionTitle;
        }
      }

      const bioContainer = document.getElementById("about-bio-text");
      if (bioContainer) {
        let bioHtml = "";
        if (data.about.leadText) {
          bioHtml += `<p class="about-lead">${formatPlainBioText(data.about.leadText)}</p>`;
        }
        if (data.about.paragraph1) {
          bioHtml += `<p>${formatPlainBioText(data.about.paragraph1)}</p>`;
        }
        if (data.about.paragraph2) {
          bioHtml += `<p>${formatPlainBioText(data.about.paragraph2)}</p>`;
        }
        if (bioHtml) bioContainer.innerHTML = bioHtml;
      }

      // Stats
      const statsContainer = document.getElementById("about-stats-container");
      if (
        statsContainer &&
        data.about.experienceStats &&
        Array.isArray(data.about.experienceStats)
      ) {
        statsContainer.innerHTML = data.about.experienceStats
          .map(
            (stat) => `
          <div class="stat-card stat" data-target="${stat.number}">
            <div class="stat-icon">
              <i class="${stat.icon || "fa-solid fa-star"}"></i>
            </div>
            <div class="stat-data">
              <div class="stat-number-wrap">
                <span class="stat-number" id="stat-${stat.id || "num"}">0</span><span class="stat-suffix">${stat.suffix || "+"}</span>
              </div>
              <span class="stat-label">${stat.label}</span>
            </div>
          </div>`,
          )
          .join("");

        // Re-bind counter animation
        observeStatsCounters();
      }
    }

    // --- WHO I AM ---
    if (data.whoIAm) {
      const whoBadge = document.getElementById("whoiam-badge");
      if (whoBadge && data.whoIAm.badge)
        whoBadge.textContent = data.whoIAm.badge;

      const whoTitle = document.getElementById("whoiam-title");
      if (whoTitle && data.whoIAm.title)
        whoTitle.textContent = data.whoIAm.title;

      const whoStatus = document.getElementById("whoiam-status-text");
      if (whoStatus && data.whoIAm.statusText)
        whoStatus.textContent = data.whoIAm.statusText;

      const whoName = document.getElementById("whoiam-name");
      if (whoName && data.whoIAm.name) whoName.textContent = data.whoIAm.name;

      const whoPrimary = document.getElementById("whoiam-primary-role");
      if (whoPrimary && data.whoIAm.primaryRole)
        whoPrimary.textContent = data.whoIAm.primaryRole;

      const whoSec = document.getElementById("whoiam-secondary-craft");
      if (whoSec && data.whoIAm.secondaryCraft)
        whoSec.textContent = data.whoIAm.secondaryCraft;

      const whoFocus = document.getElementById("whoiam-creative-focus");
      if (whoFocus && data.whoIAm.creativeFocus)
        whoFocus.textContent = data.whoIAm.creativeFocus;

      const whoAvail = document.getElementById("whoiam-availability");
      if (whoAvail && data.whoIAm.availability) {
        whoAvail.innerHTML = `<span class="green-dot"></span> ${data.whoIAm.availability}`;
      }

      const whoTools = document.getElementById("whoiam-tools");
      if (whoTools && Array.isArray(data.whoIAm.coreTools)) {
        whoTools.innerHTML = data.whoIAm.coreTools
          .map(
            (t) =>
              `<span><i class="${t.icon || "fa-solid fa-wrench"}"></i> ${t.name}</span>`,
          )
          .join("");
      }
    }

    // --- SERVICES (WHAT I DO) ---
    if (
      data.services &&
      Array.isArray(data.services) &&
      data.services.length > 0
    ) {
      const servicesContainer = document.getElementById("services-container");
      if (servicesContainer) {
        servicesContainer.innerHTML = data.services
          .map(
            (srv, idx) => `
          <div class="service reveal visible" style="transition-delay: ${idx * 0.1}s">
            <div class="service-number">${srv.number || String(idx + 1).padStart(2, "0")}</div>
            <div class="service-icon">
              <i class="${srv.icon || "fa-solid fa-pen-nib"}"></i>
            </div>
            <h3>${srv.title}</h3>
            <p>${srv.description}</p>
          </div>`,
          )
          .join("");
      }
    }

    // --- SKILLS ---
    if (data.skills) {
      const designContainer = document.getElementById(
        "skills-design-container",
      );
      if (designContainer && Array.isArray(data.skills.design)) {
        designContainer.innerHTML = data.skills.design
          .map((sk) => `<span class="skill">${sk}</span>`)
          .join("");
      }

      const devContainer = document.getElementById("skills-dev-container");
      if (devContainer && Array.isArray(data.skills.development)) {
        devContainer.innerHTML = data.skills.development
          .map((sk) => `<span class="skill">${sk}</span>`)
          .join("");
      }

      // Tools Marquee
      const marqueeTrack = document.getElementById("marquee-track");
      if (marqueeTrack && Array.isArray(data.skills.toolsMarquee)) {
        const contentHtml = data.skills.toolsMarquee
          .map(
            (tool) =>
              `<span class="tool-item"><i class="${tool.icon || "fa-solid fa-cube"}"></i> ${tool.name}</span>`,
          )
          .join("");

        marqueeTrack.innerHTML = `
          <div class="marquee-content">${contentHtml}</div>
          <div class="marquee-content" aria-hidden="true">${contentHtml}</div>
        `;
      }

      // Re-apply skill stagger
      staggerSkillTags();
    }

    // --- CONTACT & SOCIALS ---
    if (data.contact) {
      const emailLink = document.getElementById("contact-email-link");
      if (emailLink && data.contact.email) {
        emailLink.href = `mailto:${data.contact.email}`;
        emailLink.textContent = data.contact.email;
      }

      const availContact = document.getElementById("contact-availability-text");
      if (availContact && data.contact.availability) {
        availContact.textContent = data.contact.availability;
      }

      if (data.contact.socials) {
        const { instagram, behance, github, linkedin } = data.contact.socials;
        if (instagram) {
          const el1 = document.getElementById("contact-social-instagram");
          const el2 = document.getElementById("footer-social-instagram");
          if (el1) el1.href = instagram;
          if (el2) el2.href = instagram;
        }
        if (behance) {
          const el1 = document.getElementById("contact-social-behance");
          const el2 = document.getElementById("footer-social-behance");
          if (el1) el1.href = behance;
          if (el2) el2.href = behance;
        }
        if (github) {
          const el1 = document.getElementById("contact-social-github");
          const el2 = document.getElementById("footer-social-github");
          if (el1) el1.href = github;
          if (el2) el2.href = github;
        }
        if (linkedin) {
          const el1 = document.getElementById("contact-social-linkedin");
          const el2 = document.getElementById("footer-social-linkedin");
          if (el1) el1.href = linkedin;
          if (el2) el2.href = linkedin;
        }
      }
    }

    // --- SELECTED WORK / PROJECTS ---
    if (
      data.projects &&
      Array.isArray(data.projects) &&
      data.projects.length > 0
    ) {
      const workGrid = document.getElementById("work-grid");
      if (workGrid) {
        workGrid.innerHTML = data.projects
          .map((proj, idx) => {
            const tags = Array.isArray(proj.tools)
              ? proj.tools
              : typeof proj.tools === "string"
                ? proj.tools.split(",").map((t) => t.trim())
                : [];
            const tagHtml = tags
              .map((t) => `<span class="work-tag">${t}</span>`)
              .join("");
            const projectLink = proj.link || "#";
            const isExternal = projectLink && projectLink.startsWith("http");

            return `
            <article class="work-card reveal visible" style="transition-delay: ${idx * 0.08}s">
              <div class="work-image">
                <img
                  src="${proj.image || "images/work-brand-identity.png"}"
                  alt="${proj.title || "Portfolio Project"}"
                  loading="lazy"
                />
                <a href="${projectLink}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""} class="work-overlay" aria-label="View ${proj.title}">
                  <span class="work-overlay-text"
                    >View Project
                    <i class="fa-solid fa-arrow-up-right-from-square"></i
                  ></span>
                </a>
              </div>
              <div class="work-content">
                <div class="work-tags">${tagHtml}</div>
                <h3>
                  ${projectLink && projectLink !== "#" ? `<a href="${projectLink}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""} style="color: inherit; text-decoration: none;">${proj.title}</a>` : proj.title}
                </h3>
                <p>${proj.description || ""}</p>
              </div>
            </article>`;
          })
          .join("");
      }
    }
  }

  // =========================================================
  // 2. ENHANCED PRELOADER (0% → 100% counter)
  // =========================================================
  const loader = document.getElementById("loader");
  const loaderCounter = document.getElementById("loader-counter");
  const loaderBarFill = document.getElementById("loader-bar-fill");

  if (loader && loaderCounter && loaderBarFill) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 3;
      if (progress > 100) progress = 100;

      const rounded = Math.floor(progress);
      loaderCounter.textContent = rounded + "%";
      loaderBarFill.style.width = rounded + "%";

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add("hidden");
        }, 400);
      }
    }, 80);
  }

  // =========================================================
  // 3. NAVIGATION SCROLL EFFECT
  // =========================================================
  const nav = document.getElementById("navbar");
  if (nav) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 40) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
      },
      { passive: true },
    );
  }

  // =========================================================
  // 4. ACTIVE NAV LINK TRACKING
  // =========================================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === "#" + id) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-80px 0px -40% 0px",
      },
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // =========================================================
  // 5. MOBILE HAMBURGER MENU
  // =========================================================
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open")
        ? "hidden"
        : "";
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // =========================================================
  // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
  // =========================================================
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // =========================================================
  // 7. CURSOR GLOW (FINE POINTERS ONLY)
  // =========================================================
  const cursorGlow = document.querySelector(".cursor-glow");
  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      },
      { passive: true },
    );

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // =========================================================
  // 8. HERO PHOTO CARD 3D PERSPECTIVE TILT
  // =========================================================
  const photoCard = document.querySelector(".photo-card");
  if (photoCard && window.matchMedia("(pointer: fine)").matches) {
    const photo = photoCard.querySelector("img");

    photoCard.addEventListener("mousemove", (e) => {
      const rect = photoCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      photoCard.style.transform = `
        perspective(900px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-10px)
        scale(1.015)
      `;

      if (photo) {
        const moveX = ((x - centerX) / centerX) * 8;
        const moveY = ((y - centerY) / centerY) * 8;

        photo.style.transform = `
          scale(1.09)
          translate(${moveX}px, ${moveY}px)
        `;
      }
    });

    photoCard.addEventListener("mouseleave", () => {
      photoCard.style.transform = "";
      if (photo) {
        photo.style.transform = "";
      }
    });
  }

  // =========================================================
  // 9. WORK CARDS 3D HOVER TILT
  // =========================================================
  const workCards = document.querySelectorAll(".work-card");
  if (window.matchMedia("(pointer: fine)").matches) {
    workCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `
          perspective(900px)
          rotateY(${x * 4}deg)
          rotateX(${y * -4}deg)
          translateY(-8px)
        `;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });
  }

  // =========================================================
  // 10. MAGNETIC BUTTONS
  // =========================================================
  const magneticButtons = document.querySelectorAll(
    ".button-primary, .nav-contact",
  );
  if (window.matchMedia("(pointer: fine)").matches) {
    magneticButtons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const moveX = e.clientX - rect.left - rect.width / 2;
        const moveY = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${moveX * 0.12}px, ${moveY * 0.12}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // =========================================================
  // 11. SMOOTH ANCHOR LINK SCROLLING
  // =========================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // =========================================================
  // 12. SKILLS TAGS STAGGERING
  // =========================================================
  function staggerSkillTags() {
    const skills = document.querySelectorAll(".skill");
    skills.forEach((skill, index) => {
      skill.style.transitionDelay = `${index * 35}ms`;
    });
  }
  staggerSkillTags();

  // =========================================================
  // 13. DYNAMIC COPYRIGHT YEAR
  // =========================================================
  const currentYear = new Date().getFullYear();
  document.querySelectorAll("footer").forEach((footer) => {
    footer.innerHTML = footer.innerHTML.replace("2026", currentYear);
  });

  // =========================================================
  // 14. ROTATING TAGLINE (TYPEWRITER EFFECT)
  // =========================================================
  const taglineText = document.getElementById("tagline-text");
  if (taglineText) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 90;
    const deleteSpeed = 45;
    const holdTime = 1800;
    const pauseBeforeType = 400;

    taglineText.textContent = "";

    function typeWriter() {
      const phrases =
        currentTaglines.length > 0 ? currentTaglines : ["Graphic Designer"];
      const currentPhrase = phrases[phraseIndex % phrases.length];

      if (isDeleting) {
        taglineText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        taglineText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        timeout = holdTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timeout = pauseBeforeType;
      }

      setTimeout(typeWriter, timeout);
    }

    // Start typing after initial load animation
    setTimeout(typeWriter, 600);
  }

  // =========================================================
  // 15. SCROLL PROGRESS INDICATOR
  // =========================================================
  const scrollProgress = document.getElementById("scroll-progress");
  if (scrollProgress) {
    window.addEventListener(
      "scroll",
      () => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + "%";
      },
      { passive: true },
    );
  }

  // =========================================================
  // 16. BACK TO TOP BUTTON
  // =========================================================
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > window.innerHeight) {
          backToTop.classList.add("visible");
        } else {
          backToTop.classList.remove("visible");
        }
      },
      { passive: true },
    );

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =========================================================
  // 17. COUNTER ANIMATION FOR STATS
  // =========================================================
  function observeStatsCounters() {
    const stats = document.querySelectorAll(".stat");
    if (stats.length > 0) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const statEl = entry.target;
              const numberEl = statEl.querySelector(".stat-number");
              const target = parseInt(statEl.dataset.target, 10);

              if (numberEl && !isNaN(target)) {
                animateCounter(numberEl, target);
              }

              counterObserver.unobserve(statEl);
            }
          });
        },
        { threshold: 0.5 },
      );

      stats.forEach((stat) => counterObserver.observe(stat));
    }
  }
  observeStatsCounters();

  function animateCounter(element, target) {
    let current = 0;
    const duration = 1500;
    const step = Math.max(1, target / (duration / 16));

    function update() {
      current += step;
      if (current >= target) {
        element.textContent = target;
        return;
      }
      element.textContent = Math.floor(current);
      requestAnimationFrame(update);
    }
    update();
  }

  // =========================================================
  // 18. PARALLAX ON FLOATING SHAPES
  // =========================================================
  const floatingShape = document.querySelector(".floating-shape");
  const floatingCircle = document.querySelector(".floating-circle");
  const floatingSquare = document.querySelector(".floating-square");

  if (
    window.matchMedia("(pointer: fine)").matches &&
    (floatingShape || floatingCircle || floatingSquare)
  ) {
    window.addEventListener(
      "scroll",
      () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight * 1.5) {
          if (floatingShape) {
            floatingShape.style.transform = `rotate(-15deg) translateY(${scrollY * -0.08}px)`;
          }
          if (floatingCircle) {
            floatingCircle.style.transform = `translateY(${scrollY * 0.06}px)`;
          }
          if (floatingSquare) {
            floatingSquare.style.transform = `rotate(${20 + scrollY * 0.1}deg)`;
          }
        }
      },
      { passive: true },
    );
  }

  // =========================================================
  // 19. WEB3FORMS CONTACT FORM
  // =========================================================
  const contactForm = document.getElementById("contact-form");
  const submitButton = document.getElementById("submit-button");
  const formStatus = document.getElementById("form-status");
  const formCard = document.querySelector(".contact-form-card");

  if (contactForm && submitButton && formStatus && formCard) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      submitButton.classList.add("loading");
      const textSpan = submitButton.querySelector(".button-text");
      if (textSpan) textSpan.textContent = "Sending";

      formStatus.textContent = "";
      formStatus.className = "form-status";

      const formData = new FormData(contactForm);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          formStatus.textContent =
            "Message sent successfully! I'll get back to you soon.";
          formStatus.classList.add("success");
          formCard.classList.add("sent");

          if (textSpan) textSpan.textContent = "Message Sent ✓";
          contactForm.reset();

          setTimeout(() => {
            formCard.classList.remove("sent");
            if (textSpan) textSpan.textContent = "Send Message";
          }, 5000);
        } else {
          throw new Error(data.message || "Something went wrong.");
        }
      } catch (error) {
        console.error(error);
        formStatus.textContent =
          "Something went wrong. Please try again or email me directly.";
        formStatus.classList.add("error");
        if (textSpan) textSpan.textContent = "Try Again";
      }

      submitButton.classList.remove("loading");
    });
  }

  // =========================================================
  // 20. SECRET CMS SHORTCUT (Ctrl + Shift + C or Ctrl + Shift + A)
  // =========================================================
  window.addEventListener("keydown", (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      (e.key.toLowerCase() === "c" || e.key.toLowerCase() === "a")
    ) {
      e.preventDefault();
      window.location.href = "cms.html";
    }
  });
});

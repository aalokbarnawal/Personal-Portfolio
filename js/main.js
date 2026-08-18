/**
 * Aalok Barnawal — Personal Portfolio Scripts
 * Modular Vanilla JavaScript for interactive UI, animations, and forms.
 */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // 1. ENHANCED PRELOADER (0% → 100% counter)
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
  // 2. NAVIGATION SCROLL EFFECT
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
  // 3. ACTIVE NAV LINK TRACKING
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
  // 4. MOBILE HAMBURGER MENU
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
  // 5. SCROLL REVEAL (INTERSECTION OBSERVER)
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
  // 6. CURSOR GLOW (FINE POINTERS ONLY)
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
  // 7. HERO PHOTO CARD 3D PERSPECTIVE TILT
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
  // 8. WORK CARDS 3D HOVER TILT
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
  // 9. MAGNETIC BUTTONS
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
  // 10. SMOOTH ANCHOR LINK SCROLLING
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
  // 11. SKILLS TAGS STAGGERING
  // =========================================================
  const skills = document.querySelectorAll(".skill");
  skills.forEach((skill, index) => {
    skill.style.transitionDelay = `${index * 35}ms`;
  });

  // =========================================================
  // 12. DYNAMIC COPYRIGHT YEAR
  // =========================================================
  const currentYear = new Date().getFullYear();
  document.querySelectorAll("footer").forEach((footer) => {
    footer.innerHTML = footer.innerHTML.replace("2026", currentYear);
  });

  // =========================================================
  // 13. ROTATING TAGLINE (TYPEWRITER EFFECT)
  // =========================================================
  const taglineText = document.getElementById("tagline-text");
  if (taglineText) {
    const taglines = [
      "Graphic Designer",
      "Front-End Developer",
      "Brand Identity Creator",
      "Visual Storyteller",
      "Creative Thinker",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 90;
    const deleteSpeed = 45;
    const holdTime = 1800;
    const pauseBeforeType = 400;

    taglineText.textContent = "";

    function typeWriter() {
      const currentPhrase = taglines[phraseIndex];

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
        phraseIndex = (phraseIndex + 1) % taglines.length;
        timeout = pauseBeforeType;
      }

      setTimeout(typeWriter, timeout);
    }

    // Start typing after initial load animation
    setTimeout(typeWriter, 600);
  }

  // =========================================================
  // 14. SCROLL PROGRESS INDICATOR
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
  // 15. BACK TO TOP BUTTON
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
  // 16. COUNTER ANIMATION FOR STATS
  // =========================================================
  const stats = document.querySelectorAll(".stat");
  if (stats.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statEl = entry.target;
            const numberEl = statEl.querySelector(".stat-number");
            const target = parseInt(statEl.dataset.target, 10);

            if (numberEl && target) {
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

  function animateCounter(element, target) {
    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);

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
  // 17. PARALLAX ON FLOATING SHAPES
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
  // 18. WEB3FORMS CONTACT FORM
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
});

/**
 * Aalok Barnawal — Personal Portfolio Scripts
 * Modular Vanilla JavaScript for interactive UI, animations, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // 1. PRELOADER
  // =========================================================
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 700);
    });
  }

  // =========================================================
  // 2. NAVIGATION SCROLL EFFECT
  // =========================================================
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 40) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      },
      { passive: true }
    );
  }

  // =========================================================
  // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
  // =========================================================
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // =========================================================
  // 4. CURSOR GLOW (FINE POINTERS ONLY)
  // =========================================================
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    window.addEventListener(
      'mousemove',
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      },
      { passive: true }
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
  // 5. HERO PHOTO CARD 3D PERSPECTIVE TILT
  // =========================================================
  const photoCard = document.querySelector('.photo-card');
  if (photoCard && window.matchMedia('(pointer: fine)').matches) {
    const photo = photoCard.querySelector('img');

    photoCard.addEventListener('mousemove', (e) => {
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

    photoCard.addEventListener('mouseleave', () => {
      photoCard.style.transform = '';
      if (photo) {
        photo.style.transform = '';
      }
    });
  }

  // =========================================================
  // 6. WORK CARDS 3D HOVER TILT
  // =========================================================
  const workCards = document.querySelectorAll('.work-card');
  if (window.matchMedia('(pointer: fine)').matches) {
    workCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
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

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }

  // =========================================================
  // 7. MAGNETIC BUTTONS
  // =========================================================
  const magneticButtons = document.querySelectorAll(
    '.button-primary, .nav-contact'
  );
  if (window.matchMedia('(pointer: fine)').matches) {
    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const moveX = e.clientX - rect.left - rect.width / 2;
        const moveY = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${moveX * 0.12}px, ${moveY * 0.12}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // =========================================================
  // 8. SMOOTH ANCHOR LINK SCROLLING
  // =========================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =========================================================
  // 9. SKILLS TAGS STAGGERING
  // =========================================================
  const skills = document.querySelectorAll('.skill');
  skills.forEach((skill, index) => {
    skill.style.transitionDelay = `${index * 35}ms`;
  });

  // =========================================================
  // 10. DYNAMIC COPYRIGHT YEAR
  // =========================================================
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('footer').forEach((footer) => {
    footer.innerHTML = footer.innerHTML.replace('2026', currentYear);
  });

  // =========================================================
  // 11. WEB3FORMS CONTACT FORM
  // =========================================================
  const contactForm = document.getElementById('contact-form');
  const submitButton = document.getElementById('submit-button');
  const formStatus = document.getElementById('form-status');
  const formCard = document.querySelector('.contact-form-card');

  if (contactForm && submitButton && formStatus && formCard) {
    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      submitButton.classList.add('loading');
      const textSpan = submitButton.querySelector('.button-text');
      if (textSpan) textSpan.textContent = 'Sending';

      formStatus.textContent = '';
      formStatus.className = 'form-status';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          formStatus.textContent =
            "Message sent successfully! I'll get back to you soon.";
          formStatus.classList.add('success');
          formCard.classList.add('sent');

          if (textSpan) textSpan.textContent = 'Message Sent ✓';
          contactForm.reset();

          setTimeout(() => {
            formCard.classList.remove('sent');
            if (textSpan) textSpan.textContent = 'Send Message';
          }, 5000);
        } else {
          throw new Error(data.message || 'Something went wrong.');
        }
      } catch (error) {
        console.error(error);
        formStatus.textContent =
          'Something went wrong. Please try again or email me directly.';
        formStatus.classList.add('error');
        if (textSpan) textSpan.textContent = 'Try Again';
      }

      submitButton.classList.remove('loading');
    });
  }
});

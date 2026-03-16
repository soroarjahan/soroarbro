/**
 * Soroar Jahan – Portfolio Website
 * script.js – Interactivity, animations, EmailJS & Cal.com integration
 */

'use strict';

/* ================================================================
   EMAILJS CONFIGURATION
   Replace with your actual EmailJS credentials:
   - publicKey:   Your EmailJS public key (from Dashboard > Account)
   - serviceId:   Your EmailJS service ID (from Email Services)
   - templateId:  Your EmailJS template ID (from Email Templates)
   ================================================================ */
const EMAILJS_CONFIG = {
  publicKey:  'YOUR_EMAILJS_PUBLIC_KEY',
  serviceId:  'YOUR_EMAILJS_SERVICE_ID',
  templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
};

/* ================================================================
   CAL.COM CONFIGURATION
   Replace 'soroarjahan' with your actual Cal.com username/link.
   ================================================================ */
const CALCOM_USERNAME = 'soroarjahan';

/* ================================================================
   UTILITY HELPERS
   ================================================================ */

/** Shorthand querySelector */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/** Debounce */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Show a toast notification */
function showToast(message, type = 'success') {
  const toast = $('#toast');
  if (!toast) return;
  const icon = toast.querySelector('.toast-icon');
  const msg = toast.querySelector('.toast-message');

  msg.textContent = message;
  toast.classList.remove('error', 'show');

  if (type === 'error') {
    icon.className = 'fas fa-exclamation-circle toast-icon';
    toast.classList.add('error');
  } else {
    icon.className = 'fas fa-check-circle toast-icon';
  }

  // Trigger reflow so re-adding 'show' works
  void toast.offsetWidth;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 4000);
}

/** Smooth scroll to a section */
function scrollToSection(selector) {
  const target = $(selector);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
// Expose globally so inline onclick attributes can call it
window.scrollToSection = scrollToSection;

/* ================================================================
   PRELOADER
   ================================================================ */
function initPreloader() {
  const preloader = $('#preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // After fade out, ensure body is scrollable
      document.body.style.overflow = '';
    }, 500);
  });

  // Failsafe: hide after 3s regardless
  setTimeout(() => preloader.classList.add('hidden'), 3000);
}

/* ================================================================
   NAVIGATION
   ================================================================ */
function initNavigation() {
  const navbar  = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#nav-links');
  const overlay   = $('#mobile-menu-overlay');
  const links     = $$('.nav-link');

  if (!navbar) return;

  /* Scroll: add .scrolled class */
  const onScroll = debounce(() => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    updateActiveNavLink();
    updateScrollTopBtn();
  }, 10);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile hamburger toggle */
  function closeMobileMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navLinks.classList.toggle('open', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.addEventListener('click', closeMobileMenu);

  /* Close on nav link click (mobile) */
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  /* Active section highlight */
  function updateActiveNavLink() {
    const sections = $$('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = $(`.nav-link[href="#${id}"]`);
      if (!link) return;

      if (scrollPos >= top && scrollPos < bottom) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
}

/* ================================================================
   SCROLL-TO-TOP BUTTON
   ================================================================ */
function updateScrollTopBtn() {
  const btn = $('#scroll-top-btn');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

function initScrollTopBtn() {
  const btn = $('#scroll-top-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================================
   SCROLL REVEAL ANIMATIONS
   ================================================================ */
function initScrollReveal() {
  const elements = $$('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  // Add staggered delay to grid children
  $$('.skills-grid, .projects-grid').forEach(grid => {
    const children = $$('.reveal-fade-up', grid);
    children.forEach((child, i) => {
      const delay = ((i % 6) + 1);
      child.classList.add(`stagger-${Math.min(delay, 6)}`);
    });
  });

  elements.forEach(el => observer.observe(el));
}

/* ================================================================
   HERO: PARTICLES
   ================================================================ */
function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const count = window.innerWidth < 600 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size   = Math.random() * 4 + 2;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 15;
    const dur    = Math.random() * 15 + 10;
    const colors = ['#6366f1', '#818cf8', '#06b6d4', '#22d3ee', '#a78bfa'];
    const color  = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    `;

    container.appendChild(particle);
  }
}

/* ================================================================
   HERO: TYPEWRITER EFFECT
   ================================================================ */
function initTypewriter() {
  const el = $('#dynamic-text');
  if (!el) return;

  const phrases = [
    'Scalable Web Apps',
    'Beautiful UI/UX',
    'RESTful APIs',
    'Mobile Experiences',
    'Cloud Solutions',
    'Your Next Project',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const phrase = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = phrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      el.textContent = phrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === phrase.length) {
      typingSpeed = 1800; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400; // pause before next phrase
    }

    setTimeout(type, typingSpeed);
  }

  // Start after a small delay
  setTimeout(type, 1000);
}

/* ================================================================
   HERO: COUNTER ANIMATION
   ================================================================ */
function initCounters() {
  const counters = $$('.stat-number');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const dur    = 1500;
        const step   = target / (dur / 16);
        let current  = 0;

        function tick() {
          current = Math.min(current + step, target);
          el.textContent = Math.round(current);
          if (current < target) {
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

/* ================================================================
   SKILLS: PROGRESS BARS & CATEGORY FILTER
   ================================================================ */
function initSkills() {
  /* Animate bars on intersection */
  const bars = $$('.skill-bar');

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bar   = entry.target;
        const fill  = bar.querySelector('.skill-bar-fill');
        const level = bar.dataset.level;
        fill.style.width = `${level}%`;
        barObserver.unobserve(bar);
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => barObserver.observe(bar));

  /* Category filter */
  const catBtns = $$('.skill-cat-btn');

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      $$('.skill-card').forEach(card => {
        const cardCat = card.dataset.category;
        const hide    = cat !== 'all' && cardCat !== cat;

        if (hide) {
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => card.classList.add('hidden'), 250);
        } else {
          card.classList.remove('hidden');
          // Force reflow
          void card.offsetWidth;
          card.style.opacity   = '1';
          card.style.transform = '';
        }
      });
    });
  });
}

/* ================================================================
   PROJECTS: FILTER
   ================================================================ */
function initProjectFilter() {
  const filterBtns = $$('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      $$('.project-card').forEach(card => {
        const type = card.dataset.type;
        const hide = filter !== 'all' && type !== filter;

        if (hide) {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => card.classList.add('hidden'), 300);
        } else {
          card.classList.remove('hidden');
          void card.offsetWidth;
          card.style.opacity   = '1';
          card.style.transform = '';
        }
      });
    });
  });
}

/* ================================================================
   TESTIMONIALS: SLIDER
   ================================================================ */
function initTestimonials() {
  const track      = $('#testimonials-track');
  const prevBtn    = $('#testi-prev');
  const nextBtn    = $('#testi-next');
  const dotsWrap   = $('#testi-dots');

  if (!track) return;

  const cards = $$('.testimonial-card', track);
  let current  = 0;
  let autoplayTimer;

  // Determine how many cards visible at once
  function getVisible() {
    return window.innerWidth >= 900 ? 2 : 1;
  }

  function maxIndex() {
    return cards.length - getVisible();
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.classList.add('testi-dot');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    $$('.testi-dot', dotsWrap).forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const pct = (current / cards.length) * 100;
    track.style.transform = `translateX(-${pct}%)`;

    updateDots();
  }

  function next() {
    goTo(current >= maxIndex() ? 0 : current + 1);
    resetAutoplay();
  }

  function prev() {
    goTo(current <= 0 ? maxIndex() : current - 1);
    resetAutoplay();
  }

  function startAutoplay() {
    autoplayTimer = setInterval(next, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Adapt track width to hold all cards inline
  track.style.display  = 'flex';
  track.style.width    = `${(cards.length / getVisible()) * 100}%`;
  cards.forEach(c => {
    c.style.flex = `0 0 ${100 / cards.length}%`;
  });

  buildDots();
  startAutoplay();

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  }, { passive: true });

  // Rebuild on resize
  window.addEventListener('resize', debounce(() => {
    track.style.width = `${(cards.length / getVisible()) * 100}%`;
    buildDots();
    goTo(Math.min(current, maxIndex()));
  }, 200));
}

/* ================================================================
   CAL.COM EMBED
   ================================================================ */
function initCalCom() {
  const container = $('#cal-inline-container');
  if (!container) return;

  // Check if Cal.com embed script is loaded and initialize
  function loadCalEmbed() {
    // Load Cal.com embed script
    const script = document.createElement('script');
    script.src   = 'https://app.cal.com/embed/embed.js';
    script.async = true;

    script.onload = () => {
      if (typeof window.Cal !== 'undefined') {
        window.Cal('inline', {
          elementOrSelector: '#cal-inline-container',
          calLink: CALCOM_USERNAME,
          config: {
            layout: 'month_view',
          },
        });
        // Hide placeholder
        const placeholder = container.querySelector('.cal-placeholder');
        if (placeholder) placeholder.style.display = 'none';
      }
    };

    script.onerror = () => {
      // If embed fails, leave the fallback button visible
      console.warn('Cal.com embed failed to load. Showing fallback link.');
    };

    document.head.appendChild(script);
  }

  // Only load when section is visible (IntersectionObserver)
  const scheduleSection = $('#schedule');
  if (scheduleSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadCalEmbed();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(scheduleSection);
  } else {
    loadCalEmbed();
  }
}

/* ================================================================
   CONTACT FORM VALIDATION & EMAILJS
   ================================================================ */
function initContactForm() {
  const form       = $('#contact-form');
  const submitBtn  = $('#submit-btn');
  const successDiv = $('#form-success');
  const sendAgain  = $('#send-another-btn');
  const charCount  = $('#char-count');
  const messageTA  = $('#message');

  if (!form) return;

  /* Initialize EmailJS */
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }

  /* Character counter */
  if (messageTA && charCount) {
    messageTA.addEventListener('input', () => {
      const len = messageTA.value.length;
      charCount.textContent = len;
      charCount.style.color = len > 900
        ? 'var(--color-warning)'
        : len >= 1000
          ? 'var(--color-error)'
          : '';

      // Enforce max
      if (len > 1000) {
        messageTA.value = messageTA.value.substring(0, 1000);
        charCount.textContent = 1000;
      }
    });
  }

  /* Validation rules */
  const rules = {
    name: {
      validate: v => v.trim().length >= 2,
      message:  'Please enter your full name (min 2 characters).',
    },
    email: {
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message:  'Please enter a valid email address.',
    },
    subject: {
      validate: v => v.trim().length >= 3,
      message:  'Please enter a subject (min 3 characters).',
    },
    message: {
      validate: v => v.trim().length >= 10,
      message:  'Please enter a message (min 10 characters).',
    },
  };

  /* Show / clear error for a field */
  function setFieldState(fieldId, isValid, message = '') {
    const input = $(`#${fieldId}`);
    const error = $(`#${fieldId}-error`);
    if (!input) return;

    const group = input.closest('.form-group');
    if (!group) return;

    group.classList.toggle('error',   !isValid);
    group.classList.toggle('success', isValid && input.value.trim() !== '');

    if (error) error.textContent = isValid ? '' : message;
  }

  /* Validate all fields, return true if all pass */
  function validateForm() {
    let valid = true;

    Object.entries(rules).forEach(([id, rule]) => {
      const input = $(`#${id}`);
      if (!input) return;
      const isValid = rule.validate(input.value);
      setFieldState(id, isValid, rule.message);
      if (!isValid) valid = false;
    });

    return valid;
  }

  /* Real-time validation on blur */
  Object.keys(rules).forEach(id => {
    const input = $(`#${id}`);
    if (!input) return;

    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        const isValid = rules[id].validate(input.value);
        setFieldState(id, isValid, rules[id].message);
      }
    });

    input.addEventListener('input', () => {
      // Clear error once user starts typing
      const error = $(`#${id}-error`);
      if (error && error.textContent) {
        const isValid = rules[id].validate(input.value);
        setFieldState(id, isValid, rules[id].message);
      }
    });
  });

  /* Submit */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus first invalid field
      const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }

    /* Set loading state */
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.hidden    = true;
    btnLoading.hidden = false;
    submitBtn.disabled = true;

    const templateParams = {
      from_name:  $('#name').value.trim(),
      from_email: $('#email').value.trim(),
      subject:    $('#subject').value.trim(),
      budget:     $('#budget').value || 'Not specified',
      message:    messageTA.value.trim(),
      reply_to:   $('#email').value.trim(),
    };

    try {
      if (
        typeof emailjs !== 'undefined' &&
        EMAILJS_CONFIG.publicKey  !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
        EMAILJS_CONFIG.serviceId  !== 'YOUR_EMAILJS_SERVICE_ID' &&
        EMAILJS_CONFIG.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID'
      ) {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          templateParams
        );
      } else {
        // Demo mode: simulate send delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.info('EmailJS not configured. Form data:', templateParams);
      }

      /* Show success */
      form.hidden        = true;
      successDiv.hidden  = false;
      showToast('Message sent successfully! I\'ll be in touch soon.');

    } catch (err) {
      console.error('EmailJS error:', err);
      showToast('Failed to send message. Please try again or email me directly.', 'error');
    } finally {
      btnText.hidden    = false;
      btnLoading.hidden = true;
      submitBtn.disabled = false;
    }
  });

  /* "Send Another" button */
  if (sendAgain) {
    sendAgain.addEventListener('click', () => {
      form.reset();
      form.hidden       = false;
      successDiv.hidden = true;
      if (charCount) charCount.textContent = '0';
      $$('.form-group', form).forEach(g => {
        g.classList.remove('error', 'success');
      });
      $$('.field-error', form).forEach(e => { e.textContent = ''; });
    });
  }
}

/* ================================================================
   NEWSLETTER FORM
   ================================================================ */
function initNewsletter() {
  const form = $('#newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      showToast('Thanks for subscribing!');
      form.reset();
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  });
}

/* ================================================================
   MICRO-INTERACTIONS
   ================================================================ */
function initMicroInteractions() {
  /* Button ripple effect */
  $$('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Don't add ripple to submit button during loading state
      if (this.disabled) return;

      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-anim 0.6s linear;
        pointer-events: none;
        z-index: 10;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* Inject ripple keyframe */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* Magnetic effect for nav logo */
  const logo = $('.nav-logo');
  if (logo) {
    logo.addEventListener('mousemove', (e) => {
      const rect = logo.getBoundingClientRect();
      const x    = (e.clientX - rect.left - rect.width  / 2) * 0.15;
      const y    = (e.clientY - rect.top  - rect.height / 2) * 0.15;
      logo.style.transform = `translate(${x}px, ${y}px)`;
    });
    logo.addEventListener('mouseleave', () => {
      logo.style.transform = '';
    });
  }

  /* Tilt effect for project cards */
  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    });
  });

  /* Active link click feedback */
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => { this.style.transform = ''; }, 150);
    });
  });

  /* Hover glow on contact info cards */
  $$('.contact-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '4px 0 20px rgba(99, 102, 241, 0.1)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
}

/* ================================================================
   FOOTER: CURRENT YEAR
   ================================================================ */
function initFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ================================================================
   SMOOTH ANCHOR LINKS
   ================================================================ */
function initSmoothAnchors() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = $(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ================================================================
   INTERSECTION OBSERVER POLYFILL CHECK
   ================================================================ */
function checkIntersectionObserver() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all hidden elements immediately
    $$('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right').forEach(el => {
      el.classList.add('visible');
    });
    $$('.skill-bar-fill').forEach(fill => {
      const level = fill.parentElement.dataset.level;
      fill.style.width = `${level}%`;
    });
  }
}

/* ================================================================
   INIT – RUN ALL MODULES
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  checkIntersectionObserver();
  initPreloader();
  initNavigation();
  initScrollTopBtn();
  initScrollReveal();
  initParticles();
  initTypewriter();
  initCounters();
  initSkills();
  initProjectFilter();
  initTestimonials();
  initCalCom();
  initContactForm();
  initNewsletter();
  initMicroInteractions();
  initFooterYear();
  initSmoothAnchors();
});

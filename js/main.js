/* ============================================
   Dynamic Collision Repair - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initFAQ();
  initScrollToTop();
  initSmoothScroll();
  initParallax();
});

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  // Sticky header scroll effect
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });

    // Close nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  }
}

/* ============================================
   Scroll-Triggered Animations
   ============================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.fade-in-up, .fade-in-left, .fade-in-right, .slide-in'
  );

  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

/* ============================================
   FAQ Accordion
   ============================================ */
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const answer = question.nextElementSibling;
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQ items
      document.querySelectorAll('.faq-item.active').forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        faqItem.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================
   Scroll To Top Button
   ============================================ */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-top');

  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/* ============================================
   Smooth Scroll for Anchor Links
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

/* ============================================
   Parallax Effect for Hero
   ============================================ */
function initParallax() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      hero.style.backgroundPositionY = `${scrolled * 0.4}px`;
    }
  });
}

/* ============================================
   Animated Counters (for stats)
   ============================================ */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-count'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + suffix;
      }
    };

    updateCounter();
  });
}

// Trigger counter animation when trust bar is visible
const trustBar = document.querySelector('.trust-bar');
if (trustBar) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterObserver.observe(trustBar);
}

/* ============================================
   Contact Form Validation
   ============================================ */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    let isValid = true;

    // Simple validation
    if (name && !name.value.trim()) {
      name.classList.add('error');
      isValid = false;
    } else if (name) {
      name.classList.remove('error');
    }

    if (email && !email.value.trim()) {
      email.classList.add('error');
      isValid = false;
    } else if (email && !isValidEmail(email.value)) {
      email.classList.add('error');
      isValid = false;
    } else if (email) {
      email.classList.remove('error');
    }

    if (isValid) {
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.classList.add('sent');
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.textContent = 'Send Message';
          submitBtn.classList.remove('sent');
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================
   Active Nav Link Highlighting
   ============================================ */
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

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
  initModals();
  initQuoteWizard();
});

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
  const header = document.getElementById('header') || document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links') || document.getElementById('navLinks');
  const mobileMenu = document.getElementById('mobileMenu');
  
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
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      hamburger.classList.toggle('active');

      if (navLinks) {
        navLinks.classList.toggle('active');
      }
      if (mobileMenu) {
        mobileMenu.classList.toggle('open');
      }
      document.body.classList.toggle('nav-open');

      const isExpanded = hamburger.classList.contains('open') || hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded);
    });

    const closeMenu = () => {
      hamburger.classList.remove('open', 'active');
      if (navLinks) navLinks.classList.remove('active');
      if (mobileMenu) mobileMenu.classList.remove('open');
      document.body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    // Close nav when clicking a link
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    }
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    }

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      const clickedNav = navLinks && navLinks.contains(e.target);
      const clickedMobileMenu = mobileMenu && mobileMenu.contains(e.target);
      const clickedHam = hamburger.contains(e.target);

      if (!clickedHam && !clickedNav && !clickedMobileMenu) {
        closeMenu();
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

/* ============================================
   Modals Controller (Registration & Quote Wizard)
   ============================================ */
function initModals() {
  const modalOpenTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    const anyActive = document.querySelector('.modal-backdrop.active');
    if (!anyActive) {
      document.body.style.overflow = '';
    }
  };

  modalOpenTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = trigger.getAttribute('data-modal-target');
      openModal(targetModalId);
    });
  });

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = btn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  modalBackdrops.forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });

  // Customer Registration Form Submission
  const regForm = document.getElementById('customerRegistrationForm');
  const regSuccessAlert = document.getElementById('registerSuccessAlert');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstName = document.getElementById('regFirstName');
      const lastName = document.getElementById('regLastName');
      const phone = document.getElementById('regPhone');
      const email = document.getElementById('regEmail');

      let valid = true;
      [firstName, lastName, phone].forEach((input) => {
        if (input && !input.value.trim()) {
          input.classList.add('error');
          valid = false;
        } else if (input) {
          input.classList.remove('error');
        }
      });

      if (email && (!email.value.trim() || !isValidEmail(email.value))) {
        email.classList.add('error');
        valid = false;
      } else if (email) {
        email.classList.remove('error');
      }

      if (!valid) return;

      const regData = {
        firstName: firstName ? firstName.value.trim() : '',
        lastName: lastName ? lastName.value.trim() : '',
        phone: phone ? phone.value.trim() : '',
        email: email ? email.value.trim() : '',
        year: document.getElementById('regYear') ? document.getElementById('regYear').value.trim() : '',
        make: document.getElementById('regMake') ? document.getElementById('regMake').value.trim() : '',
        model: document.getElementById('regModel') ? document.getElementById('regModel').value.trim() : '',
        vin: document.getElementById('regVin') ? document.getElementById('regVin').value.trim() : '',
        registeredAt: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('dynamic_collision_registrations') || '[]');
        stored.push(regData);
        localStorage.setItem('dynamic_collision_registrations', JSON.stringify(stored));
      } catch (err) {
        console.warn('LocalStorage unavailable:', err);
      }

      const submitBtn = document.getElementById('regSubmitBtn');
      if (submitBtn) {
        submitBtn.textContent = 'Registered! ✓';
        submitBtn.disabled = true;
      }

      if (regSuccessAlert) {
        regSuccessAlert.style.display = 'flex';
      }

      setTimeout(() => {
        regForm.reset();
        if (regSuccessAlert) regSuccessAlert.style.display = 'none';
        if (submitBtn) {
          submitBtn.textContent = 'Complete Registration';
          submitBtn.disabled = false;
        }
        closeModal(document.getElementById('registerModal'));
      }, 3500);
    });
  }
}

/* ============================================
   Quote Request Interactive Flowchart Wizard
   ============================================ */
function initQuoteWizard() {
  const wizardForm = document.getElementById('quoteWizardForm');
  if (!wizardForm) return;

  const quoteModal = document.getElementById('quoteModal');
  const progressBar = document.getElementById('wizardProgressBar');
  const quoteSuccessAlert = document.getElementById('quoteSuccessAlert');

  let currentStep = 1;
  const totalSteps = 4;

  const steps = {
    1: document.getElementById('wizardStep1'),
    2: document.getElementById('wizardStep2'),
    3: document.getElementById('wizardStep3'),
    4: document.getElementById('wizardStep4')
  };

  const stepNodes = {
    1: document.getElementById('stepNode1'),
    2: document.getElementById('stepNode2'),
    3: document.getElementById('stepNode3'),
    4: document.getElementById('stepNode4')
  };

  // State object tracking selections
  const wizardState = {
    payType: '',
    insuranceCompany: '',
    insFault: '',
    selfpayFault: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    notes: '',
    vin: '',
    photos: {}
  };

  const updateProgressUI = () => {
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    for (let i = 1; i <= totalSteps; i++) {
      const node = stepNodes[i];
      if (!node) continue;
      if (i < currentStep) {
        node.className = 'wizard-step-node completed';
        node.innerHTML = '✓';
      } else if (i === currentStep) {
        node.className = 'wizard-step-node active';
        node.textContent = i;
      } else {
        node.className = 'wizard-step-node';
        node.textContent = i;
      }
    }

    Object.keys(steps).forEach((stepNum) => {
      const pane = steps[stepNum];
      if (pane) {
        if (parseInt(stepNum) === currentStep) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      }
    });

    const modalWindow = quoteModal ? quoteModal.querySelector('.modal-window') : null;
    if (modalWindow) modalWindow.scrollTop = 0;
  };

  // --- Step 1: Payment Type (Insurance vs Self-Pay) ---
  const step1NextBtn = document.getElementById('step1NextBtn');
  const flowPayTypeInput = document.getElementById('flowPayType');
  const payTypeCards = document.querySelectorAll('[data-choice-group="payType"]');

  payTypeCards.forEach((card) => {
    const selectCard = () => {
      payTypeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const val = card.getAttribute('data-choice-value');
      wizardState.payType = val;
      if (flowPayTypeInput) flowPayTypeInput.value = val;
      if (step1NextBtn) step1NextBtn.disabled = false;
    };

    card.addEventListener('click', selectCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCard();
      }
    });
  });

  if (step1NextBtn) {
    step1NextBtn.addEventListener('click', () => {
      if (!wizardState.payType) return;
      currentStep = 2;
      setupStep2Branch();
      updateProgressUI();
    });
  }

  // --- Step 2: Branch Setup ---
  const branchInsurance = document.getElementById('branchInsurance');
  const branchSelfpay = document.getElementById('branchSelfpay');
  const step2NextBtn = document.getElementById('step2NextBtn');
  const step2BackBtn = document.getElementById('step2BackBtn');
  const insCompanyInput = document.getElementById('insCompany');
  const insFaultCards = document.querySelectorAll('[data-choice-group="insFault"]');
  const selfpayCards = document.querySelectorAll('[data-choice-group="selfpayFault"]');

  function setupStep2Branch() {
    if (wizardState.payType === 'insurance') {
      if (branchInsurance) branchInsurance.style.display = 'block';
      if (branchSelfpay) branchSelfpay.style.display = 'none';
      checkStep2InsuranceValidity();
    } else {
      if (branchInsurance) branchInsurance.style.display = 'none';
      if (branchSelfpay) branchSelfpay.style.display = 'block';
      checkStep2SelfpayValidity();
    }
  }

  function checkStep2InsuranceValidity() {
    const hasCompany = insCompanyInput && insCompanyInput.value.trim().length > 0;
    const hasFault = !!wizardState.insFault;
    if (step2NextBtn) {
      step2NextBtn.disabled = !(hasCompany && hasFault);
    }
  }

  function checkStep2SelfpayValidity() {
    if (step2NextBtn) {
      step2NextBtn.disabled = !wizardState.selfpayFault;
    }
  }

  if (insCompanyInput) {
    insCompanyInput.addEventListener('input', () => {
      wizardState.insuranceCompany = insCompanyInput.value.trim();
      checkStep2InsuranceValidity();
    });
  }

  insFaultCards.forEach((card) => {
    const selectCard = () => {
      insFaultCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const val = card.getAttribute('data-choice-value');
      wizardState.insFault = val;
      const input = document.getElementById('flowInsFault');
      if (input) input.value = val;
      checkStep2InsuranceValidity();
    };
    card.addEventListener('click', selectCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCard();
      }
    });
  });

  selfpayCards.forEach((card) => {
    const selectCard = () => {
      selfpayCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const val = card.getAttribute('data-choice-value');
      wizardState.selfpayFault = val;
      const input = document.getElementById('flowSelfpayFault');
      if (input) input.value = val;
      checkStep2SelfpayValidity();
    };
    card.addEventListener('click', selectCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCard();
      }
    });
  });

  if (step2BackBtn) {
    step2BackBtn.addEventListener('click', () => {
      currentStep = 1;
      updateProgressUI();
    });
  }

  if (step2NextBtn) {
    step2NextBtn.addEventListener('click', () => {
      currentStep = 3;
      updateProgressUI();
    });
  }

  // --- Step 3: Info Form ---
  const step3BackBtn = document.getElementById('step3BackBtn');
  const step3NextBtn = document.getElementById('step3NextBtn');
  const quoteFirstName = document.getElementById('quoteFirstName');
  const quoteLastName = document.getElementById('quoteLastName');
  const quotePhone = document.getElementById('quotePhone');
  const quoteEmail = document.getElementById('quoteEmail');
  const quoteNotes = document.getElementById('quoteNotes');

  if (step3BackBtn) {
    step3BackBtn.addEventListener('click', () => {
      currentStep = 2;
      updateProgressUI();
    });
  }

  if (step3NextBtn) {
    step3NextBtn.addEventListener('click', () => {
      let valid = true;
      [quoteFirstName, quoteLastName, quotePhone].forEach((input) => {
        if (input && !input.value.trim()) {
          input.classList.add('error');
          valid = false;
        } else if (input) {
          input.classList.remove('error');
        }
      });

      if (quoteEmail && (!quoteEmail.value.trim() || !isValidEmail(quoteEmail.value))) {
        quoteEmail.classList.add('error');
        valid = false;
      } else if (quoteEmail) {
        quoteEmail.classList.remove('error');
      }

      if (!valid) return;

      wizardState.firstName = quoteFirstName.value.trim();
      wizardState.lastName = quoteLastName.value.trim();
      wizardState.phone = quotePhone.value.trim();
      wizardState.email = quoteEmail.value.trim();
      wizardState.notes = quoteNotes ? quoteNotes.value.trim() : '';

      currentStep = 4;
      updateProgressUI();
    });
  }

  // --- Step 4: Photo Uploads & VIN ---
  const step4BackBtn = document.getElementById('step4BackBtn');
  const quoteVin = document.getElementById('quoteVin');
  const quoteSubmitBtn = document.getElementById('quoteSubmitBtn');
  const photoSlots = document.querySelectorAll('.photo-slot');

  if (step4BackBtn) {
    step4BackBtn.addEventListener('click', () => {
      currentStep = 3;
      updateProgressUI();
    });
  }

  // Setup photo slots
  photoSlots.forEach((slot) => {
    const slotKey = slot.getAttribute('data-slot');
    const fileInput = slot.querySelector('.slot-file-input');
    const removeBtn = slot.querySelector('.slot-remove');

    slot.addEventListener('click', (e) => {
      if (e.target === removeBtn || e.target.closest('.slot-remove')) return;
      if (fileInput) fileInput.click();
    });

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (re) => {
          wizardState.photos[slotKey] = {
            name: file.name,
            size: file.size,
            dataUrl: re.target.result
          };

          let img = slot.querySelector('img');
          if (!img) {
            img = document.createElement('img');
            slot.appendChild(img);
          }
          img.src = re.target.result;
          slot.classList.add('has-image');
        };
        reader.readAsDataURL(file);
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        delete wizardState.photos[slotKey];
        if (fileInput) fileInput.value = '';
        const img = slot.querySelector('img');
        if (img) img.remove();
        slot.classList.remove('has-image');
      });
    }
  });

  // Final Form Submission
  wizardForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (quoteVin && !quoteVin.value.trim()) {
      quoteVin.classList.add('error');
      quoteVin.focus();
      return;
    } else if (quoteVin) {
      quoteVin.classList.remove('error');
      wizardState.vin = quoteVin.value.trim();
    }

    const payload = {
      ...wizardState,
      submittedAt: new Date().toISOString()
    };

    try {
      const stored = JSON.parse(localStorage.getItem('dynamic_collision_quotes') || '[]');
      // Store metadata without excessive base64 weight in localStorage
      const lightPayload = {
        ...payload,
        photos: Object.keys(wizardState.photos).map(k => ({
          slot: k,
          fileName: wizardState.photos[k].name,
          fileSize: wizardState.photos[k].size
        }))
      };
      stored.push(lightPayload);
      localStorage.setItem('dynamic_collision_quotes', JSON.stringify(stored));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    if (quoteSubmitBtn) {
      quoteSubmitBtn.textContent = 'Estimate Submitted! ✓';
      quoteSubmitBtn.disabled = true;
    }

    if (quoteSuccessAlert) {
      quoteSuccessAlert.style.display = 'flex';
    }

    setTimeout(() => {
      wizardForm.reset();
      photoSlots.forEach((slot) => {
        const img = slot.querySelector('img');
        if (img) img.remove();
        slot.classList.remove('has-image');
      });
      payTypeCards.forEach(c => c.classList.remove('selected'));
      insFaultCards.forEach(c => c.classList.remove('selected'));
      selfpayCards.forEach(c => c.classList.remove('selected'));
      if (quoteSuccessAlert) quoteSuccessAlert.style.display = 'none';
      if (quoteSubmitBtn) {
        quoteSubmitBtn.textContent = 'Submit Estimate Request';
        quoteSubmitBtn.disabled = false;
      }
      currentStep = 1;
      updateProgressUI();
      if (quoteModal) quoteModal.classList.remove('active');
      document.body.style.overflow = '';
    }, 4000);
  });
}


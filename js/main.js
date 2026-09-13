/**
 * Dynamic Collision Repair - Main JavaScript
 * Handles all interactivity for the website.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 12. PRELOADER ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); // Wait for fade-out transition
        });
    }

    // --- 1. MOBILE NAVIGATION ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Prevent body scroll when menu is open
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // --- 2. STICKY HEADER ---
    const header = document.querySelector('header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check in case of mid-page load
        handleScroll();
    }

    // --- 3. SCROLL ANIMATIONS (IntersectionObserver) ---
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only trigger once
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // --- 4. FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all others (single-open behavior)
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const answer = otherItem.querySelector('.faq-answer');
                        if (answer) answer.style.maxHeight = null;
                    });

                    // Open if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                        const answer = item.querySelector('.faq-answer');
                        if (answer) {
                            answer.style.maxHeight = answer.scrollHeight + 'px';
                        }
                    }
                });
            }
        });
    }

    // --- 5. ANIMATED COUNTERS ---
    const counters = document.querySelectorAll('.counter, [data-target], .trust-bar span, .stat-badges h3');
    if (counters.length > 0) {
        const counterOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const easeOutQuad = t => t * (2 - t);

        const animateCounter = (el) => {
            const targetAttr = el.getAttribute('data-target');
            // If data-target isn't set, try to parse the element's text content, stripping non-numeric
            let targetValue = 0;
            if (targetAttr) {
                targetValue = parseFloat(targetAttr);
            } else {
                targetValue = parseFloat(el.innerText.replace(/[^0-9.]/g, ''));
                if (!isNaN(targetValue)) {
                    el.setAttribute('data-target', targetValue);
                }
            }
            
            if (isNaN(targetValue) || targetValue === 0) return;

            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;
            const hasDecimals = targetValue % 1 !== 0;

            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                let progress = elapsedTime / duration;
                
                if (progress > 1) progress = 1;
                
                const easedProgress = easeOutQuad(progress);
                let currentValue = startValue + (targetValue - startValue) * easedProgress;

                if (hasDecimals) {
                    el.innerText = currentValue.toFixed(1);
                } else {
                    el.innerText = Math.round(currentValue);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Ensure final value matches target exactly
                    el.innerText = targetValue;
                }
            };

            requestAnimationFrame(updateCounter);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, counterOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // --- 6. SMOOTH SCROLLING ---
    const headerHeight = 80; // Offset for sticky header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle hash on page load for cross-page anchor links
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // --- 7. SCROLL TO TOP BUTTON ---
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 8. CONTACT FORM HANDLING ---
    const contactForm = document.querySelector('.contact-form, form');
    if (contactForm) {
        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };

        const showError = (input, message) => {
            const formControl = input.parentElement;
            let errorElement = formControl.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.color = '#dc3545';
                errorElement.style.fontSize = '0.85rem';
                errorElement.style.marginTop = '0.25rem';
                formControl.appendChild(errorElement);
            }
            errorElement.innerText = message;
            input.classList.add('is-invalid');
            input.style.borderColor = '#dc3545';
        };

        const clearError = (input) => {
            const formControl = input.parentElement;
            const errorElement = formControl.querySelector('.error-message');
            if (errorElement) {
                formControl.removeChild(errorElement);
            }
            input.classList.remove('is-invalid');
            input.style.borderColor = ''; // reset to default
        };

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            // Name validation
            const nameInput = contactForm.querySelector('input[name="name"], #name');
            if (nameInput) {
                if (nameInput.value.trim() === '') {
                    showError(nameInput, 'Name is required');
                    isValid = false;
                } else {
                    clearError(nameInput);
                }
            }

            // Email validation
            const emailInput = contactForm.querySelector('input[name="email"], input[type="email"], #email');
            if (emailInput) {
                if (emailInput.value.trim() === '') {
                    showError(emailInput, 'Email is required');
                    isValid = false;
                } else if (!validateEmail(emailInput.value.trim())) {
                    showError(emailInput, 'Please enter a valid email address');
                    isValid = false;
                } else {
                    clearError(emailInput);
                }
            }

            // Message validation
            const messageInput = contactForm.querySelector('textarea[name="message"], #message');
            if (messageInput) {
                if (messageInput.value.trim() === '') {
                    showError(messageInput, 'Message is required');
                    isValid = false;
                } else {
                    clearError(messageInput);
                }
            }

            if (isValid) {
                // Mock submission handling
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                let originalText = 'Submit';
                if (submitBtn) {
                    originalText = submitBtn.innerText;
                    submitBtn.innerText = 'Sending...';
                    submitBtn.disabled = true;
                }

                setTimeout(() => {
                    // Success handling after simulated delay
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                    }
                    
                    let successMsg = contactForm.querySelector('.form-success');
                    if (!successMsg) {
                        successMsg = document.createElement('div');
                        successMsg.className = 'form-success';
                        successMsg.style.color = '#28a745';
                        successMsg.style.marginTop = '1rem';
                        successMsg.style.padding = '1rem';
                        successMsg.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                        successMsg.style.border = '1px solid #28a745';
                        successMsg.style.borderRadius = '4px';
                        successMsg.innerText = 'Thank you! Your message has been sent successfully.';
                        contactForm.appendChild(successMsg);
                    }
                    successMsg.style.display = 'block';

                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);
                }, 1500);
            }
        });
    }

    // --- 9. PARALLAX EFFECT ---
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            // Only apply parallax on desktop devices
            if (window.innerWidth > 768) {
                const scrolled = window.scrollY;
                hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
            } else {
                hero.style.backgroundPositionY = 'center';
            }
        }, { passive: true });
    }

    // --- 10. ACTIVE NAV LINK ---
    const currentPath = window.location.pathname;
    const allNavLinks = document.querySelectorAll('.nav-link, .nav-menu a');
    allNavLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Simple match or index page match
        if (linkPath === currentPath || 
            (currentPath.endsWith('/') && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- 11. IMAGE LAZY LOADING ---
    const images = document.querySelectorAll('img:not([loading="lazy"])');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

});

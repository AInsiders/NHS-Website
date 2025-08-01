// ===== NAVIGATION FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Sticky navigation on scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(18, 18, 18, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(18, 18, 18, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== ANIMATION ON SCROLL =====
function animateOnScroll() {
  const elements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'all 0.6s ease';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    observer.observe(element);
  });
}

// ===== VIDEO SECTION SCROLL TRIGGER =====
function initializeVideoSection() {
  const videoSection = document.getElementById('videoSection');
  
  if (videoSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(videoSection);
  }
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (counter.textContent.includes('+')) {
                    counter.textContent = Math.ceil(current) + '+';
                } else if (counter.textContent.includes('%')) {
                    counter.textContent = Math.ceil(current) + '%';
                } else {
                    counter.textContent = Math.ceil(current);
                }
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = counter.textContent.replace(/\d+/, target);
            }
        };
        
        updateCounter();
    });
}

// ===== FORM HANDLING WITH FORMSUBMIT =====
function initializeForm() {
    const contactForm = document.getElementById('contactForm');
    const inquiryType = document.getElementById('inquiryType');
    
    if (contactForm) {
        // Auto-select inquiry type from consultation button clicks
        const bookButtons = document.querySelectorAll('.book-btn');
        bookButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const consultation = this.getAttribute('data-consultation');
                if (inquiryType) {
                    inquiryType.value = 'consultation';
                }
                
                // Scroll to form
                const formSection = document.querySelector('.booking-form-section');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Form submission with FormSubmit
        contactForm.addEventListener('submit', function(e) {
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Basic form validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff4444';
                } else {
                    field.style.borderColor = '#e0e0e0';
                }
            });

            if (!isValid) {
                showNotification('Please fill in all required fields.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                e.preventDefault();
            }
            // If valid, let the form submit naturally to FormSubmit
            // The form will redirect to the thank you page or show success message
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== TESTIMONIAL CAROUSEL =====
function initializeTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;

    if (testimonials.length > 0) {
        // Create carousel controls
        const carouselContainer = document.querySelector('.testimonials-grid');
        if (carouselContainer) {
            const controls = document.createElement('div');
            controls.className = 'carousel-controls';
            controls.innerHTML = `
                <button class="carousel-btn prev">&lt;</button>
                <div class="carousel-dots"></div>
                <button class="carousel-btn next">&gt;</button>
            `;
            
            carouselContainer.parentNode.appendChild(controls);

            // Create dots
            const dotsContainer = controls.querySelector('.carousel-dots');
            testimonials.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'carousel-dot';
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });

            // Navigation buttons
            const prevBtn = controls.querySelector('.prev');
            const nextBtn = controls.querySelector('.next');
            
            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

            function goToSlide(index) {
                if (index < 0) index = testimonials.length - 1;
                if (index >= testimonials.length) index = 0;
                
                testimonials.forEach((testimonial, i) => {
                    testimonial.style.display = i === index ? 'block' : 'none';
                });
                
                // Update dots
                document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                
                currentIndex = index;
            }

            // Initialize first slide
            goToSlide(0);

            // Auto-advance
            setInterval(() => goToSlide(currentIndex + 1), 5000);
        }
    }
}

// ===== PARALLAX EFFECT =====
function initializeParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero, .page-header');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== SCROLL TO TOP BUTTON =====
function initializeScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
         scrollToTopBtn.style.cssText = `
         position: fixed;
         bottom: 30px;
         right: 30px;
         width: 50px;
         height: 50px;
         background: #DEC590;
         color: #000000;
         border: none;
         border-radius: 50%;
         cursor: pointer;
         font-size: 1.5rem;
         opacity: 0;
         visibility: hidden;
         transition: all 0.3s ease;
         z-index: 1000;
     `;

    document.body.appendChild(scrollToTopBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== LOADING ANIMATION =====
function initializeLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;

    document.body.appendChild(loader);

    // Hide loader after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    animateOnScroll();
    initializeVideoSection();
    initializeForm();
    initializeTestimonialCarousel();
    initializeParallax();
    initializeLazyLoading();
    initializeScrollToTop();
    initializeLoadingAnimation();
    initializeMobileOptimizations();
    initializeTypingAnimation();

    // Animate counters when stats section is visible
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(statsSection);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .carousel-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 2rem;
        }
        
                 .carousel-btn {
             background: #DEC590;
             color: #000000;
             border: none;
             padding: 0.5rem 1rem;
             border-radius: 5px;
             cursor: pointer;
             transition: background 0.3s ease;
         }
        
                 .carousel-btn:hover {
             background: #968056;
         }
        
        .carousel-dots {
            display: flex;
            gap: 0.5rem;
        }
        
        .carousel-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ccc;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
                 .carousel-dot.active {
             background: #DEC590;
         }
        
                 .loader-spinner {
             width: 50px;
             height: 50px;
             border: 3px solid #f3f3f3;
             border-top: 3px solid #DEC590;
             border-radius: 50%;
             animation: spin 1s linear infinite;
         }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
                 .scroll-to-top:hover {
             background: #968056;
             transform: scale(1.1);
         }
    `;
    document.head.appendChild(style);
});

// ===== TYPING ANIMATION =====
function initializeTypingAnimation() {
  const typingText = document.getElementById('typingText');
  if (!typingText) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // For users who prefer reduced motion, just show the final text
    typingText.textContent = 'Legacy';
    return;
  }

  const words = ['estate', 'future', 'business', 'family', 'future', 'Legacy'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150;
  let deletingSpeed = 100;
  let pauseTime = 800; // Reduced from 2000ms to 800ms

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Deleting characters
      typingText.textContent = currentWord.substring(0, charIndex - 1) + '|';
      charIndex--;
      typingSpeed = deletingSpeed;
    } else {
      // Typing characters
      typingText.textContent = currentWord.substring(0, charIndex + 1) + '|';
      charIndex++;
      typingSpeed = 150;
    }

    // Handle word completion
    if (!isDeleting && charIndex === currentWord.length) {
      // Check if this is the final word "Legacy"
      if (currentWord === 'Legacy') {
        // Stop the animation and keep "Legacy" displayed
        typingText.textContent = 'Legacy';
        return;
      }
      // Pause at end of word (shorter pause)
      typingSpeed = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Move to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 300; // Reduced pause before next word from 500ms to 300ms
    }

    setTimeout(type, typingSpeed);
  }

  // Start the typing animation after a short delay
  setTimeout(type, 1000);
}

// ===== MOBILE OPTIMIZATION =====
function initializeMobileOptimizations() {
    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Improve touch scrolling performance
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});

    // Optimize video loading for mobile
    const videoSection = document.getElementById('videoSection');
    if (videoSection && window.innerWidth <= 768) {
        const iframe = videoSection.querySelector('iframe');
        if (iframe) {
            // Only load video when section is visible on mobile
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add loading="lazy" for better performance
                        iframe.setAttribute('loading', 'lazy');
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(videoSection);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-based animations and effects
}, 16));

// Debounce resize events
window.addEventListener('resize', debounce(function() {
    // Responsive adjustments
}, 250)); 
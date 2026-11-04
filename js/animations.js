/**
 * BREWLAB MOTION & GSAP ANIMATIONS
 * Implements ScrollTrigger reveals, kinetic headline animation, and staggered entries.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
});

function initAnimations() {
  if (typeof gsap === 'undefined') {
    console.log('GSAP not loaded via CDN, fallback to CSS transitions.');
    return;
  }

  // Register GSAP ScrollTrigger if present
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // --- Hero Section Entrance ---
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

  heroTL
    .from('.hero-badge', { y: 20, opacity: 0, duration: 0.8 }, 0.1)
    .from('.hero-title', { y: 40, opacity: 0, duration: 1.1 }, 0.2)
    .from('.hero-desc', { y: 25, opacity: 0, duration: 0.9 }, 0.4)
    .from('.hero-cta-group', { y: 20, opacity: 0, duration: 0.8 }, 0.6)
    .from('.hero-splash-wrapper', { scale: 0.92, opacity: 0, duration: 1.2, ease: 'back.out(1.4)' }, 0.3)
    .from('.hero-floating-card', { x: -30, opacity: 0, duration: 0.8 }, 0.7);

  // --- ScrollTrigger Section Reveals ---
  if (typeof ScrollTrigger !== 'undefined') {
    // Section headers reveal
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out'
      });
    });

    // Product cards staggered entrance
    gsap.from('.product-card', {
      scrollTrigger: {
        trigger: '.products-section',
        start: 'top 75%'
      },
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Testimonial cards staggered entrance
    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 80%'
      },
      y: 40,
      opacity: 0,
      stagger: 0.18,
      duration: 0.8,
      ease: 'power2.out'
    });

    // About Section counter increment
    const statNum = document.querySelector('.stat-number');
    if (statNum) {
      gsap.from(statNum, {
        scrollTrigger: {
          trigger: '.about-stat-card',
          start: 'top 85%'
        },
        innerText: 0,
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power1.inOut'
      });
    }
  }
}

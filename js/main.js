import { loadNavbar } from './components/navbar.js';
import { loadFooter } from './components/footer.js';

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();

  // Wait for navbar/footer to be loaded before attaching smooth scroll
  setTimeout(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
    
    // Also handle links that might contain full paths but are on the same page
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const url = new URL(href, window.location.origin);
        
        // Check if it's the same page but with a hash
        if (url.pathname === window.location.pathname && url.hash) {
          e.preventDefault();
          const target = document.querySelector(url.hash);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }, 100);

  // Add scroll effect to header (now works with #navbar)
  window.addEventListener('scroll', function () {
    const header = document.querySelector('#navbar header');
    if (header) {
      if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.9)';
      }
    }
  });

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .pricing-card, .why-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });

  // Add parallax effect to particles
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const particles = document.querySelectorAll('.animate-float');
    particles.forEach((particle, index) => {
      const speed = 0.5 + (index * 0.1);
      particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
});

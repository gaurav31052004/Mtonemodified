import { loadNavbar } from './components/navbar.js';
import { loadFooter } from './components/footer.js';
import PricingToggle from './components/pricing.js';


// Dynamically add Font Awesome script to <head>
(function addFontAwesome() {
  if (!document.querySelector('script[src*="fontawesome.com"]')) {
    const fa = document.createElement('script');
    fa.src = "https://kit.fontawesome.com/cfa9c31eb9.js";
    fa.crossOrigin = "anonymous";
    fa.async = true;
    document.head.appendChild(fa);
  }
})();

// Dynamically add favicon to <head>
(function addFavicon() {
  const faviconUrl = "https://res.cloudinary.com/df1kus7ro/image/upload/v1750484712/MT1_LOGO_ORIGINAL_1_1_iqx9yf.png";
  let link = document.querySelector('link[rel~="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/png';
  link.href = faviconUrl;
})();

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();
  
  // Initialize pricing toggle component
  new PricingToggle();

  // Add style for active nav underline first
  if (!document.getElementById('active-nav-style')) {
    const style = document.createElement('style');
    style.id = 'active-nav-style';
    style.innerHTML = `
      #navbar a {
        position: relative;
        transition: color 0.3s ease;
      }
      #navbar a::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        width: 0;
        height: 0.35em;
        border-radius: 0.7em;
        background: #FFA500;
        transform: translateX(-50%);
        transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      #navbar a.active-nav {
        color: #FFA500 !important;
      }
      #navbar a.active-nav::after {
        width: 2.5em;
      }
      #navbar a:hover::after {
        width: 2em;
        background: #FFD700;
      }
    `;
    document.head.appendChild(style);
  }

  // Section-to-nav highlighting (after navbar is loaded)
  setTimeout(() => {
    const sectionIds = ['home', 'about', 'pricing'];
    const navSelector = '#navbar a[href]';

    // Helper to remove highlight from all nav items
    function clearActiveNav() {
      document.querySelectorAll(navSelector).forEach(a => {
        a.classList.remove('active-nav');
      });
    }

    // Add highlight class to nav item
    function setActiveNav(id) {
      clearActiveNav();
      // Find nav link for this section
      const nav = document.querySelector(`${navSelector}[href$="#${id}"]`);
      if (nav) {
        nav.classList.add('active-nav');
      }
    }

    // Observe sections for intersection
    const sectionElements = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    if (sectionElements.length) {
      const observer = new IntersectionObserver((entries) => {
        let mostVisible = null;
        let maxRatio = 0;
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            mostVisible = entry.target;
            maxRatio = entry.intersectionRatio;
          }
        });
        if (mostVisible) {
          setActiveNav(mostVisible.id);
        }
      }, {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '-80px 0px -50% 0px' // adjust for header height
      });
      sectionElements.forEach(section => observer.observe(section));
      
      // Set initial active state for home section
      setActiveNav('home');
    }
  }, 200);
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
        header.style.background = 'rgba(255,255,255,0.55)';
        header.style.backdropFilter = 'blur(18px) saturate(180%)';
        header.style.webkitBackdropFilter = 'blur(18px) saturate(180%)';
        header.style.boxShadow = '0 2px 24px 0 rgba(80,80,80,0.07)';
        header.style.borderBottom = '1.5px solid rgba(255,215,0,0.13)';
      } else {
        header.style.background = 'rgba(255,255,255,0.85)';
        header.style.backdropFilter = 'blur(8px) saturate(120%)';
        header.style.webkitBackdropFilter = 'blur(8px) saturate(120%)';
        header.style.boxShadow = 'none';
        header.style.borderBottom = '1.5px solid rgba(255,215,0,0.09)';
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

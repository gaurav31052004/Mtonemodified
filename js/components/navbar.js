export function loadNavbar() {
  // Define navigation links in an array for easy editing
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Login', href: '/login/' }
  ];

  // Determine if we're on the home page or a subpage
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
  const homePrefix = isHomePage ? '' : '/';

  // Helper to prefix hash links with homePrefix if needed
  function getHref(href) {
    // Don't prefix absolute paths like /login/
    if (href.startsWith('/')) {
      return href;
    }
    if (href.startsWith('#')) {
      return `${homePrefix}${href}`;
    }
    return href;
  }

  // Generate desktop nav links
  const desktopLinks = navLinks.map(link =>
    `<li><a href="${getHref(link.href)}" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">${link.label}</a></li>`
  ).join('');

  // Generate mobile nav links
  const mobileLinks = navLinks.map(link =>
    `<li><a href="${getHref(link.href)}" class="block py-2 text-gray-800 hover:text-gold transition-all duration-300 mobile-menu-link">${link.label}</a></li>`
  ).join('');

  const navbar = `
    <header class="fixed top-0 left-0 right-0 z-50 px-3 py-3 md:px-8 md:py-4 bg-white/90 backdrop-blur-xl border-b border-gold/20">
      <nav class="flex justify-between items-center max-w-6xl mx-auto">
        <a href="/" class="flex items-center shrink-0 no-underline hover:no-underline" id="logo-link">
          <img src="https://res.cloudinary.com/df1kus7ro/image/upload/v1751618884/mt1-logo_uitfvk.png" alt="mtone.in logo" class="h-12 md:h-16 w-auto" />
        </a>
        <!-- Desktop Menu -->
        <ul class="hidden md:flex gap-6 lg:gap-8 list-none">
          ${desktopLinks}
        </ul>
        <!-- Mobile Menu Button -->
        <button class="md:hidden p-2 rounded-lg hover:bg-gold/10 transition-colors" id="mobile-menu-button" aria-label="Open mobile navigation menu">
          <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </nav>
      <!-- Mobile Menu -->
      <div class="md:hidden bg-white/95 backdrop-blur-xl border-t border-gold/20 overflow-hidden transition-all duration-300 ease-in-out max-h-0 opacity-0" id="mobile-menu">
        <ul class="px-4 py-4 space-y-2">
          ${mobileLinks}
        </ul>
      </div>
    </header>
  `;

  const navbarContainer = document.getElementById('navbar');
  if (navbarContainer) {
    navbarContainer.innerHTML = navbar;

    // Add active nav styles
    addActiveNavStyles();

    // Initialize active navigation highlighting
    initializeActiveNav();

    // Add mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    let isMenuOpen = false;

    if (mobileMenuButton && mobileMenu) {
      // Function to open mobile menu
      const openMenu = () => {
        isMenuOpen = true;
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
        mobileMenu.style.opacity = '1';
        
        // Update hamburger icon to X
        const icon = mobileMenuButton.querySelector('svg');
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
      };

      // Function to close mobile menu
      const closeMenu = () => {
        isMenuOpen = false;
        mobileMenu.style.maxHeight = '0';
        mobileMenu.style.opacity = '0';
        
        // Update X icon back to hamburger
        const icon = mobileMenuButton.querySelector('svg');
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
      };

      // Toggle menu on button click
      mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMenuOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Close mobile menu when clicking on links
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          closeMenu();
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
          closeMenu();
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
          closeMenu();
        }
      });

      // Handle logo click behavior
      const logoLink = document.getElementById('logo-link');
      if (logoLink) {
        logoLink.addEventListener('click', (e) => {
          const currentIsHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
          if (currentIsHomePage) {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
          // If not on home page, let the default link behavior work
        });
      }
    }
  }
}

function addActiveNavStyles() {
  // Add style for active nav underline
  if (!document.getElementById("active-nav-style")) {
    const style = document.createElement("style");
    style.id = "active-nav-style";
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
}

function initializeActiveNav() {
  const currentPath = window.location.pathname;
  const navSelector = "#navbar a[href]";

  // Helper to remove highlight from all nav items
  function clearActiveNav() {
    document.querySelectorAll(navSelector).forEach((a) => {
      a.classList.remove("active-nav");
    });
  }

  // Add highlight class to nav item
  function setActiveNav(identifier) {
    clearActiveNav();
    let nav = null;
    
    if (identifier.startsWith('#')) {
      // Find nav link for this section (hash)
      nav = document.querySelector(`${navSelector}[href$="${identifier}"]`);
    } else {
      // Find nav link for this page (path)
      nav = document.querySelector(`${navSelector}[href="${identifier}"]`) ||
            document.querySelector(`${navSelector}[href$="${identifier}"]`);
    }
    
    if (nav) {
      nav.classList.add("active-nav");
    }
  }

  // Check if we're on a specific page first
  const isLoginPage = currentPath.includes('/login/') || 
                     currentPath.endsWith('/login') || 
                     currentPath.includes('/login/index.html');
                     
  const isHomePage = currentPath === '/' || currentPath === '/index.html';

  if (isLoginPage) {
    // Highlight login nav item
    setActiveNav('/login/');
  } else if (isHomePage) {
    // For home page, set up section-based highlighting
    setTimeout(() => {
      const sectionIds = ["home", "about", "pricing"];

      // Observe sections for intersection
      const sectionElements = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);
        
      if (sectionElements.length) {
        const observer = new IntersectionObserver(
          (entries) => {
            let mostVisible = null;
            let maxRatio = 0;
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                mostVisible = entry.target;
                maxRatio = entry.intersectionRatio;
              }
            });
            if (mostVisible) {
              setActiveNav('#' + mostVisible.id);
            }
          },
          {
            threshold: [0.1, 0.3, 0.5],
            rootMargin: "-80px 0px -50% 0px", // adjust for header height
          },
        );
        sectionElements.forEach((section) => observer.observe(section));

        // Set initial active state for home section
        setActiveNav('#home');
      }
    }, 200);
  }
  // For other pages, no nav item will be highlighted by default
}
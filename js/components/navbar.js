export function loadNavbar() {
  // Define navigation links in an array for easy editing
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Pricing", href: "#pricing" },
    { label: "Login", href: "/login" },
  ];

  // Determine if we're on the home page or a subpage
  const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html";
  const homePrefix = isHomePage ? "" : "/";

  // Helper to prefix hash links with homePrefix if needed
  function getHref(href) {
    // Don't prefix absolute paths like /login/
    if (href.startsWith("/")) {
      return href;
    }
    if (href.startsWith("#")) {
      return `${homePrefix}${href}`;
    }
    return href;
  }

  // Generate desktop nav links
  const desktopLinks = navLinks
    .map(
      (link) =>
        `<li><a href="${getHref(link.href)}" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">${link.label}</a></li>`,
    )
    .join("");

  // Generate mobile nav links
  const mobileLinks = navLinks
    .map(
      (link) =>
        `<li><a href="${getHref(link.href)}" class="block py-2 text-gray-800 hover:text-gold transition-all duration-300 mobile-menu-link">${link.label}</a></li>`,
    )
    .join("");

  const navbar = `
    <header class="fixed top-0 left-0 right-0 z-50 px-3 py-3 md:px-8 md:py-4 bg-white/90 backdrop-blur-xl border-b border-gold/20">
      <nav class="flex justify-between items-center max-w-6xl mx-auto">
        <a href="/" class="flex items-center shrink-0 no-underline hover:no-underline" id="logo-link">
          <img src="https://res.cloudinary.com/df1kus7ro/image/upload/v1751618884/mt1-logo_uitfvk.webp" alt="mtone.in logo" class="h-12 md:h-16 w-auto" />
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

  const navbarContainer = document.getElementById("navbar");
  if (navbarContainer) {
    navbarContainer.innerHTML = navbar;

    // Add active nav styles
    addActiveNavStyles();

    // Initialize active navigation highlighting
    initializeActiveNav();

    // Add mobile menu toggle functionality
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

    let isMenuOpen = false;

    if (mobileMenuButton && mobileMenu) {
      // Function to open mobile menu
      const openMenu = () => {
        isMenuOpen = true;
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
        mobileMenu.style.opacity = "1";

        // Update hamburger icon to X
        const icon = mobileMenuButton.querySelector("svg");
        icon.innerHTML =
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
      };

      // Function to close mobile menu
      const closeMenu = () => {
        isMenuOpen = false;
        mobileMenu.style.maxHeight = "0";
        mobileMenu.style.opacity = "0";

        // Update X icon back to hamburger
        const icon = mobileMenuButton.querySelector("svg");
        icon.innerHTML =
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
      };

      // Toggle menu on button click
      mobileMenuButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isMenuOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Close mobile menu when clicking on links
      mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href");

          // Handle hash links manually for consistency
          if (href && href.startsWith("#")) {
            e.preventDefault();
            closeMenu();

            // Immediately set active state for both desktop and mobile
            const desktopNav = document.querySelector(
              `#navbar a[href$="${href}"]`,
            );
            const mobileNav = document.querySelector(
              `#mobile-menu a[href$="${href}"]`,
            );

            // Clear all active states
            document
              .querySelectorAll("#navbar a, #mobile-menu a")
              .forEach((a) => {
                a.classList.remove("active-nav");
              });

            // Set active for both
            if (desktopNav) desktopNav.classList.add("active-nav");
            if (mobileNav) mobileNav.classList.add("active-nav");

            // Smooth scroll
            const targetSection = document.querySelector(href);
            if (targetSection) {
              const headerHeight = 80;
              const targetPosition = targetSection.offsetTop - headerHeight;

              window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
              });
            }
          } else {
            closeMenu();
          }
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          isMenuOpen &&
          !mobileMenuButton.contains(e.target) &&
          !mobileMenu.contains(e.target)
        ) {
          closeMenu();
        }
      });

      // Close menu on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isMenuOpen) {
          closeMenu();
        }
      });

      // Handle logo click behavior
      const logoLink = document.getElementById("logo-link");
      if (logoLink) {
        logoLink.addEventListener("click", (e) => {
          const currentIsHomePage =
            window.location.pathname === "/" ||
            window.location.pathname === "/index.html";
          if (currentIsHomePage) {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
          // If not on home page, let the default link behavior work
        });
      }
    }
  }
}

function addActiveNavStyles() {
  // Add style for active nav underline (desktop and mobile)
  if (!document.getElementById("active-nav-style")) {
    const style = document.createElement("style");
    style.id = "active-nav-style";
    style.innerHTML = `
      #navbar a, #mobile-menu a {
        position: relative;
        transition: color 0.3s ease;
      }
      #navbar a::after, #mobile-menu a::after {
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
      #navbar a.active-nav, #mobile-menu a.active-nav {
        color: #FFA500 !important;
      }
      #navbar a.active-nav::after, #mobile-menu a.active-nav::after {
        width: 2.5em;
      }
      #navbar a:hover::after, #mobile-menu a:hover::after {
        width: 2em;
        background: #FFD700;
      }
      
      /* Mobile-specific adjustments */
      #mobile-menu a.active-nav {
        background-color: #FFA500/10;
        border-radius: 8px;
        font-weight: 600;
      }
      #mobile-menu a.active-nav::after {
        bottom: -4px;
        width: 1.5em;
        height: 0.25em;
      }
    `;
    document.head.appendChild(style);
  }
}

function initializeActiveNav() {
  const currentPath = window.location.pathname;
  const navSelector = "#navbar a[href], #mobile-menu a[href]";

  let manualClickTimeout = null;

  // Helper functions
  function clearActiveNav() {
    document.querySelectorAll(navSelector).forEach((a) => {
      a.classList.remove("active-nav");
    });
  }

  function setActiveNav(identifier) {
    // Clear all active states (desktop and mobile)
    document.querySelectorAll("#navbar a, #mobile-menu a").forEach((a) => {
      a.classList.remove("active-nav");
    });

    // Set active for both desktop and mobile
    let desktopNav = null;
    let mobileNav = null;

    if (identifier.startsWith("#")) {
      desktopNav = document.querySelector(`#navbar a[href$="${identifier}"]`);
      mobileNav = document.querySelector(
        `#mobile-menu a[href$="${identifier}"]`,
      );
    } else {
      desktopNav =
        document.querySelector(`#navbar a[href="${identifier}"]`) ||
        document.querySelector(`#navbar a[href$="${identifier}"]`);
      mobileNav =
        document.querySelector(`#mobile-menu a[href="${identifier}"]`) ||
        document.querySelector(`#mobile-menu a[href$="${identifier}"]`);
    }

    if (desktopNav) desktopNav.classList.add("active-nav");
    if (mobileNav) mobileNav.classList.add("active-nav");
  }

  // Get currently visible section
  function getCurrentActiveSection() {
    const sections = ["home", "about", "pricing"];
    const headerHeight = 80;

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (!element) continue;

      const rect = element.getBoundingClientRect();

      // Check if section is in viewport considering header
      if (rect.top <= headerHeight && rect.bottom > headerHeight) {
        return sectionId;
      }
    }

    // Fallback: return the section closest to the top
    let closestSection = "home";
    let minDistance = Infinity;

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const distance = Math.abs(rect.top - headerHeight);

      if (distance < minDistance) {
        minDistance = distance;
        closestSection = sectionId;
      }
    });

    return closestSection;
  }

  // Update active nav based on scroll position
  function updateActiveNav() {
    // Skip update only during brief manual click period
    if (manualClickTimeout) return;

    const activeSection = getCurrentActiveSection();
    setActiveNav("#" + activeSection);
  }

  // Handle manual navigation clicks
  document.querySelectorAll(navSelector).forEach((a) => {
    a.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href && href.startsWith("#")) {
        // Set active immediately on click
        setActiveNav(href);

        // Prevent automatic updates for 1 second after manual click
        clearTimeout(manualClickTimeout);
        manualClickTimeout = setTimeout(() => {
          manualClickTimeout = null;
        }, 1000);
      }
    });
  });

  // Page-specific setup
  const isLoginPage =
    currentPath.includes("/login/") ||
    currentPath.endsWith("/login") ||
    currentPath.includes("/login/index.html");

  const isHomePage = currentPath === "/" || currentPath === "/index.html";

  if (isLoginPage) {
    setActiveNav("/login/");
  } else if (isHomePage) {
    // Setup scroll detection for home page
    let scrollTimer = null;

    function handleScroll() {
      // Clear existing timer
      clearTimeout(scrollTimer);

      // Set timer to update nav after scroll ends
      scrollTimer = setTimeout(updateActiveNav, 50);
    }

    // Wait for sections to load
    setTimeout(() => {
      // Add scroll listener
      window.addEventListener("scroll", handleScroll, { passive: true });

      // Set initial active section
      updateActiveNav();
    }, 300);
  }
}

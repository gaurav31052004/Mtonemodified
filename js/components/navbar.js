export function loadNavbar() {
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "Solutions", href: "#features-detail" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html";
  const homePrefix = isHomePage ? "" : "/";

  function getHref(href) {
    if (href.startsWith("/")) return href;
    if (href.startsWith("#")) return `${homePrefix}${href}`;
    return href;
  }

  const desktopLinks = navLinks
    .map(
      (link) =>
        `<li><a href="${getHref(link.href)}" class="text-gray-800 hover:text-gold transition-all duration-300 relative group nav-desktop-link" style="font-family:'Montserrat',sans-serif;font-weight:600;font-size:15px;line-height:22px;white-space:nowrap;">${link.label}</a></li>`
    )
    .join("");

  const mobileLinks = navLinks
  .map(
    (link) =>
      `<li><a href="${getHref(link.href)}" class="mobile-menu-link" style="display:block;padding:12px 0;font-family:'Montserrat',sans-serif;font-weight:600;font-size:15px;text-decoration:none;border-bottom:1px solid #f0f0f0;">${link.label}</a></li>`
  )
  .join("");

  const navbar = `
    <style>
      /* ── NAVBAR BASE ── */
      #mt-header {
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 9999;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(250,173,19,0.15);
        box-sizing: border-box;
        width: 100%;
        overflow: visible;
  min-height: 56px;
  padding-top: env(safe-area-inset-top, 0px);
      }

      #mt-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
        max-width: 1280px;
        margin: 0 auto;
        padding: 18px 16px 10px 16px;
        box-sizing: border-box;
        width: 100%;
        gap: 12px;
      }

      /* ── LOGO — Mobile First ── */
      #logo-link {
        flex-shrink: 0;
        text-decoration: none;
        outline: none;
        border: none;
        display: flex;
        align-items: center;
      }

   #logo-link img {
  height: 28px;
  max-width: 110px;
  width: auto;
  display: block;
  flex-shrink: 0;
  object-fit: contain;
  transition: height 0.2s ease;
}

      /* Tablet 768px+ */
      @media (min-width: 768px) {
  #logo-link img { height: 36px; max-width: 150px; }
        #mt-nav { padding: 12px 28px; gap: 16px; }
      }

      /* Laptop 1024px+ */
      @media (min-width: 1024px) {
        #logo-link img { height: 52px; }
        #mt-nav { padding: 14px 40px; gap: 20px; }
      }

      /* Desktop 1280px+ */
  @media (min-width: 1280px) {
  #logo-link img { height: 52px; max-width: 200px; }
        #mt-nav { padding: 16px 48px; }
      }

      /* Desktop nav links */
      #mt-desktop-links {
        display: none;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 20px;
        align-items: center;
        flex: 1;
        justify-content: center;
      }

      /* Desktop right buttons */
      #mt-desktop-btns {
        display: none;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }

      .mt-nav-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #FAAD13;
        color: #141F39 !important;
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        font-size: 13px;
        border-radius: 8px;
        padding: 10px 14px;
        text-decoration: none;
        white-space: nowrap;
        border: none;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.2s;
        line-height: 1;
      }

      .mt-nav-btn:hover {
        opacity: 0.88;
        transform: translateY(-1px);
        color: #141F39 !important;
      }

      /* Hamburger */
      #mobile-menu-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        background: none;
        border: none;
        cursor: pointer;
        border-radius: 8px;
        flex-shrink: 0;
      }

      /* Mobile Dropdown */
   #mobile-menu {
  display: block;
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, opacity 0.3s ease;
  opacity: 0;
  background: rgba(255,255,255,0.98);
  border: 1px solid rgba(250,173,19,0.18);
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.10);
  z-index: 9998;
}
      #mobile-menu ul {
        list-style: none;
        margin: 0;
        padding: 8px 20px 16px;
      }

      #mobile-menu ul li:last-child a,
      #mobile-menu ul li:last-child button {
        border-bottom: none !important;
      }

      .mt-mobile-btn {
        display: block;
        width: 100%;
        background: #FAAD13;
        color: #141F39 !important;
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        font-size: 15px;
        border-radius: 10px;
        padding: 13px 18px;
        text-align: center;
        text-decoration: none;
        border: none;
        cursor: pointer;
        margin-top: 8px;
        box-sizing: border-box;
        transition: opacity 0.2s;
      }

      .mt-mobile-btn:hover { opacity: 0.88; }

      /* ── BREAKPOINTS ── */

      /* Tablet 768px+ — show desktop nav, hide hamburger */
      @media (min-width: 768px) {
        #mobile-menu-button { display: none !important; }
        #mobile-menu { display: none !important; max-height: none !important; }
        #mt-desktop-links { display: flex !important; }
        #mt-desktop-btns { display: flex !important; }
        .mt-nav-btn { font-size: 13px; padding: 10px 14px; }
      }

      /* Laptop 1024px+ */
      @media (min-width: 1024px) {
        #mt-desktop-links { gap: 24px; }
        .mt-nav-btn { font-size: 14px; padding: 12px 16px; }
      }

      /* Large Desktop 1280px+ */
      @media (min-width: 1280px) {
        #mt-desktop-links { gap: 28px; }
        .mt-nav-btn {
          font-size: 15.12px;
          padding: 15px 19px;
          border-radius: 9.45px;
        }
      }

      /* Active nav underline */
      #mt-desktop-links a {
        position: relative;
        transition: color 0.3s;
      }
      #mt-desktop-links a::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        width: 0;
        height: 3px;
        border-radius: 4px;
        background: #FAAD13;
        transform: translateX(-50%);
        transition: width 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
      }
      #mt-desktop-links a.active-nav { color: #141F39 !important; font-weight: 700; }
      #mt-desktop-links a.active-nav::after { width: 2.2em; }
      #mt-desktop-links a:hover::after { width: 1.8em; background: #ffd700; }

      /* Prevent underline on buttons */
      .mt-nav-btn::after { display: none !important; }
       /* Active state for Login/Signup nav buttons */
      .mt-nav-btn.active-nav-btn {
        background: #141F39 !important;
        box-shadow: 0 4px 12px rgba(20,31,57,0.3);
      }
      .mt-mobile-btn.active-nav-btn {
        background: #141F39 !important;
      }
    </style>

    <header id="mt-header">
      <nav id="mt-nav">

        <!-- Logo -->
        <a href="/" id="logo-link">
          <img src="https://res.cloudinary.com/df1kus7ro/image/upload/f_auto,q_auto,w_108/v1760446123/Group_107_2_cqvu6b.png" alt="MT One logo" width="108" height="56">
        </a>

        <!-- Desktop Nav Links -->
        <ul id="mt-desktop-links">
          ${desktopLinks}
        </ul>

        <!-- Desktop Right Buttons -->
        <div id="mt-desktop-btns">
          <a href="/login" class="mt-nav-btn">Login</a>
          <a href="/onboarding" class="mt-nav-btn">Sign Up</a>
          <button onclick="window.openDemoModal && window.openDemoModal()" class="mt-nav-btn">Book Free Demo</button>
        </div>

        <!-- Hamburger Button -->
        <button id="mobile-menu-button" aria-label="Toggle navigation menu">
          <svg id="hamburger-icon" width="24" height="24" fill="none" stroke="#1a1a1a" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </nav>

      <!-- Mobile Menu -->
      <div id="mobile-menu">
        <ul>
          ${mobileLinks}
          <li><a href="/login" class="mt-mobile-btn">Login</a></li>
          <li><a href="/onboarding" class="mt-mobile-btn">Sign Up</a></li>
          <li><button onclick="closeMobileMenu(); window.openDemoModal && window.openDemoModal();" class="mt-mobile-btn">Book Free Demo</button></li>
        </ul>
      </div>
    </header>
  `;

  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return;
  navbarContainer.innerHTML = navbar;

  // ── Mobile menu toggle ──
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  let isMenuOpen = false;

  window.closeMobileMenu = function () {
    isMenuOpen = false;
    mobileMenu.style.maxHeight = "0";
    mobileMenu.style.opacity = "0";
    hamburgerIcon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16"/>';
  };

  const openMobileMenu = () => {
    isMenuOpen = true;
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 200 + "px";
    mobileMenu.style.opacity = "1";
    hamburgerIcon.innerHTML = '<path d="M6 18L18 6M6 6l12 12"/>';
  };

  mobileMenuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    isMenuOpen ? window.closeMobileMenu() : openMobileMenu();
  });

  // Close on mobile link click
  document.querySelectorAll(".mobile-menu-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        window.closeMobileMenu();
        setActiveNav(href);
        const target = document.querySelector(href);
        if (target) {
          const offset = 80;
          window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
        }
      } else {
        window.closeMobileMenu();
      }
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    const header = document.getElementById("mt-header");
    if (isMenuOpen && header && !header.contains(e.target)) {
      window.closeMobileMenu();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen) window.closeMobileMenu();
  });

  // Logo scroll-to-top on homepage
  const logoLink = document.getElementById("logo-link");
  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      const onHome = window.location.pathname === "/" || window.location.pathname === "/index.html";
      if (onHome) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
  }

  // ── Active Nav ──
 // NAYA — ye lagao:
function setActiveNav(identifier) {
  document.querySelectorAll("#mt-desktop-links a, #mobile-menu .mobile-menu-link").forEach((a) => {
    a.classList.remove("active-nav");
  });
  document.querySelectorAll(".mt-nav-btn, .mt-mobile-btn").forEach((btn) => {
    btn.classList.remove("active-nav-btn");
  });

  if (identifier === "/login") {
    document.querySelectorAll('.mt-nav-btn[href="/login"], .mt-mobile-btn[href="/login"]')
      .forEach(btn => btn.classList.add("active-nav-btn"));
    return;
  }
  if (identifier === "/onboarding") {
    document.querySelectorAll('.mt-nav-btn[href="/onboarding"], .mt-mobile-btn[href="/onboarding"]')
      .forEach(btn => btn.classList.add("active-nav-btn"));
    return;
  }

  let desktopEl, mobileEl;
  if (identifier.startsWith("#")) {
    desktopEl = document.querySelector(`#mt-desktop-links a[href$="${identifier}"]`);
    mobileEl  = document.querySelector(`#mobile-menu a[href$="${identifier}"]`);
  } else {
    desktopEl = document.querySelector(`#mt-desktop-links a[href="${identifier}"]`) ||
                document.querySelector(`#mt-desktop-links a[href$="${identifier}"]`);
    mobileEl  = document.querySelector(`#mobile-menu a[href="${identifier}"]`) ||
                document.querySelector(`#mobile-menu a[href$="${identifier}"]`);
  }
  if (desktopEl) desktopEl.classList.add("active-nav");
  if (mobileEl)  mobileEl.classList.add("active-nav");
}

  let manualTimeout = null;

  document.querySelectorAll("#mt-desktop-links a, #mobile-menu .mobile-menu-link").forEach((a) => {
    a.addEventListener("click", function () {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        setActiveNav(href);
        clearTimeout(manualTimeout);
        manualTimeout = setTimeout(() => { manualTimeout = null; }, 1200);
      }
    });
  });

  const path = window.location.pathname;
  if (path.includes("/login")) {
    setActiveNav("/login");
  } else if (path.includes("/onboarding")) {
    setActiveNav("/onboarding");
  } else if (path.includes("/about")) {
    setActiveNav("/about");
  } else if (path.includes("/contact")) {
    setActiveNav("/contact");
  } else if (path === "/" || path === "/index.html") {
    setTimeout(() => {
      const sections = ["home", "features", "features-detail", "about", "pricing"];
      const observerOptions = {
        root: null,
        rootMargin: "-25% 0px -55% 0px",
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !manualTimeout) {
            setActiveNav("#" + entry.target.id);
          }
        });
      }, observerOptions);

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
      
      // Fallback/Initial active section
      const activeSection = sections.find(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 90 && rect.bottom > 90;
      }) || "home";
      setActiveNav("#" + activeSection);
    }, 300);
  }
}
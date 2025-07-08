export function loadNavbar() {
  // Determine if we're on the home page or a subpage
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
  const homePrefix = isHomePage ? '' : '/';
  
  const navbar = `
    <header class="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 bg-white/90 backdrop-blur-xl border-b border-gold/20">
      <nav class="flex justify-between items-center max-w-6xl mx-auto">
        <a href="/" class="flex items-center">
          <img src="https://res.cloudinary.com/df1kus7ro/image/upload/v1751618884/mt1-logo_uitfvk.png" alt="mtone.in logo" class="h-16 w-auto mr-2" />
        </a>
        
        <!-- Desktop Menu -->
        <ul class="hidden md:flex gap-8 list-none">
          <li><a href="${homePrefix}#home" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">Home</a></li>
          <li><a href="${homePrefix}#about" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">About</a></li>
          <li><a href="${homePrefix}#pricing" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">Pricing</a></li>
          <li><a href="#login" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">Login</a></li>
        </ul>
        
        <!-- Mobile Menu Button -->
        <button class="md:hidden p-2 rounded-lg hover:bg-gold/10 transition-colors" id="mobile-menu-button">
          <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </nav>
      
      <!-- Mobile Menu -->
      <div class="md:hidden bg-white/95 backdrop-blur-xl border-t border-gold/20 hidden" id="mobile-menu">
        <ul class="px-4 py-4 space-y-2">
          <li><a href="${homePrefix}#home" class="block py-2 text-gray-800 hover:text-gold transition-all duration-300 mobile-menu-link">Home</a></li>
          <li><a href="${homePrefix}#about" class="block py-2 text-gray-800 hover:text-gold transition-all duration-300 mobile-menu-link">About</a></li>
          <li><a href="${homePrefix}#pricing" class="block py-2 text-gray-800 hover:text-gold transition-all duration-300 mobile-menu-link">Pricing</a></li>
          <li><a href="#login" class="block py-2 text-gray-800 hover:text-gold transition-all duration-300 mobile-menu-link">Login</a></li>
        </ul>
      </div>
    </header>
  `;
  
  const navbarContainer = document.getElementById('navbar');
  if (navbarContainer) {
    navbarContainer.innerHTML = navbar;
    
    // Add mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        
        // Toggle hamburger icon
        const icon = mobileMenuButton.querySelector('svg');
        if (mobileMenu.classList.contains('hidden')) {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        } else {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        }
      });
      
      // Close mobile menu when clicking on links
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          const icon = mobileMenuButton.querySelector('svg');
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        });
      });
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenu.classList.add('hidden');
          const icon = mobileMenuButton.querySelector('svg');
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
      });
    }
  }
}

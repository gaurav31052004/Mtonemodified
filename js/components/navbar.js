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
        <ul class="hidden md:flex gap-8 list-none">
          <li><a href="${homePrefix}#home" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">Home</a></li>
          <li><a href="${homePrefix}#about" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">About</a></li>
          <li><a href="${homePrefix}#pricing" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">Pricing</a></li>
          <li><a href="#login" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">Login</a></li>
          <li><a href="#signup" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">Sign Up</a></li>
        </ul>
      </nav>
    </header>
  `;
  const navbarContainer = document.getElementById('navbar');
  if (navbarContainer) {
    navbarContainer.innerHTML = navbar;
  }
}

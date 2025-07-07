export function loadNavbar() {
  const navbar = `
    <header class="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 bg-white/90 backdrop-blur-xl border-b border-gold/20">
      <nav class="flex justify-between items-center max-w-6xl mx-auto">
        <a href="/" class="flex items-center">
          <img src="https://res.cloudinary.com/df1kus7ro/image/upload/v1750484712/MT1_LOGO_ORIGINAL_1_1_iqx9yf.png" alt="mtone.in logo" class="h-20 w-auto mr-2" />
        </a>
        <ul class="hidden md:flex gap-8 list-none">
          <li><a href="#home" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">Home</a></li>
          <li><a href="#about" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">About</a></li>
          <li><a href="#pricing" class="text-gray-800 hover:text-gold transition-all duration-300 relative group">Pricing</a></li>
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

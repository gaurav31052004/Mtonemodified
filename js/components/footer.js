export function loadFooter() {
  const footer = `
    <footer class="bg-gradient-to-br from-white to-gray-50 px-8 py-12 pt-16 border-t border-gold/20">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-gold mb-4 text-xl font-semibold">mtone.in</h3>
          <p class="text-gray-500">Next-generation CRM platform for real estate professionals.</p>
        </div>
        <div>
          <h3 class="text-gold mb-4 text-xl font-semibold">Product</h3>
          <a href="/index.html#features" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">Features</a>
          <a href="/index.html#pricing" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">Pricing</a>
          <a href="#" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">Integrations</a>
          <a href="#" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">API</a>
        </div>
        <div>
          <h3 class="text-gold mb-4 text-xl font-semibold">Company</h3>
          <a href="/index.html#about" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">About Us</a>
          <a href="#" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">Careers</a>
          <a href="#" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">Press</a>
          <a href="#" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">Blog</a>
        </div>
        <div>
          <h3 class="text-gold mb-4 text-xl font-semibold">Support</h3>
          <a href="#" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">Help Center</a>
          <a href="#" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">Contact</a>
          <a href="/terms/index.html" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">Terms & Conditions</a>
          <a href="/privacy/index.html" class="block text-gray-600 mb-2 hover:text-gold transition-colors duration-300">Privacy Policy</a>
        </div>
      </div>
      <div class="text-center pt-8 border-t border-gold/20 text-gray-500">
        <p>&copy; 2025 mtone.in. All rights reserved.</p>
      </div>
    </footer>
  `;
  const footerContainer = document.getElementById('footer');
  if (footerContainer) {
    footerContainer.innerHTML = footer;
  }
}

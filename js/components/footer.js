export function loadFooter() {
  const logoUrl = "https://res.cloudinary.com/df1kus7ro/image/upload/v1751968938/9438b57c07c91f432d2653d34eaca599de386f5b_g1znof.png";
  // All quick links in an array
  const quickLinks = [
    { href: "/terms", label: "Terms of Use" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/index.html#pricing", label: "Pricing Plans" },
    { href: "/services", label: "Our Services" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
    { href: "/faq", label: "FAQs" }
  ];
  const footer = `
    <footer class="bg-black px-8 py-12 pt-16 border-t border-gold/20 text-gray-300">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo -->
        <div class="flex items-start">
          <a href="/index.html">
            <img src="${logoUrl}" alt="mtone.in logo" class="h-36 w-auto" />
          </a>
        </div>
        <!-- Address -->
        <div>
          <h3 class="text-white mb-4 text-xl font-semibold">Address</h3>
          <p class="mb-4 text-gray-400">C-116, 1st Floor, near SBI,<br/>C Block, Sector 2,<br/>Noida, Uttar Pradesh 201301</p>
          <h4 class="text-white text-base font-semibold mb-1">Total Free Customer Care</h4>
          <p class="text-gray-400">+91 123 456 789</p>
        </div>
        <!-- Quick Links -->
        <div>
          <h3 class="text-white mb-4 text-xl font-semibold">Quick Links</h3>
          <ul class="space-y-2">
            ${quickLinks.map(link => `<li><a href="${link.href}" class="text-gray-400 hover:text-gold transition-colors duration-300">${link.label}</a></li>`).join('')}
          </ul>
        </div>
        <!-- Apps -->
        <div>
          <h3 class="text-white mb-4 text-xl font-semibold">Apps</h3>
          <a href="#" class="flex items-center mb-4 hover:text-gold transition-colors duration-300">
            <i class="fab fa-apple text-2xl mr-3"></i>
            <span>
              <span class="block text-xs text-gray-400">Download on the</span>
              <span class="block font-semibold">Apple Store</span>
            </span>
          </a>
          <a href="#" class="flex items-center hover:text-gold transition-colors duration-300">
            <i class="fab fa-google-play text-2xl mr-3"></i>
            <span>
              <span class="block text-xs text-gray-400">Get in on</span>
              <span class="block font-semibold">Google Play</span>
            </span>
          </a>
        </div>
      </div>
      <div class="text-center pt-8 border-t border-gold/20 text-gray-500 mt-8">
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <p>&copy; 2025 MT One. All rights reserved.</p>
          <div class="flex items-center gap-2">
            <span class="text-sm">Powered by</span>
            <img src="https://res.cloudinary.com/dw9pppaqv/image/upload/v1728119284/logo_ANSIT_kahid0.webp" alt="ANSIT Logo" class="h-6 w-auto" />
          </div>
        </div>
      </div>
    </footer>
  `;
  const footerContainer = document.getElementById('footer');
  if (footerContainer) {
    footerContainer.innerHTML = footer;
  }
}

export function loadFooter() {
  const logoUrl = "https://res.cloudinary.com/df1kus7ro/image/upload/v1751968938/9438b57c07c91f432d2653d34eaca599de386f5b_g1znof.webp";
  // All quick links in an array
  const quickLinks = [
    { href: "/terms-conditions", label: "Terms of Use" },
    { href: "/privacypolicy", label: "Privacy Policy" },
    { href: "/#pricing", label: "Pricing Plans" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQs" }
  ];
  const mapsUrl = "https://www.google.com/maps/search/C-116,+1st+Floor,+Office+ON,+C+Block,+Sector+2,+Noida,+Uttar+Pradesh+201301/@28.5842373,77.3125928,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDcxNi4wIKXMDSoASAFQAw%3D%3D";
  const footer = `
    <footer class="bg-black px-4 md:px-8 py-12 pt-16 border-t border-gold/20 text-gray-200">
      <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Logo -->
        <div class="flex justify-center sm:justify-start items-start">
          <a href="/index.html">
            <img src="${logoUrl}" alt="mtone.in logo" class="h-24 md:h-36 w-auto" />
          </a>
        </div>
        <!-- Address -->
        <div class="text-center sm:text-left">
          <h3 class="text-white mb-4 text-xl font-semibold">Address</h3>
          <a href="${mapsUrl}" target="_blank" rel="noopener" class="mb-2 text-sm md:text-base flex items-center justify-center sm:justify-start text-gray-200 hover:text-gold transition-colors duration-300">
            <i class="fas fa-map-marker-alt mr-2"></i>C-116 GF, OfficeOn<br/>Sector 2, Noida<br/>Uttar Pradesh - 201301
          </a>
          <h4 class="text-white text-base font-semibold mb-1">Contact</h4>
          <p class="mb-1 flex items-center justify-center sm:justify-start" style="color: #e5e7eb;"><i class="fas fa-phone-alt mr-2"></i>+91 7303062845</p>
          <p class="mb-1 flex items-center justify-center sm:justify-start" style="color: #e5e7eb;"><i class="fas fa-envelope mr-2"></i>info@mtone.in</p>
        </div>
        <!-- Quick Links -->
        <div class="text-center sm:text-left">
          <h3 class="text-white mb-4 text-xl font-semibold">Quick Links</h3>
          <ul class="space-y-2">
            ${quickLinks.map(link => `<li><a href="${link.href}" class="text-gray-200 hover:text-gold transition-colors duration-300 text-sm md:text-base">${link.label}</a></li>`).join('')}
        </div>
        <!-- Apps -->
        <div class="text-center sm:text-left">
          <h3 class="text-white mb-4 text-xl font-semibold">Apps</h3>
          <a href="#" class="flex items-center justify-center sm:justify-start mb-4 hover:text-gold transition-colors duration-300">
            <i class="fab fa-apple text-2xl mr-3"></i>
            <span>
              <span class="block text-xs" style="color: #e5e7eb;">Download on the</span>
              <span class="block font-semibold text-sm">Apple Store</span>
            </span>
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.mtonema" class="flex items-center justify-center sm:justify-start hover:text-gold transition-colors duration-300">
            <i class="fab fa-google-play text-2xl mr-3"></i>
            <span>
              <span class="block text-xs" style="color: #e5e7eb;">Get in on</span>
              <span class="block font-semibold text-sm">Google Play</span>
            </span>
          </a>
        </div>
      </div>
      <div class="text-center pt-8 border-t border-gold/20 mt-8" style="color: #fff;">
        <div class="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          <p class="text-sm md:text-base">&copy; 2025 MT One. All rights reserved.</p>
          <div class="flex items-center gap-2">
            <span class="text-xs md:text-sm">Powered by</span>
            <a href="https://munatech.com" target="_blank" rel="noopener">
              <img src="https://res.cloudinary.com/df1kus7ro/image/upload/f_auto,q_auto/v1747734482/MunaTech/paxz5a4hg5euaiweq4wh" alt="ANSIT Logo" class="h-10 md:h-16 w-auto" style="filter: brightness(0) invert(1);" />
            </a>
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

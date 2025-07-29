import { loadNavbar } from "./components/navbar.js";
import { loadFooter } from "./components/footer.js";
import { initUtils } from "./components/utils.js";
import { setupYoutubeEmbed } from "./components/youtube-embed.js";
import { addFloatingWhatsappButton } from "./components/whatsapp-float.js";
import { Router } from "./router.js";
import { UIEffects } from "./utils/ui-effects.js";
import { SmoothScroll } from "./utils/smooth-scroll.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Setup YouTube embed if container exists
  if (document.getElementById("yt-video-container")) {
    setupYoutubeEmbed();
  }

  // Initialize common utilities and components
  initUtils();
  loadNavbar();
  loadFooter();
  addFloatingWhatsappButton();

  // Initialize page-specific functionality
  const router = new Router();
  router.initializePages();

  // Initialize UI effects
  new UIEffects();

  // Initialize smooth scrolling with delayed setup for dynamic content
  setTimeout(() => {
    const smoothScroll = new SmoothScroll();
    
    // Re-apply smooth scrolling after footer loads
    setTimeout(() => {
      smoothScroll.reapply();
    }, 200);
  }, 300);
});

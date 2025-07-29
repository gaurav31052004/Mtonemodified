export class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    this.applySmoothScroll();
    this.handleCrossPageNavigation();
  }

  handleSmoothScroll = (anchor) => {
    // Remove existing listeners to prevent duplicates
    anchor.removeEventListener("click", anchor.smoothScrollHandler);

    anchor.smoothScrollHandler = (e) => {
      const href = anchor.getAttribute("href");
      if (!href) return;

      try {
        const url = new URL(href, window.location.origin);
        const isCurrentPage =
          url.pathname === window.location.pathname ||
          (url.pathname === "/" && window.location.pathname === "/index.html") ||
          (url.pathname === "/index.html" && window.location.pathname === "/");

        // Handle hash links on current page
        if (url.hash && isCurrentPage) {
          e.preventDefault();
          this.scrollToElement(url.hash);
        }
        // Handle cross-page navigation with hash
        else if (url.hash && !isCurrentPage) {
          sessionStorage.setItem("scrollTarget", url.hash);
        }
        // Handle simple hash links
        else if (href.startsWith("#")) {
          e.preventDefault();
          this.scrollToElement(href);
        }
      } catch (error) {
        // Handle as simple hash link if URL parsing fails
        if (href.startsWith("#")) {
          e.preventDefault();
          this.scrollToElement(href);
        }
      }
    };

    anchor.addEventListener("click", anchor.smoothScrollHandler);
  }

  scrollToElement(selector) {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      history.pushState(null, null, selector);
    }
  }

  applySmoothScroll() {
    document.querySelectorAll('a[href*="#"]').forEach(this.handleSmoothScroll);
    document.querySelectorAll('a[href^="#"]').forEach(this.handleSmoothScroll);
  }

  handleCrossPageNavigation() {
    const scrollTarget = sessionStorage.getItem("scrollTarget");
    if (scrollTarget) {
      sessionStorage.removeItem("scrollTarget");
      setTimeout(() => {
        const target = document.querySelector(scrollTarget);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          history.replaceState(null, null, scrollTarget);
        }
      }, 300);
    }
  }

  // Method to re-apply smooth scrolling (useful after dynamic content loads)
  reapply() {
    this.applySmoothScroll();
  }
}

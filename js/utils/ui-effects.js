export class UIEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupHeaderScrollEffect();
    this.setupScrollAnimations();
    this.setupParallaxEffect();
  }

  setupHeaderScrollEffect() {
    window.addEventListener("scroll", () => {
      const header = document.querySelector("#navbar header");
      if (header) {
        if (window.scrollY > 100) {
          Object.assign(header.style, {
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(18px) saturate(180%)",
            webkitBackdropFilter: "blur(18px) saturate(180%)",
            boxShadow: "0 2px 24px 0 rgba(80,80,80,0.07)",
            borderBottom: "1.5px solid rgba(255,215,0,0.13)"
          });
        } else {
          Object.assign(header.style, {
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px) saturate(120%)",
            webkitBackdropFilter: "blur(8px) saturate(120%)",
            boxShadow: "none",
            borderBottom: "1.5px solid rgba(255,215,0,0.09)"
          });
        }
      }
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          Object.assign(entry.target.style, {
            opacity: "1",
            transform: "translateY(0)"
          });
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(".feature-card, .pricing-card, .why-section")
      .forEach((el) => {
        Object.assign(el.style, {
          opacity: "0",
          transform: "translateY(30px)",
          transition: "opacity 0.8s ease, transform 0.8s ease"
        });
        observer.observe(el);
      });
  }

  setupParallaxEffect() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const particles = document.querySelectorAll(".animate-float");
      particles.forEach((particle, index) => {
        const speed = 0.5 + index * 0.1;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }
}

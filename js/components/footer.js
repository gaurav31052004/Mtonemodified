export function loadFooter() {
  const footer = `
    <style>
      /* ── FOOTER RESPONSIVE ── */
      #mt-footer {
        background: #fff;
        border-top: 1px solid #E8E8E8;
        padding: 48px 0 0;
        box-sizing: border-box;
        width: 100%;
      }

      #mt-footer-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 20px;
        box-sizing: border-box;
      }

      /* Top grid */
      #mt-footer-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 32px;
        padding-bottom: 36px;
      }

      /* Tablet 640px+ → 2 cols */
      @media (min-width: 640px) {
        #mt-footer-grid {
          grid-template-columns: 1fr 1fr;
          gap: 36px 32px;
        }
      }

      /* Laptop 1024px+ → 4 cols */
      @media (min-width: 1024px) {
        #mt-footer-inner { padding: 0 40px; }
        #mt-footer-grid {
          grid-template-columns: 260px 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 48px;
        }
      }

      @media (min-width: 1280px) {
        #mt-footer-inner { padding: 0 48px; }
        #mt-footer-grid {
          grid-template-columns: 280px 1fr 1fr 1fr;
        }
      }

      /* Footer columns */
      .ft-col h3 {
        font-family: 'DM Sans', sans-serif;
        font-weight: 900;
        font-size: 15px;
        color: #282B27;
        margin: 0 0 16px;
        line-height: 1.2;
      }

      .ft-col ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .ft-col ul li a {
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        color: #000000;
        text-decoration: none;
        transition: color 0.2s;
      }

      .ft-col ul li a:hover { color: #FAAD13; }

      /* Contact col */
      .ft-contact-block { display: flex; flex-direction: column; gap: 14px; }
      .ft-contact-label {
        font-family: 'DM Sans', sans-serif;
        font-weight: 700;
        font-size: 12px;
        color: #282B27;
        margin: 0 0 4px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      .ft-contact-val {
        display: block;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        color: #FAAD13;
        text-decoration: none;
        line-height: 1.6;
        margin-bottom: 2px;
        transition: opacity 0.2s;
        word-break: break-word;
      }
      .ft-contact-val:hover { opacity: 0.8; }

      /* Divider */
      #mt-footer-divider {
        border: none;
        border-top: 1px solid #E8E8E8;
        margin: 0;
      }

      /* Bottom bar */
      #mt-footer-bottom {
        padding: 16px 0 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        align-items: flex-start;
      }

      @media (min-width: 768px) {
        #mt-footer-bottom {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
      }

      #mt-footer-copyright {
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        font-size: 13px;
        color: #000000;
        margin: 0;
        line-height: 1.4;
      }

      #mt-footer-bottom-links {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }

      #mt-footer-bottom-links a {
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        font-size: 13px;
        color: #000000;
        text-decoration: none;
        transition: color 0.2s;
      }

      #mt-footer-bottom-links a:hover { color: #FAAD13; }

      /* Social icons */
      #mt-footer-socials {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      #mt-footer-socials a {
        color: #000;
        display: flex;
        align-items: center;
        transition: color 0.2s;
      }

      #mt-footer-socials a:hover { color: #FAAD13; }

      /* Logo */
      #mt-footer-logo {
        height: 56px;
        width: auto;
        display: block;
        margin-bottom: 14px;
      }
/* Mobile — chota */
#mt-footer-logo {
  height: 36px;
  width: auto;
  max-width: 140px;
  display: block;
  margin-bottom: 14px;
}

/* Tablet 640px+ */
@media (min-width: 640px) {
  #mt-footer-logo { height: 44px; max-width: 180px; }
}

/* Laptop/Desktop 1024px+ — full size */
@media (min-width: 1024px) {
  #mt-footer-logo { height: 56px; max-width: 220px; }
}
      #mt-footer-desc {
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        font-size: 13.5px;
        line-height: 1.55;
        color: #000000;
        margin: 0;
        max-width: 240px;
      }

      /* Active / hover on quick links */
      .footer-quick-link:hover { color: #FAAD13 !important; }
      .footer-feature-link { transition: color 0.2s; }
      .footer-feature-link:hover, .footer-feature-link.active {
        color: #FAAD13 !important;
        font-weight: 600;
      }
    </style>

    <footer id="mt-footer">
      <div id="mt-footer-inner">

        <!-- Top Grid -->
        <div id="mt-footer-grid">

          <!-- Logo + Desc -->
          <div class="ft-col">
            <img
              src="https://res.cloudinary.com/df1kus7ro/image/upload/f_auto,q_auto,w_108/v1760446123/Group_107_2_cqvu6b.png"
              alt="MT One Logo"
              id="mt-footer-logo"
              width="108"
              height="56"
            />
            <p id="mt-footer-desc">
              MT One is a real estate CRM platform designed to help builders and sales teams manage leads, follow-ups, site visits, and booking conversions efficiently.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="ft-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/terms-conditions" class="footer-quick-link">Terms of Use</a></li>
              <li><a href="/privacypolicy" class="footer-quick-link">Privacy Policy</a></li>
              <li><a href="/#pricing" class="footer-quick-link">Pricing Plans</a></li>
              <li><a href="/about" class="footer-quick-link">About Us</a></li>
              <li><a href="/contact" class="footer-quick-link">Contact</a></li>
              <li><a href="/faq" class="footer-quick-link">FAQs</a></li>
            </ul>
          </div>

          <!-- Features -->
          <div class="ft-col">
            <h3>Features</h3>
            <ul>
              <li><a href="/#features-detail" class="footer-feature-link">Lead Management</a></li>
              <li><a href="/#features-detail" class="footer-feature-link">Site Visit Tracking</a></li>
              <li><a href="/#features-detail" class="footer-feature-link">WhatsApp Integration</a></li>
              <li><a href="/#features-detail" class="footer-feature-link">Inventory Management</a></li>
              <li><a href="/#features-detail" class="footer-feature-link">Sales Team Tracking</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="ft-col">
            <h3>Contact</h3>
            <div class="ft-contact-block">
              <div>
                <p class="ft-contact-label">Phone</p>
                <a href="tel:+917303062845" class="ft-contact-val">+91-73030-62845</a>
                <a href="tel:+919718361550" class="ft-contact-val">+91-97183-61550</a>
              </div>
              <div>
                <p class="ft-contact-label">Email</p>
                <a href="mailto:info@mtone.in" class="ft-contact-val">info@mtone.in</a>
              </div>
              <div>
                <p class="ft-contact-label">Address</p>
                <span class="ft-contact-val" style="cursor:default;">
                  C-116 GF, OfficeOn, Sector 2,<br>Noida, Uttar Pradesh - 201301
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- Divider -->
        <hr id="mt-footer-divider" />

        <!-- Bottom Bar -->
        <div id="mt-footer-bottom">
          <p id="mt-footer-copyright">
            © 2025 MT One. All rights reserved. Built for Real Estate Sales Teams.
          </p>

          <div id="mt-footer-bottom-links">
           

            <div id="mt-footer-socials">
              <!-- LinkedIn -->
              <a href="#" aria-label="LinkedIn" style="color: #000;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <!-- YouTube -->
              <a href="#" aria-label="YouTube" style="color: #000;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                </svg>
              </a>
              <!-- Facebook -->
              <a href="#" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <!-- Instagram -->
              <a href="#" aria-label="Instagram" style="color: #000;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <!-- X / Twitter -->
              <a href="#" aria-label="X (Twitter)" style="color: #000;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  `;

  const footerContainer = document.getElementById("footer");
  if (!footerContainer) return;
  footerContainer.innerHTML = footer;

  // ── Active Quick Links highlight ──
  document.querySelectorAll(".footer-quick-link").forEach((link) => {
    try {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      if (linkPath === window.location.pathname) {
        link.style.color = "#FAAD13";
        link.style.fontWeight = "700";
      }
    } catch (e) {}
  });

  // ── Active Feature Links highlight ──
  document.querySelectorAll(".footer-feature-link").forEach((link) => {
    link.addEventListener("click", function () {
      document.querySelectorAll(".footer-feature-link").forEach((l) =>
        l.classList.remove("active")
      );
      this.classList.add("active");
    });
  });

  if (window.location.hash === "#features-detail") {
    document
      .querySelectorAll(".footer-feature-link")
      .forEach((l) => l.classList.add("active"));
  }
}
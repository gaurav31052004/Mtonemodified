// SignupController.js
import { partnerService } from "../services/partner-service.js";

export default class SignupController {
  constructor() {
    this.form = document.getElementById("signup-form");
    this.partnerZoneCardsContainer = document.getElementById("partner-zone-cards");
    this.partnerZoneInput = document.getElementById("partner-zone");
    this.successModal = document.getElementById("su-success-modal");
    this.modalCloseBtn = document.getElementById("su-modal-close");
    this.init();
  }

  async init() {
    await this.renderPartnerZoneCards();

    if (this.form) {
      this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }

    // Modal close handlers
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener("click", () => this.hideModal());
    }
    if (this.successModal) {
      this.successModal.addEventListener("click", (e) => {
        if (e.target === this.successModal) this.hideModal();
      });
    }
  }

  /* ------------------------------------------------------------------
     ZONE CARDS — renders dynamically from partnerService
  ------------------------------------------------------------------ */
  async renderPartnerZoneCards() {
    if (!this.partnerZoneCardsContainer || !this.partnerZoneInput) return;

    this.partnerZoneCardsContainer.innerHTML =
      '<div style="color:#6B7280;font-size:13px;padding:8px 0;">Loading zones…</div>';

    try {
      const partners = await partnerService.getPartnerLocations();

      if (partners && partners.length > 0) {
        // Keep the su-zone-grid class from HTML, just fill the cards
        this.partnerZoneCardsContainer.innerHTML = partners
          .map(
            (partner) => `
            <div class="partner-card relative flex flex-col items-center justify-center p-2 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 bg-white hover:border-gold hover:shadow-md min-h-[80px] group overflow-hidden"
              data-id="${partner.masterDetailName}"
              data-name="${partner.masterDetailName}"
              tabindex="0"
              role="radio"
              aria-checked="false">
              <!-- Selection dot -->
              <div class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full border-2 border-gray-300 bg-white transition-all duration-200 hidden z-10 select-indicator">
                <svg class="absolute inset-0 w-2.5 h-2.5 m-auto text-white opacity-0 transition-opacity duration-200 select-check" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <img src="${partner.iconUrl}" alt="${partner.masterDetailName}" class="w-7 h-7 object-contain mb-1 rounded-md flex-shrink-0">
              <span class="text-xs font-semibold text-gray-800 text-center leading-tight px-1 line-clamp-2">${partner.masterDetailName}</span>
            </div>`
          )
          .join("");

        this.partnerZoneCardsContainer.querySelectorAll(".partner-card").forEach((card) => {
          card.addEventListener("click", () => this.selectZone(card));
          card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this.selectZone(card); }
          });
        });

      } else {
        this.partnerZoneCardsContainer.innerHTML =
          '<div style="color:#6B7280;font-size:13px;">No zones available</div>';
      }
    } catch {
      this.partnerZoneCardsContainer.innerHTML =
        '<div style="color:#EF4444;font-size:13px;">Failed to load zones. Please refresh.</div>';
    }
  }

  selectZone(selectedCard) {
    // Deselect all
    this.partnerZoneCardsContainer.querySelectorAll(".partner-card").forEach((c) => {
      c.classList.remove("border-gold", "shadow-md");
      c.setAttribute("aria-checked", "false");
      const dot = c.querySelector(".select-indicator");
      const check = c.querySelector(".select-check");
      if (dot) { dot.classList.add("hidden"); dot.classList.remove("bg-yellow-400", "border-gold"); }
      if (check) { check.classList.add("opacity-0"); check.classList.remove("opacity-100"); }
    });

    // Select clicked
    selectedCard.classList.add("border-gold", "shadow-md");
    selectedCard.setAttribute("aria-checked", "true");
    const dot = selectedCard.querySelector(".select-indicator");
    const check = selectedCard.querySelector(".select-check");
    if (dot) { dot.classList.remove("hidden"); dot.classList.add("bg-yellow-400", "border-gold"); }
    if (check) { check.classList.remove("opacity-0"); check.classList.add("opacity-100"); }

    this.partnerZoneInput.value = selectedCard.dataset.id;

    // Clear zone error if shown
    const zoneErr = document.getElementById("error-zone");
    if (zoneErr) zoneErr.textContent = "";

    if (navigator.vibrate) navigator.vibrate(50);
  }

  /* ------------------------------------------------------------------
     FORM SUBMISSION — your original logic, untouched
  ------------------------------------------------------------------ */
  async handleSubmit(e) {
    e.preventDefault();

    const name = this.form.name.value.trim();
    const email = this.form.email.value.trim();
    const phone = this.form.phone.value.trim();
    const partnerZone = this.form["partner-zone"].value;
    const address = partnerZone;

    // Clear previous inline errors
    this.clearInlineErrors();

    let valid = true;

    if (!name) {
      this.setFieldError("name", "Your name is required."); valid = false;
    } else if (name.length < 3 || name.length > 50) {
      this.setFieldError("name", "Name must be 3–50 characters."); valid = false;
    }

    if (!email) {
      this.setFieldError("email", "Email is required."); valid = false;
    } else if (!this.isValidEmail(email)) {
      this.setFieldError("email", "Please enter a valid email address."); valid = false;
    }

    if (!phone) {
      this.setFieldError("phone", "Phone number is required."); valid = false;
    } else if (!this.isValidPhone(phone)) {
      this.setFieldError("phone", "Please enter a valid 10-digit phone number."); valid = false;
    }

    if (!partnerZone) {
      const zoneErr = document.getElementById("error-zone");
      if (zoneErr) zoneErr.textContent = "Please select an agent/builder zone.";
      valid = false;
    }

    if (!valid) return;

    this.setSubmitButtonState(true, "Creating Account…");

    try {
      const response = await partnerService.partnerSignup(name, email, phone, address, partnerZone);

      if (response.success) {
        // Show premium success modal
        this.showModal("Welcome to MT One. Your account has been created. Redirecting you now…");

        const userDetails = { name, email, phone, address, partnerZone, userDetails: response.data || {} };
        localStorage.setItem("partnerDetails", JSON.stringify(userDetails));

        this.form.reset();
        this.partnerZoneInput.value = "";
        this.clearSelectedCards();

        setTimeout(() => {
          window.location.href = "/choose-plan/";
        }, 2000);

      } else {
        this.showError(response.message || "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      let msg = "An error occurred. Please try again.";
      if (error.message) msg = error.message;
      else if (error.status === 409) msg = "An account with this email already exists. Please log in instead.";
      else if (error.status === 400) msg = "Invalid data. Please check your information.";
      else if (error.status === 500) msg = "Server error. Please try again later.";
      else if (!navigator.onLine) msg = "No internet connection. Please check and retry.";
      this.showError(msg);
    } finally {
      this.setSubmitButtonState(false, "Sign Up");
    }
  }

  /* ------------------------------------------------------------------
     VALIDATION HELPERS
  ------------------------------------------------------------------ */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
  }

  /* ------------------------------------------------------------------
     INLINE FIELD ERRORS (new premium style)
  ------------------------------------------------------------------ */
  setFieldError(fieldName, message) {
    const group = document.getElementById(`group-${fieldName}`);
    const errEl = document.getElementById(`error-${fieldName}`);
    if (group) group.classList.add("su-has-error");
    if (errEl) errEl.textContent = message;

    // Auto-clear on next input
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.addEventListener("input", () => {
        if (group) group.classList.remove("su-has-error");
        if (errEl) errEl.textContent = "";
      }, { once: true });
    }
  }

  clearInlineErrors() {
    ["name", "email", "phone"].forEach((f) => {
      const group = document.getElementById(`group-${f}`);
      const errEl = document.getElementById(`error-${f}`);
      if (group) group.classList.remove("su-has-error");
      if (errEl) errEl.textContent = "";
    });
    const zoneErr = document.getElementById("error-zone");
    if (zoneErr) zoneErr.textContent = "";
  }

  /* ------------------------------------------------------------------
     SUBMIT BUTTON STATE
  ------------------------------------------------------------------ */
  setSubmitButtonState(isLoading, text) {
    const btn = this.form.querySelector('button[type="submit"]');
    if (!btn) return;

    btn.disabled = isLoading;
    this.form.querySelectorAll("input, select, textarea").forEach((el) => (el.disabled = isLoading));

    if (isLoading) {
      btn.innerHTML = `
        <span style="display:inline-flex;align-items:center;justify-content:center;gap:10px;">
          <svg style="animation:spin 1s linear infinite;width:18px;height:18px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle style="opacity:.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path style="opacity:.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          ${text}
        </span>`;
      this.partnerZoneCardsContainer.style.pointerEvents = "none";
      this.partnerZoneCardsContainer.style.opacity = "0.5";
    } else {
      btn.innerHTML = text;
      this.partnerZoneCardsContainer.style.pointerEvents = "auto";
      this.partnerZoneCardsContainer.style.opacity = "1";
    }
  }

  /* ------------------------------------------------------------------
     TOAST ERROR (for API-level errors, shown below the form)
  ------------------------------------------------------------------ */
  showError(message) {
    this.removeToast();
    const div = document.createElement("div");
    div.id = "su-toast-error";
    div.style.cssText =
      "background:#FEF2F2;border:1px solid #FECACA;color:#B91C1C;padding:12px 16px;border-radius:10px;margin-top:16px;font-size:13.5px;display:flex;align-items:flex-start;gap:10px;";
    div.innerHTML = `
      <svg style="width:16px;height:16px;flex-shrink:0;margin-top:1px;" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
      </svg>
      <span>${message}</span>`;
    this.form.appendChild(div);
    setTimeout(() => this.removeToast(), 5000);
  }

  removeToast() {
    const t = document.getElementById("su-toast-error");
    if (t) t.remove();
  }

  /* ------------------------------------------------------------------
     SUCCESS MODAL
  ------------------------------------------------------------------ */
  showModal(message) {
    const msgEl = document.getElementById("su-modal-msg");
    if (msgEl) msgEl.textContent = message;
    if (this.successModal) this.successModal.classList.add("su-show");
  }

  hideModal() {
    if (this.successModal) this.successModal.classList.remove("su-show");
  }

  /* ------------------------------------------------------------------
     CLEAR SELECTED ZONE CARDS
  ------------------------------------------------------------------ */
  clearSelectedCards() {
    this.partnerZoneCardsContainer.querySelectorAll(".partner-card").forEach((card) => {
      card.classList.remove("border-gold", "shadow-md");
      card.setAttribute("aria-checked", "false");
      const dot = card.querySelector(".select-indicator");
      const check = card.querySelector(".select-check");
      if (dot) { dot.classList.add("hidden"); dot.classList.remove("bg-yellow-400", "border-gold"); }
      if (check) { check.classList.add("opacity-0"); check.classList.remove("opacity-100"); }
    });
  }
}
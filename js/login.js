import { EmailOTPLoginModule } from "./controllers/email-otp-login.js";
import PartnerAuthHandler from "./controllers/partner-auth-handler.js";

class PartnerLoginModule extends EmailOTPLoginModule {
  constructor() {
    super(new PartnerAuthHandler(), {
      showBackButtonOnFirstStep: false
    });
    this.init();

    // Initialize floating label + caret UX for new login UI
    this._initFloatingLabel();
  }

  // Optional: Override any partner-specific behavior
  async performModuleSpecificSetup() {
    // Partner-specific setup if needed
    console.log("Setting up partner login");
  }

  /**
   * Floating label & orange caret UX for the new login HTML.
   * Watches #email input and adds .focused / .has-content
   * to its parent .lp-input-group so CSS transitions work.
   */
  _initFloatingLabel() {
    const emailInput = document.getElementById("email");
    const emailGroup = document.getElementById("lp-email-group");

    if (!emailInput || !emailGroup) return;

    emailInput.addEventListener("focus", () => {
      emailGroup.classList.add("focused");
    });

    emailInput.addEventListener("blur", () => {
      emailGroup.classList.remove("focused");
      // Keep label floated if there's a value
      if (emailInput.value.trim() !== "") {
        emailGroup.classList.add("has-content");
      } else {
        emailGroup.classList.remove("has-content");
      }
    });

    emailInput.addEventListener("input", () => {
      if (emailInput.value.trim() !== "") {
        emailGroup.classList.add("has-content");
      } else {
        emailGroup.classList.remove("has-content");
      }
    });
  }
}

export default PartnerLoginModule;

// Auto-instantiate when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new PartnerLoginModule();
});
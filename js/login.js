import { initUtils } from "./components/utils.js";
import AuthHandler from "./services/partner-auth-handler.js";
import { partnerService } from "./services/api.js";

/**
 * Login Module - handles partner login page functionality
 */
class LoginModule {
  constructor() {
    this.authHandler = new AuthHandler();
    this.currentStep = "partner-selection";
  }

  /**
   * Initialize login module
   */
  async init() {
    // Initialize utilities (FontAwesome, etc.)
    initUtils();

    // Setup login functionality
    await this.setupLogin();

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup login page functionality
   */
  async setupLogin() {
    try {
      this.showLoading(true);

      // Initialize auth handler
      this.authHandler.init();

      // Setup auth handler override
      this.setupAuthHandlerOverride();

      // Load and render partner selection
      await this.renderPartnerSelection();
      
      // Update initial display
      this.updateStepDisplay();
      this.updateStepIndicators();
    } catch (error) {
      console.error("Failed to setup login:", error);
      this.showError(
        "Failed to load login page. Please refresh and try again.",
      );
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Back button
    const backButton = document.getElementById("back-button");
    if (backButton) {
      backButton.addEventListener("click", () => this.handleBackButton());
    }

    // Email form
    const emailForm = document.getElementById("email-form");
    if (emailForm) {
      emailForm.addEventListener("submit", (e) => this.handleEmailSubmit(e));
    }

    // OTP form
    const otpForm = document.getElementById("otp-form");
    if (otpForm) {
      otpForm.addEventListener("submit", (e) => this.handleOTPSubmit(e));
    }

    // Email input validation
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.addEventListener("input", () => this.validateEmailInput());
      emailInput.addEventListener("blur", () => this.validateEmailInput());
    }

    // OTP input formatting
    const otpInput = document.getElementById("otp");
    if (otpInput) {
      otpInput.addEventListener("input", (e) => this.formatOTPInput(e));
    }

    // Resend OTP
    const resendOTP = document.getElementById("resend-otp");
    if (resendOTP) {
      resendOTP.addEventListener("click", () => this.handleResendOTP());
    }
  }

  /**
   * Setup AuthHandler override to work with our UI
   */
  setupAuthHandlerOverride() {
    // Override step navigation
    const originalUpdateUI = this.authHandler.updateUI.bind(this.authHandler);
    this.authHandler.updateUI = () => {
      // Sync the current step from AuthHandler
      this.currentStep = this.authHandler.currentStep;
      this.updateStepDisplay();
      this.updateStepIndicators();
    };

    // Override partner selection
    this.authHandler.selectPartner = (partner) => {
      this.authHandler.selectedPartner = partner;
      this.authHandler.currentStep = "email-input";
      this.currentStep = "email-input";
      this.authHandler.updateUI();
    };
  }

  /**
   * Render partner selection cards
   */
  async renderPartnerSelection() {
    const container = document.getElementById("partner-selection");
    if (!container) return;

    try {
      this.showLoading(true);

      const partners = await partnerService.getPartnerLocations();

      if (partners && partners.length > 0) {
        const partnersHTML = partners
          .map((partner) => {
            return `
            <div class="partner-card flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 bg-white hover:border-gold hover:-translate-y-0.5 hover:shadow-md" 
                 data-partner='${JSON.stringify(partner)}'>
              <img src="${partner.iconUrl}" 
                   alt="${partner.masterDetailName}" 
                   class="w-8 h-8 object-contain mr-3 rounded-lg">
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-gray-800 mb-0.5">${partner.masterDetailName}</h3>
                <p class="text-gray-600 text-xs">${partner.domain}</p>
              </div>
            </div>
          `;
          })
          .join("");

        container.innerHTML = partnersHTML;

        // Add click event listeners to partner cards
        container.querySelectorAll(".partner-card").forEach((card) => {
          card.addEventListener("click", () => {
            const partnerData = JSON.parse(card.dataset.partner);
            this.selectPartner(partnerData);
          });
        });
      } else {
        throw new Error("No partners found");
      }
    } catch (error) {
      console.error("Error loading partners:", error);
      container.innerHTML = `
        <div class="text-center p-4 text-red-600">
          <p class="mb-2 text-sm">Failed to load partner locations</p>
          <button onclick="location.reload()" class="text-gold underline text-sm">Retry</button>
        </div>
      `;
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Handle partner selection
   */
  selectPartner(partner) {
    // Remove previous selections
    document.querySelectorAll(".partner-card").forEach((card) => {
      card.classList.remove("border-gold", "bg-orange-50");
    });

    // Add selection to clicked card
    event.target
      .closest(".partner-card")
      .classList.add("border-gold", "bg-orange-50");

    // Store partner data and proceed
    this.authHandler.selectPartner(partner);
  }

  /**
   * Handle back button
   */
  handleBackButton() {
    if (this.currentStep === "email-input") {
      this.currentStep = "partner-selection";
      this.authHandler.currentStep = "partner-selection";
      
      // Clear selected partner when going back
      this.authHandler.selectedPartner = null;
      
      // Clear localStorage for selected partner
      localStorage.removeItem('mt_selected_partner');
      
      // Clear email input
      const emailInput = document.getElementById("email");
      if (emailInput) {
        emailInput.value = "";
      }
      
      // Hide email error if showing
      this.hideEmailError();
      
    } else if (this.currentStep === "otp-verification") {
      this.currentStep = "email-input";
      this.authHandler.currentStep = "email-input";
      
      // Stop OTP timer when going back
      if (this.authHandler.stopOTPTimer) {
        this.authHandler.stopOTPTimer();
      }
      
      // Clear OTP input
      const otpInput = document.getElementById("otp");
      if (otpInput) {
        otpInput.value = "";
      }
      
      // Hide OTP timer and resend button
      const otpTimer = document.getElementById("otp-timer");
      const resendOtp = document.getElementById("resend-otp");
      if (otpTimer) otpTimer.classList.add("hidden");
      if (resendOtp) resendOtp.classList.add("hidden");
    }

    this.updateStepDisplay();
    this.updateStepIndicators();
  }

  /**
   * Handle resend OTP (override to call auth handler)
   */
  async handleResendOTP() {
    try {
      await this.authHandler.handleResendOTP();
      this.showSuccess("OTP sent successfully!");
    } catch (error) {
      this.showError(error.message || "Failed to resend OTP");
    }
  }

  /**
   * Handle email form submission
   */
  async handleEmailSubmit(e) {
    e.preventDefault();

    if (!this.validateEmailInput()) {
      return;
    }

    try {
      this.setButtonLoading("send-otp-btn", true);
      await this.authHandler.handleEmailSubmit();
    } catch (error) {
      this.showError(error.message || "Failed to send OTP");
    } finally {
      this.setButtonLoading("send-otp-btn", false);
    }
  }

  /**
   * Handle OTP form submission
   */
  async handleOTPSubmit(e) {
    e.preventDefault();

    try {
      this.setButtonLoading("verify-otp-btn", true);
      await this.authHandler.handleOTPSubmit();
    } catch (error) {
      this.showError(error.message || "Failed to verify OTP");
    } finally {
      this.setButtonLoading("verify-otp-btn", false);
    }
  }

  /**
   * Validate email input
   */
  validateEmailInput() {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");

    if (!emailInput || !emailError) return false;

    const email = emailInput.value.trim();
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    if (!email) {
      this.showEmailError("Email is required");
      return false;
    }

    if (!emailRegex.test(email)) {
      this.showEmailError("Please enter a valid email address");
      return false;
    }

    this.hideEmailError();
    return true;
  }

  /**
   * Show email error
   */
  showEmailError(message) {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");

    if (emailInput) {
      emailInput.classList.remove("border-gray-200", "focus:border-gold");
      emailInput.classList.add("border-red-500", "focus:border-red-500");
    }

    if (emailError) {
      emailError.textContent = message;
      emailError.classList.remove("hidden");
    }
  }

  /**
   * Hide email error
   */
  hideEmailError() {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");

    if (emailInput) {
      emailInput.classList.remove("border-red-500", "focus:border-red-500");
      emailInput.classList.add("border-gray-200", "focus:border-gold");
    }

    if (emailError) {
      emailError.classList.add("hidden");
    }
  }

  /**
   * Format OTP input
   */
  formatOTPInput(e) {
    const input = e.target;
    const value = input.value.replace(/\D/g, ""); // Remove non-digits
    input.value = value;
  }

  /**
   * Set button loading state
   */
  setButtonLoading(buttonId, loading) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    if (loading) {
      button.disabled = true;
      button.innerHTML = `
        <div class="flex items-center justify-center gap-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Loading...</span>
        </div>
      `;
    } else {
      button.disabled = false;
      if (buttonId === "send-otp-btn") {
        button.textContent = "Send OTP";
      } else if (buttonId === "verify-otp-btn") {
        button.textContent = "Verify OTP";
      }
    }
  }

  /**
   * Show loading state
   */
  showLoading(show) {
    const loading = document.getElementById("loading");
    if (!loading) return;

    if (show) {
      loading.classList.remove("hidden");
    } else {
      loading.classList.add("hidden");
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showMessage(message, "error");
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    this.showMessage(message, "success");
  }

  /**
   * Show message
   */
  showMessage(message, type) {
    // Use toast notification
    this.showToast(message, type);
  }

  /**
   * Show toast notification
   */
  showToast(message, type) {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full opacity-0';
    
    // Set toast styling based on type
    if (type === 'error') {
      toast.classList.add('bg-red-500', 'text-white');
      toast.innerHTML = `
        <div class="flex items-center">
          <i class="fas fa-exclamation-circle mr-2"></i>
          <span>${message}</span>
        </div>
      `;
    } else if (type === 'success') {
      toast.classList.add('bg-green-500', 'text-white');
      toast.innerHTML = `
        <div class="flex items-center">
          <i class="fas fa-check-circle mr-2"></i>
          <span>${message}</span>
        </div>
      `;
    }

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ml-4 text-white hover:text-gray-200';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => this.hideToast(toast);
    toast.querySelector('div').appendChild(closeBtn);

    // Add to body
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 10);

    // Auto hide after 5 seconds
    setTimeout(() => {
      this.hideToast(toast);
    }, 5000);
  }

  /**
   * Hide toast notification
   */
  hideToast(toast) {
    if (toast && toast.parentNode) {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }

  /**
   * Update step display
   */
  updateStepDisplay() {
    const steps = ["partner-selection", "email-input", "otp-verification"];
    const backButton = document.getElementById("back-button");
    
    // Elements to show/hide during partner selection
    const headerSection = document.querySelector(".text-center.mt-8.mb-6");
    const logoSection = document.querySelector(".text-center.mb-8");
    const partnerSelectionHeader = document.querySelector("#partner-selection-step .text-center.mb-6");

    // Hide all steps first
    steps.forEach((stepId) => {
      const element = document.getElementById(`${stepId}-step`);
      if (element) {
        element.classList.add("hidden");
      }
    });

    // Show current step
    const currentStepElement = document.getElementById(`${this.currentStep}-step`);
    if (currentStepElement) {
      currentStepElement.classList.remove("hidden");
    }

    // Show/hide back button
    if (backButton) {
      if (this.currentStep === "partner-selection") {
        backButton.classList.add("hidden");
      } else {
        backButton.classList.remove("hidden");
      }
    }

    // Update header content based on current step
    if (this.currentStep === "partner-selection") {
      // Show elements during partner selection
      if (headerSection) headerSection.classList.remove("hidden");
      if (logoSection) logoSection.classList.remove("hidden");
      if (partnerSelectionHeader) {
        partnerSelectionHeader.classList.remove("hidden");
        // Update the heading text for partner selection
        const heading = partnerSelectionHeader.querySelector("h2");
        const subheading = partnerSelectionHeader.querySelector("p");
        if (heading) heading.textContent = "Select your zone";
        if (subheading) subheading.textContent = "Choose your partner location to continue";
      }
      // Clear any selected partner cards
      document.querySelectorAll(".partner-card").forEach((card) => {
        card.classList.remove("border-gold", "bg-orange-50");
      });
    } else if (this.currentStep === "email-input") {
      // Show elements for email input step
      if (headerSection) headerSection.classList.remove("hidden");
      if (logoSection) logoSection.classList.remove("hidden");
      if (partnerSelectionHeader) {
        partnerSelectionHeader.classList.add("hidden");
      }
    } else {
      // Show elements for other steps (OTP verification)
      if (headerSection) headerSection.classList.remove("hidden");
      if (logoSection) logoSection.classList.remove("hidden");
      if (partnerSelectionHeader) partnerSelectionHeader.classList.add("hidden");
    }
  }

  /**
   * Update step indicators
   */
  updateStepIndicators() {
    const stepMapping = {
      "partner-selection": 1,
      "email-input": 2,
      "otp-verification": 3,
    };

    const currentStepNumber = stepMapping[this.currentStep];

    for (let i = 1; i <= 3; i++) {
      const dot = document.getElementById(`step-dot-${i}`);
      if (dot) {
        if (i <= currentStepNumber) {
          dot.classList.remove("bg-gray-300");
          dot.classList.add("bg-gold");
        } else {
          dot.classList.remove("bg-gold");
          dot.classList.add("bg-gray-300");
        }
      }
    }
  }

}

// Initialize login page when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const loginModule = new LoginModule();
  await loginModule.init();
});

export default LoginModule;

import { initUtils } from "./components/utils.js";
import AdminAuthHandler from "./services/admin-auth-handler.js";

/**
 * Admin Login Module - handles admin login page functionality
 */
class AdminLoginModule {
  constructor() {
    this.authHandler = new AdminAuthHandler();
    this.currentStep = "email-input";
  }

  /**
   * Initialize admin login module
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
   * Setup admin login page functionality
   */
  async setupLogin() {
    try {
      this.showLoading(true);

      // Initialize auth handler
      this.authHandler.init();

      // Setup auth handler override
      this.setupAuthHandlerOverride();

      // Update initial display
      this.updateStepDisplay();
      this.updateStepIndicators();
    } catch (error) {
      console.error("Failed to setup admin login:", error);
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

    // Override UI feedback methods to use our toast system
    this.authHandler.showError = (message) => {
      this.showError(message);
    };

    this.authHandler.showSuccess = (message) => {
      this.showSuccess(message);
    };

    this.authHandler.showLoading = (message) => {
      this.showLoading(true);
    };

    this.authHandler.hideLoading = () => {
      this.showLoading(false);
    };

    // Override handleBackButton in AuthHandler if it exists
    if (this.authHandler.handleBackButton) {
      this.authHandler.handleBackButton = () => {
        this.handleBackButton();
      };
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
        button.innerHTML = "Send OTP";
      } else if (buttonId === "verify-otp-btn") {
        button.innerHTML = "Verify OTP";
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
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className =
      "toast-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full opacity-0";

    // Set toast styling based on type
    if (type === "error") {
      toast.classList.add("bg-red-500", "text-white");
      toast.innerHTML = `
        <div class="flex items-center">
          <i class="fas fa-exclamation-circle mr-2"></i>
          <span>${message}</span>
        </div>
      `;
    } else if (type === "success") {
      toast.classList.add("bg-green-500", "text-white");
      toast.innerHTML = `
        <div class="flex items-center">
          <i class="fas fa-check-circle mr-2"></i>
          <span>${message}</span>
        </div>
      `;
    }

    // Add close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "ml-4 text-white hover:text-gray-200";
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => this.hideToast(toast);
    toast.querySelector("div").appendChild(closeBtn);

    // Add to body
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove("translate-x-full", "opacity-0");
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
      toast.classList.add("translate-x-full", "opacity-0");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }

  /**
   * Handle back button
   */
  handleBackButton() {
    if (this.currentStep === "otp-verification") {
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
   * Handle resend OTP
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
   * Update step display
   */
  updateStepDisplay() {
    const steps = ["email-input", "otp-verification"];
    const backButton = document.getElementById("back-button");

    // Hide all steps first
    steps.forEach((stepId) => {
      const element = document.getElementById(`${stepId}-step`);
      if (element) {
        element.classList.add("hidden");
      }
    });

    // Show current step
    const currentStepElement = document.getElementById(
      `${this.currentStep}-step`,
    );
    if (currentStepElement) {
      currentStepElement.classList.remove("hidden");
    }

    // Show/hide back button
    if (backButton) {
      if (this.currentStep === "email-input") {
        backButton.classList.add("hidden");
      } else {
        backButton.classList.remove("hidden");
      }
    }
  }

  /**
   * Update step indicators
   */
  updateStepIndicators() {
    const stepMapping = {
      "email-input": 1,
      "otp-verification": 2,
    };

    const currentStepNumber = stepMapping[this.currentStep];

    for (let i = 1; i <= 2; i++) {
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
}

// Initialize admin login page when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const adminLoginModule = new AdminLoginModule();
  await adminLoginModule.init();
});

export default AdminLoginModule;

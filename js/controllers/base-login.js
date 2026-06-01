import { initUtils } from "../components/utils.js";

export class BaseLoginModule {
  constructor(authHandler, initialStep) {
    this.authHandler = authHandler;
    this.currentStep = initialStep;
  }

  async init() {
    // Initialize utilities (FontAwesome, etc.)
    initUtils();

    // Setup login functionality
    await this.setupLogin();

    // Setup event listeners
    this.setupEventListeners();
  }

  async setupLogin() {
    try {
      this.showLoading(true);

      // Initialize auth handler
      this.authHandler.init();

      // Setup auth handler override
      this.setupAuthHandlerOverride();

      // Perform any module-specific setup
      await this.performModuleSpecificSetup();

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

  // Override this in child classes for specific setup
  async performModuleSpecificSetup() {
    // Default implementation does nothing
  }

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

  setupAuthHandlerOverride() {
    // Override step navigation
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

  async handleResendOTP() {
    try {
      await this.authHandler.handleResendOTP();
      this.showSuccess("OTP sent successfully!");
    } catch (error) {
      this.showError(error.message || "Failed to resend OTP");
    }
  }

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
      this.authHandler.hideLoading(); // ✅ Ensure authHandler's loading is stopped
    }
  }

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

  formatOTPInput(e) {
    const input = e.target;
    const value = input.value.replace(/\D/g, ""); // Remove non-digits
    input.value = value;
  }

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

  showLoading(show) {
    const loading = document.getElementById("loading");
    if (!loading) return;

    if (show) {
      loading.classList.remove("lp-hidden");
    } else {
      loading.classList.add("lp-hidden");
    }
  }

  showError(message) {
    this.showMessage(message, "error");
  }

  showSuccess(message) {
    this.showMessage(message, "success");
  }

  showMessage(message, type) {
    // Use toast notification
    this.showToast(message, type);
  }

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

  // Abstract methods to be implemented by child classes
  getSteps() {
    throw new Error("getSteps() must be implemented by child class");
  }

  getStepMapping() {
    throw new Error("getStepMapping() must be implemented by child class");
  }

  getFirstStep() {
    throw new Error("getFirstStep() must be implemented by child class");
  }

  handleBackButton() {
    throw new Error("handleBackButton() must be implemented by child class");
  }

  updateStepDisplay() {
    throw new Error("updateStepDisplay() must be implemented by child class");
  }

  updateStepIndicators() {
    const stepMapping = this.getStepMapping();
    const currentStepNumber = stepMapping[this.currentStep];
    const totalSteps = Object.keys(stepMapping).length;

    for (let i = 1; i <= totalSteps; i++) {
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

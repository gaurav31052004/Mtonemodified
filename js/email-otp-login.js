import { BaseLoginModule } from "./components/base-login.js";

export class EmailOTPLoginModule extends BaseLoginModule {
  constructor(authHandler, config = {}) {
    super(authHandler, "email-input");
    this.config = {
      showBackButtonOnFirstStep: false,
      ...config,
    };
  }

  getSteps() {
    return ["email-input", "otp-verification"];
  }

  getStepMapping() {
    return {
      "email-input": 1,
      "otp-verification": 2,
    };
  }

  getFirstStep() {
    return "email-input";
  }

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
      this.hideOTPElements();
    }

    this.updateStepDisplay();
    this.updateStepIndicators();
  }

  hideOTPElements() {
    const otpTimer = document.getElementById("otp-timer");
    const resendOtp = document.getElementById("resend-otp");

    if (otpTimer) otpTimer.classList.add("hidden");
    if (resendOtp) resendOtp.classList.add("hidden");
  }

  updateStepDisplay() {
    const steps = this.getSteps();
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

    // Show/hide back button based on configuration
    this.updateBackButtonVisibility(backButton);
  }

  updateBackButtonVisibility(backButton) {
    if (!backButton) return;

    const shouldShowBackButton =
      this.config.showBackButtonOnFirstStep ||
      this.currentStep !== "email-input";

    if (shouldShowBackButton && this.currentStep !== "email-input") {
      backButton.classList.remove("hidden");
    } else {
      backButton.classList.add("hidden");
    }
  }
}

import { BaseLoginModule } from "./components/base-login.js";
import AdminAuthHandler from "./services/admin-auth-handler.js";

class AdminLoginModule extends BaseLoginModule {
  constructor() {
    super(new AdminAuthHandler(), "email-input");
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
      const otpTimer = document.getElementById("otp-timer");
      const resendOtp = document.getElementById("resend-otp");
      if (otpTimer) otpTimer.classList.add("hidden");
      if (resendOtp) resendOtp.classList.add("hidden");
    }

    this.updateStepDisplay();
    this.updateStepIndicators();
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
    const currentStepElement = document.getElementById(`${this.currentStep}-step`);
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
}

// Initialize admin login page when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const adminLoginModule = new AdminLoginModule();
  await adminLoginModule.init();
});

export default AdminLoginModule;

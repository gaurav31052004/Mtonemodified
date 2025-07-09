import { AuthUtils, OTPTimerManager } from "../utils/auth-utils.js";
import { partnerService } from "./partner-service.js";
import { StorageService } from "./storage-service.js";

class AuthHandler {
  constructor() {
    this.currentStep = "partner-selection";
    this.selectedPartner = null;
    this.userEmail = null;
    this.otpTimerManager = new OTPTimerManager();
  }

  init() {
    this.checkExistingAuth();
  }

  checkExistingAuth() {
    if (partnerService.isAuthenticated()) {
      const token = partnerService.getAuthToken();
      if (token) {
        this.redirectToApp(token);
        return;
      }
    }

    // Check if partner is already selected
    const selectedPartner = StorageService.getSelectedPartner();
    if (selectedPartner) {
      this.selectedPartner = selectedPartner;
      this.showEmailInput();
    }
  }

  selectPartner(partner) {
    this.selectedPartner = partner;
    StorageService.storeSelectedPartner(partner);
    this.showEmailInput();
  }

  showEmailInput() {
    this.currentStep = "email-input";
    this.updateUI();
  }

  async handleEmailSubmit() {
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    if (!AuthUtils.validateEmail(email)) {
      throw new Error("Please enter a valid email address");
    }

    if (!this.selectedPartner) {
      throw new Error("Please select a partner location first");
    }

    try {
      // First validate email with backend
      const response = await partnerService.checkEmail(email);

      // Check if user type is Partner
      if (response.data && response.data.userType !== "Partner") {
        throw new Error("Access denied. Only partner users can login here.");
      }

      // If email is valid partner, send OTP
      await partnerService.sendOTP(email, this.selectedPartner.domain);
      this.userEmail = email;
      this.showOTPInput();

      return { success: true, message: "OTP sent successfully to your email" };
    } catch (error) {
      throw error;
    }
  }

  showOTPInput() {
    this.currentStep = "otp-verification";
    this.updateUI();
    this.startOTPTimer();
  }

  async handleOTPSubmit() {
    const otpInput = document.getElementById("otp");
    const otp = otpInput.value.trim();

    const validation = AuthUtils.validateOTP(otp);
    if (!validation.valid) {
      this.showError(validation.error);
      return;
    }

    this.showLoading("Verifying OTP...");

    try {
      const response = await partnerService.verifyOTP(
        this.userEmail,
        otp,
        this.selectedPartner.domain,
      );

      if (response.success) {
        // Store authentication data
        partnerService.storeAuthData(response.token, this.userEmail);

        this.showSuccess("Login successful! Redirecting...");

        // Redirect after a short delay
        setTimeout(() => {
          this.redirectToApp(response.token);
        }, 100);
      }
    } catch (error) {
      this.showError(error.message || "Invalid OTP");
    } finally {
      this.hideLoading();
    }
  }

  handleBackButton() {
    if (this.currentStep === "otp-verification") {
      this.currentStep = "email-input";
      this.stopOTPTimer();
      this.updateUI();
    } else if (this.currentStep === "email-input") {
      this.currentStep = "partner-selection";
      StorageService.storeSelectedPartner(null);
      this.selectedPartner = null;
      this.updateUI();
    }
  }

  async handleResendOTP() {
    if (!this.userEmail || !this.selectedPartner) {
      this.showError("Session expired. Please start again.");
      return;
    }

    this.showLoading("Resending OTP...");

    try {
      await partnerService.sendOTP(this.userEmail, this.selectedPartner.domain);
      this.showSuccess("OTP resent successfully");
      this.startOTPTimer();
    } catch (error) {
      this.showError(error.message || "Failed to resend OTP");
    } finally {
      this.hideLoading();
    }
  }

  updateUI() {
    const steps = ["partner-selection", "email-input", "otp-verification"];
    AuthUtils.updateStepDisplay(this.currentStep, steps);
  }

  redirectToApp(token) {
    partnerService.redirectToApp(token);
  }

  reset() {
    this.currentStep = "partner-selection";
    this.selectedPartner = null;
    this.userEmail = null;
    this.stopOTPTimer();
    StorageService.clearAll();
    this.updateUI();
  }

  startOTPTimer() {
    this.otpTimerManager.start();
  }

  stopOTPTimer() {
    this.otpTimerManager.stop();
  }

  showLoading(message) {
    // This method is typically overridden by the UI module
    console.log("Loading:", message);
  }

  hideLoading() {
    // This method is typically overridden by the UI module
    console.log("Loading hidden");
  }

  showSuccess(message) {
    // This method is typically overridden by the UI module
    console.log("Success:", message);
  }

  showError(message) {
    // This method is typically overridden by the UI module
    console.error("Error:", message);
  }
}

export default AuthHandler;

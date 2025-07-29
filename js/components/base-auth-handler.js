import { AuthUtils, OTPTimerManager } from "../utils/auth-utils.js";

class BaseAuthHandler {
  constructor(config = {}) {
    this.currentStep = "email-input";
    this.userEmail = null;
    this.otpTimerManager = new OTPTimerManager();
    this.config = config;
    
    // Check for ?clearSession=true in search params
    const params = new URLSearchParams(window.location.search);
    this.disableAutoLogin = params.get('clearSession') === 'true';
    
    if (this.disableAutoLogin) {
      this.clearStorage();
    }
  }

  // Abstract methods that must be implemented by subclasses
  getAuthService() {
    throw new Error("getAuthService() must be implemented by subclass");
  }

  async validateEmailAndUserType(email) {
    throw new Error("validateEmailAndUserType() must be implemented by subclass");
  }

  redirectToApp(token) {
    throw new Error("redirectToApp() must be implemented by subclass");
  }

  clearStorage() {
    throw new Error("clearStorage() must be implemented by subclass");
  }

  // Common methods
  init() {
    this.checkExistingAuth();
  }

  checkExistingAuth() {
    if (this.disableAutoLogin) {
      return;
    }
    
    const authService = this.getAuthService();
    if (authService.isAuthenticated()) {
      const token = authService.getAuthToken();
      if (token) {
        this.redirectToApp(token);
        return;
      }
    }
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

    try {
      // Validate email and user type (implementation varies by subclass)
      await this.validateEmailAndUserType(email);
      
      this.showLoading('Sending OTP...');
      
      // Send OTP
      const authService = this.getAuthService();
      await authService.sendOTP(email);
      
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
      const authService = this.getAuthService();
      const response = await authService.verifyOTP(this.userEmail, otp);

      if (response.success) {
        // Store authentication data
        authService.storeAuthData(response.token, this.userEmail);

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
    }
  }

  async handleResendOTP() {
    if (!this.userEmail) {
      this.showError("Session expired. Please start again.");
      return;
    }

    this.showLoading("Resending OTP...");

    try {
      const authService = this.getAuthService();
      await authService.sendOTP(this.userEmail);
      this.showSuccess("OTP resent successfully");
      this.startOTPTimer();
    } catch (error) {
      this.showError(error.message || "Failed to resend OTP");
    } finally {
      this.hideLoading();
    }
  }

  updateUI() {
    const steps = ["email-input", "otp-verification"];
    AuthUtils.updateStepDisplay(this.currentStep, steps);
    if (this.config.showBackButton) {
      AuthUtils.updateBackButton(this.currentStep, 'email-input');
    }
  }

  reset() {
    this.currentStep = "email-input";
    this.userEmail = null;
    this.stopOTPTimer();
    this.clearStorage();
    this.updateUI();
  }

  startOTPTimer() {
    this.otpTimerManager.start();
  }

  stopOTPTimer() {
    this.otpTimerManager.stop();
  }

  // UI methods - can be overridden by subclasses or UI modules
  showLoading(message) {
    console.log("Loading:", message);
  }

  hideLoading() {
    console.log("Loading hidden");
  }

  showSuccess(message) {
    console.log("Success:", message);
  }

  showError(message) {
    console.error("Error:", message);
  }
}

export default BaseAuthHandler;

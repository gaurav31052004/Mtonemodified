import CONFIG from '../config/config.js';
import { adminAuthService } from '../services/admin-auth.js';
import { AuthUtils, OTPTimerManager } from '../utils/auth-utils.js';

/**
 * Admin Authentication Handler - Simple, standalone handler
 */
class AdminAuthHandler {
  constructor() {
    this.currentStep = 'email-input';
    this.userEmail = null;
    this.otpTimerManager = new OTPTimerManager();
  }

  /**
   * Initialize admin authentication flow
   */
  init() {
    this.checkExistingAuth();
  }

  /**
   * Check if admin is already authenticated
   */
  checkExistingAuth() {
    if (adminAuthService.isAdminAuthenticated()) {
      const token = adminAuthService.getAuthToken();
      if (token) {
        this.redirectToAdminApp(token);
        return;
      }
    }
  }

  /**
   * Handle email form submission
   */
  async handleEmailSubmit() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    
    if (!AuthUtils.validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    this.showLoading('Validating admin email...');
    
    try {
      // Check if email exists and is an admin
      await adminAuthService.checkAdminEmail(email);
      
      this.showLoading('Sending OTP...');
      
      // If email is valid admin, send OTP
      await adminAuthService.sendAdminOTP(email);
      this.userEmail = email;
      this.currentStep = 'otp-verification';
      this.updateUI();
      this.startOTPTimer();
      this.showSuccess('OTP sent successfully to your email');
    } catch (error) {
      if (error.code === 'ACCESS_DENIED') {
        this.showError('Access denied. Only admin users can login here.');
      } else {
        this.showError(error.message || 'Failed to send OTP');
      }
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Show OTP input step
   */
  showOTPInput() {
    this.currentStep = 'otp-verification';
    this.updateUI();
    this.startOTPTimer();
  }

  /**
   * Handle OTP form submission
   */
  async handleOTPSubmit() {
    const otpInput = document.getElementById('otp');
    const otp = otpInput.value.trim();
    
    const validation = AuthUtils.validateOTP(otp);
    if (!validation.valid) {
      this.showError(validation.error);
      return;
    }

    this.showLoading('Verifying OTP...');
    
    try {
      const response = await adminAuthService.verifyAdminOTP(this.userEmail, otp);
      
      if (response.success) {
        // Store admin authentication data
        adminAuthService.storeAdminAuthData(response.token, this.userEmail);
        
        this.showSuccess('Admin login successful! Redirecting...');
        
        // Redirect after a short delay
        setTimeout(() => {
          this.redirectToAdminApp(response.token);
        }, 100);
      }
    } catch (error) {
      this.showError(error.message || 'Invalid OTP');
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Handle back button click
   */
  handleBackButton() {
    if (this.currentStep === 'otp-verification') {
      this.currentStep = 'email-input';
      this.stopOTPTimer();
      this.updateUI();
    }
  }

  /**
   * Handle resend OTP
   */
  async handleResendOTP() {
    if (!this.userEmail) {
      this.showError('Session expired. Please start again.');
      return;
    }

    this.showLoading('Resending OTP...');
    
    try {
      await adminAuthService.sendAdminOTP(this.userEmail);
      this.showSuccess('OTP resent successfully');
      this.startOTPTimer();
    } catch (error) {
      this.showError(error.message || 'Failed to resend OTP');
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Update UI based on current step
   */
  updateUI() {
    const steps = ['email-input', 'otp-verification'];
    AuthUtils.updateStepDisplay(this.currentStep, steps);
    AuthUtils.updateBackButton(this.currentStep, 'email-input');
  }

  /**
   * Redirect to admin application
   */
  redirectToAdminApp(token) {
    adminAuthService.redirectToAdminApp(token);
  }

  /**
   * Reset authentication flow
   */
  reset() {
    this.currentStep = 'email-input';
    adminAuthService.clearAdminAuthData();
    this.updateUI();
  }

  /**
   * Start OTP timer
   */
  startOTPTimer() {
    this.otpTimerManager.start();
  }

  /**
   * Stop OTP timer
   */
  stopOTPTimer() {
    this.otpTimerManager.stop();
  }

  /**
   * Show loading state
   */
  showLoading(message) {
    // This method is typically overridden by the UI module
    console.log('Loading:', message);
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    // This method is typically overridden by the UI module
    console.log('Loading hidden');
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    // This method is typically overridden by the UI module
    console.log('Success:', message);
  }

  /**
   * Show error message
   */
  showError(message) {
    // This method is typically overridden by the UI module
    console.error('Error:', message);
  }
}

export default AdminAuthHandler;
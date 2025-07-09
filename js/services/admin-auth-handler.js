import CONFIG from '../config/config.js';
import { adminAuthService } from '../services/admin-auth.js';
import BaseAuthHandler from './base-auth-handler.js';

/**
 * Admin Authentication Handler - manages the admin authentication flow
 */
class AdminAuthHandler extends BaseAuthHandler {
  constructor() {
    super();
    this.currentStep = 'email-input'; // 'email-input', 'otp-verification'
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
    
    if (!this.validateEmailInput(email)) return;

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
    
    if (!this.validateOTP(otp)) return;

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
    
    steps.forEach(step => {
      const element = document.getElementById(`${step}-step`);
      if (element) {
        element.style.display = step === this.currentStep ? 'block' : 'none';
      }
    });
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
    super.reset();
    this.currentStep = 'email-input';
    adminAuthService.clearAdminAuthData();
    this.updateUI();
  }
}

export default AdminAuthHandler;

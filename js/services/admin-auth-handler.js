import { adminAuthService } from './admin-service.js';
import { AuthUtils, OTPTimerManager } from '../utils/auth-utils.js';


class AdminAuthHandler {
  constructor() {
    this.currentStep = 'email-input';
    this.userEmail = null;
    this.otpTimerManager = new OTPTimerManager();
    // Check for ?clearSession=true in search params
    const params = new URLSearchParams(window.location.search);
    this.disableAutoLogin = params.get('clearSession') === 'true';
    if (this.disableAutoLogin) {
      localStorage.clear();
    }
  }

  init() {
    this.checkExistingAuth();
  }

  checkExistingAuth() {
    if (this.disableAutoLogin) {
      // Do not autologin if clearSession is requested
      return;
    }
    if (adminAuthService.isAdminAuthenticated()) {
      const token = adminAuthService.getAuthToken();
      if (token) {
        this.redirectToAdminApp(token);
        return;
      }
    }
  }

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

  showOTPInput() {
    this.currentStep = 'otp-verification';
    this.updateUI();
    this.startOTPTimer();
  }

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

  handleBackButton() {
    if (this.currentStep === 'otp-verification') {
      this.currentStep = 'email-input';
      this.stopOTPTimer();
      this.updateUI();
    }
  }

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

  updateUI() {
    const steps = ['email-input', 'otp-verification'];
    AuthUtils.updateStepDisplay(this.currentStep, steps);
    AuthUtils.updateBackButton(this.currentStep, 'email-input');
  }

  redirectToAdminApp(token) {
    adminAuthService.redirectToAdminApp(token);
  }

  reset() {
    this.currentStep = 'email-input';
    adminAuthService.clearAdminAuthData();
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
    console.log('Loading:', message);
  }

  hideLoading() {
    // This method is typically overridden by the UI module
    console.log('Loading hidden');
  }

  showSuccess(message) {
    // This method is typically overridden by the UI module
    console.log('Success:', message);
  }

  showError(message) {
    // This method is typically overridden by the UI module
    console.error('Error:', message);
  }
}

export default AdminAuthHandler;
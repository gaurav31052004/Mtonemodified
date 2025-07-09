import CONFIG from '../config/config.js';
import { authService, StorageService } from '../services/api.js';

/**
 * Partner Authentication Handler - Simple, standalone handler
 */
class AuthHandler {
  constructor() {
    this.currentStep = 'partner-selection';
    this.selectedPartner = null;
    this.userEmail = null;
    this.otpTimer = null;
  }

  /**
   * Initialize authentication flow
   */
  init() {
    this.checkExistingAuth();
  }

  /**
   * Check if user is already authenticated
   */
  checkExistingAuth() {
    if (authService.isAuthenticated()) {
      const token = authService.getAuthToken();
      if (token) {
        this.redirectToApp(token);
        return;
      }
    }
    
    // Check if partner is already selected
    const selectedPartner = StorageService.getSelectedPartner();
    if (selectedPartner) {
      this.selectedPartner = selectedPartner;
      this.currentStep = 'email-input';
    }
  }

  /**
   * Handle partner selection
   */
  selectPartner(partner) {
    this.selectedPartner = partner;
    StorageService.storeSelectedPartner(partner);
    this.currentStep = 'email-input';
  }

  /**
   * Handle email form submission
   */
  async handleEmailSubmit() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    
    if (!this.validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!this.selectedPartner) {
      throw new Error('Please select a partner location first');
    }
    
    try {
      // First validate email with backend
      const response = await authService.checkEmail(email);
      
      // Check if user type is Partner
      if (response.data && response.data.userType !== 'Partner') {
        throw new Error('Access denied. Only partner users can login here.');
      }
      
      // If email is valid partner, send OTP
      await authService.sendOTP(email, this.selectedPartner.domain);
      this.userEmail = email;
      this.currentStep = 'otp-verification';
      
      return { success: true, message: 'OTP sent successfully to your email' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle OTP form submission
   */
  async handleOTPSubmit() {
    const otpInput = document.getElementById('otp');
    const otp = otpInput.value.trim();
    
    if (!otp || otp.length !== CONFIG.UI.OTP_LENGTH) {
      throw new Error(`Please enter a valid ${CONFIG.UI.OTP_LENGTH}-digit OTP`);
    }

    try {
      const response = await authService.verifyOTP(
        this.userEmail,
        otp,
        this.selectedPartner.domain
      );
      
      if (response.success) {
        // Store authentication data
        authService.storeAuthData(response.token, this.userEmail);
        
        // Redirect after a short delay
        setTimeout(() => {
          this.redirectToApp(response.token);
        }, 100);
        
        return { success: true, message: 'Login successful! Redirecting...' };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle resend OTP
   */
  async handleResendOTP() {
    if (!this.userEmail || !this.selectedPartner) {
      throw new Error('Session expired. Please start again.');
    }
    
    try {
      await authService.sendOTP(this.userEmail, this.selectedPartner.domain);
      return { success: true, message: 'OTP resent successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Start OTP timer
   */
  startOTPTimer() {
    this.stopOTPTimer();
    
    let timeLeft = CONFIG.UI.OTP_EXPIRY_TIME / 1000;
    const timerElement = document.getElementById('otp-timer');
    const resendButton = document.getElementById('resend-otp');
    
    if (timerElement && resendButton) {
      resendButton.style.display = 'none';
      timerElement.style.display = 'block';
      
      this.otpTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `Resend OTP in ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
          this.stopOTPTimer();
          timerElement.style.display = 'none';
          resendButton.style.display = 'block';
        }
        
        timeLeft--;
      }, 1000);
    }
  }

  /**
   * Stop OTP timer
   */
  stopOTPTimer() {
    if (this.otpTimer) {
      clearInterval(this.otpTimer);
      this.otpTimer = null;
    }
  }

  /**
   * Update UI based on current step - handled by LoginModule
   */
  updateUI() {
    // This is overridden by LoginModule
  }

  /**
   * Redirect to main application
   */
  redirectToApp(token) {
    authService.redirectToApp(token);
  }

  /**
   * Reset authentication flow
   */
  reset() {
    this.currentStep = 'partner-selection';
    this.selectedPartner = null;
    this.userEmail = null;
    this.stopOTPTimer();
    StorageService.clearAll();
  }
}

export default AuthHandler;

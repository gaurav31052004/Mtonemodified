import CONFIG from '../config/config.js';
import { authService, StorageService } from '../services/api.js';

/**
 * Authentication Handler - manages the authentication flow
 */
class AuthHandler {
  constructor() {
    this.currentStep = 'partner-selection'; // 'partner-selection', 'email-input', 'otp-verification'
    this.selectedPartner = null;
    this.userEmail = null;
    this.otpTimer = null;
    this.resendTimer = null;
  }

  /**
   * Initialize authentication flow
   */
  init() {
    this.bindEvents();
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
      this.showEmailInput();
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Form submissions
    document.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (e.target.id === 'email-form') {
        this.handleEmailSubmit();
      } else if (e.target.id === 'otp-form') {
        this.handleOTPSubmit();
      }
    });

    // Resend OTP
    document.addEventListener('click', (e) => {
      if (e.target.id === 'resend-otp') {
        this.handleResendOTP();
      }
    });
  }

  /**
   * Handle partner selection
   */
  selectPartner(partner) {
    this.selectedPartner = partner;
    StorageService.storeSelectedPartner(partner);
    
    this.showEmailInput();
  }

  /**
   * Show email input step
   */
  showEmailInput() {
    this.currentStep = 'email-input';
    this.updateUI();
  }

  /**
   * Handle email form submission
   */
  async handleEmailSubmit() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    
    if (!this.validateEmail(email)) {
      this.showError('Please enter a valid email address');
      return;
    }

    if (!this.selectedPartner) {
      this.showError('Please select a partner location first');
      return;
    }

    this.showLoading('Validating email...');
    
    try {
      // First validate email with backend
      await authService.checkEmail(email);
      
      this.showLoading('Sending OTP...');
      
      // If email is valid, send OTP
      await authService.sendOTP(email, this.selectedPartner.domain);
      this.userEmail = email;
      this.showOTPInput();
      this.showSuccess('OTP sent successfully to your email');
    } catch (error) {
      this.showError(error.message || 'Failed to send OTP');
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
    
    if (!otp || otp.length !== CONFIG.UI.OTP_LENGTH) {
      this.showError(`Please enter a valid ${CONFIG.UI.OTP_LENGTH}-digit OTP`);
      return;
    }

    this.showLoading('Verifying OTP...');
    
    try {
      const response = await authService.verifyOTP(
        this.userEmail,
        otp,
        this.selectedPartner.domain
      );
      
      if (response.success) {
        // Store authentication data
        authService.storeAuthData(response.token, this.userEmail);
        
        this.showSuccess('Login successful! Redirecting...');
        
        // Redirect after a short delay
        setTimeout(() => {
          this.redirectToApp(response.token);
        }, 1500);
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
    if (this.currentStep === 'email-input') {
      this.currentStep = 'partner-selection';
      StorageService.storeSelectedPartner(null);
      this.selectedPartner = null;
    } else if (this.currentStep === 'otp-verification') {
      this.currentStep = 'email-input';
      this.stopOTPTimer();
    }
    
    this.updateUI();
  }

  /**
   * Handle resend OTP
   */
  async handleResendOTP() {
    if (!this.userEmail || !this.selectedPartner) {
      this.showError('Session expired. Please start again.');
      return;
    }

    this.showLoading('Resending OTP...');
    
    try {
      await authService.sendOTP(this.userEmail, this.selectedPartner.domain);
      this.showSuccess('OTP resent successfully');
      this.startOTPTimer();
    } catch (error) {
      this.showError(error.message || 'Failed to resend OTP');
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Start OTP timer
   */
  startOTPTimer() {
    this.stopOTPTimer();
    
    let timeLeft = CONFIG.UI.OTP_EXPIRY_TIME / 1000; // Convert to seconds
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
   * Update UI based on current step
   */
  updateUI() {
    const steps = ['partner-selection', 'email-input', 'otp-verification'];
    
    steps.forEach(step => {
      const element = document.getElementById(`${step}-step`);
      if (element) {
        element.style.display = step === this.currentStep ? 'block' : 'none';
      }
    });
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Show loading state
   */
  showLoading(message) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.textContent = message;
      loadingElement.style.display = 'block';
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showMessage(message, 'error');
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  /**
   * Show message with type
   */
  showMessage(message, type) {
    // Create toast notification
    this.showToast(message, type);
  }

  /**
   * Show toast notification
   */
  showToast(message, type) {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full opacity-0';
    
    // Set toast styling based on type
    if (type === 'error') {
      toast.classList.add('bg-red-500', 'text-white');
      toast.innerHTML = `
        <div class="flex items-center">
          <i class="fas fa-exclamation-circle mr-2"></i>
          <span>${message}</span>
        </div>
      `;
    } else if (type === 'success') {
      toast.classList.add('bg-green-500', 'text-white');
      toast.innerHTML = `
        <div class="flex items-center">
          <i class="fas fa-check-circle mr-2"></i>
          <span>${message}</span>
        </div>
      `;
    } else {
      toast.classList.add('bg-blue-500', 'text-white');
      toast.innerHTML = `
        <div class="flex items-center">
          <i class="fas fa-info-circle mr-2"></i>
          <span>${message}</span>
        </div>
      `;
    }

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ml-4 text-white hover:text-gray-200';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => this.hideToast(toast);
    toast.querySelector('div').appendChild(closeBtn);

    // Add to body
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
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
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
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
    this.updateUI();
  }
}

export default AuthHandler;

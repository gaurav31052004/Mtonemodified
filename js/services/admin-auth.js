import CONFIG from '../config/config.js';
import { authService as baseAuthService, StorageService } from '../services/api.js';

/**
 * Admin Authentication Service - handles admin-specific authentication operations
 */
class AdminAuthService {
  constructor() {
    this.baseAuthService = baseAuthService;
  }

  /**
   * Check if email exists and is an admin user
   */
  async checkAdminEmail(email) {
    try {
      const response = await this.baseAuthService.checkEmail(email);
      
      if (response.success && response.data) {
        // Check if user type is Admin
        if (response.data.userType !== 'Admin') {
          const accessDeniedError = new Error('Access denied. This email is not authorized for admin access.');
          accessDeniedError.code = 'ACCESS_DENIED';
          accessDeniedError.status = 403;
          throw accessDeniedError;
        }
        
        return response;
      }
      
      throw new Error(response.message || 'Email not found');
    } catch (error) {
      console.error('Error checking admin email:', error);
      throw error;
    }
  }

  /**
   * Send OTP to admin email
   */
  async sendAdminOTP(email) {
    try {
      // Use 'admin' as domain for admin login
      const response = await this.baseAuthService.sendOTP(email, 'admin');
      return response;
    } catch (error) {
      console.error('Error sending admin OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP for admin login
   */
  async verifyAdminOTP(email, otp) {
    try {
      // Use 'admin' as domain for admin login
      const response = await this.baseAuthService.verifyOTP(email, otp, 'admin');
      return response;
    } catch (error) {
      console.error('Error verifying admin OTP:', error);
      throw error;
    }
  }

  /**
   * Redirect to admin application with token
   */
  redirectToAdminApp(token) {
    // You can customize this URL for admin panel
    const adminRedirectUrl = `${CONFIG.API.REDIRECT_URL}?tok=${token}&type=admin`;
    window.location.href = adminRedirectUrl;
  }

  /**
   * Store admin authentication data
   */
  storeAdminAuthData(token, email) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER_TOKEN, token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER_EMAIL, email);
    localStorage.setItem('mt_user_type', 'Admin');
  }

  /**
   * Clear admin authentication data
   */
  clearAdminAuthData() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem('mt_user_type');
  }

  /**
   * Check if user is authenticated as admin
   */
  isAdminAuthenticated() {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    const userType = localStorage.getItem('mt_user_type');
    return !!(token && userType === 'Admin');
  }

  /**
   * Get stored authentication token
   */
  getAuthToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
  }
}

// Export admin auth service instance
export const adminAuthService = new AdminAuthService();

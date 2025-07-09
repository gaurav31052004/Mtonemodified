import CONFIG from '../config/config.js';
import { authService as baseAuthService, StorageService } from '../services/api.js';

class AdminAuthService {
  constructor() {
    this.baseAuthService = baseAuthService;
  }

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

  async sendAdminOTP(email) {
    try {
      // Use 'admin' as domain for admin login
      const response = await this.baseAuthService.sendOTP(email, undefined);
      return response;
    } catch (error) {
      console.error('Error sending admin OTP:', error);
      throw error;
    }
  }

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

  redirectToAdminApp(token) {
    // You can customize this URL for admin panel
    const adminRedirectUrl = `${CONFIG.API.REDIRECT_URL}?tok=${token}&type=admin`;
    window.location.href = adminRedirectUrl;
  }

  storeAdminAuthData(token, email) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER_TOKEN, token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER_EMAIL, email);
    localStorage.setItem('mt_user_type', 'Admin');
  }

  clearAdminAuthData() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem('mt_user_type');
  }

  isAdminAuthenticated() {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    const userType = localStorage.getItem('mt_user_type');
    return !!(token && userType === 'Admin');
  }

  getAuthToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
  }
}

export const adminAuthService = new AdminAuthService();

import BaseAuthHandler from "./base-auth-handler.js";
import { adminAuthService } from '../services/admin-service.js';

class AdminAuthHandler extends BaseAuthHandler {
  constructor() {
    super({
      showBackButton: true, // Admins show back button
      userTypes: ["Admin"]
    });
  }

  getAuthService() {
    return {
      isAuthenticated: () => adminAuthService.isAdminAuthenticated(),
      getAuthToken: () => adminAuthService.getAuthToken(),
      sendOTP: (email) => adminAuthService.sendAdminOTP(email),
      verifyOTP: (email, otp) => adminAuthService.verifyAdminOTP(email, otp),
      storeAuthData: (token, email) => adminAuthService.storeAdminAuthData(token, email)
    };
  }

  async validateEmailAndUserType(email) {
    this.showLoading('Validating admin email...');
    
    try {
      // Check if email exists and is an admin
      await adminAuthService.checkAdminEmail(email);
    } catch (error) {
      if (error.code === 'ACCESS_DENIED') {
        throw new Error('Access denied. Only admin users can login here.');
      } else {
        throw new Error(error.message || 'Failed to validate admin email');
      }
    } finally {
      this.hideLoading();
    }
  }

  redirectToApp(token) {
    adminAuthService.redirectToAdminApp(token);
  }

  clearStorage() {
    localStorage.clear();
  }

  reset() {
    super.reset();
    adminAuthService.clearAdminAuthData();
  }
}

export default AdminAuthHandler;

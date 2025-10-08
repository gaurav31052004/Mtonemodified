import BaseAuthHandler from "./base-auth-handler.js";
import { partnerService } from "../services/partner-service.js";
import { StorageService } from "../services/storage-service.js";

class PartnerAuthHandler extends BaseAuthHandler {
  constructor() {
    super({
      showBackButton: false, // Partners don't show back button
      userTypes: ["Partner", "TeamMember"]
    });
  }

  getAuthService() {
    return partnerService;
  }

  async validateEmailAndUserType(email) {
    // First validate email with backend
    const response = await partnerService.checkEmail(email);

    // Check if user type is Partner or TeamMember
    if (
      !response.data ||
      !this.config.userTypes.includes(response.data.userType)
    ) {
      throw new Error("Access denied. Only agent/builder users can login here.");
    }
  }

  redirectToApp(token) {
    partnerService.redirectToApp(token);
  }

  clearStorage() {
    StorageService.clearAll();
    localStorage.clear();
  }
}

export default PartnerAuthHandler;


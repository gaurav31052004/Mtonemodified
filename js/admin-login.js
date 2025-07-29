import { EmailOTPLoginModule } from "./controllers/email-otp-login.js";
import AdminAuthHandler from "./controllers/admin-auth-handler.js";

class AdminLoginModule extends EmailOTPLoginModule {
  constructor() {
    super(new AdminAuthHandler(), {
      showBackButtonOnFirstStep: false
    });
    this.init();
  }

  // Optional: Override any admin-specific behavior
  async performModuleSpecificSetup() {
    // Admin-specific setup if needed
    console.log("Setting up admin login");
  }
}

export default AdminLoginModule;

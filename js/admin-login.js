import { EmailOTPLoginModule } from "./controllers/email-otp-login.js";
import AdminAuthHandler from "./controllers/admin-auth-handler.js";

class AdminLoginModule extends EmailOTPLoginModule {
  constructor() {
    super(new AdminAuthHandler(), {
      showBackButtonOnFirstStep: false
    });
  }

  // Optional: Override any admin-specific behavior
  async performModuleSpecificSetup() {
    // Admin-specific setup if needed
    console.log("Setting up admin login");
  }
}

// Initialize admin login page when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const adminLoginModule = new AdminLoginModule();
  await adminLoginModule.init();
});

export default AdminLoginModule;

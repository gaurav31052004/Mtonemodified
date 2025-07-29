import { EmailOTPLoginModule } from "./controllers/email-otp-login.js";
import PartnerAuthHandler from "./controllers/partner-auth-handler.js";

class PartnerLoginModule extends EmailOTPLoginModule {
  constructor() {
    super(new PartnerAuthHandler(), {
      showBackButtonOnFirstStep: false
    });
  }

  // Optional: Override any partner-specific behavior
  async performModuleSpecificSetup() {
    // Partner-specific setup if needed
    console.log("Setting up partner login");
  }
}

// Initialize login page when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const loginModule = new PartnerLoginModule();
  await loginModule.init();
});

export default PartnerLoginModule;

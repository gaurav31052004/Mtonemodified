import ApplicationDownload from "./controllers/application.js";
import SignupController from "./controllers/signup-controller.js";
import ChoosePlan from "./components/choose-plan.js";
import PartnerLoginModule from "./login.js";
import AdminLoginModule from "./admin-login.js";
import PricingToggle from "./components/pricing.js";

export class Router {
  constructor() {
    this.currentPath = window.location.pathname;
  }

  isPath(paths) {
    return paths.some(path => {
      // Remove trailing slash for comparison
      const normalizedCurrentPath = this.currentPath.replace(/\/$/, '') || '/';
      const normalizedPath = path.replace(/\/$/, '') || '/';
      
      return normalizedCurrentPath === normalizedPath;
    });
  }

  initializePages() {
    // Initialize pricing toggle on home page
    if (this.isPath(["/", "/index.html"])) {
      new PricingToggle();
    }

    // Initialize application download pages
    if (this.isPath([
      "/application",
      "/partners/application"
    ])) {
      new ApplicationDownload();
    }

    // Initialize signup controller on onboarding page
    if (this.isPath(["/onboarding"])) {
      new SignupController();
    }

    // Initialize partner login
    if (this.isPath(["/login"])) {
      new PartnerLoginModule();
    }

    // Initialize admin login
    if (this.isPath(["/admin"])) {
      new AdminLoginModule();
    }

    // Initialize choose plan page
    if (this.isPath(["/choose-plan"])) {
      new ChoosePlan();
    }
  }
}

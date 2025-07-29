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
    return paths.some(path => 
      this.currentPath.includes(path) || 
      this.currentPath.endsWith(path.replace('/index.html', '/')) ||
      this.currentPath.endsWith(path.replace('/index.html', ''))
    );
  }

  initializePages() {
    // Initialize pricing toggle on home page
    if (this.currentPath === "/" || this.currentPath === "/index.html") {
      new PricingToggle();
    }

    // Initialize application download pages
    if (this.isPath([
      "/application.html",
      "/application/",
      "/application",
      "/partners/application.html", 
      "/partners/application/",
      "/partners/application"
    ])) {
      new ApplicationDownload();
    }

    // Initialize signup controller on onboarding page
    if (this.isPath([
      "/onboarding.html",
      "/onboarding/",
      "/onboarding"
    ])) {
      new SignupController();
    }

    // Initialize partner login
    if (this.isPath([
      "/login.html",
      "/login/",
      "/login"
    ])) {
      new PartnerLoginModule();
    }

    // Initialize admin login
    if (this.isPath([
      "/admin.html",
      "/admin/",
      "/admin"
    ])) {
      new AdminLoginModule();
    }

    // Initialize choose plan page
    if (this.isPath([
      "/choose-plan.html",
      "/choose-plan/",
      "/choose-plan"
    ])) {
      new ChoosePlan();
    }
  }
}

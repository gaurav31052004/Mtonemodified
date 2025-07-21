import { BaseLoginModule } from "./components/base-login.js";
import AuthHandler from "./services/partner-auth-handler.js";
import { partnerService } from "./services/partner-service.js";

class LoginModule extends BaseLoginModule {
  constructor() {
    super(new AuthHandler(), "partner-selection");
  }

  async performModuleSpecificSetup() {
    // Load and render partner selection
    await this.renderPartnerSelection();
  }

  setupAuthHandlerOverride() {
    // Call parent method first
    super.setupAuthHandlerOverride();

    // Add partner-specific override
    this.authHandler.selectPartner = (partner) => {
      this.authHandler.selectedPartner = partner;
      this.authHandler.currentStep = "email-input";
      this.currentStep = "email-input";
      this.authHandler.updateUI();
    };
  }

  getSteps() {
    return ["partner-selection", "email-input", "otp-verification"];
  }

  getStepMapping() {
    return {
      "partner-selection": 1,
      "email-input": 2,
      "otp-verification": 3,
    };
  }

  getFirstStep() {
    return "partner-selection";
  }

  async renderPartnerSelection() {
    const container = document.getElementById("partner-selection");
    if (!container) return;

    try {
      this.showLoading(true);

      const partners = await partnerService.getPartnerLocations();

      if (partners && partners.length > 0) {
        const partnersHTML = partners
          .map((partner) => {
            return `
            <div class="partner-card flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 bg-white hover:border-gold hover:-translate-y-0.5 hover:shadow-md" 
                 data-partner='${JSON.stringify(partner)}'>
              <img src="${partner.iconUrl}" 
                   alt="${partner.masterDetailName}" 
                   class="w-8 h-8 object-contain mr-3 rounded-lg">
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-gray-800 mb-0.5">${partner.masterDetailName}</h3>
              </div>
            </div>
          `;
          })
          .join("");

        container.innerHTML = partnersHTML;

        // Add click event listeners to partner cards
        container.querySelectorAll(".partner-card").forEach((card) => {
          card.addEventListener("click", () => {
            const partnerData = JSON.parse(card.dataset.partner);
            this.selectPartner(partnerData);
          });
        });
      } else {
        throw new Error("No partners found");
      }
    } catch (error) {
      console.error("Error loading partners:", error);
      container.innerHTML = `
        <div class="text-center p-4 text-red-600">
          <p class="mb-2 text-sm">Failed to load partner locations</p>
          <button onclick="location.reload()" class="text-gold underline text-sm">Retry</button>
        </div>
      `;
    } finally {
      this.showLoading(false);
    }
  }

  selectPartner(partner) {
    // Remove previous selections
    document.querySelectorAll(".partner-card").forEach((card) => {
      card.classList.remove("border-gold", "bg-orange-50");
    });

    // Add selection to clicked card
    event.target
      .closest(".partner-card")
      .classList.add("border-gold", "bg-orange-50");

    // Store partner data and proceed
    this.authHandler.selectPartner(partner);
  }

  handleBackButton() {
    if (this.currentStep === "email-input") {
      this.currentStep = "partner-selection";
      this.authHandler.currentStep = "partner-selection";
      
      // Clear selected partner when going back
      this.authHandler.selectedPartner = null;
      
      // Clear localStorage for selected partner
      localStorage.removeItem('mt_selected_partner');
      
      // Clear email input
      const emailInput = document.getElementById("email");
      if (emailInput) {
        emailInput.value = "";
      }
      
      // Hide email error if showing
      this.hideEmailError();
      
    } else if (this.currentStep === "otp-verification") {
      this.currentStep = "email-input";
      this.authHandler.currentStep = "email-input";
      
      // Stop OTP timer when going back
      if (this.authHandler.stopOTPTimer) {
        this.authHandler.stopOTPTimer();
      }
      
      // Clear OTP input
      const otpInput = document.getElementById("otp");
      if (otpInput) {
        otpInput.value = "";
      }
      
      // Hide OTP timer and resend button
      const otpTimer = document.getElementById("otp-timer");
      const resendOtp = document.getElementById("resend-otp");
      if (otpTimer) otpTimer.classList.add("hidden");
      if (resendOtp) resendOtp.classList.add("hidden");
    }

    this.updateStepDisplay();
    this.updateStepIndicators();
  }

  updateStepDisplay() {
    const steps = this.getSteps();
    const backButton = document.getElementById("back-button");
    
    // Elements to show/hide during partner selection
    const headerSection = document.querySelector(".text-center.mt-8.mb-6");
    const logoSection = document.querySelector(".text-center.mb-8");
    const partnerSelectionHeader = document.querySelector("#partner-selection-step .text-center.mb-6");

    // Hide all steps first
    steps.forEach((stepId) => {
      const element = document.getElementById(`${stepId}-step`);
      if (element) {
        element.classList.add("hidden");
      }
    });

    // Show current step
    const currentStepElement = document.getElementById(`${this.currentStep}-step`);
    if (currentStepElement) {
      currentStepElement.classList.remove("hidden");
    }

    // Show/hide back button
    if (backButton) {
      if (this.currentStep === "partner-selection") {
        backButton.classList.add("hidden");
      } else {
        backButton.classList.remove("hidden");
      }
    }

    // Update header content based on current step
    if (this.currentStep === "partner-selection") {
      // Show elements during partner selection
      if (headerSection) headerSection.classList.remove("hidden");
      if (logoSection) logoSection.classList.remove("hidden");
      if (partnerSelectionHeader) {
        partnerSelectionHeader.classList.remove("hidden");
        // Update the heading text for partner selection
        const heading = partnerSelectionHeader.querySelector("h2");
        const subheading = partnerSelectionHeader.querySelector("p");
        if (heading) heading.textContent = "Select your zone";
        if (subheading) subheading.textContent = "Choose your partner location to continue";
      }
      // Clear any selected partner cards
      document.querySelectorAll(".partner-card").forEach((card) => {
        card.classList.remove("border-gold", "bg-orange-50");
      });
    } else if (this.currentStep === "email-input") {
      // Show elements for email input step
      if (headerSection) headerSection.classList.remove("hidden");
      if (logoSection) logoSection.classList.remove("hidden");
      if (partnerSelectionHeader) {
        partnerSelectionHeader.classList.add("hidden");
      }
    } else {
      // Show elements for other steps (OTP verification)
      if (headerSection) headerSection.classList.remove("hidden");
      if (logoSection) logoSection.classList.remove("hidden");
      if (partnerSelectionHeader) partnerSelectionHeader.classList.add("hidden");
    }
  }
}

// Initialize login page when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const loginModule = new LoginModule();
  await loginModule.init();
});

export default LoginModule;

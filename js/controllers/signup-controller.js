// SignupController.js
// Handles signup form logic for onboarding page

import { partnerService } from "../services/partner-service.js";

export default class SignupController {
  constructor() {
    this.form = document.getElementById("signup-form");
    this.partnerZoneCardsContainer =
      document.getElementById("partner-zone-cards");
    this.partnerZoneInput = document.getElementById("partner-zone");
    this.init();
  }

  async init() {
    await this.renderPartnerZoneCards();
    if (this.form) {
      this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  async renderPartnerZoneCards() {
    if (!this.partnerZoneCardsContainer || !this.partnerZoneInput) return;
    this.partnerZoneCardsContainer.innerHTML =
      '<div class="text-gray-500 text-sm">Loading zones...</div>';
    try {
      const partners = await partnerService.getPartnerLocations();
      if (partners && partners.length > 0) {
        this.partnerZoneCardsContainer.className = "";
        this.partnerZoneCardsContainer.classList.add(
          "grid",
          "grid-cols-2",
          "sm:grid-cols-3",
          "md:grid-cols-4",
          "lg:grid-cols-5",
          "gap-3",
          "w-full",
          "mt-2",
        );
        this.partnerZoneCardsContainer.innerHTML = partners
          .map(
            (partner) => `
        <div class="partner-card relative flex flex-col items-center justify-center p-3 border-2 border-gray-200 rounded-2xl cursor-pointer transition-all duration-300 bg-white hover:border-gold hover:shadow-md min-h-[100px] group overflow-hidden" 
          data-id="${partner.masterDetailName}" data-name="${partner.masterDetailName}">
          <!-- Selection indicator -->
          <div class="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-gray-300 bg-white transition-all duration-200 group-hover:border-gold hidden z-10">
            <!-- Checkmark icon -->
            <svg class="absolute inset-0 w-2.5 h-2.5 m-auto text-white opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <img src="${partner.iconUrl}" alt="${partner.masterDetailName}" class="w-8 h-8 object-contain mb-2 rounded-lg flex-shrink-0">
          <h3 class="text-xs font-semibold text-gray-800 text-center leading-tight px-1 line-clamp-2">${partner.masterDetailName}</h3>
        </div>
      `,
          )
          .join("");

        // Enhanced radio button behavior
        this.partnerZoneCardsContainer
          .querySelectorAll(".partner-card")
          .forEach((card) => {
            card.addEventListener("click", () => {
              // Remove selection from all cards
              this.partnerZoneCardsContainer
                .querySelectorAll(".partner-card")
                .forEach((c) => {
                  c.classList.remove(
                    "border-gold",
                    "bg-gold-50",
                    "ring-2",
                    "ring-gold",
                    "ring-opacity-50",
                    "shadow-lg",
                  );
                  const indicator = c.querySelector(".absolute.top-2.right-2");
                  indicator.classList.add("hidden");
                  indicator.classList.remove("border-gold", "bg-gold");
                  const svg = indicator.querySelector("svg");
                  svg.classList.add("opacity-0");
                  svg.classList.remove("opacity-100");
                  c.querySelector("h3").classList.remove("text-gold");
                });

              // Add selection to clicked card
              card.classList.add(
                "border-gold",
                "bg-gold-50",
                "ring-2",
                "ring-gold",
                "ring-opacity-50",
                "shadow-lg",
              );
              const indicator = card.querySelector(".absolute.top-2.right-2");
              indicator.classList.remove("hidden");
              indicator.classList.add("border-gold", "bg-gold");
              const svg = indicator.querySelector("svg");
              svg.classList.remove("opacity-0");
              svg.classList.add("opacity-100");
              card.querySelector("h3").classList.add("text-gold");

              // Set hidden input value
              this.partnerZoneInput.value = card.dataset.id;

              // Optional: Add haptic feedback for mobile
              if (navigator.vibrate) {
                navigator.vibrate(50);
              }

              // Dispatch custom event for other components to listen
              card.dispatchEvent(
                new CustomEvent("partnerSelected", {
                  detail: { id: card.dataset.id, name: card.dataset.name },
                }),
              );
            });

            // Add keyboard support for accessibility
            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "radio");
            card.addEventListener("keydown", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                card.click();
              }
            });
          });
      } else {
        this.partnerZoneCardsContainer.innerHTML =
          '<div class="text-gray-500 text-sm">No zones available</div>';
      }
    } catch (err) {
      this.partnerZoneCardsContainer.innerHTML =
        '<div class="text-red-500 text-sm">Failed to load zones</div>';
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Basic validation and data collection
    const name = this.form.name.value.trim();
    const email = this.form.email.value.trim();
    const phone = this.form.phone.value.trim();
    const address = this.form.address.value.trim();
    const partnerZone = this.form["partner-zone"].value;

    // Validate required fields
    if (!name) {
      this.showError("Please enter your full name.");
      this.focusField("name");
      return;
    }

    if (!email) {
      this.showError("Please enter your email address.");
      this.focusField("email");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showError("Please enter a valid email address.");
      this.focusField("email");
      return;
    }

    if (!phone) {
      this.showError("Please enter your phone number.");
      this.focusField("phone");
      return;
    }

    if (!this.isValidPhone(phone)) {
      this.showError("Please enter a valid 10-digit phone number.");
      this.focusField("phone");
      return;
    }

    if (!address) {
      this.showError("Please enter your address.");
      this.focusField("address");
      return;
    }

    if (!partnerZone) {
      this.showError("Please select a partner zone.");
      return;
    }

    // Show loading state
    this.setSubmitButtonState(true, "Creating Account...");

    try {
      // Call the partner signup API
      const response = await partnerService.partnerSignup(
        name,
        email,
        phone,
        address, // This maps to 'location' in the API
        partnerZone,
      );

      if (response.success) {
        this.showSuccess(
          "Account created successfully! You can now login with your credentials.",
        );
        const userDetails = {
          name,
          email,
          phone,
          address,
          partnerZone,
          userDetails: response.data || {},
        }
        localStorage.setItem(
          "partnerDetails",
          JSON.stringify(userDetails),
        );
        // Reset form after successful submission
        this.form.reset();
        this.partnerZoneInput.value = "";
        this.clearSelectedCards();

        // Redirect to login page after a delay
        setTimeout(() => {
          window.location.href = "/choose-plan/";
        }, 2000);
      } else {
        this.showError(
          response.message || "Failed to create account. Please try again.",
        );
      }
    } catch (error) {
      console.error("Signup error:", error);

      // Handle different types of errors
      let errorMessage = "An error occurred during signup. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 400) {
        errorMessage =
          "Invalid data provided. Please check your information and try again.";
      } else if (error.status === 409) {
        errorMessage =
          "An account with this email already exists. Please try logging in instead.";
      } else if (error.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (!navigator.onLine) {
        errorMessage =
          "No internet connection. Please check your connection and try again.";
      }

      this.showError(errorMessage);
    } finally {
      // Reset button state
      this.setSubmitButtonState(false, "Sign Up");
    }
  }

  // Helper method to validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper method to validate phone number (10 digits)
  isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  }

  // Helper method to show error messages
  showError(message) {
    this.removeExistingMessages();
    const errorDiv = document.createElement("div");
    errorDiv.className =
      "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-4 text-sm";
    errorDiv.id = "error-message";
    errorDiv.innerHTML = `
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;
    this.form.appendChild(errorDiv);

    // Auto-remove error message after 5 seconds
    setTimeout(() => {
      if (document.getElementById("error-message")) {
        document.getElementById("error-message").remove();
      }
    }, 5000);
  }

  // Helper method to show success messages
  showSuccess(message) {
    this.removeExistingMessages();
    const successDiv = document.createElement("div");
    successDiv.className =
      "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mt-4 text-sm";
    successDiv.id = "success-message";
    successDiv.innerHTML = `
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;
    this.form.appendChild(successDiv);
  }

  // Helper method to remove existing messages
  removeExistingMessages() {
    const existingError = document.getElementById("error-message");
    const existingSuccess = document.getElementById("success-message");
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
  }

  // Helper method to manage submit button state
  setSubmitButtonState(isLoading, text) {
    const submitButton = this.form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = isLoading;

      // Also disable the form inputs during submission
      const inputs = this.form.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        input.disabled = isLoading;
      });

      if (isLoading) {
        submitButton.innerHTML = `
          <div class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ${text}
          </div>
        `;
        submitButton.classList.add("opacity-75", "cursor-not-allowed");

        // Disable partner zone cards during submission
        this.partnerZoneCardsContainer.style.pointerEvents = "none";
        this.partnerZoneCardsContainer.style.opacity = "0.5";
      } else {
        submitButton.innerHTML = text;
        submitButton.classList.remove("opacity-75", "cursor-not-allowed");

        // Re-enable partner zone cards
        this.partnerZoneCardsContainer.style.pointerEvents = "auto";
        this.partnerZoneCardsContainer.style.opacity = "1";
      }
    }
  }

  // Helper method to focus on a specific field
  focusField(fieldName) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.focus();
      field.classList.add("border-red-400");
      // Remove red border after user starts typing
      field.addEventListener(
        "input",
        () => {
          field.classList.remove("border-red-400");
        },
        { once: true },
      );
    }
  }

  // Helper method to clear selected cards
  clearSelectedCards() {
    this.partnerZoneCardsContainer
      .querySelectorAll(".partner-card")
      .forEach((card) => {
        card.classList.remove(
          "border-gold",
          "bg-gold-50",
          "ring-2",
          "ring-gold",
          "ring-opacity-50",
          "shadow-lg",
        );
        const indicator = card.querySelector(".absolute.top-2.right-2");
        if (indicator) {
          indicator.classList.add("hidden");
          indicator.classList.remove("border-gold", "bg-gold");
          const svg = indicator.querySelector("svg");
          if (svg) {
            svg.classList.add("opacity-0");
            svg.classList.remove("opacity-100");
          }
        }
        const h3 = card.querySelector("h3");
        if (h3) {
          h3.classList.remove("text-gold");
        }
      });
  }
}

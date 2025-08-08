// ContactController.js
// Handles contact form submission logic for contact page
import CONFIG from "../config/config.js";
import { partnerService } from "../services/partner-service.js";

export default class ContactController {
  constructor() {
    this.form = document.querySelector("form");
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    // Collect form data
    const name = this.form.querySelector('input[type="text"]').value.trim();
    const email = this.form.querySelector('input[type="email"]').value.trim();
    const message = this.form.querySelector("textarea").value.trim();
    const phoneInput = this.form.querySelector('input[type="tel"]');
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const subject = "Contact Form Submission";
    const domain = "deccanrealty.com";

    // Basic validation
    if (!name || !email || !message) {
      this.showStatus("Please fill in all required fields.", false);
      return;
    }

    // Prepare payload
    const payload = {
      subject,
      message,
      email,
      name,
      phone,
      domain,
    };

    // Show loading state
    this.setButtonState(true, "Sending...");

    try {
      const result = await partnerService.sendContactMessage(payload);
      if (result && result.success !== false) {
        this.showToast(
          "Message sent successfully! We'll get back to you soon.",
          true,
        );
        this.form.reset();
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        this.showStatus(
          result.message || "Failed to send message. Please try again.",
          false,
        );
      }
    } catch (error) {
      this.showStatus("An error occurred. Please try again.", false);
    } finally {
      this.setButtonState(false, "Send Message");
    }
  }

  showToast(message, isSuccess) {
    let toast = document.createElement("div");
    toast.className = `fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-base font-semibold transition-all duration-300 ${isSuccess ? "bg-green-600 text-white" : "bg-red-600 text-white"}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("opacity-0");
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 1800);
  }

  showStatus(message, isSuccess) {
    let statusDiv = document.getElementById("contact-status");
    if (!statusDiv) {
      statusDiv = document.createElement("div");
      statusDiv.id = "contact-status";
      this.form.appendChild(statusDiv);
    }
    statusDiv.className = isSuccess
      ? "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mt-4 text-sm"
      : "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-4 text-sm";
    statusDiv.textContent = message;
    setTimeout(() => {
      if (statusDiv) statusDiv.remove();
    }, 5000);
  }
  setButtonState(isLoading, text) {
    const button = this.form.querySelector('button[type="submit"]');
    if (button) {
      button.textContent = text;
      button.classList.toggle("opacity-75", isLoading);
      button.classList.toggle("cursor-not-allowed", isLoading);
    }
  }
}

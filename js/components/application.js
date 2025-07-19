import { partnerService } from "../services/partner-service.js";

class ApplicationDownload {
  constructor() {
    this.driveLink = "";
    this.driveFileId = "";
    this.driveDeepLink = "";
    this.signupModal = document.getElementById("signupModal");
    this.downloadBtn = document.getElementById("downloadApk");
    this.closeSignupModal = document.getElementById("closeSignupModal");
    this.signupForm = document.getElementById("signupForm");
    this.loading = document.getElementById("loading");
    this.signupKey = 'mtone_signup_done';
    // Hide modal if already signed up
    if (localStorage.getItem('mtone_signup_done') === 'true' && this.signupModal) {
      this.signupModal.classList.add('hidden');
    }
    this.init();
  }

  init() {
    // Open modal on download click
    if (this.downloadBtn && this.signupModal) {
      this.downloadBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (localStorage.getItem(this.signupKey) === 'true') {
          // Already signed up, go directly to download
          this.handleDownload(this.downloadBtn, this.loading);
        } else {
          this.signupModal.classList.remove("hidden");
        }
      });
    }

    // Close modal
    if (this.closeSignupModal && this.signupModal) {
      this.closeSignupModal.addEventListener("click", () => {
        this.signupModal.classList.add("hidden");
      });
    }

    // Handle signup form submit
    if (this.signupForm && this.loading && this.downloadBtn) {
      this.signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = this.signupForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="loader inline-block w-5 h-5 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin align-middle mr-2"></span>Submitting...';
        }

        // Get form values
        const name = this.signupForm.elements["name"].value.trim();
        const email = this.signupForm.elements["email"].value.trim();
        const phone = this.signupForm.elements["phone"].value.trim();
        const address = this.signupForm.elements["address"].value.trim();
        const partnerZone = this.signupForm.elements["partnerZone"].value;

        try {
          // Call the signup API
          const result = await partnerService.partnerSignup(
            name,
            email,
            phone,
            address,
            partnerZone
          );
          if (result.success) {
            // Mark signup as done in localStorage
            localStorage.setItem(this.signupKey, 'true');
            this.signupModal.classList.add("hidden");
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = 'Continue to Download';
            }
            await this.handleDownload(this.downloadBtn, this.loading);
          } else {
            this.showSignupError(result.message || "Signup failed. Please try again.");
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = 'Continue to Download';
            }
          }
        } catch (err) {
          this.showSignupError(err.message || "Signup failed. Please try again.");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Continue to Download';
          }
        }
      });
    }
  }

  showSignupError(message) {
    // Show error in modal (simple alert for now, can be improved)
    alert(message);
  }



  async handleDownload(button, loading) {
    // Show loading state
    button.style.display = "none";
    loading.classList.remove("hidden");
    loading.style.display = "block";

    // Fetch the latest drive link from API
    const apiResult = await partnerService.getDriveLinkFromAPI();
    this.driveLink = apiResult?.data?.value || "";
    this.driveFileId =
      (this.driveLink.match(/\/file\/d\/([\w-]+)/) || [])[1] || "";
    this.driveDeepLink = `googledrive://file/d/${this.driveFileId}`;

    // Detect if device is mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    setTimeout(() => {
      if (isMobile) {
        // Try to open in Google Drive app first, fallback to browser
        const url = this.driveDeepLink;
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
        setTimeout(() => {
          window.open(this.driveLink, "_blank");
          document.body.removeChild(iframe);
        }, 1000);
      } else {
        // Desktop - open in new tab
        window.open(this.driveLink, "_blank");
      }

      // Reset UI
      loading.style.display = "none";
      loading.classList.add("hidden");
      button.style.display = "block";
      button.innerHTML = "✓ Opening Download";
      button.classList.add("btn-success");

      // Reset button after 3 seconds
      setTimeout(() => {
        button.innerHTML = "Download App";
        button.classList.remove("btn-success");
      }, 3000);
    }, 1500);
  }
}

export default ApplicationDownload;

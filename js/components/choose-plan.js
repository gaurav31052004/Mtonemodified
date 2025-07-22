import { partnerService } from "../services/partner-service.js";

class ChoosePlan {
  constructor() {
    this.signupDetailsContainer = document.getElementById("signup-details");
    this.trialBtn = document.querySelector('[data-plan="free"] button');
    this.proBtn = document.querySelector('[data-plan="pro"] button');
    this.proCard = document.querySelector('[data-plan="pro"]');
    this.customCard = document.querySelector('[data-plan="custom"]');
    this.init();
  }

  init() {
    this.showSignupDetails();
    this.setupPlanSelection();
  }

  showSignupDetails() {
    const details = JSON.parse(localStorage.getItem("partnerDetails") || "{}");
    if (!details.name) {
      this.signupDetailsContainer.innerHTML =
        '<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-8">No signup details found. Please complete signup first.</div>';
      return;
    }
    this.signupDetailsContainer.innerHTML = `
      <div class="bg-white/90 border border-gold/20 rounded-2xl shadow p-6 mb-8">
        <h3 class="text-lg font-bold mb-4 text-gold">User Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-base">
          <div><span class="font-semibold">Name:</span> ${details.name}</div>
          <div><span class="font-semibold">Email:</span> ${details.email}</div>
          <div><span class="font-semibold">Phone:</span> ${details.phone}</div>
          <div><span class="font-semibold">Address:</span> ${details.address}</div>
          <div><span class="font-semibold">Partner Zone:</span> ${details.partnerZone}</div>
        </div>
      </div>
    `;
  }

  setupPlanSelection() {
    // Hide custom plan
    if (this.customCard) this.customCard.style.display = "none";

    // Add period selection for Pro plan - insert after the pricing section
    const proPriceSection = this.proCard.querySelector('.mb-6');
    const proPeriodDiv = document.createElement("div");
    proPeriodDiv.className = "flex items-center justify-center gap-6 mb-6";
    proPeriodDiv.innerHTML = `
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="pro-period" value="monthly" checked class="w-4 h-4 text-gold border-2 border-gold/30 focus:ring-gold focus:ring-2"> 
        <span class="text-gray-700 font-medium">Monthly</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="pro-period" value="yearly" class="w-4 h-4 text-gold border-2 border-gold/30 focus:ring-gold focus:ring-2"> 
        <span class="text-gray-700 font-medium">Yearly</span>
      </label>
    `;
    
    // Insert the period selection after the price section
    proPriceSection.parentNode.insertBefore(proPeriodDiv, proPriceSection.nextSibling);

    // Update the Pro button text
    this.proBtn.innerHTML = '💎 Pay Now';

    // Set up dynamic pricing
    const monthlyRadio = proPeriodDiv.querySelector('input[value="monthly"]');
    const yearlyRadio = proPeriodDiv.querySelector('input[value="yearly"]');
    const priceSpan = this.proCard.querySelector('.text-5xl');
    const periodSpan = this.proCard.querySelector('.text-lg');

    function updatePrice() {
      if (yearlyRadio.checked) {
        priceSpan.textContent = '₹6710';
        periodSpan.textContent = '/year';
      } else {
        priceSpan.textContent = '₹699';
        periodSpan.textContent = '/month';
      }
    }
    
    monthlyRadio.addEventListener('change', updatePrice);
    yearlyRadio.addEventListener('change', updatePrice);
    updatePrice();

    // Trial button logic
    this.trialBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/login/";
    });

    // Pro pay button logic
    this.proBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      this.proBtn.disabled = true;
      this.proBtn.innerHTML = '⏳ Processing...';
      const period = document.querySelector('input[name="pro-period"]:checked').value;
      try {
        const response = await partnerService.createOrder("pro", period);
        console.log("CreateOrder API response:", response);
        if (!response) {
          alert("No response from order API.");
        } else if (!response.id) {
          alert("Order ID missing in response. Full response: " + JSON.stringify(response));
        } else if (!response.keyId) {
          alert("Razorpay keyId missing in response. Full response: " + JSON.stringify(response));
        } else {
          await this.loadRazorpayScript();
          this.openRazorpayCheckout(response.id, response.keyId);
        }
      } catch (err) {
        console.error("Error during payment flow:", err);
        alert("Error creating order: " + (err?.message || err));
      } finally {
        this.proBtn.disabled = false;
        this.proBtn.innerHTML = '💎 Pay Now';
      }
    });

  }

  async loadRazorpayScript() {
    if (!window.Razorpay) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
    return Promise.resolve();
  }

  openRazorpayCheckout(orderId, keyId) {
    const options = {
      key: keyId,
      order_id: orderId,
      name: "MT One",
      description: "Pro Plan Payment",
      handler: function (response) {
        console.log("Payment response:", response);
        
        // alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        window.location.href = "/login/";
      },
      theme: {
        color: "#FFD700",
      }
    };
    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay SDK not loaded.");
    }
  }
}

export default ChoosePlan;

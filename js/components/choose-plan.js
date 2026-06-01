import { partnerService } from "../services/partner-service.js";

class ChoosePlan {
  constructor() {
    this.signupDetailsContainer = document.getElementById("signup-details");
    this.pricingCards = document.getElementById("pricing-cards");
    this.plans = [];
    this.isYearly = false;
    this.init();
  }

  async init() {
    this.showSignupDetails();
    this.createToggle();
    this.bindToggleEvents();
    this.showLoader();
    await this.loadPlans();
    this.createFreeTrialPlan();
    this.renderPlans();
  }

  showSignupDetails() {
    const details = JSON.parse(localStorage.getItem("partnerDetails") || "{}");
    if (!details.name) {
      window.location.href = "/onboarding";
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
          <div><span class="font-semibold">Agent/Builder Zone:</span> ${details.partnerZone}</div>
        </div>
      </div>
    `;
  }

  createToggle() {
    // Find the signup-details container
    const signupDetailsContainer = document.getElementById('signup-details');
    
    // Create toggle container
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'flex items-center justify-center mb-12';
    toggleContainer.innerHTML = `
      <div class="flex items-center space-x-4">
        <span class="text-lg font-medium text-gray-700" id="monthly-label">Monthly</span>
        <div class="relative">
          <button class="w-16 h-8 bg-blue-300 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer" id="pricing-toggle" aria-label="Toggle pricing between monthly and yearly">
            <div class="w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300" id="toggle-slider"></div>
          </button>
        </div>
        <span class="text-lg font-medium text-gray-700" id="yearly-label">Yearly</span>
        <span class="ml-2 px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">Save 20%</span>
      </div>
    `;
    
    // Insert toggle after the signup details container
    signupDetailsContainer.insertAdjacentElement('afterend', toggleContainer);
  }

  bindToggleEvents() {
    const toggle = document.getElementById('pricing-toggle');
    const slider = document.getElementById('toggle-slider');
    
    if (toggle) {
      toggle.addEventListener('click', () => {
        this.isYearly = !this.isYearly;
        this.updateToggleUI();
        this.renderPlans();
      });
    }
  }

  showLoader() {
    const container = document.getElementById('pricing-cards');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          <span class="ml-4 text-gray-600">Loading plans...</span>
        </div>
      `;
    }
  }

  updateToggleUI() {
    const toggle = document.getElementById('pricing-toggle');
    const slider = document.getElementById('toggle-slider');
    const monthlyLabel = document.getElementById('monthly-label');
    const yearlyLabel = document.getElementById('yearly-label');
    
    if (this.isYearly) {
      toggle.classList.add('bg-gold');
      toggle.classList.remove('bg-blue-300');
      slider.style.transform = 'translateX(32px)';
      monthlyLabel.classList.add('text-gray-500');
      monthlyLabel.classList.remove('text-gray-700');
      yearlyLabel.classList.add('text-gray-900', 'font-semibold');
      yearlyLabel.classList.remove('text-gray-700');
    } else {
      toggle.classList.remove('bg-gold');
      toggle.classList.add('bg-blue-300');
      slider.style.transform = 'translateX(0)';
      monthlyLabel.classList.remove('text-gray-500');
      monthlyLabel.classList.add('text-gray-700');
      yearlyLabel.classList.remove('text-gray-900', 'font-semibold');
      yearlyLabel.classList.add('text-gray-700');
    }
  }

  async loadPlans() {
    try {
      this.plans = await partnerService.getPlans();
    } catch (error) {
      console.error("Failed to load plans:", error);
      this.plans = [];
    }
  }

  createFreeTrialPlan() {
    const freeTrialPlan = {
      id: 'free',
      planName: 'FREE Trial',
      price: 0,
      features: [
        'Up to 1,000 leads',
        'Basic CRM features',
        'Email support',
        'Mobile app access',
        '7 days trial period'
      ],
      description: 'Start your 7 days FREE trial. No credit card required.',
      billingCycle: 'Monthly',
      durationDays: 7,
      maxUsers: 1,
      isTrial: true
    };
    this.plans.unshift(freeTrialPlan);
  }

  renderPlans() {
    // Filter plans by billing cycle
    const currentPlans = this.isYearly 
      ? this.plans.filter(plan => plan.billingCycle === 'Yearly' || plan.isTrial)
      : this.plans.filter(plan => plan.billingCycle === 'Monthly' || plan.isTrial);
    
    // Create custom enterprise plan
    const customPlan = {
      id: 'custom',
      planName: 'Enterprise Plan',
      price: null,
      features: [
        'Unlimited leads',
        'Full CRM suite',
        '24/7 phone support',
        'Custom integrations',
        'Dedicated account manager',
        'Custom reporting'
      ],
      description: 'Need something tailored for your enterprise? Get in touch for a custom solution and pricing.',
      billingCycle: 'Custom',
      maxUsers: 'Unlimited'
    };

    this.renderAllPlans(currentPlans, customPlan);
  }

  renderAllPlans(plansToRender = [], customPlan) {
    // Clear existing cards
    this.pricingCards.innerHTML = '';

    if (plansToRender.length === 0) {
      this.showNoPlanMessage();
      return;
    }

    // Add all plans (paid/free trial)
    plansToRender.forEach(plan => {
      const planCard = this.createPlanCard(plan);
      this.pricingCards.appendChild(planCard);
    });

    // Add custom enterprise plan
    if (customPlan) {
      const enterpriseCard = this.createPlanCard(customPlan);
      this.pricingCards.appendChild(enterpriseCard);
    }
  }

  showNoPlanMessage() {
    const billingType = this.isYearly ? 'yearly' : 'monthly';
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-6 max-w-sm mx-auto';
    messageDiv.innerHTML = `
      <h3 class="font-bold mb-2">No ${billingType} plans available</h3>
      <p class="text-sm">Try switching to ${this.isYearly ? 'monthly' : 'yearly'} plans to see available options.</p>
    `;
    this.pricingCards.appendChild(messageDiv);
  }

  createPlanCard(plan) {
    const planId = plan.id;
    const isPopular = plan.planName && (plan.planName.toLowerCase().includes('pro') || plan.planName.toLowerCase().includes('premium'));
    const priceInRupees = plan.price ? (plan.price / 100).toLocaleString('en-IN') : null;
    const period = plan.billingCycle === 'Yearly' ? 'year' : 'month';
    
    // Determine button color based on billing cycle
    const isYearlyPlan = plan.billingCycle === 'Yearly';
    const buttonColorClass = isYearlyPlan 
      ? 'bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold'
      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
    
    // Generate features based on plan data
    let features = plan.features || [];
    if (!plan.features && plan.maxUsers) {
      features = [
        `Up to ${plan.maxUsers === 'Unlimited' ? 'unlimited' : plan.maxUsers} users`,
        'Advanced CRM features',
        'Lead management system',
        'Mobile app access',
        'Email & SMS campaigns'
      ];
      
      // Add premium features for higher-tier plans
      if (plan.price && plan.price > 200000) { // Above ₹2000
        features.push('Priority support', 'Advanced analytics', 'Custom integrations');
      } else if (plan.price && plan.price > 100000) { // Above ₹1000
        features.push('Email support', 'Basic analytics');
      } else {
        features.push('Basic support');
      }
    }
    
    const cardDiv = document.createElement('div');
    cardDiv.className = `bg-gradient-to-br ${planId === 'free' ? 'from-white to-gray-50/80' : 'from-white to-orange-50/80'} rounded-3xl shadow-2xl p-6 md:p-8 backdrop-blur-sm relative hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 min-h-[500px] w-full max-w-xs mx-auto group ${isPopular ? 'border-2 border-gold/40' : 'border border-gold/20'}`;
    cardDiv.setAttribute('data-plan', planId);
    
    cardDiv.innerHTML = `
      ${isPopular ? `
        <div class="absolute top-6 left-6">
          <span class="inline-block px-4 py-2 text-sm font-bold rounded-full shadow-lg animate-pulse" style="color: #fff; background: linear-gradient(135deg, #FFD700, #FFA500);">⭐ MOST POPULAR</span>
        </div>
        <div class="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-gold to-orange-400 rounded-full flex items-center justify-center shadow-lg">
          <span class="text-white font-bold text-sm">PRO</span>
        </div>
      ` : planId === 'free' ? `
        <div class="absolute top-6 left-6">
          <span class="inline-block px-4 py-2 text-sm font-bold rounded-full shadow-lg" style="color: #035388; background: linear-gradient(135deg, #E3F8FF, #F0F9FF);">🎯 FREE Trial</span>
        </div>
      ` : planId === 'custom' ? `
        <div class="absolute top-6 left-6">
          <span class="inline-block px-4 py-2 text-sm font-bold rounded-full shadow-lg" style="color: #035388; background: linear-gradient(135deg, #E3F8FF, #F0F9FF);">💼 ENTERPRISE</span>
        </div>
      ` : `
        <div class="absolute top-6 left-6">
          <span class="inline-block px-4 py-2 text-sm font-bold rounded-full shadow-lg" style="color: #035388; background: linear-gradient(135deg, #E3F8FF, #F0F9FF);">💼 ${plan.planName.toUpperCase()}</span>
        </div>
      `}
      
      <div class="text-center mb-8 mt-12">
        <div class="mb-6">
          <div class="flex items-baseline justify-center">
            <span class="text-5xl font-extrabold ${planId === 'free' ? 'bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent' : 'text-gray-900'}">
              ${plan.price === 0 ? '₹0' : 
                plan.price === null ? 'Contact Us' : 
                `₹${priceInRupees}`}
            </span>
            ${plan.price !== null && plan.price !== 0 ? `<span class="text-lg text-gray-600 ml-2">/${period}</span>` : plan.price === 0 ? `<span class="text-lg text-gray-500 ml-2">/trial</span>` : ''}
          </div>
          ${planId === 'free' ? `
            <div class="mt-2">
              <span class="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">✨ No Credit Card Required</span>
            </div>
          ` : plan.durationDays ? `
            <div class="mt-2">
              <span class="text-sm text-gray-500">${plan.durationDays} days access</span>
            </div>
          ` : ''}
        </div>
        <p class="text-base text-gray-600 mb-8 leading-relaxed">${plan.description || 'Plan description'}</p>
        <button class="w-full text-white cursor-pointer font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
          planId === 'free' 
            ? 'bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold'
            : planId === 'custom'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
              : buttonColorClass
        }" data-plan-id="${plan.id || planId}">
          ${planId === 'free' ? '🚀 Start FREE Trial' : 
            planId === 'custom' ? '📞 Contact Sales' : 
            `💎 Get ${plan.planName}`}
        </button>
      </div>
      
      <div class="space-y-4 text-left">
        ${features.slice(0, 6).map((feature, index) => {
          const colorClasses = [
            'bg-green-50', 'bg-green-500',
            'bg-blue-50', 'bg-blue-500', 
            'bg-purple-50', 'bg-purple-500',
            'bg-orange-50', 'bg-orange-500',
            'bg-indigo-50', 'bg-indigo-500',
            'bg-pink-50', 'bg-pink-500'
          ];
          const bgClass = colorClasses[(index * 2) % colorClasses.length];
          const iconClass = colorClasses[(index * 2 + 1) % colorClasses.length];
          return `
            <div class="flex items-center ${bgClass} p-3 rounded-xl">
              <div class="w-6 h-6 ${iconClass} rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span class="text-white text-xs">✓</span>
              </div>
              <span class="text-sm font-medium text-gray-700">${feature}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Add click handler for the button
    const button = cardDiv.querySelector('button');
    if (planId === 'free') {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "/login/";
      });
    } else if (planId === 'custom') {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'mailto:contact@mtone.in?subject=Enterprise Plan Inquiry';
      });
    } else {
      button.addEventListener('click', (e) => this.handlePaidPlanClick(e, plan));
    }

    return cardDiv;
  }

  async handlePaidPlanClick(e, plan) {
    e.preventDefault();
    const button = e.target;
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = '⏳ Processing...';
    
    try {
      const response = await partnerService.createOrder(plan.id);
      console.log("CreateOrder API response:", response);
      
      if (!response) {
        alert("No response from order API.");
      } else if (!response.data.razorpayOrderId) {
        alert("Order ID missing in response. Full response: " + JSON.stringify(response));
      } else if (!response.data.keyId) {
        alert("Razorpay keyId missing in response. Full response: " + JSON.stringify(response));
      } else {
        await this.loadRazorpayScript();
        this.openRazorpayCheckout(response.data.razorpayOrderId, response.data.keyId, plan);
      }
    } catch (err) {
      console.error("Error during payment flow:", err);
      alert("Error creating order: " + (err?.message || err));
    } finally {
      button.disabled = false;
      button.innerHTML = originalText;
    }
  }

  showPlanError() {
    // Clear all existing cards and show error
    this.pricingCards.innerHTML = '';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 max-w-sm mx-auto';
    errorDiv.innerHTML = `
      <h3 class="font-bold mb-2">Unable to Load Plans</h3>
      <p class="text-sm">Failed to fetch available plans. Please refresh the page or try again later.</p>
    `;
    this.pricingCards.appendChild(errorDiv);
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

  openRazorpayCheckout(orderId, keyId, plan) {
    const options = {
      key: keyId,
      order_id: orderId,
      name: "MT One",
      image: "https://res.cloudinary.com/df1kus7ro/image/upload/f_auto,q_auto,w_120/v1760445407/Group_105_ymmgvk.png",
      description: `${plan.planName} Payment`,
      handler: function (response) {
        console.log("Payment response:", response);
        
        // alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        window.location.href = "/login";
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

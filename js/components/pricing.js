import { partnerService } from "../services/partner-service.js";

class PricingToggle {
    constructor() {
        this.isYearly = false;
        this.plans = [];
        this.init();
    }

    async init() {
        this.createToggle();
        this.bindEvents();
        await this.loadPlans();
        this.renderPricingCards();
    }

    createToggle() {
        const pricingSection = document.querySelector('#pricing');
        const header = pricingSection.querySelector('h2');
        
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
        
        // Insert toggle after header
        header.insertAdjacentElement('afterend', toggleContainer);
    }

    bindEvents() {
        const toggle = document.getElementById('pricing-toggle');
        const slider = document.getElementById('toggle-slider');
        
        toggle.addEventListener('click', () => {
            this.isYearly = !this.isYearly;
            this.updateToggleUI();
            this.renderPricingCards();
        });
    }

    async loadPlans() {
        try {
            this.plans = await partnerService.getPlans();
        } catch (error) {
            console.error("Failed to load plans:", error);
            // Fallback to empty array if API fails
            this.plans = [];
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

    getPricingData() {
        // Filter plans by billing cycle
        const monthlyPlans = this.plans.filter(plan => plan.billingCycle === 'Monthly');
        const yearlyPlans = this.plans.filter(plan => plan.billingCycle === 'Yearly');
        
        // Create trial plan (always free)
        const trialPlan = {
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

        // Create custom plan (always contact us)
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

        return {
            monthly: {
                free: trialPlan,
                plans: monthlyPlans,
                custom: customPlan
            },
            yearly: {
                free: trialPlan,
                plans: yearlyPlans,
                custom: customPlan
            }
        };
    }

    renderPricingCards() {
        const pricingData = this.getPricingData();
        const currentData = this.isYearly ? pricingData.yearly : pricingData.monthly;
        const period = this.isYearly ? 'year' : 'month';
        
        // Clear existing cards
        const pricingContainer = document.getElementById('pricing-cards');
        if (!pricingContainer) return;
        
        pricingContainer.innerHTML = '';
        
        // Always show free trial first
        this.createPricingCard('free', currentData.free, period, pricingContainer);
        
        // Show API plans
        currentData.plans.forEach(plan => {
            this.createPricingCard(plan.id, plan, period, pricingContainer);
        });
        
        // Always show custom plan last
        this.createPricingCard('custom', currentData.custom, period, pricingContainer);
    }

    createPricingCard(planId, planData, period, container) {
        const isPopular = planData.planName && (planData.planName.toLowerCase().includes('pro') || planData.planName.toLowerCase().includes('premium'));
        const priceInRupees = planData.price ? (planData.price / 100).toLocaleString('en-IN') : null;
        
        // Determine button color based on billing cycle
        const isYearlyPlan = planData.billingCycle === 'Yearly';
        const buttonColorClass = isYearlyPlan 
            ? 'bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
        
        // Generate features based on plan data
        let features = planData.features || [];
        if (!planData.features && planData.maxUsers) {
            // Generate features based on plan characteristics
            features = [
                `Up to ${planData.maxUsers === 'Unlimited' ? 'unlimited' : planData.maxUsers} users`,
                'Advanced CRM features',
                'Lead management system',
                'Mobile app access',
                'Email & SMS campaigns'
            ];
            
            // Add premium features for higher-tier plans
            if (planData.price && planData.price > 200000) { // Above ₹2000
                features.push('Priority support', 'Advanced analytics', 'Custom integrations');
            } else if (planData.price && planData.price > 100000) { // Above ₹1000
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
                    <span class="inline-block px-4 py-2 text-sm font-bold rounded-full shadow-lg" style="color: #035388; background: linear-gradient(135deg, #E3F8FF, #F0F9FF);">💼 ${planData.planName.toUpperCase()}</span>
                </div>
            `}
            
            <div class="text-center mb-8 mt-12">
                <div class="mb-6">
                    <div class="flex items-baseline justify-center">
                        <span class="text-5xl font-extrabold ${planId === 'free' ? 'bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent' : 'text-gray-900'}">
                            ${planData.price === 0 ? '₹0' : 
                              planData.price === null ? 'Contact Us' : 
                              `₹${priceInRupees}`}
                        </span>
                        ${planData.price !== null && planData.price !== 0 ? `<span class="text-lg text-gray-600 ml-2">/${period}</span>` : planData.price === 0 ? `<span class="text-lg text-gray-500 ml-2">/trial</span>` : ''}
                    </div>
                    ${planId === 'free' ? `
                        <div class="mt-2">
                            <span class="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">✨ No Credit Card Required</span>
                        </div>
                    ` : planData.durationDays ? `
                        <div class="mt-2">
                            <span class="text-sm text-gray-500">${planData.durationDays} days access</span>
                        </div>
                    ` : ''}
                </div>
                <p class="text-base text-gray-600 mb-8 leading-relaxed">${planData.description || 'Plan description'}</p>
                <button class="w-full text-white cursor-pointer font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    planId === 'free' 
                        ? 'bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold'
                        : planId === 'custom'
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                            : buttonColorClass
                }" data-plan-id="${planData.id || planId}">
                    ${planId === 'free' ? '🚀 Start FREE Trial' : 
                      planId === 'custom' ? '📞 Contact Sales' : 
                      `💎 Get ${planData.planName}`}
                </button>
            </div>

            <div class="space-y-4">
                ${features.slice(0, 6).map((feature, index) => {
                    const colors = ['green', 'blue', 'purple', 'orange', 'indigo', 'pink'];
                    const color = colors[index % colors.length];
                    return `
                        <div class="flex items-center bg-${color}-50 p-3 rounded-xl">
                            <div class="w-6 h-6 bg-${color}-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                <span class="text-white text-xs">✓</span>
                            </div>
                            <span class="text-sm font-medium text-gray-700">${feature}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Add click handler for button
        const button = cardDiv.querySelector('button');
        if (button) {
            if (planId === 'free' || (planData.id && planData.id !== 'custom')) {
                button.onclick = () => {
                    // Store selected plan data for checkout
                    if (planData.id && planData.id !== 'free') {
                        localStorage.setItem('selectedPlan', JSON.stringify(planData));
                    }
                    window.location.href = '/onboarding';
                };
            } else if (planId === 'custom') {
                button.onclick = () => {
                    // Handle custom plan contact
                    window.location.href = 'mailto:contact@mtone.in?subject=Enterprise Plan Inquiry';
                };
            }
        }

        container.appendChild(cardDiv);
    }
}

export default PricingToggle;

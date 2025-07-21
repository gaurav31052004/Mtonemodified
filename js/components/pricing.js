class PricingToggle {
    constructor() {
        this.isYearly = false;
        this.init();
    }

    init() {
        this.createToggle();
        this.bindEvents();
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
                    <button class="w-16 h-8 bg-gray-300 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50" id="pricing-toggle" aria-label="Toggle pricing between monthly and yearly">
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

    updateToggleUI() {
        const toggle = document.getElementById('pricing-toggle');
        const slider = document.getElementById('toggle-slider');
        const monthlyLabel = document.getElementById('monthly-label');
        const yearlyLabel = document.getElementById('yearly-label');
        
        if (this.isYearly) {
            toggle.classList.add('bg-gold');
            toggle.classList.remove('bg-gray-300');
            slider.style.transform = 'translateX(32px)';
            monthlyLabel.classList.add('text-gray-500');
            monthlyLabel.classList.remove('text-gray-700');
            yearlyLabel.classList.add('text-gray-900', 'font-semibold');
            yearlyLabel.classList.remove('text-gray-700');
        } else {
            toggle.classList.remove('bg-gold');
            toggle.classList.add('bg-gray-300');
            slider.style.transform = 'translateX(0)';
            monthlyLabel.classList.remove('text-gray-500');
            monthlyLabel.classList.add('text-gray-700');
            yearlyLabel.classList.remove('text-gray-900', 'font-semibold');
            yearlyLabel.classList.add('text-gray-700');
        }
    }

    getPricingData() {
        return {
            monthly: {
                free: {
                    price: 0,
                    features: [
                        'Up to 1,000 leads',
                        'Basic CRM features',
                        'Email support',
                        'Mobile app access'
                    ],
                    description: 'Start your 7 days FREE trial. No credit card required.'
                },
                pro: {
                    price: 699,
                    features: [
                        'Up to 10,000 leads',
                        'Advanced CRM features',
                        'Priority email support',
                        'Mobile app access',
                        'Automated workflows',
                        'Advanced analytics'
                    ],
                    description: 'Unlock advanced CRM features, automation, and premium support for growing teams.'
                },
                custom: {
                    price: null,
                    features: [
                        'Unlimited leads',
                        'Full CRM suite',
                        '24/7 phone support',
                        'Mobile app access',
                        'Automated workflows',
                        'Advanced analytics',
                        'Team collaboration',
                        'Custom integrations'
                    ],
                    description: 'Need something tailored for your enterprise? Get in touch for a custom solution and pricing.'
                }
            },
            yearly: {
                free: {
                    price: 0,
                    features: [
                        'Up to 1,000 leads',
                        'Basic CRM features',
                        'Email support',
                        'Mobile app access'
                    ],
                    description: 'Start your 7 days FREE trial. No credit card required.'
                },
                pro: {
                    price: 6710, // ₹699 * 12 * 0.8 (20% discount)
                    features: [
                        'Up to 10,000 leads',
                        'Advanced CRM features',
                        'Priority email support',
                        'Mobile app access',
                        'Automated workflows',
                        'Advanced analytics'
                    ],
                    description: 'Unlock advanced CRM features, automation, and premium support for growing teams.'
                },
                custom: {
                    price: null,
                    features: [
                        'Unlimited leads',
                        'Full CRM suite',
                        '24/7 phone support',
                        'Mobile app access',
                        'Automated workflows',
                        'Advanced analytics',
                        'Team collaboration',
                        'Custom integrations'
                    ],
                    description: 'Need something tailored for your enterprise? Get in touch for a custom solution and pricing.'
                }
            }
        };
    }

    renderPricingCards() {
        const pricingData = this.getPricingData();
        const currentData = this.isYearly ? pricingData.yearly : pricingData.monthly;
        const period = this.isYearly ? 'year' : 'month';
        // Update FREE Trial Plan
        this.updateCard('free', currentData.free, period);
        // Update Pro Plan
        this.updateCard('pro', currentData.pro, period);
        // Update Custom Plan
        this.updateCard('custom', currentData.custom, period);
    }

    updateCard(planType, data, period) {
        const card = document.querySelector(`[data-plan="${planType}"]`);
        if (!card) return;
        // Update price
        const priceElement = card.querySelector('.text-3xl');
        if (priceElement) {
            if (data.price === 0) {
                priceElement.textContent = '₹0';
            } else if (data.price === null) {
                priceElement.textContent = 'Contact Us';
            } else {
                priceElement.textContent = `₹${data.price.toLocaleString()}`;
            }
        }
        // Update period
        const periodElement = card.querySelector('.text-gray-600');
        if (periodElement && periodElement.textContent.includes('/')) {
            if (data.price === null) {
                periodElement.textContent = '';
            } else {
                periodElement.textContent = `/${period}`;
            }
        }
        // Update description
        const descriptionElement = card.querySelector('.text-sm.text-gray-600');
        if (descriptionElement) {
            descriptionElement.textContent = data.description;
        }
        // Update features
        const featureElements = card.querySelectorAll('.space-y-3 .flex.items-center');
        // Hide all features first
        featureElements.forEach(element => {
            element.style.display = 'none';
        });
        // Show and update only the features we have data for
        data.features.forEach((feature, index) => {
            if (featureElements[index]) {
                const textElement = featureElements[index].querySelector('.text-sm.text-gray-700');
                if (textElement) {
                    textElement.textContent = feature;
                    featureElements[index].style.display = 'flex';
                }
            }
        });
    }
}

export default PricingToggle;

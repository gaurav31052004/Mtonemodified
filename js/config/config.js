// Environment Configuration
const CONFIG = {
  // API Configuration
  API: {
    // Production
    // BASE_URL: 'https://api.mtone.in',
    // REDIRECT_URL: 'https://app.mtone.in/Redirecting',

    // Development
    BASE_URL: 'https://dncrnewapi-bmbfb6f6awd8b0bd.westindia-01.azurewebsites.net',
    // BASE_URL: 'https://localhost:7075',
    REDIRECT_URL: 'https://devdncrfe.azurewebsites.net/Redirecting',
    JWT: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjE5NiIsIkVtYWlsIjoiYW5zaXRkZWVsaXAyMzlAZ21haWwuY29tIiwiUm9sZSI6IkFkbWluIiwic3RhdHVzIjoiMTEyIiwibmJmIjoxNzU0MDQyMzY2LCJleHAiOjE3ODU1NzgzNjYsImlhdCI6MTc1NDA0MjM2Nn0.GFf77etW7ZBBc5l_MQec2Tk09gBGlsPRkcel5jbHLwc',

    DEFAULT_TOKEN: 'e74e1523bfaf582757ca621fd6166361a1df604b3c6369383f313fba83baceac',
    TIMEOUT: 30000, // 30 seconds
  },

  // Storage Keys
  STORAGE_KEYS: {
    PARTNER_DATA: 'mt_partner_data',
    USER_TOKEN: 'mt_user_token',
    USER_EMAIL: 'mt_user_email',
    SELECTED_PARTNER: 'mt_selected_partner'
  },

  // UI Configuration
  UI: {
    DEFAULT_COLORS: {
      PRIMARY: '#FFA500',
      SECONDARY: '#FFD700',
      BACKGROUND: '#ffffff',
      TEXT: '#000000'
    },
    ANIMATION_DURATION: 300,
    OTP_LENGTH: 6,
    OTP_EXPIRY_TIME: 300000 // 5 minutes
  },

  // API Endpoints
  ENDPOINTS: {
    PARTNER_LOCATIONS: '/master-details?masterName=PartnerLocation',
    OTP_VERIFICATION: '/account/otp-verification',
    CHECK_EMAIL: '/account/check-email',
    PARTNER_SIGNUP: '/account/partner-signup',
    APK_LINK: '/appsettings/APKLink',
    YOUTUBE_LINK: '/appsettings/YoutubePlaceholderLink',
    CREATE_ORDER: '/payment/orders/create',
    PAYMENT_PLANS: '/payment/plans',
  },

  // Environment
  ENVIRONMENT: 'production', // 'development' | 'staging' | 'production'
  
  // Debug mode
  DEBUG: false
};

// Utility function to get full API URL
CONFIG.getApiUrl = (endpoint) => {
  return `${CONFIG.API.BASE_URL}${endpoint}`;
};

// Utility function to get redirect URL with token
CONFIG.getRedirectUrl = (token) => {
  return `${CONFIG.API.REDIRECT_URL}?tok=${token}`;
};

export default CONFIG;

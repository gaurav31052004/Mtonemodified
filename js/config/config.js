// Environment Configuration
const CONFIG = {
  // API Configuration
  API: {
    // BASE_URL: 'https://mtestatesapi-f0bthnfwbtbxcecu.southindia-01.azurewebsites.net',
    BASE_URL: 'https://api.mtone.in',
    // BASE_URL: 'https://dncrnewapi-bmbfb6f6awd8b0bd.westindia-01.azurewebsites.net',
    REDIRECT_URL: 'https://app.mtone.in/Redirecting',
    // REDIRECT_URL: 'https://devdncrfe.azurewebsites.net/Redirecting',
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
    APK_LINK: '/appsettings/APKLink'
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

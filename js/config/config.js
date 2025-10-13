import { environment } from "@/environment";

// Environment Configuration
const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: environment.API_URL,
    REDIRECT_URL: environment.REDIRECT_URL,
    environment: environment.environment,

    DEFAULT_TOKEN:
      "e74e1523bfaf582757ca621fd6166361a1df604b3c6369383f313fba83baceac",
    TIMEOUT: 30000, // 30 seconds
  },

  // Storage Keys
  STORAGE_KEYS: {
    PARTNER_DATA: "mt_partner_data",
    USER_TOKEN: "mt_user_token",
    USER_EMAIL: "mt_user_email",
    SELECTED_PARTNER: "mt_selected_partner",
  },

  // UI Configuration
  UI: {
    DEFAULT_COLORS: {
      PRIMARY: "#FFA500",
      SECONDARY: "#FFD700",
      BACKGROUND: "#ffffff",
      TEXT: "#000000",
    },
    ANIMATION_DURATION: 300,
    OTP_LENGTH: 6,
    OTP_EXPIRY_TIME: 300000, // 5 minutes
  },

  // App Store Links
  APP_LINKS: {
    GOOGLE_PLAY: "https://play.google.com/store/apps/details?id=com.mtonema",
    APP_STORE: "https://apps.apple.com/in/app/mt-one-real-estate-crm-app/id6752515915", // Placeholder - update when available
  },

  // API Endpoints
  ENDPOINTS: {
    PARTNER_LOCATIONS: "/master-details?masterName=PartnerLocation",
    OTP_VERIFICATION: "/account/otp-verification",
    CHECK_EMAIL: "/account/check-email",
    PARTNER_SIGNUP: "/account/partner-signup",
    APK_LINK: "/appsettings/APKLink",
    YOUTUBE_LINK: "/appsettings/YoutubePlaceholderLink",
    CREATE_ORDER: "/payment/orders/create",
    PAYMENT_PLANS: "/payment/plans",
    CONTACT: "/properties/GetInTouch",
  },

  // Environment
  ENVIRONMENT: environment.environment, // Will be 'development' or 'production' based on build

  // Debug mode - enable in development
  DEBUG: environment.environment === "development",
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

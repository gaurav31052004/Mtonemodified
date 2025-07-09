import CONFIG from '../config/config.js';

/**
 * API Service class for handling all HTTP requests
 */
class ApiService {
  constructor() {
    this.baseURL = CONFIG.API.BASE_URL;
    this.defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.API.DEFAULT_TOKEN}`
    };
  }

  /**
   * Generic HTTP request method
   */
  async request(endpoint, options = {}) {
    const url = CONFIG.getApiUrl(endpoint);
    const config = {
      method: 'GET',
      headers: { ...this.defaultHeaders },
      ...options
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT);
      
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (CONFIG.DEBUG) {
        console.log('API Response:', data);
      }

      if (!response.ok) {
        // Create error with API response message if available
        const error = new Error(data.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.statusText = response.statusText;
        error.apiResponse = data;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET'
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  /**
   * Update authorization token
   */
  setAuthToken(token) {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }
}

/**
 * Partner Service - handles partner location operations
 */
class PartnerService extends ApiService {
  /**
   * Fetch all partner locations
   */
  async getPartnerLocations() {
    try {
      const response = await this.get(CONFIG.ENDPOINTS.PARTNER_LOCATIONS);
      
      if (response.success && response.data) {
        // Parse description JSON for each partner
        const partners = response.data.map(partner => {
          try {
            const description = JSON.parse(partner.description);
            return {
              id: partner.id,
              masterDetailName: partner.masterDetailName,
              ...description
            };
          } catch (e) {
            console.error('Error parsing partner description:', e);
            return {
              id: partner.id,
              name: partner.masterDetailName,
              imageUrl: '',
              iconUrl: '',
              domain: '',
              loginRoute: '',
              colorScheme: CONFIG.UI.DEFAULT_COLORS
            };
          }
        });
        
        return partners;
      }
      
      throw new Error(response.message || 'Failed to fetch partner locations');
    } catch (error) {
      console.error('Error fetching partner locations:', error);
      throw error;
    }
  }
}

/**
 * Authentication Service - handles OTP and authentication operations
 */
class AuthService extends ApiService {
  /**
   * Check if email exists in the system
   */
  async checkEmail(email) {
    try {
      const response = await this.get(`${CONFIG.ENDPOINTS.CHECK_EMAIL}?email=${encodeURIComponent(email)}`);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }
      
      throw new Error(response.message || 'Email not found');
    } catch (error) {
      console.error('Error checking email:', error);
      
      // Handle 404 specifically for email not found
      if (error.status === 404) {
        const emailNotFoundError = new Error(error.apiResponse?.message || 'Email address not found. Please check your email or contact your administrator.');
        emailNotFoundError.code = 'EMAIL_NOT_FOUND';
        emailNotFoundError.status = 404;
        throw emailNotFoundError;
      }
      
      // If the error already has the API response message, use it
      if (error.apiResponse && error.apiResponse.message) {
        const apiError = new Error(error.apiResponse.message);
        apiError.status = error.status;
        apiError.apiResponse = error.apiResponse;
        throw apiError;
      }
      
      throw error;
    }
  }

  /**
   * Send OTP to email
   */
  async sendOTP(email, domain) {
    try {
      const response = await this.post(CONFIG.ENDPOINTS.OTP_VERIFICATION, {
        email,
        domain
      });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Failed to send OTP');
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // If the error already has the API response message, use it
      if (error.apiResponse && error.apiResponse.message) {
        const apiError = new Error(error.apiResponse.message);
        apiError.status = error.status;
        apiError.apiResponse = error.apiResponse;
        throw apiError;
      }
      
      throw error;
    }
  }

  /**
   * Verify OTP and get authentication token
   */
  async verifyOTP(email, otp, domain) {
    try {
      const response = await this.post(CONFIG.ENDPOINTS.OTP_VERIFICATION, {
        email,
        otp,
        domain
      });
      
      if (response.success && response.data) {
        return {
          success: true,
          token: response.data,
          message: response.message
        };
      }
      
      // If API returns an error response, throw with message and status
      const error = new Error(response.message || 'Failed to verify OTP');
      error.status = response.httpStatus || 400;
      error.apiResponse = response;
      throw error;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      // If the error already has the API response message, use it
      if (error.apiResponse && error.apiResponse.message) {
        const apiError = new Error(error.apiResponse.message);
        apiError.status = error.status;
        apiError.apiResponse = error.apiResponse;
        throw apiError;
      }
      
      // If error is not an instance of Error, wrap it
      if (!(error instanceof Error)) {
        const wrapped = new Error('Failed to verify OTP');
        wrapped.original = error;
        throw wrapped;
      }
      
      throw error;
    }
  }

  /**
   * Redirect to main application with token
   */
  redirectToApp(token) {
    const redirectUrl = CONFIG.getRedirectUrl(token);
    window.location.href = redirectUrl;
  }

  /**
   * Store authentication data
   */
  storeAuthData(token, email) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER_TOKEN, token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER_EMAIL, email);
  }

  /**
   * Clear authentication data
   */
  clearAuthData() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.SELECTED_PARTNER);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
  }

  /**
   * Get stored authentication token
   */
  getAuthToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
  }
}

/**
 * Storage Service - handles local storage operations
 */
class StorageService {
  /**
   * Store partner data
   */
  static storePartnerData(partnerData) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.PARTNER_DATA, JSON.stringify(partnerData));
  }

  /**
   * Get stored partner data
   */
  static getPartnerData() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEYS.PARTNER_DATA);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Store selected partner
   */
  static storeSelectedPartner(partner) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.SELECTED_PARTNER, JSON.stringify(partner));
  }

  /**
   * Get selected partner
   */
  static getSelectedPartner() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEYS.SELECTED_PARTNER);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Clear all stored data
   */
  static clearAll() {
    Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Export service instances
export const partnerService = new PartnerService();
export const authService = new AuthService();
export { StorageService };

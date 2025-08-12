import CONFIG from '../config/config.js';

class ApiService {
  constructor() {
    this.baseURL = CONFIG.API.BASE_URL;
    this.defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.API.DEFAULT_TOKEN}`
    };
  }

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

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  setAuthToken(token) {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }
}

export default ApiService;

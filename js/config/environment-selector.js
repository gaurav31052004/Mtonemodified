// Environment selector based on Vite mode
import { environment as devEnvironment } from './environment.js';
import { environment as prodEnvironment } from './environment.prod.js';

// Get the environment from Vite's mode
// Default to development if no mode is specified
const isProduction = import.meta.env.NODE_ENV === 'production' || 
                    import.meta.env.MODE === 'production' ||
                    import.meta.env.PROD;

export const environment = isProduction ? prodEnvironment : devEnvironment;

// Log current environment for debugging
console.log(`🌍 Environment: ${environment.environment}`, {
  API_URL: environment.API_URL,
  REDIRECT_URL: environment.REDIRECT_URL,
  NODE_ENV: import.meta.env.NODE_ENV || 'undefined',
  MODE: import.meta.env.MODE || 'undefined',
  PROD: import.meta.env.PROD || false
});

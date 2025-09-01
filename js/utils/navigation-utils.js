import CONFIG from "../config/config.js";

/**
 * Navigation utilities for handling external links and app store navigation
 */
export class NavigationUtils {
  /**
   * Initialize global navigation functions
   */
  static initialize() {
    // Make functions globally available
    window.openAppStore = this.openAppStore.bind(this);
    window.openExternalLink = this.openExternalLink.bind(this);
  }

  /**
   * Opens the specified app store link in a new tab
   * @param {string} store - The store type ('google-play' or 'app-store')
   */
  static openAppStore(store) {
    let url = '';

    switch(store) {
      case 'google-play':
        url = CONFIG.APP_LINKS.GOOGLE_PLAY;
        break;
      case 'app-store':
        url = CONFIG.APP_LINKS.APP_STORE;
        break;
      default:
        console.warn('Unknown app store:', store);
        return;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Opens external links safely
   * @param {string} url - The URL to open
   * @param {string} target - The target attribute (_blank, _self, etc.)
   */
  static openExternalLink(url, target = '_blank') {
    if (url) {
      const features = target === '_blank' ? 'noopener,noreferrer' : '';
      window.open(url, target, features);
    }
  }
}

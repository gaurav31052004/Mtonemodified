import CONFIG from '../config/config.js';

class StorageService {
  static storePartnerData(partnerData) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.PARTNER_DATA, JSON.stringify(partnerData));
  }

  static getPartnerData() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEYS.PARTNER_DATA);
    return data ? JSON.parse(data) : null;
  }

  static storeSelectedPartner(partner) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.SELECTED_PARTNER, JSON.stringify(partner));
  }

  static getSelectedPartner() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEYS.SELECTED_PARTNER);
    return data ? JSON.parse(data) : null;
  }

  static clearAll() {
    Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export { StorageService };

/**
 * Utility functions for adding common scripts and resources
 */

/**
 * Dynamically add Font Awesome script to <head>
 */
export function addFontAwesome() {
  // Disabled to eliminate render-blocking FontAwesome CDN script injection
}

/**
 * Dynamically add favicon to <head>
 */
export function addFavicon() {
  const faviconUrl = "https://res.cloudinary.com/df1kus7ro/image/upload/f_auto,q_auto,w_32/v1760445407/Group_108_abchap.png";
  let link = document.querySelector('link[rel~="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/png';
  link.href = faviconUrl;
}

/**
 * Initialize common utilities
 */
export function initUtils() {
  addFontAwesome();
  addFavicon();
}

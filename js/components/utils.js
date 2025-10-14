/**
 * Utility functions for adding common scripts and resources
 */

/**
 * Dynamically add Font Awesome script to <head>
 */
export function addFontAwesome() {
  if (!document.querySelector('script[src*="fontawesome.com"]')) {
    const fa = document.createElement('script');
    fa.src = "https://kit.fontawesome.com/cfa9c31eb9.js";
    fa.crossOrigin = "anonymous";
    fa.async = true;
    document.head.appendChild(fa);
  }
}

/**
 * Dynamically add favicon to <head>
 */
export function addFavicon() {
  const faviconUrl = "https://res.cloudinary.com/df1kus7ro/image/upload/v1760445407/Group_108_abchap.png";
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

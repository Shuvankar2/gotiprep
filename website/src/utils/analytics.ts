// Google Tag Manager & Analytics Utility for GotiPrep (GTM-PVP3933C)

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GTM_ID = 'GTM-PVP3933C';

/**
 * Initializes dataLayer and gtag functions if not already present
 */
export const initAnalytics = (): void => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
};

/**
 * Pushes a virtual pageview event to Google Tag Manager dataLayer on client-side SPA navigation
 */
export const trackPageView = (path: string, title?: string): void => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: 'page_view',
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

/**
 * Tracks custom user interactions and events
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
): void => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: eventName,
    ...eventParams,
  });
};

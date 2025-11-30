// src/analytics.js

// Your GA4 Measurement ID
export const GA_MEASUREMENT_ID = "G-FG3D69C4C4";

// Send a pageview to GA4
export const sendPageview = (url) => {
  if (!window.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Send a custom event to GA4
export const sendEvent = ({ action, category, label, value }) => {
  if (!window.gtag) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

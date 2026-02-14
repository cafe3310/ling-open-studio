/**
 * Application feature toggles and configuration.
 */

const isProduction = process.env.NODE_ENV === 'production';

export const APP_CONFIG = {
  features: {
    tabs: {
      chat: true,
      web: true,
      // Hide Write tab in production as it's still in development
      write: !isProduction,
      filesystem: true,
    }
  }
} as const;

export type TabId = keyof typeof APP_CONFIG.features.tabs;

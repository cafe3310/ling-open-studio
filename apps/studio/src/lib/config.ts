/**
 * Application feature toggles and configuration.
 */

const isProduction = process.env.NODE_ENV === 'production';

export const APP_CONFIG = {
  features: {
    tabs: {
      chat: true,
      web: true,
      write: !isProduction,   // Reference (ref)
      writeV2: !isProduction, // New (development)
      filesystem: true,
    }
  }
} as const;

export type TabId = keyof typeof APP_CONFIG.features.tabs;

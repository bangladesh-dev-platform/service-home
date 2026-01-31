/**
 * Application constants and configuration
 */

// API URLs from environment - use production URLs as defaults
export const API_URL = import.meta.env.VITE_API_URL || 'https://api.banglade.sh'
export const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'https://auth.banglade.sh'
export const YOUTUBE_URL = import.meta.env.VITE_YOUTUBE_URL || 'https://youtube.banglade.sh'

// Auth constants - use same keys as service-youtube for shared SSO
export const TOKEN_KEY = 'bdp_access_token'
export const REFRESH_TOKEN_KEY = 'bdp_refresh_token'
export const POST_LOGIN_REDIRECT_KEY = 'bdp_post_login_redirect'

// SSO callback path
export const AUTH_CALLBACK_PATH = '/auth/callback'

// Supported languages
export const LANGUAGES = {
  bn: { name: 'বাংলা', code: 'bn' },
  en: { name: 'English', code: 'en' },
}

export const DEFAULT_LANGUAGE = 'bn'

// Navigation items
export const NAV_ITEMS = [
  { key: 'news', path: '/news' },
  { key: 'weather', path: '/weather' },
  { key: 'jobs', path: '/jobs' },
  { key: 'education', path: '/education' },
  { key: 'notices', path: '/notices' },
  { key: 'entertainment', path: '/entertainment' },
  { key: 'sports', path: '/sports' },
  { key: 'business', path: '/business' },
  { key: 'technology', path: '/technology' },
  { key: 'health', path: '/health' },
]

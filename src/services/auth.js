/**
 * Auth service for SSO with service-auth
 * Uses same pattern as service-youtube for shared authentication
 */
import { API_URL, AUTH_URL, TOKEN_KEY, REFRESH_TOKEN_KEY, POST_LOGIN_REDIRECT_KEY, AUTH_CALLBACK_PATH } from '../utils/constants'

/**
 * Auth service methods
 */
export const auth = {
  /**
   * Redirect user to auth.banglade.sh for login
   * @param {string} redirectPath - Path to return to after login (optional)
   */
  login: (redirectPath) => {
    if (typeof window === 'undefined') return

    // Save desired return path
    const desiredPath = redirectPath || `${window.location.pathname}${window.location.search}` || '/'
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, desiredPath === '/login' ? '/' : desiredPath)

    // Build auth URL with redirect_url parameter (same as service-youtube)
    const loginUrl = new URL(AUTH_URL)
    loginUrl.searchParams.set('redirect_url', `${window.location.origin}${AUTH_CALLBACK_PATH}`)

    window.location.href = loginUrl.toString()
  },

  /**
   * Redirect user to auth.banglade.sh for registration
   * @param {string} redirectPath - Path to return to after registration (optional)
   */
  register: (redirectPath) => {
    if (typeof window === 'undefined') return

    const desiredPath = redirectPath || '/'
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, desiredPath)

    const registerUrl = new URL(AUTH_URL)
    registerUrl.searchParams.set('redirect_url', `${window.location.origin}${AUTH_CALLBACK_PATH}`)
    registerUrl.searchParams.set('mode', 'register')

    window.location.href = registerUrl.toString()
  },

  /**
   * Complete login after callback from auth service
   * @param {Object} payload - { accessToken, refreshToken }
   */
  completeLogin: ({ accessToken, refreshToken }) => {
    if (typeof window === 'undefined') return

    localStorage.setItem(TOKEN_KEY, accessToken)
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  },

  /**
   * Get the redirect path after login and clear it
   * @returns {string} Path to redirect to
   */
  getAndClearRedirectPath: () => {
    if (typeof window === 'undefined') return '/'
    
    const path = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY) || '/'
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY)
    return path
  },

  /**
   * Logout user - clear tokens and optionally call logout API
   */
  logout: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

    // Try to call logout API
    if (refreshToken) {
      try {
        await fetch(`${API_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
          credentials: 'include',
        })
      } catch (error) {
        console.warn('Failed to log out cleanly', error)
      }
    }

    // Clear local storage
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY)
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY)
  },

  /**
   * Get current access token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY)
  },

  /**
   * Get refresh token
   * @returns {string|null}
   */
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  /**
   * Refresh the access token using refresh token
   * @returns {Promise<{accessToken: string, refreshToken: string|null}|null>}
   */
  refreshSession: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) return null

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'include',
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok || !payload?.data) {
        auth.logout()
        return null
      }

      const newAccessToken = payload.data.access_token
      const newRefreshToken = payload.data.refresh_token || null

      localStorage.setItem(TOKEN_KEY, newAccessToken)
      if (newRefreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
      }

      return { accessToken: newAccessToken, refreshToken: newRefreshToken }
    } catch (error) {
      console.error('Token refresh failed:', error)
      auth.logout()
      return null
    }
  },
}

export default auth

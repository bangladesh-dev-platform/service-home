import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { auth } from '../services/auth'
import { API_URL, TOKEN_KEY } from '../utils/constants'

const AuthContext = createContext(null)

/**
 * Decode JWT payload to get expiration time
 */
const decodeJwtPayload = (token) => {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const decoded = atob(padded)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Build avatar fallback URL
 */
const buildAvatarFallback = (displayName) => {
  const name = encodeURIComponent(displayName)
  return `https://ui-avatars.com/api/?name=${name}&background=16a34a&color=fff`
}

/**
 * Normalize user data from API response
 */
const normalizeUser = (payload) => {
  if (!payload) return null
  const displayName = payload.full_name || payload.first_name || payload.email || 'User'
  return {
    id: payload.id ?? '',
    name: displayName,
    email: payload.email ?? '',
    avatar: payload.avatar_url ?? buildAvatarFallback(displayName),
    roles: payload.roles ?? [],
    permissions: payload.permissions ?? [],
    emailVerified: payload.email_verified ?? false,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  })
  const [isLoading, setIsLoading] = useState(true)

  const refreshTimeoutRef = useRef(undefined)

  /**
   * Clear session and reset state
   */
  const clearSession = useCallback(() => {
    auth.logout()
    if (refreshTimeoutRef.current) {
      window.clearTimeout(refreshTimeoutRef.current)
      refreshTimeoutRef.current = undefined
    }
    setAccessToken(null)
    setUser(null)
  }, [])

  /**
   * Load user profile from API
   */
  const loadUserProfile = useCallback(async (tokenOverride) => {
    const token = tokenOverride ?? accessToken
    if (!token) throw new Error('Missing access token')

    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok || !payload?.data) {
      throw new Error(payload?.error?.message ?? 'Unable to load profile')
    }

    const normalizedUser = normalizeUser(payload.data)
    setUser(normalizedUser)
    return normalizedUser
  }, [accessToken])

  /**
   * Refresh session using refresh token
   */
  const refreshSession = useCallback(async () => {
    const result = await auth.refreshSession()
    if (!result) {
      clearSession()
      return null
    }

    setAccessToken(result.accessToken)
    await loadUserProfile(result.accessToken)
    return result
  }, [loadUserProfile, clearSession])

  /**
   * Setup auto-refresh timer based on token expiration
   */
  useEffect(() => {
    if (refreshTimeoutRef.current) {
      window.clearTimeout(refreshTimeoutRef.current)
      refreshTimeoutRef.current = undefined
    }

    if (!accessToken || !auth.getRefreshToken()) return

    const payload = decodeJwtPayload(accessToken)
    if (!payload?.exp) return

    const expiresAt = payload.exp * 1000
    const refreshDelay = Math.max(expiresAt - Date.now() - 60_000, 5_000)

    refreshTimeoutRef.current = window.setTimeout(() => {
      refreshSession().catch(() => clearSession())
    }, refreshDelay)

    return () => {
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current)
        refreshTimeoutRef.current = undefined
      }
    }
  }, [accessToken, refreshSession, clearSession])

  /**
   * Bootstrap: load user profile on mount if token exists
   */
  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      if (!accessToken) {
        if (isMounted) setIsLoading(false)
        return
      }

      try {
        await loadUserProfile(accessToken)
      } catch (error) {
        console.error('Initial profile load failed', error)
        if (auth.getRefreshToken()) {
          try {
            await refreshSession()
          } catch {
            clearSession()
          }
        } else {
          clearSession()
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    bootstrap()

    return () => { isMounted = false }
  }, []) // Only run once on mount

  /**
   * Login - redirect to auth service
   */
  const login = useCallback((redirectPath) => {
    auth.login(redirectPath)
  }, [])

  /**
   * Register - redirect to auth service
   */
  const register = useCallback((redirectPath) => {
    auth.register(redirectPath)
  }, [])

  /**
   * Complete login after callback
   */
  const completeLogin = useCallback(async ({ accessToken: token, refreshToken }) => {
    auth.completeLogin({ accessToken: token, refreshToken })
    setAccessToken(token)
    await loadUserProfile(token)
  }, [loadUserProfile])

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    await auth.logout()
    clearSession()
  }, [clearSession])

  const value = useMemo(() => ({
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshSession,
    completeLogin,
  }), [user, accessToken, isLoading, login, register, logout, refreshSession, completeLogin])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

/**
 * API service for communicating with service-api
 */
import { API_URL, TOKEN_KEY } from '../utils/constants'

/**
 * Base fetch wrapper with auth headers
 */
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  
  return response.json()
}

/**
 * API methods - will be expanded as service-api adds endpoints
 */
export const api = {
  // Health check
  health: () => fetchWithAuth('/health'),
  
  // Videos
  videos: {
    feed: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return fetchWithAuth(`/api/v1/video/feed${query ? `?${query}` : ''}`)
    },
    search: (q, params = {}) => {
      const query = new URLSearchParams({ q, ...params }).toString()
      return fetchWithAuth(`/api/v1/video/search?${query}`)
    },
    get: (id) => fetchWithAuth(`/api/v1/video/${id}`),
    bookmarks: () => fetchWithAuth('/api/v1/video/bookmarks'),
    history: () => fetchWithAuth('/api/v1/video/history'),
  },
  
  // User profile (requires auth)
  user: {
    me: () => fetchWithAuth('/api/v1/users/me'),
    update: (data) => fetchWithAuth('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },
  
  // Placeholder methods for future endpoints
  // These will return dummy data until API is ready
  
  news: {
    list: async (params = {}) => {
      // TODO: Replace with real API call
      console.log('[API] news.list called - using dummy data', params)
      return { success: true, data: [] }
    },
  },
  
  weather: {
    get: async (city) => {
      // TODO: Replace with real API call
      console.log('[API] weather.get called - using dummy data', city)
      return { success: true, data: null }
    },
  },
  
  jobs: {
    list: async (params = {}) => {
      // TODO: Replace with real API call
      console.log('[API] jobs.list called - using dummy data', params)
      return { success: true, data: [] }
    },
  },
  
  currency: {
    rates: async () => {
      // TODO: Replace with real API call
      console.log('[API] currency.rates called - using dummy data')
      return { success: true, data: [] }
    },
  },
  
  notices: {
    list: async (params = {}) => {
      // TODO: Replace with real API call
      console.log('[API] notices.list called - using dummy data', params)
      return { success: true, data: [] }
    },
  },
}

export default api

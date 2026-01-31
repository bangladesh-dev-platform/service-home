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
    throw new Error(error.error?.message || error.message || `HTTP ${response.status}`)
  }
  
  return response.json()
}

/**
 * Public fetch (no auth required)
 */
async function fetchPublic(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.error?.message || error.message || `HTTP ${response.status}`)
  }
  
  return response.json()
}

/**
 * API methods
 */
export const api = {
  // Health check
  health: () => fetchPublic('/health'),
  
  // ============ Portal Endpoints (Public) ============
  portal: {
    // Get all portal data in one request
    all: () => fetchPublic('/api/v1/portal/all'),

    // Weather
    weather: {
      // Get weather by lat/lon or district ID
      get: (params = {}) => {
        const query = new URLSearchParams()
        if (params.lat) query.set('lat', params.lat)
        if (params.lon) query.set('lon', params.lon)
        if (params.district) query.set('district', params.district)
        const qs = query.toString()
        return fetchPublic(`/api/v1/portal/weather${qs ? `?${qs}` : ''}`)
      },
      // Get 9 locations for dropdown (8 divisions + Cumilla)
      locations: () => fetchPublic('/api/v1/portal/weather/locations'),
      // Get weather for all 9 locations at once
      divisions: () => fetchPublic('/api/v1/portal/weather/divisions'),
      // Get weather for all 64 districts (for weather page)
      bulk: (division = null) => {
        const qs = division ? `?division=${division}` : ''
        return fetchPublic(`/api/v1/portal/weather/bulk${qs}`)
      },
    },

    // Currency exchange rates
    currency: () => fetchPublic('/api/v1/portal/currency'),

    // News
    news: (params = {}) => {
      const query = new URLSearchParams()
      if (params.category) query.set('category', params.category)
      if (params.source) query.set('source', params.source)
      if (params.limit) query.set('limit', params.limit)
      const qs = query.toString()
      return fetchPublic(`/api/v1/portal/news${qs ? `?${qs}` : ''}`)
    },

    // Radio stations
    radio: () => fetchPublic('/api/v1/portal/radio'),

    // Jobs
    jobs: (params = {}) => {
      const query = new URLSearchParams()
      if (params.type) query.set('type', params.type)
      if (params.limit) query.set('limit', params.limit)
      const qs = query.toString()
      return fetchPublic(`/api/v1/portal/jobs${qs ? `?${qs}` : ''}`)
    },

    // Government notices
    notices: (params = {}) => {
      const query = new URLSearchParams()
      if (params.category) query.set('category', params.category)
      if (params.limit) query.set('limit', params.limit)
      const qs = query.toString()
      return fetchPublic(`/api/v1/portal/notices${qs ? `?${qs}` : ''}`)
    },

    // Education
    education: (params = {}) => {
      const query = new URLSearchParams()
      if (params.type) query.set('type', params.type)
      if (params.limit) query.set('limit', params.limit)
      const qs = query.toString()
      return fetchPublic(`/api/v1/portal/education${qs ? `?${qs}` : ''}`)
    },

    // Market deals
    market: (params = {}) => {
      const query = new URLSearchParams()
      if (params.category) query.set('category', params.category)
      if (params.limit) query.set('limit', params.limit)
      const qs = query.toString()
      return fetchPublic(`/api/v1/portal/market${qs ? `?${qs}` : ''}`)
    },

    // Districts
    districts: (flat = false) => {
      return fetchPublic(`/api/v1/portal/districts${flat ? '?flat=true' : ''}`)
    },

    // Prayer times
    prayer: (city = 'Dhaka') => {
      return fetchPublic(`/api/v1/portal/prayer?city=${encodeURIComponent(city)}`)
    },

    // Cricket scores
    cricket: () => fetchPublic('/api/v1/portal/cricket'),

    // Commodity prices (gold, fuel)
    commodities: () => fetchPublic('/api/v1/portal/commodities'),

    // Emergency numbers
    emergency: () => fetchPublic('/api/v1/portal/emergency'),

    // Public holidays
    holidays: (year = null) => {
      const qs = year ? `?year=${year}` : ''
      return fetchPublic(`/api/v1/portal/holidays${qs}`)
    },

    // Search across all content
    search: (query, type = 'all', limit = 20) => {
      const params = new URLSearchParams({ q: query, type, limit })
      return fetchPublic(`/api/v1/portal/search?${params}`)
    },

    // AI Assistant
    ai: {
      chat: (message) => fetchPublic('/api/v1/portal/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
      rateLimit: () => fetchPublic('/api/v1/portal/ai/limit'),
    },
  },

  // ============ Video Endpoints ============
  videos: {
    feed: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return fetchPublic(`/api/v1/video/feed${query ? `?${query}` : ''}`)
    },
    search: (q, params = {}) => {
      const query = new URLSearchParams({ q, ...params }).toString()
      return fetchPublic(`/api/v1/video/search?${query}`)
    },
    get: (id) => fetchPublic(`/api/v1/video/${id}`),
    // Auth required
    bookmarks: () => fetchWithAuth('/api/v1/video/bookmarks'),
    addBookmark: (videoId) => fetchWithAuth('/api/v1/video/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ video_id: videoId }),
    }),
    removeBookmark: (videoId) => fetchWithAuth(`/api/v1/video/bookmarks/${videoId}`, {
      method: 'DELETE',
    }),
    history: () => fetchWithAuth('/api/v1/video/history'),
    recordHistory: (videoId, progress) => fetchWithAuth('/api/v1/video/history', {
      method: 'POST',
      body: JSON.stringify({ video_id: videoId, progress }),
    }),
  },
  
  // ============ User Endpoints (Auth Required) ============
  user: {
    me: () => fetchWithAuth('/api/v1/users/me'),
    update: (data) => fetchWithAuth('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },
}

export default api

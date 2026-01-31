import { useState, useEffect, useCallback } from 'react'

/**
 * Hook to get user's geolocation
 * Returns: { location, error, loading, requestLocation, permissionState }
 */
export function useGeolocation(options = {}) {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [permissionState, setPermissionState] = useState('prompt') // 'granted' | 'denied' | 'prompt'

  const {
    enableHighAccuracy = false,
    timeout = 10000,
    maximumAge = 5 * 60 * 1000, // 5 minutes cache
  } = options

  // Check permission state on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionState(result.state)
        
        // Listen for permission changes
        result.onchange = () => {
          setPermissionState(result.state)
        }
      }).catch(() => {
        // Permissions API not supported
      })
    }
  }, [])

  // Try to get cached location from localStorage
  useEffect(() => {
    const cached = localStorage.getItem('bdp_user_location')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        const age = Date.now() - parsed.timestamp
        if (age < maximumAge) {
          setLocation(parsed)
        }
      } catch {
        // Invalid cache
      }
    }
  }, [maximumAge])

  /**
   * Request user's location
   */
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        }
        
        setLocation(loc)
        setLoading(false)
        setPermissionState('granted')
        
        // Cache in localStorage
        localStorage.setItem('bdp_user_location', JSON.stringify(loc))
      },
      (err) => {
        setLoading(false)
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied')
            setPermissionState('denied')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable')
            break
          case err.TIMEOUT:
            setError('Location request timed out')
            break
          default:
            setError('An unknown error occurred')
        }
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    )
  }, [enableHighAccuracy, timeout, maximumAge])

  /**
   * Clear cached location
   */
  const clearLocation = useCallback(() => {
    setLocation(null)
    localStorage.removeItem('bdp_user_location')
  }, [])

  return {
    location,
    error,
    loading,
    requestLocation,
    clearLocation,
    permissionState,
    isSupported: !!navigator.geolocation,
  }
}

export default useGeolocation

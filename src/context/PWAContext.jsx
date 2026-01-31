import { createContext, useContext, useState, useEffect } from 'react'

const PWAContext = createContext()

export function PWAProvider({ children }) {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [needsUpdate, setNeedsUpdate] = useState(false)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Register service worker and handle updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Import the virtual module from vite-plugin-pwa
      import('virtual:pwa-register').then(({ registerSW }) => {
        const updateSW = registerSW({
          onNeedRefresh() {
            setNeedsUpdate(true)
          },
          onOfflineReady() {
            console.log('App ready for offline use')
          },
          onRegistered(r) {
            setRegistration(r)
            console.log('Service worker registered')
          },
          onRegisterError(error) {
            console.error('Service worker registration error:', error)
          }
        })

        // Store update function for later use
        window.__updateSW = updateSW
      }).catch(err => {
        // PWA registration not available in development without build
        console.log('PWA registration skipped:', err.message)
      })
    }
  }, [])

  const promptInstall = async () => {
    if (!installPrompt) return false

    try {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        setInstallPrompt(null)
        return true
      }
      return false
    } catch (err) {
      console.error('Install prompt error:', err)
      return false
    }
  }

  const updateApp = () => {
    if (window.__updateSW) {
      window.__updateSW(true)
    }
  }

  const dismissUpdate = () => {
    setNeedsUpdate(false)
  }

  const value = {
    // Install state
    canInstall: !!installPrompt,
    isInstalled,
    promptInstall,
    
    // Online state
    isOnline,
    
    // Update state
    needsUpdate,
    updateApp,
    dismissUpdate,
    
    // Service worker
    registration
  }

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  )
}

export function usePWA() {
  const context = useContext(PWAContext)
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider')
  }
  return context
}

export default PWAContext

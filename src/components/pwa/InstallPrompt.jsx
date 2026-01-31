import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { usePWA } from '../../context/PWAContext'
import { useLanguage } from '../../context/LanguageContext'

function InstallPrompt() {
  const { canInstall, isInstalled, promptInstall } = usePWA()
  const { isBangla } = useLanguage()
  const [dismissed, setDismissed] = useState(false)
  const [installing, setInstalling] = useState(false)

  // Check if user previously dismissed the prompt
  useEffect(() => {
    const wasDismissed = localStorage.getItem('pwa-install-dismissed')
    if (wasDismissed) {
      const dismissedAt = new Date(wasDismissed)
      const now = new Date()
      // Show again after 7 days
      if (now - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true)
      }
    }
  }, [])

  const handleInstall = async () => {
    setInstalling(true)
    const success = await promptInstall()
    setInstalling(false)
    if (success) {
      setDismissed(true)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
  }

  // Don't show if already installed, dismissed, or can't install
  if (isInstalled || dismissed || !canInstall) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Smartphone className="h-6 w-6 text-green-700" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 pr-6">
            {isBangla ? 'অ্যাপ ইনস্টল করুন' : 'Install App'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isBangla 
              ? 'দ্রুত অ্যাক্সেস এবং অফলাইন ব্যবহারের জন্য ইনস্টল করুন'
              : 'Install for quick access and offline use'
            }
          </p>
          
          <button
            onClick={handleInstall}
            disabled={installing}
            className="mt-3 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {installing ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isBangla ? 'ইনস্টল করুন' : 'Install'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt

import { RefreshCw, X } from 'lucide-react'
import { usePWA } from '../../context/PWAContext'
import { useLanguage } from '../../context/LanguageContext'

function UpdatePrompt() {
  const { needsUpdate, updateApp, dismissUpdate } = usePWA()
  const { isBangla } = useLanguage()

  if (!needsUpdate) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 text-white rounded-lg shadow-xl p-4 z-50 animate-slide-up">
      <button
        onClick={dismissUpdate}
        className="absolute top-2 right-2 text-blue-200 hover:text-white"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <RefreshCw className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold pr-6">
            {isBangla ? 'আপডেট উপলব্ধ' : 'Update Available'}
          </h3>
          <p className="text-sm text-blue-100 mt-1">
            {isBangla 
              ? 'নতুন সংস্করণ উপলব্ধ। রিফ্রেশ করুন।'
              : 'A new version is available. Refresh to update.'
            }
          </p>
          
          <button
            onClick={updateApp}
            className="mt-3 bg-white text-blue-600 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            {isBangla ? 'রিফ্রেশ করুন' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdatePrompt

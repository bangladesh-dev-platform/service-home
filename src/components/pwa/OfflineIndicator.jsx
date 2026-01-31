import { WifiOff } from 'lucide-react'
import { usePWA } from '../../context/PWAContext'
import { useLanguage } from '../../context/LanguageContext'

function OfflineIndicator() {
  const { isOnline } = usePWA()
  const { isBangla } = useLanguage()

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white py-2 px-4 text-center text-sm font-medium z-50 flex items-center justify-center gap-2">
      <WifiOff className="h-4 w-4" />
      {isBangla 
        ? 'আপনি অফলাইনে আছেন। কিছু বৈশিষ্ট্য সীমিত হতে পারে।'
        : "You're offline. Some features may be limited."
      }
    </div>
  )
}

export default OfflineIndicator

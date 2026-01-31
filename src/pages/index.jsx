import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

export { default as HomePage } from './HomePage'
export { default as AuthCallbackPage } from './AuthCallbackPage'
export { default as WeatherPage } from './WeatherPage'
export { default as NewsPage } from './NewsPage'
export { default as EducationPage } from './EducationPage'
export { default as JobsPage } from './JobsPage'

export function NotFoundPage() {
  const { t } = useTranslation()
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      {/* Icon */}
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      
      {/* 404 Text */}
      <h1 className="text-7xl font-bold bg-gradient-to-r from-green-600 to-red-500 bg-clip-text text-transparent mb-4">
        404
      </h1>
      
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {t('errors.notFound')}
      </h2>
      
      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-8">
        {t('errors.notFoundDesc')}
      </p>
      
      {/* Back Home Button */}
      <Link
        to="/"
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
      >
        <Home className="w-5 h-5" />
        <span>{t('errors.backHome')}</span>
      </Link>
    </div>
  )
}

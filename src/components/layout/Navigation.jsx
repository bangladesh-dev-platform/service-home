import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../../utils/constants'

function Navigation() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6 py-3 overflow-x-auto text-sm">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-green-700 bg-green-50 font-medium'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation

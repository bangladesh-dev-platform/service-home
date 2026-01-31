import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Bell, Search, Settings, UserRound, Globe, LogOut, ChevronDown, User, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { Logo } from '../common'

function UserDropdown({ user, onLogout, t }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-green-700 hover:text-green-800 transition-colors px-2 py-1 rounded-md hover:bg-green-50"
      >
        {/* Avatar */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-green-200"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16a34a&color=fff`
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
            <UserRound className="h-5 w-5 text-white" />
          </div>
        )}
        <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
          {user.name}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="font-medium text-gray-800 truncate">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              <User className="h-4 w-4 mr-3" />
              {t('common.profile')}
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              <Settings className="h-4 w-4 mr-3" />
              {t('common.settings')}
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={() => {
                setIsOpen(false)
                onLogout()
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-3" />
              {t('common.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Header() {
  const { t } = useTranslation()
  const { isAuthenticated, user, login, logout, isLoading } = useAuth()
  const { currentLang, toggleLanguage, languages, isBangla } = useLanguage()

  return (
    <header className="bg-white shadow-sm border-b border-green-100">
      {/* Optional: Beta banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-1 text-xs font-medium">
        <span className="inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {isBangla ? 'বেটা সংস্করণ - আপনার মতামত জানান!' : 'Beta Version - Share your feedback!'}
          <Sparkles className="w-3 h-3" />
        </span>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="md" />

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                className="w-full pl-4 pr-12 py-2 border-2 border-green-200 rounded-full focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none text-sm"
                placeholder={t('common.searchPlaceholder')}
              />
              <button className="absolute right-1 top-1 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 h-8 flex items-center justify-center transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-green-700 hover:text-green-800 transition-colors px-2 py-1 rounded-md hover:bg-green-50"
              title={languages[currentLang === 'bn' ? 'en' : 'bn'].name}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">
                {currentLang === 'bn' ? 'EN' : 'বাং'}
              </span>
            </button>

            {/* Notifications - only show when authenticated */}
            {isAuthenticated && (
              <button 
                className="text-green-700 hover:text-green-800 transition-colors p-2 rounded-md hover:bg-green-50 relative"
                title={t('common.notifications')}
              >
                <Bell className="h-5 w-5" />
                {/* Notification badge - can be dynamic later */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* User Menu / Login Button */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isAuthenticated && user ? (
              <UserDropdown user={user} onLogout={logout} t={t} />
            ) : (
              <button
                onClick={() => login()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                {t('common.login')}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              className="w-full pl-4 pr-12 py-2 border-2 border-green-200 rounded-full focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none text-sm"
              placeholder={t('common.searchPlaceholder')}
            />
            <button className="absolute right-1 top-1 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 h-8 flex items-center justify-center transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

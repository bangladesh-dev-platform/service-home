import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Newspaper, Clock, ExternalLink, Loader2 } from 'lucide-react'
import { SectionCard, TabGroup } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

function NewsSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [activeTab, setActiveTab] = useState('all')
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const tabs = [
    { key: 'all', label: isBangla ? 'সর্বশেষ' : 'Latest' },
    { key: 'national', label: isBangla ? 'জাতীয়' : 'National' },
    { key: 'sports', label: isBangla ? 'খেলা' : 'Sports' },
    { key: 'business', label: isBangla ? 'ব্যবসা' : 'Business' },
  ]

  const fetchNews = async (category) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.portal.news({ 
        category: category === 'all' ? null : category,
        limit: 5 
      })
      if (response.success) {
        setNews(response.data.items || [])
      } else {
        throw new Error('Failed to fetch news')
      }
    } catch (err) {
      setError(err.message)
      console.error('News fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews(activeTab)
  }, [activeTab])

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      const diffMins = Math.floor((now - date) / (1000 * 60))
      return isBangla ? `${diffMins} মিনিট আগে` : `${diffMins} mins ago`
    }
    if (diffHours < 24) {
      return isBangla ? `${diffHours} ঘন্টা আগে` : `${diffHours} hours ago`
    }
    return date.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US')
  }

  return (
    <SectionCard
      title={t('sections.news')}
      icon={Newspaper}
      iconColor="text-red-600"
      colSpan={2}
      headerRight={
        <Link 
          to="/news" 
          className="text-sm text-gray-500 hover:text-red-600"
          title={isBangla ? 'সব সংবাদ' : 'All news'}
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      }
    >
      {/* Tabs */}
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-red-500" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* News List */}
      {!loading && !error && (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {news.map((item) => (
            <a 
              key={item.id} 
              href={item.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-b border-gray-100 pb-3 last:border-b-0 hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
            >
              <div className="flex gap-3">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt="" 
                    className="w-16 h-12 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 hover:text-red-600 line-clamp-2">
                    {isBangla ? item.title : item.title_en || item.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                    <span>{isBangla ? item.source : item.source_en || item.source}</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(item.published_at)}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* More Button */}
      <div className="mt-4 pt-3 border-t">
        <Link 
          to="/news" 
          className="block w-full text-center text-red-600 border border-red-200 rounded-md py-2 hover:bg-red-50 text-sm font-medium"
        >
          {t('news.moreNews')}
        </Link>
      </div>
    </SectionCard>
  )
}

export default NewsSection

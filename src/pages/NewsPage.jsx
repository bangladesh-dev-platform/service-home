import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  Newspaper, Clock, ExternalLink, Loader2, RefreshCw, 
  Filter, ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'

// Category configuration with translations
const CATEGORIES = [
  { key: 'all', label: 'All', label_bn: 'সব' },
  { key: 'national', label: 'National', label_bn: 'জাতীয়' },
  { key: 'international', label: 'International', label_bn: 'আন্তর্জাতিক' },
  { key: 'sports', label: 'Sports', label_bn: 'খেলা' },
  { key: 'business', label: 'Business', label_bn: 'ব্যবসা' },
  { key: 'technology', label: 'Technology', label_bn: 'প্রযুক্তি' },
  { key: 'entertainment', label: 'Entertainment', label_bn: 'বিনোদন' },
]

// Items per page
const PAGE_SIZE = 20

function NewsPage() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State
  const [news, setNews] = useState([])
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  
  // Get filter values from URL
  const activeSource = searchParams.get('source') || 'all'
  const activeCategory = searchParams.get('category') || 'all'

  // Fetch news
  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.portal.news({
        source: activeSource === 'all' ? null : activeSource,
        category: activeCategory === 'all' ? null : activeCategory,
        limit: 100, // Fetch more for client-side pagination
      })
      
      if (response.success) {
        const items = response.data.items || []
        setNews(items)
        setTotalItems(items.length)
        setSources(response.data.sources || [])
        setIsLive(response.data.is_live)
        setUpdatedAt(response.data.updated_at)
        setPage(1) // Reset to first page on filter change
      } else {
        throw new Error('Failed to fetch news')
      }
    } catch (err) {
      setError(err.message)
      console.error('News fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [activeSource, activeCategory])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  // Update URL params
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === 'all') {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
    setSearchParams(newParams)
  }

  // Pagination
  const totalPages = Math.ceil(totalItems / PAGE_SIZE)
  const paginatedNews = news.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Format time helper
  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffMins < 0) {
      // Handle future dates (shouldn't happen after timezone fix)
      return isBangla ? 'এইমাত্র' : 'Just now'
    }
    if (diffMins < 1) {
      return isBangla ? 'এইমাত্র' : 'Just now'
    }
    if (diffMins < 60) {
      return isBangla ? `${diffMins} মিনিট আগে` : `${diffMins} min ago`
    }
    if (diffHours < 24) {
      return isBangla ? `${diffHours} ঘন্টা আগে` : `${diffHours} hr ago`
    }
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) {
      return isBangla ? 'গতকাল' : 'Yesterday'
    }
    if (diffDays < 7) {
      return isBangla ? `${diffDays} দিন আগে` : `${diffDays} days ago`
    }
    
    return date.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
      day: 'numeric',
      month: 'short',
    })
  }

  // Format update time
  const formatUpdateTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleTimeString(isBangla ? 'bn-BD' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isBangla ? 'সংবাদ' : 'News'}
            </h1>
            <p className="text-sm text-gray-500">
              {isBangla 
                ? 'বাংলাদেশের সর্বশেষ সংবাদ' 
                : 'Latest news from Bangladesh'}
            </p>
          </div>
        </div>
        
        {/* Status & Refresh */}
        <div className="flex items-center gap-3">
          {isLive && (
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          )}
          {updatedAt && (
            <span className="text-xs text-gray-500 hidden sm:inline">
              {isBangla ? 'হালনাগাদ: ' : 'Updated: '}
              {formatUpdateTime(updatedAt)}
            </span>
          )}
          <button
            onClick={fetchNews}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title={isBangla ? 'রিফ্রেশ' : 'Refresh'}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>{isBangla ? 'ফিল্টার' : 'Filters'}</span>
        </div>

        {/* Source Filter */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-2">
            {isBangla ? 'উৎস' : 'Source'}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter('source', 'all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeSource === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isBangla ? 'সব' : 'All'}
            </button>
            {sources.map((source) => (
              <button
                key={source.key}
                onClick={() => updateFilter('source', source.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeSource === source.key
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {source.logo && (
                  <img 
                    src={source.logo} 
                    alt="" 
                    className="w-4 h-4 rounded object-contain"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                {isBangla ? source.name_bn : source.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">
            {isBangla ? 'বিভাগ' : 'Category'}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => updateFilter('category', cat.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isBangla ? cat.label_bn : cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      {!loading && !error && (
        <div className="text-sm text-gray-500 mb-4">
          {isBangla 
            ? `${totalItems} টি সংবাদ পাওয়া গেছে`
            : `${totalItems} news articles found`}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <span className="text-gray-500">
              {isBangla ? 'সংবাদ লোড হচ্ছে...' : 'Loading news...'}
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium mb-2">
            {isBangla ? 'সংবাদ লোড করতে সমস্যা হয়েছে' : 'Failed to load news'}
          </p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {isBangla ? 'আবার চেষ্টা করুন' : 'Try Again'}
          </button>
        </div>
      )}

      {/* News Grid */}
      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedNews.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-red-200 transition-all group"
              >
                {/* Image */}
                {item.image && (
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.parentElement.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-4">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {CATEGORIES.find(c => c.key === item.category)?.[isBangla ? 'label_bn' : 'label'] || item.category}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Summary */}
                  {item.summary && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {item.summary}
                    </p>
                  )}
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      {item.source_logo && (
                        <img 
                          src={item.source_logo} 
                          alt="" 
                          className="w-4 h-4 rounded object-contain"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <span>{isBangla ? item.source : item.source_en || item.source}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(item.published_at)}
                    </span>
                  </div>
                </div>
                
                {/* External Link Indicator */}
                <div className="px-4 pb-3 pt-0">
                  <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-red-500 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span>{isBangla ? 'পড়ুন' : 'Read more'}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Empty State */}
          {paginatedNews.length === 0 && (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {isBangla ? 'কোনো সংবাদ পাওয়া যায়নি' : 'No news found'}
              </h3>
              <p className="text-gray-500 text-sm">
                {isBangla 
                  ? 'অনুগ্রহ করে অন্য ফিল্টার চেষ্টা করুন'
                  : 'Try adjusting your filters'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2))
                  .map((p, idx, arr) => (
                    <span key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          page === p
                            ? 'bg-red-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
              </div>
              
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link 
          to="/" 
          className="text-gray-500 hover:text-red-600 text-sm"
        >
          {isBangla ? '← হোম পেজে ফিরে যান' : '← Back to Home'}
        </Link>
      </div>
    </div>
  )
}

export default NewsPage

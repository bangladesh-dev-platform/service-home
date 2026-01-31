import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
  Search, Globe, BookOpen, Video, Newspaper, Briefcase, GraduationCap,
  Loader2, ExternalLink, Clock, X, TrendingUp
} from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

// Search types
const SEARCH_TYPES = [
  { key: 'all', label: 'All', label_bn: 'সব', icon: Search },
  { key: 'news', label: 'News', label_bn: 'সংবাদ', icon: Newspaper },
  { key: 'jobs', label: 'Jobs', label_bn: 'চাকরি', icon: Briefcase },
  { key: 'education', label: 'Education', label_bn: 'শিক্ষা', icon: GraduationCap },
]

// Quick searches
const QUICK_SEARCHES = {
  bn: ['আবহাওয়া', 'সরকারি চাকরি', 'বৃত্তি', 'ক্রিকেট', 'পরীক্ষার ফলাফল'],
  en: ['Weather', 'Government Jobs', 'Scholarship', 'Cricket', 'Exam Results'],
}

// Type icons for results
const TYPE_ICONS = {
  news: Newspaper,
  jobs: Briefcase,
  education: GraduationCap,
}

const TYPE_COLORS = {
  news: 'bg-red-100 text-red-600',
  jobs: 'bg-indigo-100 text-indigo-600',
  education: 'bg-purple-100 text-purple-600',
}

function SearchSection() {
  const { t, i18n } = useTranslation()
  const { isBangla } = useLanguage()
  const [activeType, setActiveType] = useState('all')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const searchRef = useRef(null)
  const debounceRef = useRef(null)

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    
    if (query.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await api.portal.search(query, activeType, 10)
        if (response.success) {
          setResults(response.data.items || [])
          setTotalResults(response.data.total || 0)
          setShowResults(true)
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, activeType])

  const handleSearch = (e) => {
    e.preventDefault()
    // Trigger search immediately
    if (query.length >= 2) {
      setShowResults(true)
    }
  }

  const handleQuickSearch = (term) => {
    setQuery(term)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  const getResultUrl = (item) => {
    if (item.url && item.url.startsWith('http')) {
      return item.url
    }
    switch (item.type) {
      case 'jobs': return '/jobs'
      case 'education': return '/education'
      case 'news': return '/news'
      default: return item.url || '#'
    }
  }

  return (
    <SectionCard
      title={t('sections.search')}
      icon={Search}
      iconColor="text-blue-600"
      colSpan={2}
    >
      {/* Search Type Tabs */}
      <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {SEARCH_TYPES.map(({ key, label, label_bn, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveType(key)}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeType === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{isBangla ? label_bn : label}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div ref={searchRef} className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowResults(true)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              placeholder={isBangla ? 'সংবাদ, চাকরি, শিক্ষা খুঁজুন...' : 'Search news, jobs, education...'}
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || query.length < 2}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </button>
        </form>

        {/* Search Results Dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            <div className="p-2 border-b bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
              <span>
                {isBangla ? `${totalResults}টি ফলাফল` : `${totalResults} results`}
              </span>
              <span className="text-blue-600">{activeType === 'all' ? '' : activeType}</span>
            </div>
            
            {results.map((item, idx) => {
              const Icon = TYPE_ICONS[item.type] || Search
              const colorClass = TYPE_COLORS[item.type] || 'bg-gray-100 text-gray-600'
              const isExternal = item.url?.startsWith('http')
              
              return (
                <a
                  key={idx}
                  href={getResultUrl(item)}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : ''}
                  onClick={() => setShowResults(false)}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className={`p-1.5 rounded ${colorClass}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 line-clamp-1">
                      {isBangla ? item.title : item.title_en || item.title}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span className="capitalize">{item.type}</span>
                      {item.source && <span>• {item.source}</span>}
                    </div>
                  </div>
                  {isExternal && (
                    <ExternalLink className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  )}
                </a>
              )
            })}
          </div>
        )}

        {/* No Results */}
        {showResults && query.length >= 2 && results.length === 0 && !loading && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
            {isBangla ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}
          </div>
        )}
      </div>

      {/* Quick Searches */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
          <TrendingUp className="h-3 w-3" />
          <span>{isBangla ? 'জনপ্রিয়' : 'Popular'}:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_SEARCHES[i18n.language]?.map((term) => (
            <button
              key={term}
              onClick={() => handleQuickSearch(term)}
              className="px-3 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full text-xs text-gray-700 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* External Search Links */}
      <div className="mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(query || 'Bangladesh')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          {isBangla ? 'গুগলে খুঁজুন' : 'Search Google'}
        </a>
        <a
          href={`https://bn.wikipedia.org/wiki/${encodeURIComponent(query || 'বাংলাদেশ')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" />
          {isBangla ? 'উইকিপিডিয়া' : 'Wikipedia'}
        </a>
      </div>
    </SectionCard>
  )
}

export default SearchSection

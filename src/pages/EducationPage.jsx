import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  BookOpen, GraduationCap, FileText, Award, Trophy,
  Loader2, RefreshCw, ExternalLink, AlertCircle, Search,
  Calendar, ArrowRight, Bookmark, Clock
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'

// Type configuration with icons, colors, and labels
const TYPE_CONFIG = {
  all: { 
    icon: BookOpen, 
    color: 'bg-purple-600 text-white',
    bgLight: 'bg-purple-100 text-purple-600',
    label: 'All',
    label_bn: 'সব'
  },
  tips: { 
    icon: GraduationCap, 
    color: 'bg-blue-600 text-white',
    bgLight: 'bg-blue-100 text-blue-600',
    label: 'Study Tips',
    label_bn: 'পড়াশোনার টিপস'
  },
  resources: { 
    icon: FileText, 
    color: 'bg-green-600 text-white',
    bgLight: 'bg-green-100 text-green-600',
    label: 'Resources',
    label_bn: 'উপকরণ'
  },
  scholarships: { 
    icon: Award, 
    color: 'bg-yellow-600 text-white',
    bgLight: 'bg-yellow-100 text-yellow-600',
    label: 'Scholarships',
    label_bn: 'বৃত্তি'
  },
  results: { 
    icon: Trophy, 
    color: 'bg-red-600 text-white',
    bgLight: 'bg-red-100 text-red-600',
    label: 'Results',
    label_bn: 'ফলাফল'
  },
}

// Quick links for education resources
const QUICK_LINKS = [
  {
    title: 'Education Board Results',
    title_bn: 'শিক্ষা বোর্ড ফলাফল',
    url: 'http://www.educationboardresults.gov.bd/',
    icon: Trophy,
    color: 'bg-red-500',
  },
  {
    title: 'NCTB eBooks',
    title_bn: 'এনসিটিবি ই-বুক',
    url: 'https://www.nctb.gov.bd/',
    icon: BookOpen,
    color: 'bg-green-500',
  },
  {
    title: 'University Admission',
    title_bn: 'বিশ্ববিদ্যালয় ভর্তি',
    url: 'https://admission.eis.gov.bd/',
    icon: GraduationCap,
    color: 'bg-blue-500',
  },
  {
    title: 'Scholarship Portal',
    title_bn: 'বৃত্তি পোর্টাল',
    url: 'https://www.shed.gov.bd/',
    icon: Award,
    color: 'bg-yellow-500',
  },
]

function EducationPage() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Get filter from URL
  const activeType = searchParams.get('type') || 'all'

  // Fetch education data
  const fetchEducation = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.portal.education({
        type: activeType === 'all' ? null : activeType,
        limit: 50,
      })
      
      if (response.success) {
        setItems(response.data.items || [])
        setUpdatedAt(response.data.updated_at)
      } else {
        throw new Error('Failed to fetch education data')
      }
    } catch (err) {
      setError(err.message)
      console.error('Education fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [activeType])

  useEffect(() => {
    fetchEducation()
  }, [fetchEducation])

  // Update URL params
  const updateFilter = (type) => {
    const newParams = new URLSearchParams(searchParams)
    if (type === 'all') {
      newParams.delete('type')
    } else {
      newParams.set('type', type)
    }
    setSearchParams(newParams)
  }

  // Filter items by search query
  const filteredItems = items.filter(item => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const title = (isBangla ? item.title : item.title_en || item.title).toLowerCase()
    const desc = (isBangla ? item.description : item.description_en || item.description).toLowerCase()
    return title.includes(query) || desc.includes(query)
  })

  // Group items by type for display
  const groupedItems = filteredItems.reduce((acc, item) => {
    const type = item.type || 'tips'
    if (!acc[type]) acc[type] = []
    acc[type].push(item)
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isBangla ? 'শিক্ষা' : 'Education'}
            </h1>
            <p className="text-sm text-gray-500">
              {isBangla 
                ? 'শিক্ষা সংক্রান্ত তথ্য ও সম্পদ' 
                : 'Educational information and resources'}
            </p>
          </div>
        </div>
        
        {/* Refresh */}
        <button
          onClick={fetchEducation}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
          title={isBangla ? 'রিফ্রেশ' : 'Refresh'}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          {isBangla ? 'দ্রুত লিঙ্ক' : 'Quick Links'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_LINKS.map((link, idx) => {
            const Icon = link.icon
            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className={`w-8 h-8 ${link.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-800 group-hover:text-purple-600 line-clamp-1">
                    {isBangla ? link.title_bn : link.title}
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-purple-500 flex-shrink-0" />
              </a>
            )
          })}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBangla ? 'অনুসন্ধান করুন...' : 'Search...'}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Type Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_CONFIG).map(([key, config]) => {
            const Icon = config.icon
            const isActive = activeType === key
            return (
              <button
                key={key}
                onClick={() => updateFilter(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive 
                    ? config.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {isBangla ? config.label_bn : config.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="text-gray-500">
              {isBangla ? 'লোড হচ্ছে...' : 'Loading...'}
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium mb-2">
            {isBangla ? 'তথ্য লোড করতে সমস্যা হয়েছে' : 'Failed to load data'}
          </p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchEducation}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {isBangla ? 'আবার চেষ্টা করুন' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Results count */}
          <div className="text-sm text-gray-500 mb-4">
            {isBangla 
              ? `${filteredItems.length} টি আইটেম পাওয়া গেছে`
              : `${filteredItems.length} items found`}
          </div>

          {/* Show by type when "all" is selected */}
          {activeType === 'all' ? (
            <div className="space-y-8">
              {Object.entries(TYPE_CONFIG).filter(([k]) => k !== 'all').map(([type, config]) => {
                const typeItems = groupedItems[type] || []
                if (typeItems.length === 0) return null
                
                const Icon = config.icon
                return (
                  <div key={type}>
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bgLight}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {isBangla ? config.label_bn : config.label}
                        </h2>
                        <span className="text-sm text-gray-500">({typeItems.length})</span>
                      </div>
                      <button
                        onClick={() => updateFilter(type)}
                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        {isBangla ? 'সব দেখুন' : 'View all'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Items Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {typeItems.slice(0, 3).map((item) => (
                        <EducationCard 
                          key={item.id} 
                          item={item} 
                          config={config}
                          isBangla={isBangla}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Show filtered items */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.tips
                return (
                  <EducationCard 
                    key={item.id} 
                    item={item} 
                    config={config}
                    isBangla={isBangla}
                  />
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {isBangla ? 'কোনো আইটেম পাওয়া যায়নি' : 'No items found'}
              </h3>
              <p className="text-gray-500 text-sm">
                {isBangla 
                  ? 'অনুগ্রহ করে অন্য ফিল্টার চেষ্টা করুন'
                  : 'Try adjusting your filters or search'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link 
          to="/" 
          className="text-gray-500 hover:text-purple-600 text-sm"
        >
          {isBangla ? '← হোম পেজে ফিরে যান' : '← Back to Home'}
        </Link>
      </div>
    </div>
  )
}

// Education Card Component
function EducationCard({ item, config, isBangla }) {
  const Icon = config.icon
  
  return (
    <a
      href={item.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-purple-200 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgLight}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgLight}`}>
            {isBangla ? config.label_bn : config.label}
          </span>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
        {isBangla ? item.title : item.title_en || item.title}
      </h3>
      
      {/* Description */}
      {(item.description || item.description_en) && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {isBangla ? item.description : item.description_en || item.description}
        </p>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {isBangla ? 'সাম্প্রতিক' : 'Recent'}
        </span>
        <span className="flex items-center gap-1 text-purple-500 group-hover:text-purple-600">
          <ExternalLink className="w-3 h-3" />
          {isBangla ? 'বিস্তারিত' : 'Details'}
        </span>
      </div>
    </a>
  )
}

export default EducationPage

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  Briefcase, MapPin, DollarSign, Clock, Users,
  Loader2, RefreshCw, ExternalLink, AlertCircle, Search,
  Building2, Landmark, Heart, Filter, Calendar
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'

// Job type configuration
const TYPE_CONFIG = {
  all: { 
    icon: Briefcase, 
    color: 'bg-indigo-600 text-white',
    bgLight: 'bg-indigo-100 text-indigo-600',
    label: 'All Jobs',
    label_bn: 'সব চাকরি'
  },
  government: { 
    icon: Landmark, 
    color: 'bg-blue-600 text-white',
    bgLight: 'bg-blue-100 text-blue-700',
    label: 'Government',
    label_bn: 'সরকারি'
  },
  private: { 
    icon: Building2, 
    color: 'bg-green-600 text-white',
    bgLight: 'bg-green-100 text-green-700',
    label: 'Private',
    label_bn: 'বেসরকারি'
  },
  ngo: { 
    icon: Heart, 
    color: 'bg-purple-600 text-white',
    bgLight: 'bg-purple-100 text-purple-700',
    label: 'NGO',
    label_bn: 'এনজিও'
  },
}

// Quick links for job portals
const QUICK_LINKS = [
  {
    title: 'BD Jobs',
    title_bn: 'বিডি জবস',
    url: 'https://www.bdjobs.com/',
    icon: Briefcase,
    color: 'bg-blue-500',
  },
  {
    title: 'Govt Job Portal',
    title_bn: 'সরকারি চাকরি',
    url: 'https://jobportal.gov.bd/',
    icon: Landmark,
    color: 'bg-green-500',
  },
  {
    title: 'Chakri',
    title_bn: 'চাকরি.কম',
    url: 'https://www.chakri.com/',
    icon: Building2,
    color: 'bg-orange-500',
  },
  {
    title: 'LinkedIn BD',
    title_bn: 'লিংকডইন',
    url: 'https://www.linkedin.com/jobs/bangladesh-jobs/',
    icon: Users,
    color: 'bg-sky-600',
  },
]

function JobsPage() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Get filter from URL
  const activeType = searchParams.get('type') || 'all'

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.portal.jobs({
        type: activeType === 'all' ? null : activeType,
        limit: 50,
      })
      
      if (response.success) {
        setJobs(response.data.items || [])
        setUpdatedAt(response.data.updated_at)
      } else {
        throw new Error('Failed to fetch jobs')
      }
    } catch (err) {
      setError(err.message)
      console.error('Jobs fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [activeType])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

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

  // Filter jobs by search query
  const filteredJobs = jobs.filter(job => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const title = (isBangla ? job.title : job.title_en || job.title).toLowerCase()
    const org = (isBangla ? job.organization : job.organization_en || job.organization).toLowerCase()
    const location = (isBangla ? job.location : job.location_en || job.location).toLowerCase()
    return title.includes(query) || org.includes(query) || location.includes(query)
  })

  // Format deadline
  const formatDeadline = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return isBangla ? 'মেয়াদ শেষ' : 'Expired'
    }
    if (diffDays === 0) {
      return isBangla ? 'আজ শেষ দিন!' : 'Last day!'
    }
    if (diffDays <= 3) {
      return isBangla ? `${diffDays} দিন বাকি` : `${diffDays} days left`
    }
    
    return date.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get deadline urgency class
  const getDeadlineClass = (dateStr) => {
    if (!dateStr) return 'text-gray-500'
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'text-gray-400 line-through'
    if (diffDays <= 3) return 'text-red-600 font-semibold'
    if (diffDays <= 7) return 'text-orange-600'
    return 'text-gray-600'
  }

  // Group jobs by type for statistics
  const jobStats = jobs.reduce((acc, job) => {
    const type = job.type || 'other'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isBangla ? 'চাকরি' : 'Jobs'}
            </h1>
            <p className="text-sm text-gray-500">
              {isBangla 
                ? 'বাংলাদেশের সর্বশেষ চাকরির খবর' 
                : 'Latest job opportunities in Bangladesh'}
            </p>
          </div>
        </div>
        
        {/* Refresh */}
        <button
          onClick={fetchJobs}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
          title={isBangla ? 'রিফ্রেশ' : 'Refresh'}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          {isBangla ? 'জব পোর্টাল' : 'Job Portals'}
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
                  <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 line-clamp-1">
                    {isBangla ? link.title_bn : link.title}
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 flex-shrink-0" />
              </a>
            )
          })}
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(TYPE_CONFIG).filter(([k]) => k !== 'all').map(([type, config]) => {
            const Icon = config.icon
            const count = jobStats[type] || 0
            return (
              <button
                key={type}
                onClick={() => updateFilter(type)}
                className={`p-4 rounded-xl border transition-all ${
                  activeType === type 
                    ? 'border-indigo-300 bg-indigo-50 shadow-sm' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgLight}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-800">{count}</div>
                    <div className="text-xs text-gray-500">
                      {isBangla ? config.label_bn : config.label}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBangla ? 'চাকরি খুঁজুন...' : 'Search jobs...'}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Type Tabs */}
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{isBangla ? 'ফিল্টার' : 'Filter'}:</span>
        </div>
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
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <span className="text-gray-500">
              {isBangla ? 'চাকরি লোড হচ্ছে...' : 'Loading jobs...'}
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium mb-2">
            {isBangla ? 'চাকরি লোড করতে সমস্যা হয়েছে' : 'Failed to load jobs'}
          </p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {isBangla ? 'আবার চেষ্টা করুন' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Jobs List */}
      {!loading && !error && (
        <>
          {/* Results count */}
          <div className="text-sm text-gray-500 mb-4">
            {isBangla 
              ? `${filteredJobs.length} টি চাকরি পাওয়া গেছে`
              : `${filteredJobs.length} jobs found`}
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const typeConfig = TYPE_CONFIG[job.type] || TYPE_CONFIG.private
              const TypeIcon = typeConfig.icon
              
              return (
                <a
                  key={job.id}
                  href={job.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${typeConfig.bgLight}`}>
                      <TypeIcon className="w-6 h-6" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {isBangla ? job.title : job.title_en || job.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {isBangla ? job.organization : job.organization_en || job.organization}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${typeConfig.bgLight}`}>
                          {isBangla ? typeConfig.label_bn : typeConfig.label}
                        </span>
                      </div>
                      
                      {/* Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                          {isBangla ? job.location : job.location_en || job.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-1.5 text-gray-400" />
                          {isBangla ? job.salary : job.salary_en || job.salary}
                        </div>
                        {job.vacancies && (
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-1.5 text-gray-400" />
                            {isBangla ? `${job.vacancies} পদ` : `${job.vacancies} positions`}
                          </div>
                        )}
                        <div className={`flex items-center ${getDeadlineClass(job.deadline)}`}>
                          <Calendar className="w-4 h-4 mr-1.5" />
                          {formatDeadline(job.deadline)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <div className="hidden sm:flex items-center text-gray-300 group-hover:text-indigo-500 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredJobs.length === 0 && (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {isBangla ? 'কোনো চাকরি পাওয়া যায়নি' : 'No jobs found'}
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
          className="text-gray-500 hover:text-indigo-600 text-sm"
        >
          {isBangla ? '← হোম পেজে ফিরে যান' : '← Back to Home'}
        </Link>
      </div>
    </div>
  )
}

export default JobsPage

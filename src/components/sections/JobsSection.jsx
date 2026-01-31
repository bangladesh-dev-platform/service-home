import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Briefcase, MapPin, DollarSign, Clock, Loader2, ExternalLink } from 'lucide-react'
import { SectionCard, TabGroup } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

function JobsSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [activeTab, setActiveTab] = useState('all')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const tabs = [
    { key: 'all', label: isBangla ? 'সব' : 'All' },
    { key: 'government', label: t('jobs.government') },
    { key: 'private', label: t('jobs.private') },
  ]

  const fetchJobs = async (type) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.portal.jobs({ 
        type: type === 'all' ? null : type,
        limit: 4 
      })
      if (response.success) {
        setJobs(response.data.items || [])
      } else {
        throw new Error('Failed to fetch jobs')
      }
    } catch (err) {
      setError(err.message)
      console.error('Jobs fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(activeTab)
  }, [activeTab])

  const formatDeadline = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <SectionCard
      title={t('sections.jobs')}
      icon={Briefcase}
      iconColor="text-indigo-600"
      headerRight={
        <Link 
          to="/jobs" 
          className="text-sm text-gray-500 hover:text-indigo-600"
          title={isBangla ? 'সব দেখুন' : 'View all'}
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
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Job List */}
      {!loading && !error && (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {jobs.map((job) => (
            <a
              key={job.id}
              href={job.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow text-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {isBangla ? job.title : job.title_en || job.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {isBangla ? job.organization : job.organization_en || job.organization}
                  </p>
                </div>
                {job.type && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    job.type === 'government' 
                      ? 'bg-blue-100 text-blue-700'
                      : job.type === 'private'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {job.type === 'government' ? (isBangla ? 'সরকারি' : 'Govt') : 
                     job.type === 'private' ? (isBangla ? 'বেসরকারি' : 'Private') :
                     (isBangla ? 'এনজিও' : 'NGO')}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {isBangla ? job.location : job.location_en || job.location}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {isBangla ? job.salary : job.salary_en || job.salary}
                </div>
                <div className="flex items-center col-span-2">
                  <Clock className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-600">
                    {t('jobs.deadline')}: {formatDeadline(job.deadline)}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* More Button */}
      <div className="mt-4 pt-3 border-t">
        <Link 
          to="/jobs" 
          className="block w-full text-center text-indigo-600 border border-indigo-200 rounded-md py-2 text-sm font-medium hover:bg-indigo-50"
        >
          {t('jobs.moreJobs')}
        </Link>
      </div>
    </SectionCard>
  )
}

export default JobsSection

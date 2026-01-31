import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, CalendarDays, CircleAlert, ExternalLink, Loader2 } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

// Tag color mapping
const TAG_COLORS = {
  jobs: 'text-blue-600 bg-blue-100',
  education: 'text-green-600 bg-green-100',
  policy: 'text-purple-600 bg-purple-100',
  tender: 'text-orange-600 bg-orange-100',
}

function NoticesSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.portal.notices({ limit: 4 })
        if (response.success) {
          setNotices(response.data.items || [])
        }
      } catch (err) {
        console.error('Notices fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCategoryLabel = (category) => {
    const labels = {
      jobs: { bn: 'চাকরি', en: 'Jobs' },
      education: { bn: 'শিক্ষা', en: 'Education' },
      policy: { bn: 'নীতি', en: 'Policy' },
      tender: { bn: 'টেন্ডার', en: 'Tender' },
    }
    return labels[category]?.[isBangla ? 'bn' : 'en'] || category
  }

  return (
    <SectionCard
      title={t('sections.notices')}
      icon={FileText}
      iconColor="text-blue-600"
      colSpan={2}
      headerRight={
        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
          <ExternalLink className="h-4 w-4" />
        </a>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Recent Notices */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <CircleAlert className="h-4 w-4 mr-1" />
              {isBangla ? 'সাম্প্রতিক নোটিশ' : 'Recent Notices'}
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {notices.map((notice) => (
                <a
                  key={notice.id}
                  href={notice.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-l-4 border-blue-500 pl-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <h5 className="text-sm font-medium text-gray-800">
                    {isBangla ? notice.title : notice.title_en || notice.title}
                  </h5>
                  <p className="text-xs text-gray-600 mt-1">
                    {isBangla ? notice.office : notice.office_en || notice.office}
                  </p>
                  <div className="flex items-center mt-2 space-x-2 text-xs">
                    <span className="text-gray-500 flex items-center">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {formatDate(notice.date)}
                    </span>
                    {notice.category && (
                      <span className={`px-2 py-0.5 rounded-full ${TAG_COLORS[notice.category] || 'text-gray-600 bg-gray-100'}`}>
                        {getCategoryLabel(notice.category)}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <a href="#" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
              <span className="text-blue-700 font-medium">
                {isBangla ? 'সকল নোটিশ' : 'All Notices'}
              </span>
            </a>
            <a href="#" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100 transition-colors">
              <span className="text-green-700 font-medium">
                {isBangla ? 'সরকারি ওয়েবসাইট' : 'Govt Website'}
              </span>
            </a>
          </div>
        </>
      )}
    </SectionCard>
  )
}

export default NoticesSection

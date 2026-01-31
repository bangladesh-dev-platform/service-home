import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, FileText, Award, Loader2, ExternalLink } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

// Type icons and colors
const TYPE_CONFIG = {
  tips: { icon: GraduationCap, color: 'text-blue-600 bg-blue-100' },
  resources: { icon: FileText, color: 'text-green-600 bg-green-100' },
  scholarships: { icon: Award, color: 'text-yellow-600 bg-yellow-100' },
  results: { icon: BookOpen, color: 'text-purple-600 bg-purple-100' },
}

function EducationSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await api.portal.education({ limit: 4 })
        if (response.success) {
          setItems(response.data.items || [])
        }
      } catch (err) {
        console.error('Education fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEducation()
  }, [])

  const getTypeLabel = (type) => {
    const labels = {
      tips: { bn: 'টিপস', en: 'Tips' },
      resources: { bn: 'উপকরণ', en: 'Resources' },
      scholarships: { bn: 'বৃত্তি', en: 'Scholarships' },
      results: { bn: 'ফলাফল', en: 'Results' },
    }
    return labels[type]?.[isBangla ? 'bn' : 'en'] || type
  }

  return (
    <SectionCard
      title={t('sections.education')}
      icon={BookOpen}
      iconColor="text-purple-600"
      headerRight={
        <Link 
          to="/education" 
          className="text-sm text-gray-500 hover:text-purple-600"
          title={isBangla ? 'সব দেখুন' : 'View all'}
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => {
              const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.tips
              const Icon = config.icon
              
              return (
                <a
                  key={item.id}
                  href={item.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>
                      {getTypeLabel(item.type)}
                    </span>
                    <h4 className="text-sm font-medium text-gray-800 mt-1">
                      {isBangla ? item.title : item.title_en || item.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {isBangla ? item.description : item.description_en || item.description}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
          
          {/* More Button */}
          <div className="mt-4 pt-3 border-t">
            <Link 
              to="/education" 
              className="block w-full text-center text-purple-600 border border-purple-200 rounded-md py-2 hover:bg-purple-50 text-sm font-medium"
            >
              {isBangla ? 'আরও দেখুন' : 'View More'}
            </Link>
          </div>
        </>
      )}
    </SectionCard>
  )
}

export default EducationSection

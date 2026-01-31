import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Phone, AlertTriangle, Shield, Heart, Stethoscope, 
  Zap, Info, Loader2, ChevronDown, ChevronUp 
} from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

// Icon mapping
const ICONS = {
  alert: AlertTriangle,
  shield: Shield,
  heart: Heart,
  health: Stethoscope,
  utility: Zap,
  info: Info,
}

function EmergencySection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState('Emergency')

  useEffect(() => {
    const fetchEmergency = async () => {
      try {
        const response = await api.portal.emergency()
        if (response.success) {
          setData(response.data)
        }
      } catch (err) {
        console.error('Emergency fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEmergency()
  }, [])

  const handleCall = (number) => {
    window.location.href = `tel:${number.replace(/[^0-9+]/g, '')}`
  }

  const toggleCategory = (name) => {
    setExpandedCategory(expandedCategory === name ? null : name)
  }

  return (
    <SectionCard
      title={isBangla ? 'জরুরি নম্বর' : 'Emergency Numbers'}
      icon={Phone}
      iconColor="text-red-600"
    >
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-red-500" />
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {data?.categories?.map((category) => {
            const Icon = ICONS[category.icon] || Phone
            const isExpanded = expandedCategory === category.name
            
            return (
              <div key={category.name} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      category.icon === 'alert' ? 'bg-red-100 text-red-600' :
                      category.icon === 'shield' ? 'bg-blue-100 text-blue-600' :
                      category.icon === 'heart' ? 'bg-pink-100 text-pink-600' :
                      category.icon === 'health' ? 'bg-green-100 text-green-600' :
                      category.icon === 'utility' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm text-gray-800">
                      {isBangla ? category.name_bn : category.name}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {/* Numbers */}
                {isExpanded && (
                  <div className="p-2 space-y-1">
                    {category.numbers.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCall(item.number)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-red-50 transition-colors group"
                      >
                        <div className="text-left">
                          <div className="text-sm text-gray-700 group-hover:text-red-700">
                            {isBangla ? item.name_bn : item.name}
                          </div>
                          {item.toll_free && (
                            <span className="text-xs text-green-600">
                              {isBangla ? 'বিনামূল্যে' : 'Toll Free'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-red-600">
                            {item.number}
                          </span>
                          <Phone className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Emergency */}
      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
        <button
          onClick={() => handleCall('999')}
          className="w-full flex items-center justify-center gap-2 text-red-700 font-semibold"
        >
          <Phone className="w-5 h-5" />
          <span>{isBangla ? 'জাতীয় জরুরি সেবা: ৯৯৯' : 'National Emergency: 999'}</span>
        </button>
      </div>
    </SectionCard>
  )
}

export default EmergencySection

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Trophy, Calendar, MapPin, Loader2, Clock } from 'lucide-react'
import { SectionCard, TabGroup } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

function CricketSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')

  const tabs = [
    { key: 'upcoming', label: isBangla ? 'আসন্ন' : 'Upcoming' },
    { key: 'recent', label: isBangla ? 'সাম্প্রতিক' : 'Recent' },
  ]

  useEffect(() => {
    const fetchCricket = async () => {
      try {
        const response = await api.portal.cricket()
        if (response.success) {
          setData(response.data)
        }
      } catch (err) {
        console.error('Cricket fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCricket()
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getDaysUntil = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
    if (diff === 0) return isBangla ? 'আজ' : 'Today'
    if (diff === 1) return isBangla ? 'আগামীকাল' : 'Tomorrow'
    return isBangla ? `${diff} দিন পর` : `In ${diff} days`
  }

  const matches = activeTab === 'upcoming' ? data?.upcoming : data?.recent

  return (
    <SectionCard
      title={isBangla ? 'ক্রিকেট' : 'Cricket'}
      icon={Trophy}
      iconColor="text-green-600"
    >
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-3"
      />

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-green-500" />
        </div>
      ) : matches?.length > 0 ? (
        <div className="space-y-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors"
            >
              {/* Teams */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{match.team1.flag}</span>
                  <div>
                    <span className="font-semibold text-sm">
                      {isBangla ? match.team1.name_bn : match.team1.name}
                    </span>
                    {match.team1.score && (
                      <span className="ml-2 text-sm text-gray-600">{match.team1.score}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {match.format}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{match.team2.flag}</span>
                <div>
                  <span className="font-semibold text-sm">
                    {isBangla ? match.team2.name_bn : match.team2.name}
                  </span>
                  {match.team2.score && (
                    <span className="ml-2 text-sm text-gray-600">{match.team2.score}</span>
                  )}
                </div>
              </div>

              {/* Result or Schedule */}
              {match.result ? (
                <div className="text-xs text-green-600 font-medium">
                  {isBangla ? match.result_bn : match.result}
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(match.date)} • {match.time}
                  </div>
                  <span className="text-green-600 font-medium">
                    {getDaysUntil(match.date)}
                  </span>
                </div>
              )}

              {/* Venue */}
              {match.venue && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <MapPin className="w-3 h-3" />
                  {isBangla ? match.venue_bn : match.venue}
                </div>
              )}

              {/* Series */}
              {match.series && (
                <div className="text-xs text-gray-400 mt-1">
                  {match.series}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 text-sm">
          {isBangla ? 'কোনো ম্যাচ নেই' : 'No matches'}
        </div>
      )}

      {/* Live indicator if any */}
      {data?.live?.length > 0 && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-600 font-medium">
              {isBangla ? 'লাইভ ম্যাচ চলছে!' : 'Live match in progress!'}
            </span>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

export default CricketSection

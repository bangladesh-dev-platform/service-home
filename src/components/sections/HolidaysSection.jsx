import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Flag, Moon, Star, Loader2, ChevronRight } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

// Type colors
const TYPE_COLORS = {
  national: 'bg-green-100 text-green-700 border-green-200',
  religious: 'bg-purple-100 text-purple-700 border-purple-200',
}

const TYPE_ICONS = {
  national: Flag,
  religious: Moon,
}

function HolidaysSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await api.portal.holidays()
        if (response.success) {
          setData(response.data)
        }
      } catch (err) {
        console.error('Holidays fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHolidays()
  }, [])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getDayName = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', {
      weekday: 'short',
    })
  }

  // Get upcoming holidays (from today onwards)
  const today = new Date().toISOString().split('T')[0]
  const upcomingHolidays = data?.holidays?.filter(h => h.date >= today) || []
  const displayHolidays = showAll ? upcomingHolidays : upcomingHolidays.slice(0, 4)

  return (
    <SectionCard
      title={isBangla ? 'সরকারি ছুটি' : 'Public Holidays'}
      icon={Calendar}
      iconColor="text-blue-600"
      headerRight={
        <span className="text-xs text-gray-500">{data?.year}</span>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Next Holiday Highlight */}
          {data?.next_holiday && (
            <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 mb-1">
                {isBangla ? 'পরবর্তী ছুটি' : 'Next Holiday'}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">
                    {isBangla ? data.next_holiday.name_bn : data.next_holiday.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(data.next_holiday.date)} ({getDayName(data.next_holiday.date)})
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {data.next_holiday.days_until}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isBangla ? 'দিন বাকি' : 'days left'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Holiday List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {displayHolidays.map((holiday, idx) => {
              const Icon = TYPE_ICONS[holiday.type] || Star
              const colorClass = TYPE_COLORS[holiday.type] || TYPE_COLORS.national
              
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg border ${colorClass}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <div>
                      <div className="text-sm font-medium">
                        {isBangla ? holiday.name_bn : holiday.name}
                      </div>
                      {holiday.lunar && (
                        <span className="text-xs opacity-70">
                          {isBangla ? '(চন্দ্র পঞ্জিকা)' : '(Lunar)'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">{formatDate(holiday.date)}</div>
                    <div className="text-xs opacity-70">{getDayName(holiday.date)}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Show More/Less */}
          {upcomingHolidays.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-3 w-full text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
            >
              {showAll ? (
                <>
                  {isBangla ? 'কম দেখুন' : 'Show less'}
                </>
              ) : (
                <>
                  {isBangla ? `আরও ${upcomingHolidays.length - 4}টি দেখুন` : `Show ${upcomingHolidays.length - 4} more`}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {/* Total count */}
          <div className="mt-2 text-center text-xs text-gray-400">
            {isBangla 
              ? `${data?.year} সালে মোট ${data?.total}টি সরকারি ছুটি`
              : `Total ${data?.total} public holidays in ${data?.year}`}
          </div>
        </>
      )}
    </SectionCard>
  )
}

export default HolidaysSection

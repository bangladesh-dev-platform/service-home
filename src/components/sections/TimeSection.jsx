import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, CalendarDays, Sun, Leaf, Cloud, Snowflake } from 'lucide-react'
import { SectionCard } from '../common'
import { formatBanglaTime, formatBanglaDate, formatBanglaCalendar, toBanglaDate, toBanglaDigits } from '../../utils/bangla'
import { useLanguage } from '../../context/LanguageContext'

// Season icons and colors
const SEASON_CONFIG = {
  'গ্রীষ্ম': { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
  'বর্ষা': { icon: Cloud, color: 'text-blue-500', bg: 'bg-blue-50' },
  'শরৎ': { icon: Cloud, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  'হেমন্ত': { icon: Leaf, color: 'text-amber-600', bg: 'bg-amber-50' },
  'শীত': { icon: Snowflake, color: 'text-blue-400', bg: 'bg-blue-50' },
  'বসন্ত': { icon: Leaf, color: 'text-green-500', bg: 'bg-green-50' },
}

function TimeSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const timeString = useMemo(() => {
    if (isBangla) {
      return formatBanglaTime(now)
    }
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }, [now, isBangla])

  const dateString = useMemo(() => {
    if (isBangla) {
      return formatBanglaDate(now)
    }
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [now, isBangla])

  // Bangla calendar info
  const banglaDateInfo = useMemo(() => toBanglaDate(now), [now])
  const banglaCalendarString = useMemo(() => formatBanglaCalendar(now, isBangla), [now, isBangla])
  
  const seasonConfig = SEASON_CONFIG[banglaDateInfo.season] || SEASON_CONFIG['বসন্ত']
  const SeasonIcon = seasonConfig.icon

  return (
    <SectionCard
      title={t('sections.timeDate')}
      icon={Clock}
      iconColor="text-green-600"
    >
      <div className="space-y-4">
        {/* Time Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 font-mono">
            {timeString}
          </div>
          <div className="text-sm text-gray-600 mt-1">{dateString}</div>
        </div>

        {/* Bangla Calendar */}
        <div className={`rounded-lg p-3 ${seasonConfig.bg}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {isBangla ? 'বঙ্গাব্দ' : 'Bangla Calendar'}
              </div>
              <div className="font-semibold text-gray-800">
                {banglaCalendarString}
              </div>
            </div>
            <div className={`p-2 rounded-full ${seasonConfig.bg}`}>
              <SeasonIcon className={`h-6 w-6 ${seasonConfig.color}`} />
            </div>
          </div>
          
          {/* Season */}
          <div className={`mt-2 pt-2 border-t border-gray-200 flex items-center text-sm ${seasonConfig.color}`}>
            <CalendarDays className="h-4 w-4 mr-1" />
            {isBangla ? 'ঋতু:' : 'Season:'} {' '}
            <span className="font-medium ml-1">
              {isBangla ? banglaDateInfo.season : banglaDateInfo.seasonEn}
            </span>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-gray-500">{isBangla ? 'বাংলা মাস' : 'Bangla Month'}</div>
            <div className="font-semibold text-gray-800">
              {isBangla ? banglaDateInfo.monthName : banglaDateInfo.monthNameEn}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-gray-500">{isBangla ? 'বঙ্গাব্দ সাল' : 'Bangla Year'}</div>
            <div className="font-semibold text-gray-800">
              {isBangla ? toBanglaDigits(banglaDateInfo.year) : banglaDateInfo.year}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

export default TimeSection

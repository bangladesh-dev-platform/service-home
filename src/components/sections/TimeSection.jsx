import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, CalendarDays } from 'lucide-react'
import { SectionCard } from '../common'
import { formatBanglaTime, formatBanglaDate } from '../../utils/bangla'
import { useLanguage } from '../../context/LanguageContext'

// Prayer times (would come from API later)
const prayerTimes = [
  { key: 'fajr', time: '5:15' },
  { key: 'dhuhr', time: '12:05' },
  { key: 'asr', time: '4:30' },
  { key: 'maghrib', time: '6:15' },
  { key: 'isha', time: '7:45' },
]

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

        {/* Hijri Date */}
        <div className="text-center border-t pt-3 text-sm text-gray-600">
          <CalendarDays className="inline h-4 w-4 mr-1" />
          {isBangla ? 'হিজরি: ১৪৪৬ সাল' : 'Hijri: 1446'}
        </div>

        {/* Prayer Times */}
        <div className="text-xs text-gray-500 space-y-1">
          {prayerTimes.map(({ key, time }) => (
            <div key={key} className="flex justify-between">
              <span>{t(`prayer.${key}`)}:</span>
              <span>{isBangla ? time.replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]) : time}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

export default TimeSection

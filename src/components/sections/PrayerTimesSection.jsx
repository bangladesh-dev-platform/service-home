import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Moon, Sun, Sunrise, Sunset, Clock, Loader2, MapPin } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

// Prayer configuration
const PRAYERS = [
  { key: 'fajr', name: 'Fajr', name_bn: 'ফজর', icon: Moon },
  { key: 'sunrise', name: 'Sunrise', name_bn: 'সূর্যোদয়', icon: Sunrise },
  { key: 'dhuhr', name: 'Dhuhr', name_bn: 'যোহর', icon: Sun },
  { key: 'asr', name: 'Asr', name_bn: 'আসর', icon: Sun },
  { key: 'maghrib', name: 'Maghrib', name_bn: 'মাগরিব', icon: Sunset },
  { key: 'isha', name: 'Isha', name_bn: 'ইশা', icon: Moon },
]

const CITIES = [
  { value: 'Dhaka', label: 'Dhaka', label_bn: 'ঢাকা' },
  { value: 'Chittagong', label: 'Chittagong', label_bn: 'চট্টগ্রাম' },
  { value: 'Sylhet', label: 'Sylhet', label_bn: 'সিলেট' },
  { value: 'Rajshahi', label: 'Rajshahi', label_bn: 'রাজশাহী' },
  { value: 'Khulna', label: 'Khulna', label_bn: 'খুলনা' },
]

function PrayerTimesSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('Dhaka')
  const [nextPrayer, setNextPrayer] = useState(null)

  useEffect(() => {
    const fetchPrayer = async () => {
      setLoading(true)
      try {
        const response = await api.portal.prayer(city)
        if (response.success) {
          setData(response.data)
          calculateNextPrayer(response.data.timings)
        }
      } catch (err) {
        console.error('Prayer times fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPrayer()
  }, [city])

  const calculateNextPrayer = (timings) => {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    
    for (const prayer of PRAYERS) {
      if (prayer.key === 'sunrise') continue // Skip sunrise
      const time = timings[prayer.key]
      if (!time) continue
      
      const [hours, mins] = time.split(':').map(Number)
      const prayerMinutes = hours * 60 + mins
      
      if (prayerMinutes > currentMinutes) {
        setNextPrayer(prayer.key)
        return
      }
    }
    setNextPrayer('fajr') // Next day's Fajr
  }

  const formatTime = (time) => {
    if (!time) return '--:--'
    const [hours, mins] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${mins} ${ampm}`
  }

  return (
    <SectionCard
      title={isBangla ? 'নামাজের সময়' : 'Prayer Times'}
      icon={Moon}
      iconColor="text-emerald-600"
    >
      {/* City Selector */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-gray-400" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          {CITIES.map((c) => (
            <option key={c.value} value={c.value}>
              {isBangla ? c.label_bn : c.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {/* Hijri Date */}
          {data?.date?.hijri && (
            <div className="text-center mb-3 text-sm text-gray-600">
              {data.date.hijri} {data.date.hijri_month} {data.date.hijri_year}
            </div>
          )}

          {/* Prayer Times Grid */}
          <div className="grid grid-cols-2 gap-2">
            {PRAYERS.filter(p => p.key !== 'sunrise').map((prayer) => {
              const Icon = prayer.icon
              const isNext = nextPrayer === prayer.key
              
              return (
                <div
                  key={prayer.key}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    isNext 
                      ? 'bg-emerald-100 border border-emerald-300' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isNext ? 'text-emerald-600' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isNext ? 'font-semibold text-emerald-800' : 'text-gray-700'}`}>
                      {isBangla ? prayer.name_bn : prayer.name}
                    </span>
                  </div>
                  <span className={`text-sm font-mono ${isNext ? 'text-emerald-700 font-semibold' : 'text-gray-600'}`}>
                    {formatTime(data?.timings?.[prayer.key])}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Next Prayer Indicator */}
          {nextPrayer && (
            <div className="mt-3 text-center text-xs text-emerald-600">
              <Clock className="w-3 h-3 inline mr-1" />
              {isBangla ? 'পরবর্তী নামাজ: ' : 'Next: '}
              {isBangla 
                ? PRAYERS.find(p => p.key === nextPrayer)?.name_bn 
                : PRAYERS.find(p => p.key === nextPrayer)?.name}
            </div>
          )}
        </>
      )}
    </SectionCard>
  )
}

export default PrayerTimesSection

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sun, MapPin, Thermometer } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import { toBanglaDigits } from '../../utils/bangla'

// Dummy weather data (will be replaced with API)
const weatherData = {
  'Dhaka': { temp: 32, desc: 'sunny', humidity: 75, forecast: [32, 31, 30, 29, 28] },
  'Chittagong': { temp: 30, desc: 'cloudy', humidity: 82, forecast: [30, 29, 29, 28, 28] },
  'Sylhet': { temp: 29, desc: 'rainy', humidity: 88, forecast: [29, 29, 28, 27, 27] },
  'Rajshahi': { temp: 35, desc: 'hot', humidity: 60, forecast: [35, 34, 33, 32, 31] },
  'Khulna': { temp: 31, desc: 'humid', humidity: 78, forecast: [31, 31, 30, 30, 29] },
}

const cityNames = {
  bn: { 'Dhaka': 'ঢাকা', 'Chittagong': 'চট্টগ্রাম', 'Sylhet': 'সিলেট', 'Rajshahi': 'রাজশাহী', 'Khulna': 'খুলনা' },
  en: { 'Dhaka': 'Dhaka', 'Chittagong': 'Chittagong', 'Sylhet': 'Sylhet', 'Rajshahi': 'Rajshahi', 'Khulna': 'Khulna' },
}

const forecastDays = {
  bn: ['আজ', 'কাল', 'পরশু', 'বৃহঃ', 'শুক্র'],
  en: ['Today', 'Tom', 'Day 3', 'Day 4', 'Day 5'],
}

function WeatherSection() {
  const { t } = useTranslation()
  const { isBangla, currentLang } = useLanguage()
  const [city, setCity] = useState('Dhaka')

  const weather = weatherData[city]
  const cities = Object.keys(weatherData)

  const formatTemp = (temp) => isBangla ? toBanglaDigits(temp) : temp
  const formatHumidity = (h) => isBangla ? toBanglaDigits(h) + '%' : h + '%'

  return (
    <SectionCard
      title={t('sections.weather')}
      icon={Sun}
      iconColor="text-blue-600"
      headerRight={
        <button className="text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
        </button>
      }
    >
      {/* City Selector */}
      <div className="mb-4">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {cityNames[currentLang][c]}
            </option>
          ))}
        </select>
      </div>

      {/* Current Weather */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-3">
          <Sun className="h-8 w-8 text-yellow-500" />
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {formatTemp(weather.temp)}°C
            </div>
            <div className="text-sm text-gray-600">
              {t(`weather.${weather.desc}`)}
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex justify-between text-xs text-gray-500 pt-3 border-t">
          <div className="flex items-center">
            <Thermometer className="h-3 w-3 mr-1" />
            {t('weather.humidity')}: {formatHumidity(weather.humidity)}
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="grid grid-cols-5 gap-1 text-xs mt-4">
          {forecastDays[currentLang].map((label, index) => (
            <div key={label} className="text-center p-1">
              <div className="text-gray-600">{label}</div>
              <Sun className="h-3 w-3 mx-auto my-1 text-yellow-500" />
              <div className="text-gray-800">{formatTemp(weather.forecast[index])}°</div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

export default WeatherSection

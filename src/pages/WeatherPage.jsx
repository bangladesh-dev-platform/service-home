import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Sun, Cloud, CloudRain, CloudLightning, CloudFog, CloudDrizzle, CloudSnow,
  MapPin, Loader2, RefreshCw, ChevronDown, Filter
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { toBanglaDigits } from '../utils/bangla'
import api from '../services/api'

// Divisions for filter
const DIVISIONS = [
  { id: 'all', name: 'All Divisions', name_bn: 'সব বিভাগ' },
  { id: 'dhaka', name: 'Dhaka', name_bn: 'ঢাকা' },
  { id: 'chattogram', name: 'Chattogram', name_bn: 'চট্টগ্রাম' },
  { id: 'rajshahi', name: 'Rajshahi', name_bn: 'রাজশাহী' },
  { id: 'khulna', name: 'Khulna', name_bn: 'খুলনা' },
  { id: 'barishal', name: 'Barishal', name_bn: 'বরিশাল' },
  { id: 'sylhet', name: 'Sylhet', name_bn: 'সিলেট' },
  { id: 'rangpur', name: 'Rangpur', name_bn: 'রংপুর' },
  { id: 'mymensingh', name: 'Mymensingh', name_bn: 'ময়মনসিংহ' },
]

// Weather icon component
const WeatherIcon = ({ code, className = 'h-6 w-6' }) => {
  const iconMap = {
    'sun': Sun,
    'cloud': Cloud,
    'cloud-sun': Cloud,
    'cloud-rain': CloudRain,
    'cloud-lightning': CloudLightning,
    'cloud-fog': CloudFog,
    'cloud-drizzle': CloudDrizzle,
    'cloud-snow': CloudSnow,
  }
  
  const IconComponent = iconMap[code] || Sun
  const colorMap = {
    'sun': 'text-yellow-500',
    'cloud': 'text-gray-400',
    'cloud-sun': 'text-yellow-400',
    'cloud-rain': 'text-blue-500',
    'cloud-lightning': 'text-purple-500',
    'cloud-fog': 'text-gray-400',
    'cloud-drizzle': 'text-blue-400',
    'cloud-snow': 'text-blue-200',
  }
  
  return <IconComponent className={`${className} ${colorMap[code] || 'text-yellow-500'}`} />
}

// District weather card
function DistrictWeatherCard({ district, weather, isBangla }) {
  const formatTemp = (temp) => isBangla ? toBanglaDigits(temp) : temp
  
  if (!weather) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">
              {isBangla ? district.name_bn : district.name}
            </h3>
            <p className="text-xs text-gray-500">
              {isBangla ? district.division_bn : district.division}
            </p>
          </div>
          <div className="text-gray-400 text-sm">
            {isBangla ? 'তথ্য নেই' : 'No data'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">
            {isBangla ? district.name_bn : district.name}
          </h3>
          <p className="text-xs text-gray-500">
            {isBangla ? district.division_bn : district.division}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <WeatherIcon code={weather.icon} className="h-8 w-8" />
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">
              {formatTemp(weather.temperature)}°
            </div>
            <div className="text-xs text-gray-500">
              {isBangla ? weather.condition_bn : weather.condition}
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional details */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-gray-500">
        <span>💧 {isBangla ? toBanglaDigits(weather.humidity) : weather.humidity}%</span>
        <span>🌡️ {isBangla ? 'অনুভূত' : 'Feels'} {formatTemp(weather.feels_like || weather.temperature)}°</span>
        <span>💨 {formatTemp(weather.wind_speed)} km/h</span>
      </div>
    </div>
  )
}

function WeatherPage() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  
  const [selectedDivision, setSelectedDivision] = useState('all')
  const [weatherData, setWeatherData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Fetch weather for all districts
  const fetchWeatherData = async (division = null) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.portal.weather.bulk(division === 'all' ? null : division)
      if (response.success) {
        setWeatherData(response.data.items || [])
        setLastUpdated(new Date())
      } else {
        throw new Error('Failed to fetch weather data')
      }
    } catch (err) {
      setError(err.message)
      console.error('Weather page fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount and when division changes
  useEffect(() => {
    fetchWeatherData(selectedDivision)
  }, [selectedDivision])

  // Group by division for display
  const groupedByDivision = weatherData.reduce((acc, item) => {
    const division = item.district?.division || 'Unknown'
    if (!acc[division]) {
      acc[division] = []
    }
    acc[division].push(item)
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Sun className="h-7 w-7 mr-2 text-yellow-500" />
          {isBangla ? 'বাংলাদেশের আবহাওয়া' : 'Bangladesh Weather'}
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          {isBangla 
            ? 'সকল ৬৪ জেলার আবহাওয়া তথ্য' 
            : 'Weather information for all 64 districts'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {isBangla ? 'বিভাগ:' : 'Division:'}
          </span>
        </div>
        
        <div className="relative">
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            disabled={loading}
            className="appearance-none bg-gray-100 border-0 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {DIVISIONS.map((div) => (
              <option key={div.id} value={div.id}>
                {isBangla ? div.name_bn : div.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <button
          onClick={() => fetchWeatherData(selectedDivision)}
          disabled={loading}
          className="ml-auto flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {isBangla ? 'রিফ্রেশ' : 'Refresh'}
        </button>

        {lastUpdated && (
          <span className="text-xs text-gray-500">
            {isBangla ? 'আপডেট:' : 'Updated:'} {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-600">
            {isBangla ? 'আবহাওয়া তথ্য লোড হচ্ছে...' : 'Loading weather data...'}
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchWeatherData(selectedDivision)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isBangla ? 'আবার চেষ্টা করুন' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Weather Grid */}
      {!loading && !error && (
        <>
          {selectedDivision === 'all' ? (
            // Show grouped by division
            Object.entries(groupedByDivision).map(([division, items]) => (
              <div key={division} className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  {division} {isBangla ? 'বিভাগ' : 'Division'}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({items.length} {isBangla ? 'জেলা' : 'districts'})
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item, idx) => (
                    <DistrictWeatherCard
                      key={item.district?.id || idx}
                      district={item.district}
                      weather={item.weather}
                      isBangla={isBangla}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Show flat list for single division
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {weatherData.map((item, idx) => (
                <DistrictWeatherCard
                  key={item.district?.id || idx}
                  district={item.district}
                  weather={item.weather}
                  isBangla={isBangla}
                />
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-8 bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-600">
            {isBangla 
              ? `মোট ${toBanglaDigits(weatherData.length)} জেলার আবহাওয়া তথ্য প্রদর্শিত`
              : `Showing weather for ${weatherData.length} districts`}
          </div>
        </>
      )}
    </div>
  )
}

export default WeatherPage

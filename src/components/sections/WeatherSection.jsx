import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
  Sun, Cloud, CloudRain, CloudLightning, CloudFog, CloudDrizzle, CloudSnow,
  MapPin, Thermometer, Droplets, Wind, Navigation, ChevronDown, Loader2, RefreshCw
} from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import { useGeolocation } from '../../hooks'
import { toBanglaDigits } from '../../utils/bangla'
import api from '../../services/api'

// 9 locations for dropdown (8 divisions + Cumilla)
const WEATHER_LOCATIONS = [
  { id: 'dhaka', name: 'Dhaka', name_bn: 'ঢাকা' },
  { id: 'chattogram', name: 'Chattogram', name_bn: 'চট্টগ্রাম' },
  { id: 'rajshahi', name: 'Rajshahi', name_bn: 'রাজশাহী' },
  { id: 'khulna', name: 'Khulna', name_bn: 'খুলনা' },
  { id: 'barishal', name: 'Barishal', name_bn: 'বরিশাল' },
  { id: 'sylhet', name: 'Sylhet', name_bn: 'সিলেট' },
  { id: 'rangpur', name: 'Rangpur', name_bn: 'রংপুর' },
  { id: 'mymensingh', name: 'Mymensingh', name_bn: 'ময়মনসিংহ' },
  { id: 'comilla', name: 'Comilla', name_bn: 'কুমিল্লা' },
]

// Weather icon mapping
const WeatherIcon = ({ code, className = 'h-8 w-8' }) => {
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

function WeatherSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const { location: geoLocation, requestLocation, loading: geoLoading, permissionState } = useGeolocation()
  
  const [selectedLocation, setSelectedLocation] = useState('dhaka')
  const [useMyLocation, setUseMyLocation] = useState(false)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch weather data
  const fetchWeather = async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.portal.weather.get(params)
      if (response.success) {
        setWeather(response.data)
      } else {
        throw new Error('Failed to fetch weather')
      }
    } catch (err) {
      setError(err.message)
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and when location changes
  useEffect(() => {
    if (useMyLocation && geoLocation) {
      fetchWeather({ lat: geoLocation.lat, lon: geoLocation.lon })
    } else {
      fetchWeather({ district: selectedLocation })
    }
  }, [selectedLocation, useMyLocation, geoLocation])

  // Handle "Use My Location" click
  const handleUseMyLocation = () => {
    if (permissionState === 'granted' && geoLocation) {
      setUseMyLocation(true)
    } else {
      requestLocation()
      setUseMyLocation(true)
    }
  }

  // Handle location dropdown change
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value)
    setUseMyLocation(false)
  }

  const formatTemp = (temp) => isBangla ? toBanglaDigits(temp) : temp
  const formatPercent = (val) => isBangla ? toBanglaDigits(val) + '%' : val + '%'

  // Get location display name
  const getLocationName = () => {
    if (useMyLocation && weather?.location) {
      return isBangla ? weather.location.city_bn : weather.location.city
    }
    const loc = WEATHER_LOCATIONS.find(l => l.id === selectedLocation)
    return isBangla ? loc?.name_bn : loc?.name
  }

  return (
    <SectionCard
      title={t('sections.weather')}
      icon={Sun}
      iconColor="text-blue-600"
      headerRight={
        <Link to="/weather" className="text-xs text-blue-600 hover:text-blue-700">
          {isBangla ? 'সব জেলা' : 'All Districts'}
        </Link>
      }
    >
      {/* Location Selector */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <select
            value={useMyLocation ? 'my-location' : selectedLocation}
            onChange={handleLocationChange}
            disabled={loading}
            className="w-full p-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {useMyLocation && (
              <option value="my-location">
                {isBangla ? '📍 আমার অবস্থান' : '📍 My Location'}
              </option>
            )}
            {WEATHER_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {isBangla ? loc.name_bn : loc.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        
        {/* Location Button */}
        <button
          onClick={handleUseMyLocation}
          disabled={geoLoading}
          className={`p-2 rounded-md transition-colors ${
            useMyLocation 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isBangla ? 'আমার অবস্থান ব্যবহার করুন' : 'Use my location'}
        >
          {geoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <button 
            onClick={() => fetchWeather({ district: selectedLocation })}
            className="text-blue-600 text-sm flex items-center justify-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            {isBangla ? 'আবার চেষ্টা করুন' : 'Try again'}
          </button>
        </div>
      )}

      {/* Weather Data */}
      {weather && !loading && !error && (
        <div className="space-y-4">
          {/* Current Weather */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <WeatherIcon code={weather.current?.icon} className="h-12 w-12" />
              <div>
                <div className="text-4xl font-bold text-gray-800">
                  {formatTemp(weather.current?.temperature)}°
                </div>
                <div className="text-sm text-gray-600">
                  {isBangla ? weather.current?.condition_bn : weather.current?.condition}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                {getLocationName()}
              </div>
              {weather.current?.feels_like && (
                <div className="text-xs text-gray-500">
                  {isBangla ? 'অনুভূত' : 'Feels'} {formatTemp(weather.current.feels_like)}°
                </div>
              )}
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-3 gap-2 text-xs border-t border-b py-3">
            <div className="flex items-center text-gray-600">
              <Droplets className="h-3 w-3 mr-1 text-blue-500" />
              {formatPercent(weather.current?.humidity || 0)}
            </div>
            <div className="flex items-center text-gray-600">
              <Wind className="h-3 w-3 mr-1 text-gray-500" />
              {formatTemp(weather.current?.wind_speed || 0)} km/h
            </div>
            <div className="flex items-center text-gray-600">
              <Thermometer className="h-3 w-3 mr-1 text-red-500" />
              {formatTemp(weather.current?.feels_like || weather.current?.temperature)}°
            </div>
          </div>

          {/* Forecast */}
          {weather.forecast && weather.forecast.length > 0 && (
            <div className="grid grid-cols-5 gap-1 text-xs">
              {weather.forecast.slice(0, 5).map((day, index) => (
                <div key={index} className="text-center p-1 rounded hover:bg-gray-50">
                  <div className="text-gray-600 font-medium">
                    {isBangla ? day.day_bn : day.day}
                  </div>
                  <WeatherIcon code={day.icon} className="h-5 w-5 mx-auto my-1" />
                  <div className="text-gray-800">
                    {formatTemp(day.temp_max)}°
                  </div>
                  <div className="text-gray-500">
                    {formatTemp(day.temp_min)}°
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </SectionCard>
  )
}

export default WeatherSection

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { DollarSign, RefreshCw, Loader2 } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import { toBanglaDigits } from '../../utils/bangla'
import api from '../../services/api'

// Currency flags
const FLAGS = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  SAR: '🇸🇦',
  AED: '🇦🇪',
  INR: '🇮🇳',
  MYR: '🇲🇾',
  SGD: '🇸🇬',
}

function CurrencySection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [source, setSource] = useState('live')

  const fetchRates = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.portal.currency()
      if (response.success) {
        setRates(response.data.rates || [])
        setLastUpdated(response.data.updated_at)
        setSource(response.data.source || 'live')
      } else {
        throw new Error('Failed to fetch rates')
      }
    } catch (err) {
      setError(err.message)
      console.error('Currency fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
  }, [])

  const formatRate = (rate) => isBangla ? toBanglaDigits(rate.toFixed(2)) : rate.toFixed(2)
  
  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleTimeString(isBangla ? 'bn-BD' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <SectionCard
      title={t('sections.currency')}
      icon={DollarSign}
      iconColor="text-green-600"
      headerRight={
        <button
          onClick={fetchRates}
          disabled={loading}
          className="text-gray-500 hover:text-green-600 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      {/* Loading */}
      {loading && rates.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-green-500" />
        </div>
      )}

      {/* Error */}
      {error && !loading && rates.length === 0 && (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Rates */}
      {rates.length > 0 && (
        <div className="space-y-2">
          {rates.slice(0, 6).map((currency) => (
            <div 
              key={currency.code} 
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{FLAGS[currency.code] || '💱'}</span>
                <div>
                  <div className="font-medium text-gray-800">{currency.code}</div>
                  <div className="text-xs text-gray-500">
                    {isBangla ? currency.name_bn : currency.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">
                  ৳{formatRate(currency.rate)}
                </div>
                <div className="text-xs text-gray-400">
                  {currency.symbol}1 = ৳{formatRate(currency.rate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t text-xs text-gray-500 text-center flex items-center justify-center gap-2">
        <span>
          {isBangla ? 'আপডেট:' : 'Updated:'} {formatTime(lastUpdated)}
        </span>
        {source === 'cached' && (
          <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
            {isBangla ? 'ক্যাশড' : 'Cached'}
          </span>
        )}
        {source === 'default' && (
          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
            {isBangla ? 'ডিফল্ট' : 'Default'}
          </span>
        )}
      </div>
    </SectionCard>
  )
}

export default CurrencySection

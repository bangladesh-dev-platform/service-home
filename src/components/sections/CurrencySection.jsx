import { useTranslation } from 'react-i18next'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import { toBanglaDigits } from '../../utils/bangla'

// Dummy currency data (will be replaced with API)
const currencyRates = [
  { code: 'USD', flag: '🇺🇸', unit: { bn: '১ USD', en: '1 USD' }, rate: 109.5, delta: 0.25, trend: 'up' },
  { code: 'EUR', flag: '🇪🇺', unit: { bn: '১ EUR', en: '1 EUR' }, rate: 118.75, delta: 0.15, trend: 'down' },
  { code: 'GBP', flag: '🇬🇧', unit: { bn: '১ GBP', en: '1 GBP' }, rate: 135.2, delta: 0.4, trend: 'up' },
  { code: 'INR', flag: '🇮🇳', unit: { bn: '১০০ রুপি', en: '100 INR' }, rate: 1.31, delta: 0.02, trend: 'down' },
  { code: 'SAR', flag: '🇸🇦', unit: { bn: '১ SAR', en: '1 SAR' }, rate: 29.2, delta: 0.1, trend: 'up' },
]

function CurrencySection() {
  const { t } = useTranslation()
  const { isBangla, currentLang } = useLanguage()

  const formatRate = (rate) => isBangla ? toBanglaDigits(rate.toString()) : rate
  const formatDelta = (delta) => isBangla ? toBanglaDigits(delta.toString()) : delta

  return (
    <SectionCard
      title={t('sections.currency')}
      icon={DollarSign}
      iconColor="text-green-600"
    >
      <div className="space-y-3">
        {currencyRates.map(({ code, flag, unit, rate, delta, trend }) => (
          <div key={code} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{flag}</span>
              <div>
                <div className="font-medium text-gray-800">{code}</div>
                <div className="text-xs text-gray-500">{unit[currentLang]}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-800">৳{formatRate(rate)}</div>
              <div
                className={`flex items-center text-xs ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {formatDelta(delta)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t text-xs text-gray-500 text-center">
        {isBangla 
          ? 'সর্বশেষ আপডেট: ১২ জুলাই, ২০২৫ - ৪:২৩ PM'
          : 'Last updated: July 12, 2025 - 4:23 PM'
        }
      </div>
    </SectionCard>
  )
}

export default CurrencySection

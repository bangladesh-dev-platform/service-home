import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, Minus, Loader2, Fuel, Gem } from 'lucide-react'
import { SectionCard, TabGroup } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

function CommoditySection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('gold')

  const tabs = [
    { key: 'gold', label: isBangla ? 'স্বর্ণ' : 'Gold' },
    { key: 'fuel', label: isBangla ? 'জ্বালানি' : 'Fuel' },
  ]

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await api.portal.commodities()
        if (response.success) {
          setData(response.data)
        }
      } catch (err) {
        console.error('Commodities fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCommodities()
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat(isBangla ? 'bn-BD' : 'en-BD').format(price)
  }

  const ChangeIndicator = ({ change, percent }) => {
    if (!change) return <Minus className="w-3 h-3 text-gray-400" />
    
    const isUp = change > 0
    const Icon = isUp ? TrendingUp : TrendingDown
    const color = isUp ? 'text-green-600' : 'text-red-600'
    
    return (
      <div className={`flex items-center gap-1 text-xs ${color}`}>
        <Icon className="w-3 h-3" />
        <span>{isUp ? '+' : ''}{formatPrice(change)}</span>
        {percent && <span>({percent.toFixed(2)}%)</span>}
      </div>
    )
  }

  return (
    <SectionCard
      title={isBangla ? 'পণ্যমূল্য' : 'Commodity Prices'}
      icon={Gem}
      iconColor="text-yellow-600"
    >
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-3"
      />

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
        </div>
      ) : activeTab === 'gold' ? (
        <div className="space-y-2">
          {/* Gold Prices */}
          {data?.gold && Object.entries(data.gold).map(([karat, info]) => (
            <div
              key={karat}
              className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">{karat}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {isBangla ? `${karat} ক্যারেট` : `${karat} Karat`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isBangla ? `প্রতি ${info.unit_bn}` : `per ${info.unit}`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-800">
                  ৳{formatPrice(info.price)}
                </div>
                <ChangeIndicator change={info.change} percent={info.change_percent} />
              </div>
            </div>
          ))}

          {/* Silver */}
          {data?.silver && (
            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">Ag</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {isBangla ? 'রুপা' : 'Silver'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isBangla ? `প্রতি ${data.silver.unit_bn}` : `per ${data.silver.unit}`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-800">
                  ৳{formatPrice(data.silver.price)}
                </div>
                <ChangeIndicator change={data.silver.change} percent={data.silver.change_percent} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Fuel Prices */}
          {data?.fuel && Object.entries(data.fuel).map(([type, info]) => (
            <div
              key={type}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  type === 'petrol' ? 'bg-green-100' :
                  type === 'diesel' ? 'bg-yellow-100' :
                  type === 'kerosene' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  <Fuel className={`w-4 h-4 ${
                    type === 'petrol' ? 'text-green-600' :
                    type === 'diesel' ? 'text-yellow-600' :
                    type === 'kerosene' ? 'text-blue-600' : 'text-orange-600'
                  }`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {isBangla ? info.name_bn : type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isBangla ? `প্রতি ${info.unit_bn}` : `per ${info.unit}`}
                  </div>
                </div>
              </div>
              <div className="text-sm font-bold text-gray-800">
                ৳{formatPrice(info.price)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Source */}
      {data?.source && (
        <div className="mt-3 text-xs text-gray-400 text-center">
          {isBangla ? 'সূত্র: ' : 'Source: '}{data.source}
        </div>
      )}
    </SectionCard>
  )
}

export default CommoditySection

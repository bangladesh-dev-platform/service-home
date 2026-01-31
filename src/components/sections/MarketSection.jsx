import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, ArrowRight, Star, Clock, Loader2 } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import { toBanglaDigits } from '../../utils/bangla'
import api from '../../services/api'

// Category filters
const CATEGORIES = [
  { id: 'all', label: 'সব', labelEn: 'All' },
  { id: 'electronics', label: 'ইলেকট্রনিক্স', labelEn: 'Electronics' },
  { id: 'fashion', label: 'ফ্যাশন', labelEn: 'Fashion' },
  { id: 'food', label: 'খাবার', labelEn: 'Food' },
  { id: 'books', label: 'বই', labelEn: 'Books' },
]

function MarketSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDeals = async (category) => {
    setLoading(true)
    try {
      const response = await api.portal.market({ 
        category: category === 'all' ? null : category,
        limit: 4 
      })
      if (response.success) {
        setDeals(response.data.items || [])
      }
    } catch (err) {
      console.error('Market fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeals(activeCategory)
  }, [activeCategory])

  const formatPrice = (price) => {
    const formatted = price.toLocaleString()
    return isBangla ? '৳' + toBanglaDigits(formatted) : '৳' + formatted
  }

  const formatTimeLeft = (dateStr) => {
    if (!dateStr) return ''
    const expires = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.ceil((expires - now) / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) return isBangla ? 'শেষ হয়ে গেছে' : 'Expired'
    if (diffDays === 1) return isBangla ? '১ দিন বাকি' : '1 day left'
    return isBangla ? `${toBanglaDigits(diffDays)} দিন বাকি` : `${diffDays} days left`
  }

  return (
    <SectionCard
      title={t('sections.market')}
      icon={ShoppingCart}
      iconColor="text-orange-600"
      colSpan={4}
      headerRight={
        <button className="text-orange-600 text-sm font-medium flex items-center hover:text-orange-700 transition-colors">
          {isBangla ? 'সব ডিল দেখুন' : 'See All Deals'}
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      }
    >
      {/* Category Filters */}
      <div className="flex space-x-2 mb-4 overflow-x-auto text-sm pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isBangla ? cat.label : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        </div>
      )}

      {/* Deals Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow text-sm"
            >
              {/* Image */}
              <div className="relative mb-3">
                <img
                  src={deal.image}
                  alt={isBangla ? deal.title : deal.title_en}
                  className="w-full h-20 object-cover rounded-md"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  -{deal.discount}%
                </div>
              </div>

              {/* Info */}
              <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">
                {isBangla ? deal.title : deal.title_en || deal.title}
              </h4>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-orange-600">
                  {formatPrice(deal.price)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(deal.original_price)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                <span>{isBangla ? deal.shop : deal.shop_en || deal.shop}</span>
                <span className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                  {deal.rating}
                </span>
              </div>
              <div className="flex items-center text-xs text-red-600">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimeLeft(deal.expires_at)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promo Banner */}
      <div className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white flex items-center justify-between">
        <div>
          <h4 className="font-bold text-lg">
            {isBangla ? 'মেগা সেল ২০২৫' : 'Mega Sale 2025'}
          </h4>
          <p className="text-sm opacity-90">
            {isBangla ? 'সব পণ্যে ৭০% পর্যন্ত ছাড়' : 'Up to 70% off on all products'}
          </p>
        </div>
        <button className="bg-white text-orange-600 px-4 py-2 rounded-md font-medium hover:bg-orange-50 transition-colors">
          {isBangla ? 'এখনই কিনুন' : 'Shop Now'}
        </button>
      </div>
    </SectionCard>
  )
}

export default MarketSection

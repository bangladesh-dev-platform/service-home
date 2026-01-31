import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, ArrowRight, Star, Clock } from 'lucide-react'
import { SectionCard } from '../common'

// Dummy data - will be replaced with API
const marketFilters = {
  bn: ['সব', 'ইলেকট্রনিক্স', 'ফ্যাশন', 'খাবার', 'বই', 'স্বাস্থ্য'],
  en: ['All', 'Electronics', 'Fashion', 'Food', 'Books', 'Health'],
}

const deals = [
  {
    id: 1,
    title: 'স্মার্টফোন - ৫০% ছাড়',
    titleEn: 'Smartphone - 50% Off',
    price: '৳১৫,০০০',
    priceEn: '৳15,000',
    original: '৳৩০,০০০',
    originalEn: '৳30,000',
    shop: 'টেক শপ',
    shopEn: 'Tech Shop',
    rating: '4.5',
    timeLeft: '২ দিন বাকি',
    timeLeftEn: '2 days left',
    discount: '-50%',
    image: 'https://via.placeholder.com/80x80/3b82f6/ffffff?text=Phone',
    category: 'ইলেকট্রনিক্স',
  },
  {
    id: 2,
    title: 'পুরুষদের শার্ট - ৩০% ছাড়',
    titleEn: "Men's Shirt - 30% Off",
    price: '৳১,৪০০',
    priceEn: '৳1,400',
    original: '৳২,০০০',
    originalEn: '৳2,000',
    shop: 'ফ্যাশন হাউস',
    shopEn: 'Fashion House',
    rating: '4.2',
    timeLeft: '১ দিন বাকি',
    timeLeftEn: '1 day left',
    discount: '-30%',
    image: 'https://via.placeholder.com/80x80/ef4444/ffffff?text=Shirt',
    category: 'ফ্যাশন',
  },
  {
    id: 3,
    title: 'অর্গানিক মধু - ২৫% ছাড়',
    titleEn: 'Organic Honey - 25% Off',
    price: '৳৬০০',
    priceEn: '৳600',
    original: '৳৮০০',
    originalEn: '৳800',
    shop: 'প্রাকৃতিক খাদ্য',
    shopEn: 'Natural Foods',
    rating: '4.8',
    timeLeft: '৩ দিন বাকি',
    timeLeftEn: '3 days left',
    discount: '-25%',
    image: 'https://via.placeholder.com/80x80/f59e0b/ffffff?text=Honey',
    category: 'খাবার',
  },
  {
    id: 4,
    title: 'প্রোগ্রামিং বই সেট - ৪০% ছাড়',
    titleEn: 'Programming Books Set - 40% Off',
    price: '৳১,৮০০',
    priceEn: '৳1,800',
    original: '৳৩,০০০',
    originalEn: '৳3,000',
    shop: 'বুক স্টোর',
    shopEn: 'Book Store',
    rating: '4.6',
    timeLeft: '৫ দিন বাকি',
    timeLeftEn: '5 days left',
    discount: '-40%',
    image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=Books',
    category: 'বই',
  },
]

function MarketSection() {
  const { t, i18n } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('সব')
  const isBangla = i18n.language === 'bn'

  const filters = marketFilters[i18n.language] || marketFilters.bn
  const allFilter = isBangla ? 'সব' : 'All'

  const filteredDeals = activeFilter === allFilter
    ? deals
    : deals.filter((deal) => deal.category === activeFilter)

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
      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto text-sm pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredDeals.map((deal) => (
          <div
            key={deal.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow text-sm"
          >
            {/* Image */}
            <div className="relative mb-3">
              <img
                src={deal.image}
                alt={isBangla ? deal.title : deal.titleEn}
                className="w-full h-20 object-cover rounded-md"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {deal.discount}
              </div>
            </div>

            {/* Info */}
            <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">
              {isBangla ? deal.title : deal.titleEn}
            </h4>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-bold text-orange-600">
                {isBangla ? deal.price : deal.priceEn}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {isBangla ? deal.original : deal.originalEn}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
              <span>{isBangla ? deal.shop : deal.shopEn}</span>
              <span className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                {deal.rating}
              </span>
            </div>
            <div className="flex items-center text-xs text-red-600">
              <Clock className="h-3 w-3 mr-1" />
              {isBangla ? deal.timeLeft : deal.timeLeftEn}
            </div>
          </div>
        ))}
      </div>

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

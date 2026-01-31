import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Newspaper, Clock, ExternalLink } from 'lucide-react'
import { SectionCard, TabGroup } from '../common'

// Dummy news data (will be replaced with API)
const newsItems = {
  bn: [
    { title: 'বাংলাদেশে নতুন প্রযুক্তি পার্ক উদ্বোধন', source: 'প্রথম আলো', time: '২ ঘন্টা আগে' },
    { title: 'ঢাকায় নতুন মেট্রো রেল লাইনের কাজ শুরু', source: 'বাংলা ট্রিবিউন', time: '৩ ঘন্টা আগে' },
    { title: 'শিক্ষা খাতে বাজেট বৃদ্ধির ঘোষণা', source: 'যুগান্তর', time: '৪ ঘন্টা আগে' },
    { title: 'কৃষি উৎপাদনে রেকর্ড সাফল্য', source: 'ইত্তেফাক', time: '৫ ঘন্টা আগে' },
  ],
  en: [
    { title: 'New Technology Park Inaugurated in Bangladesh', source: 'Prothom Alo', time: '2 hours ago' },
    { title: 'Construction Begins on New Dhaka Metro Line', source: 'Bangla Tribune', time: '3 hours ago' },
    { title: 'Education Budget Increase Announced', source: 'Jugantor', time: '4 hours ago' },
    { title: 'Record Success in Agricultural Production', source: 'Ittefaq', time: '5 hours ago' },
  ],
}

function NewsSection() {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('latest')

  const tabs = [
    { key: 'latest', label: t('news.latest') },
    { key: 'national', label: t('news.national') },
    { key: 'international', label: t('news.international') },
  ]

  const news = newsItems[i18n.language] || newsItems.bn

  return (
    <SectionCard
      title={t('sections.news')}
      icon={Newspaper}
      iconColor="text-red-600"
      colSpan={2}
      headerRight={
        <button className="text-sm text-gray-500">
          <ExternalLink className="h-4 w-4" />
        </button>
      }
    >
      {/* Tabs */}
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      {/* News List */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {news.map(({ title, source, time }) => (
          <div key={title} className="border-b border-gray-100 pb-3 last:border-b-0">
            <h4 className="text-sm font-medium text-gray-800 hover:text-red-600 cursor-pointer">
              {title}
            </h4>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{source}</span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* More Button */}
      <div className="mt-4 pt-3 border-t">
        <button className="w-full text-red-600 border border-red-200 rounded-md py-2 hover:bg-red-50 text-sm font-medium">
          {t('news.moreNews')}
        </button>
      </div>
    </SectionCard>
  )
}

export default NewsSection

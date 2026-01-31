import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Globe, BookOpen, Video, MessageCircle, Newspaper } from 'lucide-react'
import { SectionCard, TabGroup } from '../common'

const searchTabs = [
  { key: 'web', icon: Globe },
  { key: 'news', icon: Newspaper },
  { key: 'wiki', icon: BookOpen },
  { key: 'video', icon: Video },
  { key: 'aiChat', icon: MessageCircle },
]

// Dummy data - will be replaced with API
const quickSearches = {
  bn: ['আবহাওয়া', 'চাকরির খবর', 'শিক্ষা', 'স্বাস্থ্য', 'প্রযুক্তি', 'খেলাধুলা'],
  en: ['Weather', 'Job News', 'Education', 'Health', 'Technology', 'Sports'],
}

function SearchSection() {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('web')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = searchTabs.map(tab => ({
    key: tab.key,
    label: t(`search.${tab.key}`),
    icon: tab.icon,
  }))

  const searches = quickSearches[i18n.language] || quickSearches.bn

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    // TODO: Implement search functionality
    console.log('Search:', searchQuery, 'Tab:', activeTab)
  }

  return (
    <SectionCard
      title={t('sections.search')}
      icon={Search}
      iconColor="text-blue-600"
      colSpan={2}
    >
      {/* Search Tabs */}
      <div className="flex space-x-2 mb-4 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center space-x-1 py-2 px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          placeholder={t('search.searchWeb')}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md flex items-center justify-center transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      {/* Quick Searches */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">{t('search.popular')}:</h4>
        <div className="flex flex-wrap gap-2">
          {searches.map((item) => (
            <button
              key={item}
              onClick={() => setSearchQuery(item)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* External Search Links */}
      <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-xs">
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-start px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Globe className="h-3 w-3 mr-1" />
          {i18n.language === 'bn' ? 'গুগল সার্চ' : 'Google Search'}
        </a>
        <a
          href={`https://bn.wikipedia.org/wiki/${encodeURIComponent(searchQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-start px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <BookOpen className="h-3 w-3 mr-1" />
          {i18n.language === 'bn' ? 'উইকিপিডিয়া' : 'Wikipedia'}
        </a>
      </div>
    </SectionCard>
  )
}

export default SearchSection

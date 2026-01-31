import {
  TimeSection,
  WeatherSection,
  SearchSection,
  NewsSection,
  CurrencySection,
  RadioSection,
  VideosSection,
  NoticesSection,
  JobsSection,
  EducationSection,
  AIAssistantSection,
  MarketSection,
  // New widgets
  PrayerTimesSection,
  CricketSection,
  CommoditySection,
  EmergencySection,
  HolidaysSection,
  FeedbackNotice,
  AppDirectory,
} from '../components/sections'

function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Development Notice - Full Width */}
        <FeedbackNotice />

        {/* Time & Weather */}
        <TimeSection />
        <WeatherSection />
        
        {/* Search - spans 2 columns */}
        <SearchSection />

        {/* News & Currency */}
        <NewsSection />
        <CurrencySection />

        {/* Prayer Times & Radio */}
        <PrayerTimesSection />
        <RadioSection />

        {/* Videos - spans 2 columns */}
        <VideosSection />

        {/* Cricket & Commodities */}
        <CricketSection />
        <CommoditySection />

        {/* Notices - spans 2 columns */}
        <NoticesSection />

        {/* Jobs */}
        <JobsSection />

        {/* Education & Holidays */}
        <EducationSection />
        <HolidaysSection />

        {/* AI Assistant - spans 2 columns */}
        <AIAssistantSection />

        {/* Emergency & Market */}
        <EmergencySection />
        <MarketSection />

        {/* App Directory - Full Width */}
        <AppDirectory />
      </div>
    </main>
  )
}

export default HomePage

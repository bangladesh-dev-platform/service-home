import { useTranslation } from 'react-i18next'
import { Video, Play, Eye } from 'lucide-react'
import { SectionCard } from '../common'
import { YOUTUBE_URL } from '../../utils/constants'

// Dummy data - will be replaced with API from service-api
const videos = [
  {
    id: 1,
    title: 'বাংলাদেশের নতুন প্রযুক্তি পার্ক',
    titleEn: 'New Technology Park in Bangladesh',
    source: 'টেক নিউজ বিডি',
    sourceEn: 'Tech News BD',
    duration: '5:30',
    views: '12,500',
    thumb: 'https://via.placeholder.com/120x80/4ade80/ffffff?text=Tech',
  },
  {
    id: 2,
    title: 'ঢাকার ট্রাফিক সমস্যার সমাধান',
    titleEn: 'Solving Dhaka Traffic Problems',
    source: 'সিটি নিউজ',
    sourceEn: 'City News',
    duration: '3:15',
    views: '8,200',
    thumb: 'https://via.placeholder.com/120x80/3b82f6/ffffff?text=Traffic',
  },
  {
    id: 3,
    title: 'বাংলাদেশি খাবারের রেসিপি',
    titleEn: 'Bangladeshi Food Recipes',
    source: 'রান্নাঘর',
    sourceEn: 'Rannaghor',
    duration: '8:45',
    views: '25,800',
    thumb: 'https://via.placeholder.com/120x80/f59e0b/ffffff?text=Food',
  },
  {
    id: 4,
    title: 'ক্রিকেট ম্যাচের হাইলাইটস',
    titleEn: 'Cricket Match Highlights',
    source: 'স্পোর্টস টুডে',
    sourceEn: 'Sports Today',
    duration: '6:20',
    views: '45,600',
    thumb: 'https://via.placeholder.com/120x80/ef4444/ffffff?text=Sports',
  },
]

function VideosSection() {
  const { t, i18n } = useTranslation()
  const isBangla = i18n.language === 'bn'

  return (
    <SectionCard
      title={t('sections.videos')}
      icon={Video}
      iconColor="text-red-600"
      colSpan={2}
      moreLink={YOUTUBE_URL}
      moreLinkText={isBangla ? 'আরও ভিডিও দেখুন' : 'See More Videos'}
    >
      <div className="space-y-4">
        {videos.map((video) => (
          <a
            key={video.id}
            href={`${YOUTUBE_URL}/watch/${video.id}`}
            className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors group"
          >
            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <img
                src={video.thumb}
                alt={isBangla ? video.title : video.titleEn}
                className="w-20 h-14 object-cover rounded-md"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md group-hover:bg-black/50 transition-colors">
                <Play className="h-4 w-4 text-white" />
              </div>
              <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1 rounded">
                {video.duration}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors">
                {isBangla ? video.title : video.titleEn}
              </h4>
              <div className="text-xs text-gray-600">
                {isBangla ? video.source : video.sourceEn}
              </div>
              <div className="flex items-center text-xs text-gray-500 space-x-2">
                <span className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {video.views} {isBangla ? 'বার দেখা হয়েছে' : 'views'}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </SectionCard>
  )
}

export default VideosSection

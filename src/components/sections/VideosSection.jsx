import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Video, Play, Loader2, ExternalLink } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import { YOUTUBE_URL } from '../../utils/constants'
import api from '../../services/api'

function VideosSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.videos.feed({ limit: 4 })
        if (response.success && response.data.items) {
          setVideos(response.data.items)
        }
      } catch (err) {
        console.error('Videos fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // Format duration from seconds
  const formatDuration = (seconds) => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Build link to our youtube service
  const getVideoUrl = (video) => {
    // Link to youtube.banglade.sh/watch/UUID (not source_ref which is YouTube ID)
    return `${YOUTUBE_URL}/watch/${video.id}`
  }

  return (
    <SectionCard
      title={t('sections.videos')}
      icon={Video}
      iconColor="text-red-600"
      colSpan={2}
      headerRight={
        <a 
          href={YOUTUBE_URL} 
          className="text-red-600 text-sm flex items-center hover:text-red-700"
        >
          {isBangla ? 'আরও দেখুন' : 'See More'}
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-red-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <a
              key={video.id}
              href={getVideoUrl(video)}
              className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors group"
            >
              {/* Thumbnail */}
              <div className="relative flex-shrink-0">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-24 h-16 object-cover rounded-md bg-gray-200"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/120x80/ef4444/ffffff?text=Video'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md group-hover:bg-black/50 transition-colors">
                  <Play className="h-5 w-5 text-white" />
                </div>
                {video.duration_seconds && (
                  <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1 rounded">
                    {formatDuration(video.duration_seconds)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {video.title}
                </h4>
                <div className="text-xs text-gray-600 mt-1">
                  {video.channel_name}
                </div>
                {video.description && (
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {video.description}
                  </div>
                )}
              </div>
            </a>
          ))}

          {videos.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-500 text-sm">
              {isBangla ? 'কোনো ভিডিও পাওয়া যায়নি' : 'No videos found'}
            </div>
          )}

          {/* More Videos Link */}
          {videos.length > 0 && (
            <div className="mt-4 pt-3 border-t">
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center text-sm font-medium text-red-600 border border-red-200 rounded-md py-2 hover:bg-red-50 transition-colors"
              >
                {isBangla ? 'আরও ভিডিও দেখুন' : 'More Videos'}
                <ExternalLink className="h-3 w-3 inline ml-1" />
              </a>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  )
}

export default VideosSection

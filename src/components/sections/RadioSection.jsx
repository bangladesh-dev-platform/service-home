import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio as RadioIcon, Play, Pause, Music, Volume2, VolumeX, Loader2, ExternalLink } from 'lucide-react'
import { SectionCard } from '../common'
import { useLanguage } from '../../context/LanguageContext'
import api from '../../services/api'

function RadioSection() {
  const { t } = useTranslation()
  const { isBangla } = useLanguage()
  const [stations, setStations] = useState([])
  const [activeStation, setActiveStation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await api.portal.radio()
        if (response.success && response.data.stations) {
          setStations(response.data.stations)
          setActiveStation(response.data.stations[0])
        }
      } catch (err) {
        console.error('Radio fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStations()
  }, [])

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = volume

      audioRef.current.addEventListener('playing', () => {
        setIsBuffering(false)
        setIsPlaying(true)
        setError(null)
      })

      audioRef.current.addEventListener('waiting', () => {
        setIsBuffering(true)
      })

      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false)
        setIsBuffering(false)
      })

      audioRef.current.addEventListener('error', (e) => {
        setIsPlaying(false)
        setIsBuffering(false)
        setError('Stream unavailable')
        console.error('Audio error:', e)
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handlePlay = async () => {
    if (!activeStation?.stream_url) {
      setError('No stream URL')
      return
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      try {
        setIsBuffering(true)
        setError(null)
        audioRef.current.src = activeStation.stream_url
        await audioRef.current.play()
      } catch (err) {
        setIsBuffering(false)
        setError('Failed to play')
        console.error('Play error:', err)
      }
    }
  }

  const selectStation = (station) => {
    const wasPlaying = isPlaying
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setActiveStation(station)
    setIsPlaying(false)
    setError(null)
    
    // Auto-play when selecting a new station if previously playing
    if (wasPlaying && station.stream_url) {
      setTimeout(() => {
        setIsBuffering(true)
        audioRef.current.src = station.stream_url
        audioRef.current.play().catch(err => {
          setIsBuffering(false)
          setError('Failed to play')
          console.error('Auto-play error:', err)
        })
      }, 100)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <SectionCard
      title={t('sections.radio')}
      icon={RadioIcon}
      iconColor="text-purple-600"
      headerRight={
        <button 
          onClick={toggleMute}
          className="text-gray-500 hover:text-purple-600 transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          {/* Now Playing */}
          {activeStation && (
            <div className="text-center mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              {/* Station Logo */}
              {activeStation.logo && (
                <div className="mb-2">
                  <img 
                    src={activeStation.logo} 
                    alt={activeStation.name_en}
                    className="h-12 w-12 rounded-full mx-auto object-cover bg-white shadow-sm"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}
              <div className="text-lg font-semibold text-gray-800">
                {isBangla ? activeStation.name : activeStation.name_en || activeStation.name}
              </div>
              <div className="text-sm text-gray-600">{activeStation.frequency}</div>
              <div className="text-xs text-gray-500 mt-1">
                {isBangla ? activeStation.genre : activeStation.genre_en || activeStation.genre}
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="text-xs text-red-500 mt-2">{error}</div>
              )}
              
              {/* Play Button */}
              <button
                onClick={handlePlay}
                disabled={!activeStation.stream_url || isBuffering}
                className={`mt-3 w-14 h-14 rounded-full flex items-center justify-center mx-auto transition-all ${
                  !activeStation.stream_url 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : isPlaying 
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isBuffering ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </button>
              
              {/* Playing Indicator */}
              {isPlaying && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="w-1 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                  <span className="w-1 h-4 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1 h-5 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                  <span className="w-1 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                </div>
              )}

              {/* Volume Slider */}
              {isPlaying && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <VolumeX className="h-3 w-3 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value))
                      setIsMuted(false)
                    }}
                    className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <Volume2 className="h-3 w-3 text-gray-400" />
                </div>
              )}

              {/* Website Link */}
              {activeStation.website && (
                <a
                  href={activeStation.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 mt-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  {isBangla ? 'ওয়েবসাইট' : 'Website'}
                </a>
              )}
            </div>
          )}

          {/* Station List */}
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-sm">
            {stations.map((station) => (
              <button
                key={station.id}
                onClick={() => selectStation(station)}
                className={`w-full text-left p-2 rounded-md transition-colors flex items-center gap-3 ${
                  station.id === activeStation?.id
                    ? 'bg-purple-100 text-purple-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {/* Station Logo Thumbnail */}
                {station.logo ? (
                  <img 
                    src={station.logo} 
                    alt=""
                    className="h-8 w-8 rounded-full object-cover bg-gray-100 flex-shrink-0"
                    onError={(e) => { 
                      e.target.onerror = null
                      e.target.src = ''
                      e.target.className = 'hidden'
                    }}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Music className="h-4 w-4 text-purple-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {isBangla ? station.name : station.name_en || station.name}
                  </div>
                  <div className="text-xs text-gray-500">{station.frequency}</div>
                </div>
                {station.id === activeStation?.id && isPlaying && (
                  <div className="flex gap-0.5">
                    <span className="w-0.5 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                    <span className="w-0.5 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-0.5 h-4 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </SectionCard>
  )
}

export default RadioSection

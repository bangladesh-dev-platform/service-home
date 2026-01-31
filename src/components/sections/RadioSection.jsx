import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio as RadioIcon, Play, Pause, Music, Volume2 } from 'lucide-react'
import { SectionCard } from '../common'

// Dummy data - will be replaced with API
const radioStations = [
  { id: 1, name: 'বেতার বাংলা', nameEn: 'Betar Bangla', freq: '100.0 FM', meta: 'সংবাদ ও সঙ্গীত', metaEn: 'News & Music' },
  { id: 2, name: 'রেডিও ফুর্তি', nameEn: 'Radio Foorti', freq: '98.4 FM', meta: 'সঙ্গীত', metaEn: 'Music' },
  { id: 3, name: 'এবিসি রেডিও', nameEn: 'ABC Radio', freq: '89.2 FM', meta: 'সাংবাদিকতা', metaEn: 'Journalism' },
  { id: 4, name: 'ঢাকা এফএম', nameEn: 'Dhaka FM', freq: '90.4 FM', meta: 'বিনোদন', metaEn: 'Entertainment' },
  { id: 5, name: 'রেডিও আজ', nameEn: 'Radio Aaj', freq: '103.8 FM', meta: 'টক শো', metaEn: 'Talk Show' },
]

function RadioSection() {
  const { t, i18n } = useTranslation()
  const [activeStation, setActiveStation] = useState(radioStations[0])
  const [isPlaying, setIsPlaying] = useState(false)

  const isBangla = i18n.language === 'bn'

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    // TODO: Implement actual audio streaming
  }

  const selectStation = (station) => {
    setActiveStation(station)
    setIsPlaying(false)
  }

  return (
    <SectionCard
      title={t('sections.radio')}
      icon={RadioIcon}
      iconColor="text-purple-600"
      headerRight={
        <button className="text-gray-500 hover:text-purple-600 transition-colors">
          <Volume2 className="h-4 w-4" />
        </button>
      }
    >
      {/* Now Playing */}
      <div className="text-center mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <div className="text-lg font-semibold text-gray-800">
          {isBangla ? activeStation.name : activeStation.nameEn}
        </div>
        <div className="text-sm text-gray-600">{activeStation.freq}</div>
        <div className="text-xs text-gray-500 mt-1">
          {isBangla ? activeStation.meta : activeStation.metaEn}
        </div>
        <button
          onClick={handlePlay}
          className="mt-3 bg-purple-600 hover:bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-colors"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </button>
      </div>

      {/* Station List */}
      <div className="space-y-2 max-h-32 overflow-y-auto pr-1 text-sm">
        {radioStations.map((station) => (
          <button
            key={station.id}
            onClick={() => selectStation(station)}
            className={`w-full text-left p-2 rounded-md transition-colors flex items-center justify-between ${
              station.id === activeStation.id
                ? 'bg-purple-100 text-purple-800'
                : 'hover:bg-gray-100'
            }`}
          >
            <div>
              <div className="font-medium">
                {isBangla ? station.name : station.nameEn}
              </div>
              <div className="text-xs text-gray-500">{station.freq}</div>
            </div>
            <Music className="h-4 w-4 text-gray-400" />
          </button>
        ))}
      </div>
    </SectionCard>
  )
}

export default RadioSection

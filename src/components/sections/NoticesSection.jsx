import { useTranslation } from 'react-i18next'
import { FileText, CalendarDays, CircleAlert, ExternalLink } from 'lucide-react'
import { SectionCard } from '../common'

// Dummy data - will be replaced with API
const notices = [
  {
    id: 1,
    title: 'সরকারি চাকরির নতুন বিজ্ঞপ্তি',
    titleEn: 'New Government Job Circular',
    office: 'জনপ্রশাসন মন্ত্রণালয়',
    officeEn: 'Ministry of Public Administration',
    date: '১২ জুলাই, ২০২৫',
    dateEn: 'July 12, 2025',
    tag: 'চাকরি',
    tagEn: 'Jobs',
  },
  {
    id: 2,
    title: 'শিক্ষা বৃত্তির আবেদন শুরু',
    titleEn: 'Education Scholarship Applications Open',
    office: 'শিক্ষা মন্ত্রণালয়',
    officeEn: 'Ministry of Education',
    date: '১০ জুলাই, ২০২৫',
    dateEn: 'July 10, 2025',
    tag: 'শিক্ষা',
    tagEn: 'Education',
  },
  {
    id: 3,
    title: 'নতুন ট্যাক্স পলিসি ঘোষণা',
    titleEn: 'New Tax Policy Announcement',
    office: 'অর্থ মন্ত্রণালয়',
    officeEn: 'Ministry of Finance',
    date: '৮ জুলাই, ২০২৫',
    dateEn: 'July 8, 2025',
    tag: 'নীতি',
    tagEn: 'Policy',
  },
  {
    id: 4,
    title: 'স্বাস্থ্য সেবা কর্মসূচি',
    titleEn: 'Health Service Program',
    office: 'স্বাস্থ্য মন্ত্রণালয়',
    officeEn: 'Ministry of Health',
    date: '৫ জুলাই, ২০২৫',
    dateEn: 'July 5, 2025',
    tag: 'স্বাস্থ্য',
    tagEn: 'Health',
  },
]

const events = [
  {
    id: 1,
    name: 'জাতীয় প্রযুক্তি দিবস',
    nameEn: 'National Technology Day',
    date: '১৫ জুলাই, ২০২৫',
    dateEn: 'July 15, 2025',
    place: 'ঢাকা',
    placeEn: 'Dhaka',
  },
  {
    id: 2,
    name: 'কৃষি মেলা ২০২৫',
    nameEn: 'Agriculture Fair 2025',
    date: '২০ জুলাই, ২০২৫',
    dateEn: 'July 20, 2025',
    place: 'চট্টগ্রাম',
    placeEn: 'Chittagong',
  },
]

function NoticesSection() {
  const { t, i18n } = useTranslation()
  const isBangla = i18n.language === 'bn'

  return (
    <SectionCard
      title={t('sections.notices')}
      icon={FileText}
      iconColor="text-blue-600"
      colSpan={2}
      headerRight={
        <button className="text-gray-500 hover:text-blue-600 transition-colors">
          <ExternalLink className="h-4 w-4" />
        </button>
      }
    >
      {/* Recent Notices */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <CircleAlert className="h-4 w-4 mr-1" />
          {isBangla ? 'সাম্প্রতিক নোটিশ' : 'Recent Notices'}
        </h4>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="border-l-4 border-blue-500 pl-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <h5 className="text-sm font-medium text-gray-800">
                {isBangla ? notice.title : notice.titleEn}
              </h5>
              <p className="text-xs text-gray-600 mt-1">
                {isBangla ? notice.office : notice.officeEn}
              </p>
              <div className="flex items-center mt-2 space-x-2 text-xs">
                <span className="text-gray-500 flex items-center">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  {isBangla ? notice.date : notice.dateEn}
                </span>
                <span className="px-2 py-1 rounded-full text-red-600 bg-red-100">
                  {isBangla ? notice.tag : notice.tagEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <CalendarDays className="h-4 w-4 mr-1" />
          {isBangla ? 'আসন্ন ইভেন্ট' : 'Upcoming Events'}
        </h4>
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-blue-50 p-3 rounded-lg text-sm hover:bg-blue-100 cursor-pointer transition-colors"
            >
              <h5 className="font-medium text-blue-800">
                {isBangla ? event.name : event.nameEn}
              </h5>
              <div className="flex items-center justify-between mt-1 text-xs text-blue-600">
                <span>{isBangla ? event.date : event.dateEn}</span>
                <span>{isBangla ? event.place : event.placeEn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

export default NoticesSection

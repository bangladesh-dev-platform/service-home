import { useTranslation } from 'react-i18next'
import { BookOpen, GraduationCap, FileText, Award } from 'lucide-react'
import { SectionCard } from '../common'

// Dummy data - will be replaced with API
const highlights = [
  {
    id: 1,
    tag: 'টিপস',
    tagEn: 'Tips',
    title: 'এইচএসসি পরীক্ষার প্রস্তুতি',
    titleEn: 'HSC Exam Preparation',
    desc: 'কার্যকর অধ্যয়ন পদ্ধতি',
    descEn: 'Effective study methods',
    tone: 'text-blue-600 bg-blue-100',
    icon: GraduationCap,
  },
  {
    id: 2,
    tag: 'উপকরণ',
    tagEn: 'Resources',
    title: 'গণিত সমাধান গাইড',
    titleEn: 'Math Solution Guide',
    desc: 'ক্লাস ৯-১০ এর জন্য',
    descEn: 'For Class 9-10',
    tone: 'text-green-600 bg-green-100',
    icon: FileText,
  },
  {
    id: 3,
    tag: 'বৃত্তি',
    tagEn: 'Scholarship',
    title: 'মেধা বৃত্তি ২০২৫',
    titleEn: 'Merit Scholarship 2025',
    desc: 'আবেদনের শেষ তারিখ',
    descEn: 'Application deadline',
    tone: 'text-yellow-600 bg-yellow-100',
    icon: Award,
  },
]

const exams = [
  {
    id: 1,
    name: 'এইচএসসি',
    nameEn: 'HSC',
    date: '১৫ আগস্ট',
    dateEn: 'Aug 15',
    status: 'আসন্ন',
    statusEn: 'Upcoming',
    tone: 'bg-red-100 text-red-600',
  },
  {
    id: 2,
    name: 'এসএসসি',
    nameEn: 'SSC',
    date: '১০ সেপ্টেম্বর',
    dateEn: 'Sep 10',
    status: 'নিবন্ধন',
    statusEn: 'Registration',
    tone: 'bg-blue-100 text-blue-600',
  },
  {
    id: 3,
    name: 'জেএসসি',
    nameEn: 'JSC',
    date: '২৫ অক্টোবর',
    dateEn: 'Oct 25',
    status: 'প্রস্তুতি',
    statusEn: 'Preparation',
    tone: 'bg-green-100 text-green-600',
  },
]

function EducationSection() {
  const { t, i18n } = useTranslation()
  const isBangla = i18n.language === 'bn'

  return (
    <SectionCard
      title={t('sections.education')}
      icon={BookOpen}
      iconColor="text-purple-600"
    >
      {/* Highlights */}
      <div className="space-y-3 mb-4">
        {highlights.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <div className={`p-2 rounded-lg ${item.tone}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  {isBangla ? item.tag : item.tagEn}
                </span>
                <h4 className="text-sm font-medium text-gray-800 mt-1">
                  {isBangla ? item.title : item.titleEn}
                </h4>
                <p className="text-xs text-gray-600">
                  {isBangla ? item.desc : item.descEn}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Exam Schedule */}
      <div className="border-t pt-4 space-y-2 text-xs">
        <h4 className="text-sm font-semibold text-gray-700">
          {isBangla ? 'পরীক্ষার সময়সূচি' : 'Exam Schedule'}
        </h4>
        {exams.map((exam) => (
          <div key={exam.id} className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800">
                {isBangla ? exam.name : exam.nameEn}
              </span>
              <span className="text-gray-500 ml-2">
                {isBangla ? exam.date : exam.dateEn}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full ${exam.tone}`}>
              {isBangla ? exam.status : exam.statusEn}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
        <button className="p-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors">
          {isBangla ? 'অনলাইন কোর্স' : 'Online Courses'}
        </button>
        <button className="p-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors">
          {isBangla ? 'বই ডাউনলোড' : 'Download Books'}
        </button>
      </div>
    </SectionCard>
  )
}

export default EducationSection

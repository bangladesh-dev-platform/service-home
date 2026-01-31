import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react'
import { SectionCard, TabGroup } from '../common'

// Dummy data - will be replaced with API
const jobs = [
  {
    id: 1,
    title: 'সহকারী শিক্ষক',
    titleEn: 'Assistant Teacher',
    org: 'প্রাথমিক শিক্ষা অধিদপ্তর',
    orgEn: 'Directorate of Primary Education',
    location: 'ঢাকা',
    locationEn: 'Dhaka',
    salary: '৳২৫,০০০-৪০,০০০',
    salaryEn: '৳25,000-40,000',
    deadline: '২০ জুলাই',
    deadlineEn: 'July 20',
    type: 'government',
  },
  {
    id: 2,
    title: 'জুনিয়র অফিসার',
    titleEn: 'Junior Officer',
    org: 'বাংলাদেশ ব্যাংক',
    orgEn: 'Bangladesh Bank',
    location: 'সারাদেশ',
    locationEn: 'Nationwide',
    salary: '৳৩০,০০০-৫০,০০০',
    salaryEn: '৳30,000-50,000',
    deadline: '২৫ জুলাই',
    deadlineEn: 'July 25',
    type: 'government',
  },
  {
    id: 3,
    title: 'সফটওয়্যার ইঞ্জিনিয়ার',
    titleEn: 'Software Engineer',
    org: 'গ্রামীণফোন',
    orgEn: 'Grameenphone',
    location: 'ঢাকা',
    locationEn: 'Dhaka',
    salary: '৳৮০,০০০-১,২০,০০০',
    salaryEn: '৳80,000-120,000',
    deadline: '৩০ জুলাই',
    deadlineEn: 'July 30',
    type: 'private',
  },
  {
    id: 4,
    title: 'মার্কেটিং এক্সিকিউটিভ',
    titleEn: 'Marketing Executive',
    org: 'স্কয়ার গ্রুপ',
    orgEn: 'Square Group',
    location: 'ঢাকা',
    locationEn: 'Dhaka',
    salary: '৳৩৫,০০০-৫০,০০০',
    salaryEn: '৳35,000-50,000',
    deadline: '২২ জুলাই',
    deadlineEn: 'July 22',
    type: 'private',
  },
]

function JobsSection() {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('government')
  const isBangla = i18n.language === 'bn'

  const tabs = [
    { key: 'government', label: t('jobs.government') },
    { key: 'private', label: t('jobs.private') },
  ]

  const filteredJobs = jobs.filter((job) => job.type === activeTab)

  return (
    <SectionCard
      title={t('sections.jobs')}
      icon={Briefcase}
      iconColor="text-indigo-600"
      moreLink="/jobs"
      moreLinkText={t('jobs.moreJobs')}
    >
      {/* Tabs */}
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      {/* Job List */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="border border-gray-200 rounded-lg p-3 hover:shadow-md cursor-pointer transition-shadow text-sm"
          >
            <h4 className="font-semibold text-gray-800 mb-1">
              {isBangla ? job.title : job.titleEn}
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              {isBangla ? job.org : job.orgEn}
            </p>
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {isBangla ? job.location : job.locationEn}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                {isBangla ? job.salary : job.salaryEn}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {t('jobs.deadline')}: {isBangla ? job.deadline : job.deadlineEn}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default JobsSection

import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { 
  Mail, MessageSquare, PenTool, ShoppingBag, Train, 
  Landmark, BookOpen, Tv, Gamepad2, Calculator,
  Newspaper, Music, Cloud, Map, Heart, Briefcase,
  Home, Car, GraduationCap, Smartphone, CreditCard,
  Globe, Clock, Star, Users, FileText, Camera,
  Mic, Radio, Phone, Shield, Plane, UtensilsCrossed,
  Sparkles, ChevronRight, Lock, Droplet, Stethoscope,
  DollarSign, HelpCircle, Library, Archive, UserPlus,
  HandHeart, Search, Scale, AlertTriangle, MapPin,
  Baby, Wheat, Fish, Truck, Building, Ticket,
  Receipt, Banknote, HeartPulse, Brain, Video,
  Headphones, ChefHat, Compass, Languages, Type,
  Ruler, QrCode, Lightbulb, Flag, Moon, Utensils,
  Store, Gavel, TreePine, Umbrella, ChevronDown
} from 'lucide-react'

// App configuration with categories
const APPS = [
  // ===== TIER 1: HIGH IMPACT (Recommended) =====
  { 
    id: 'bloodbank', 
    name: 'Blood Bank', 
    name_bn: 'রক্তদান', 
    icon: Droplet, 
    color: 'bg-red-600',
    description: 'Find donors',
    description_bn: 'রক্তদাতা খুঁজুন',
    category: 'health',
    status: 'coming',
    priority: 1,
  },
  { 
    id: 'doctors', 
    name: 'Doctors', 
    name_bn: 'ডাক্তার', 
    icon: Stethoscope, 
    color: 'bg-teal-500',
    description: 'Find specialists',
    description_bn: 'বিশেষজ্ঞ খুঁজুন',
    category: 'health',
    status: 'coming',
    priority: 1,
  },
  { 
    id: 'remittance', 
    name: 'Remittance', 
    name_bn: 'রেমিট্যান্স', 
    icon: DollarSign, 
    color: 'bg-green-600',
    description: 'Compare rates',
    description_bn: 'রেট তুলনা',
    category: 'finance',
    status: 'coming',
    priority: 1,
  },
  { 
    id: 'askbd', 
    name: 'Ask BD', 
    name_bn: 'জিজ্ঞাসা', 
    icon: HelpCircle, 
    color: 'bg-orange-500',
    description: 'Q&A Forum',
    description_bn: 'প্রশ্নোত্তর',
    category: 'community',
    status: 'coming',
    priority: 1,
  },
  { 
    id: 'library', 
    name: 'Library', 
    name_bn: 'লাইব্রেরি', 
    icon: Library, 
    color: 'bg-amber-700',
    description: 'Free books',
    description_bn: 'বিনামূল্যে বই',
    category: 'education',
    status: 'coming',
    priority: 1,
  },

  // ===== TIER 2: COMMUNITY BUILDING =====
  { 
    id: 'diaspora', 
    name: 'Diaspora', 
    name_bn: 'প্রবাসী', 
    icon: Globe, 
    color: 'bg-blue-600',
    description: 'Connect abroad',
    description_bn: 'প্রবাসে সংযোগ',
    category: 'community',
    status: 'coming',
    priority: 2,
  },
  { 
    id: 'volunteer', 
    name: 'Volunteer', 
    name_bn: 'স্বেচ্ছাসেবক', 
    icon: HandHeart, 
    color: 'bg-pink-500',
    description: 'Help others',
    description_bn: 'সেবা করুন',
    category: 'community',
    status: 'coming',
    priority: 2,
  },
  { 
    id: 'lostfound', 
    name: 'Lost & Found', 
    name_bn: 'হারানো-পাওয়া', 
    icon: Search, 
    color: 'bg-yellow-500',
    description: 'Find lost items',
    description_bn: 'হারানো জিনিস',
    category: 'community',
    status: 'coming',
    priority: 2,
  },
  { 
    id: 'alumni', 
    name: 'Alumni', 
    name_bn: 'প্রাক্তন শিক্ষার্থী', 
    icon: UserPlus, 
    color: 'bg-indigo-500',
    description: 'School networks',
    description_bn: 'স্কুল নেটওয়ার্ক',
    category: 'community',
    status: 'coming',
    priority: 2,
  },

  // ===== TIER 3: CIVIC EMPOWERMENT =====
  { 
    id: 'complaints', 
    name: 'Complaints', 
    name_bn: 'অভিযোগ', 
    icon: Scale, 
    color: 'bg-slate-600',
    description: 'Report issues',
    description_bn: 'অভিযোগ করুন',
    category: 'government',
    status: 'coming',
    priority: 3,
  },
  { 
    id: 'scamalerts', 
    name: 'Scam Alerts', 
    name_bn: 'প্রতারণা সতর্কতা', 
    icon: AlertTriangle, 
    color: 'bg-red-500',
    description: 'Stay safe',
    description_bn: 'সাবধান থাকুন',
    category: 'utilities',
    status: 'coming',
    priority: 3,
  },
  { 
    id: 'landrecords', 
    name: 'Land Records', 
    name_bn: 'ভূমি রেকর্ড', 
    icon: MapPin, 
    color: 'bg-emerald-600',
    description: 'Check ownership',
    description_bn: 'মালিকানা যাচাই',
    category: 'government',
    status: 'coming',
    priority: 3,
  },
  { 
    id: 'archive', 
    name: 'Archive', 
    name_bn: 'সংগ্রহশালা', 
    icon: Archive, 
    color: 'bg-stone-600',
    description: 'BD history',
    description_bn: 'ইতিহাস সংরক্ষণ',
    category: 'education',
    status: 'coming',
    priority: 3,
  },

  // ===== EXISTING APPS =====
  // Communication
  { 
    id: 'mail', 
    name: 'Mail', 
    name_bn: 'মেইল', 
    icon: Mail, 
    color: 'bg-blue-500',
    description: 'Email service',
    description_bn: 'ইমেইল সেবা',
    category: 'communication',
    status: 'coming',
  },
  { 
    id: 'blog', 
    name: 'Blog', 
    name_bn: 'ব্লগ', 
    icon: PenTool, 
    color: 'bg-orange-600',
    description: 'Write & share',
    description_bn: 'লিখুন ও শেয়ার করুন',
    category: 'communication',
    status: 'coming',
  },
  { 
    id: 'forum', 
    name: 'Forum', 
    name_bn: 'ফোরাম', 
    icon: MessageSquare, 
    color: 'bg-purple-500',
    description: 'Discussions',
    description_bn: 'আলোচনা মঞ্চ',
    category: 'communication',
    status: 'coming',
  },

  // Services
  { 
    id: 'marketplace', 
    name: 'Marketplace', 
    name_bn: 'মার্কেটপ্লেস', 
    icon: ShoppingBag, 
    color: 'bg-green-500',
    description: 'Buy & sell',
    description_bn: 'কেনাবেচা',
    category: 'services',
    status: 'coming',
  },
  { 
    id: 'jobs', 
    name: 'Jobs', 
    name_bn: 'চাকরি', 
    icon: Briefcase, 
    color: 'bg-indigo-600',
    description: 'Find careers',
    description_bn: 'চাকরি খুঁজুন',
    category: 'services',
    status: 'live',
    url: '/jobs',
  },
  { 
    id: 'realestate', 
    name: 'Real Estate', 
    name_bn: 'বাড়ি-জমি', 
    icon: Home, 
    color: 'bg-amber-600',
    description: 'Properties',
    description_bn: 'সম্পত্তি',
    category: 'services',
    status: 'coming',
  },
  { 
    id: 'matrimony', 
    name: 'Matrimony', 
    name_bn: 'বিবাহ', 
    icon: Heart, 
    color: 'bg-rose-500',
    description: 'Find partner',
    description_bn: 'জীবনসঙ্গী',
    category: 'services',
    status: 'coming',
  },

  // Travel
  { 
    id: 'train', 
    name: 'Train', 
    name_bn: 'ট্রেন', 
    icon: Train, 
    color: 'bg-red-500',
    description: 'Railway tickets',
    description_bn: 'রেলের টিকিট',
    category: 'travel',
    status: 'coming',
  },
  { 
    id: 'flights', 
    name: 'Flights', 
    name_bn: 'ফ্লাইট', 
    icon: Plane, 
    color: 'bg-sky-500',
    description: 'Air tickets',
    description_bn: 'বিমান টিকিট',
    category: 'travel',
    status: 'coming',
  },
  { 
    id: 'maps', 
    name: 'Maps', 
    name_bn: 'ম্যাপ', 
    icon: Map, 
    color: 'bg-emerald-500',
    description: 'Navigation',
    description_bn: 'দিকনির্দেশনা',
    category: 'travel',
    status: 'coming',
  },

  // Government
  { 
    id: 'eservices', 
    name: 'e-Services', 
    name_bn: 'ই-সেবা', 
    icon: Landmark, 
    color: 'bg-teal-600',
    description: 'Govt services',
    description_bn: 'সরকারি সেবা',
    category: 'government',
    status: 'coming',
  },
  { 
    id: 'nid', 
    name: 'NID', 
    name_bn: 'এনআইডি', 
    icon: CreditCard, 
    color: 'bg-slate-700',
    description: 'National ID',
    description_bn: 'জাতীয় পরিচয়পত্র',
    category: 'government',
    status: 'coming',
  },

  // Education
  { 
    id: 'dictionary', 
    name: 'Dictionary', 
    name_bn: 'অভিধান', 
    icon: BookOpen, 
    color: 'bg-cyan-600',
    description: 'Bangla-English',
    description_bn: 'বাংলা-ইংরেজি',
    category: 'education',
    status: 'coming',
  },
  { 
    id: 'education', 
    name: 'Education', 
    name_bn: 'শিক্ষা', 
    icon: GraduationCap, 
    color: 'bg-violet-500',
    description: 'Learning',
    description_bn: 'শিক্ষা সম্পদ',
    category: 'education',
    status: 'live',
    url: '/education',
  },

  // Entertainment
  { 
    id: 'tv', 
    name: 'Live TV', 
    name_bn: 'লাইভ টিভি', 
    icon: Tv, 
    color: 'bg-rose-600',
    description: 'BD channels',
    description_bn: 'বাংলাদেশি চ্যানেল',
    category: 'entertainment',
    status: 'coming',
  },
  { 
    id: 'music', 
    name: 'Music', 
    name_bn: 'গান', 
    icon: Music, 
    color: 'bg-pink-500',
    description: 'Bangla songs',
    description_bn: 'বাংলা গান',
    category: 'entertainment',
    status: 'coming',
  },
  { 
    id: 'games', 
    name: 'Games', 
    name_bn: 'গেমস', 
    icon: Gamepad2, 
    color: 'bg-fuchsia-500',
    description: 'Play online',
    description_bn: 'অনলাইন গেম',
    category: 'entertainment',
    status: 'coming',
  },
  { 
    id: 'radio', 
    name: 'Radio', 
    name_bn: 'রেডিও', 
    icon: Radio, 
    color: 'bg-yellow-500',
    description: 'FM stations',
    description_bn: 'এফএম স্টেশন',
    category: 'entertainment',
    status: 'live',
    url: '/#radio',
  },

  // Finance
  { 
    id: 'bkash', 
    name: 'Mobile Banking', 
    name_bn: 'মোবাইল ব্যাংকিং', 
    icon: Smartphone, 
    color: 'bg-pink-600',
    description: 'bKash, Nagad',
    description_bn: 'বিকাশ, নগদ',
    category: 'finance',
    status: 'coming',
  },
  { 
    id: 'stock', 
    name: 'Stock Market', 
    name_bn: 'শেয়ার বাজার', 
    icon: Calculator, 
    color: 'bg-lime-600',
    description: 'DSE, CSE',
    description_bn: 'ডিএসই, সিএসই',
    category: 'finance',
    status: 'coming',
  },

  // Utilities (Live)
  { 
    id: 'weather', 
    name: 'Weather', 
    name_bn: 'আবহাওয়া', 
    icon: Cloud, 
    color: 'bg-blue-400',
    description: '64 districts',
    description_bn: '৬৪ জেলা',
    category: 'utilities',
    status: 'live',
    url: '/weather',
  },
  { 
    id: 'news', 
    name: 'News', 
    name_bn: 'সংবাদ', 
    icon: Newspaper, 
    color: 'bg-red-600',
    description: 'Latest news',
    description_bn: 'সর্বশেষ খবর',
    category: 'utilities',
    status: 'live',
    url: '/news',
  },
]

// Future apps that may be added (shown at bottom)
const FUTURE_APPS = [
  // Health & Wellness
  { name: 'Medicine Prices', name_bn: 'ওষুধের দাম', icon: Receipt, category: 'Health' },
  { name: 'Hospital Beds', name_bn: 'হাসপাতাল বেড', icon: Building, category: 'Health' },
  { name: 'Mental Health', name_bn: 'মানসিক স্বাস্থ্য', icon: Brain, category: 'Health' },
  { name: 'Telemedicine', name_bn: 'টেলিমেডিসিন', icon: Video, category: 'Health' },
  
  // Government & Civic
  { name: 'Birth Certificate', name_bn: 'জন্ম সনদ', icon: FileText, category: 'Government' },
  { name: 'Passport Tracker', name_bn: 'পাসপোর্ট ট্র্যাকার', icon: CreditCard, category: 'Government' },
  { name: 'Court Case', name_bn: 'মামলা ট্র্যাকার', icon: Gavel, category: 'Government' },
  { name: 'Visa Info', name_bn: 'ভিসা তথ্য', icon: Plane, category: 'Government' },
  { name: 'Tax Calculator', name_bn: 'কর ক্যালকুলেটর', icon: Calculator, category: 'Government' },
  
  // Finance
  { name: 'Zakat Calculator', name_bn: 'যাকাত ক্যালকুলেটর', icon: Moon, category: 'Finance' },
  { name: 'Microfinance', name_bn: 'মাইক্রোফাইন্যান্স', icon: Banknote, category: 'Finance' },
  { name: 'Business Registry', name_bn: 'ব্যবসা রেজিস্ট্রি', icon: Building, category: 'Finance' },
  
  // Agriculture
  { name: 'Crop Prices', name_bn: 'ফসলের দাম', icon: Wheat, category: 'Agriculture' },
  { name: 'Weather Alerts', name_bn: 'আবহাওয়া সতর্কতা', icon: Umbrella, category: 'Agriculture' },
  { name: 'Farming Tips', name_bn: 'কৃষি টিপস', icon: TreePine, category: 'Agriculture' },
  { name: 'Fisheries', name_bn: 'মৎস্য', icon: Fish, category: 'Agriculture' },
  
  // Education
  { name: 'Admission Portal', name_bn: 'ভর্তি পোর্টাল', icon: GraduationCap, category: 'Education' },
  { name: 'Scholarship Finder', name_bn: 'বৃত্তি খোঁজা', icon: Star, category: 'Education' },
  { name: 'Tutor Finder', name_bn: 'টিউটর খোঁজা', icon: Users, category: 'Education' },
  { name: 'Exam Results', name_bn: 'পরীক্ষার ফলাফল', icon: FileText, category: 'Education' },
  { name: 'Study Groups', name_bn: 'স্টাডি গ্রুপ', icon: Users, category: 'Education' },
  { name: 'Audiobooks', name_bn: 'অডিওবুক', icon: Headphones, category: 'Education' },
  
  // Safety & Emergency
  { name: 'Women Safety', name_bn: 'নারী নিরাপত্তা', icon: Shield, category: 'Safety' },
  { name: 'Disaster Alerts', name_bn: 'দুর্যোগ সতর্কতা', icon: AlertTriangle, category: 'Safety' },
  { name: 'Traffic Updates', name_bn: 'ট্রাফিক আপডেট', icon: Car, category: 'Safety' },
  { name: 'Crime Map', name_bn: 'অপরাধ মানচিত্র', icon: Map, category: 'Safety' },
  
  // Culture & Entertainment
  { name: 'Event Calendar', name_bn: 'ইভেন্ট ক্যালেন্ডার', icon: Ticket, category: 'Entertainment' },
  { name: 'Movie Times', name_bn: 'সিনেমা সময়', icon: Video, category: 'Entertainment' },
  { name: 'Sports Leagues', name_bn: 'স্পোর্টস লিগ', icon: Flag, category: 'Entertainment' },
  { name: 'Bangla Lyrics', name_bn: 'গানের কথা', icon: Music, category: 'Entertainment' },
  { name: 'Recipe Book', name_bn: 'রেসিপি বই', icon: ChefHat, category: 'Entertainment' },
  { name: 'Travel Guide', name_bn: 'ভ্রমণ গাইড', icon: Compass, category: 'Entertainment' },
  { name: 'Podcasts', name_bn: 'পডকাস্ট', icon: Mic, category: 'Entertainment' },
  
  // Utilities & Tools
  { name: 'Bangla OCR', name_bn: 'বাংলা ওসিআর', icon: Type, category: 'Utilities' },
  { name: 'Voice Typing', name_bn: 'ভয়েস টাইপিং', icon: Mic, category: 'Utilities' },
  { name: 'Unit Converter', name_bn: 'এককের রূপান্তর', icon: Ruler, category: 'Utilities' },
  { name: 'Age Calculator', name_bn: 'বয়স ক্যালকুলেটর', icon: Calculator, category: 'Utilities' },
  { name: 'QR Scanner', name_bn: 'কিউআর স্ক্যানার', icon: QrCode, category: 'Utilities' },
  { name: 'Electricity Bill', name_bn: 'বিদ্যুৎ বিল', icon: Lightbulb, category: 'Utilities' },
  { name: 'Translator', name_bn: 'অনুবাদক', icon: Languages, category: 'Utilities' },
  
  // Diaspora Specific
  { name: 'Embassy Finder', name_bn: 'দূতাবাস খোঁজা', icon: Flag, category: 'Diaspora' },
  { name: 'Halal Finder', name_bn: 'হালাল খোঁজা', icon: Utensils, category: 'Diaspora' },
  { name: 'BD Stores Abroad', name_bn: 'প্রবাসে বিডি দোকান', icon: Store, category: 'Diaspora' },
  { name: 'Immigration Help', name_bn: 'ইমিগ্রেশন সহায়তা', icon: Scale, category: 'Diaspora' },
]

const CATEGORIES = [
  { key: 'all', name: 'All', name_bn: 'সব' },
  { key: 'health', name: 'Health', name_bn: 'স্বাস্থ্য' },
  { key: 'community', name: 'Community', name_bn: 'সম্প্রদায়' },
  { key: 'communication', name: 'Communication', name_bn: 'যোগাযোগ' },
  { key: 'services', name: 'Services', name_bn: 'সেবা' },
  { key: 'travel', name: 'Travel', name_bn: 'ভ্রমণ' },
  { key: 'government', name: 'Government', name_bn: 'সরকারি' },
  { key: 'education', name: 'Education', name_bn: 'শিক্ষা' },
  { key: 'entertainment', name: 'Entertainment', name_bn: 'বিনোদন' },
  { key: 'finance', name: 'Finance', name_bn: 'অর্থনীতি' },
  { key: 'utilities', name: 'Utilities', name_bn: 'ইউটিলিটি' },
]

function AppDirectory() {
  const { isBangla } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const [showFuture, setShowFuture] = useState(false)

  const filteredApps = activeCategory === 'all' 
    ? APPS 
    : APPS.filter(app => app.category === activeCategory)

  const displayApps = showAll ? filteredApps : filteredApps.slice(0, 16)

  const handleAppClick = (app) => {
    if (app.status === 'live' && app.url) {
      window.location.href = app.url
    }
  }

  // Group future apps by category
  const futureByCategory = FUTURE_APPS.reduce((acc, app) => {
    if (!acc[app.category]) acc[app.category] = []
    acc[app.category].push(app)
    return acc
  }, {})

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {isBangla ? 'অ্যাপ ডিরেক্টরি' : 'App Directory'}
                </h2>
                <p className="text-xs text-gray-500">
                  {isBangla ? 'বাংলাদেশের সব সেবা এক জায়গায়' : 'All Bangladesh services in one place'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                {APPS.filter(a => a.status === 'live').length} {isBangla ? 'লাইভ' : 'Live'}
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                <Sparkles className="w-3 h-3" />
                {APPS.filter(a => a.status === 'coming').length} {isBangla ? 'শীঘ্রই' : 'Coming'}
              </span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="p-3 border-b border-gray-100 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isBangla ? cat.name_bn : cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* App Grid */}
        <div className="p-4">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {displayApps.map((app) => {
              const Icon = app.icon
              const isLive = app.status === 'live'
              const isPriority = app.priority && app.priority <= 2
              
              return (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app)}
                  disabled={!isLive}
                  className={`group flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all ${
                    isLive 
                      ? 'hover:bg-gray-50 hover:shadow-md cursor-pointer' 
                      : 'opacity-80 cursor-not-allowed'
                  } ${isPriority && !isLive ? 'ring-2 ring-amber-200 ring-offset-1' : ''}`}
                >
                  {/* Icon */}
                  <div className={`relative w-10 h-10 sm:w-12 sm:h-12 ${app.color} rounded-xl flex items-center justify-center mb-1.5 ${
                    isLive ? 'group-hover:scale-110 transition-transform' : ''
                  }`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    {!isLive && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-amber-400 rounded-full flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      </div>
                    )}
                    {isLive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  {/* Name */}
                  <span className={`text-[10px] sm:text-xs font-medium text-center line-clamp-1 ${
                    isLive ? 'text-gray-800' : 'text-gray-600'
                  }`}>
                    {isBangla ? app.name_bn : app.name}
                  </span>
                  
                  {/* Status */}
                  <span className={`text-[9px] sm:text-[10px] mt-0.5 ${
                    isLive ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {isLive 
                      ? (isBangla ? 'লাইভ' : 'Live')
                      : (isBangla ? 'শীঘ্রই' : 'Soon')
                    }
                  </span>
                </button>
              )
            })}
          </div>

          {/* Show More */}
          {filteredApps.length > 16 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {showAll 
                  ? (isBangla ? 'কম দেখুন' : 'Show less')
                  : (isBangla ? `আরও ${filteredApps.length - 16}টি দেখুন` : `Show ${filteredApps.length - 16} more`)
                }
                <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Future Apps Section */}
        <div className="border-t border-gray-100">
          <button
            onClick={() => setShowFuture(!showFuture)}
            className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">
                  {isBangla ? 'ভবিষ্যত পরিকল্পনা' : 'Future Roadmap'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isBangla 
                    ? `${FUTURE_APPS.length}+ অ্যাপ আসছে শীঘ্রই`
                    : `${FUTURE_APPS.length}+ apps coming soon`}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showFuture ? 'rotate-180' : ''}`} />
          </button>

          {showFuture && (
            <div className="p-4 bg-gradient-to-b from-amber-50/50 to-white">
              <div className="space-y-4">
                {Object.entries(futureByCategory).map(([category, apps]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full" />
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {apps.map((app, idx) => {
                        const Icon = app.icon
                        return (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600"
                          >
                            <Icon className="w-3.5 h-3.5 text-gray-400" />
                            {isBangla ? app.name_bn : app.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 text-center">
                  {isBangla 
                    ? '💡 আপনার পছন্দের অ্যাপ কি এখানে নেই? WhatsApp এ জানান!'
                    : '💡 Don\'t see your favorite app? Let us know on WhatsApp!'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            {isBangla 
              ? '🇧🇩 বাংলাদেশের জন্য, বাংলাদেশীদের দ্বারা'
              : '🇧🇩 For Bangladesh, by Bangladeshis'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AppDirectory

import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { 
  MessageCircle, Construction, Heart, X, 
  Sparkles, Send, Coffee, Star
} from 'lucide-react'

function FeedbackNotice() {
  const { isBangla } = useLanguage()
  const [dismissed, setDismissed] = useState(false)

  const whatsappNumber = '+18658969016'
  const whatsappMessage = encodeURIComponent(
    isBangla 
      ? 'হ্যালো! আমি banglade.sh সম্পর্কে মতামত দিতে চাই...' 
      : 'Hello! I have feedback about banglade.sh...'
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  if (dismissed) return null

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-lg">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
          title={isBangla ? 'বন্ধ করুন' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Construction className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-300 text-sm font-medium">
                  {isBangla ? 'বেটা সংস্করণ' : 'Beta Version'}
                </span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {isBangla 
                  ? 'সাইটটি এখনও উন্নয়নাধীন!' 
                  : 'This site is still under development!'}
              </h3>
              
              <p className="text-white/90 text-sm md:text-base mb-4 max-w-2xl">
                {isBangla 
                  ? 'আমরা প্রতিদিন নতুন ফিচার যোগ করছি। আপনার মূল্যবান মতামত ও পরামর্শ আমাদের জন্য অত্যন্ত গুরুত্বপূর্ণ। অনুগ্রহ করে আপনার ভাবনা শেয়ার করুন!'
                  : 'We are adding new features every day. Your valuable comments and suggestions are extremely important to us. Please share your thoughts!'}
              </p>

              {/* Features coming soon */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {[
                  isBangla ? 'ট্রেন সময়সূচি' : 'Train Schedules',
                  isBangla ? 'এআই সহকারী' : 'AI Assistant', 
                  isBangla ? 'লাইভ ক্রিকেট' : 'Live Cricket',
                  isBangla ? 'আরও অনেক কিছু' : 'Much more',
                ].map((feature, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs text-white"
                  >
                    <Star className="w-3 h-3 text-yellow-300" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="flex-shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800 text-sm">
                    {isBangla ? 'মতামত দিন' : 'Send Feedback'}
                  </div>
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <Send className="w-3 h-3" />
                    WhatsApp
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Bottom message */}
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-center gap-2 text-white/80 text-sm">
            <Coffee className="w-4 h-4" />
            <span>
              {isBangla 
                ? 'ভালোবাসা সহকারে বাংলাদেশের জন্য তৈরি' 
                : 'Built with love for Bangladesh'}
            </span>
            <Heart className="w-4 h-4 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackNotice

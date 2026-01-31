import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-300">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Banglade.sh</h3>
            <p>{t('footer.description')}</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('footer.services')}</h4>
            <ul className="space-y-2">
              <li><Link to="/news" className="hover:text-white">{t('nav.news')}</Link></li>
              <li><Link to="/weather" className="hover:text-white">{t('nav.weather')}</Link></li>
              <li><Link to="/jobs" className="hover:text-white">{t('nav.jobs')}</Link></li>
              <li><Link to="/education" className="hover:text-white">{t('nav.education')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-white">{t('footer.contact')}</Link></li>
              <li><Link to="/privacy" className="hover:text-white">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-white">{t('footer.terms')}</Link></li>
              <li><Link to="/help" className="hover:text-white">{t('footer.help')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('footer.contact')}</h4>
            <p>Email: info@banglade.sh</p>
            <p>Phone: +880 1700 000000</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}

export default Footer

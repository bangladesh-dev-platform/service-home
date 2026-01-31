import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Reusable section card wrapper
 */
function SectionCard({ 
  title, 
  icon: Icon, 
  iconColor = 'text-green-600',
  children, 
  headerRight,
  moreLink,
  moreLinkText,
  className = '',
  colSpan = 1,
}) {
  const colSpanClass = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
  }[colSpan] || 'lg:col-span-1'

  return (
    <div className={`${colSpanClass} ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            {Icon && <Icon className={`h-5 w-5 mr-2 ${iconColor}`} />}
            {title}
          </h3>
          {headerRight}
          {moreLink && !headerRight && (
            <Link to={moreLink} className="text-sm text-gray-500 hover:text-gray-700">
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Content */}
        {children}

        {/* More Link Button */}
        {moreLinkText && moreLink && (
          <div className="mt-4 pt-3 border-t">
            <Link
              to={moreLink}
              className="w-full block text-center text-sm font-medium text-green-600 border border-green-200 rounded-md py-2 hover:bg-green-50"
            >
              {moreLinkText}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionCard

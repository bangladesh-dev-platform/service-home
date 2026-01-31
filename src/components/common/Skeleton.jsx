/**
 * Loading skeleton components
 */

export function SkeletonLine({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg h-32 mb-4" />
      <SkeletonText lines={2} />
    </div>
  )
}

export function SkeletonSection({ className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 animate-pulse ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-5 h-5 bg-gray-200 rounded" />
        <div className="h-5 bg-gray-200 rounded w-24" />
      </div>
      {/* Content */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  )
}

export function SkeletonSectionWide({ className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 animate-pulse lg:col-span-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-5 h-5 bg-gray-200 rounded" />
        <div className="h-5 bg-gray-200 rounded w-32" />
      </div>
      {/* Content */}
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded w-full" />
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-16" />
          <div className="h-8 bg-gray-200 rounded w-16" />
          <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSectionWide />
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSectionWide />
        <SkeletonSectionWide />
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSectionWide />
      </div>
    </main>
  )
}

export function SkeletonAvatar({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }
  return (
    <div className={`animate-pulse bg-gray-200 rounded-full ${sizeClasses[size]} ${className}`} />
  )
}

function Skeleton({ type = 'line', ...props }) {
  switch (type) {
    case 'text':
      return <SkeletonText {...props} />
    case 'card':
      return <SkeletonCard {...props} />
    case 'avatar':
      return <SkeletonAvatar {...props} />
    case 'section':
      return <SkeletonSection {...props} />
    case 'sectionWide':
      return <SkeletonSectionWide {...props} />
    case 'homepage':
      return <HomePageSkeleton {...props} />
    default:
      return <SkeletonLine {...props} />
  }
}

export default Skeleton

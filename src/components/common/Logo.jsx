import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

// Logo sizes
const SIZES = {
  sm: { icon: 32, text: 'text-lg' },
  md: { icon: 40, text: 'text-xl' },
  lg: { icon: 48, text: 'text-2xl' },
  xl: { icon: 56, text: 'text-3xl' },
}

function Logo({ size = 'md', showText = true, linkTo = '/', className = '' }) {
  const { isBangla } = useLanguage()
  const { icon: iconSize, text: textSize } = SIZES[size] || SIZES.md

  const LogoIcon = () => (
    <div 
      className="relative flex-shrink-0"
      style={{ width: iconSize, height: iconSize }}
    >
      {/* Main circle - Bangladesh green */}
      <div 
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-600 to-green-700 shadow-lg"
        style={{ 
          boxShadow: '0 4px 14px rgba(0, 106, 78, 0.4)'
        }}
      />
      
      {/* Red circle - Bangladesh flag */}
      <div 
        className="absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full"
        style={{
          width: iconSize * 0.55,
          height: iconSize * 0.55,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)'
        }}
      />
      
      {/* B letter */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingTop: iconSize * 0.05 }}
      >
        <span 
          className="font-black text-white"
          style={{ 
            fontSize: iconSize * 0.45,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}
        >
          B
        </span>
      </div>
      
      {/* Shine effect */}
      <div 
        className="absolute top-1 left-1 w-3 h-3 bg-white/20 rounded-full blur-sm"
        style={{
          width: iconSize * 0.15,
          height: iconSize * 0.15,
        }}
      />
    </div>
  )

  const LogoText = () => (
    <div className="flex flex-col">
      <span className={`font-extrabold ${textSize} leading-none tracking-tight`}>
        <span className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
          Bangla
        </span>
        <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
          de.sh
        </span>
      </span>
      <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
        {isBangla ? 'বাংলাদেশ পোর্টাল' : 'Bangladesh Portal'}
      </span>
    </div>
  )

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon />
      {showText && <LogoText />}
    </div>
  )

  if (linkTo) {
    return (
      <Link to={linkTo} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}

// Minimal version for favicon/small spaces
export function LogoMark({ size = 32, className = '' }) {
  return (
    <div 
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-600 to-green-700 shadow-md" />
      <div 
        className="absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: size * 0.05 }}>
        <span 
          className="font-black text-white"
          style={{ fontSize: size * 0.4 }}
        >
          B
        </span>
      </div>
    </div>
  )
}

// Animated version for loading states
export function LogoAnimated({ size = 48 }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className="relative animate-pulse"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-600 to-green-700" />
        <div 
          className="absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full animate-ping"
          style={{
            width: size * 0.4,
            height: size * 0.4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            animationDuration: '1.5s',
          }}
        />
        <div 
          className="absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full"
          style={{
            width: size * 0.5,
            height: size * 0.5,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: size * 0.05 }}>
          <span className="font-black text-white" style={{ fontSize: size * 0.4 }}>B</span>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-600 animate-pulse">
        Loading...
      </span>
    </div>
  )
}

export default Logo

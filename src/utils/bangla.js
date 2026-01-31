/**
 * Bangla/Bengali number and date utilities
 */

const banglaDigits = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
}

/**
 * Convert English digits to Bangla digits
 * @param {string|number} value - Value to convert
 * @returns {string} Value with Bangla digits
 */
export const toBanglaDigits = (value) =>
  value
    .toString()
    .split('')
    .map((char) => banglaDigits[char] ?? char)
    .join('')

/**
 * Format time in Bangla with AM/PM
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
export const formatBanglaTime = (date) => {
  const formatted = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  const [timePart, suffix] = formatted.split(' ')
  const banglaTime = timePart
    .split(':')
    .map((segment) => toBanglaDigits(segment))
    .join(':')
  return `${banglaTime} ${suffix}`
}

/**
 * Format date in Bangla
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatBanglaDate = (date) => {
  return date.toLocaleDateString('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format currency in Bangla Taka
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatTaka = (amount) => {
  return `৳${toBanglaDigits(amount.toLocaleString())}`
}

// ============ Bangla Calendar (বঙ্গাব্দ) ============

const BANGLA_MONTHS = [
  { name: 'বৈশাখ', nameEn: 'Boishakh', days: 31 },
  { name: 'জ্যৈষ্ঠ', nameEn: 'Jyoishtho', days: 31 },
  { name: 'আষাঢ়', nameEn: 'Asharh', days: 31 },
  { name: 'শ্রাবণ', nameEn: 'Shrabon', days: 31 },
  { name: 'ভাদ্র', nameEn: 'Bhadro', days: 31 },
  { name: 'আশ্বিন', nameEn: 'Ashwin', days: 30 },
  { name: 'কার্তিক', nameEn: 'Kartik', days: 30 },
  { name: 'অগ্রহায়ণ', nameEn: 'Ogrohayon', days: 30 },
  { name: 'পৌষ', nameEn: 'Poush', days: 30 },
  { name: 'মাঘ', nameEn: 'Magh', days: 30 },
  { name: 'ফাল্গুন', nameEn: 'Falgun', days: 30 },
  { name: 'চৈত্র', nameEn: 'Choitro', days: 30 },
]

const BANGLA_SEASONS = [
  { name: 'গ্রীষ্ম', nameEn: 'Summer', months: [0, 1] },      // Boishakh, Jyoishtho
  { name: 'বর্ষা', nameEn: 'Monsoon', months: [2, 3] },      // Asharh, Shrabon
  { name: 'শরৎ', nameEn: 'Autumn', months: [4, 5] },         // Bhadro, Ashwin
  { name: 'হেমন্ত', nameEn: 'Late Autumn', months: [6, 7] }, // Kartik, Ogrohayon
  { name: 'শীত', nameEn: 'Winter', months: [8, 9] },         // Poush, Magh
  { name: 'বসন্ত', nameEn: 'Spring', months: [10, 11] },     // Falgun, Choitro
]

/**
 * Convert Gregorian date to Bangla calendar date
 * Based on the Bengali calendar reform of 1987 (BS 1394)
 * Bangla New Year (Pohela Boishakh) = April 14
 * 
 * @param {Date} date - Gregorian date
 * @returns {Object} Bangla date object
 */
export const toBanglaDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() // 0-11
  const day = date.getDate()

  // Bangla year starts on April 14
  // If before April 14, we're in the previous Bangla year
  let banglaYear = year - 593 // Approximate conversion

  // Calculate days from April 14
  const april14 = new Date(year, 3, 14) // April 14 of current year
  
  let dayOfBanglaYear
  if (date >= april14) {
    // We're in the current Bangla year (which started this April)
    dayOfBanglaYear = Math.floor((date - april14) / (1000 * 60 * 60 * 24))
  } else {
    // We're in the previous Bangla year (which started last April)
    banglaYear -= 1
    const lastApril14 = new Date(year - 1, 3, 14)
    dayOfBanglaYear = Math.floor((date - lastApril14) / (1000 * 60 * 60 * 24))
  }

  // Find the Bangla month and day
  let banglaMonth = 0
  let banglaDay = dayOfBanglaYear + 1 // +1 because day 0 is 1st Boishakh

  for (let i = 0; i < BANGLA_MONTHS.length; i++) {
    if (banglaDay <= BANGLA_MONTHS[i].days) {
      banglaMonth = i
      break
    }
    banglaDay -= BANGLA_MONTHS[i].days
  }

  // Find the season
  const season = BANGLA_SEASONS.find(s => s.months.includes(banglaMonth))

  return {
    year: banglaYear,
    month: banglaMonth,
    day: banglaDay,
    monthName: BANGLA_MONTHS[banglaMonth].name,
    monthNameEn: BANGLA_MONTHS[banglaMonth].nameEn,
    season: season?.name || '',
    seasonEn: season?.nameEn || '',
  }
}

/**
 * Format Bangla calendar date as string
 * @param {Date} date - Gregorian date
 * @param {boolean} isBangla - Use Bangla script
 * @returns {string} Formatted Bangla date
 */
export const formatBanglaCalendar = (date, isBangla = true) => {
  const bd = toBanglaDate(date)
  
  if (isBangla) {
    return `${toBanglaDigits(bd.day)} ${bd.monthName}, ${toBanglaDigits(bd.year)} বঙ্গাব্দ`
  }
  return `${bd.day} ${bd.monthNameEn}, ${bd.year} BS`
}

/**
 * Get current Bangla season
 * @param {Date} date - Gregorian date
 * @param {boolean} isBangla - Use Bangla script
 * @returns {string} Season name
 */
export const getBanglaSeason = (date, isBangla = true) => {
  const bd = toBanglaDate(date)
  return isBangla ? bd.season : bd.seasonEn
}

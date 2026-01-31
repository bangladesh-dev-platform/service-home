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

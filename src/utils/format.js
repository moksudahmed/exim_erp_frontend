// src/utils/format.js

/**
 * Formats currency values
 * @param {number} value - The amount to format
 * @param {string} currency - Currency symbol (default: '$')
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency2 = (value, currency = '$', decimals = 2) => {
  if (isNaN(value)) return `${currency}0.00`;
  return `${currency}${value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};
// Example usage in formatCurrency function
export const formatCurrency = (value, currency = '$', decimals = 2, raw = false) => {
  if (isNaN(value)) return raw ? '0.00' : `${currency}0.00`;
  
  const formatted = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return raw ? formatted : `${currency}${formatted}`;
};
/**
 * Formats date strings
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale (default: 'en-US')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US', options = { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
}) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(locale, options);
};

/**
 * Formats large numbers with suffixes (K, M, B)
 * @param {number} num - Number to format
 * @param {number} digits - Decimal places (default: 1)
 * @returns {string} Formatted number string
 */
export const formatNumber = (num, digits = 1) => {
  if (num < 1000) return num.toString();
  const units = ['K', 'M', 'B', 'T'];
  const exp = Math.floor(Math.log10(num) / 3);
  return (num / Math.pow(1000, exp)).toFixed(digits) + units[exp - 1];
};

export default {
  formatCurrency,
  formatDate,
  formatNumber
};
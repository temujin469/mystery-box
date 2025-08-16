import moment from 'moment';

// Configure moment locale for Mongolian if needed
moment.locale('en'); // Using English for now, can be changed to 'mn' if Mongolian locale is added

/**
 * @param date - Date string, Date object, or moment instance
 * @param format - Optional format string, defaults to 'YYYY-MM-DD HH:mm'
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | moment.Moment | null | undefined, format = 'YYYY-MM-DD HH:mm'): string {
  if (!date) return '—';
  
  try {
    return moment(date).format(format);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return String(date);
  }
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 * @param date - Date string, Date object, or moment instance
 * @returns Relative time string
 */
export function formatRelativeDate(date: string | Date | moment.Moment | null | undefined): string {
  if (!date) return '—';
  
  try {
    return moment(date).fromNow();
  } catch (error) {
    console.warn('Relative date formatting error:', error);
    return String(date);
  }
}

/**
 * Format date for display with better readability
 * @param date - Date string, Date object, or moment instance
 * @returns Formatted date like "Jan 15, 2024 at 2:30 PM"
 */
export function formatDisplayDate(date: string | Date | moment.Moment | null | undefined): string {
  if (!date) return '—';
  
  try {
    return moment(date).format('MMM DD, YYYY [at] h:mm A');
  } catch (error) {
    console.warn('Display date formatting error:', error);
    return String(date);
  }
}

/**
 * Check if date is valid
 * @param date - Date string, Date object, or moment instance
 * @returns Boolean indicating if date is valid
 */
export function isValidDate(date: string | Date | moment.Moment | null | undefined): boolean {
  if (!date) return false;
  return moment(date).isValid();
}

/**
 * Get date range label
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range
 */
export function formatDateRange(
  startDate: string | Date | moment.Moment | null | undefined,
  endDate: string | Date | moment.Moment | null | undefined
): string {
  if (!startDate && !endDate) return '—';
  if (!startDate) return `Until ${formatDate(endDate)}`;
  if (!endDate) return `From ${formatDate(startDate)}`;
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: string | Date | moment.Moment | null | undefined): boolean {
  if (!date) return false;
  return moment(date).isBefore(moment());
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: string | Date | moment.Moment | null | undefined): boolean {
  if (!date) return false;
  return moment(date).isAfter(moment());
}

/**
 * Get status based on date availability
 */
export function getAvailabilityStatus(
  availableFrom: string | Date | moment.Moment | null | undefined,
  availableTo: string | Date | moment.Moment | null | undefined
): 'available' | 'not-started' | 'expired' | 'always' {
  const now = moment();
  
  if (!availableFrom && !availableTo) return 'always';
  
  if (availableFrom && now.isBefore(moment(availableFrom))) {
    return 'not-started';
  }
  
  if (availableTo && now.isAfter(moment(availableTo))) {
    return 'expired';
  }
  
  return 'available';
}

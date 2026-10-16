/**
 * Format numbers as Uzbek so'm currency with space separators (e.g. "799 000 so'm")
 */
export function formatSom(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "0 so'm";
  }
  const parts = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${parts} so'm`;
}

/**
 * Format ISO date string into readable Uzbek date format
 */
export function formatUzbekDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate().toString().padStart(2, '0');
    const months = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}, ${year} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
}

/**
 * Short date formatter for admin dashboard
 */
export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateString;
  }
}

// Timezone utility functions for Jakarta time (UTC+7)

export function convertToJakartaTime(isoString: string | null | undefined): string {
  if (!isoString || isoString === 'null' || isoString === 'undefined') {
    return 'N/A';
  }
  
  try {
    const date = new Date(isoString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', isoString);
      return 'Invalid Date';
    }
    
    // Format as readable Jakarta time using timeZone option
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    };
    
    return new Intl.DateTimeFormat('id-ID', options).format(date) + ' WIB';
  } catch (error) {
    console.error('Error converting timezone for value:', isoString, error);
    return 'Invalid Date';
  }
}

export function formatJakartaDate(isoString: string | null | undefined): string {
  if (!isoString || isoString === 'null' || isoString === 'undefined') {
    return 'N/A';
  }
  
  try {
    const date = new Date(isoString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', isoString);
      return 'Invalid Date';
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    };
    
    return new Intl.DateTimeFormat('id-ID', options).format(date) + ' WIB';
  } catch (error) {
    console.error('Error formatting Jakarta date for value:', isoString, error);
    return 'Invalid Date';
  }
}

export function getJakartaTimestamp(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }) + ' WIB';
}

export function getCurrentJakartaISO(): string {
  const now = new Date();
  const jakartaOffset = 7 * 60; // Jakarta is UTC+7
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const jakarta = new Date(utc + (jakartaOffset * 60000));
  return jakarta.toISOString().replace('Z', '+07:00');
}

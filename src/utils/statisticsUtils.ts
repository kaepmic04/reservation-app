import type { Booking } from '../types/index.js';

export type TimeRange = '30days' | '6months' | '1year';

interface BookingStats {
  labels: string[];
  data: number[];
}

export function getBookingStats(bookings: Booking[], range: TimeRange): BookingStats {
  const now = new Date();
  const stats: BookingStats = { labels: [], data: [] };
  
  switch (range) {
    case '30days': {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        stats.labels.push(dateStr);
        stats.data.push(bookings.filter(b => b.date === dateStr).length);
      }
      break;
    }
    
    case '6months': {
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        stats.labels.push(monthStr);
        stats.data.push(bookings.filter(b => {
          const bookingDate = new Date(b.date);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        }).length);
      }
      break;
    }
    
    case '1year': {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        stats.labels.push(monthStr);
        stats.data.push(bookings.filter(b => {
          const bookingDate = new Date(b.date);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        }).length);
      }
      break;
    }
  }
  
  return stats;
}
import React from 'react';
import { getAvailableSeats } from '../../utils/bookingUtils';
import { formatDate } from '../../utils/dateUtils';
import { generateTimeSlots } from '../../utils/timeUtils';
import type { Table, Booking } from '../../types';

interface DayViewProps {
  date: Date;
  tables: Table[];
  bookings: Booking[];
}

export function DayView({ date, tables, bookings }: DayViewProps) {
  const totalSeats = tables.reduce((sum, table) => sum + table.seats, 0);
  const isToday = formatDate(date) === formatDate(new Date());
  const timeSlots = generateTimeSlots(date);
  
  return (
    <div className={`min-w-[120px] ${isToday ? 'bg-blue-50' : ''}`}>
      <div className="p-2 text-center border-b">
        <div className="font-medium">{date.toLocaleDateString('de-DE', { weekday: 'short' })}</div>
        <div className="text-sm text-gray-500">{formatDate(date)}</div>
      </div>
      <div className="divide-y">
        {timeSlots.map(time => {
          const available = getAvailableSeats(tables, bookings, formatDate(date), time);
          const occupancyRate = (totalSeats - available) / totalSeats;
          
          let bgColor = 'bg-green-100';
          let textColor = 'text-green-800';
          
          if (occupancyRate > 0.8) {
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
          } else if (occupancyRate > 0.5) {
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
          }

          return (
            <div
              key={time}
              className={`p-3 ${bgColor} transition-colors hover:opacity-90 cursor-default`}
              title={`${available} von ${totalSeats} Plätzen verfügbar`}
            >
              <div className="font-medium text-center">{time}</div>
              <div className={`text-sm text-center mt-1 ${textColor} font-medium`}>
                {available}/{totalSeats}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
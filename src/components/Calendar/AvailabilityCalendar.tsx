import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayView } from './DayView';
import { getWeekDates, formatDate } from '../../utils/dateUtils';
import type { Table, Booking } from '../../types';

interface AvailabilityCalendarProps {
  tables: Table[];
  bookings: Booking[];
}

export function AvailabilityCalendar({ tables, bookings }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekDates = getWeekDates(currentDate);

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <button
          onClick={previousWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Vorherige Woche"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {weekDates[0].toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={nextWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Nächste Woche"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 divide-x border-t">
        {weekDates.map((date) => (
          <DayView
            key={date.toISOString()}
            date={date}
            tables={tables}
            bookings={bookings}
          />
        ))}
      </div>

      <div className="p-3 bg-gray-50 border-t">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-100 mr-2"></div>
            <span>Viele freie Plätze</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-100 mr-2"></div>
            <span>Teilweise belegt</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-100 mr-2"></div>
            <span>Fast ausgebucht</span>
          </div>
        </div>
      </div>
    </div>
  );
}
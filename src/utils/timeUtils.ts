import { loadSettings } from './storage.js';
import type { DaySchedule, RestaurantSettings } from '../types/index.js';

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export function getDaySchedule(date: Date): DaySchedule | null {
  const settings = loadSettings();
  const dayName = WEEKDAYS[date.getDay()];
  return settings.schedule[dayName];
}

export function generateTimeSlots(input: Date | boolean): string[] {
  if (typeof input === 'boolean') {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      if (input) {
        slots.push(`${hourStr}:00`);
      } else {
        slots.push(`${hourStr}:00`);
        slots.push(`${hourStr}:30`);
      }
    }
    return slots;
  }

  const schedule = getDaySchedule(input);
  if (!schedule || !schedule.isOpen) return [];

  const slots: string[] = [];
  const [startHour, startMinute] = schedule.openingTime.split(':').map(Number);
  const [endHour, endMinute] = schedule.closingTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
    slots.push(
      `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    );
    
    currentMinute += 30;
    if (currentMinute >= 60) {
      currentHour++;
      currentMinute = 0;
    }
  }
  
  return slots;
}

export function isValidTime(date: Date, time: string): boolean {
  const timeSlots = generateTimeSlots(date);
  return timeSlots.includes(time);
}

export function formatDayName(day: keyof RestaurantSettings['schedule']): string {
  const dayNames: Record<typeof day, string> = {
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',
  };
  return dayNames[day];
}
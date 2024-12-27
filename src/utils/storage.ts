import type { Table, Booking, RestaurantSettings, DaySchedule } from '../types/index.js';

const STORAGE_KEYS = {
  TABLES: 'restaurant_tables',
  BOOKINGS: 'restaurant_bookings',
  SETTINGS: 'restaurant_settings',
} as const;

const DEFAULT_DAY_SCHEDULE: DaySchedule = {
  isOpen: true,
  openingTime: '08:00',
  closingTime: '22:00',
};

const DEFAULT_SETTINGS: RestaurantSettings = {
  schedule: {
    monday: { ...DEFAULT_DAY_SCHEDULE },
    tuesday: { ...DEFAULT_DAY_SCHEDULE },
    wednesday: { ...DEFAULT_DAY_SCHEDULE },
    thursday: { ...DEFAULT_DAY_SCHEDULE },
    friday: { ...DEFAULT_DAY_SCHEDULE },
    saturday: { ...DEFAULT_DAY_SCHEDULE },
    sunday: { ...DEFAULT_DAY_SCHEDULE, isOpen: false },
  },
};

export function loadTables(): Table[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TABLES);
  return stored ? JSON.parse(stored) : [];
}

export function saveTables(tables: Table[]): void {
  localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
}

export function loadBookings(): Booking[] {
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return stored ? JSON.parse(stored) : [];
}

export function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

export function loadSettings(): RestaurantSettings {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
}

export function saveSettings(settings: RestaurantSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
export interface Booking {
  id: string;
  tableId: string;
  date: string;
  time: string;
  guests: number;
  customerName: string;
}

export interface TableGroup {
  name: string;
  seats: number;
  count: number;
}

export interface Table {
  id: string;
  seats: number;
  name: string;
  groupId: string;
  combinableWith?: string[];
}

export interface TableCombination {
  tableIds: string[];
  totalSeats: number;
}

export interface DaySchedule {
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
}

export interface RestaurantSettings {
  schedule: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
}
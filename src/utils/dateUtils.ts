export function getWeekDates(date: Date): Date[] {
  const current = new Date(date);
  const week = [];
  
  // Get Monday
  current.setDate(current.getDate() - current.getDay() + 1);
  
  // Get whole week
  for (let i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return week;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
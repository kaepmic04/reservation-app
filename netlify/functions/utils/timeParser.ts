export function parseTime(input: string): string | null {
  // Entfernt "um" und "uhr" und normalisiert Zeitformat
  const cleaned = input.toLowerCase()
    .replace(/(um|uhr)\s*/g, '')
    .trim();
  
  // Unterstützt Formate wie "14:30", "14.30", "halb 3", "viertel nach 2"
  const timeRegex = /^(\d{1,2})[:\.](\d{2})$/;
  const match = cleaned.match(timeRegex);
  
  if (match) {
    const [_, hours, minutes] = match;
    return `${hours.padStart(2, '0')}:${minutes}`;
  }
  
  return null;
}
export function parseNumber(input) {
  // Konvertiert Zahlwörter in Ziffern
  const numberWords = {
    'einen': 1, 'eine': 1, 'ein': 1,
    'zwei': 2, 'drei': 3, 'vier': 4, 'fünf': 5,
    'sechs': 6, 'sieben': 7, 'acht': 8, 'neun': 9, 'zehn': 10
  };
  
  const cleaned = input.toLowerCase().trim();
  
  // Prüft auf Zahlwörter
  for (const [word, num] of Object.entries(numberWords)) {
    if (cleaned.includes(word)) return num;
  }
  
  // Prüft auf numerische Zahlen
  const match = cleaned.match(/\d+/);
  if (match) return parseInt(match[0]);
  
  return null;
}
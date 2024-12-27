export function parseDate(input) {
  // Entfernt Wörter wie "am" oder "den" und normalisiert Datumsformat
  const cleaned = input.toLowerCase()
    .replace(/(am|den)\s+/g, '')
    .replace(/(\d+)\.?\s+(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)/g, '$1.$2');
  
  try {
    const date = new Date(cleaned);
    if (isNaN(date.getTime())) return null;
    
    // Format: YYYY-MM-DD
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
}
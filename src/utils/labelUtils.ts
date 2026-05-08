export function formatLocaleLabel(value: unknown, lang = 'en'): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    // Prefer requested language, then English, then first string value
    try {
      const v = value as Record<string, any>;
      if (typeof v[lang] === 'string') return v[lang];
      if (typeof v.en === 'string') return v.en;
      // Return first string child
      for (const k of Object.keys(v)) {
        if (typeof v[k] === 'string') return v[k];
      }
      return JSON.stringify(v);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

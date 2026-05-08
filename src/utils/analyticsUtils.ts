export function getNested<T = unknown>(source: Record<string, any> | null | undefined, ...keys: string[]): T | undefined {
  if (!source) return undefined;
  for (const key of keys) {
    if (source[key] !== undefined) return source[key] as T;
  }
  return undefined;
}

export function getNumber(source: Record<string, any> | null | undefined, ...keys: string[]): number {
  const v = getNested<any>(source, ...keys);
  if (v === undefined || v === null) return 0;
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

export function getString(source: Record<string, any> | null | undefined, ...keys: string[]): string {
  const v = getNested<any>(source, ...keys);
  if (v === undefined || v === null) return '';
  return String(v);
}

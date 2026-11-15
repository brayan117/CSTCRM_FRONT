export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // almacenamiento no disponible
  }
}

export function nextId(prefix: string, ids: string[]): string {
  const numbers = ids
    .map((id) => Number(id.replace(prefix, '')))
    .filter((n) => Number.isFinite(n));
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

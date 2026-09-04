export function readSessionDraft<T extends object>(
  key: string,
  initial: T,
  fields: readonly (keyof T)[],
): Partial<T> | null {
  try {
    const stored = window.sessionStorage.getItem(key);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

    const draft: Partial<T> = {};
    for (const field of fields) {
      const value = (parsed as Record<keyof T, unknown>)[field];
      if (typeof value === typeof initial[field]) draft[field] = value as T[keyof T];
    }
    return Object.keys(draft).length > 0 ? draft : null;
  } catch {
    return null;
  }
}

export function writeSessionDraft<T extends object>(
  key: string,
  value: T,
  fields: readonly (keyof T)[],
) {
  try {
    const draft: Partial<T> = {};
    for (const field of fields) draft[field] = value[field];
    window.sessionStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Draft persistence is optional; the form remains usable without storage.
  }
}

export function clearSessionDraft(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // The submitted or discarded form is already cleared in memory.
  }
}

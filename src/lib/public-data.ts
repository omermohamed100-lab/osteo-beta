/**
 * Keeps public pages available when their optional CMS data cannot be reached.
 * Admin and API routes intentionally continue to report database failures.
 */
export async function withPublicDataFallback<T>(
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

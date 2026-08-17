/**
 * Keeps public pages available when their optional CMS data cannot be reached.
 * Admin and API routes intentionally continue to report database failures.
 */
export type PublicDataResult<T> = {
  data: T;
  unavailable: boolean;
};

/**
 * Returns public data together with its availability so pages can distinguish
 * an empty collection from a database outage.
 */
export async function getPublicData<T>(
  query: () => Promise<T>,
  fallback: T,
): Promise<PublicDataResult<T>> {
  try {
    return { data: await query(), unavailable: false };
  } catch {
    return { data: fallback, unavailable: true };
  }
}

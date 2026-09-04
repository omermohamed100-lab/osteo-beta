export type DirectoryFilters = {
  city: string;
  specialty: string;
  country: string;
  name: string;
};

const FILTER_KEYS = ['city', 'specialty', 'country', 'name'] as const;

export function directoryFiltersFromParams(
  params: Pick<URLSearchParams, 'get'>,
): DirectoryFilters {
  return {
    city: params.get('city') ?? '',
    specialty: params.get('specialty') ?? '',
    country: params.get('country') ?? '',
    name: params.get('name') ?? '',
  };
}

export function directoryHref(
  pathname: string,
  currentParams: string,
  filters: DirectoryFilters,
) {
  const params = new URLSearchParams(currentParams);
  for (const key of FILTER_KEYS) {
    const value = filters[key].trim();
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

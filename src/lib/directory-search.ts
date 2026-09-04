export type DirectoryLocationProfile = {
  city: string;
  cityAr?: string;
  location?: string;
  locationAr?: string;
  directoryCities?: string[];
  directoryCitiesAr?: string[];
};

export type DirectoryLocation = {
  city: string;
  cityAr?: string;
};

const includesQuery = (value: string | undefined, query: string) =>
  value?.toLocaleLowerCase().includes(query) ?? false;

export function getPracticeLocations(
  profile: DirectoryLocationProfile,
  query = '',
): DirectoryLocation[] {
  const cities = profile.directoryCities?.length
    ? profile.directoryCities
    : [profile.city];
  const locations = cities.map((city, index) => ({
    city,
    cityAr: profile.directoryCitiesAr?.[index] || profile.cityAr,
  }));
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) return locations;

  const matchingLocations = locations.filter(({ city, cityAr }) =>
    includesQuery(city, normalizedQuery) || includesQuery(cityAr, normalizedQuery),
  );
  if (matchingLocations.length > 0) return matchingLocations;

  return [profile.location, profile.locationAr].some((location) =>
    includesQuery(location, normalizedQuery),
  )
    ? locations
    : [];
}

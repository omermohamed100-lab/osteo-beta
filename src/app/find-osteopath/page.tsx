import FindOsteopathDirectory from '@/components/directory/FindOsteopathDirectory';
import { getPublicOsteopaths } from '@/lib/public-osteopath';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function FindOsteopathPage({ searchParams }: { searchParams: SearchParams }) {
  const { data, unavailable } = await getPublicOsteopaths();
  const params = await searchParams;
  const value = (key: string) => {
    const candidate = params[key];
    return typeof candidate === 'string' ? candidate : '';
  };

  return (
    <FindOsteopathDirectory
      initialOsteopaths={data}
      initialDataUnavailable={unavailable}
      initialFilters={{
        city: value('city'),
        specialty: value('specialty'),
        country: value('country'),
        name: value('name'),
      }}
    />
  );
}

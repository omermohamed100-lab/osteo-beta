import FindOsteopathDirectory from '@/components/directory/FindOsteopathDirectory';
import { getPublicOsteopaths } from '@/lib/public-osteopath';

export const dynamic = 'force-dynamic';

export default async function FindOsteopathPage() {
  const { data, unavailable } = await getPublicOsteopaths();

  return (
    <FindOsteopathDirectory
      initialOsteopaths={data}
      initialDataUnavailable={unavailable}
    />
  );
}

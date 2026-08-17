const LOCAL_SITE_URL = 'http://localhost:3000';

function normalizeSiteUrl(value: string): URL | null {
  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`);
    url.pathname = '/';
    url.search = '';
    url.hash = '';
    return url;
  } catch {
    return null;
  }
}

export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const vercelDeploymentUrl = process.env.VERCEL_URL?.trim();
  const candidate = configured || vercelProductionUrl || vercelDeploymentUrl;

  return (candidate && normalizeSiteUrl(candidate)) || new URL(LOCAL_SITE_URL);
}

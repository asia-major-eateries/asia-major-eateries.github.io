export type ApiRatingLink = {
  provider: string;
  url: string;
  rating?: string | number | null;
  reviewCount?: number | null;
  observedAt?: string | null;
};

export type ApiLocation = {
  slug: string;
  name: string;
  city: string;
  region?: string | null;
  countryCode: string;
  status: string;
  timezone: string;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  phoneE164?: string | null;
  orderUrl?: string | null;
  reserveUrl?: string | null;
  menuUrl?: string | null;
  ratings?: ApiRatingLink[];
  hours?: Array<{ label: string; open: string; close: string; closed?: boolean }>;
};

export type AvailabilityItem = {
  id: string;
  section: string;
  name: string;
  description?: string | null;
  state: 'available' | 'limited' | 'sold-out' | 'unavailable' | 'unknown';
  currency: string;
  priceMinMinor: number;
  priceMaxMinor: number;
  observedAt: string;
  expiresAt?: string | null;
};

export type AvailabilityResponse = {
  locationSlug: string;
  menuName: string;
  observedAt: string;
  items: AvailabilityItem[];
};

function baseUrl(): string {
  return (import.meta.env.PUBLIC_AME_API_BASE_URL ?? '').replace(/\/$/, '');
}

async function getJson<T>(path: string): Promise<T | null> {
  const base = baseUrl();
  if (!base) return null;
  const response = await fetch(`${base}${path}`, {
    headers: { accept: 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) return null;
  return (await response.json()) as T;
}

export const fetchLocations = () => getJson<ApiLocation[]>('/v1/locations');
export const fetchLocation = (slug: string) => getJson<ApiLocation>(`/v1/locations/${encodeURIComponent(slug)}`);
export const fetchAvailability = (slug: string) => getJson<AvailabilityResponse>(`/v1/locations/${encodeURIComponent(slug)}/menu/availability`);

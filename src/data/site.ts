export type RatingLink = {
  provider: 'google' | 'yelp' | 'tripadvisor' | 'facebook' | 'other';
  url: string;
  rating?: number;
  reviewCount?: number;
  observedAt?: string;
};

export type BusinessHours = {
  label: string;
  open: string;
  close: string;
  closed?: boolean;
};

export type RestaurantLocation = {
  slug: string;
  name: string;
  concept?: string;
  city: string;
  region?: string;
  country: string;
  countryCode: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  timezone: string;
  currency: string;
  status: 'open' | 'coming-soon' | 'temporarily-closed' | 'closed';
  hours?: BusinessHours[];
  ratingLinks?: RatingLink[];
  orderUrl?: string;
  reserveUrl?: string;
  menuUrl?: string;
  image?: string;
  summary?: string;
};

export const site = {
  name: 'Asia Major Eateries',
  shortName: 'AME',
  url: 'https://asia-major-eateries.github.io',
  description: 'Asia Major Eateries is a restaurant group bringing together distinctive neighborhood restaurants with dependable hospitality and live, location-aware guest information.',
  apiBaseUrl: import.meta.env.PUBLIC_AME_API_BASE_URL ?? '',
} as const;

// Only verified business/location data belongs here. Runtime API results can augment
// these records with current availability, price ranges, ratings and special hours.
export const restaurants: RestaurantLocation[] = [];

export const pillars = [
  ['Discover', 'Find the right location with current hours, address, map links, ratings and service options.'],
  ['Choose', 'Browse location-specific menus with exact prices or price ranges and live item availability.'],
  ['Gather', 'Move directly into ordering, reservations, waitlists, catering and private-dining journeys.'],
] as const;

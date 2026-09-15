import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('site is Astro and not Jekyll/Hugo', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.match(pkg.dependencies.astro, /^7\./);
  assert.equal(pkg.private, true);
});

test('location detail exposes live guest information', () => {
  const page = read('src/pages/locations/location.astro');
  for (const phrase of ['Live menu', 'Ratings & maps', 'Hours', 'Open map', 'priceMinMinor', 'fetchAvailability']) assert.match(page, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('API client carries live freshness and price ranges', () => {
  const api = read('src/lib/ame-api.ts');
  for (const phrase of ['priceMinMinor', 'priceMaxMinor', 'observedAt', 'expiresAt', 'PUBLIC_AME_API_BASE_URL']) assert.match(api, new RegExp(phrase));
});

test('locations never require fabricated seed data', () => {
  const data = read('src/data/site.ts');
  assert.match(data, /restaurants: RestaurantLocation\[\] = \[\]/);
});

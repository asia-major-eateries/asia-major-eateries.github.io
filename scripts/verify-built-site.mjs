import { existsSync, readFileSync } from 'node:fs';

const required = [
  'dist/index.html',
  'dist/locations/index.html',
  'dist/locations/location/index.html',
  'dist/menus/index.html',
  'dist/about/index.html',
];
for (const file of required) {
  if (!existsSync(file)) throw new Error(`missing built page: ${file}`);
}

const locations = readFileSync('dist/locations/location/index.html', 'utf8');
for (const phrase of ['Live menu', 'Ratings & maps', 'Hours']) {
  if (!locations.includes(phrase)) throw new Error(`location detail missing ${phrase}`);
}

const menus = readFileSync('dist/menus/index.html', 'utf8');
const dishes = [
  'Tonkotsu Ramen',
  'Shrimp Pad Thai',
  'Beef Pho',
  'Butter Chicken',
  'Chicken Momo',
  'Chicken Biryani',
  'Chicken Adobo',
  'Nasi Lemak',
  'Bibimbap',
  'Kung Pao Chicken',
];
for (const dish of dishes) {
  if (!menus.includes(dish)) throw new Error(`menu page missing dish: ${dish}`);
}
const imageCount = (menus.match(/data:image\/webp;base64,/g) ?? []).length;
if (imageCount !== dishes.length) {
  throw new Error(`expected ${dishes.length} embedded WebP images, found ${imageCount}`);
}

console.log('verified Astro Pages artifact, including 10 embedded menu images');

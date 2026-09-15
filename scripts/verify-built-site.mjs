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
console.log('verified Astro Pages artifact');

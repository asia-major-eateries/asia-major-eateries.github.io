import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { validateWebp } from './lib/webp.mjs';

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

const expectedMenuImages = [
  ['japan', 'Tonkotsu Ramen'],
  ['thailand', 'Shrimp Pad Thai'],
  ['vietnam', 'Beef Pho'],
  ['india', 'Butter Chicken'],
  ['nepal', 'Chicken Momo'],
  ['pakistan', 'Chicken Biryani'],
  ['philippines', 'Chicken Adobo'],
  ['malaysia', 'Nasi Lemak'],
  ['korea', 'Bibimbap'],
  ['china', 'Kung Pao Chicken'],
];

const menus = readFileSync('dist/menus/index.html', 'utf8');
if (menus.includes('data:image/')) throw new Error('menu page must not inline image data URIs');
const menuHtmlBytes = Buffer.byteLength(menus, 'utf8');
if (menuHtmlBytes > 100_000) throw new Error(`menu HTML unexpectedly large: ${menuHtmlBytes} bytes`);

const manifestPath = 'dist/images/menu/generated/manifest.json';
if (!existsSync(manifestPath)) throw new Error(`missing generated image manifest: ${manifestPath}`);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.version !== 1 || typeof manifest.images !== 'object' || manifest.images === null) {
  throw new Error('invalid menu image manifest');
}

for (const [slug, dish] of expectedMenuImages) {
  if (!menus.includes(dish)) throw new Error(`menu page missing dish: ${dish}`);

  const url = `/images/menu/generated/${slug}.webp`;
  if (!menus.includes(`src=\"${url}\"`)) throw new Error(`menu page missing image reference: ${url}`);

  const file = `dist${url}`;
  if (!existsSync(file)) throw new Error(`missing built menu image: ${file}`);
  const buffer = readFileSync(file);
  const metadata = validateWebp(buffer, slug);
  if (metadata.bytes < 1024 || metadata.bytes > 500_000) {
    throw new Error(`${slug}: unexpected deployed WebP size ${metadata.bytes}`);
  }

  const recorded = manifest.images[slug];
  if (!recorded) throw new Error(`${slug}: missing manifest entry`);
  const sha256 = createHash('sha256').update(buffer).digest('hex');
  if (recorded.path !== url) throw new Error(`${slug}: manifest path mismatch`);
  if (recorded.bytes !== metadata.bytes) throw new Error(`${slug}: manifest byte count mismatch`);
  if (recorded.width !== metadata.width || recorded.height !== metadata.height) {
    throw new Error(`${slug}: manifest dimension mismatch`);
  }
  if (recorded.sha256 !== sha256) throw new Error(`${slug}: manifest SHA-256 mismatch`);
}

if (Object.keys(manifest.images).length !== expectedMenuImages.length) {
  throw new Error(`expected ${expectedMenuImages.length} manifest images, found ${Object.keys(manifest.images).length}`);
}

console.log('verified Astro Pages artifact, including 10 cacheable validated menu WebPs');

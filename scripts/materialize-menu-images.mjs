import { createHash } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadMenuImageSources } from './lib/menu-image-sources.mjs';
import { validateWebp } from './lib/webp.mjs';

const root = process.cwd();
const outputDir = resolve(root, 'public/images/menu/generated');
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

const manifest = { version: 1, images: {} };
const seenHashes = new Set();

for (const image of loadMenuImageSources(root)) {
  const metadata = validateWebp(image.buffer, image.slug);
  if (metadata.bytes < 1024 || metadata.bytes > 500_000) {
    throw new Error(`${image.slug}: unexpected WebP size ${metadata.bytes} bytes`);
  }

  const sha256 = createHash('sha256').update(image.buffer).digest('hex');
  if (seenHashes.has(sha256)) throw new Error(`${image.slug}: duplicate menu image content`);
  seenHashes.add(sha256);

  const fileName = `${image.slug}.webp`;
  const publicPath = `/images/menu/generated/${fileName}`;
  writeFileSync(resolve(outputDir, fileName), image.buffer);
  manifest.images[image.slug] = {
    path: publicPath,
    bytes: metadata.bytes,
    width: metadata.width,
    height: metadata.height,
    sha256,
  };
}

writeFileSync(
  resolve(outputDir, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log(`materialized ${Object.keys(manifest.images).length} validated menu WebPs`);

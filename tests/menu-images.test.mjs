import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadMenuImageSources, menuImageSources } from '../scripts/lib/menu-image-sources.mjs';
import { validateWebp } from '../scripts/lib/webp.mjs';

test('all menu image sources decode to distinct structurally valid WebPs', () => {
  assert.equal(menuImageSources.length, 10);
  const images = loadMenuImageSources();
  assert.equal(images.length, 10);

  const slugs = new Set();
  const hashes = new Set();
  for (const image of images) {
    assert.equal(slugs.has(image.slug), false, `duplicate slug: ${image.slug}`);
    slugs.add(image.slug);

    const metadata = validateWebp(image.buffer, image.slug);
    assert.ok(metadata.bytes >= 1024, `${image.slug} is unexpectedly small`);
    assert.ok(metadata.bytes <= 500_000, `${image.slug} is unexpectedly large`);
    assert.ok(metadata.width >= 100 && metadata.height >= 100, `${image.slug} dimensions are unexpectedly small`);

    const hash = createHash('sha256').update(image.buffer).digest('hex');
    assert.equal(hashes.has(hash), false, `${image.slug} duplicates another dish photo`);
    hashes.add(hash);
  }
});

test('WebP validator rejects corrupt and truncated payloads', () => {
  assert.throws(() => validateWebp(Buffer.from('not a webp'), 'garbage'), /too small|RIFF/);

  const valid = loadMenuImageSources()[0].buffer;
  assert.throws(() => validateWebp(valid.subarray(0, valid.length - 1), 'truncated'), /RIFF size mismatch/);

  const badSignature = Buffer.from(valid);
  badSignature.write('NOPE', 8, 'ascii');
  assert.throws(() => validateWebp(badSignature, 'bad-signature'), /WEBP signature/);
});

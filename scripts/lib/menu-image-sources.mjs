import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const DATA_URI_PREFIX = 'data:image/webp;base64,';

export const menuImageSources = Object.freeze([
  { slug: 'japan', file: 'japan.ts', exportName: 'default' },
  { slug: 'thailand', file: 'thailand.ts', exportName: 'default' },
  { slug: 'vietnam', file: 'vietnam-india.ts', exportName: 'vietnam' },
  { slug: 'india', file: 'vietnam-india.ts', exportName: 'india' },
  { slug: 'nepal', file: 'nepal-pakistan.ts', exportName: 'nepal' },
  { slug: 'pakistan', file: 'nepal-pakistan.ts', exportName: 'pakistan' },
  { slug: 'philippines', file: 'philippines-malaysia.ts', exportName: 'philippines' },
  { slug: 'malaysia', file: 'philippines-malaysia.ts', exportName: 'malaysia' },
  { slug: 'korea', file: 'korea-china.ts', exportName: 'korea' },
  { slug: 'china', file: 'korea-china.ts', exportName: 'china' },
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractDataUri(source, exportName, file) {
  const value = `(data:image\\/webp;base64,[A-Za-z0-9+/=]+)`;
  const pattern = exportName === 'default'
    ? new RegExp(`export\\s+default\\s+(['\"])${value}\\1\\s*;?`)
    : new RegExp(`export\\s+const\\s+${escapeRegExp(exportName)}\\s*=\\s*(['\"])${value}\\1\\s*;?`);
  const match = source.match(pattern);
  if (!match) throw new Error(`${file}: missing ${exportName} WebP data URI export`);
  return match[2];
}

function decodeStrictBase64(dataUri, label) {
  if (!dataUri.startsWith(DATA_URI_PREFIX)) throw new Error(`${label}: unsupported data URI`);
  const encoded = dataUri.slice(DATA_URI_PREFIX.length);
  if (!encoded || encoded.length % 4 !== 0) throw new Error(`${label}: malformed base64 length`);
  const buffer = Buffer.from(encoded, 'base64');
  if (buffer.toString('base64') !== encoded) throw new Error(`${label}: non-canonical or malformed base64`);
  return buffer;
}

export function loadMenuImageSources(root = process.cwd()) {
  return menuImageSources.map((definition) => {
    const sourcePath = resolve(root, 'src/data/menu-images', definition.file);
    const source = readFileSync(sourcePath, 'utf8');
    const dataUri = extractDataUri(source, definition.exportName, definition.file);
    return {
      ...definition,
      dataUri,
      buffer: decodeStrictBase64(dataUri, definition.slug),
    };
  });
}

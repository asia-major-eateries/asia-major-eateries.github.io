const RASTER_CHUNKS = new Set(['VP8 ', 'VP8L']);

function fail(label, message) {
  throw new Error(`${label}: ${message}`);
}

function readVp8Dimensions(buffer, offset, size, label) {
  if (size < 10) fail(label, 'VP8 payload is too small');
  if (buffer[offset + 3] !== 0x9d || buffer[offset + 4] !== 0x01 || buffer[offset + 5] !== 0x2a) {
    fail(label, 'VP8 key-frame signature is missing');
  }
  const width = buffer.readUInt16LE(offset + 6) & 0x3fff;
  const height = buffer.readUInt16LE(offset + 8) & 0x3fff;
  if (!width || !height) fail(label, 'VP8 dimensions are invalid');
  return { width, height };
}

function readVp8lDimensions(buffer, offset, size, label) {
  if (size < 5) fail(label, 'VP8L payload is too small');
  if (buffer[offset] !== 0x2f) fail(label, 'VP8L signature is missing');
  const b1 = buffer[offset + 1];
  const b2 = buffer[offset + 2];
  const b3 = buffer[offset + 3];
  const b4 = buffer[offset + 4];
  const width = 1 + b1 + ((b2 & 0x3f) << 8);
  const height = 1 + ((b2 & 0xc0) >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10);
  if (!width || !height) fail(label, 'VP8L dimensions are invalid');
  return { width, height };
}

export function validateWebp(buffer, label = 'WebP') {
  if (!Buffer.isBuffer(buffer)) throw new TypeError(`${label}: expected a Buffer`);
  if (buffer.length < 20) fail(label, 'file is too small');
  if (buffer.toString('ascii', 0, 4) !== 'RIFF') fail(label, 'missing RIFF header');
  if (buffer.toString('ascii', 8, 12) !== 'WEBP') fail(label, 'missing WEBP signature');

  const declaredBytes = buffer.readUInt32LE(4) + 8;
  if (declaredBytes !== buffer.length) {
    fail(label, `RIFF size mismatch: header=${declaredBytes}, actual=${buffer.length}`);
  }

  let offset = 12;
  let dimensions = null;
  const chunks = [];

  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) fail(label, 'truncated chunk header');
    const fourcc = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const payloadOffset = offset + 8;
    const payloadEnd = payloadOffset + size;
    if (payloadEnd > buffer.length) fail(label, `${fourcc} chunk exceeds file bounds`);

    chunks.push(fourcc);
    if (fourcc === 'VP8 ') dimensions = readVp8Dimensions(buffer, payloadOffset, size, label);
    if (fourcc === 'VP8L') dimensions = readVp8lDimensions(buffer, payloadOffset, size, label);

    offset = payloadEnd + (size & 1);
    if (offset > buffer.length) fail(label, `${fourcc} padding exceeds file bounds`);
  }

  if (offset !== buffer.length) fail(label, 'chunk table does not end at EOF');
  if (!chunks.some((chunk) => RASTER_CHUNKS.has(chunk))) fail(label, 'missing VP8/VP8L raster payload');
  if (!dimensions) fail(label, 'could not determine image dimensions');

  return { bytes: buffer.length, chunks, ...dimensions };
}

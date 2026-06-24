import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const files = [
  'public/imgs/goal-mascots/kitten-peek.png',
  'public/imgs/goal-mascots/panda-peek.png',
  'public/imgs/goal-mascots/controller-peek.png',
  'public/imgs/goal-mascots/bunny-peek.png',
];

const padding = 24;

function colorKey(r, g, b) {
  return `${r},${g},${b}`;
}

function parseKey(key) {
  return key.split(',').map(Number);
}

function isNearSample(r, g, b, samples) {
  for (const sample of samples) {
    const [sr, sg, sb] = sample;
    if (Math.abs(r - sr) <= 6 && Math.abs(g - sg) <= 6 && Math.abs(b - sb) <= 6) {
      return true;
    }
  }

  return false;
}

async function fixFile(relativeFile) {
  const file = path.resolve(relativeFile);
  const input = sharp(file).ensureAlpha();
  const metadata = await input.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  const {
    data: source,
    info,
  } = await input
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const paddedWidth = info.width;
  const paddedHeight = info.height;
  const stride = info.channels;
  const visited = new Uint8Array(paddedWidth * paddedHeight);
  const queue = [];
  let head = 0;

  const sampleKeys = new Set();
  for (let x = padding; x < padding + width; x += 1) {
    for (const y of [padding, padding + height - 1]) {
      const offset = (y * paddedWidth + x) * stride;
      sampleKeys.add(colorKey(source[offset], source[offset + 1], source[offset + 2]));
    }
  }

  for (let y = padding; y < padding + height; y += 1) {
    for (const x of [padding, padding + width - 1]) {
      const offset = (y * paddedWidth + x) * stride;
      sampleKeys.add(colorKey(source[offset], source[offset + 1], source[offset + 2]));
    }
  }

  const bgSamples = [...sampleKeys]
    .map(parseKey)
    .filter(([r, g, b]) => {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const avg = (r + g + b) / 3;
      return avg >= 240 && max - min <= 12;
    });

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= paddedWidth || y >= paddedHeight) return;
    const index = y * paddedWidth + x;
    if (visited[index]) return;
    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < paddedWidth; x += 1) {
    push(x, 0);
    push(x, paddedHeight - 1);
  }

  for (let y = 0; y < paddedHeight; y += 1) {
    push(0, y);
    push(paddedWidth - 1, y);
  }

  while (head < queue.length) {
    const index = queue[head++];
    const x = index % paddedWidth;
    const y = Math.floor(index / paddedWidth);
    const offset = index * stride;
    const r = source[offset];
    const g = source[offset + 1];
    const b = source[offset + 2];
    const a = source[offset + 3];

    if (a === 0) {
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
      continue;
    }

    if (!isNearSample(r, g, b, bgSamples)) {
      continue;
    }

    source[offset + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  const extracted = await sharp(source, {
    raw: {
      width: paddedWidth,
      height: paddedHeight,
      channels: stride,
    },
  })
    .extract({
      left: padding,
      top: padding,
      width,
      height,
    })
    .png()
    .toBuffer();

  await fs.writeFile(file, extracted);
  return { file, bgSamples: bgSamples.length };
}

for (const file of files) {
  const result = await fixFile(file);
  console.log(`fixed ${result.file} samples=${result.bgSamples}`);
}

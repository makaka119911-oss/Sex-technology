/**
 * OG-картинка для Telegram / соцсетей: slaid11 целиком + текст на тёмных полях.
 * npm run og:generate
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets/images/slaid11.jpg');
const OUT = path.join(ROOT, 'assets/images/og-share-hero.jpg');

const W = 1200;
const H = 630;
const BG = '#080408';

function buildTextSvg(sideWidth) {
  const pad = Math.max(28, Math.round(sideWidth * 0.14));
  const fontSize = Math.min(54, Math.round(sideWidth * 0.15));
  const lineH = Math.round(fontSize * 1.12);

  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE8B1"/>
      <stop offset="45%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#F5D76E"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.65"/>
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#D4AF37" flood-opacity="0.22"/>
    </filter>
  </defs>
  <g filter="url(#glow)" font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="url(#gold)">
    <text x="${pad}" y="${Math.round(H * 0.46)}" font-size="${fontSize}" letter-spacing="0.06em">Женские</text>
    <text x="${pad}" y="${Math.round(H * 0.46) + lineH}" font-size="${fontSize}" letter-spacing="0.14em">Круги</text>
  </g>
  <line x1="${pad}" y1="${Math.round(H * 0.46) + lineH + 14}" x2="${pad + Math.min(160, sideWidth - pad * 2)}" y2="${Math.round(H * 0.46) + lineH + 14}"
    stroke="#800020" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <circle cx="${pad + Math.min(160, sideWidth - pad * 2) + 10}" cy="${Math.round(H * 0.46) + lineH + 14}" r="4" fill="#B22234"/>
</svg>`);
}

async function main() {
  const resized = await sharp(SRC)
    .resize({ width: W, height: H, fit: 'inside', withoutEnlargement: false })
    .toBuffer({ resolveWithObject: true });

  const { data, info } = resized;
  const left = Math.round((W - info.width) / 2);
  const top = Math.round((H - info.height) / 2);
  const sideWidth = left;

  const textLayer =
    sideWidth >= 120 ? buildTextSvg(sideWidth) : Buffer.from(`<svg width="${W}" height="${H}"/>`);

  await sharp({
    create: { width: W, height: H, channels: 3, background: BG },
  })
    .composite([
      { input: data, left, top },
      { input: textLayer, left: 0, top: 0 },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(OUT);

  console.log(`✓ ${OUT} (${W}×${H}, photo ${info.width}×${info.height}, side bars ~${sideWidth}px)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

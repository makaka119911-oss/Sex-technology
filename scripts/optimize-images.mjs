/**
 * Сжатие + WebP для сексология.com (Sex-technology).
 * Оригиналы → assets/images/_originals/ (один раз, локально).
 *
 * npm run images:optimize
 * npm run images:optimize -- slaid321.jpg
 * npm run images:webp          — только .webp рядом с jpg/png
 * npm run images:optimize:dry
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'assets', 'images');
const ORIGINALS_DIR = path.join(IMAGES_DIR, '_originals');

const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png']);
const SKIP_MIN_BYTES = 90 * 1024;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const forceAll = args.includes('--all');
const webpOnly = args.includes('--webp-only');
const fileArgs = args.filter((a) => !a.startsWith('--'));

function getProfile(relPath, nameLower) {
  const inEvents = relPath.startsWith(`events${path.sep}`) || relPath.startsWith('events/');

  if (
    /^slaid/.test(nameLower) ||
    nameLower.startsWith('hero-slide') ||
    nameLower.startsWith('hero-presentation') ||
    nameLower.includes('gpt-image') ||
    nameLower.includes('gemini-')
  ) {
    return { kind: 'hero', maxWidth: 1200, quality: 86, pngCompression: 9, webpQuality: 84 };
  }

  if (inEvents || nameLower.startsWith('afisha')) {
    return { kind: 'event', maxWidth: 1400, quality: 84, pngCompression: 9, webpQuality: 82 };
  }

  if (
    nameLower.startsWith('9c4a') ||
    nameLower.startsWith('img_') ||
    nameLower.includes('галере') ||
    nameLower.includes('выпуск') ||
    nameLower.includes('татьян') ||
    nameLower.includes('виктор') ||
    nameLower.includes('румян') ||
    nameLower.includes('солнеч') ||
    /^\d{4}-\d{2}-\d{2}/.test(nameLower) ||
    nameLower.startsWith('photo_')
  ) {
    return { kind: 'gallery', maxWidth: 1600, quality: 82, pngCompression: 9, webpQuality: 80 };
  }

  if (nameLower.startsWith('slide-') && nameLower.endsWith('.png')) {
    return { kind: 'legacy', maxWidth: 1400, quality: 85, pngCompression: 9, webpQuality: 82 };
  }

  return { kind: 'default', maxWidth: 1400, quality: 83, pngCompression: 9, webpQuality: 81 };
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_originals' || entry.name === 'node_modules') continue;
      files.push(...(await walk(full)));
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (RASTER_EXT.has(ext)) files.push(full);
  }

  return files;
}

async function backupOriginal(absPath, relFromImages) {
  const dest = path.join(ORIGINALS_DIR, relFromImages);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  try {
    await fs.access(dest);
  } catch {
    await fs.copyFile(absPath, dest);
  }
}

function webpPathFor(absPath) {
  return absPath.replace(/\.(jpe?g|png)$/i, '.webp');
}

async function writeWebpCompanion(absPath, profile) {
  const ext = path.extname(absPath).toLowerCase();
  if (!RASTER_EXT.has(ext)) return null;

  const outPath = webpPathFor(absPath);
  const input = await fs.readFile(absPath);
  const meta = await sharp(input, { failOn: 'none' }).metadata();

  let pipeline = sharp(input, { failOn: 'none' }).rotate();
  if (meta.width && meta.width > profile.maxWidth) {
    pipeline = pipeline.resize({
      width: profile.maxWidth,
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  const buf = await pipeline.webp({ quality: profile.webpQuality, effort: 4 }).toBuffer();

  if (!dryRun) {
    await fs.writeFile(outPath, buf);
  }

  return {
    rel: path.relative(IMAGES_DIR, outPath),
    size: buf.length,
  };
}

async function optimizeFile(absPath) {
  const relFromImages = path.relative(IMAGES_DIR, absPath);
  const nameLower = path.basename(absPath).toLowerCase();
  const stat = await fs.stat(absPath);
  const profile = getProfile(relFromImages, nameLower);
  const ext = path.extname(absPath).toLowerCase();

  let primaryResult = null;

  if (!forceAll && stat.size < SKIP_MIN_BYTES) {
    primaryResult = { relFromImages, skipped: true, reason: 'already-small' };
  } else {
    const input = await fs.readFile(absPath);
    const image = sharp(input, { failOn: 'none' });
    const meta = await image.metadata();

    let pipeline = image.rotate();
    const needsResize = meta.width && meta.width > profile.maxWidth;

    if (needsResize) {
      pipeline = pipeline.resize({
        width: profile.maxWidth,
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    let output;
    if (ext === '.png') {
      output = await pipeline
        .png({ compressionLevel: profile.pngCompression, adaptiveFiltering: true })
        .toBuffer();
    } else {
      output = await pipeline
        .jpeg({ quality: profile.quality, mozjpeg: true, progressive: true })
        .toBuffer();
    }

    const saved = stat.size - output.length;
    const savedPct = Math.round((saved / stat.size) * 100);

    if (!forceAll && saved < 8 * 1024 && !needsResize) {
      primaryResult = { relFromImages, skipped: true, reason: 'no-meaningful-savings' };
    } else if (dryRun) {
      primaryResult = {
        relFromImages,
        profile: profile.kind,
        before: stat.size,
        after: output.length,
        saved,
        savedPct,
        resized: needsResize,
        dryRun: true,
      };
    } else {
      await backupOriginal(absPath, relFromImages);
      await fs.writeFile(absPath, output);
      primaryResult = {
        relFromImages,
        profile: profile.kind,
        before: stat.size,
        after: output.length,
        saved,
        savedPct,
        resized: needsResize,
      };
    }
  }

  const webp = await writeWebpCompanion(absPath, profile);
  return { ...primaryResult, webp };
}

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

async function main() {
  let files;
  if (fileArgs.length) {
    files = fileArgs.map((f) => path.resolve(IMAGES_DIR, f));
  } else {
    files = await walk(IMAGES_DIR);
  }

  const mode = webpOnly ? 'webp-only' : 'optimize';
  console.log(`\n🖼  optimize-images [${mode}] — ${files.length} file(s)${dryRun ? ' [dry-run]' : ''}\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let optimized = 0;
  let webpCount = 0;
  let skipped = 0;

  for (const absPath of files) {
    try {
      const relFromImages = path.relative(IMAGES_DIR, absPath);
      const profile = getProfile(relFromImages, path.basename(absPath).toLowerCase());

      if (webpOnly) {
        const webp = await writeWebpCompanion(absPath, profile);
        if (webp) {
          webpCount += 1;
          console.log(`  webp  ${webp.rel} (${formatKb(webp.size)})`);
        }
        continue;
      }

      const result = await optimizeFile(absPath);
      if (result.skipped) {
        skipped += 1;
        const webpNote = result.webp ? ` + webp ${formatKb(result.webp.size)}` : '';
        console.log(`  skip  ${result.relFromImages} (${result.reason})${webpNote}`);
        if (result.webp) webpCount += 1;
        continue;
      }

      optimized += 1;
      totalBefore += result.before;
      totalAfter += result.after;
      const tag = result.dryRun ? 'would' : 'ok';
      const webpNote = result.webp ? ` | webp ${formatKb(result.webp.size)}` : '';
      console.log(
        `  ${tag}  ${result.relFromImages} [${result.profile}] ${formatKb(result.before)} → ${formatKb(result.after)} (−${result.savedPct}%)${result.resized ? ' resize' : ''}${webpNote}`,
      );
      if (result.webp) webpCount += 1;
    } catch (err) {
      console.error(`  ERR   ${path.relative(IMAGES_DIR, absPath)}: ${err.message}`);
    }
  }

  console.log('\n---');
  if (!webpOnly) {
    console.log(`Optimized: ${optimized}, skipped: ${skipped}`);
    if (optimized > 0) {
      const totalSaved = totalBefore - totalAfter;
      console.log(
        `Total: ${formatKb(totalBefore)} → ${formatKb(totalAfter)} (saved ${formatKb(totalSaved)}, −${Math.round((totalSaved / totalBefore) * 100)}%)`,
      );
    }
  }
  console.log(`WebP files written: ${webpCount}`);
  if (!dryRun && (optimized > 0 || webpCount > 0)) {
    console.log(`\nОригиналы (бэкап JPEG/PNG): assets/images/_originals/`);
  }
  console.log('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

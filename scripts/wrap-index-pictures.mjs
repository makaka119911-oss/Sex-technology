/**
 * Оборачивает <img src="assets/images/*.jpg"> в <picture> + webp source.
 * Hero <picture> — добавляет webp source (в т.ч. desktop).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(__dirname, '..', 'index.html');

function toWebpSrc(src) {
  return src.replace(/\.(jpe?g|png)(\?[^"]*)?$/i, '.webp$2');
}

function wrapStandaloneImages(html) {
  const lines = html.split('\n');
  const out = [];
  let inPicture = 0;

  for (const line of lines) {
    const opens = (line.match(/<picture\b/gi) || []).length;
    const closes = (line.match(/<\/picture>/gi) || []).length;
    const trimmed = line.trim();

    const imgMatch = trimmed.match(
      /^<img\s+([^>]*\bsrc="(assets\/images\/[^"]+\.(?:jpe?g|png))"[^>]*)>$/i,
    );

    if (inPicture === 0 && imgMatch) {
      const [, attrs, src] = imgMatch;
      const indent = line.match(/^(\s*)/)[1];
      const webp = toWebpSrc(src);
      out.push(`${indent}<picture>`);
      out.push(`${indent}    <source srcset="${webp}" type="image/webp">`);
      out.push(`${indent}    <img ${attrs}>`);
      out.push(`${indent}</picture>`);
    } else {
      out.push(line);
    }

    inPicture += opens - closes;
    if (inPicture < 0) inPicture = 0;
  }

  return out.join('\n');
}

function addHeroWebpSources(html) {
  return html.replace(
    /<picture class="slide-hero-picture">([\s\S]*?)<\/picture>/g,
    (block) => {
      if (block.includes('type="image/webp"')) return block;

      const imgMatch = block.match(/<img[\s\S]*?src="([^"]+)"/i);
      if (!imgMatch) return block;

      let updated = block;

      updated = updated.replace(
        /<source\s+([\s\S]*?media="\(min-width: 769px\)"[\s\S]*?srcset=")([^"]+\.jpe?g)(\?[^"]*)?("[\s\S]*?>)/gi,
        (match, before, src, query, afterClose) => {
          const webpSrc = `${src}.webp${query || ''}`;
          const jpgSrc = `${src}${query || ''}`;
          const indent = match.match(/^(\s*)/)?.[1] || '                            ';
          return `${indent}<source type="image/webp" media="(min-width: 769px)" srcset="${webpSrc}">\n${indent}<source media="(min-width: 769px)" srcset="${jpgSrc}">`;
        },
      );

      const mobileWebp = toWebpSrc(imgMatch[1]);
      updated = updated.replace(
        /(\s*)(<img\b)/,
        `$1<source type="image/webp" srcset="${mobileWebp}">\n$1$2`,
      );

      return updated;
    },
  );
}

async function main() {
  let html = await fs.readFile(INDEX, 'utf8');
  html = wrapStandaloneImages(html);
  html = addHeroWebpSources(html);
  await fs.writeFile(INDEX, html);
  console.log('index.html: picture + webp sources updated');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

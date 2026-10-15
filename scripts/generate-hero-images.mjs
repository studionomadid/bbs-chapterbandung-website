import fs from 'node:fs';
import path from 'node:path';

const imageDirectory = path.resolve('public/images/hero');
const outputDirectory = path.resolve('src/data');
const outputFile = path.join(outputDirectory, 'hero-images.json');

const supportedExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
]);

const files = fs.readdirSync(imageDirectory, {
  withFileTypes: true,
})
  .filter((file) => file.isFile())
  .map((file) => file.name)
  .filter((name) => {
    const extension = path.extname(name).toLowerCase();

    return (
      /^hero-\d+\.(jpg|jpeg|png|webp)$/i.test(name) &&
      supportedExtensions.has(extension)
    );
  })
  .sort((a, b) => {
    const numberA = Number(a.match(/^hero-(\d+)/i)[1]);
    const numberB = Number(b.match(/^hero-(\d+)/i)[1]);

    return numberA - numberB;
  });

if (files.length === 0) {
  console.error(
    'ERROR: Tidak ada gambar hero yang ditemukan di public/images/hero/.'
  );
  console.error(
    'Gunakan nama seperti hero-01.jpg, hero-02.jpg, dan seterusnya.'
  );
  process.exit(1);
}

const imagePaths = files.map(
  (file) => `/images/hero/${file}`
);

fs.mkdirSync(outputDirectory, { recursive: true });

fs.writeFileSync(
  outputFile,
  `${JSON.stringify(imagePaths, null, 2)}\n`,
  'utf8'
);

console.log(`Hero slideshow: ${files.length} gambar ditemukan.`);

for (const file of files) {
  console.log(`  - ${file}`);
}

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512
};

const inputSvg = path.join(__dirname, '../public/assets/tolerable-brand/tolerable-logo.svg');
const outputDir = path.join(__dirname, '../public/assets/tolerable-brand');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate each favicon size
Object.entries(sizes).forEach(([filename, size]) => {
  sharp(inputSvg)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, filename))
    .then(() => console.log(`Generated ${filename}`))
    .catch(err => console.error(`Error generating ${filename}:`, err));
}); 
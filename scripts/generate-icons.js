// Simple script to generate base64 PNG placeholders
// These are minimal 1x1 PNG files that will be replaced with real icons in production

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal 1x1 green PNG (base64)
const greenPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkaM/4HwADggF/lmLzLQAAAABJRU5ErkJggg==', 'base64');

const iconsDir = path.join(__dirname, '../public/icons');

// Create placeholder PNGs
const sizes = [192, 512];
const types = ['icon', 'icon-maskable'];

types.forEach(type => {
  sizes.forEach(size => {
    const filename = `${type}-${size}.png`;
    const filepath = path.join(iconsDir, filename);
    fs.writeFileSync(filepath, greenPng);
    console.log(`Created ${filename}`);
  });
});

console.log('Done! Note: These are placeholder PNGs. Replace with real icons for production.');

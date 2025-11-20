// Quick script to create placeholder PNG icons
// Run with: node create-icons.js

const fs = require('fs');
const path = require('path');

// Simple 1x1 red pixel PNG in base64
const redPixel = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
  'base64'
);

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create all required icon sizes (they'll all be the same 1x1 pixel for now)
const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
  const filename = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filename, redPixel);
  console.log(`✅ Created ${filename}`);
});

console.log('\n✨ Placeholder icons created successfully!');
console.log('📝 Note: These are 1x1 pixel placeholders. Replace with proper icons for production.\n');

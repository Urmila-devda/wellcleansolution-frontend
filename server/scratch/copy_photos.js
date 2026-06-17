const fs = require('fs');
const path = require('path');

const rootDir = 'd:/CleaningStore';
const productPhotosDir = path.join(rootDir, 'Product Photos');
const uploadsDir = path.join(rootDir, 'server/uploads');

const mappings = {
  'Hand Wash 5 Ltr.jpeg': '1781249974960-163561625.jpeg',
  'Harpic 500 ml.jpeg': '1781250000042-657582579.jpeg',
  'Glass Cleaner 5 Ltr.jpeg': '1781250037293-673388264.jpeg',
  'Floor Cleaner 5 Ltr.jpeg': '1781250082521-53012733.jpeg',
  'Dish Wash 5 Ltr.jpeg': '1781250116488-305129640.jpeg',
  'Glass Cleaner 500 ml.png': '1781250183295-69552712.png',
  'Harpic 1 Ltr.jpeg': '1781250342716-449820078.jpeg',
  'Toilet Cleaner 5 Ltr.jpeg': '1781250408950-447028764.jpeg',
};

Object.entries(mappings).forEach(([srcFile, destFile]) => {
  const src = path.join(productPhotosDir, srcFile);
  const dest = path.join(uploadsDir, destFile);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${srcFile} to ${destFile}`);
  } else {
    console.error(`Source file not found: ${src}`);
  }
});
console.log('Done mapping product photos!');

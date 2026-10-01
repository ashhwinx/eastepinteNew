const fs = require('fs');

const siteData = JSON.parse(fs.readFileSync('src/data/siteData.json', 'utf8'));
const fullData = JSON.parse(fs.readFileSync('src/data/siteData.full.json', 'utf8'));

// Build lookup map from fullData for all imageAsset IDs -> url
const fullAssetMap = new Map();
fullData.forEach(d => {
  if (d._type === 'sanity.imageAsset' && d.url) {
    fullAssetMap.set(d._id, d.url);
  }
});

console.log('Full asset map size:', fullAssetMap.size);

// Scan siteData for any object with asset._ref
const missingResolved = [];

function scan(obj, docId, path = '') {
  if (!obj || typeof obj !== 'object') return;
  if (obj.asset && obj.asset._ref && typeof obj.asset._ref === 'string') {
    if (!obj.resolvedUrl && !obj.url) {
      const urlFromFull = fullAssetMap.get(obj.asset._ref);
      missingResolved.push({ docId, path, ref: obj.asset._ref, urlFromFull });
    }
  }
  for (const k of Object.keys(obj)) {
    scan(obj[k], docId, path ? `${path}.${k}` : k);
  }
}

siteData.forEach(d => scan(d, d._id || d._type));
console.log('Total images with missing resolvedUrl:', missingResolved.length);
console.log('Details:', missingResolved);

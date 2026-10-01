const https = require('https');

function query(projectId, qStr) {
  return new Promise((resolve, reject) => {
    const q = encodeURIComponent(qStr);
    const url = `https://${projectId}.api.sanity.io/v2024-03-01/data/query/production?query=${q}`;
    https.get(url, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(b));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const assets = await query('9fz0fnwv', '*[_type == "sanity.imageAsset"]{ _id, originalFilename, url, sha1hash }');
  console.log('Total assets in 9fz0fnwv:', assets.result?.length);
  const found = assets.result?.find(a => a._id.includes('573e9dc8') || a.sha1hash?.includes('573e9dc8'));
  console.log('Found 573e9dc8 in 9fz0fnwv?', found);
}

main().catch(console.error);

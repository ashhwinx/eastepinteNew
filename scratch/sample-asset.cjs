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
  const assets = await query('9fz0fnwv', '*[_type == "sanity.imageAsset"][0..3]{ _id, originalFilename, url, sha1hash }');
  console.log(assets.result);
}

main().catch(console.error);

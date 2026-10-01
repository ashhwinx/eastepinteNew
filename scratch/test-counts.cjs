const https = require('https');

function countDocs(projectId, query) {
  return new Promise((resolve, reject) => {
    const q = encodeURIComponent(query);
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
  const images = await countDocs('9fz0fnwv', 'count(*[_type == "sanity.imageAsset"])');
  console.log('Images in 9fz0fnwv:', images.result);
  const docs = await countDocs('9fz0fnwv', 'count(*[!(_type in ["sanity.imageAsset", "sanity.fileAsset"])])');
  console.log('Docs in 9fz0fnwv:', docs.result);
}

main().catch(console.error);

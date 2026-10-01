const https = require('https');

function getDocs(projectId) {
  return new Promise((resolve, reject) => {
    const q = encodeURIComponent('*[!(_type in ["sanity.imageAsset", "sanity.fileAsset"])]');
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
  const oq = await getDocs('oq6192v5');
  console.log('Doc types in oq6192v5:');
  const types = {};
  oq.result?.forEach(d => {
    types[d._type] = (types[d._type] || 0) + 1;
  });
  console.log(types);
}

main().catch(console.error);

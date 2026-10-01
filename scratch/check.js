const https = require('https');

function querySanity(projectId) {
  return new Promise((resolve, reject) => {
    const q = encodeURIComponent('*[_type in ["cabin", "amenity", "testimonial", "homePage"]]{ _id, _type, name, title }');
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
  console.log('Checking oq6192v5:');
  const res1 = await querySanity('oq6192v5');
  console.log('oq6192v5 count:', res1.result ? res1.result.length : res1);

  console.log('Checking jlknt03a:');
  const res2 = await querySanity('jlknt03a');
  console.log('jlknt03a count:', res2.result ? res2.result.length : res2);
}

main().catch(console.error);

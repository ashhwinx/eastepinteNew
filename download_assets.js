const https = require('https');
const fs = require('fs');
const path = require('path');

const files = [
  'Amenities/AmenitiesHero.jpeg',
  'Community/CommunityHero.avif',
  'Community/Wedding.avif',
  'Community/Reunion.avif',
  'Community/Corporate.avif'
];

async function download(file) {
  const url = `https://www.eastpointekc.com/${file}`;
  const dest = path.join(__dirname, 'public', file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  return new Promise(resolve => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        console.error(`Failed ${file}: ${res.statusCode}`);
        return resolve(false);
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        console.log(`Saved ${file} (${fs.statSync(dest).size} bytes)`);
        resolve(true);
      });
    }).on('error', err => {
      console.error(`Error ${file}:`, err);
      resolve(false);
    });
  });
}

(async () => {
  for (const f of files) {
    await download(f);
  }
  console.log('Done downloading community & amenities assets!');
})();

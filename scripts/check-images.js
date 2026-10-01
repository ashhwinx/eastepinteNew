import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/data/siteData.json', 'utf8'));
for (const doc of data) {
  const str = JSON.stringify(doc);
  const refs = (str.match(/"_ref":"image-[^"]+"/g) || []).length;
  const resolved = (str.match(/"resolvedUrl"/g) || []).length;
  if (refs > 0 || resolved > 0) {
    console.log(`${doc._type} (${doc._id || doc.name}): refs=${refs}, resolvedUrl=${resolved}`);
  }
}


const fs = require('fs');
const siteData = JSON.parse(fs.readFileSync('src/data/siteData.json', 'utf8'));

const types = {};
siteData.forEach(d => {
  types[d._type] = (types[d._type] || 0) + 1;
});
console.log('siteData.json types:', types);
console.log('Total items:', siteData.length);

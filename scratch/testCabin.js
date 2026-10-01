const fs = require('fs');
const data = require('../src/data/siteData.json');

const orderMap = {
  'East Pointe Bayview': 1,
  'Aston Harbor': 2,
  'Aspire': 3,
  'Cedar Pointe': 4,
  "Byrd's Nest": 5,
  'Harbor View': 6,
  'HarborView': 6,
  'TreeHaus': 7,
  'RocHaus': 8,
};

const prepareCabinDoc = (item) => ({
  _id: item._id,
  _type: 'cabin',
  name: item.name,
  order: orderMap[item.name] || item.order || 99,
  status: item.status || 'Available',
  bedrooms: item.bedrooms || '2 Bedrooms',
  baths: typeof item.baths === 'number' ? item.baths : 2,
  sleeps: String(item.sleeps || '4 - 6'),
  sqFt: String(item.sqFt || item.sqft || ''),
  desc: item.desc || item.description || '',
  imageUrls: (item.images || []).map((img) => img.resolvedUrl).filter(Boolean),
  features: item.features || item.highlights || [],
  sleepingArrangements: (item.sleepingArrangements || []).map((s, idx) => ({
    _key: `sa-${idx}`,
    room: s.room || s.name || `Bedroom ${idx + 1}`,
    bed: s.bed || s.beds || s.description || '1 Bed',
  })),
  bookingLink: item.bookingLink || item.bookingUrl || '',
  location: item.location || 'Odessa, MO',
});

const cabins = data.filter(d => d._type === 'cabin');
console.log('Cabins count in siteData.json:', cabins.length);
cabins.forEach((c, idx) => {
  const prepared = prepareCabinDoc(c);
  console.log(`[${idx}] ${prepared._id}: ${prepared.name} (order: ${prepared.order})`);
});

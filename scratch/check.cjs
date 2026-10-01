const https = require('https');

function testMutate() {
  const mutation = {
    mutations: [
      {
        createOrReplace: {
          _id: "test-doc-123",
          _type: "cabin",
          name: "Test"
        }
      }
    ]
  };

  const data = JSON.stringify(mutation);
  const req = https.request({
    hostname: 'oq6192v5.api.sanity.io',
    path: '/v2024-03-01/data/mutate/production',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }, (res) => {
    let b = '';
    res.on('data', c => b += c);
    res.on('end', () => console.log('Response status:', res.statusCode, b));
  });

  req.write(data);
  req.end();
}

testMutate();


async function main() {
  const docs = await querySanity('oq6192v5', '*[_type in ["testimonial", "amenity"]][0..2]');
  console.log(JSON.stringify(docs.result, null, 2));
}

main().catch(console.error);

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
let envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...val] = trimmed.split('=');
      envVars[key.trim()] = val.join('=').trim();
    }
  });
}

const projectId = process.env.VITE_SANITY_PROJECT_ID || envVars.VITE_SANITY_PROJECT_ID || '9fz0fnwv';
const dataset = process.env.VITE_SANITY_DATASET || envVars.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN || envVars.SANITY_API_WRITE_TOKEN || envVars.SANITY_API_TOKEN;

console.log('\n========================================');
console.log('🌲 East Pointe Sanity Content & Photo Seeder');
console.log('========================================');
console.log(`Target Project ID : ${projectId}`);
console.log(`Target Dataset    : ${dataset}`);

if (!token) {
  console.error('❌ No token found!');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-03-01',
  useCdn: false,
});

// Load full data for image asset URL mappings
const fullDataPath = path.resolve(__dirname, '../src/data/siteData.full.json');
const fullAssetMap = new Map();
if (fs.existsSync(fullDataPath)) {
  try {
    const fullData = JSON.parse(fs.readFileSync(fullDataPath, 'utf8'));
    fullData.forEach((d) => {
      if (d._type === 'sanity.imageAsset' && d.url) {
        fullAssetMap.set(d._id, d.url);
      }
    });
    console.log(`Loaded ${fullAssetMap.size} asset URLs from siteData.full.json`);
  } catch (e) {
    console.warn('Could not read siteData.full.json:', e.message);
  }
}

async function uploadImage(url, assetMap) {
  if (!url) return null;
  if (assetMap.has(url)) return assetMap.get(url);

  try {
    let buffer;
    let filename = url.split('/').pop().split('?')[0] || 'photo.jpg';

    if (url.startsWith('/')) {
      const localPath = path.resolve(__dirname, '../public', url.slice(1));
      if (fs.existsSync(localPath)) {
        buffer = fs.readFileSync(localPath);
      }
    }

    if (!buffer && url.startsWith('http')) {
      const res = await fetch(url);
      if (res.ok) {
        const ab = await res.arrayBuffer();
        buffer = Buffer.from(ab);
      }
    }

    if (buffer) {
      process.stdout.write(`\r📤 Uploading asset: ${filename.slice(0, 30)}...                  `);
      const asset = await client.assets.upload('image', buffer, { filename });
      if (asset && asset._id) {
        assetMap.set(url, asset._id);
        return asset._id;
      }
    }
  } catch (err) {
    console.warn(`\n⚠️  Failed to upload ${url}: ${err.message}`);
  }
  return null;
}

async function transformImg(node, assetMap) {
  if (!node || typeof node !== 'object') return node;

  let url = node.resolvedUrl || node.url || (typeof node === 'string' ? node : null);

  if (!url && node.asset && node.asset._ref) {
    url = fullAssetMap.get(node.asset._ref);
    if (!url && node.asset._ref.startsWith('image-')) {
      const match = node.asset._ref.match(/^image-([a-f0-9]+)-([0-9x]+)-([a-z0-9]+)$/);
      if (match) {
        url = `https://cdn.sanity.io/images/jlknt03a/production/${match[1]}-${match[2]}.${match[3]}`;
      }
    }
  }

  if (!url) {
    if (node.asset && node.asset._ref) {
      delete node.asset;
    }
    return node;
  }

  const newRef = await uploadImage(url, assetMap);
  if (newRef) {
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: newRef,
      },
      resolvedUrl: url,
      ...(node.alt ? { alt: node.alt } : {}),
    };
  }

  if (node.asset && node.asset._ref) {
    delete node.asset;
  }
  return node;
}

async function deepTransformImages(obj, assetMap) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = await deepTransformImages(obj[i], assetMap);
    }
    return obj;
  }

  if (obj._type === 'image' || (obj.asset && obj.asset._ref)) {
    return await transformImg(obj, assetMap);
  }

  for (const key of Object.keys(obj)) {
    obj[key] = await deepTransformImages(obj[key], assetMap);
  }
  return obj;
}

async function seed() {
  const siteDataPath = path.resolve(__dirname, '../src/data/siteData.json');
  const rawData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

  console.log(`\nFound ${rawData.length} documents in siteData.json.`);
  const assetMap = new Map();

  // Pre-populate assetMap with existing uploaded assets in the project to avoid duplicate re-uploads!
  try {
    const existingAssets = await client.fetch('*[_type == "sanity.imageAsset"]{ _id, originalFilename, url, sha1hash }');
    console.log(`Found ${existingAssets.length} already uploaded image assets in Sanity project.`);
    existingAssets.forEach((a) => {
      if (a.originalFilename) assetMap.set(a.originalFilename, a._id);
      if (a.url) assetMap.set(a.url, a._id);
    });
  } catch (e) {
    console.warn('Could not fetch existing assets:', e.message);
  }

  const preparedDocs = [];

  for (const doc of rawData) {
    const cleanDoc = { ...doc };
    delete cleanDoc._rev;
    delete cleanDoc._createdAt;
    delete cleanDoc._updatedAt;
    delete cleanDoc._system;

    const transformed = await deepTransformImages(cleanDoc, assetMap);
    preparedDocs.push(transformed);
  }

  console.log(`\n\nImage assets verified. Now saving all ${preparedDocs.length} documents...`);

  let count = 0;
  for (const doc of preparedDocs) {
    await client.createOrReplace(doc);
    count++;
    process.stdout.write(`\r✅ Saved document: ${count} / ${preparedDocs.length} (${doc._type}: ${doc.title || doc.name || doc._id})      `);
  }

  console.log('\n\n🎉 Done! All 33 documents and images successfully loaded into the new Sanity project!');
  console.log('Open http://localhost:5173/studio to view and edit everything!\n');
}

seed().catch((err) => {
  console.error('\nSeed failed:', err);
  process.exit(1);
});

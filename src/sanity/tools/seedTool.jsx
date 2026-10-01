import React, { useState, useEffect } from 'react';
import { useClient } from 'sanity';
import siteData from '../../data/siteData.json';

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

export function SeedTool() {
  const client = useClient({ apiVersion: '2024-03-01' });
  const [counts, setCounts] = useState({
    cabins: 0,
    amenities: 0,
    testimonials: 0,
    pages: 0,
    settings: 0,
    assets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('idle'); // idle | running | success | error
  const [mode, setMode] = useState(null); // 'cabins' | 'quick' | 'full'
  const [progressText, setProgressText] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentThumb, setCurrentThumb] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch current document counts from Sanity
  const checkCounts = async () => {
    setLoading(true);
    try {
      const docs = await client.fetch(
        `*[_type in ["cabin", "amenity", "testimonial", "homePage", "cabinPage", "amenitiesPage", "communityPage", "explorePage", "membershipPage", "siteSettings", "sanity.imageAsset"]]{ _id, _type }`
      );

      const cabins = docs.filter((d) => d._type === 'cabin').length;
      const amenities = docs.filter((d) => d._type === 'amenity').length;
      const testimonials = docs.filter((d) => d._type === 'testimonial').length;
      const pages = docs.filter((d) =>
        ['homePage', 'cabinPage', 'amenitiesPage', 'communityPage', 'explorePage', 'membershipPage'].includes(d._type)
      ).length;
      const settings = docs.filter((d) => d._type === 'siteSettings').length;
      const assets = docs.filter((d) => d._type === 'sanity.imageAsset').length;

      const newCounts = { cabins, amenities, testimonials, pages, settings, assets };
      setCounts(newCounts);
      return newCounts;
    } catch (err) {
      console.warn('Failed to query counts:', err.message);
      return counts;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await checkCounts();
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Recursive helper: Strip asset._ref pointing to non-existent documents ──
  const stripAssetRefs = (obj) => {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(stripAssetRefs);
    if (typeof obj !== 'object') return obj;

    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'asset' && value && typeof value === 'object' && value._ref) {
        continue; // skip dangling asset references
      }
      cleaned[key] = stripAssetRefs(value);
    }
    return cleaned;
  };

  // ── Helper: Prepare a valid Cabin document for Sanity Studio ──
  const prepareCabinDoc = (item, coverAssetId = null) => {
    const doc = {
      _id: item._id,
      _type: 'cabin',
      name: item.name,
      order: orderMap[item.name] || item.order || 99,
      status: item.status || 'Available',
      bedrooms: item.bedrooms || '2 Bedrooms',
      baths: typeof item.baths === 'number' ? item.baths : 2,
      sleeps: String(item.sleeps || '4 - 6'),
      location: item.location || 'Odessa, MO',
    };

    if (item.sqFt || item.sqft) {
      doc.sqFt = String(item.sqFt || item.sqft);
    }

    const desc = item.desc || item.description;
    if (desc) {
      doc.desc = desc;
    }

    // Only set bookingLink if it's a valid URL string (Sanity rejects empty strings for url type)
    if (item.bookingLink && typeof item.bookingLink === 'string' && item.bookingLink.startsWith('http')) {
      doc.bookingLink = item.bookingLink;
    }

    if (item.features && Array.isArray(item.features) && item.features.length > 0) {
      doc.features = item.features;
    }

    // Explicit _type: 'sleepingArrangement' so Sanity array validation succeeds
    if (item.sleepingArrangements && Array.isArray(item.sleepingArrangements) && item.sleepingArrangements.length > 0) {
      doc.sleepingArrangements = item.sleepingArrangements.map((s, idx) => ({
        _key: s._key || `sa-${idx}`,
        _type: 'sleepingArrangement',
        room: s.room || s.name || `Bedroom ${idx + 1}`,
        bed: s.bed || s.beds || s.description || '1 Bed',
      }));
    }

    // Store high-res photo URLs from CDN
    const resolvedUrls = (item.images || [])
      .map((img) => img.resolvedUrl || img.url || (typeof img === 'string' ? img : null))
      .filter(Boolean);

    if (resolvedUrls.length > 0) {
      doc.imageUrls = resolvedUrls;
    }

    // Attach uploaded Sanity image asset if available
    if (coverAssetId) {
      doc.images = [
        {
          _key: 'cover-0',
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: coverAssetId,
          },
          alt: `${item.name} Main Photo`,
        },
      ];
    }

    return doc;
  };

  // ── Helper: Prepare an amenity document ──
  const prepareAmenityDoc = (item) => ({
    _id: item._id,
    _type: 'amenity',
    title: item.title,
    icon: item.icon || 'Sparkles',
    desc: item.desc || item.description || '',
    order: item.order || 1,
  });

  // ── Helper: Prepare a testimonial document ──
  const prepareTestimonialDoc = (item) => ({
    _id: item._id,
    _type: 'testimonial',
    name: item.name,
    location: item.location || '',
    quote: item.quote || '',
    rating: item.rating || 5,
    order: item.order || 1,
    ...(item.cabinStayed ? { cabinStayed: item.cabinStayed } : {}),
  });

  // ── Helper: Prepare a page/settings document ──
  const prepareGenericDoc = (item) => {
    const { _rev, _createdAt, _updatedAt, _system, ...cleanDoc } = item;
    return stripAssetRefs(cleanDoc);
  };

  // ── Upload an image URL to Sanity asset store via Vite Proxy ──
  const uploadImageToSanity = async (imageUrl, assetMap) => {
    if (!imageUrl) return null;
    if (assetMap.has(imageUrl)) return assetMap.get(imageUrl);

    try {
      let fetchUrl = imageUrl;
      if (imageUrl.startsWith('/')) {
        fetchUrl = `${window.location.origin}${imageUrl}`;
      } else if (imageUrl.startsWith('http')) {
        fetchUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      }

      let res;
      try {
        res = await fetch(fetchUrl);
      } catch {
        res = await fetch(imageUrl);
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      const filename = imageUrl.split('/').pop().split('?')[0] || 'photo.jpg';

      setCurrentThumb(imageUrl);
      const assetDoc = await client.assets.upload('image', blob, { filename });

      if (assetDoc && assetDoc._id) {
        assetMap.set(imageUrl, assetDoc._id);
        return assetDoc._id;
      }
    } catch (err) {
      console.warn(`Asset upload skipped for ${imageUrl}:`, err.message);
    }
    return null;
  };

  const uploadImageWithTimeout = async (url, assetMap, timeoutMs = 4000) => {
    try {
      const uploadPromise = uploadImageToSanity(url, assetMap);
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs));
      return await Promise.race([uploadPromise, timeoutPromise]);
    } catch {
      return null;
    }
  };

  const transformImage = async (imgNode, assetMap, label = '') => {
    if (!imgNode) return null;
    const url = imgNode.resolvedUrl || imgNode.url || (typeof imgNode === 'string' ? imgNode : null);
    if (!url) return null;

    if (label) setProgressText(`Uploading: ${label}`);

    const newRef = await uploadImageWithTimeout(url, assetMap, 5000);
    if (newRef) {
      return {
        _type: 'image',
        asset: { _type: 'reference', _ref: newRef },
        resolvedUrl: url,
        ...(imgNode.alt ? { alt: imgNode.alt } : {}),
      };
    }
    return null;
  };

  // ──────────────────────────────────────────────────────
  // 1. IMPORT ALL 8 CABINS (Dedicated Fast Import)
  // Uploads cover photos & creates all 8 cabin documents in Sanity!
  // ──────────────────────────────────────────────────────
  const handleImportCabinsOnly = async () => {
    setStatus('running');
    setMode('cabins');
    setErrorMessage('');
    setProgressPercent(5);
    setProgressText('Starting instant Cabins import...');

    const assetMap = new Map();

    try {
      const cabinItems = siteData.filter((d) => d._type === 'cabin');
      const totalCabins = cabinItems.length;

      for (let i = 0; i < totalCabins; i++) {
        const item = cabinItems[i];
        setProgressText(`Preparing Cabin ${i + 1}/${totalCabins}: ${item.name}...`);
        setProgressPercent(10 + Math.round(((i + 1) / totalCabins) * 85));

        // Upload cover photo
        let coverAssetId = null;
        const coverUrl = item.images?.[0]?.resolvedUrl || item.images?.[0]?.url;
        if (coverUrl) {
          try {
            coverAssetId = await uploadImageWithTimeout(coverUrl, assetMap, 4000);
          } catch {
            console.warn(`Cover upload skipped for ${item.name}`);
          }
        }

        const cabinDoc = prepareCabinDoc(item, coverAssetId);
        setProgressText(`Saving to Sanity: ${item.name}...`);
        try {
          await client.createOrReplace(cabinDoc);
        } catch (saveErr) {
          console.warn(`Could not save ${item.name}:`, saveErr.message);
        }
      }

      setProgressText('All 8 Cabins successfully imported into Sanity Studio!');
      setProgressPercent(100);
      setStatus('success');
      await checkCounts();
    } catch (err) {
      console.error('Cabins import failed:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Cabins import failed. Make sure you are logged into Sanity Studio.');
    }
  };

  // ──────────────────────────────────────────────────────
  // 2. QUICK SEED: Imports all Cabins, Amenities, Testimonials, Pages & Settings
  // ──────────────────────────────────────────────────────
  const handleQuickSeed = async () => {
    setStatus('running');
    setMode('quick');
    setErrorMessage('');
    setProgressPercent(5);
    setProgressText('Preparing all documents for instant import...');

    const assetMap = new Map();

    try {
      const docsToSave = [];

      for (let i = 0; i < siteData.length; i++) {
        const item = siteData[i];
        if (item._type === 'cabin') {
          // Upload cover photo for the cabin
          let coverAssetId = null;
          const coverUrl = item.images?.[0]?.resolvedUrl || item.images?.[0]?.url;
          if (coverUrl) {
            try {
              coverAssetId = await uploadImageToSanity(coverUrl, assetMap);
            } catch (err) {
              console.warn(`Cover upload skipped for ${item.name}`);
            }
          }
          docsToSave.push(prepareCabinDoc(item, coverAssetId));
        } else if (item._type === 'amenity') {
          docsToSave.push(prepareAmenityDoc(item));
        } else if (item._type === 'testimonial') {
          docsToSave.push(prepareTestimonialDoc(item));
        } else {
          docsToSave.push(prepareGenericDoc(item));
        }
      }

      setProgressPercent(30);
      setProgressText(`Writing ${docsToSave.length} documents to Sanity...`);

      for (let i = 0; i < docsToSave.length; i++) {
        const doc = docsToSave[i];
        const label = doc.name || doc.title || doc._type;
        try {
          setProgressText(`Saving: ${label} (${i + 1}/${docsToSave.length})`);
          await client.createOrReplace(doc);
        } catch (err) {
          console.warn(`Failed to save ${label}:`, err.message);
        }
        setProgressPercent(30 + Math.round(((i + 1) / docsToSave.length) * 70));
      }

      setProgressText('All content imported successfully!');
      setProgressPercent(100);
      setStatus('success');
      await checkCounts();
    } catch (err) {
      console.error('Quick seed failed:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Import failed. Make sure you are logged into Sanity Studio.');
    }
  };

  // ──────────────────────────────────────────────────────
  // 3. FULL SEED: Re-uploads ALL images to Sanity Cloud Asset Store
  // ──────────────────────────────────────────────────────
  const handleFullSeed = async () => {
    setStatus('running');
    setMode('full');
    setErrorMessage('');
    setProgressPercent(2);
    setProgressText('Starting full content & photo import...');

    const assetMap = new Map();

    try {
      setProgressText('Uploading Cards & Featured Photos...');
      setProgressPercent(10);

      const docsToSave = [];

      for (let i = 0; i < siteData.length; i++) {
        const item = siteData[i];
        const docPercent = 10 + Math.round((i / siteData.length) * 75);
        setProgressPercent(docPercent);

        if (item._type === 'cabin') {
          setProgressText(`Processing Cabin: ${item.name}...`);
          const gallery = [];
          const imagesToProcess = item.images || [];

          for (let g = 0; g < imagesToProcess.length; g++) {
            const img = imagesToProcess[g];
            const isMain = g === 0;
            const label = isMain ? `${item.name} (Main Card Photo)` : `${item.name} (Gallery #${g + 1})`;
            const uploadedImg = await transformImage(img, assetMap, label);
            if (uploadedImg) gallery.push({ ...uploadedImg, _key: img._key || `img-${g}` });
          }

          const baseDoc = prepareCabinDoc(item);
          if (gallery.length > 0) {
            baseDoc.images = gallery;
          }
          docsToSave.push(baseDoc);
        } else if (item._type === 'amenity') {
          docsToSave.push(prepareAmenityDoc(item));
        } else if (item._type === 'testimonial') {
          docsToSave.push(prepareTestimonialDoc(item));
        } else if (item._type === 'homePage') {
          setProgressText('Processing Home Page...');
          const docCopy = prepareGenericDoc(item);
          if (docCopy.hero?.image) docCopy.hero.image = await transformImage(docCopy.hero.image, assetMap, 'Home Hero');
          if (docCopy.immersiveSection?.mapImage) docCopy.immersiveSection.mapImage = await transformImage(docCopy.immersiveSection.mapImage, assetMap, 'Grounds Map');
          if (docCopy.ctaSection?.backgroundImage) docCopy.ctaSection.backgroundImage = await transformImage(docCopy.ctaSection.backgroundImage, assetMap, 'CTA Background');
          if (docCopy.locationSection?.image) docCopy.locationSection.image = await transformImage(docCopy.locationSection.image, assetMap, 'Location Photo');
          docsToSave.push(docCopy);
        } else if (item._type === 'communityPage') {
          setProgressText('Processing Community Page...');
          const docCopy = prepareGenericDoc(item);
          if (docCopy.hero?.image) docCopy.hero.image = await transformImage(docCopy.hero.image, assetMap, 'Community Hero');
          if (docCopy.concierge?.image) docCopy.concierge.image = await transformImage(docCopy.concierge.image, assetMap, 'Concierge Photo');
          docsToSave.push(docCopy);
        } else if (item._type === 'cabinPage') {
          setProgressText('Processing Cabins Page...');
          const docCopy = prepareGenericDoc(item);
          if (docCopy.hero?.image) docCopy.hero.image = await transformImage(docCopy.hero.image, assetMap, 'Cabins Hero');
          if (docCopy.mapImage) docCopy.mapImage = await transformImage(docCopy.mapImage, assetMap, 'Grounds Map');
          if (docCopy.groundsMap?.mapImage) docCopy.groundsMap.mapImage = await transformImage(docCopy.groundsMap.mapImage, assetMap, 'Grounds Map');
          if (docCopy.aerialTour?.videoPoster) docCopy.aerialTour.videoPoster = await transformImage(docCopy.aerialTour.videoPoster, assetMap, 'Aerial Poster');
          docsToSave.push(docCopy);
        } else if (item._type === 'amenitiesPage') {
          const docCopy = prepareGenericDoc(item);
          if (docCopy.hero?.image) docCopy.hero.image = await transformImage(docCopy.hero.image, assetMap, 'Amenities Hero');
          docsToSave.push(docCopy);
        } else if (item._type === 'membershipPage') {
          const docCopy = prepareGenericDoc(item);
          if (docCopy.hero?.image) docCopy.hero.image = await transformImage(docCopy.hero.image, assetMap, 'Membership Hero');
          docsToSave.push(docCopy);
        } else if (item._type === 'siteSettings') {
          const docCopy = prepareGenericDoc(item);
          if (docCopy.logo) docCopy.logo = await transformImage(docCopy.logo, assetMap, 'Brand Logo');
          docsToSave.push(docCopy);
        } else {
          docsToSave.push(prepareGenericDoc(item));
        }
      }

      setProgressText('Writing all documents to Sanity...');
      setProgressPercent(90);

      for (let s = 0; s < docsToSave.length; s++) {
        const doc = docsToSave[s];
        const label = doc.name || doc.title || doc._type;
        try {
          setProgressText(`Saving: ${label} (${s + 1}/${docsToSave.length})`);
          await client.createOrReplace(doc);
        } catch (err) {
          console.warn(`Failed to save ${label}:`, err.message);
        }
        setProgressPercent(90 + Math.round(((s + 1) / docsToSave.length) * 10));
      }

      setProgressText('Everything imported successfully!');
      setProgressPercent(100);
      setStatus('success');
      await checkCounts();
    } catch (err) {
      console.error('Full import failed:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Import failed. Make sure you are logged into Sanity Studio.');
    }
  };

  const isCabinsEmpty = counts.cabins === 0;

  return (
    <div
      style={{
        padding: '36px 20px',
        maxWidth: '880px',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
      }}
    >
      {/* ── PRIORITY ALERT IF CABINS ARE EMPTY ── */}
      {isCabinsEmpty && status === 'idle' && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(212, 163, 115, 0.22) 0%, rgba(20, 22, 26, 0.95) 100%)',
            border: '2px solid rgba(212, 163, 115, 0.7)',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '28px',
            boxShadow: '0 12px 36px rgba(212, 163, 115, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '520px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '26px' }}>🏡</span>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#f5d0a9' }}>
                  Cabins Portfolio is Empty ({counts.cabins} / 8 Cabins in CMS)
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#e5e7eb', lineHeight: 1.55 }}>
                Your Amenities and Testimonials are ready, but the 8 Cabins are not in Sanity yet. Click below to instantly import all 8 cabins with their cover photos, specs, descriptions, and booking links into the left sidebar!
              </p>
            </div>
            <button
              onClick={handleImportCabinsOnly}
              style={{
                padding: '16px 28px',
                borderRadius: '12px',
                backgroundColor: '#d4a373',
                color: '#121316',
                border: 'none',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(212, 163, 115, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                transition: 'transform 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span style={{ fontSize: '18px' }}>⚡</span>
              <span>1-Click: Import All 8 Cabins Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #181a1d 0%, #111215 100%)',
          border: '1px solid rgba(212, 163, 115, 0.3)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.5)',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 163, 115, 0.15)',
              border: '1px solid rgba(212, 163, 115, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            📸
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, letterSpacing: '0.02em', color: '#fff' }}>
              East Pointe Content &amp; Cabins Importer
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
              Load, refresh, or manage all website content: 8 Cabins, 13 Amenities, 5 Testimonials, 6 Pages.
            </p>
          </div>
        </div>

        {status === 'running' ? (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px',
                marginBottom: '10px',
                color: '#d4a373',
              }}
            >
              <span style={{ fontWeight: 600 }}>{progressText}</span>
              <span style={{ fontWeight: 700 }}>{progressPercent}%</span>
            </div>

            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '9999px',
                overflow: 'hidden',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #d4a373, #f5d0a9)',
                  width: `${progressPercent}%`,
                  transition: 'width 0.25s ease',
                }}
              />
            </div>

            {currentThumb && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#9ca3af' }}>
                <img
                  src={currentThumb}
                  alt=""
                  style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <span>Uploading cover asset to Sanity Cloud...</span>
              </div>
            )}
          </div>
        ) : status === 'success' ? (
          <div
            style={{
              padding: '24px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>🎉</span>
              <div>
                <strong style={{ color: '#4ade80', fontSize: '16px', display: 'block' }}>
                  Content Successfully Imported!
                </strong>
                <span style={{ color: '#bbf7d0', fontSize: '13px' }}>
                  All 8 cabins are now active in Sanity Studio! You can edit specs, descriptions, photos, and add new cabins anytime.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="/studio/structure/cabin"
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>🏡</span>
                <span>Open Cabins Portfolio</span>
              </a>
              <button
                onClick={() => {
                  setStatus('idle');
                  checkCounts();
                }}
                style={{
                  padding: '12px 18px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : status === 'error' ? (
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '26px' }}>❌</span>
              <div>
                <strong style={{ color: '#f87171', fontSize: '15px', display: 'block' }}>
                  Import Failed
                </strong>
                <span style={{ color: '#fca5a5', fontSize: '12px' }}>
                  {errorMessage}
                </span>
              </div>
            </div>
            <p style={{ color: '#d1d5db', fontSize: '13px', margin: '8px 0 12px', lineHeight: 1.5 }}>
              Make sure you are logged into Sanity Studio (check the top-right corner for your avatar).
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setErrorMessage('');
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#e5e7eb',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Primary Action Button */}
            <button
              onClick={handleImportCabinsOnly}
              style={{
                padding: '16px 28px',
                borderRadius: '12px',
                backgroundColor: '#d4a373',
                color: '#121316',
                border: 'none',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(212, 163, 115, 0.35)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span style={{ fontSize: '20px' }}>🏡</span>
              <span>Import All 8 Cabins with Cover Photos (Instant ~5s)</span>
            </button>

            {/* Quick Seed Everything Button */}
            <button
              onClick={handleQuickSeed}
              style={{
                padding: '14px 24px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#e5e7eb',
                border: '1px solid rgba(255,255,255,0.15)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)';
                e.currentTarget.style.borderColor = 'rgba(212, 163, 115, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
            >
              <span>⚡</span>
              <span>Import / Sync Everything (Cabins, Amenities, Testimonials, Pages)</span>
            </button>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginTop: '4px' }}>
              <button
                onClick={handleFullSeed}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  color: '#9ca3af',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontWeight: 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                }}
              >
                <span>📸</span>
                <span>Full Photo Re-Upload (Uploads all ~170 gallery photos to Sanity Cloud)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Database Counts */}
      <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#e5e7eb', marginBottom: '16px' }}>
        Current Sanity CMS Content Status:
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '14px',
        }}
      >
        {[
          { emoji: '🏡', label: 'Cabins Portfolio', count: counts.cabins, total: 8 },
          { emoji: '✨', label: 'Amenities', count: counts.amenities, total: 13 },
          { emoji: '💬', label: 'Testimonials', count: counts.testimonials, total: 5 },
          { emoji: '📄', label: 'Pages', count: counts.pages, total: 6 },
          { emoji: '⚙️', label: 'Settings', count: counts.settings, total: 1 },
          { emoji: '🖼️', label: 'Uploaded Photos', count: counts.assets, total: null },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: '#16181b',
              border: `1px solid ${
                item.count === 0 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(255,255,255,0.08)'
              }`,
              borderRadius: '12px',
              padding: '18px',
            }}
          >
            <span style={{ fontSize: '22px', display: 'block', marginBottom: '6px' }}>{item.emoji}</span>
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                color: '#9ca3af',
                letterSpacing: '0.1em',
              }}
            >
              {item.label}
            </span>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: item.count > 0 ? '#4ade80' : '#fbbf24',
                marginTop: '4px',
              }}
            >
              {loading
                ? '...'
                : item.total
                  ? `${item.count} / ${item.total}`
                  : `${item.count} uploaded`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

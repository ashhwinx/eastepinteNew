import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fullData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/siteData.full.json'), 'utf8'));

// Build lookup of image assets to get their URLs
const assetUrlMap = new Map();
fullData.filter(d => d._type === 'sanity.imageAsset').forEach(asset => {
  if (asset._id && asset.url) {
    assetUrlMap.set(asset._id, asset.url);
  }
});

console.log(`Loaded ${assetUrlMap.size} asset URLs from full dataset.`);

// Helper to attach resolvedUrl to image objects if missing
function enrichImage(img, fallbackUrl = '') {
  if (!img) {
    if (fallbackUrl) {
      return { _type: 'image', resolvedUrl: fallbackUrl };
    }
    return null;
  }
  const ref = img.asset?._ref || img._ref;
  const url = (ref && assetUrlMap.get(ref)) || img.resolvedUrl || img.url || fallbackUrl;
  return {
    ...img,
    _type: 'image',
    ...(url ? { resolvedUrl: url } : {})
  };
}

const preparedDocs = [];

for (const doc of fullData) {
  if (doc._type === 'sanity.imageAsset') continue; // Don't include raw asset docs in siteData.json

  const clean = { ...doc };
  delete clean._rev;
  delete clean._system;

  if (clean._type === 'cabin') {
    // Ensure cabin order
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
    clean.order = orderMap[clean.name] || clean.order || 99;

    // Ensure images have resolvedUrl
    if (clean.images && Array.isArray(clean.images)) {
      clean.images = clean.images.map(img => enrichImage(img)).filter(Boolean);
    } else {
      clean.images = [];
    }

    // Coming soon cabins fallback card images
    if (clean.images.length === 0) {
      let fallback = '';
      if (clean.name === 'HarborView' || clean.name === 'Harbor View') {
        fallback = 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=800';
      } else if (clean.name === 'TreeHaus') {
        fallback = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800';
      } else if (clean.name === 'RocHaus') {
        fallback = 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800';
      }
      if (fallback) {
        clean.images = [
          {
            _key: 'feat-1',
            _type: 'image',
            resolvedUrl: fallback,
            alt: `${clean.name} Card Photo`
          }
        ];
      }
    }
  } else if (clean._type === 'explorePage') {
    // Ensure discoverCards is populated from discoverSection if needed
    const cards = clean.discoverCards || clean.discoverSection?.cards || [];
    clean.discoverCards = cards.map((c, idx) => {
      const fallbackImgs = [
        '/Explore/ChiefsAndRoyals.avif',
        '/Explore/UnionStation.avif',
        '/Explore/PowerAndLight.avif',
        '/Explore/CountryPlaza.avif',
        '/Explore/Powell.webp'
      ];
      return {
        ...c,
        image: enrichImage(c.image, fallbackImgs[idx % fallbackImgs.length])
      };
    });

    if (clean.hero) {
      clean.hero.image = enrichImage(clean.hero.image, '/Explore/ExploreHero.avif');
    }
    if (clean.intro) {
      clean.intro.image = enrichImage(clean.intro.image, '/Explore/QuickDrive.avif');
    }
    if (clean.quoteSection) {
      clean.quoteSection.image = enrichImage(clean.quoteSection.backgroundImage || clean.quoteSection.image, 'https://cdn.sanity.io/images/jlknt03a/production/a9d0163ca73640855848dbda93e885b34aa3f9ff-1920x1144.jpg');
    }
  } else if (clean._type === 'communityPage') {
    if (clean.hero) {
      clean.hero.image = enrichImage(clean.hero.image, '/Community/CommunityHero.avif');
    }
    if (clean.concierge) {
      clean.concierge.image = enrichImage(clean.concierge.image, '/Community/Corporate.avif');
    }
    const eventCardsFallback = [
      {
        title: "Intimate Weddings",
        description: 'Say "I do" with the lake as your witness. Our grounds provide a stunning, natural cathedral for ceremonies up to 50 guests.',
        image: "/Community/Wedding.avif",
        icon: "Heart",
        features: ["Lakeside Ceremonies", "Bridal Cabin Packages", "Photography Access"]
      },
      {
        title: "Family Reunions",
        description: "Reconnect without distractions. Book multiple cabins to keep the family close while giving everyone their own private space.",
        image: "/Community/Reunion.avif",
        icon: "Users",
        features: ["Communal Fire Pits", "Large Group Dining", "Safe Kids Play Areas"]
      },
      {
        title: "Corporate Retreats",
        description: "Step away from the boardroom. Our inspiring environment fosters creativity, team bonding, and strategic thinking.",
        image: "/Community/Corporate.avif",
        icon: "Briefcase",
        features: ["High-Speed Wifi", "Team Building Activities", "Catering Partners"]
      }
    ];
    clean.eventCards = (clean.eventCards || eventCardsFallback).map((card, idx) => {
      const fb = eventCardsFallback[idx] || eventCardsFallback[0];
      return {
        _key: card._key || `event-${idx}`,
        title: card.title || fb.title,
        description: card.description || fb.description,
        icon: card.icon || fb.icon,
        features: card.features || fb.features,
        image: enrichImage(card.image, fb.image)
      };
    });
  } else if (clean._type === 'homePage') {
    if (clean.hero) {
      clean.hero.image = enrichImage(clean.hero.image, '/LandingImage.avif');
    }
    if (clean.carouselItems) {
      clean.carouselItems = clean.carouselItems.map(item => ({
        ...item,
        image: enrichImage(item.image)
      }));
    }
    if (clean.experiences?.items) {
      clean.experiences.items = clean.experiences.items.map(item => ({
        ...item,
        image: enrichImage(item.image)
      }));
    }
    if (clean.immersiveSection) {
      clean.immersiveSection.mapImage = enrichImage(clean.immersiveSection.mapImage, '/Map.avif');
      clean.immersiveSection.image = enrichImage(clean.immersiveSection.image || clean.immersiveSection.mapImage, '/Map.avif');
    }
    if (clean.ctaSection) {
      clean.ctaSection.backgroundImage = enrichImage(clean.ctaSection.backgroundImage, 'https://cdn.sanity.io/images/jlknt03a/production/4014eb811749eca36e55c9750a8b4a5333cd1f26-1600x1200.avif');
    }
    if (clean.locationSection) {
      clean.locationSection.image = enrichImage(clean.locationSection.image, '/Map.avif');
    }
  } else if (clean._type === 'cabinPage') {
    if (clean.hero) {
      clean.hero.image = enrichImage(clean.hero.image, 'https://cdn.sanity.io/images/jlknt03a/production/bc38d7f51bc7c8d07db3f826daff8205985d8d59-1080x720.avif');
    }
    clean.mapImage = enrichImage(clean.mapImage, '/Map.avif');
    if (!clean.groundsMap) clean.groundsMap = {};
    clean.groundsMap.mapImage = enrichImage(clean.groundsMap.mapImage || clean.mapImage, '/Map.avif');
    if (clean.aerialTour) {
      clean.aerialTour.videoPoster = enrichImage(clean.aerialTour.videoPoster, 'https://cdn.sanity.io/images/jlknt03a/production/852dc7bb39c4f4b209343cea30ef6d052fe21627-836x627.avif');
    }
  } else if (clean._type === 'amenitiesPage') {
    if (clean.hero) {
      clean.hero.image = enrichImage(clean.hero.image, '/Amenities/AmenitiesHero.jpeg');
    }
  } else if (clean._type === 'membershipPage') {
    if (clean.hero) {
      clean.hero.image = enrichImage(clean.hero.image, '/Membership/MembershipHero.avif');
    }
  }

  preparedDocs.push(clean);
}

// Ensure siteSettings document is present
const hasSiteSettings = preparedDocs.some(d => d._type === 'siteSettings');
if (!hasSiteSettings) {
  preparedDocs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'East Pointe',
    tagline: 'Lake Cabin Experience',
    logo: {
      _type: 'image',
      resolvedUrl: '/logo.avif'
    },
    email: 'nick@eastpointekc.com',
    phone: '+1 (816) 255-8683',
    phoneLink: 'tel:+18162558683',
    address: 'Lake Lafayette, Odessa, Missouri 64076',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.9458417,-93.9713331',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12435.5!2d-93.9713331!3d38.9458417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c169965ad4a83d%3A0x1b1bb606912fe188!2sLake%20Lafayette!5e0!3m2!1sen!2sus!4v1709900000000!5m2!1sen!2sus',
    socialLinks: [
      { _key: 's1', platform: 'Instagram', url: 'https://www.instagram.com/eastpointekc/' },
      { _key: 's2', platform: 'Facebook', url: 'https://www.facebook.com' },
      { _key: 's3', platform: 'Twitter', url: 'https://twitter.com' },
    ],
    footerDescription: 'Redefining the cabin experience. Where luxury meets wilderness, and guests become family. Experience nature without compromise.',
    copyrightText: 'East Pointe Collections. All rights reserved.',
    officeHours: 'Open year round!',
  });
}

fs.writeFileSync(path.resolve(__dirname, '../src/data/siteData.json'), JSON.stringify(preparedDocs, null, 2));
console.log(`Saved ${preparedDocs.length} fully enriched documents to src/data/siteData.json!`);

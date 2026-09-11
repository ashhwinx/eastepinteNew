import siteData from './siteData.json';

// Helper to look up documents by _type
export function getDocByType(type) {
  return siteData.find(d => d._type === type) || null;
}

export function getDocsByType(type) {
  return siteData.filter(d => d._type === type);
}

export function getSiteSettings() {
  return {
    siteName: "East Pointe",
    tagline: "Lake Cabin Experience",
    logo: "/logo.avif",
    email: "nick@eastpointekc.com",
    phone: "+1 (816) 255-8683",
    phoneLink: "tel:+18162558683",
    address: "Lake Lafayette, Odessa, Missouri 64076",
    googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=38.9458417,-93.9713331",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12435.5!2d-93.9713331!3d38.9458417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c169965ad4a83d%3A0x1b1bb606912fe188!2sLake%20Lafayette!5e0!3m2!1sen!2sus!4v1709900000000!5m2!1sen!2sus",
    socialLinks: [
      { platform: "Instagram", url: "https://www.instagram.com/eastpointekc/" },
      { platform: "Facebook", url: "#" },
      { platform: "Twitter", url: "#" }
    ],
    footerDescription: "Redefining the cabin experience. Where luxury meets wilderness, and guests become family. Experience nature without compromise.",
    copyrightText: "East Pointe Collections. All rights reserved.",
    officeHours: "Open year round!"
  };
}

export function getHomePage() {
  return getDocByType('homePage');
}

export function getTestimonials() {
  return getDocsByType('testimonial');
}

export function getCabins() {
  const cabins = getDocsByType('cabin');
  
  // Normalized image arrays from Sanity
  const normalized = cabins.map(c => {
    let images = [];
    if (c.images && Array.isArray(c.images)) {
      images = c.images.map(img => {
        if (typeof img === 'string') return img;
        if (img?.resolvedUrl) return img.resolvedUrl;
        if (img?.asset?.url) return img.asset.url;
        return "";
      }).filter(Boolean);
    }
    return {
      ...c,
      images,
      desc: c.description || c.desc || ""
    };
  });

  // Custom ordering matching East Pointe live site:
  // 1: Bayview, 2: Aston Harbor, 3: Aspire, 4: Cedar Pointe, 5: Byrd's Nest, 6: Harbor View, 7: TreeHaus, 8: RocHaus
  const orderMap = {
    "East Pointe Bayview": 1,
    "Aston Harbor": 2,
    "Aspire": 3,
    "Cedar Pointe": 4,
    "Byrd's Nest": 5,
    "Harbor View": 6,
    "HarborView": 6,
    "TreeHaus": 7,
    "RocHaus": 8
  };

  return normalized.sort((a, b) => {
    const orderA = orderMap[a.name] || 99;
    const orderB = orderMap[b.name] || 99;
    return orderA - orderB;
  });
}

export function getCabinPage() {
  return getDocByType('cabinPage');
}

export function getAmenitiesPage() {
  return getDocByType('amenitiesPage');
}

export function getAmenities() {
  const amenities = getDocsByType('amenity');
  return amenities.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getCommunityPage() {
  return getDocByType('communityPage');
}

export function getExplorePage() {
  return getDocByType('explorePage');
}

export function getMembershipPage() {
  return getDocByType('membershipPage');
}

// Utility to resolve image URL from object or string
export function resolveImage(img, fallback = "") {
  if (!img) return fallback;
  if (typeof img === 'string') return img;
  if (img.resolvedUrl) return img.resolvedUrl;
  if (img.asset && img.asset.url) return img.asset.url;
  return fallback;
}

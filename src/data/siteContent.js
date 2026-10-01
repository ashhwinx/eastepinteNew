import { useState, useEffect } from 'react';
import siteData from './siteData.json';
import { activeDataStore } from '../sanity/SanityContext';
import { urlFor } from '../sanity/client';

// Helper to look up documents from active store or fallback json
export function getDocByType(type) {
  if (activeDataStore.data && activeDataStore.data[type]) {
    return activeDataStore.data[type];
  }
  return siteData.find((d) => d._type === type) || null;
}

export function getDocsByType(type) {
  if (type === 'cabin' && activeDataStore.data?.cabins?.length > 0) {
    return activeDataStore.data.cabins;
  }
  if (type === 'amenity' && activeDataStore.data?.amenities?.length > 0) {
    return activeDataStore.data.amenities;
  }
  if (type === 'testimonial' && activeDataStore.data?.testimonials?.length > 0) {
    return activeDataStore.data.testimonials;
  }
  return siteData.filter((d) => d._type === type);
}

const defaultSettings = {
  siteTitle: "East Pointe | Lake Cabin Experience",
  siteName: "East Pointe",
  tagline: "Lake Cabin Experience",
  logo: "/logo.avif",
  favicon: "/logo.avif",
  metaDescription: "East Pointe: Luxury lake cabin experience and community nestled in nature near Kansas City. Book your perfect getaway today.",
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

export function getSiteSettings() {
  const cmsSettings = activeDataStore.data?.siteSettings || getDocByType('siteSettings');
  if (!cmsSettings) return defaultSettings;

  const siteTitle = cmsSettings.siteTitle || (
    cmsSettings.siteName
      ? `${cmsSettings.siteName} | ${cmsSettings.tagline || 'Lake Cabin Experience'}`
      : defaultSettings.siteTitle
  );

  return {
    ...defaultSettings,
    ...cmsSettings,
    siteTitle,
    logo: resolveImage(cmsSettings.logo, defaultSettings.logo),
    favicon: resolveImage(cmsSettings.favicon, defaultSettings.favicon),
    metaDescription: cmsSettings.metaDescription || defaultSettings.metaDescription,
    socialLinks: (cmsSettings.socialLinks && cmsSettings.socialLinks.length > 0)
      ? cmsSettings.socialLinks
      : defaultSettings.socialLinks,
  };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(() => getSiteSettings());

  useEffect(() => {
    setSettings(getSiteSettings());
    const unsub = activeDataStore.subscribe(() => {
      setSettings(getSiteSettings());
    });
    return unsub;
  }, []);

  return settings;
}


export const defaultTestimonials = [
  {
    _id: "t1",
    _type: "testimonial",
    name: "Mendy & Jeff Bigalow",
    location: "Sioux Falls, South Dakota",
    cabinStayed: "Lakeside Getaway",
    quote: "Such a nice place to stay. Comfortable and very relaxing. The photos don't do it justice. Looking forward to visiting again, and next time I'd love to try one of the other cabins on the property.",
    rating: 5,
    order: 1
  },
  {
    _id: "t2",
    _type: "testimonial",
    name: "Stalin Gomes",
    location: "Ft. Worth, TX",
    cabinStayed: "Weekend Retreat",
    quote: "This place is exactly as described and more. The place is clean, tidy, spacious and quiet. It also has a very nice lake nearby. They were very flexible about checking in and checking out. Overall it was a great experience!",
    rating: 5,
    order: 2
  },
  {
    _id: "t3",
    _type: "testimonial",
    name: "Sarah Jenkins",
    location: "Atlanta, GA",
    cabinStayed: "Couples Escape",
    quote: "The most restorative weekend of my life. The cabin was impeccable, and the silence of the forest was exactly what we needed.",
    rating: 5,
    order: 3
  },
  {
    _id: "t4",
    _type: "testimonial",
    name: "Michael & David",
    location: "Charlotte, NC",
    cabinStayed: "Aston Harbor",
    quote: "East Pointe thought of everything. From the pre-stocked firewood to the locally sourced coffee awaiting our arrival. Pure magic.",
    rating: 5,
    order: 4
  },
  {
    _id: "t5",
    _type: "testimonial",
    name: "The Thompson Family",
    location: "Nashville, TN",
    cabinStayed: "East Pointe Bayview",
    quote: "We hosted our family reunion here. The communal spaces were perfect for gathering, yet everyone had their own private retreat.",
    rating: 5,
    order: 5
  }
];

export function getHomePage() {
  return activeDataStore.data?.homePage || getDocByType('homePage');
}

export function useHomePage() {
  const [homePage, setHomePage] = useState(() => getHomePage());

  useEffect(() => {
    setHomePage(getHomePage());
    const unsubscribe = activeDataStore.subscribe(() => {
      setHomePage(getHomePage());
    });
    return unsubscribe;
  }, []);

  return homePage;
}

export function getTestimonials() {
  const cmsTestimonials = activeDataStore.data?.testimonials || [];
  if (cmsTestimonials.length > 0) {
    return [...cmsTestimonials].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }
  const fileTestimonials = getDocsByType('testimonial');
  if (fileTestimonials.length > 0) {
    return [...fileTestimonials].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }
  return defaultTestimonials;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState(() => getTestimonials());

  useEffect(() => {
    setTestimonials(getTestimonials());
    const unsubscribe = activeDataStore.subscribe(() => {
      setTestimonials(getTestimonials());
    });
    return unsubscribe;
  }, []);

  return testimonials;
}

export function useCabins() {
  const [cabins, setCabins] = useState(() => getCabins());

  useEffect(() => {
    setCabins(getCabins());
    const unsubscribe = activeDataStore.subscribe(() => {
      setCabins(getCabins());
    });
    return unsubscribe;
  }, []);

  return cabins;
}

export function getCabins() {
  const defaultCabins = siteData.filter((d) => d._type === 'cabin');
  const cmsCabins = activeDataStore.data?.cabins || [];

  let listToProcess = [];

  if (cmsCabins && cmsCabins.length > 0) {
    // Sanity CMS is active — use Sanity as the primary source of truth!
    listToProcess = cmsCabins.map((cms) => {
      // Find default cabin fallback by ID or name to supplement missing gallery photos or specs
      const fallback = defaultCabins.find(
        (d) =>
          d._id === cms._id ||
          (d.name && cms.name && d.name.toLowerCase().trim() === cms.name.toLowerCase().trim())
      );

      // Merge images: prioritize CMS images, fallback to imageUrls, then fallback cabin images
      let images = [];
      if (cms.images && Array.isArray(cms.images) && cms.images.length > 0) {
        images = cms.images.map((img) => resolveImage(img)).filter(Boolean);
      }
      if (images.length === 0 && cms.imageUrls && Array.isArray(cms.imageUrls)) {
        images = cms.imageUrls.filter(Boolean);
      }
      if (images.length === 0 && fallback?.images && Array.isArray(fallback.images)) {
        images = fallback.images.map((img) => resolveImage(img)).filter(Boolean);
      }

      return {
        ...(fallback || {}),
        ...cms,
        images,
        desc: cms.desc || cms.description || fallback?.description || fallback?.desc || '',
      };
    });
  } else {
    // CMS is empty or loading — use default fallback cabins
    listToProcess = defaultCabins.map((c) => ({
      ...c,
      images: (c.images || []).map((img) => resolveImage(img)).filter(Boolean),
      desc: c.description || c.desc || '',
    }));
  }

  // Custom ordering matching East Pointe live site
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

  return listToProcess.sort((a, b) => {
    const orderA = a.order !== undefined && a.order !== null ? a.order : (orderMap[a.name] ?? 99);
    const orderB = b.order !== undefined && b.order !== null ? b.order : (orderMap[b.name] ?? 99);
    return orderA - orderB;
  });
}

export function getCabinPage() {
  return activeDataStore.data?.cabinPage || getDocByType('cabinPage');
}

export function getAmenitiesPage() {
  return activeDataStore.data?.amenitiesPage || getDocByType('amenitiesPage');
}

export function getAmenities() {
  const amenities = getDocsByType('amenity');
  return amenities.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getCommunityPage() {
  return activeDataStore.data?.communityPage || getDocByType('communityPage');
}

export function getExplorePage() {
  return activeDataStore.data?.explorePage || getDocByType('explorePage');
}

export function getMembershipPage() {
  return activeDataStore.data?.membershipPage || getDocByType('membershipPage');
}

// Robust utility to resolve image URL from Sanity asset, object, or string
export function resolveImage(img, fallback = "") {
  if (!img) return fallback;
  if (typeof img === 'string') return img;
  if (img.resolvedUrl) return img.resolvedUrl;
  if (img.asset && img.asset.url) return img.asset.url;

  // Try urlFor with Sanity client image builder
  try {
    const built = urlFor(img);
    if (built) {
      if (typeof built.url === 'function') {
        return built.auto('format').fit('max').url();
      }
      return String(built);
    }
  } catch {
    // ignore
  }

  return fallback;
}

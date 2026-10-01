import React, { createContext, useContext, useState, useEffect } from 'react';
import { client, previewClient } from './client';
import siteData from '../data/siteData.json';

// Initialize default store from local siteData.json
function getInitialDocs() {
  const getDoc = (type) => siteData.find((d) => d._type === type) || null;
  const getDocs = (type) => siteData.filter((d) => d._type === type);

  return {
    homePage: getDoc('homePage'),
    cabinPage: getDoc('cabinPage'),
    amenitiesPage: getDoc('amenitiesPage'),
    communityPage: getDoc('communityPage'),
    explorePage: getDoc('explorePage'),
    membershipPage: getDoc('membershipPage'),
    cabins: getDocs('cabin'),
    amenities: getDocs('amenity'),
    testimonials: getDocs('testimonial'),
    siteSettings: getDoc('siteSettings'),
  };
}

export const activeDataStore = {
  data: getInitialDocs(),
  listeners: new Set(),
  update(newData) {
    this.data = { ...this.data, ...newData };
    this.listeners.forEach((listener) => listener(this.data));
  },
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
};

const SanityContext = createContext({
  ...activeDataStore.data,
  isLoading: false,
  isLive: false,
  refresh: () => {},
});

const ALL_CONTENT_QUERY = `
{
  "homePage": *[_type == "homePage"][0],
  "cabinPage": *[_type == "cabinPage"][0],
  "amenitiesPage": *[_type == "amenitiesPage"][0],
  "communityPage": *[_type == "communityPage"][0],
  "explorePage": *[_type == "explorePage"][0],
  "membershipPage": *[_type == "membershipPage"][0],
  "cabins": *[_type == "cabin"] | order(order asc) {
    ...,
    "images": images[]{
      ...,
      "resolvedUrl": asset->url
    }
  },
  "amenities": *[_type == "amenity"] | order(order asc) {
    ...,
    "resolvedUrl": image.asset->url
  },
  "testimonials": *[_type == "testimonial"] | order(order asc),
  "siteSettings": *[_type == "siteSettings"][0] {
    ...,
    "logo": {
      ...,
      "resolvedUrl": logo.asset->url
    },
    "favicon": {
      ...,
      "resolvedUrl": favicon.asset->url
    }
  }
}
`;

export function SanityProvider({ children }) {
  const [data, setData] = useState(activeDataStore.data);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const fetchLiveContent = async () => {
    try {
      const res = await previewClient.fetch(ALL_CONTENT_QUERY);
      if (res) {
        const merged = { ...activeDataStore.data };
        if (res.homePage) merged.homePage = res.homePage;
        if (res.cabinPage) merged.cabinPage = res.cabinPage;
        if (res.amenitiesPage) merged.amenitiesPage = res.amenitiesPage;
        if (res.communityPage) merged.communityPage = res.communityPage;
        if (res.explorePage) merged.explorePage = res.explorePage;
        if (res.membershipPage) merged.membershipPage = res.membershipPage;
        if (res.cabins && res.cabins.length > 0) merged.cabins = res.cabins;
        if (res.amenities && res.amenities.length > 0) merged.amenities = res.amenities;
        if (res.testimonials && res.testimonials.length > 0) merged.testimonials = res.testimonials;
        if (res.siteSettings) merged.siteSettings = res.siteSettings;

        activeDataStore.update(merged);
        setData(merged);
        setIsLive(true);
      }
    } catch (err) {
      console.warn('[Sanity CMS] Falling back to local data:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveContent();

    // Subscribe to live Sanity updates if possible
    let subscription = null;
    try {
      subscription = client
        .listen(
          `*[_type in [
            "homePage", "cabinPage", "amenitiesPage", "communityPage",
            "explorePage", "membershipPage", "cabin", "amenity",
            "testimonial", "siteSettings"
          ]]`
        )
        .subscribe(() => {
          fetchLiveContent();
        });
    } catch {
      // Offline fallback
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <SanityContext.Provider value={{ ...data, isLoading, isLive, refresh: fetchLiveContent }}>
      {children}
    </SanityContext.Provider>
  );
}

export function useSanity() {
  return useContext(SanityContext);
}

import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '9fz0fnwv';
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-03-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `false` if you want fresh data immediately on edit
  perspective: 'published',
});

// Real-time / preview client without CDN cache
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
});

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source) {
  if (!source) return null;
  // If it's already a string URL
  if (typeof source === 'string') return source;
  // If source has resolvedUrl
  if (source.resolvedUrl) return source.resolvedUrl;
  // If source has direct asset.url
  if (source.asset && source.asset.url) return source.asset.url;
  // If it's a Sanity image asset object or reference
  try {
    return builder.image(source);
  } catch {
    return null;
  }
}

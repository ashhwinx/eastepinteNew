import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'cabin',
  title: 'Cabin',
  type: 'document',
  groups: [
    { name: 'general', title: 'General Info', default: true },
    { name: 'specs', title: 'Specs & Capacity' },
    { name: 'details', title: 'Description & Features' },
    { name: 'gallery', title: 'Photo Gallery' },
  ],
  fields: [
    // 1. General Info
    defineField({
      name: 'name',
      title: 'Cabin Name',
      type: 'string',
      group: 'general',
      description: 'e.g. "East Pointe Bayview" or "Pinecrest Cabin"',
      validation: (Rule) => Rule.required().error('Cabin name is required'),
    }),
    defineField({
      name: 'status',
      title: 'Availability Status',
      type: 'string',
      group: 'general',
      options: {
        list: [
          { title: 'Available', value: 'Available' },
          { title: 'Coming Soon', value: 'Coming Soon' },
        ],
        layout: 'radio',
      },
      initialValue: 'Available',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'general',
      description: 'Sort position on the Cabins page (e.g. 1, 2, 3... 9 for a new cabin)',
      initialValue: 9,
    }),
    defineField({
      name: 'location',
      title: 'Location Label',
      type: 'string',
      group: 'general',
      description: 'Default is "Odessa, MO"',
      initialValue: 'Odessa, MO',
    }),
    defineField({
      name: 'bookingLink',
      title: 'Booking Link URL',
      type: 'url',
      group: 'general',
      description: 'Direct booking link (Airbnb, VRBO, or East Pointe reservation URL)',
    }),

    // 2. Specs & Capacity
    defineField({
      name: 'sleeps',
      title: 'Sleeps / Guests Capacity',
      type: 'string',
      group: 'specs',
      description: 'e.g. "4", "6", "10 - 13"',
    }),
    defineField({
      name: 'bedrooms',
      title: 'Bedrooms Display',
      type: 'string',
      group: 'specs',
      description: 'e.g. "2 King Suites" or "3 Bedrooms + Loft" or "Studio"',
    }),
    defineField({
      name: 'baths',
      title: 'Bathrooms (Number)',
      type: 'number',
      group: 'specs',
      description: 'e.g. 1, 2, 2.5, 3',
    }),
    defineField({
      name: 'sqFt',
      title: 'Square Footage',
      type: 'string',
      group: 'specs',
      description: 'e.g. "3,200"',
    }),

    // 3. Description & Features
    defineField({
      name: 'desc',
      title: 'About the Space Description',
      type: 'text',
      group: 'details',
      rows: 5,
      description: 'Detailed overview of the cabin experience, views, and unique vibe.',
    }),
    defineField({
      name: 'features',
      title: 'Property Highlights (Bullet Points)',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      description: 'e.g. "Private Hot Tub", "Lakeside Deck", "Smart Lock 24/7 Self Check-in"',
    }),
    defineField({
      name: 'sleepingArrangements',
      title: 'Sleeping Arrangements',
      type: 'array',
      group: 'details',
      description: 'Breakdown of bedrooms and beds',
      of: [
        {
          type: 'object',
          name: 'sleepingArrangement',
          title: 'Sleeping Arrangement',
          fields: [
            { name: 'room', type: 'string', title: 'Room Name (e.g. Master Suite, Loft, Bedroom 2)' },
            { name: 'bed', type: 'string', title: 'Bed Type (e.g. 1 King Bed, 2 Queens, Bunk Beds)' },
          ],
          preview: {
            select: {
              title: 'room',
              subtitle: 'bed',
            },
          },
        },
      ],
    }),

    // 4. Photo Gallery
    defineField({
      name: 'images',
      title: 'Cabin Photo Gallery',
      type: 'array',
      group: 'gallery',
      description: 'Upload high-resolution photos. The first image will automatically be the main card cover photo.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text / Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'imageUrls',
      title: 'Preloaded CDN Photo URLs (Fallback)',
      type: 'array',
      group: 'gallery',
      description: 'High-res gallery image links from CDN. Photos uploaded above take priority.',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'status',
      order: 'order',
      media: 'images.0',
    },
    prepare({ title, subtitle, order, media }) {
      return {
        title: title || 'Untitled Cabin',
        subtitle: `${order ? `#${order} • ` : ''}${subtitle || 'Available'}`,
        media,
      };
    },
  },
});

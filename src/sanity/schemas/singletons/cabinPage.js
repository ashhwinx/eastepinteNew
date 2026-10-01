import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'cabinPage',
  title: 'Cabins Page',
  type: 'document',
  initialValue: {
    hero: {
      title: 'Lake Cabin Collection',
      subtitle:
        "Discover our range of cabins designed to accommodate all group sizes, whether you're planning a cozy getaway for two or a lively retreat for a large gathering.",
    },
    intro: {
      badge: 'The Collection',
      title: 'Uniquely Crafted Escapes',
      subtitle:
        'Each cabin at East Pointe has been individually designed to offer its own distinct character, architectural charm, and bespoke luxury amenities.',
    },
    aerialTour: {
      videoUrl:
        'https://res.cloudinary.com/dusub2qg5/video/upload/v1769971765/EastPointeAerial_ve13um.mp4',
      badgeText: 'Aerial Tour',
    },
    groundsMap: {
      badgeText: 'Property Layout',
      title: 'Grounds Map',
      subtitle:
        'Get oriented with our property layout showing cabin locations, lake access points, and walking trails throughout the estate.',
    },
    comeSeeUs: {
      badge: 'Visit Us',
      title: 'Come See Us',
      subtitle: 'Visit our offices to explore our stunning lakeside cabins!',
      description:
        'Experience the serene surroundings firsthand and discover your perfect getaway. We look forward to welcoming you!',
    },
  },
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Main Heading', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 },
        { name: 'image', title: 'Hero Background Image', type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Portfolio Intro Section',
      type: 'object',
      fields: [
        { name: 'badge', title: 'Badge Text', type: 'string' },
        { name: 'title', title: 'Heading', type: 'string' },
        { name: 'subtitle', title: 'Description / Paragraph', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'aerialTour',
      title: 'Aerial Video Tour Section',
      type: 'object',
      fields: [
        {
          name: 'videoUrl',
          title: 'Aerial Video URL (MP4, Cloudinary, YouTube, or Vimeo)',
          type: 'url',
          description: 'Direct link to the aerial tour video (e.g. Cloudinary .mp4 URL)',
        },
        {
          name: 'videoPoster',
          title: 'Video Poster / Thumbnail Image',
          type: 'image',
          options: { hotspot: true },
        },
        {
          name: 'badgeText',
          title: 'Badge Label (e.g. Aerial Tour)',
          type: 'string',
          initialValue: 'Aerial Tour',
        },
      ],
    }),
    defineField({
      name: 'groundsMap',
      title: 'Property & Grounds Map',
      type: 'object',
      fields: [
        {
          name: 'mapImage',
          title: 'Grounds Map Image',
          type: 'image',
          options: { hotspot: true },
        },
        {
          name: 'badgeText',
          title: 'Map Badge Label',
          type: 'string',
          initialValue: 'Property Layout',
        },
        {
          name: 'title',
          title: 'Heading',
          type: 'string',
          initialValue: 'Grounds Map',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          initialValue: 'Click to explore property layout and trails',
        },
      ],
    }),
    defineField({
      name: 'mapImage',
      title: 'Grounds Map Image (Direct/Legacy)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'comeSeeUs',
      title: 'Come See Us Section',
      type: 'object',
      fields: [
        { name: 'badge', title: 'Badge Text', type: 'string' },
        { name: 'title', title: 'Heading', type: 'string' },
        { name: 'subtitle', title: 'Subheading', type: 'string' },
        { name: 'description', title: 'Paragraph Description', type: 'text', rows: 3 },
        { name: 'image', title: 'Section Image', type: 'image', options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'hero.title',
      subtitle: 'hero.subtitle',
      media: 'hero.image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Cabins Page',
        subtitle: subtitle || 'Aerial Tour, Grounds Map & Portfolio',
        media,
      };
    },
  },
});

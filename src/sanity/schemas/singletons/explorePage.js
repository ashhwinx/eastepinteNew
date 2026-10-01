import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'explorePage',
  title: 'Explore Page',
  type: 'document',
  initialValue: {
    hero: {
      title: 'Explore the Region',
      subtitle:
        'Your ideal lake getaway, just a quick drive from the heart of Kansas City.',
    },
    intro: {
      badge: 'The Best of Both Worlds',
      title: 'A Quick Drive from KC',
      subtitle:
        'Escape the hustle and bustle of the city and enjoy a stay at our charming lake cabins in Odessa, MO. Perfectly situated just outside the Kansas City Metropolitan area, East Pointe offers the ultimate compromise: rugged seclusion when you want it, and city excitement when you need it.',
    },
    discoverCards: [
      {
        category: 'Championship City',
        title: 'Chiefs & Royals',
        description:
          'Experience the thrill of Arrowhead Stadium or a classic ballgame at Kauffman Stadium. A short drive for an unforgettable game day.',
        icon: 'Trophy',
        isWide: false,
      },
      {
        category: 'History & Arts',
        title: 'Union Station & Museums',
        description:
          'Visit the iconic Union Station, the beautiful Nelson-Atkins Museum of Art, and the National WWI Museum.',
        icon: 'Landmark',
        isWide: false,
      },
      {
        category: 'Nightlife',
        title: 'Power & Light District',
        description:
          'Immerse yourself in the rhythm of the 18th & Vine Jazz District or the vibrant energy of the Power & Light District.',
        icon: 'Music',
        isWide: false,
      },
      {
        category: 'Shopping & Dining',
        title: 'Country Club Plaza',
        description:
          'Enjoy premier shopping and indulge in legendary Kansas City BBQ at renowned restaurants throughout the city.',
        icon: 'ShoppingBag',
        isWide: false,
      },
      {
        category: 'Nature & Flora',
        title: 'Powell Gardens',
        description:
          "Kansas City's premier botanical garden, set on 970 acres of lush meadows and diverse gardens just minutes away.",
        icon: 'Leaf',
        isWide: true,
      },
    ],
    quoteSection: {
      quote:
        "Experience the tranquility of lakeside living while maintaining easy access to the city's excitement.",
      author: 'Nick & The East Pointe Team',
    },
  },
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Heading', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 },
        { name: 'image', title: 'Hero Background Image', type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Intro Section',
      type: 'object',
      fields: [
        { name: 'badge', title: 'Badge', type: 'string' },
        { name: 'title', title: 'Heading', type: 'string' },
        { name: 'subtitle', title: 'Description', type: 'text', rows: 3 },
        { name: 'image', title: 'Intro Feature Image', type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'discoverCards',
      title: 'Discover Attractions Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'category', title: 'Category (e.g. Championship City, History & Arts)', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'image', title: 'Attraction Image', type: 'image', options: { hotspot: true } },
            { name: 'icon', title: 'Icon Name (e.g. Trophy, Landmark, Music, ShoppingBag, Leaf)', type: 'string' },
            { name: 'isWide', title: 'Full-Width Card (e.g. for Powell Gardens)', type: 'boolean', initialValue: false },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'category',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Attraction Card',
                subtitle: subtitle || 'Attraction',
                media,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'quoteSection',
      title: 'Featured Quote Section',
      type: 'object',
      fields: [
        { name: 'quote', title: 'Quote Text', type: 'text', rows: 3 },
        { name: 'author', title: 'Quote Author / Attribution', type: 'string' },
        { name: 'image', title: 'Background / Accent Image', type: 'image', options: { hotspot: true } },
        { name: 'backgroundImage', title: 'Background Image (Alternate)', type: 'image', options: { hotspot: true } },
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
        title: title || 'Explore Page',
        subtitle: subtitle || 'Local Attractions & Kansas City Guide',
        media,
      };
    },
  },
});

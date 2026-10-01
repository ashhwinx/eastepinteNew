import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'communityPage',
  title: 'Community Page',
  type: 'document',
  initialValue: {
    hero: {
      title: 'Gather & Celebrate',
      subtitle: 'Create lasting memories in the heart of nature.',
    },
    intro: {
      badge: 'Special Gatherings',
      title: 'Unforgettable Events',
      subtitle:
        'From intimate lakeside weddings to inspiring corporate retreats, East Pointe offers the perfect natural backdrop for your most cherished occasions.',
    },
    eventCards: [
      {
        title: 'Intimate Weddings',
        description:
          'Say "I do" with the lake as your witness. Our grounds provide a stunning, natural cathedral for ceremonies up to 50 guests.',
        icon: 'Heart',
        features: ['Lakeside Ceremonies', 'Bridal Cabin Packages', 'Photography Access'],
      },
      {
        title: 'Family Reunions',
        description:
          'Reconnect without distractions. Book multiple cabins to keep the family close while giving everyone their own private space.',
        icon: 'Users',
        features: ['Communal Fire Pits', 'Large Group Dining', 'Safe Kids Play Areas'],
      },
      {
        title: 'Corporate Retreats',
        description:
          'Step away from the boardroom. Our inspiring environment fosters creativity, team bonding, and strategic thinking.',
        icon: 'Briefcase',
        features: ['High-Speed Wifi', 'Team Building Activities', 'Catering Partners'],
      },
    ],
    concierge: {
      badge: 'Event Planning',
      title: 'Personal Concierge',
      subtitle: 'Let Us Coordinate Your Event',
      description:
        'Our dedicated on-site event coordinator is available to assist with logistics, vendor recommendations, group bookings, and custom itinerary planning.',
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
        { name: 'backgroundVideoUrl', title: 'Background Video URL (optional)', type: 'url' },
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
      ],
    }),
    defineField({
      name: 'eventCards',
      title: 'Events & Gatherings Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title (e.g. Intimate Weddings)', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'image', title: 'Card Image', type: 'image', options: { hotspot: true } },
            { name: 'icon', title: 'Icon Name (e.g. Heart, Users, Briefcase)', type: 'string' },
            { name: 'features', title: 'Feature Bullet Points', type: 'array', of: [{ type: 'string' }] },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Event Card',
                subtitle: subtitle ? subtitle.slice(0, 50) + '...' : '',
                media,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'concierge',
      title: 'Events Concierge Section',
      type: 'object',
      fields: [
        { name: 'badge', title: 'Badge', type: 'string' },
        { name: 'title', title: 'Heading', type: 'string' },
        { name: 'subtitle', title: 'Subheading', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 3 },
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
        title: title || 'Community Page',
        subtitle: subtitle || 'Weddings, Reunions & Retreats',
        media,
      };
    },
  },
});

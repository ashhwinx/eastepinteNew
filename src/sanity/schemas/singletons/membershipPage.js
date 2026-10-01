import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'membershipPage',
  title: 'Membership Page',
  type: 'document',
  initialValue: {
    hero: {
      title: 'Membership',
      subtitle:
        'Join our exclusive community of nature lovers and luxury seekers.',
    },
    leftPanel: {
      badge: 'The Inner Circle',
      title: 'Why Join East Pointe?',
      description:
        'Members enjoy exclusive perks, priority booking windows, and discounted rates across all our luxury properties.',
      benefits: [
        'Priority booking access 6 months in advance',
        '10% off all stays, year-round',
        'Complimentary late check-out',
        'Exclusive invitations to community events',
      ],
    },
    rightPanel: {
      title: 'How It Works',
      subtitle: '3 Simple Steps',
      steps: [
        {
          title: 'Inquire',
          description:
            'Contact our team via email or phone to express your interest.',
        },
        {
          title: 'Connect',
          description:
            "We'll schedule a brief call to discuss your preferences.",
        },
        {
          title: 'Welcome',
          description:
            'Receive your digital membership card and booking codes.',
        },
      ],
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
      name: 'leftPanel',
      title: 'Exclusive Perks & Benefits',
      type: 'object',
      fields: [
        { name: 'badge', title: 'Badge', type: 'string' },
        { name: 'title', title: 'Heading', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 3 },
        {
          name: 'benefits',
          title: 'List of Perks / Benefits',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),
    defineField({
      name: 'rightPanel',
      title: 'Membership Steps',
      type: 'object',
      fields: [
        { name: 'title', title: 'Heading', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        {
          name: 'steps',
          title: 'Steps Array',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Step Title', type: 'string' },
                { name: 'description', title: 'Step Description', type: 'text', rows: 2 },
              ],
            },
          ],
        },
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
        title: title || 'Membership Page',
        subtitle: subtitle || 'Perks, Steps & Access',
        media,
      };
    },
  },
});

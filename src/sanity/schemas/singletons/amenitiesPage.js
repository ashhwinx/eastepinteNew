import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'amenitiesPage',
  title: 'Amenities Page',
  type: 'document',
  initialValue: {
    hero: {
      title: 'Guest Perks',
      subtitle: "We've thought of everything, so you don't have to.",
    },
    intro: {
      badge: 'Our Amenities',
      title: 'Comfort & Convenience',
      subtitle:
        "Explore the fantastic amenities waiting for you in each cabin. We integrate thoughtful services to ensure your time with us is seamless from check-in to check-out. We can't wait for you to find your perfect getaway retreat with us!",
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
        { name: 'image', title: 'Hero Image', type: 'image', options: { hotspot: true } },
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
  ],
  preview: {
    select: {
      title: 'hero.title',
      subtitle: 'hero.subtitle',
      media: 'hero.image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Amenities Page',
        subtitle: subtitle || 'Comfort, Ease & Cabin Amenities',
        media,
      };
    },
  },
});

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Guest Story (Testimonial)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Guest Name',
      type: 'string',
      description: 'e.g. "Mendy & Jeff Bigalow"',
      validation: (Rule) => Rule.required().error('Guest name is required'),
    }),
    defineField({
      name: 'location',
      title: 'Guest Location / City',
      type: 'string',
      description: 'e.g. "Sioux Falls, South Dakota" or "Ft. Worth, TX"',
      validation: (Rule) => Rule.required().error('Location is required'),
    }),
    defineField({
      name: 'quote',
      title: 'Guest Review / Quote',
      type: 'text',
      rows: 4,
      description: 'The testimonial text describing their experience at East Pointe.',
      validation: (Rule) => Rule.required().error('Review text is required'),
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating (1 - 5)',
      type: 'number',
      initialValue: 5,
      description: 'Default is 5 stars',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'cabinStayed',
      title: 'Cabin Stayed / Experience',
      type: 'string',
      description: 'Optional: e.g. "Stayed at East Pointe Bayview" or "Family Reunion"',
    }),
    defineField({
      name: 'avatar',
      title: 'Guest Photo / Avatar',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional photo of the guest or family',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Sort priority (e.g. 1, 2, 3...)',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'location',
      rating: 'rating',
      media: 'avatar',
    },
    prepare({ title, subtitle, rating, media }) {
      const stars = '★'.repeat(rating || 5);
      return {
        title: title || 'Untitled Review',
        subtitle: `${stars} • ${subtitle || 'Verified Guest'}`,
        media,
      };
    },
  },
});

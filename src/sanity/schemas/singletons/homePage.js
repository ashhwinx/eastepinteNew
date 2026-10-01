import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'philosophy', title: '2. Our Philosophy' },
    { name: 'carousel', title: '3. Collection Carousel' },
    { name: 'surroundings', title: '4. Surroundings & Map' },
    { name: 'experiences', title: '5. Experiences' },
    { name: 'testimonials', title: '6. Guest Stories Header' },
    { name: 'location', title: '7. Location & Distances' },
    { name: 'standards', title: '8. East Pointe Standard' },
    { name: 'cta', title: '9. Bottom Call to Action' },
  ],
  fields: [
    // 1. HERO SECTION
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'badge', title: 'Top Badge', type: 'string', initialValue: 'Lake Cabin Experience' },
        { name: 'title', title: 'Main Heading', type: 'string', initialValue: 'East Pointe' },
        { name: 'subtitle', title: 'Subtitle / Tagline', type: 'string', initialValue: 'Lake Cabin Experience' },
        { name: 'image', title: 'Hero Background Image', type: 'image', options: { hotspot: true } },
        { name: 'backgroundVideoUrl', title: 'Optional Background Video URL (MP4 / Cloudinary)', type: 'url' },
        { name: 'ctaText', title: 'Button Text (Optional)', type: 'string', initialValue: 'Explore Cabins' },
        { name: 'ctaLink', title: 'Button Link', type: 'string', initialValue: '/cabins' },
      ],
    }),

    // 2. OUR PHILOSOPHY
    defineField({
      name: 'philosophy',
      title: 'Philosophy Section',
      type: 'object',
      group: 'philosophy',
      fields: [
        { name: 'badge', title: 'Badge Label', type: 'string', initialValue: 'Our Philosophy' },
        { name: 'title', title: 'Main Heading Prefix', type: 'string', initialValue: 'Discover the' },
        { name: 'highlightedText', title: 'Highlighted Italic Heading Text', type: 'string', initialValue: 'perfect lake escape' },
        { name: 'description', title: 'Philosophy Body Description', type: 'text', rows: 6 },
        { name: 'linkText', title: 'Link Button Text', type: 'string', initialValue: 'Explore Our Philosophy' },
        { name: 'linkUrl', title: 'Link URL', type: 'string', initialValue: '/cabins' },
        { name: 'image', title: 'Section Image (Optional)', type: 'image', options: { hotspot: true } },
      ],
    }),

    // 3. COLLECTION CAROUSEL
    defineField({
      name: 'carouselItems',
      title: 'Collection Carousel Cards',
      type: 'array',
      group: 'carousel',
      description: 'Add, reorder, or edit cards in the interactive horizontal collection slider.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'image', title: 'Card Image', type: 'image', options: { hotspot: true } },
            { name: 'linkUrl', title: 'Link URL', type: 'string', initialValue: '/cabins' },
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'e.g. Bed, UtensilsCrossed, Users, Compass, Sparkles, Anchor, Fish',
              initialValue: 'Bed',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Carousel Card',
                subtitle: subtitle ? subtitle.slice(0, 50) + '...' : '',
                media,
              };
            },
          },
        },
      ],
    }),

    // 4. THE SURROUNDINGS (BEYOND THE CABIN)
    defineField({
      name: 'immersiveSection',
      title: 'Surroundings & Grounds Map Section',
      type: 'object',
      group: 'surroundings',
      fields: [
        { name: 'badge', title: 'Badge Label', type: 'string', initialValue: 'The Surroundings' },
        { name: 'title', title: 'Heading', type: 'string', initialValue: 'Beyond the Cabin' },
        { name: 'description', title: 'Body Description', type: 'text', rows: 4 },
        { name: 'mapImage', title: 'Grounds Map Image', type: 'image', options: { hotspot: true } },
        { name: 'ctaText', title: 'Button Text', type: 'string', initialValue: 'Discover the Area' },
        { name: 'ctaLink', title: 'Button Link', type: 'string', initialValue: '/beyond' },
      ],
    }),

    // 5. CURATED EXPERIENCES
    defineField({
      name: 'experiences',
      title: 'Curated Experiences Section',
      type: 'object',
      group: 'experiences',
      fields: [
        { name: 'badge', title: 'Badge Label', type: 'string', initialValue: 'Curated Moments' },
        { name: 'title', title: 'Heading', type: 'string', initialValue: 'Curated Experiences' },
        { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 },
        {
          name: 'items',
          title: 'Experience Cards',
          type: 'array',
          description: '3 featured experience visual cards',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'category', title: 'Category (e.g. Adventure, Relaxation, Tranquility)', type: 'string' },
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 3 },
                { name: 'image', title: 'Card Background Image', type: 'image', options: { hotspot: true } },
                { name: 'icon', title: 'Icon Name (e.g. Fish, Anchor, Sparkles)', type: 'string', initialValue: 'Fish' },
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'category',
                  media: 'image',
                },
                prepare({ title, subtitle, media }) {
                  return {
                    title: title || 'Experience Card',
                    subtitle: subtitle || 'Curated Moment',
                    media,
                  };
                },
              },
            },
          ],
        },
        { name: 'viewAllText', title: 'View All Button Text', type: 'string', initialValue: 'View All Activities' },
        { name: 'viewAllLink', title: 'View All Button Link', type: 'string', initialValue: '/beyond' },
      ],
    }),

    // 6. GUEST STORIES (TESTIMONIALS) HEADER
    defineField({
      name: 'testimonialsHeader',
      title: 'Guest Stories Section Header',
      type: 'object',
      group: 'testimonials',
      description: 'Control the header text above the Guest Stories reviews section.',
      fields: [
        { name: 'badge', title: 'Section Badge', type: 'string', initialValue: 'Guest Stories' },
        { name: 'title', title: 'Main Heading', type: 'string', initialValue: 'Memories Made at East Pointe' },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Read real stories from travelers, families, and couples who found solace by the lake.',
        },
      ],
    }),

    // 7. LOCATION & GROUNDS
    defineField({
      name: 'locationSection',
      title: 'Location & Distances Section',
      type: 'object',
      group: 'location',
      fields: [
        { name: 'badge', title: 'Badge Label', type: 'string', initialValue: 'The Location' },
        { name: 'title', title: 'Heading', type: 'string', initialValue: 'Nestled in Nature' },
        { name: 'locationName', title: 'Location Landmark Title', type: 'string', initialValue: 'Lake Lafayette' },
        { name: 'locationAddress', title: 'Address Text', type: 'string', initialValue: 'Odessa, Missouri 64076' },
        { name: 'description', title: 'Location Description', type: 'text', rows: 4 },
        {
          name: 'directionsLink',
          title: 'Google Maps Directions Link',
          type: 'url',
          initialValue: 'https://www.google.com/maps/dir/?api=1&destination=38.9458417,-93.9713331',
        },
        {
          name: 'distances',
          title: 'Travel Time Highlights',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'time', title: 'Travel Time (e.g. "35 Mins")', type: 'string' },
                { name: 'destination', title: 'Destination (e.g. "Downtown Kansas City")', type: 'string' },
                { name: 'icon', title: 'Icon (Car / Plane)', type: 'string', initialValue: 'Car' },
              ],
              preview: {
                select: {
                  title: 'destination',
                  subtitle: 'time',
                },
              },
            },
          ],
        },
      ],
    }),

    // 8. THE EAST POINTE STANDARD
    defineField({
      name: 'standardSection',
      title: 'The East Pointe Standard (Features)',
      type: 'object',
      group: 'standards',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string', initialValue: 'The East Pointe Standard' },
        {
          name: 'items',
          title: 'Standard Pillars (4 Cards)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Pillar Title', type: 'string' },
                { name: 'description', title: 'Pillar Subtitle', type: 'string' },
                { name: 'icon', title: 'Icon Name (e.g. Star, Wind, Shield, Users)', type: 'string', initialValue: 'Star' },
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'description',
                },
              },
            },
          ],
        },
      ],
    }),

    // 9. BOTTOM CALL TO ACTION
    defineField({
      name: 'ctaSection',
      title: 'Bottom Call to Action Banner',
      type: 'object',
      group: 'cta',
      fields: [
        { name: 'title', title: 'Heading', type: 'string', initialValue: 'Ready to Escape?' },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          initialValue: 'Join our family of travelers and experience the difference of a true luxury retreat.',
        },
        { name: 'backgroundImage', title: 'Parallax Background Image', type: 'image', options: { hotspot: true } },
        { name: 'primaryButtonText', title: 'Primary Button Text', type: 'string', initialValue: 'Book Your Stay' },
        { name: 'primaryButtonLink', title: 'Primary Button Link', type: 'string', initialValue: '/cabins' },
        { name: 'secondaryButtonText', title: 'Secondary Button Text', type: 'string', initialValue: 'Become a Member' },
        { name: 'secondaryButtonLink', title: 'Secondary Button Link', type: 'string', initialValue: '/family' },
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
        title: title || 'Home Page',
        subtitle: subtitle || 'East Pointe Luxury Lake Cabin',
        media,
      };
    },
  },
});

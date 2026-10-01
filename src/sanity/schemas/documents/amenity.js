import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'amenity',
  title: 'Amenity',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Amenity Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Select an icon from the list',
      options: {
        list: [
          { title: 'Wifi - High Speed Internet', value: 'Wifi' },
          { title: 'Flame - Fire Pit / Fireplace', value: 'Flame' },
          { title: 'Bed - Bedding & Linens', value: 'Bed' },
          { title: 'UtensilsCrossed - Kitchen / Grill', value: 'UtensilsCrossed' },
          { title: 'Utensils - BBQ Grill / Dining', value: 'Utensils' },
          { title: 'Car - Parking', value: 'Car' },
          { title: 'Wind - Cooling / AC', value: 'Wind' },
          { title: 'Tv - Smart TV / Streaming', value: 'Tv' },
          { title: 'Coffee - Coffee Maker / Bar', value: 'Coffee' },
          { title: 'Key - Self Check-in', value: 'Key' },
          { title: 'KeyRound - Keyless Entry', value: 'KeyRound' },
          { title: 'LogOut - Easy Checkout', value: 'LogOut' },
          { title: 'Fish - Fishing Equipment', value: 'Fish' },
          { title: 'Sparkles - 5-Star Service', value: 'Sparkles' },
          { title: 'Users - Family Friendly', value: 'Users' },
          { title: 'Shield - Security & Safety', value: 'Shield' },
          { title: 'Anchor - Lake Activities', value: 'Anchor' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'Sparkles',
    }),
    defineField({
      name: 'desc',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Sort order on the Amenities page (1, 2, 3...)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'icon',
    },
  },
});

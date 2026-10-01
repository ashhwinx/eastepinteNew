import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings & Brand',
  type: 'document',
  initialValue: {
    siteName: 'East Pointe',
    tagline: 'Lake Cabin Experience',
    email: 'nick@eastpointekc.com',
    phone: '+1 (816) 255-8683',
    phoneLink: 'tel:+18162558683',
    address: 'Lake Lafayette, Odessa, Missouri 64076',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=38.9458417,-93.9713331',
    googleMapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12435.5!2d-93.9713331!3d38.9458417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c169965ad4a83d%3A0x1b1bb606912fe188!2sLake%20Lafayette!5e0!3m2!1sen!2sus!4v1709900000000!5m2!1sen!2sus',
    socialLinks: [
      { platform: 'Instagram', url: 'https://www.instagram.com/eastpointekc/' },
      { platform: 'Facebook', url: 'https://www.facebook.com' },
      { platform: 'Twitter', url: 'https://twitter.com' },
    ],
    footerDescription:
      'Redefining the cabin experience. Where luxury meets wilderness, and guests become family. Experience nature without compromise.',
    copyrightText: 'East Pointe Collections. All rights reserved.',
    officeHours: 'Open year round!',
  },
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Display',
      type: 'string',
    }),
    defineField({
      name: 'phoneLink',
      title: 'Phone Link (tel:)',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Physical Address',
      type: 'string',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps Directions URL',
      type: 'url',
    }),
    defineField({
      name: 'googleMapsEmbedUrl',
      title: 'Google Maps Embed iframe URL',
      type: 'url',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string', title: 'Platform (e.g., Instagram, Facebook, Twitter, YouTube)' },
            { name: 'url', type: 'url', title: 'Profile URL' },
          ],
        },
      ],
    }),
    defineField({
      name: 'footerDescription',
      title: 'Footer Description Text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Notice',
      type: 'string',
    }),
    defineField({
      name: 'officeHours',
      title: 'Office / Welcome Hours',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
      subtitle: 'tagline',
      media: 'logo',
    },
  },
});

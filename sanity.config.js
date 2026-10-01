import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';
import { SeedTool } from './src/sanity/tools/seedTool';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '9fz0fnwv';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

// Desk structure configuration for a beautiful, organized CMS dashboard
export const deskStructure = (S) =>
  S.list()
    .title('Content Studio')
    .items([
      // 1-Click Fast Data Importer Tool
      S.listItem()
        .title('⚡ 1-Click Import Existing Data')
        .child(
          S.component(SeedTool)
            .title('Import All Cabins, Amenities & Testimonials')
            .id('seedTool')
        ),

      S.divider(),

      // Cabins Portfolio
      S.listItem()
        .title('🏡 Cabins Portfolio')
        .schemaType('cabin')
        .child(
          S.documentTypeList('cabin')
            .title('All Cabins')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),

      // Amenities
      S.listItem()
        .title('✨ Amenities')
        .schemaType('amenity')
        .child(S.documentTypeList('amenity').title('All Amenities')),

      // Testimonials
      S.listItem()
        .title('💬 Testimonials')
        .schemaType('testimonial')
        .child(S.documentTypeList('testimonial').title('Guest Testimonials')),

      S.divider(),

      // Pages Singleton Group
      S.listItem()
        .title('📄 Pages')
        .child(
          S.list()
            .title('Website Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .child(S.document().schemaType('homePage').documentId('homePage')),
              S.listItem()
                .title('Cabins Page')
                .child(S.document().schemaType('cabinPage').documentId('cabinPage')),
              S.listItem()
                .title('Amenities Page')
                .child(S.document().schemaType('amenitiesPage').documentId('amenitiesPage')),
              S.listItem()
                .title('Community Page')
                .child(S.document().schemaType('communityPage').documentId('communityPage')),
              S.listItem()
                .title('Explore Page')
                .child(S.document().schemaType('explorePage').documentId('explorePage')),
              S.listItem()
                .title('Membership Page')
                .child(S.document().schemaType('membershipPage').documentId('membershipPage')),
            ])
        ),

      S.divider(),

      // Global Site Settings
      S.listItem()
        .title('⚙️ Site Settings & Brand')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ]);

export default defineConfig({
  name: 'default',
  title: 'East Pointe Studio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
  ],
  tools: (prev) => [
    ...prev,
    {
      name: 'seed-content',
      title: '⚡ 1-Click Import Data',
      component: SeedTool,
    },
  ],
  schema: {
    types: schemaTypes,
  },
});

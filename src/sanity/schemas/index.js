import cabin from './documents/cabin';
import amenity from './documents/amenity';
import testimonial from './documents/testimonial';
import siteSettings from './documents/siteSettings';
import homePage from './singletons/homePage';
import cabinPage from './singletons/cabinPage';
import amenitiesPage from './singletons/amenitiesPage';
import communityPage from './singletons/communityPage';
import explorePage from './singletons/explorePage';
import membershipPage from './singletons/membershipPage';

export const schemaTypes = [
  // Singletons / Pages
  homePage,
  cabinPage,
  amenitiesPage,
  communityPage,
  explorePage,
  membershipPage,

  // Documents
  cabin,
  amenity,
  testimonial,
  siteSettings,
];

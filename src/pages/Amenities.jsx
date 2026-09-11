import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import { getAmenitiesPage, getSiteSettings } from '../data/siteContent';
import {
  Car,
  Wind,
  Wifi,
  UtensilsCrossed,
  Bed,
  Tv,
  Flame,
  Coffee,
  KeyRound,
  LogOut,
  Fish,
  MapPin,
  Clock,
  Navigation
} from 'lucide-react';

const defaultAmenities = [
  {
    icon: Car,
    title: "Parking",
    desc: "Ample parking available directly on the premises for your convenience."
  },
  {
    icon: Wind,
    title: "Cooling",
    desc: "Central air conditioning to keep you cool during warm lakeside summers."
  },
  {
    icon: Wifi,
    title: "High Speed Wifi",
    desc: "Stay connected with reliable high-speed internet coverage throughout the cabin."
  },
  {
    icon: UtensilsCrossed,
    title: "Kitchens & Kitchenettes",
    desc: "Fully stocked culinary spaces where guests can prepare their own gourmet meals."
  },
  {
    icon: Bed,
    title: "Bed Linens",
    desc: "Luxury bedding with extra pillows and blankets for the ultimate night's sleep."
  },
  {
    icon: Tv,
    title: "Smart TVs",
    desc: "Entertainment ready with built-in streaming options for movie nights."
  },
  {
    icon: Flame,
    title: "Heating",
    desc: "Cozy central heating to keep you warm during crisp autumns and winters."
  },
  {
    icon: Coffee,
    title: "Custom Coffee Bar",
    desc: "Equipped with coffee makers and pour-over options for your morning ritual."
  },
  {
    icon: KeyRound,
    title: "Self Check-in",
    desc: "Seamless arrival experience with a secure, personalized door code."
  },
  {
    icon: LogOut,
    title: "Easy Checkout",
    desc: "Extra easy checkout experience."
  },
  {
    icon: Flame,
    title: "Private Fire Pit",
    desc: "These are fun and keep you engaged throughout the evening."
  },
  {
    icon: UtensilsCrossed,
    title: "Private BBQ Grill",
    desc: "Each location has a BBQ grill... Because this is Kansas City!"
  },
  {
    icon: Fish,
    title: "Fishing Equipment",
    desc: "Available on request. We have docks and shorelines available for you to cast your line."
  }
];

export default function Amenities() {
  const pageData = getAmenitiesPage();
  const settings = getSiteSettings();

  const hero = pageData?.hero;
  const intro = pageData?.intro;

  useEffect(() => {
    document.title = "Cabin Amenities & Guest Perks | East Pointe";
  }, []);

  return (
    <div className="bg-stone-50 pb-0">
      {/* 1. HERO BANNER */}
      <Hero
        title={hero?.title || "Guest Perks"}
        subtitle={hero?.subtitle || "We've thought of everything, so you don't have to."}
        image="/Amenities/AmenitiesHero.jpeg"
        height="large"
      />

      {/* 2. OUR AMENITIES INTRO SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
            {intro?.label || "Our Amenities"}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-primary mb-8">
            {intro?.title || "Comfort & Convenience"}
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-12">
            {intro?.body ||
              "Explore the fantastic amenities waiting for you in each cabin. We integrate thoughtful services to ensure your time with us is seamless from check-in to check-out. We can't wait for you to find your perfect getaway retreat with us!"}
          </p>
          <div className="w-24 h-[1px] bg-secondary mx-auto" />
        </div>
      </section>

      {/* 3. 13 GUEST PERKS GRID */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {defaultAmenities.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="group bg-white p-10 rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col items-center text-center border border-stone-100"
              >
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 group-hover:bg-primary group-hover:text-accent transition-all duration-500 mb-6">
                  <IconComp size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif font-bold text-primary mb-4 group-hover:text-secondary transition-colors">
                  {item.title}
                </h3>
                <p className="text-stone-500 leading-relaxed text-sm font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COME SEE US SECTION */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 skew-x-12 transform translate-x-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-block p-3 border border-accent rounded-full mb-6">
                <MapPin className="text-accent" size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                Come See Us
              </h2>
              <p className="text-xl text-stone-300 mb-8 font-light">
                Visit our offices to explore our stunning lakeside cabins!
              </p>
              <p className="text-stone-400 leading-relaxed mb-10 max-w-lg font-light">
                Experience the serene surroundings firsthand and discover your perfect getaway. We look forward to welcoming you!
              </p>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Location</h4>
                    <p className="text-stone-400">{settings.address}</p>
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:text-white transition-colors mt-1"
                    >
                      <Navigation size={14} /> Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Hours</h4>
                    <p className="text-stone-400">{settings.officeHours}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full h-[500px] bg-stone-800 rounded-lg overflow-hidden border border-white/10 shadow-2xl relative group">
              <iframe
                src={settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "grayscale(100%) invert(90%) contrast(0.8)"
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
                className="opacity-50 group-hover:opacity-80 transition-opacity duration-700"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="bg-primary/90 text-white px-8 py-4 border border-accent shadow-xl text-center">
                  <span className="block text-accent text-xs font-bold uppercase tracking-widest mb-1">
                    East Pointe
                  </span>
                  <span className="font-serif text-xl">Offices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

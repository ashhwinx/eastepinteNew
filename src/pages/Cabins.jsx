import React, { useState } from 'react';
import {
  Users,
  Bed,
  Bath,
  MapPin,
  Clock,
  Navigation,
  Play,
  Maximize2,
  Compass,
  Camera
} from 'lucide-react';
import Hero from '../components/Hero';
import CabinModal, { Lightbox } from '../components/CabinModal';
import { getCabinPage, useCabins, resolveImage, getSiteSettings } from '../data/siteContent';

export default function Cabins() {
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [mapLightboxOpen, setMapLightboxOpen] = useState(false);

  const cabinPageData = getCabinPage();
  const cabins = useCabins();
  const settings = getSiteSettings();

  const hero = cabinPageData?.hero;
  const intro = cabinPageData?.intro;
  const comeSeeUs = cabinPageData?.comeSeeUs;

  const aerialTour = cabinPageData?.aerialTour;
  const aerialVideoUrl =
    aerialTour?.videoUrl ||
    "https://res.cloudinary.com/dusub2qg5/video/upload/v1769971765/EastPointeAerial_ve13um.mp4";
  const aerialVideoPoster = resolveImage(
    aerialTour?.videoPoster,
    "https://cdn.sanity.io/images/jlknt03a/production/852dc7bb39c4f4b209343cea30ef6d052fe21627-836x627-avif"
  );
  const aerialBadge = aerialTour?.badgeText || "Aerial Tour";

  const groundsMap = cabinPageData?.groundsMap;
  const groundsMapImage = resolveImage(
    groundsMap?.mapImage || cabinPageData?.mapImage,
    "/Map.avif"
  );
  const groundsMapTitle = groundsMap?.title || "Grounds Map";
  const groundsMapSubtitle =
    groundsMap?.subtitle ||
    "Get oriented with our property layout showing cabin locations, lake access points, and walking trails throughout the estate.";
  const groundsMapBadge = groundsMap?.badgeText || "Property Layout";

  return (
    <div className="bg-stone-50 pb-0">
      {/* 1. HERO BANNER */}
      <Hero
        title={hero?.title || "Lake Cabin Collection"}
        subtitle={
          hero?.subtitle ||
          "Discover our range of cabins designed to accommodate all group sizes, whether you're planning a cozy getaway for two or a lively retreat for a large gathering."
        }
        image={resolveImage(
          hero?.image,
          "https://cdn.sanity.io/images/jlknt03a/production/13c343096d4220bc58f44d4bd804f5f613f93dd8-1080x720.avif"
        )}
        height="large"
      />

      {/* 2. PORTFOLIO INTRO SECTION */}
      <section className="bg-white pt-20 pb-12">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
            {intro?.label || "Our Portfolio"}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-primary mb-8">
            {intro?.title || "Find Your Perfect Escape"}
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed font-light">
            {intro?.body ||
              "Each cabin is thoughtfully crafted to match your vacation intentions. Click on any cabin below to view full details, sleeping arrangements, and amenities."}
          </p>
        </div>
      </section>

      {/* 3. CABIN CARDS GRID */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {cabins.map((cabin, idx) => {
            const hasImages = cabin.images && cabin.images.length > 0;
            const isAvailable = cabin.status === "Available" || cabin.status === "available";

            return (
              <div
                key={cabin._id || idx}
                onClick={() => hasImages && setSelectedCabin(cabin)}
                className={`bg-white group rounded-sm shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden transform hover:-translate-y-1 ${
                  hasImages ? "cursor-pointer" : "cursor-default"
                }`}
              >
                {/* Main Card Image (h-80 relative overflow-hidden bg-stone-100) */}
                <div className="relative h-80 overflow-hidden bg-stone-100">
                  {hasImages ? (
                    <img
                      src={cabin.images[0]}
                      alt={cabin.name}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                        !isAvailable ? "grayscale-[30%]" : ""
                      }`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                      <img
                        src="https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=800"
                        alt="Coming Soon"
                        className="w-full h-full object-cover grayscale opacity-30 blur-[1px]"
                      />
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center p-6">
                        <div className="bg-white/90 px-8 py-6 shadow-xl border-t-4 border-accent text-center">
                          <span className="block font-serif text-2xl text-primary mb-1">Coming Soon</span>
                          <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">
                            New Addition
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* View Details Hover Overlay Button */}
                  {hasImages && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="bg-white/90 text-primary px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                        <Camera size={16} /> View Details
                      </div>
                    </div>
                  )}

                  {/* Status Pill Badge Top Right */}
                  <div
                    className={`absolute top-4 right-4 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm z-10 ${
                      isAvailable ? "bg-white text-primary" : "bg-accent text-primary"
                    }`}
                  >
                    {isAvailable ? "Available" : "Coming Soon"}
                  </div>

                  {/* Number Badge Bottom Left */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-5xl font-serif text-white/90 drop-shadow-md opacity-80">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* 4 Thumbnail Strip Beneath Main Image */}
                <div className="flex bg-stone-100 h-20 border-b border-stone-200">
                  {hasImages &&
                    cabin.images.slice(0, 4).map((thumb, g) => (
                      <div
                        key={g}
                        className="flex-1 border-r border-stone-200 last:border-0 relative overflow-hidden group/thumb"
                      >
                        <img
                          src={thumb}
                          alt=""
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            g === 0 ? "opacity-50" : "opacity-70 group-hover/thumb:opacity-100"
                          }`}
                        />
                        {g === 3 && cabin.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                            +{cabin.images.length - 4}
                          </div>
                        )}
                      </div>
                    ))}

                  {/* Placeholders if fewer than 4 images */}
                  {[...Array(Math.max(0, 4 - (cabin.images ? cabin.images.length : 0)))].map(
                    (_, g) => (
                      <div
                        key={`empty-${g}`}
                        className="flex-1 bg-stone-100 border-r border-stone-200 last:border-0 flex items-center justify-center"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-200/50" />
                      </div>
                    )
                  )}
                </div>

                {/* Card Body Details */}
                <div className="p-8 flex-grow flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-serif text-primary mb-2 group-hover:text-secondary transition-colors">
                      {cabin.name}
                    </h3>
                    <div className="h-0.5 w-12 bg-stone-200 group-hover:bg-secondary transition-all duration-500" />
                  </div>

                  {isAvailable || cabin.name === "Harbor View" ? (
                    <div className="flex flex-col gap-2 mb-6 text-stone-500 text-sm">
                      <div className="flex items-center">
                        <Bed size={16} className="mr-3 text-accent shrink-0" />
                        <span>{cabin.bedrooms}</span>
                      </div>
                      {cabin.baths > 0 && (
                        <div className="flex items-center">
                          <Bath size={16} className="mr-3 text-accent shrink-0" />
                          <span>{cabin.baths} Bathrooms</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users size={16} className="mr-3 text-accent shrink-0" />
                        <span>Sleeps {cabin.sleeps}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 text-stone-400 italic text-sm py-2">
                      Full details coming soon...
                    </div>
                  )}

                  <p className="text-stone-500 text-sm mb-8 flex-grow leading-relaxed border-t border-stone-100 pt-4 line-clamp-3">
                    {cabin.desc}
                  </p>

                  <div className="mt-auto">
                    {isAvailable ? (
                      <button className="w-full py-4 bg-stone-100 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 font-bold uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-2">
                        View Details
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-4 border border-stone-200 text-stone-300 font-bold uppercase text-[11px] tracking-[0.2em] cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. AERIAL VIDEO TOUR & GROUNDS MAP GRID */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Aerial Tour Video Frame */}
          <div className="lg:col-span-1 h-[500px] lg:h-[680px] relative rounded-sm overflow-hidden shadow-xl group border-4 border-white bg-stone-900">
            <video
              className="w-full h-full object-cover"
              poster={aerialVideoPoster}
              controls
              playsInline
              key={aerialVideoUrl}
            >
              <source
                src={aerialVideoUrl}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none">
              <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Play size={14} className="text-accent fill-accent" /> {aerialBadge}
              </span>
            </div>
          </div>

          {/* Grounds Map */}
          <div
            className="lg:col-span-2 h-[550px] lg:h-[680px] relative rounded-sm shadow-xl group border-4 border-white bg-stone-100 cursor-pointer"
            onClick={() => setMapLightboxOpen(true)}
          >
            <img
              src={groundsMapImage}
              alt="East Pointe Property Map"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 lg:opacity-60 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
              <Maximize2 className="text-white" size={20} />
            </div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full pointer-events-none">
              <div className="flex items-center gap-2 text-accent mb-3">
                <Compass size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">{groundsMapBadge}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">{groundsMapTitle}</h3>
              <p className="text-stone-300 max-w-lg font-light leading-relaxed hidden md:block">
                {groundsMapSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COME SEE US SECTION */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 skew-x-12 transform translate-x-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Info */}
            <div className="lg:w-1/2">
              <div className="inline-block p-3 border border-accent rounded-full mb-6">
                <MapPin className="text-accent" size={24} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                {comeSeeUs?.title || "Come See Us"}
              </h2>
              <p className="text-xl text-stone-300 mb-8 font-light">
                {comeSeeUs?.subtitle || "Visit our offices to explore our stunning lakeside cabins!"}
              </p>
              <p className="text-stone-400 leading-relaxed mb-10 max-w-lg font-light">
                {comeSeeUs?.body ||
                  "Experience the serene surroundings firsthand and discover your perfect getaway. We look forward to welcoming you!"}
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

            {/* Right Map (Dark Inverted Frame with Centered Pin) */}
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

      {/* Cabin Details Lightbox & Modal */}
      <CabinModal
        cabin={selectedCabin}
        isOpen={Boolean(selectedCabin)}
        onClose={() => setSelectedCabin(null)}
      />

      {/* Fullscreen Grounds Map Lightbox */}
      <Lightbox
        images={[groundsMapImage]}
        initialIndex={0}
        isOpen={mapLightboxOpen}
        onClose={() => setMapLightboxOpen(false)}
      />
    </div>
  );
}

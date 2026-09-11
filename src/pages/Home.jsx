import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  Car,
  Plane,
  MapPin,
  Compass,
  Navigation,
  Sparkles,
  Wind,
  Shield,
  Users,
  Anchor,
  Fish,
  UtensilsCrossed,
  Flame,
  Bed
} from 'lucide-react';
import ContactSection from '../components/ContactSection';
import { getHomePage, getTestimonials, resolveImage } from '../data/siteContent';
import { getIcon } from '../components/iconMap';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef(null);
  const homeData = getHomePage();
  const rawTestimonials = getTestimonials();

  const hero = homeData?.hero;
  const philosophy = homeData?.philosophy;
  const carouselItems = homeData?.carouselItems;
  const immersive = homeData?.immersiveSection;
  const experiences = homeData?.experiences;
  const locationSection = homeData?.locationSection;
  const cta = homeData?.ctaSection;

  // Fallback / default cards if not directly in Sanity
  const defaultCards = [
    {
      id: 1,
      title: "The Collection",
      desc: "Discover our hand-picked portfolio of luxury cabins, each offering unique architecture and premium amenities.",
      linkUrl: "/cabins",
      image: "https://cdn.sanity.io/images/jlknt03a/production/13c343096d4220bc58f44d4bd804f5f613f93dd8-1080x720.avif",
      icon: "Bed"
    },
    {
      id: 2,
      title: "Comfort & Ease",
      desc: "From chef's kitchens to high-speed wifi, we've curated every detail to make your stay effortless.",
      linkUrl: "/comfort",
      image: "https://cdn.sanity.io/images/jlknt03a/production/6cf5a870eb930e1e6c1f38ba71570a007dba6813-1080x720.avif",
      icon: "UtensilsCrossed"
    },
    {
      id: 3,
      title: "Gather Together",
      desc: "Spaces designed for connection. Large dining tables, fire pits, and game rooms for making memories.",
      linkUrl: "/gather",
      image: "https://cdn.sanity.io/images/jlknt03a/production/e7fbe6123fee00465f25c74dc47d9004280b08a5-500x500-jpg",
      icon: "Users"
    },
    {
      id: 4,
      title: "Explore Nature",
      desc: "Hiking trails, alpine lakes, and hidden waterfalls await just minutes from your doorstep.",
      linkUrl: "/beyond",
      image: "https://cdn.sanity.io/images/jlknt03a/production/a408b119d3d919212188257c4c2500593aeeae1b-765x685-avif",
      icon: "Compass"
    }
  ];

  const cards = carouselItems && carouselItems.length > 0 ? carouselItems : defaultCards;

  // Curated experiences
  const defaultExpItems = [
    {
      category: "Adventure",
      title: "Anglers Haven",
      description: "A quiet cove just a short walk from the house.",
      image: "https://cdn.sanity.io/images/jlknt03a/production/bf8aeb16d94a5f0fba3fdfebd16b4147c416833f-612x407-jpg",
      icon: Fish
    },
    {
      category: "Relaxation",
      title: "Lake Activities",
      description: "Swimming, kayaking, or simply enjoying family fun by the water.",
      image: "https://cdn.sanity.io/images/jlknt03a/production/460dd219a8eca16866826c4d73a81fe89e5f6cde-2355x1239-avif",
      icon: Anchor
    },
    {
      category: "Tranquility",
      title: "Rest & Relaxation",
      description: "Peaceful moments fishing by the lake or reading on the dock.",
      image: "https://cdn.sanity.io/images/jlknt03a/production/9c5bc16771375ee94ba8a733262dba93582bd37d-2000x1000-avif",
      icon: Fish
    }
  ];

  const expItems = experiences?.items && experiences.items.length > 0
    ? experiences.items.map(item => ({
        ...item,
        image: resolveImage(item.image),
        icon: getIcon(item.icon)
      }))
    : defaultExpItems;

  // Testimonials
  const testimonials = rawTestimonials && rawTestimonials.length > 0
    ? rawTestimonials
    : [
        {
          name: "Sarah Jenkins",
          location: "Atlanta, GA",
          quote: "The most restorative weekend of my life. The cabin was impeccable, and the silence of the forest was exactly what we needed.",
          rating: 5
        },
        {
          name: "Michael & David",
          location: "Charlotte, NC",
          quote: "East Pointe thought of everything. From the pre-stocked firewood to the locally sourced coffee awaiting our arrival. Pure magic.",
          rating: 5
        },
        {
          name: "The Thompson Family",
          location: "Nashville, TN",
          quote: "We hosted our family reunion here. The communal spaces were perfect for gathering, yet everyone had their own private retreat.",
          rating: 5
        }
      ];

  // Distances list
  const distances = locationSection?.distances || [
    { time: "35 Mins", destination: "Downtown Kansas City", icon: Car },
    { time: "2.5 Hours", destination: "St. Louis", icon: Car },
    { time: "40 Mins", destination: "MCI Airport", icon: Plane },
    { time: "32 Mins", destination: "Truman Sports Complex", icon: Car },
    { time: "25 Mins", destination: "Warrensburg", icon: Car },
    { time: "15 Mins", destination: "Powell Gardens", icon: Car }
  ];

  // Carousel Infinite Scroll Engine
  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      if (container.scrollLeft === 0 && container.scrollWidth > 0) {
        container.scrollLeft = container.scrollWidth / 3;
      }
    }
  }, []);

  useEffect(() => {
    let animId;
    const scrollStep = () => {
      if (!carouselRef.current) return;
      const el = carouselRef.current;
      const third = el.scrollWidth / 3;
      if (!isHovered) {
        el.scrollLeft += 1;
      }
      if (el.scrollLeft >= third * 2) {
        el.scrollLeft -= third;
      } else if (el.scrollLeft <= 5) {
        el.scrollLeft += third;
      }
      animId = requestAnimationFrame(scrollStep);
    };
    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  const handleManualScroll = (direction) => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const third = el.scrollWidth / 3;
    const step = window.innerWidth < 768 ? window.innerWidth * 0.85 : window.innerWidth * 0.3;

    if (direction === "left") {
      if (el.scrollLeft < third) el.scrollLeft += third;
      el.scrollBy({ left: -step, behavior: "smooth" });
    } else {
      if (el.scrollLeft >= third * 2) el.scrollLeft -= third;
      el.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <div className="relative h-screen w-full overflow-hidden">
        <img
          src={resolveImage(hero?.image, "/Home/LandingImage.avif")}
          alt="East Pointe Luxury Cabins"
          className="absolute inset-0 w-full h-full object-cover animate-scale-in"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tight drop-shadow-lg">
            {hero?.title || "East Pointe"}
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-widest text-stone-100 drop-shadow-md max-w-2xl mx-auto uppercase">
            {hero?.subtitle || "Lake Cabin Experience"}
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="text-white/80 w-10 h-10" strokeWidth={1} />
        </div>
      </div>

      {/* 2. OUR PHILOSOPHY */}
      <section className="py-24 md:py-32 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <span className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-6 block">
            {philosophy?.label || "Our Philosophy"}
          </span>
          <h2 className="text-3xl md:text-6xl font-serif text-primary mb-10 leading-tight">
            Discover the{" "}
            <span className="italic text-secondary">
              {philosophy?.highlightedText || "perfect lake escape"}
            </span>
          </h2>
          <div className="w-24 h-[1px] bg-secondary mx-auto mb-10" />
          <p className="text-stone-500 text-lg md:text-xl leading-relaxed mb-12 w-full mx-auto px-4">
            {philosophy?.body ||
              "Welcome to EastPointe At EastPointe, the land, the environment, and our faith in GOD mean everything to us. Our cabins are intentionally built using reclaimed and recycled wood and materials. This rustic style is by design. We believe there is beauty in imperfection. While you're here, take time to slow down. Walk the roads, visit the lake, and enjoy the peaceful surroundings. Most of all, we hope your time here brings you peace, rest, and a chance to reconnect with what matters most. Thank you for being part of the EastPointe story."}
          </p>
          <Link
            to={philosophy?.linkUrl || "/cabins"}
            className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:text-secondary transition-colors border-b border-primary hover:border-secondary pb-1"
          >
            {philosophy?.linkText || "Explore Our Philosophy"}
          </Link>
        </div>
      </section>

      {/* 3. CARD SLIDER / CAROUSEL */}
      <section className="bg-stone-50 py-24 overflow-hidden relative group">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left / Right Control Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleManualScroll("left");
            }}
            className="absolute left-4 md:left-10 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 text-primary p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleManualScroll("right");
            }}
            className="absolute right-4 md:right-10 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 text-primary p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white"
            aria-label="Scroll Right"
          >
            <ChevronRight size={28} />
          </button>

          {/* Carousel Track */}
          <div ref={carouselRef} className="flex overflow-x-hidden scrollbar-hide">
            {[...Array(3)].map((_, setIdx) => (
              <div key={setIdx} className="flex shrink-0 items-stretch">
                {cards.map((card, itemIdx) => {
                  const IconComp = typeof card.icon === 'string' ? getIcon(card.icon) : card.icon || Sparkles;
                  return (
                    <div key={`${setIdx}-${itemIdx}`} className="w-[85vw] md:w-[30vw] flex-shrink-0 px-4">
                      <Link
                        to={card.linkUrl || card.link || "/cabins"}
                        className="group/card block h-full bg-white shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 rounded-sm overflow-hidden"
                        draggable="false"
                      >
                        <div className="h-80 overflow-hidden relative">
                          <img
                            src={resolveImage(card.image || card.img)}
                            alt={card.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                            draggable="false"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-primary/10 group-hover/card:bg-transparent transition-colors" />
                        </div>
                        <div className="p-10 relative">
                          <div className="absolute -top-8 right-8 bg-white border border-stone-200 text-primary p-4 rounded-full shadow-lg group-hover/card:bg-primary group-hover/card:text-white group-hover/card:border-primary transition-colors duration-300">
                            <IconComp size={24} />
                          </div>
                          <h3 className="text-2xl font-serif text-primary mb-4">{card.title}</h3>
                          <p className="text-stone-500 mb-8 leading-relaxed line-clamp-3">
                            {card.description || card.desc}
                          </p>
                          <span className="text-secondary text-xs font-bold uppercase tracking-widest group-hover/card:underline">
                            Explore
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE SURROUNDINGS (BEYOND THE CABIN) */}
      <section className="py-0">
        <div className="flex flex-col md:flex-row w-full">
          <div className="md:w-1/2">
            <img
              src={resolveImage(immersive?.mapImage, "/Map.avif")}
              alt="East Pointe Property Grounds Map"
              className="w-full h-full object-cover block"
              loading="lazy"
            />
          </div>
          <div className="md:w-1/2 bg-primary text-cream flex items-center justify-center p-12 md:p-24 relative overflow-hidden">
            <Compass className="absolute -bottom-20 -right-20 text-white/5 w-96 h-96 pointer-events-none" />
            <div className="relative z-10 max-w-lg">
              <span className="text-accent text-xs font-bold uppercase tracking-widest mb-4 block">
                {immersive?.label || "The Surroundings"}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                {immersive?.title || "Beyond the Cabin"}
              </h2>
              <p className="text-stone-300 text-lg mb-10 leading-relaxed font-light">
                {immersive?.body ||
                  "Step outside and immerse yourself in the breathtaking landscapes that surround our properties. Hiking trails, alpine lakes, and hidden waterfalls await just minutes from your doorstep."}
              </p>
              <Link
                to={immersive?.linkUrl || "/beyond"}
                className="inline-block px-10 py-4 border border-cream/30 text-cream hover:bg-cream hover:text-primary transition-all duration-300 font-bold uppercase text-xs tracking-[0.2em]"
              >
                {immersive?.linkText || "Discover the Area"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CURATED EXPERIENCES */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-primary mb-6">
            {experiences?.title || "Curated Experiences"}
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg font-light">
            {experiences?.subtitle ||
              "Whether you seek adrenaline-pumping adventure or serene nature walks, our location offers endless opportunities to explore."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {expItems.map((item, idx) => {
            const IconComp = item.icon || Sparkles;
            return (
              <div key={idx} className="relative group overflow-hidden h-[500px] cursor-pointer">
                <img
                  src={resolveImage(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10 opacity-90 group-hover:opacity-100 transition-opacity">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 text-secondary mb-3">
                      <IconComp size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif text-white mb-2">{item.title}</h3>
                    <p className="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link
            to={experiences?.viewAllLink || "/beyond"}
            className="inline-block px-8 py-3 bg-white border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            {experiences?.viewAllText || "View All Activities"}
          </Link>
        </div>
      </section>

      {/* 6. GUEST STORIES (TESTIMONIALS) */}
      <section className="bg-stone-100 py-24 relative overflow-hidden">
        <Quote className="absolute top-10 left-10 text-stone-200 w-64 h-64 opacity-50 transform -rotate-12 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-center text-3xl md:text-4xl font-serif text-primary mb-16">
            Guest Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.slice(0, 3).map((t, idx) => (
              <div
                key={idx}
                className={`bg-white p-10 shadow-sm rounded-sm h-full flex flex-col ${
                  idx === 1 ? "transform md:-translate-y-4 shadow-md" : ""
                }`}
              >
                <div className="flex text-secondary mb-6">
                  {Array.from({ length: t.rating || 5 }).map((_, starIdx) => (
                    <Star key={starIdx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-stone-600 italic mb-8 flex-grow leading-relaxed">
                  "{t.quote}"
                </p>
                <div>
                  <h5 className="font-bold text-primary">{t.name}</h5>
                  <p className="text-xs text-stone-400 uppercase tracking-wider">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. THE LOCATION */}
      <section className="bg-stone-900 text-white py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Col */}
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 text-accent mb-6">
                <Navigation size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {locationSection?.label || "The Location"}
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif mb-8 leading-tight">
                {locationSection?.title || "Nestled in Nature"}
              </h2>

              <div className="mb-10 p-6 bg-white/5 border border-white/10 rounded-sm">
                <p className="text-xl font-serif text-white tracking-wide">
                  {locationSection?.locationName || "Lake Lafayette"}
                </p>
                <p className="text-lg text-accent mb-4">
                  {locationSection?.locationAddress || "Odessa, Missouri 64076"}
                </p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=38.9458417,-93.9713331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-accent transition-colors"
                >
                  <Navigation size={16} /> Get Directions
                </a>
              </div>

              <p className="text-stone-400 text-lg leading-relaxed mb-10 font-light">
                {locationSection?.body ||
                  "East Pointe is strategically located in the heart of Missouri's beautiful countryside. A perfect escape that feels worlds away, yet conveniently close to major hubs."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {distances.map((dist, idx) => {
                  const IconComp = typeof dist.icon === 'string' ? getIcon(dist.icon) : dist.icon || Car;
                  return (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-primary transition-colors duration-300">
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-white mb-0.5">{dist.time}</h4>
                        <p className="text-stone-500 text-xs uppercase tracking-wide">
                          {dist.destination}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Map Embed */}
            <div className="lg:w-1/2 w-full h-[600px] rounded-sm overflow-hidden shadow-2xl relative border border-white/10 group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12435.5!2d-93.9713331!3d38.9458417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c169965ad4a83d%3A0x1b1bb606912fe188!2sLake%20Lafayette!5e0!3m2!1sen!2sus!4v1709900000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "grayscale(100%) contrast(1.1) brightness(0.8)"
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="East Pointe Location Map"
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-700 w-full h-full"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-accent opacity-20" />
                  <div className="relative bg-primary border border-accent text-white px-6 py-3 shadow-2xl">
                    <span className="font-serif font-bold text-sm tracking-[0.2em] whitespace-nowrap">
                      EAST POINTE
                    </span>
                  </div>
                  <div className="absolute -bottom-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. THE EAST POINTE STANDARD */}
      <section className="py-24 container mx-auto px-6 border-b border-stone-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-primary mb-4">The East Pointe Standard</h2>
          <div className="w-16 h-1 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="flex flex-col items-center text-center group">
            <div className="p-5 bg-stone-50 rounded-full mb-6 text-stone-400 group-hover:bg-primary group-hover:text-accent transition-all duration-300">
              <Star size={28} strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-primary mb-2 text-lg">5-Star Service</h4>
            <p className="text-sm text-stone-500">24/7 Concierge & Support</p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="p-5 bg-stone-50 rounded-full mb-6 text-stone-400 group-hover:bg-primary group-hover:text-accent transition-all duration-300">
              <Wind size={28} strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-primary mb-2 text-lg">Fresh Air</h4>
            <p className="text-sm text-stone-500">Secluded Private Locations</p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="p-5 bg-stone-50 rounded-full mb-6 text-stone-400 group-hover:bg-primary group-hover:text-accent transition-all duration-300">
              <Shield size={28} strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-primary mb-2 text-lg">Secure & Safe</h4>
            <p className="text-sm text-stone-500">Smart Locks & Security</p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="p-5 bg-stone-50 rounded-full mb-6 text-stone-400 group-hover:bg-primary group-hover:text-accent transition-all duration-300">
              <Users size={28} strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-primary mb-2 text-lg">Family Ready</h4>
            <p className="text-sm text-stone-500">Games, Cribs & More</p>
          </div>
        </div>
      </section>

      {/* 9. READY TO ESCAPE? CTA */}
      <section
        className="relative py-40 bg-fixed bg-cover bg-center group"
        style={{
          backgroundImage: `url("${resolveImage(
            cta?.backgroundImage,
            "https://cdn.sanity.io/images/jlknt03a/production/4014eb811749eca36e55c9750a8b4a5333cd1f26-1600x1200-avif"
          )}")`
        }}
      >
        <div className="absolute inset-0 bg-black/50 transition-colors duration-700 ease-in-out group-hover:bg-black/25" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 drop-shadow-lg">
            {cta?.title || "Ready to Escape?"}
          </h2>
          <p className="text-xl md:text-2xl text-stone-100 mb-12 max-w-2xl mx-auto font-light drop-shadow-md">
            {cta?.subtitle ||
              "Join our family of travelers and experience the difference of a true luxury retreat."}
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link
              to={cta?.primaryButtonLink || "/cabins"}
              className="px-12 py-5 bg-accent text-primary font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              {cta?.primaryButtonText || "Book Your Stay"}
            </Link>
            <Link
              to={cta?.secondaryButtonLink || "/family"}
              className="px-12 py-5 border border-white/50 backdrop-blur-sm text-white font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all duration-300 hover:-translate-y-1"
            >
              {cta?.secondaryButtonText || "Become a Member"}
            </Link>
          </div>
        </div>
      </section>

      {/* 10. CONTACT SECTION */}
      <ContactSection />
    </div>
  );
}

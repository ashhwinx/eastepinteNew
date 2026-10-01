import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import { getCommunityPage, getSiteSettings, resolveImage } from '../data/siteContent';
import { getIcon } from '../components/iconMap';
import {
  Heart,
  Users,
  Briefcase,
  Wine,
  Mail,
  Phone,
  MapPin,
  Clock,
  Navigation
} from 'lucide-react';

const defaultEventCards = [
  {
    title: "Intimate Weddings",
    description: 'Say "I do" with the lake as your witness. Our grounds provide a stunning, natural cathedral for ceremonies up to 50 guests.',
    image: "/Community/Wedding.avif",
    icon: Heart,
    features: ["Lakeside Ceremonies", "Bridal Cabin Packages", "Photography Access"]
  },
  {
    title: "Family Reunions",
    description: "Reconnect without distractions. Book multiple cabins to keep the family close while giving everyone their own private space.",
    image: "/Community/Reunion.avif",
    icon: Users,
    features: ["Communal Fire Pits", "Large Group Dining", "Safe Kids Play Areas"]
  },
  {
    title: "Corporate Retreats",
    description: "Step away from the boardroom. Our inspiring environment fosters creativity, team bonding, and strategic thinking.",
    image: "/Community/Corporate.avif",
    icon: Briefcase,
    features: ["High-Speed Wifi", "Team Building Activities", "Catering Partners"]
  }
];

export default function Community() {
  const pageData = getCommunityPage();
  const settings = getSiteSettings();

  const hero = pageData?.hero;
  const intro = pageData?.intro;
  const concierge = pageData?.concierge;

  const rawCards = pageData?.eventCards;
  const displayEventCards =
    rawCards && rawCards.length > 0
      ? rawCards.map((card) => ({
          title: card.title,
          description: card.description,
          image: resolveImage(card.image, "/Community/Wedding.avif"),
          icon: typeof card.icon === 'string' ? getIcon(card.icon) : (card.icon || Heart),
          features: card.features || []
        }))
      : defaultEventCards;

  useEffect(() => {
    document.title = "Weddings, Reunions & Corporate Retreats | East Pointe";
  }, []);

  return (
    <div className="bg-stone-50">
      {/* 1. HERO BANNER */}
      <Hero
        title={hero?.title || "Gather & Celebrate"}
        subtitle={hero?.subtitle || "Create lasting memories in the heart of nature."}
        image={resolveImage(hero?.image, "/Community/CommunityHero.avif")}
        height="large"
      />

      {/* 2. INTRO SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
            {intro?.label || "Hosted at East Pointe"}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-primary mb-8">
            {intro?.title || "Unforgettable Gatherings"}
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-8">
            {intro?.body ||
              "East Pointe isn't just for quiet getaways; it's a vibrant backdrop for your most important milestones. From intimate lakeside weddings to productive corporate retreats, our grounds offer the perfect blend of privacy and community."}
          </p>
          <div className="w-24 h-[1px] bg-secondary mx-auto mt-12" />
        </div>
      </section>

      {/* 3. EVENT CARDS GRID */}
      <section className="pb-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayEventCards.map((card, r) => {
            const IconComp = card.icon;
            return (
              <div
                key={r}
                className={`group bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  r === 1 ? "transform md:-translate-y-4" : ""
                }`}
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-full text-primary shadow-sm">
                    <IconComp size={20} />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif text-primary mb-3">
                    {card.title}
                  </h3>
                  <p className="text-stone-500 font-light mb-6 leading-relaxed">
                    {card.description}
                  </p>
                  {card.features && (
                    <ul className="space-y-2 text-sm text-stone-600 mb-6">
                      {card.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PERSONAL CONCIERGE / EVENT PLANNING */}
      <section className="py-24 bg-primary text-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 text-accent mb-4">
              <Wine size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">
                {concierge?.label || "Personal Concierge"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
              {concierge?.title || "Start Planning Your Event"}
            </h2>
            <p className="text-stone-300 text-lg font-light leading-relaxed mb-8">
              {concierge?.body ||
                "We don't believe in automated forms for your special moments. Every event at East Pointe is tailored specifically to your vision. Connect directly with our Events Coordinator to discuss availability, packages, and custom arrangements."}
            </p>
            <div className="flex flex-col gap-4">
              {(
                concierge?.bulletPoints || [
                  "Custom layout planning",
                  "Vendor recommendations (Catering, Florals, etc.)",
                  "Group accommodation discounts"
                ]
              ).map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-3 text-stone-300">
                  <div className="w-2 h-2 bg-accent rounded-full shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-5/12 w-full bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl">
            <h3 className="text-2xl font-serif text-white mb-8 text-center">
              Get in Touch
            </h3>
            <div className="space-y-6">
              <a
                href={`mailto:${settings.email || "nick@eastpointekc.com"}`}
                className="group block bg-white hover:bg-accent transition-colors p-6 rounded-sm text-center shadow-lg"
              >
                <Mail
                  className="mx-auto text-primary mb-3 group-hover:scale-110 transition-transform"
                  size={28}
                />
                <span className="block text-stone-400 text-xs uppercase tracking-widest mb-1 group-hover:text-primary/70">
                  Email Us
                </span>
                <span className="block text-xl font-bold text-primary">
                  {settings.email || "nick@eastpointekc.com"}
                </span>
              </a>

              <a
                href={settings.phoneLink || "tel:+18162558683"}
                className="group block bg-primary border border-white/20 hover:border-accent hover:bg-white/5 transition-all p-6 rounded-sm text-center"
              >
                <Phone
                  className="mx-auto text-white mb-3 group-hover:scale-110 transition-transform"
                  size={28}
                />
                <span className="block text-stone-400 text-xs uppercase tracking-widest mb-1">
                  Call Us
                </span>
                <span className="block text-xl font-bold text-white">
                  {settings.phone || "(816) 255-8683"}
                </span>
              </a>
            </div>

            <p className="text-center text-stone-500 text-sm mt-8 italic">
              {settings.officeHours || "Office Hours: Mon-Fri, 9am - 5pm CST"}
            </p>
          </div>
        </div>
      </section>

      {/* 5. COME SEE US SECTION */}
      <section className="bg-stone-900 text-white py-24 relative overflow-hidden border-t border-white/5">
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
                Visit our offices to tour the grounds before your event!
              </p>
              <p className="text-stone-400 leading-relaxed mb-10 max-w-lg">
                We'd love to walk you through the cabins and event spaces to help you visualize your gathering.
              </p>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Location</h4>
                    <p className="text-stone-400">{settings.address || "Lake Lafayette, Odessa, MO 64076"}</p>
                    <a
                      href={settings.googleMapsUrl || "https://www.google.com/maps/dir/?api=1&destination=38.9458417,-93.9713331"}
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
                    <p className="text-stone-400">{settings.officeHours || "We are open year round!"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full h-[500px] bg-stone-800 rounded-lg overflow-hidden border border-white/10 shadow-2xl relative group">
              <iframe
                src={settings.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12435.5!2d-93.9713331!3d38.9458417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c169965ad4a83d%3A0x1b1bb606912fe188!2sLake%20Lafayette!5e0!3m2!1sen!2sus!4v1709900000000!5m2!1sen!2sus"}
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

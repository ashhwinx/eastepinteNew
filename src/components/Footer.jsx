import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Instagram, Facebook, Twitter } from './SocialIcons';
import { getSiteSettings } from '../data/siteContent';

const navItems = [
  { label: "Home Page", path: "/" },
  { label: "Cabins", path: "/cabins" },
  { label: "Amenities", path: "/comfort" },
  { label: "Community", path: "/gather" },
  { label: "Explore", path: "/beyond" },
  { label: "Membership", path: "/family" }
];

export default function Footer() {
  const settings = getSiteSettings();

  return (
    <footer className="bg-primary text-cream py-20 border-t border-earth relative overflow-hidden">
      {/* Background watermark */}
      <img
        src="/logo.avif"
        alt=""
        className="absolute bottom-0 right-0 text-white/5 h-[500px] w-[500px] transform translate-x-1/3 translate-y-1/3 pointer-events-none opacity-5 filter invert"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-5 group mb-8">
              <img
                src="/logo.avif"
                alt="East Pointe Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-serif font-bold tracking-widest leading-none text-white">
                  EAST POINTE
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.3em] font-medium opacity-70 text-white ml-0.5">
                  Lake Cabin Experience
                </span>
              </div>
            </div>
            <p className="max-w-md text-stone-300 leading-relaxed mb-8 text-lg font-light">
              {settings.footerDescription}
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-sm font-bold mb-8 tracking-[0.2em] uppercase text-accent">
              Explore
            </h4>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-stone-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="text-sm font-bold mb-8 tracking-[0.2em] uppercase text-accent">
              Get in Touch
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 text-stone-400 group">
                <div className="mt-1 p-2 bg-white/5 rounded-full group-hover:bg-accent group-hover:text-primary transition-colors">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="block text-white mb-1">
                    Email us for any questions or booking
                  </span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="group-hover:text-white transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>
              </li>

              <li className="flex flex-col gap-4 mt-8">
                <div className="text-stone-400 text-sm">Follow our journey</div>
                <div className="flex gap-4">
                  <a
                    href={settings.socialLinks[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 rounded-full hover:bg-accent hover:text-primary transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href={settings.socialLinks[1].url}
                    className="p-3 bg-white/5 rounded-full hover:bg-accent hover:text-primary transition-all duration-300"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href={settings.socialLinks[2].url}
                    className="p-3 bg-white/5 rounded-full hover:bg-accent hover:text-primary transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <Twitter size={20} />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-start text-sm text-stone-500">
          <div>
            <p>
              © {new Date().getFullYear()} {settings.copyrightText}
            </p>
            <Link
              to="/studio"
              className="text-[10px] tracking-widest uppercase transition-colors duration-300 mt-2 inline-block text-[#3d2e28] hover:text-white"
            >
              cms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

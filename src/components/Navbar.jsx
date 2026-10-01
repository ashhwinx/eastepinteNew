import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Instagram, Facebook, Twitter } from './SocialIcons';
import { useSiteSettings } from '../data/siteContent';

const navItems = [
  { label: "Home Page", path: "/" },
  { label: "Cabins", path: "/cabins" },
  { label: "Amenities", path: "/comfort" },
  { label: "Community", path: "/gather" },
  { label: "Explore", path: "/beyond" },
  { label: "Membership", path: "/family" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const settings = useSiteSettings();

  const isHome = location.pathname === "/";

  const closeMenu = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.overflowX = "clip";
      if (top) window.scrollTo(0, parseInt(top || "0") * -1);
    }
  };

  const toggleMenu = () => {
    if (mobileMenuOpen) {
      closeMenu();
    } else {
      const scrollY = window.scrollY;
      setMobileMenuOpen(true);
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const paddingClass = isScrolled ? "py-4" : "py-6";
  let bgClass = "";
  if (mobileMenuOpen) {
    bgClass = "bg-primary";
  } else if (isScrolled) {
    bgClass = "bg-primary/90 backdrop-blur-md shadow-lg";
  } else if (isHome) {
    bgClass = "bg-transparent";
  } else {
    bgClass = "bg-primary";
  }

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${bgClass} ${paddingClass}`}>
        <div className="container mx-auto px-6 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link to="/" onClick={closeMenu} className="flex items-center gap-5 group relative z-50">
              <img
                src={settings.logo || "/logo.avif"}
                alt={`${settings.siteName || 'East Pointe'} Logo`}
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-serif font-bold tracking-widest leading-none text-white">
                  {settings.siteName || "EAST POINTE"}
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.3em] font-medium opacity-70 text-white ml-0.5">
                  {settings.tagline || "Lake Cabin Experience"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-10">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `text-xs font-bold uppercase tracking-[0.15em] py-2 relative group overflow-hidden transition-colors duration-300 ${
                      isActive ? "text-accent" : "text-white/80 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{item.label}</span>
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[1px] bg-accent transform origin-left transition-transform duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Action */}
            <div className="flex items-center gap-3 md:gap-6 relative z-50">
              <Link
                to="/contact"
                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 border text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  mobileMenuOpen
                    ? "border-white/30 text-white hover:bg-white hover:text-primary"
                    : isScrolled || !isHome
                    ? "border-accent text-accent hover:bg-accent hover:text-primary"
                    : "border-white text-white hover:bg-white hover:text-primary"
                }`}
              >
                Contact
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={toggleMenu}
                className={`xl:hidden p-1 transition-colors duration-300 hover:scale-110 active:scale-95 ${
                  mobileMenuOpen ? "text-white rotate-90" : isScrolled || !isHome ? "text-accent" : "text-white"
                }`}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={32} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-primary transform transition-transform duration-500 cubic-bezier(0.65, 0, 0.35, 1) ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ paddingTop: "100px" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <img src="/logo.avif" alt="" className="absolute -bottom-24 -right-24 w-[600px] h-[600px] object-contain opacity-20 filter invert" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 h-full flex flex-col relative z-10 overflow-y-auto pb-10">
          <div className="flex-grow flex flex-col md:flex-row md:items-center justify-center gap-12 md:gap-24">
            <div className="flex flex-col space-y-6 md:space-y-8 items-center md:items-start">
              <span className="text-accent text-xs font-bold uppercase tracking-widest mb-2 opacity-50 block md:hidden">
                Menu
              </span>
              {navItems.map((item, idx) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `text-3xl md:text-5xl font-serif text-white hover:text-accent transition-all duration-300 transform hover:translate-x-4 ${
                      isActive ? "italic text-accent" : ""
                    }`
                  }
                  style={{
                    transitionDelay: `${100 + idx * 50}ms`,
                    opacity: mobileMenuOpen ? 1 : 0,
                    transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)"
                  }}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div
              className={`flex flex-col items-center md:items-start space-y-8 pt-8 md:pt-0 md:border-l md:border-white/10 md:pl-16 transition-all duration-700 delay-300 ${
                mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-center md:text-left">
                <h4 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Contact Us</h4>
                <p className="text-stone-300 text-lg font-light">{settings.phone}</p>
                <p className="text-stone-300 text-lg font-light">{settings.email}</p>
              </div>

              <div className="text-center md:text-left">
                <h4 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Follow Us</h4>
                <div className="flex space-x-6 text-white">
                  <a href={settings.socialLinks[0].url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    <Instagram size={24} />
                  </a>
                  <a href={settings.socialLinks[1].url} className="hover:text-accent transition-colors">
                    <Facebook size={24} />
                  </a>
                  <a href={settings.socialLinks[2].url} className="hover:text-accent transition-colors">
                    <Twitter size={24} />
                  </a>
                </div>
              </div>

              <Link
                to="/contact"
                onClick={closeMenu}
                className="bg-accent text-primary px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,197,176,0.3)] flex items-center gap-3"
              >
                Contact Us <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

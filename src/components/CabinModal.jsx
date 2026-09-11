import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MapPin,
  Users,
  Bed,
  Bath,
  Ruler,
  Check
} from 'lucide-react';

// Fullscreen Zoom Lightbox
export function Lightbox({ images, initialIndex = 0, isOpen, onClose }) {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    setCurrent(initialIndex);
  }, [initialIndex, isOpen]);

  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      if (images && images.length > 0) {
        setCurrent((prev) => (prev + 1) % images.length);
      }
    },
    [images]
  );

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      if (images && images.length > 0) {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
      }
    },
    [images]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50 transition-colors"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white p-4 rounded-full hover:bg-white/10 transition-all z-50"
            aria-label="Previous image"
          >
            <ChevronLeft size={40} strokeWidth={1.5} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white p-4 rounded-full hover:bg-white/10 transition-all z-50"
            aria-label="Next image"
          >
            <ChevronRight size={40} strokeWidth={1.5} />
          </button>
        </>
      )}

      <div className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center p-4 md:p-10">
        <img
          src={images[current]}
          alt={`View ${current + 1}`}
          className="max-h-[85vh] max-w-full object-contain shadow-2xl rounded-sm animate-fade-in"
        />
        <div className="absolute bottom-6 left-0 w-full text-center text-white/50 text-sm tracking-widest font-mono">
          {current + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}

// Full Cabin Details Modal
export default function CabinModal({ cabin, isOpen, onClose }) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      setActiveImage(0);
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (top) window.scrollTo(0, parseInt(top || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && cabin && thumbRefs.current[activeImage]) {
      thumbRefs.current[activeImage].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [activeImage, isOpen, cabin]);

  if (!isOpen || !cabin) return null;

  const images = cabin.images || [];
  const hasImages = images.length > 0;
  const isAvailable = cabin.status === "Available" || cabin.status === "available";

  const handleNext = () => {
    if (hasImages) {
      setActiveImage((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (hasImages) {
      setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-primary/80 backdrop-blur-sm animate-fade-in-fast touch-none"
          onClick={onClose}
        />

        {/* Modal Window */}
        <div className="relative bg-white w-full h-[100dvh] md:h-[90vh] md:max-w-6xl md:rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-colors md:hidden"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          {/* Desktop close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-stone-100 hover:bg-stone-200 text-primary rounded-full transition-colors hidden md:block"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Left Column: Photo Gallery with Thumbnail scroller */}
          <div className="w-full md:w-1/2 bg-stone-100 relative flex flex-col h-[40dvh] md:h-full group">
            {hasImages ? (
              <div
                className="relative flex-grow overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={images[activeImage]}
                  alt={cabin.name}
                  className="w-full h-full object-cover"
                />

                {/* Counter badge */}
                <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md pointer-events-none border border-white/10 shadow-sm">
                  {activeImage + 1} / {images.length}
                </div>

                {/* Zoom icon top left */}
                <div className="absolute top-4 left-4 bg-black/30 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <Maximize2 size={20} />
                </div>

                {/* Arrow navigation buttons */}
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="p-2 bg-black/30 hover:bg-black/50 text-white rounded-full pointer-events-auto transition-colors transform hover:scale-110"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="p-2 bg-black/30 hover:bg-black/50 text-white rounded-full pointer-events-auto transition-colors transform hover:scale-110"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400">
                No images available
              </div>
            )}

            {/* Thumbnail Strip */}
            {hasImages && (
              <div className="h-20 bg-primary/5 flex overflow-x-auto snap-x scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    ref={(el) => (thumbRefs.current[idx] = el)}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-24 h-full relative snap-start transition-all duration-200 ${
                      activeImage === idx
                        ? "opacity-100 ring-2 ring-inset ring-secondary z-10"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Cabin Specifications & Details */}
          <div className="w-full md:w-1/2 bg-white flex flex-col flex-1 md:h-full overflow-hidden">
            {/* Scrollable details container */}
            <div className="flex-grow overflow-y-auto p-8 md:p-12 space-y-8 custom-scrollbar">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                  <MapPin size={14} className="text-accent" />
                  <span className="uppercase tracking-widest">{cabin.location || "Odessa, MO"}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
                  {cabin.name}
                </h2>

                {/* Specs Bar */}
                <div className="flex flex-wrap gap-4 md:gap-8 py-6 border-y border-stone-100">
                  {cabin.sleeps && (
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-accent" />
                      <span className="font-bold text-stone-700">{cabin.sleeps} Guests</span>
                    </div>
                  )}
                  {cabin.bedrooms && (
                    <div className="flex items-center gap-2">
                      <Bed size={20} className="text-accent" />
                      <span className="font-bold text-stone-700">{cabin.bedrooms}</span>
                    </div>
                  )}
                  {cabin.baths && (
                    <div className="flex items-center gap-2">
                      <Bath size={20} className="text-accent" />
                      <span className="font-bold text-stone-700">{cabin.baths} Baths</span>
                    </div>
                  )}
                  {cabin.sqFt && (
                    <div className="flex items-center gap-2">
                      <Ruler size={20} className="text-accent" />
                      <span className="font-bold text-stone-700">{cabin.sqFt} Sq Ft</span>
                    </div>
                  )}
                </div>
              </div>

              {/* About the Space */}
              <div>
                <h3 className="text-lg font-bold font-serif text-primary mb-3">About the Space</h3>
                <p className="text-stone-600 leading-relaxed font-light whitespace-pre-line">
                  {cabin.desc || cabin.description}
                </p>
              </div>

              {/* Sleeping Arrangements */}
              {cabin.sleepingArrangements && cabin.sleepingArrangements.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold font-serif text-primary mb-4">
                    Sleeping Arrangements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cabin.sleepingArrangements.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-50 p-4 rounded-sm border border-stone-100"
                      >
                        <span className="block text-xs font-bold uppercase text-stone-400 mb-1">
                          {item.room || item.name || `Bedroom ${idx + 1}`}
                        </span>
                        <span className="block font-medium text-primary">
                          {item.bed || item.beds || item.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Highlights */}
              {cabin.features && cabin.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold font-serif text-primary mb-4">
                    Property Highlights
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cabin.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-stone-600 text-sm">
                        <Check size={16} className="text-secondary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="px-6 pt-6 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-6 border-t border-stone-100 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.05)] flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Status</p>
                <p
                  className={`font-bold ${
                    isAvailable ? "text-green-600" : "text-stone-400"
                  }`}
                >
                  {isAvailable ? "Available" : "Coming Soon"}
                </p>
              </div>

              {isAvailable && cabin.bookingLink ? (
                <a
                  href={cabin.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 font-bold uppercase tracking-widest text-sm transition-all duration-300 rounded-sm bg-primary text-white hover:bg-secondary shadow-lg hover:shadow-xl inline-block text-center"
                >
                  Book Now
                </a>
              ) : (
                <button
                  disabled={!isAvailable}
                  className={`px-8 py-3 font-bold uppercase tracking-widest text-sm transition-all duration-300 rounded-sm ${
                    isAvailable
                      ? "bg-primary text-white hover:bg-secondary shadow-lg hover:shadow-xl"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed"
                  }`}
                >
                  {isAvailable ? "Book Now" : "Coming Soon"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        initialIndex={activeImage}
      />
    </>
  );
}

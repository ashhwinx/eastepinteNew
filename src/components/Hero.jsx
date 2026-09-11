import React, { useState, useEffect } from 'react';

export default function Hero({
  title,
  subtitle,
  image,
  overlayOpacity = 0.4,
  height = "medium"
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => setLoaded(true);
  }, [image]);

  const heightClasses = {
    full: "h-screen",
    large: "h-[80vh]",
    medium: "h-[60vh]",
    small: "h-[40vh]"
  }[height] || "h-[60vh]";

  return (
    <div className={`relative w-full ${heightClasses} flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden bg-primary`}>
      {/* Background Image */}
      <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${loaded ? "opacity-100" : "opacity-0"}`}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[2000ms] ease-in-out hover:scale-105"
        />
      </div>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-1000"
        style={{ opacity: loaded ? overlayOpacity : 0 }}
      />

      {/* Text Content */}
      <div className={`relative z-10 text-center text-white px-4 max-w-4xl transition-all duration-1000 transform ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl font-light tracking-wide text-stone-100 drop-shadow-md max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

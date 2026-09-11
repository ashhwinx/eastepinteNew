import React, { useState, useEffect } from 'react';

export default function Preloader({ onFinish }) {
  const [percent, setPercent] = useState(0);
  const [slideUp, setSlideUp] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const p = setTimeout(() => setFadeIn(true), 100);
    const interval = setInterval(() => {
      setPercent(prev => {
        const next = prev + Math.random() * 8;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 40);
    const maxTimeout = setTimeout(() => setPercent(100), 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(maxTimeout);
      clearTimeout(p);
    };
  }, []);

  useEffect(() => {
    if (percent === 100) {
      const p = setTimeout(() => {
        setSlideUp(true);
        const y = setTimeout(() => {
          document.body.style.overflow = "unset";
          if (onFinish) onFinish();
        }, 1200);
        return () => clearTimeout(y);
      }, 600);
      return () => clearTimeout(p);
    }
  }, [percent, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1c1311] transition-transform duration-[1200ms] cubic-bezier(0.87, 0, 0.13, 1) ${
        slideUp ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`relative flex flex-col items-center justify-center w-full max-w-lg px-6 transition-all duration-700 transform ${
          fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } ${slideUp ? "opacity-0 translate-y-[-50px] duration-500" : ""}`}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          <img src="/logo.avif" alt="East Pointe Monogram" className="w-48 h-48 opacity-5" />
        </div>
        <div className="relative z-10 text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream tracking-[0.15em] mb-2 drop-shadow-sm">
            EAST POINTE
          </h1>
          <p className="text-accent/60 text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium">
            Lake Cabin Experience
          </p>
        </div>
        <div className="relative z-10 w-full max-w-[240px] flex flex-col items-center">
          <div className="w-full h-[1px] bg-white/10 mb-4 overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-accent transition-all duration-150 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between w-full text-[10px] font-mono text-accent/50 uppercase tracking-widest">
            <span>Loading</span>
            <span>{Math.floor(percent).toString().padStart(3, "0")}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

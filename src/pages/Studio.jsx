import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, ExternalLink } from 'lucide-react';

export default function Studio() {
  return (
    <div className="min-h-screen bg-[#101112] text-white flex flex-col items-center justify-center p-6 relative">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-stone-400 hover:text-white text-xs uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={16} /> Return to Website
      </Link>

      <div className="max-w-md w-full bg-[#181a1b] p-8 md:p-10 rounded-xl shadow-2xl border border-white/10 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
          <Lock size={28} />
        </div>

        <h1 className="text-2xl font-serif font-bold text-white mb-2">East Pointe Studio</h1>
        <p className="text-stone-400 text-xs tracking-wider uppercase mb-8">
          Sanity CMS Management Portal
        </p>

        <div className="space-y-3 mb-8">
          <button
            onClick={() => alert("Sanity Studio login is restricted to authorized East Pointe administrators.")}
            className="w-full py-3.5 px-4 bg-[#232729] hover:bg-[#2c3134] text-white font-medium text-xs rounded transition-colors flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
            Continue with Google
          </button>
          <button
            onClick={() => alert("Sanity Studio login is restricted to authorized East Pointe administrators.")}
            className="w-full py-3.5 px-4 bg-[#232729] hover:bg-[#2c3134] text-white font-medium text-xs rounded transition-colors flex items-center justify-center gap-3"
          >
            <img src="https://github.com/favicon.ico" alt="" className="w-4 h-4 invert" />
            Continue with GitHub
          </button>
          <button
            onClick={() => alert("Sanity Studio login is restricted to authorized East Pointe administrators.")}
            className="w-full py-3.5 px-4 bg-[#232729] hover:bg-[#2c3134] text-white font-medium text-xs rounded transition-colors flex items-center justify-center gap-3"
          >
            Continue with E-mail / password
          </button>
        </div>

        <div className="pt-6 border-t border-white/10 text-[11px] text-stone-500 flex justify-center gap-4">
          <a
            href="https://www.sanity.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-300 flex items-center gap-1"
          >
            sanity.io <ExternalLink size={10} />
          </a>
          <span>•</span>
          <a
            href="https://www.sanity.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-300"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  );
}

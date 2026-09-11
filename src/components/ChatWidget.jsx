import React, { useEffect, useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { getSiteSettings } from '../data/siteContent';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Welcome to East Pointe! I'm your digital concierge. How can I help you with your lake cabin getaway today?" }
  ]);
  const [input, setInput] = useState('');
  const settings = getSiteSettings();

  useEffect(() => {
    // Chatbase embed integration
    try {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args) => {
          window.chatbase.q = window.chatbase.q || [];
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            return prop === "q" ? target.q : (...args) => target(prop, ...args);
          }
        });
      }
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "RQAqJS_-EAZ5aNXVTrMa1";
      script.domain = "www.chatbase.co";
      document.body.appendChild(script);

      return () => {
        const el = document.getElementById("RQAqJS_-EAZ5aNXVTrMa1");
        if (el) el.remove();
      };
    } catch (e) {
      console.warn("Chatbase init fallback", e);
    }
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let reply = "Thank you for reaching out! You can check our available cabins on the Cabins page, or contact Nick directly at nick@eastpointekc.com or call (816) 255-8683.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('check in') || lower.includes('time') || lower.includes('hours')) {
        reply = "Self check-in is available 24/7 via digital smart locks. Standard check-in begins at 4:00 PM and check-out is by 11:00 AM. Members receive complimentary late check-out!";
      } else if (lower.includes('cabin') || lower.includes('book') || lower.includes('price')) {
        reply = "We offer 8 unique cabins including the 5-bedroom Bayview (sleeps 15), Aston Harbor (romantic studio), Aspire (sleeps 7), and Cedar Pointe. Check out our Cabins page for detailed photos and booking links!";
      } else if (lower.includes('location') || lower.includes('where') || lower.includes('address')) {
        reply = "We are located at Lake Lafayette in Odessa, Missouri 64076 — approximately 35 minutes from Downtown Kansas City and 40 minutes from MCI Airport.";
      } else if (lower.includes('wedding') || lower.includes('reunion') || lower.includes('event')) {
        reply = "We host intimate lakeside weddings up to 50 guests, family reunions across multiple cabins, and corporate retreats. Visit our Community page or contact our team to start planning!";
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Concierge Bubble (shown if external widget iframe isn't active) */}
      <div className="fixed bottom-6 right-6 z-[80]">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 bg-primary hover:bg-secondary text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-accent/20 group"
            aria-label="Open concierge chat"
          >
            <div className="relative">
              <MessageSquare size={20} className="text-accent" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">
              Ask Concierge
            </span>
          </button>
        ) : (
          <div className="w-[90vw] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm leading-tight">East Pointe Concierge</h4>
                  <p className="text-[10px] text-accent/80 tracking-wider uppercase">Online • Lake Lafayette</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-stone-300 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-[#fbf9f6] text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white text-stone-700 shadow-sm border border-stone-200/60 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cabins, check-in, location..."
                className="flex-grow px-3 py-2 text-xs bg-stone-100 rounded-full focus:outline-none focus:ring-1 focus:ring-secondary"
              />
              <button
                type="submit"
                className="p-2.5 bg-primary hover:bg-secondary text-white rounded-full transition-colors shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

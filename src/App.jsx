import React, { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import ChatWidget from './components/ChatWidget';

// Pages
import Home from './pages/Home';
import Cabins from './pages/Cabins';
import Amenities from './pages/Amenities';
import Community from './pages/Community';
import Explore from './pages/Explore';
import Membership from './pages/Membership';
import Contact from './pages/Contact';
import { SanityProvider } from './sanity/SanityContext';

const Studio = React.lazy(() => import('./pages/Studio'));

function Layout() {
  const location = useLocation();
  const isStudio = location.pathname.startsWith('/studio');

  if (isStudio) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream text-stone-900 font-sans selection:bg-accent selection:text-primary overflow-x-hidden w-full max-w-full">
      <Navbar />
      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <SanityProvider>
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cabins" element={<Cabins />} />
            <Route path="comfort" element={<Amenities />} />
            <Route path="amenities" element={<Amenities />} />
            <Route path="gather" element={<Community />} />
            <Route path="community" element={<Community />} />
            <Route path="beyond" element={<Explore />} />
            <Route path="explore" element={<Explore />} />
            <Route path="family" element={<Membership />} />
            <Route path="membership" element={<Membership />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route
            path="studio/*"
            element={
              <Suspense
                fallback={
                  <div className="min-h-screen bg-[#101112] text-stone-300 flex flex-col items-center justify-center gap-4 font-sans">
                    <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs uppercase tracking-[0.25em] text-stone-400">Loading East Pointe Studio...</span>
                  </div>
                }
              >
                <Studio />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </SanityProvider>
  );
}

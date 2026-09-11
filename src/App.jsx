import React, { useState } from 'react';
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
import Studio from './pages/Studio';

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
    <>
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
          <Route path="studio/*" element={<Studio />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

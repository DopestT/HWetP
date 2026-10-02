import React, { useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import AgeGate from '@/components/AgeGate';
import { getAgeConfirmed, setAgeConfirmed } from '@/lib/herwetStorage';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Watch from '@/pages/Watch';
import Category from '@/pages/Category';
import Library from '@/pages/Library';
import TrustSafety from '@/pages/TrustSafety';

function NotFound() {
  return (
    <div className="min-h-screen bg-abyss px-6 py-24 text-seafoam">
      <div className="mx-auto max-w-xl">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">404</div>
        <h1 className="heading-display mt-4 text-5xl">Nothing surfaced</h1>
        <p className="mt-4 text-seafoam/50">This route does not exist.</p>
        <Link className="mt-8 inline-flex rounded-full border border-cyan/40 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-cyan" to="/">Return home</Link>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [ageConfirmed, setAgeState] = useState(() => getAgeConfirmed());
  const trustRoute = location.pathname.startsWith('/trust/');

  const enter = () => {
    setAgeConfirmed();
    setAgeState(true);
  };

  return (
    <>
      {!trustRoute && !ageConfirmed && <AgeGate onEnter={enter} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/watch/:slug" element={<Watch />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/library" element={<Library />} />
        <Route path="/trust/:section" element={<TrustSafety />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

import React from 'react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import ChatWindow from './components/ChatWindow';
import ProviderPanel from './components/ProviderPanel';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="grid lg:grid-cols-[1fr_340px] gap-6">
            <div className="bg-neutral-900/60 backdrop-blur border border-neutral-800 rounded-2xl p-2 shadow-xl">
              <ChatWindow />
            </div>
            <div className="bg-neutral-900/60 backdrop-blur border border-neutral-800 rounded-2xl p-6 h-fit sticky top-6">
              <ProviderPanel />
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 text-center text-neutral-400 text-sm">
        Built with Puter.js, React, and Tailwind CSS
      </footer>
    </div>
  );
}

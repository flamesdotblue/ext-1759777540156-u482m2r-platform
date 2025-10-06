import React from 'react';
import { Rocket, Settings } from 'lucide-react';

export default function NavBar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 via-blue-500 to-orange-400" />
          <div className="font-semibold tracking-tight">Puter AI Chat</div>
        </div>
        <div className="flex items-center gap-3 text-neutral-400">
          <a
            href="https://puter.com" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 hover:text-neutral-200 transition"
            aria-label="Visit Puter"
          >
            <Rocket className="h-4 w-4" />
            <span className="hidden sm:inline">Puter</span>
          </a>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
            aria-label="Settings"
            onClick={() => {
              const el = document.getElementById('provider-panel');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}

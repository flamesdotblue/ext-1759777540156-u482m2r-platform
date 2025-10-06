import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[58vh] min-h-[420px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/40 to-neutral-950 pointer-events-none" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-orange-300">
            Conversational AI with Puter.js
          </h1>
          <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
            An AI voice agent inspired chat experience. Secure, expressive, and easy to extend. Connect your Puter.js AI and start chatting.
          </p>
        </div>
      </div>
    </section>
  );
}

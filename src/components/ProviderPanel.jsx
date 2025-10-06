import React from 'react';
import usePuterAI from '../hooks/usePuterAI';

export default function ProviderPanel() {
  const { status, model, setModel, setApiKey, hasApiKey, sdkVersion } = usePuterAI();

  return (
    <div id="provider-panel" className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">AI Provider</h3>
        <p className="text-sm text-neutral-400 mt-1">Connect Puter.js for real AI responses, or use the built-in demo echo mode.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300">Model</label>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full rounded-lg bg-neutral-900/70 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-700"
          placeholder="e.g. meta-llama/Meta-Llama-3.1-8B-Instruct"
        />
        <p className="text-xs text-neutral-500">Model name is passed to Puter AI when available.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300">Puter API Key</label>
        <input
          type="password"
          placeholder={hasApiKey ? 'Saved in browser' : 'Paste your Puter API key'}
          className="w-full rounded-lg bg-neutral-900/70 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-700"
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-xs text-neutral-500">Stored locally in your browser. Leave empty to use demo mode.</p>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-300">Puter.js SDK</span>
          <span className={`px-2 py-0.5 rounded text-xs ${
            status === 'ready' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            status === 'loading' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
            'bg-neutral-700/30 text-neutral-300 border border-neutral-700'
          }`}>
            {status === 'ready' ? 'Connected' : status === 'loading' ? 'Loading' : 'Demo mode'}
          </span>
        </div>
        <div className="mt-2 text-neutral-400">
          {status === 'ready' ? (
            <>
              <div>SDK version: {sdkVersion || 'unknown'}</div>
              <div>Model: {model || 'default'}</div>
              <div>Auth: {hasApiKey ? 'API key set' : 'No key (may use public limits)'} </div>
            </>
          ) : status === 'loading' ? (
            <div>Fetching SDK from js.puter.com…</div>
          ) : (
            <div>SDK not connected. You can still chat with a local demo echo assistant.</div>
          )}
        </div>
      </div>

      <div className="text-xs text-neutral-500">
        Tip: After adding your API key, start chatting. If the SDK is available and your account has access, responses will stream from Puter AI.
      </div>
    </div>
  );
}

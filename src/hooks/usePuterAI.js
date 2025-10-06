import { useCallback, useEffect, useRef, useState } from 'react';

// Lightweight client that dynamically loads Puter.js from CDN when the app mounts.
// Falls back to a local demo echo if SDK or credentials are not available.
export default function usePuterAI() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'fallback'
  const [model, setModel] = useState(() => localStorage.getItem('PUTER_MODEL') || 'meta-llama/Meta-Llama-3.1-8B-Instruct');
  const [hasApiKey, setHasApiKey] = useState(() => Boolean(localStorage.getItem('PUTER_API_KEY')));
  const [sdkVersion, setSdkVersion] = useState(null);

  const sdkRef = useRef(null); // module namespace
  const clientRef = useRef(null); // puter client instance if available

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setStatus('loading');
        const mod = await import('https://js.puter.com/v2/puter.js');
        if (cancelled) return;
        sdkRef.current = mod;
        setSdkVersion(mod?.version || mod?.default?.version || null);

        const apiKey = localStorage.getItem('PUTER_API_KEY') || undefined;
        try {
          if (mod?.Puter) {
            // Many SDKs accept a token or rely on interactive auth. We'll pass token if provided.
            const opts = {};
            if (apiKey) opts.token = apiKey;
            if (model) opts.model = model;
            // Some versions expose top-level Puter, others under default
            const PuterCtor = mod.Puter || mod.default?.Puter;
            if (PuterCtor) {
              clientRef.current = new PuterCtor(opts);
              setStatus('ready');
              return;
            }
          }
          setStatus('fallback');
        } catch (_) {
          setStatus('fallback');
        }
      } catch (e) {
        setStatus('fallback');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [model]);

  const setApiKey = useCallback((key) => {
    if (key && key.trim()) {
      localStorage.setItem('PUTER_API_KEY', key.trim());
      setHasApiKey(true);
    } else {
      localStorage.removeItem('PUTER_API_KEY');
      setHasApiKey(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('PUTER_MODEL', model || '');
  }, [model]);

  async function* demoStream(messages) {
    const last = messages.filter(m => m.role === 'user').pop();
    const reply = `Demo mode: I received your message: "${last?.content || ''}"`;
    // Stream word by word for a natural feel
    const parts = reply.split(/(\s+)/);
    for (const p of parts) {
      await new Promise(r => setTimeout(r, Math.min(80, 4000 / parts.length)));
      yield p;
    }
  }

  async function* puterStream(messages) {
    const mod = sdkRef.current;
    const client = clientRef.current;
    // Try several common SDK shapes safely.
    // 1) OpenAI-like: client.ai.chat.completions.create({ model, messages, stream: true })
    try {
      const targetModel = model || undefined;
      if (client?.ai?.chat?.completions?.create) {
        const res = await client.ai.chat.completions.create({ model: targetModel, messages, stream: true });
        // If res is an async iterable
        if (res && typeof res[Symbol.asyncIterator] === 'function') {
          for await (const ev of res) {
            const delta = ev?.choices?.[0]?.delta?.content || ev?.data || ev?.text || '';
            if (delta) yield String(delta);
          }
          return;
        }
        // If not streaming, fall back to full text
        const text = res?.choices?.[0]?.message?.content || res?.data || res?.text || '';
        yield String(text || '');
        return;
      }
    } catch (_) {}

    // 2) Generic completion: client.ai.generateText({ model, prompt })
    try {
      const lastUser = messages.filter(m => m.role === 'user').pop();
      if (client?.ai?.generateText) {
        const r = await client.ai.generateText({ model, prompt: lastUser?.content || '' });
        const text = r?.output || r?.text || r?.choices?.[0]?.text || '';
        yield String(text || '');
        return;
      }
    } catch (_) {}

    // 3) Module-level helper: mod.ai.chat(messages)
    try {
      if (mod?.ai?.chat) {
        const r = await mod.ai.chat(messages);
        const text = r?.text || r?.content || '';
        yield String(text || '');
        return;
      }
    } catch (_) {}

    // Fallback to demo if nothing worked
    for await (const chunk of demoStream(messages)) {
      yield chunk;
    }
  }

  const sendMessage = useCallback(
    async function* (messages) {
      if (status === 'ready') {
        for await (const chunk of puterStream(messages)) {
          yield chunk;
        }
      } else {
        for await (const chunk of demoStream(messages)) {
          yield chunk;
        }
      }
    },
    [status, model]
  );

  return {
    status,
    model,
    setModel,
    hasApiKey,
    setApiKey,
    sdkVersion,
    sendMessage,
  };
}

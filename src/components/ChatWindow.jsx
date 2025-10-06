import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Send, User, Bot } from 'lucide-react';
import usePuterAI from '../hooks/usePuterAI';

function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-2 max-w-[90%] sm:max-w-[80%]`}>
        {!isUser && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-tr from-purple-600 via-blue-600 to-orange-500 grid place-items-center">
            <Bot className="h-4 w-4" />
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm border ${
            isUser
              ? 'bg-blue-600/20 border-blue-500/30 text-blue-100'
              : 'bg-neutral-900/70 border-neutral-800 text-neutral-100'
          }`}
        >
          {content}
        </div>
        {isUser && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-800 grid place-items-center">
            <User className="h-4 w-4 text-neutral-300" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const { status, sendMessage } = usePuterAI();

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your Puter-powered AI. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isThinking, [input, isThinking]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isThinking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setIsThinking(true);

    let assistantIndex;
    setMessages((prev) => {
      assistantIndex = prev.length;
      return [...prev, { role: 'assistant', content: '' }];
    });

    try {
      let streamed = '';
      for await (const chunk of sendMessage(next)) {
        streamed += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          copy[assistantIndex] = { role: 'assistant', content: streamed };
          return copy;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[assistantIndex] = {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.'
        };
        return copy;
      });
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-[64vh] min-h-[440px]">
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        {isThinking && (
          <div className="text-xs text-neutral-400 animate-pulse pl-10">Assistant is thinking...</div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-2 border-t border-neutral-800">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (canSend) handleSubmit(e);
              }
            }}
            placeholder={
              status === 'ready'
                ? 'Message the AI...'
                : status === 'loading'
                ? 'Loading Puter.js...'
                : 'Using local demo (echo). Open Settings to enable Puter.js.'
            }
            className="flex-1 resize-none rounded-xl bg-neutral-900/70 border border-neutral-800 focus:border-neutral-700 focus:outline-none p-3 text-sm placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={!canSend}
            className={`h-10 px-4 rounded-xl inline-flex items-center gap-2 border transition ${
              canSend
                ? 'bg-blue-600/20 border-blue-500/30 text-blue-100 hover:bg-blue-600/30'
                : 'bg-neutral-900/50 border-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}

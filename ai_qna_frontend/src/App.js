import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App - Ocean Professional themed Q&A UI.
 * Provides:
 * - Centered question input at top
 * - AI answers displayed below
 * - Minimalist, modern styling with blue (#2563EB) and amber (#F59E0B) accents
 * - Smooth transitions, subtle gradients, and soft shadows
 * - Placeholder "Ask AI" handler with simulated latency; ready for backend integration
 */
function App() {
  // UI Theme (light only per Ocean Professional; hook left for future)
  const [theme, setTheme] = useState('light');

  // Q&A state
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm your AI assistant. Ask me anything, and I'll do my best to help with clear, concise answers.",
      ts: new Date().toISOString(),
    },
  ]);

  // Auto grow textarea
  const inputRef = useRef(null);
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
  }, [question]);

  // Apply theme data attribute (kept for extensibility)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Derived placeholder text
  const placeholder = useMemo(
    () => 'Ask a question... (e.g., "Explain React hooks in simple terms")',
    []
  );

  // PUBLIC_INTERFACE
  // Simulated ask to backend. Replace implementation to call your API.
  const askAI = async (q) => {
    // This function simulates an API call latency and deterministic response.
    // Replace with a real fetch to your backend:
    // const res = await fetch(`${process.env.REACT_APP_API_URL}/ask`, { method: 'POST', body: JSON.stringify({ question: q }) });
    // const data = await res.json();
    // return data.answer;
    await new Promise((r) => setTimeout(r, 900));
    const canned =
      "Here's a concise explanation:\n\n- React hooks let you use state and lifecycle features in functional components.\n- Common hooks: useState for state, useEffect for side effects, useMemo/useCallback for memoization.\n- Keep hooks at the top level and never inside conditions or loops.\n\nWould you like a small code example?";
    return canned;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const q = question.trim();
    if (!q || isAsking) return;

    // Push user question
    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: q,
      ts: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setIsAsking(true);

    try {
      const answer = await askAI(q);
      const aiMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: answer,
        ts: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content:
          'Sorry, something went wrong while fetching the answer. Please try again.',
        ts: new Date().toISOString(),
        error: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  // PUBLIC_INTERFACE
  // Handler to toggle theme kept for future; currently single theme styling is used
  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'light' : 'light'));
  };

  return (
    <div className="OceanApp">
      <header className="op-header">
        <div className="op-brand">
          <div className="op-logo" aria-hidden="true">🧭</div>
          <div className="op-titleblock">
            <h1 className="op-title">Ocean Q&A</h1>
            <p className="op-subtitle">Ask. Explore. Understand.</p>
          </div>
        </div>
        <button
          type="button"
          className="op-theme-toggle"
          onClick={toggleTheme}
          aria-label="Theme toggle"
          title="Theme"
        >
          ☀
        </button>
      </header>

      <main className="op-main">
        <section className="op-ask-card">
          <form className="op-form" onSubmit={handleSubmit}>
            <div className="op-input-wrap">
              <textarea
                ref={inputRef}
                className="op-input"
                placeholder={placeholder}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={1}
                maxLength={2000}
                aria-label="Question input"
              />
              <div className="op-actions">
                <button
                  className="op-btn op-btn-primary"
                  type="submit"
                  disabled={!question.trim() || isAsking}
                  aria-label="Ask AI"
                >
                  {isAsking ? (
                    <span className="op-dots" aria-hidden="true">
                      <span>.</span><span>.</span><span>.</span>
                    </span>
                  ) : (
                    'Enter'
                  )}
                </button>
              </div>
            </div>
            <p className="op-hint">
              Tip: Be specific for better answers. Use Shift+Enter for new line.
            </p>
          </form>
        </section>

        <section className="op-conversation" aria-live="polite">
          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role} error={m.error}>
              {m.content}
            </MessageBubble>
          ))}
          {isAsking && <TypingBubble />}
        </section>
      </main>

      <footer className="op-footer">
        <p>
          Built with care — Ocean Professional theme. Future backend URL via
          REACT_APP_API_URL.
        </p>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * MessageBubble - renders a single chat message with role-based styling
 */
function MessageBubble({ role, children, error }) {
  const isUser = role === 'user';
  return (
    <div
      className={`op-msg ${isUser ? 'op-msg-user' : 'op-msg-assistant'} ${
        error ? 'op-msg-error' : ''
      }`}
      role="article"
    >
      <div className="op-msg-inner">
        {!isUser && <div className="op-avatar" aria-hidden="true">🌊</div>}
        <div className="op-msg-content">
          <div className="op-msg-text">
            {String(children)
              .split('\n')
              .map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TypingBubble - subtle animated loader representing AI typing
 */
function TypingBubble() {
  return (
    <div className="op-msg op-msg-assistant" role="status" aria-live="polite">
      <div className="op-msg-inner">
        <div className="op-avatar" aria-hidden="true">🌊</div>
        <div className="op-typing">
          <span className="op-typing-dot" />
          <span className="op-typing-dot" />
          <span className="op-typing-dot" />
        </div>
      </div>
    </div>
  );
}

export default App;

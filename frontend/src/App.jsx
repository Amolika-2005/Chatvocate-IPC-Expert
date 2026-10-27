import { useEffect, useRef, useState } from 'react';
import {
  Scale,
  Send,
  Plus,
  BookOpen,
  ShieldCheck,
  LoaderCircle,
} from 'lucide-react';

const API =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const welcome = {
  role: 'assistant',
  content:
    "Hello! I'm Chatvocate, your IPC document assistant. Ask about an IPC section, legal term, offence, or scenario. I'll search the supplied PDF and explain relevant information in plain English.",
  sources: [],
};

const prompts = [
  'What does IPC Section 302 cover?',
  'Explain theft and extortion.',
  'What is criminal trespass?',
  'What does the document say about defamation?',
];

export default function App() {
  const [messages, setMessages] = useState([welcome]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sourcesOn, setSourcesOn] = useState(true);

  const bottom = useRef(null);
  const input = useRef(null);

  // Always return either nothing or a real cleanup function from useEffect.
  useEffect(() => {
    if (bottom.current) {
      bottom.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  async function send(text = question) {
    const cleanedText = text.trim();
    if (!cleanedText || loading) return;

    const history = messages
      .slice(-10)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    setMessages((previous) => [
      ...previous,
      { role: 'user', content: cleanedText },
    ]);
    setQuestion('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: cleanedText, history }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: data.answer || 'The assistant returned an empty response.',
          sources: data.sources || [],
        },
      ]);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'An unexpected error occurred';

      setError(`${message}. Check that Django is running.`);
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content:
            'I could not connect to the assistant service. Check the backend and try again.',
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
      if (input.current) input.current.focus();
    }
  }

  function reset() {
    setMessages([welcome]);
    setQuestion('');
    setError('');
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brandicon">
            <Scale />
          </span>
          <div>
            <b>Chatvocate</b>
            <small>IPC Legal Assistant</small>
          </div>
        </div>

        <button className="new" onClick={reset}>
          <Plus size={17} /> New conversation
        </button>

        <p className="label">QUICK QUESTIONS</p>
        <div className="prompts">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              disabled={loading}
              onClick={() => send(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="trust">
          <ShieldCheck size={18} />
          <span>
            Document-grounded answers
            <small>With source page references</small>
          </span>
        </div>
      </aside>

      <main>
        <header>
          <div className="mobilebrand">
            <Scale size={19} /> Chatvocate
          </div>
          <span className="online">● &nbsp;IPC DOCUMENT ASSISTANT</span>
          <button
            className="sourcebtn"
            onClick={() => setSourcesOn((previous) => !previous)}
          >
            <BookOpen size={15} />
            {sourcesOn ? 'Hide sources' : 'Show sources'}
          </button>
        </header>

        <section className="chat">
          <div className="hero">
            <div className="heroicon">
              <Scale size={25} />
            </div>
            <p className="eyebrow">YOUR LEGAL RESEARCH COMPANION</p>
            <h1>
              Understand the IPC,
              <br />
              <em>one question at a time.</em>
            </h1>
            <p className="intro">
              Ask about sections, definitions, offences, or legal scenarios.
              Answers use your uploaded IPC PDF when relevant.
            </p>
          </div>

          <div className="messages">
            {messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`message ${message.role}`}
              >
                {message.role === 'assistant' && (
                  <span className="avatar">
                    <Scale size={16} />
                  </span>
                )}

                <div className="body">
                  <div className="who">
                    {message.role === 'assistant' ? 'CHATVOCATE' : 'YOU'}
                  </div>
                  <div className="content">{message.content}</div>

                  {sourcesOn &&
                    message.sources?.length > 0 && (
                      <div className="sources">
                        <b>
                          <BookOpen size={14} /> Sources from your PDF
                        </b>
                        {message.sources.map((source, sourceIndex) => (
                          <details key={`${source.page}-${sourceIndex}`}>
                            <summary>Page {source.page}</summary>
                            <p>
                              {source.text}
                              {source.text?.length >= 420 ? '…' : ''}
                            </p>
                          </details>
                        ))}
                      </div>
                    )}
                </div>
              </article>
            ))}

            {loading && (
              <div className="loading">
                <span className="avatar">
                  <Scale size={16} />
                </span>
                <LoaderCircle className="spin" size={17} />
                Searching the PDF and preparing an answer…
              </div>
            )}

            <div ref={bottom} />
          </div>
        </section>

        <footer>
          {error && <p className="error">{error}</p>}
          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <textarea
              ref={input}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about the Indian Penal Code…"
              rows={1}
              maxLength={2000}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              aria-label="Send"
            >
              <Send size={17} />
            </button>
          </form>
          <p className="disclaimer">
            Informational use only · The supplied IPC text may be outdated ·
            Not legal advice
          </p>
        </footer>
      </main>
    </div>
  );
}

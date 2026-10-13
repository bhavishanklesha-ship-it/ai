import React, { useState } from 'react';
import { X, Check, Mail, Sparkles, ShieldCheck } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Search & GEO',
    'Autonomous AI',
  ]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const topicsList = [
    'Search & GEO',
    'Autonomous AI',
    'Paid Performance & DCO',
    'MarTech & Lakehouse',
  ];

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid business email address.');
      return;
    }

    setError('');
    setIsSubscribed(true);
    localStorage.setItem(
      'newsletter_subscription',
      JSON.stringify({ email, topics: selectedTopics, date: new Date().toISOString() })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubscribed ? (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Mail className="w-3.5 h-3.5" />
              <span>Weekly Executive Intelligence</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-slate-950 tracking-tight">
              The Synthetix Dispatch
            </h3>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Every Thursday morning, we publish one rigorous, data-backed analysis on AI search retrieval, autonomous media optimization, and MarTech consolidation.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Select Focus Tracks:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {topicsList.map((topic) => {
                    const active = selectedTopics.includes(topic);
                    return (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`text-left p-2.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-between ${
                          active
                            ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{topic}</span>
                        {active && <Check className="w-3 h-3 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Business Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-900 bg-white"
                />
                {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold transition-colors shadow-xs"
              >
                Join 24,000+ Marketing Leaders
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Zero spam. No promotional affiliate links. Unsubscribe anytime.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-950">
              Subscription Confirmed
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              Welcome to the Synthetix Dispatch. A confirmation email and our latest benchmark whitepaper have been dispatched to <span className="font-semibold text-slate-900">{email}</span>.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Return to Journal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

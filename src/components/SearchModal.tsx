import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Article, ARTICLES } from '../data/articles';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open trigger handled in parent
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalized = query.toLowerCase().trim();
  const results = normalized
    ? ARTICLES.filter(
        (article) =>
          article.title.toLowerCase().includes(normalized) ||
          article.excerpt.toLowerCase().includes(normalized) ||
          article.category.toLowerCase().includes(normalized) ||
          article.author.name.toLowerCase().includes(normalized) ||
          article.tags.some((t) => t.toLowerCase().includes(normalized)) ||
          article.sections.some((s) => s.heading.toLowerCase().includes(normalized))
      )
    : ARTICLES;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, frameworks, categories, authors..."
            className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-normal"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono text-slate-400 hover:text-slate-700 px-2 py-1 bg-white border border-slate-200 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 p-2">
          {results.length > 0 ? (
            results.map((article) => (
              <button
                key={article.id}
                onClick={() => {
                  onSelectArticle(article);
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start justify-between gap-4 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 mb-1">
                    <span className="text-slate-700 font-semibold">{article.category}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h4 className="font-display font-semibold text-slate-900 group-hover:text-blue-900 text-sm leading-snug">
                    {article.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                    {article.excerpt}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
              </button>
            ))
          ) : (
            <div className="p-10 text-center text-slate-500">
              <p className="text-sm font-medium">No articles matched "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for "GEO", "Agents", "Attribution", "Creative", or "ABM"
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
          <span>{results.length} of {ARTICLES.length} articles displayed</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};

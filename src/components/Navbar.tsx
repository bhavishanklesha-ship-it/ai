import React from 'react';
import { Bookmark, Search, Mail, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'article' | 'saved';
  onNavigateHome: () => void;
  onNavigateSaved: () => void;
  savedCount: number;
  onOpenSubscribe: () => void;
  onOpenSearch: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateHome,
  onNavigateSaved,
  savedCount,
  onOpenSubscribe,
  onOpenSearch,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <button
            onClick={onNavigateHome}
            className="group flex items-baseline gap-2.5 text-left text-slate-900 whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-slate-950">
              Synthetix
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold tracking-wider uppercase text-slate-400">
              AI & Marketing
            </span>
          </button>

          {/* Zone 2: 4-5 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={onNavigateHome}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'home' ? 'text-slate-950 font-semibold border-b-2 border-slate-950 -mb-[2px]' : ''
              }`}
            >
              All Articles
            </button>
            <button
              onClick={() => {
                if (currentView !== 'home') onNavigateHome();
                setTimeout(() => onScrollToSection('topics-section'), 50);
              }}
              className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Topics
            </button>
            <button
              onClick={() => {
                if (currentView !== 'home') onNavigateHome();
                setTimeout(() => onScrollToSection('featured-section'), 50);
              }}
              className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Featured
            </button>
            <button
              onClick={onNavigateSaved}
              className={`flex items-center gap-1.5 hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'saved' ? 'text-slate-950 font-semibold border-b-2 border-slate-950 -mb-[2px]' : ''
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Reading List</span>
              {savedCount > 0 && (
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  ({savedCount})
                </span>
              )}
            </button>
            <button
              onClick={() => {
                if (currentView !== 'home') onNavigateHome();
                setTimeout(() => onScrollToSection('about-section'), 50);
              }}
              className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              About
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Tools */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSearch}
              aria-label="Search articles"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline text-[10px] bg-white border border-slate-200 px-1 py-0.5 rounded text-slate-400 font-mono">⌘K</kbd>
            </button>

            <button
              onClick={onOpenSubscribe}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

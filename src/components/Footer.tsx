import React from 'react';
import { Article, CATEGORIES } from '../data/articles';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onNavigateHome: () => void;
  onOpenSubscribe: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateHome,
  onOpenSubscribe,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand & Editorial Charter */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-white tracking-tight">
                Synthetix
              </span>
              <span className="text-xs uppercase font-medium tracking-wider text-slate-400">
                AI & Marketing Journal
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An authoritative editorial publication dedicated to advancing empirical knowledge in Generative Engine Optimization, autonomous agent orchestration, and machine learning MarTech architectures.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Published weekly. Independent research free from commercial sponsored bias.
            </div>
          </div>

          {/* Core Tracks Navigation */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Core Editorial Tracks
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {CATEGORIES.slice(1, 9).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onNavigateHome();
                    onSelectCategory(cat);
                  }}
                  className="text-left text-slate-400 hover:text-white transition-colors py-1 truncate"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter Prompt in Footer */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Executive Briefing
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive verified benchmark data and technical teardowns directly in your inbox.
            </p>
            <button
              onClick={onOpenSubscribe}
              className="w-full py-2.5 px-3 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors"
            >
              Subscribe to Dispatch
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Standards */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Synthetix Media Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Editorial Standards</span>
            <span>Research Methodology</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { Article } from '../data/articles';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, articleId: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  isSaved,
  onToggleSave,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      onClick={() => onSelect(article)}
      className="group relative flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        {!imageError ? (
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex flex-col justify-end text-white">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              {article.category}
            </span>
            <span className="font-display font-semibold text-lg line-clamp-2 mt-1">
              {article.title}
            </span>
          </div>
        )}

        {/* Quick bookmark affordance */}
        <button
          onClick={(e) => onToggleSave(e, article.id)}
          title={isSaved ? "Remove from reading list" : "Save to reading list"}
          aria-label={isSaved ? "Remove from reading list" : "Save to reading list"}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-slate-950 text-white shadow-sm'
              : 'bg-white/90 text-slate-700 hover:bg-white hover:text-slate-950 shadow-xs'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          {/* Unboxed Metadata Header (No static pills) */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2.5">
            <span className="text-slate-900 font-semibold">{article.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{article.readTime}</span>
          </div>

          {/* Primary Title */}
          <h3 className="font-display text-lg sm:text-xl font-bold text-slate-950 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-2.5 text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Footer: Author & Link */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="text-xs">
              <span className="font-medium text-slate-900 block leading-tight">
                {article.author.name}
              </span>
              <span className="text-slate-400 block leading-tight text-[11px]">
                {article.date}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </article>
  );
};

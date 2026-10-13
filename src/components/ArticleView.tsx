import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Clock,
  Calendar,
  Check,
  ChevronRight,
  ArrowRight,
  Copy,
  ThumbsUp,
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { Article, ARTICLES } from '../data/articles';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, articleId: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onBack,
  onSelectArticle,
  isSaved,
  onToggleSave,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    insightful: 42,
    actionable: 29,
    recommend: 56,
  });
  const [userReacted, setUserReacted] = useState<{ [key: string]: boolean }>({});
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // Scroll progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Check active section
      for (const section of article.sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSectionId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.id]);

  // Load reactions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`reactions_${article.id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReactions(parsed.counts);
        setUserReacted(parsed.userReactions);
      } catch {
        // fallback
      }
    } else {
      // Default initial counts based on article index
      const base = (article.title.length % 20) + 15;
      setReactions({
        insightful: base + 18,
        actionable: base + 9,
        recommend: base + 24,
      });
      setUserReacted({});
    }
  }, [article.id]);

  const handleReaction = (type: 'insightful' | 'actionable' | 'recommend') => {
    const hasReacted = !!userReacted[type];
    const newCount = reactions[type] + (hasReacted ? -1 : 1);
    const updatedCounts = { ...reactions, [type]: newCount };
    const updatedUser = { ...userReacted, [type]: !hasReacted };

    setReactions(updatedCounts);
    setUserReacted(updatedUser);

    localStorage.setItem(
      `reactions_${article.id}`,
      JSON.stringify({ counts: updatedCounts, userReactions: updatedUser })
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  // Find next and previous articles
  const currentIndex = ARTICLES.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < ARTICLES.length - 1 ? ARTICLES[currentIndex + 1] : null;

  // Related articles (same category or adjacent)
  const relatedArticles = ARTICLES.filter(
    (a) => a.id !== article.id && (a.category === article.category || Math.abs(ARTICLES.indexOf(a) - currentIndex) <= 2)
  ).slice(0, 3);

  // Font size class mapper
  const proseSizeClasses = {
    normal: 'text-base sm:text-[17px] leading-relaxed sm:leading-[1.75]',
    large: 'text-lg sm:text-[19px] leading-relaxed sm:leading-[1.8]',
    xl: 'text-xl sm:text-[21px] leading-relaxed sm:leading-[1.85]',
  }[fontSize];

  return (
    <div className="min-h-screen pb-24">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-slate-900 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Article Navigation Bar / Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            {/* Font size picker */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md mr-2">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  fontSize === 'normal' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Default text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                  fontSize === 'large' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Larger text"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  fontSize === 'xl' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Extra large text"
              >
                A++
              </button>
            </div>

            <button
              onClick={(e) => onToggleSave(e, article.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isSaved
                  ? 'bg-slate-950 text-white border-slate-950'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article Main Column */}
          <div className="lg:col-span-8">
            {/* Unboxed Metadata Header (Constitution compliance) */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
              <span className="text-slate-900 font-semibold">{article.category}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{article.date}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{article.readTime}</span>
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-bold text-slate-950 tracking-tight leading-[1.18] text-balance">
              {article.title}
            </h1>

            <p className="mt-4 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              {article.subtitle}
            </p>

            {/* Author Byline */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-display font-semibold text-slate-950 text-sm">
                    {article.author.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {article.author.role}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Article Ref: {article.slug}
              </div>
            </div>

            {/* Cover Image Container */}
            <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full aspect-[16/9] object-cover"
              />
              {article.imageCaption && (
                <div className="p-3 text-xs text-slate-500 bg-slate-50 border-t border-slate-200">
                  {article.imageCaption}
                </div>
              )}
            </div>

            {/* Executive Takeaways Box */}
            <div className="mt-10 p-6 rounded-xl bg-slate-50 border border-slate-200/90">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <span>Executive Summary & Key Takeaways</span>
              </h3>
              <ul className="space-y-2.5">
                {article.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-normal">
                    <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Body Content */}
            <div className={`mt-10 space-y-6 text-slate-800 ${proseSizeClasses}`}>
              {/* Introduction paragraphs */}
              {article.introduction.map((para, idx) => (
                <p key={idx} className={idx === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:font-display first-letter:text-slate-950" : ""}>
                  {para}
                </p>
              ))}

              {/* Sections with Headings, Subheadings, Paragraphs, Callouts, Tables, Checklists */}
              {article.sections.map((section) => (
                <section key={section.id} id={section.id} className="pt-8 scroll-mt-24">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 tracking-tight leading-snug">
                    {section.heading}
                  </h2>
                  {section.subheading && (
                    <p className="mt-1 text-sm font-medium text-slate-500 mb-4">
                      {section.subheading}
                    </p>
                  )}

                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {/* Callout Quote or Stat */}
                  {section.callout && (
                    <div className="my-8 p-6 rounded-xl bg-slate-100/80 border border-slate-200/80">
                      <blockquote className="font-display text-base sm:text-lg font-medium text-slate-900 leading-snug">
                        "{section.callout.text}"
                      </blockquote>
                      {section.callout.caption && (
                        <p className="mt-2 text-xs font-mono text-slate-500">
                          — {section.callout.caption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Checklist if provided */}
                  {section.checklist && (
                    <div className="my-8 p-6 rounded-xl bg-white border border-slate-200">
                      <h4 className="font-display text-xs uppercase font-bold tracking-wider text-slate-900 mb-4">
                        Actionable Implementation Checklist
                      </h4>
                      <ul className="space-y-3">
                        {section.checklist.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-3 text-sm text-slate-700">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-900 font-mono text-xs shrink-0 mt-0.5">
                              {itemIdx + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Comparison Table if provided */}
                  {section.table && (
                    <div className="my-8 overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 font-display text-slate-900 font-semibold text-xs uppercase tracking-wider">
                          <tr>
                            {section.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-3 sm:p-4">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {section.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className={`p-3 sm:p-4 text-slate-700 ${cIdx === 0 ? 'font-medium text-slate-950' : ''}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}

              {/* Conclusion Section */}
              <section className="pt-8 border-t border-slate-200">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mb-4">
                  Conclusion & Strategic Outlook
                </h2>
                {article.conclusion.map((cPara, cIdx) => (
                  <p key={cIdx} className="font-medium text-slate-800">
                    {cPara}
                  </p>
                ))}
              </section>

              {/* Tags Section */}
              <div className="pt-8 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] mr-1">
                  Topics:
                </span>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Feedback & Reactions */}
            <div className="mt-12 p-6 rounded-xl bg-white border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display text-sm font-bold text-slate-950">
                    Was this article insightful?
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your feedback trains our editorial topic weighting.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReaction('insightful')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                      userReacted.insightful
                        ? 'bg-slate-950 text-white border-slate-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Insightful</span>
                    <span className="font-mono tabular-nums text-[11px] opacity-75">
                      {reactions.insightful}
                    </span>
                  </button>

                  <button
                    onClick={() => handleReaction('actionable')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                      userReacted.actionable
                        ? 'bg-slate-950 text-white border-slate-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Actionable</span>
                    <span className="font-mono tabular-nums text-[11px] opacity-75">
                      {reactions.actionable}
                    </span>
                  </button>

                  <button
                    onClick={() => handleReaction('recommend')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                      userReacted.recommend
                        ? 'bg-slate-950 text-white border-slate-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Recommend</span>
                    <span className="font-mono tabular-nums text-[11px] opacity-75">
                      {reactions.recommend}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Author Profile Card */}
            <div className="mt-8 p-6 sm:p-8 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
              />
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  About the Author
                </span>
                <h4 className="font-display font-bold text-slate-950 text-lg">
                  {article.author.name}
                </h4>
                <p className="text-xs text-slate-600 font-medium mb-2">
                  {article.author.role}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {article.author.bio}
                </p>
              </div>
            </div>

            {/* Sequential Navigation: Prev / Next */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <button
                  onClick={() => onSelectArticle(prevArticle)}
                  className="group text-left p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all hover:shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    <span>Previous Article</span>
                  </div>
                  <h5 className="font-display font-bold text-sm text-slate-900 group-hover:text-blue-900 line-clamp-2">
                    {prevArticle.title}
                  </h5>
                </button>
              ) : (
                <div />
              )}

              {nextArticle && (
                <button
                  onClick={() => onSelectArticle(nextArticle)}
                  className="group text-right p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all hover:shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                    <span>Next Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h5 className="font-display font-bold text-sm text-slate-900 group-hover:text-blue-900 line-clamp-2">
                    {nextArticle.title}
                  </h5>
                </button>
              )}
            </div>
          </div>

          {/* Sticky Sidebar on Desktop */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <h4 className="font-display text-xs uppercase font-bold tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Table of Contents</span>
                </h4>
                <nav className="space-y-2 text-sm">
                  {article.sections.map((section, idx) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`block py-1 px-2.5 rounded-md text-xs font-medium transition-colors ${
                        activeSectionId === section.id
                          ? 'bg-slate-100 text-slate-950 font-semibold'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                      }`}
                    >
                      {section.heading}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Quick Article Actions Box */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Reading Metrics
                </span>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Estimated Duration:</span>
                    <span className="font-semibold text-slate-900">{article.readTime}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-semibold text-slate-900">{article.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Published Date:</span>
                    <span className="font-semibold text-slate-900">{article.date}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col gap-2">
                  <button
                    onClick={(e) => onToggleSave(e, article.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-800 transition-colors"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-slate-950' : ''}`} />
                    <span>{isSaved ? 'Remove from Saved' : 'Save for Later'}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Link Copied!' : 'Copy Article Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles Strip */}
        <section className="mt-20 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Continue Exploring
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-950 mt-1">
                Related Reading
              </h3>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1"
            >
              <span>View All 10 Articles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectArticle(rel)}
                className="group p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="text-slate-900 font-semibold">{rel.category}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{rel.readTime}</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-slate-950 group-hover:text-blue-900 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {rel.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{rel.author.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

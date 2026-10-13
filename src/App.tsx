import React, { useState, useEffect } from 'react';
import {
  ARTICLES,
  CATEGORIES,
  Article,
} from './data/articles';
import { Navbar } from './components/Navbar';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { SearchModal } from './components/SearchModal';
import { NewsletterModal } from './components/NewsletterModal';
import { Footer } from './components/Footer';
import {
  ArrowRight,
  Bookmark,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  Mail,
  CheckCircle2,
  BookOpen,
  X
} from 'lucide-react';

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'saved'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('All Articles');
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize saved articles from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('synthetix_saved_articles');
      if (stored) {
        setSavedArticleIds(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  // Handle URL hash changes for deep linking and back/forward browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('article-')) {
        const slug = hash.replace('article-', '');
        const found = ARTICLES.find((a) => a.slug === slug || a.id === slug);
        if (found) {
          setSelectedArticle(found);
          setCurrentView('article');
          return;
        }
      } else if (hash === 'saved') {
        setSelectedArticle(null);
        setCurrentView('saved');
        return;
      }

      // Default to home
      setSelectedArticle(null);
      setCurrentView('home');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Show toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Toggle bookmark / save article
  const toggleSaveArticle = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    let updated: string[];
    if (savedArticleIds.includes(articleId)) {
      updated = savedArticleIds.filter((id) => id !== articleId);
      showToast('Article removed from your Reading List');
    } else {
      updated = [...savedArticleIds, articleId];
      showToast('Article saved to your Reading List');
    }
    setSavedArticleIds(updated);
    localStorage.setItem('synthetix_saved_articles', JSON.stringify(updated));
  };

  // Open an article view
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.location.hash = `article-${article.slug}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Return to home view
  const handleNavigateHome = () => {
    setSelectedArticle(null);
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to saved list
  const handleNavigateSaved = () => {
    setSelectedArticle(null);
    setCurrentView('saved');
    window.location.hash = 'saved';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll helper
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered articles
  const filteredArticles = ARTICLES.filter((article) => {
    if (activeCategory === 'All Articles') return true;
    return article.category === activeCategory;
  });

  const featuredArticle = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const savedArticles = ARTICLES.filter((a) => savedArticleIds.includes(a.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onNavigateSaved={handleNavigateSaved}
        savedCount={savedArticleIds.length}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* View 1: Single Article Dedicated View */}
      {currentView === 'article' && selectedArticle ? (
        <div className="flex-1">
          <ArticleView
            article={selectedArticle}
            onBack={handleNavigateHome}
            onSelectArticle={handleSelectArticle}
            isSaved={savedArticleIds.includes(selectedArticle.id)}
            onToggleSave={toggleSaveArticle}
          />
        </div>
      ) : currentView === 'saved' ? (
        /* View 2: Saved Reading List View */
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="mb-8">
            <button
              onClick={handleNavigateHome}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 inline-flex items-center gap-1.5"
            >
              ← Back to All Articles
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-slate-950 tracking-tight">
                  Your Reading List
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {savedArticles.length === 1
                    ? '1 saved article available for offline reference'
                    : `${savedArticles.length} saved articles available for offline reference`}
                </p>
              </div>

              {savedArticles.length > 0 && (
                <button
                  onClick={() => {
                    setSavedArticleIds([]);
                    localStorage.removeItem('synthetix_saved_articles');
                    showToast('Reading list cleared');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {savedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onSelect={handleSelectArticle}
                  isSaved={true}
                  onToggleSave={toggleSaveArticle}
                />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-slate-950">
                No Articles Saved Yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Click the bookmark icon on any article card or reader view to save it to your personal reading list.
              </p>
              <button
                onClick={handleNavigateHome}
                className="px-5 py-2.5 rounded-lg bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Explore All 10 Articles
              </button>
            </div>
          )}
        </main>
      ) : (
        /* View 3: Homepage with Featured Hero, Filter Tabs, and Grid of 10 Articles */
        <main className="flex-1 w-full">
          {/* Hero Section / Editorial Spotlight */}
          <section
            id="featured-section"
            className="border-b border-slate-200/90 bg-white"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
              {/* Publication Header Kicker */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
                <span>Featured Lead Analysis</span>
                <span aria-hidden="true">·</span>
                <span>Issue No. 48</span>
              </div>

              {/* 2-Column Balanced Hero Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                {/* Text Column */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata (Zero-pill) */}
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3">
                      <span className="text-slate-950 font-semibold">{featuredArticle.category}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{featuredArticle.date}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{featuredArticle.readTime}</span>
                    </div>

                    {/* Headline */}
                    <h1
                      onClick={() => handleSelectArticle(featuredArticle)}
                      className="font-display text-2xl sm:text-4xl lg:text-[40px] font-bold text-slate-950 tracking-tight leading-[1.18] hover:text-blue-900 transition-colors cursor-pointer text-balance"
                    >
                      {featuredArticle.title}
                    </h1>

                    {/* Subtitle / Excerpt */}
                    <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                      {featuredArticle.subtitle}
                    </p>

                    {/* Key Takeaways snippet */}
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                        Core Thesis
                      </div>
                      <p className="text-sm text-slate-700 leading-normal">
                        "{featuredArticle.keyTakeaways[0]}"
                      </p>
                    </div>
                  </div>

                  {/* Actions & Author */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-slate-950">
                          {featuredArticle.author.name}
                        </div>
                        <div className="text-slate-500">
                          {featuredArticle.author.role}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => toggleSaveArticle(e, featuredArticle.id)}
                        className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                          savedArticleIds.includes(featuredArticle.id)
                            ? 'bg-slate-950 text-white border-slate-950'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                        title="Save to Reading List"
                      >
                        <Bookmark className={`w-4 h-4 ${savedArticleIds.includes(featuredArticle.id) ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleSelectArticle(featuredArticle)}
                        className="px-5 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
                      >
                        <span>Read Full Analysis</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hero Visual Asset Column */}
                <div
                  onClick={() => handleSelectArticle(featuredArticle)}
                  className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group cursor-pointer aspect-[4/3] lg:aspect-auto"
                >
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                    <span className="text-xs font-medium text-white/90">
                      Explore Generative Retrieval Architectures →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Filter & Topic Selection Bar */}
          <section id="topics-section" className="py-8 bg-[#FAFAFA] border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950">
                    All Journal Publications
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    10 in-depth articles across digital media, search engineering, and agent systems.
                  </p>
                </div>

                {/* Search Quick Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="self-start md:self-auto text-xs font-medium text-slate-600 hover:text-slate-950 bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 hover:border-slate-300 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter & Quick Search</span>
                </button>
              </div>

              {/* Category Filter Tabs (Interactive Segmented Control Buttons) */}
              <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                        isActive
                          ? 'bg-slate-950 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200/90 hover:text-slate-950 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Articles Cards Grid: All 10 Articles */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onSelect={handleSelectArticle}
                    isSaved={savedArticleIds.includes(article.id)}
                    onToggleSave={toggleSaveArticle}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                <p className="text-sm font-medium text-slate-700">
                  No articles found in category "{activeCategory}"
                </p>
                <button
                  onClick={() => setActiveCategory('All Articles')}
                  className="mt-3 text-xs font-semibold text-slate-900 underline"
                >
                  Reset category filter
                </button>
              </div>
            )}
          </section>

          {/* Editorial Mission / About Section */}
          <section id="about-section" className="bg-white border-y border-slate-200 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                About Synthetix Journal
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight text-balance">
                Bridging Data Science, Generative AI, and Enterprise Growth Marketing
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                As generative language models, autonomous agent frameworks, and privacy-first attribution reshape digital commerce, growth leaders face an overwhelming volume of superficial noise. Synthetix exists to provide empirical benchmarks, architectural blueprints, and verifiable methodologies for the modern marketing executive.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-display font-bold text-slate-950 text-sm mb-1">
                    01. Zero-Sponsored Bias
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We accept zero vendor sponsorship, maintaining uncompromised evaluation criteria across all MarTech software assessments.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-display font-bold text-slate-950 text-sm mb-1">
                    02. Practitioner-Led Research
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Every article and framework is drafted and peer-reviewed by active VPs of Growth, data scientists, and SEO engineers.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-display font-bold text-slate-950 text-sm mb-1">
                    03. High Information Gain
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We prohibit commodity regurgitation. Every dispatch must introduce original data, benchmarks, or novel technical schemas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Newsletter Banner */}
          <section className="bg-slate-950 text-white py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Weekly Executive Dispatch
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Get the Next Benchmark Report Before It Publishes
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Join 24,000+ CMOs, Heads of Search, and Performance Media Directors receiving our weekly technical teardowns.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsSubscribeOpen(true)}
                  className="px-6 py-3 rounded-lg bg-white text-slate-950 font-semibold text-xs hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Subscribe to Synthetix Dispatch
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleNavigateHome();
          setTimeout(() => handleScrollToSection('topics-section'), 50);
        }}
        onNavigateHome={handleNavigateHome}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleSelectArticle}
      />

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />
    </div>
  );
}

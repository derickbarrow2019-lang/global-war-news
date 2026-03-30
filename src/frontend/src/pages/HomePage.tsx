import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
import ArticleCard from "../components/ArticleCard";
import BreakingTicker from "../components/BreakingTicker";
import HeroCard from "../components/HeroCard";
import Sidebar from "../components/Sidebar";
import {
  useArticles,
  useArticlesByCategory,
  useBreakingNews,
  useSearchArticles,
  useTrendingArticles,
} from "../hooks/useQueries";

const CATEGORIES = ["ALL", "MIDDLE EAST", "EUROPE", "AFRICA", "WORLD"] as const;
type Category = (typeof CATEGORIES)[number];

const FALLBACK_ARTICLES: Article[] = [
  {
    id: 1n,
    title: "Renewed Offensive Launched Along Eastern Front Lines",
    summary:
      "Military forces have launched a large-scale operation targeting key strategic positions, marking the most significant offensive action in months.",
    content:
      "Military forces have launched a large-scale operation targeting key strategic positions across the eastern front, marking the most significant offensive action in months. Sources confirm the deployment of armored units, aerial support, and electronic warfare assets in a coordinated push.",
    author: "Col. James Mercer (Ret.)",
    category: "Europe",
    isBreaking: true,
    imageUrl: "/assets/generated/hero-conflict-zone.dim_1200x600.jpg",
    publishedAt: BigInt(Date.now()) * 1_000_000n,
    views: 142580n,
  },
  {
    id: 2n,
    title:
      "UN Security Council Convenes Emergency Session Over Middle East Escalation",
    summary:
      "The UN Security Council held an emergency session after overnight strikes raised fears of broader regional conflict.",
    content:
      "The UN Security Council convened an emergency session following overnight strikes that raised international alarm. Diplomats warned of a rapidly deteriorating security situation requiring immediate multilateral response.",
    author: "Sarah El-Rashid",
    category: "Middle East",
    isBreaking: true,
    imageUrl: "/assets/generated/article-middle-east.dim_800x500.jpg",
    publishedAt: BigInt(Date.now() - 3600000) * 1_000_000n,
    views: 98340n,
  },
  {
    id: 3n,
    title: "NATO Reinforces Eastern Flank With 12,000 Additional Troops",
    summary:
      "Alliance members approve emergency deployment of multinational forces to bolster deterrence along the eastern perimeter.",
    content:
      "NATO member states have approved the emergency deployment of 12,000 multinational troops to the alliance's eastern flank. The decision follows an extraordinary meeting of defense ministers citing elevated threat assessments.",
    author: "Marcus Hoffmann",
    category: "Europe",
    isBreaking: false,
    imageUrl: "/assets/generated/article-europe.dim_800x500.jpg",
    publishedAt: BigInt(Date.now() - 7200000) * 1_000_000n,
    views: 75210n,
  },
  {
    id: 4n,
    title: "AU Peace Mission Stalled as Fighting Resumes in the Sahel Region",
    summary:
      "African Union mediators face setbacks as rival factions resume hostilities, displacing tens of thousands.",
    content:
      "African Union peace mediators have reported significant setbacks in their stabilization mission after rival armed factions resumed intense fighting in the Sahel region. Over 40,000 civilians have been displaced in the latest wave of violence.",
    author: "Amara Diallo",
    category: "Africa",
    isBreaking: false,
    imageUrl: "/assets/generated/article-africa.dim_800x500.jpg",
    publishedAt: BigInt(Date.now() - 14400000) * 1_000_000n,
    views: 62100n,
  },
  {
    id: 5n,
    title: "Ceasefire Negotiations Enter Critical Phase as Deadline Looms",
    summary:
      "International mediators report cautious progress in talks as both sides signal willingness for a temporary truce.",
    content:
      "International mediators have reported cautious optimism as ceasefire negotiations enter a critical 72-hour phase. Both parties have signaled willingness to consider a temporary humanitarian truce under international monitoring.",
    author: "Dr. Lena Voronova",
    category: "World",
    isBreaking: false,
    imageUrl: "/assets/generated/article-middle-east.dim_800x500.jpg",
    publishedAt: BigInt(Date.now() - 18000000) * 1_000_000n,
    views: 54870n,
  },
  {
    id: 6n,
    title: "Drone Warfare Reshapes Battlefield Tactics in Modern Conflicts",
    summary:
      "Analysts note the unprecedented use of unmanned systems is redefining frontline engagements and logistics chains.",
    content:
      "Military analysts are highlighting how drone warfare has fundamentally transformed battlefield tactics. The widespread deployment of armed UAVs, loitering munitions, and reconnaissance drones is forcing armies to adapt doctrine at unprecedented speed.",
    author: "Maj. Chen Wei (Ret.)",
    category: "World",
    isBreaking: false,
    imageUrl: "/assets/generated/article-europe.dim_800x500.jpg",
    publishedAt: BigInt(Date.now() - 21600000) * 1_000_000n,
    views: 48220n,
  },
];

interface HomePageProps {
  onArticleClick: (article: Article) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSearchMode: boolean;
}

export default function HomePage({
  onArticleClick,
  searchQuery,
  onSearchChange,
  isSearchMode,
}: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const prevBreakingCount = useRef<number>(0);

  const { data: allArticles, isLoading: loadingAll } = useArticles();
  const { data: breakingNews } = useBreakingNews();
  const { data: trending } = useTrendingArticles();
  const { data: categoryArticles } = useArticlesByCategory(
    activeCategory === "ALL" ? "ALL" : activeCategory,
  );
  const { data: searchResults } = useSearchArticles(searchQuery);

  const articles =
    allArticles && allArticles.length > 0 ? allArticles : FALLBACK_ARTICLES;
  const breaking =
    breakingNews && breakingNews.length > 0
      ? breakingNews
      : FALLBACK_ARTICLES.filter((a) => a.isBreaking);
  const trendingList =
    trending && trending.length > 0
      ? trending
      : [...FALLBACK_ARTICLES].sort((a, b) => Number(b.views - a.views));
  const filteredArticles =
    categoryArticles && categoryArticles.length > 0
      ? categoryArticles
      : activeCategory === "ALL"
        ? articles
        : articles.filter((a) => a.category.toUpperCase() === activeCategory);

  // Push notification on new breaking news
  useEffect(() => {
    const count = breaking.length;
    if (prevBreakingCount.current > 0 && count > prevBreakingCount.current) {
      const newArticle = breaking[0];
      toast.error(`🔴 BREAKING: ${newArticle.title}`, { duration: 8000 });
      if (Notification.permission === "granted") {
        new Notification("GWN Breaking News", {
          body: newArticle.title,
          icon: "/favicon.ico",
        });
      }
    }
    prevBreakingCount.current = count;
  }, [breaking]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const heroArticle = breaking[0] || articles[0];
  const gridArticles = isSearchMode
    ? searchResults || []
    : filteredArticles.filter((a) => heroArticle && a.id !== heroArticle.id);

  const isLoading = loadingAll && !allArticles;

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
      {/* Breaking ticker */}
      <BreakingTicker articles={breaking} />

      {/* Search mode header */}
      {isSearchMode && (
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search conflicts, regions, analysis…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary border-border rounded-full text-sm h-10"
              data-ocid="search.input"
            />
          </div>
          {searchQuery.trim() && (
            <p className="text-sm text-muted-foreground mt-3">
              {searchResults?.length ?? 0} results for &ldquo;
              <span className="text-foreground">{searchQuery}</span>&rdquo;
            </p>
          )}
        </div>
      )}

      {/* Category tabs */}
      {!isSearchMode && (
        <div className="flex gap-1 sm:gap-2 flex-wrap mb-6 mt-4" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? "bg-breaking text-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
              data-ocid="category.tab"
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Main content layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Primary column */}
        <div className="flex-1 min-w-0">
          {isSearchMode ? (
            <div>
              {!searchQuery.trim() && (
                <p
                  className="text-muted-foreground text-sm py-8 text-center"
                  data-ocid="search.empty_state"
                >
                  Type above to search articles.
                </p>
              )}
              {searchQuery.trim() && searchResults?.length === 0 && (
                <p
                  className="text-muted-foreground text-sm py-8 text-center"
                  data-ocid="search.empty_state"
                >
                  No results found. Try different keywords.
                </p>
              )}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                data-ocid="search.list"
              >
                {(searchResults || []).map((article, i) => (
                  <ArticleCard
                    key={article.id.toString()}
                    article={article}
                    onClick={onArticleClick}
                    index={i + 1}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Hero card */}
              {isLoading ? (
                <Skeleton
                  className="w-full h-96 rounded mb-6"
                  data-ocid="hero.loading_state"
                />
              ) : heroArticle ? (
                <HeroCard article={heroArticle} onClick={onArticleClick} />
              ) : null}

              {/* Article grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
                    <Skeleton key={i} className="h-64 rounded" />
                  ))}
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.07 } },
                  }}
                  data-ocid="articles.list"
                >
                  {gridArticles.slice(0, 6).map((article, i) => (
                    <motion.div
                      key={article.id.toString()}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <ArticleCard
                        article={article}
                        onClick={onArticleClick}
                        index={i + 1}
                      />
                    </motion.div>
                  ))}
                  {gridArticles.length === 0 && (
                    <div
                      className="col-span-2 py-10 text-center text-muted-foreground"
                      data-ocid="articles.empty_state"
                    >
                      No articles in this category yet.
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
          <Sidebar
            popular={trendingList}
            topStories={articles.slice(0, 5)}
            onArticleClick={onArticleClick}
          />
        </div>
      </div>
    </main>
  );
}

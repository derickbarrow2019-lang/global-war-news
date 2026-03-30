import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { motion } from "motion/react";
import type { Article } from "../backend.d";
import ArticleCard from "../components/ArticleCard";
import { useArticle, useArticles } from "../hooks/useQueries";
import { categoryColor, formatDate, formatRelative } from "../utils/format";

const FALLBACK_ARTICLES: Article[] = [
  {
    id: 1n,
    title: "Renewed Offensive Launched Along Eastern Front Lines",
    summary:
      "Military forces have launched a large-scale operation targeting key strategic positions, marking the most significant offensive action in months.",
    content:
      "Military forces have launched a large-scale operation targeting key strategic positions across the eastern front, marking the most significant offensive action in months. Sources confirm the deployment of armored units, aerial support, and electronic warfare assets in a coordinated push. International observers are monitoring the situation closely as humanitarian organizations warn of impending civilian displacement and supply route disruptions.\n\nThe operation follows weeks of artillery exchanges and smaller skirmish engagements that analysts say were probing defensive weaknesses. Intelligence reports suggest the offensive was planned over a period of several months, with logistical preparations beginning in the early spring.\n\nWorld leaders are calling for restraint, while emergency UN Security Council sessions are expected to convene within hours.",
    author: "Col. James Mercer (Ret.)",
    category: "Europe",
    isBreaking: true,
    imageUrl: "/assets/generated/hero-conflict-zone.dim_1200x600.jpg",
    publishedAt: BigInt(Date.now()) * 1_000_000n,
    views: 142580n,
  },
];

interface ArticlePageProps {
  articleId: bigint;
  onBack: () => void;
  onRelatedClick: (article: Article) => void;
}

export default function ArticlePage({
  articleId,
  onBack,
  onRelatedClick,
}: ArticlePageProps) {
  const { data: article, isLoading } = useArticle(articleId);
  const { data: allArticles } = useArticles();

  const displayArticle =
    article ||
    (FALLBACK_ARTICLES.find((a) => a.id === articleId) ?? FALLBACK_ARTICLES[0]);
  const relatedArticles = (allArticles || FALLBACK_ARTICLES)
    .filter(
      (a) => a.id !== articleId && a.category === displayArticle?.category,
    )
    .slice(0, 3);

  const paragraphs = displayArticle?.content.split("\n\n") ?? [];

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-6 text-muted-foreground hover:text-foreground gap-2"
        data-ocid="article.back_button"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to News
      </Button>

      {isLoading && !article ? (
        <div className="space-y-4" data-ocid="article.loading_state">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="w-full aspect-[16/6] rounded" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : displayArticle ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          data-ocid="article.panel"
        >
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {displayArticle.isBreaking && (
                <span className="bg-breaking text-foreground text-xs font-black px-3 py-1 rounded uppercase tracking-widest">
                  Breaking News
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide ${categoryColor(displayArticle.category)}`}
              >
                {displayArticle.category}
              </span>
            </div>
            <h1 className="font-black text-2xl sm:text-4xl leading-tight text-foreground mb-4">
              {displayArticle.title}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-4 leading-relaxed">
              {displayArticle.summary}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-y border-border py-3">
              <span className="font-semibold text-foreground">
                By {displayArticle.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(displayArticle.publishedAt)} ·{" "}
                {formatRelative(displayArticle.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {Number(displayArticle.views).toLocaleString()} views
              </span>
            </div>
          </div>

          {/* Hero image */}
          {displayArticle.imageUrl && (
            <div className="aspect-[16/7] rounded overflow-hidden mb-8 bg-secondary">
              <img
                src={displayArticle.imageUrl}
                alt={displayArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-sm sm:prose-base max-w-none mb-12">
            {paragraphs.map((para, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: paragraph index is stable
              <p key={i} className="text-foreground/90 leading-relaxed mb-5">
                {para}
              </p>
            ))}
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <section>
              <div className="border-t border-border pt-8 mb-6">
                <h2 className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-6">
                  Related Stories
                </h2>
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  data-ocid="related.list"
                >
                  {relatedArticles.map((ra, i) => (
                    <ArticleCard
                      key={ra.id.toString()}
                      article={ra}
                      onClick={onRelatedClick}
                      index={i + 1}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </motion.div>
      ) : (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="article.error_state"
        >
          Article not found.
        </div>
      )}
    </main>
  );
}

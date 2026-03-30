import type { Article } from "../backend.d";
import { categoryColor, formatRelative } from "../utils/format";

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  index: number;
}

export default function ArticleCard({
  article,
  onClick,
  index,
}: ArticleCardProps) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: news card click area
    <div
      className="bg-card border border-border rounded overflow-hidden cursor-pointer group hover:border-brand/40 transition-all duration-200 shadow-card"
      onClick={() => onClick(article)}
      data-ocid={`articles.item.${index}`}
    >
      {article.imageUrl && (
        <div className="aspect-[16/9] overflow-hidden bg-secondary">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {article.isBreaking && (
            <span className="text-xs font-bold text-breaking uppercase tracking-wider">
              ● BREAKING
            </span>
          )}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${categoryColor(article.category)}`}
          >
            {article.category}
          </span>
        </div>
        <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-brand transition-colors">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-3">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span>{formatRelative(article.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}

import { Star, TrendingUp } from "lucide-react";
import type { Article } from "../backend.d";
import { formatRelative } from "../utils/format";

interface SidebarProps {
  popular: Article[];
  topStories: Article[];
  onArticleClick: (article: Article) => void;
}

function SidebarItem({
  article,
  index,
  onClick,
}: {
  article: Article;
  index: number;
  onClick: (article: Article) => void;
}) {
  return (
    <button
      type="button"
      className="flex gap-3 w-full text-left group py-3 border-b border-border last:border-0 hover:bg-surface-raised -mx-4 px-4 transition-colors"
      onClick={() => onClick(article)}
      data-ocid={`sidebar.item.${index}`}
    >
      <span className="font-black text-xl text-border group-hover:text-brand transition-colors w-6 flex-shrink-0 pt-0.5">
        {index}
      </span>
      <div className="flex-1 min-w-0">
        {article.imageUrl && (
          <div className="w-full aspect-[16/9] rounded overflow-hidden mb-2 bg-secondary">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}
        <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {article.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelative(article.publishedAt)}
        </p>
      </div>
    </button>
  );
}

export default function Sidebar({
  popular,
  topStories,
  onArticleClick,
}: SidebarProps) {
  return (
    <aside className="space-y-6" data-ocid="sidebar.panel">
      {/* Most Popular */}
      <div className="bg-card border border-border rounded p-4">
        <div className="flex items-center gap-2 mb-1 pb-3 border-b border-border">
          <TrendingUp className="w-4 h-4 text-brand" />
          <h2 className="font-black text-xs uppercase tracking-widest text-foreground">
            Most Popular
          </h2>
        </div>
        <div>
          {popular.slice(0, 5).map((article, i) => (
            <SidebarItem
              key={article.id.toString()}
              article={article}
              index={i + 1}
              onClick={onArticleClick}
            />
          ))}
          {popular.length === 0 && (
            <p
              className="text-xs text-muted-foreground py-4 text-center"
              data-ocid="sidebar.empty_state"
            >
              No trending articles yet.
            </p>
          )}
        </div>
      </div>

      {/* Top Stories */}
      <div className="bg-card border border-border rounded p-4">
        <div className="flex items-center gap-2 mb-1 pb-3 border-b border-border">
          <Star className="w-4 h-4 text-breaking" />
          <h2 className="font-black text-xs uppercase tracking-widest text-foreground">
            Top Stories
          </h2>
        </div>
        <div>
          {topStories.slice(0, 5).map((article, i) => (
            <SidebarItem
              key={article.id.toString()}
              article={article}
              index={i + 1}
              onClick={onArticleClick}
            />
          ))}
          {topStories.length === 0 && (
            <p
              className="text-xs text-muted-foreground py-4 text-center"
              data-ocid="sidebar.top_stories_empty_state"
            >
              No top stories yet.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

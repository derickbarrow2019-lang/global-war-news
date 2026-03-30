import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import type { Article } from "../backend.d";
import { categoryColor, formatRelative } from "../utils/format";

interface HeroCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

export default function HeroCard({ article, onClick }: HeroCardProps) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: hero click area
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded overflow-hidden cursor-pointer group mb-6"
      style={{ minHeight: 400 }}
      onClick={() => onClick(article)}
      data-ocid="hero.card"
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={
            article.imageUrl ||
            "/assets/generated/hero-conflict-zone.dim_1200x600.jpg"
          }
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8"
        style={{ minHeight: 400 }}
      >
        <div className="flex items-center gap-2 mb-3">
          {article.isBreaking && (
            <span className="bg-breaking text-foreground text-xs font-black px-3 py-1 rounded uppercase tracking-widest">
              Breaking News
            </span>
          )}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${categoryColor(article.category)}`}
          >
            {article.category}
          </span>
        </div>
        <h2 className="font-black text-2xl sm:text-4xl text-white leading-tight mb-3 max-w-2xl">
          {article.title}
        </h2>
        <p className="text-white/80 text-sm sm:text-base mb-4 max-w-xl line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            size="sm"
            className="bg-brand text-background hover:bg-brand/90 font-semibold"
            data-ocid="hero.primary_button"
          >
            Read Full Story
          </Button>
          <span className="text-white/60 text-xs">
            By {article.author} · {formatRelative(article.publishedAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

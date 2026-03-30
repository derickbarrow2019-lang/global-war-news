import { X } from "lucide-react";
import { useState } from "react";
import type { Article } from "../backend.d";
import { formatRelative } from "../utils/format";

interface BreakingTickerProps {
  articles: Article[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || articles.length === 0) return null;

  const latest = articles[0];

  return (
    <div
      className="bg-breaking border-b border-breaking/50"
      data-ocid="breaking.panel"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 h-10">
          <span className="flex-shrink-0 bg-foreground text-breaking text-xs font-black px-2 py-0.5 rounded tracking-wider uppercase">
            BREAKING
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-ticker text-sm font-semibold text-foreground">
              {articles.map((a, i) => (
                <span key={a.id.toString()}>
                  {i > 0 && <span className="mx-6 opacity-50">●</span>}
                  {a.title}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1 bg-foreground/20 text-foreground text-xs px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
              LIVE
            </span>
            <span className="hidden sm:block text-foreground/80 text-xs">
              {formatRelative(latest.publishedAt)}
            </span>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-foreground/70 hover:text-foreground"
              aria-label="Dismiss"
              data-ocid="breaking.close_button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

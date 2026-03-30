export function formatDate(publishedAt: bigint): string {
  // IC timestamps are in nanoseconds
  const ms = Number(publishedAt) / 1_000_000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelative(publishedAt: bigint): string {
  const ms = Number(publishedAt) / 1_000_000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "Recently";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function categoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case "middle east":
      return "text-amber-400 bg-amber-400/10";
    case "europe":
      return "text-blue-400 bg-blue-400/10";
    case "africa":
      return "text-green-400 bg-green-400/10";
    case "world":
      return "text-purple-400 bg-purple-400/10";
    default:
      return "text-muted-foreground bg-muted";
  }
}

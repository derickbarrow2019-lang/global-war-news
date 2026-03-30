import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../backend.d";
import { useActor } from "./useActor";

export function useArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticles();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useArticlesByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "ALL") return actor.getArticles();
      return actor.getArticlesByCategory(category);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useBreakingNews() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["breaking"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBreakingNews();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useArticle(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Article | null>({
    queryKey: ["article", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getArticle(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useTrendingArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["trending"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingArticles();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useSearchArticles(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchArticles(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (article: Article) => {
      if (!actor) throw new Error("No actor");
      return actor.createArticle(article);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["breaking"] });
      qc.invalidateQueries({ queryKey: ["trending"] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (article: Article) => {
      if (!actor) throw new Error("No actor");
      return actor.updateArticle(article);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["breaking"] });
      qc.invalidateQueries({ queryKey: ["trending"] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteArticle(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["breaking"] });
      qc.invalidateQueries({ queryKey: ["trending"] });
    },
  });
}

export function useToggleBreaking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.toggleBreaking(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["breaking"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

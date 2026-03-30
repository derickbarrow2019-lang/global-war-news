import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Article {
    id: bigint;
    title: string;
    content: string;
    views: bigint;
    publishedAt: bigint;
    isBreaking: boolean;
    author: string;
    summary: string;
    imageUrl: string;
    category: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArticle(article: Article): Promise<bigint>;
    deleteArticle(id: bigint): Promise<void>;
    getArticle(id: bigint): Promise<Article>;
    getArticles(): Promise<Array<Article>>;
    getArticlesByCategory(category: string): Promise<Array<Article>>;
    getBreakingNews(): Promise<Array<Article>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTrendingArticles(): Promise<Array<Article>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchArticles(searchQuery: string): Promise<Array<Article>>;
    toggleBreaking(id: bigint): Promise<void>;
    updateArticle(updated: Article): Promise<void>;
}

import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import type { Article } from "./backend.d";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AdminPage from "./pages/AdminPage";
import ArticlePage from "./pages/ArticlePage";
import HomePage from "./pages/HomePage";

type Page = "home" | "article" | "admin" | "search";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedArticleId, setSelectedArticleId] = useState<bigint | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { login, clear, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const handleArticleClick = (article: Article) => {
    setSelectedArticleId(article.id);
    setCurrentPage("article");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (page: Page) => {
    if (page === "search") {
      setCurrentPage("search");
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim() && currentPage !== "search") {
      setCurrentPage("search");
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setCurrentPage("search");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        isLoggedIn={isLoggedIn}
        onLogin={() => login()}
        onLogout={clear}
      />

      {currentPage === "home" || currentPage === "search" ? (
        <HomePage
          onArticleClick={handleArticleClick}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isSearchMode={currentPage === "search"}
        />
      ) : currentPage === "article" && selectedArticleId !== null ? (
        <ArticlePage
          articleId={selectedArticleId}
          onBack={() => setCurrentPage("home")}
          onRelatedClick={handleArticleClick}
        />
      ) : currentPage === "admin" ? (
        <AdminPage onBack={() => setCurrentPage("home")} />
      ) : null}

      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

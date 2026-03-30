import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Flame, Globe, Menu, Search, X } from "lucide-react";
import { useState } from "react";

type Page = "home" | "article" | "admin" | "search";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { label: "HOME", page: "home" as Page },
  { label: "LIVE UPDATES", page: "home" as Page },
  { label: "CATEGORIES", page: "home" as Page },
  { label: "SEARCH", page: "search" as Page },
  { label: "ADMIN", page: "admin" as Page },
];

export default function Header({
  currentPage,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isLoggedIn,
  onLogin,
  onLogout,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearchSubmit();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top bar */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => onNavigate("home")}
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-background" />
            </div>
            <span className="font-black text-xl tracking-tight text-foreground">
              GWN
            </span>
            <Flame className="w-4 h-4 text-breaking" />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conflicts, regions, analysis…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleSearchKey}
                className="pl-10 bg-secondary border-border rounded-full text-sm h-9"
                data-ocid="header.search_input"
              />
            </div>
          </div>

          <div className="flex-1 sm:hidden" />

          {/* Auth buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="border border-border text-foreground hover:bg-secondary"
              onClick={isLoggedIn ? onLogout : onLogin}
              data-ocid="header.login_button"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
            {!isLoggedIn && (
              <Button
                type="button"
                size="sm"
                className="bg-brand text-background hover:bg-brand/90 font-semibold"
                onClick={onLogin}
                data-ocid="header.subscribe_button"
              >
                Subscribe
              </Button>
            )}
            {isLoggedIn && (
              <Button
                type="button"
                size="sm"
                className="bg-brand text-background hover:bg-brand/90 font-semibold"
                onClick={() => onNavigate("admin")}
                data-ocid="header.admin_button"
              >
                Admin Panel
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="sm:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="header.menu_toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Nav row */}
      <div className="border-t border-border hidden sm:block">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-6 h-10">
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className={`text-xs font-semibold tracking-widest uppercase transition-colors ${
                  currentPage === item.page && item.page !== "home"
                    ? "text-breaking border-b-2 border-breaking pb-0.5"
                    : item.label === "HOME" && currentPage === "home"
                      ? "text-breaking border-b-2 border-breaking pb-0.5"
                      : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="nav.link"
              >
                {item.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Bell className="w-3 h-3 animate-pulse-red text-breaking" />
              <span className="text-breaking font-semibold">LIVE</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleSearchKey}
              className="pl-10 bg-secondary border-border rounded-full text-sm h-9"
              data-ocid="mobile.search_input"
            />
          </div>
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => {
                onNavigate(item.page);
                setMobileOpen(false);
              }}
              className="block w-full text-left text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:text-foreground py-1"
              data-ocid="nav.link"
            >
              {item.label}
            </button>
          ))}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1 border border-border"
              onClick={() => {
                isLoggedIn ? onLogout() : onLogin();
                setMobileOpen(false);
              }}
              data-ocid="mobile.login_button"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
            {!isLoggedIn && (
              <Button
                type="button"
                size="sm"
                className="flex-1 bg-brand text-background font-semibold"
                onClick={() => {
                  onLogin();
                  setMobileOpen(false);
                }}
                data-ocid="mobile.subscribe_button"
              >
                Subscribe
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

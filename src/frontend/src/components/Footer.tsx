import { Flame, Globe } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

const SOCIAL_LINKS = [
  { label: "X/Twitter", icon: SiX, href: "https://x.com" },
  { label: "Facebook", icon: SiFacebook, href: "https://facebook.com" },
  { label: "Instagram", icon: SiInstagram, href: "https://instagram.com" },
  { label: "YouTube", icon: SiYoutube, href: "https://youtube.com" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center">
                <Globe className="w-5 h-5 text-background" />
              </div>
              <span className="font-black text-xl">GWN</span>
              <Flame className="w-4 h-4 text-breaking" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Global War News — Real-time coverage of conflicts, geopolitical
              developments, and military operations worldwide.
            </p>
            <div className="flex gap-3 mt-4">
              {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Coverage */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-foreground mb-4">
              Coverage
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Middle East", "Europe", "Africa", "World", "Analysis"].map(
                (item) => (
                  <li key={item}>
                    <span className="cursor-default">{item}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Sections */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-foreground mb-4">
              Sections
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Breaking News", "Live Updates", "Intel Briefs", "Maps"].map(
                (item) => (
                  <li key={item}>
                    <span className="cursor-default">{item}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-foreground mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["About", "Contact", "Privacy Policy", "Terms"].map((item) => (
                <li key={item}>
                  <span className="cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-2 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="uppercase tracking-wider">
            Global War News — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

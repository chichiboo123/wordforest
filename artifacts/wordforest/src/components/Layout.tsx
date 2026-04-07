import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import i18n from "@/i18n/index";

const LANGUAGES = [
  { code: "ko", label: "KOR", native: "한국어" },
  { code: "en", label: "ENG", native: "English" },
  { code: "ja", label: "JPN", native: "日本語" },
];

function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const selectLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("wordforest_lang", code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        data-testid="language-selector"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-border bg-card hover:bg-secondary transition-colors"
      >
        <span className="material-icons text-base leading-none">language</span>
        <span>{currentLang.label}</span>
        <span className="material-icons text-sm leading-none">expand_more</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[130px]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              data-testid={`lang-option-${lang.code}`}
              onClick={() => selectLang(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-secondary flex items-center gap-2 ${
                lang.code === i18n.language ? "text-primary font-semibold" : "text-foreground"
              }`}
            >
              <span className="font-medium">{lang.label}</span>
              <span className="text-muted-foreground text-xs">{lang.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { totalSaved } = useSavedItems();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/observe", label: t("nav.observe"), icon: "visibility" },
    { href: "/expand", label: t("nav.expand"), icon: "account_tree" },
    { href: "/read", label: t("nav.read"), icon: "menu_book" },
    { href: "/express", label: t("nav.express"), icon: "theater_comedy" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="material-icons text-primary text-2xl leading-none">forest</span>
            <span className="font-bold text-lg text-primary leading-tight hidden sm:block">낱말의 숲</span>
            <span className="text-xs text-muted-foreground hidden sm:block">WordForest</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`nav-${link.href.slice(1)}`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-foreground"
                }`}
              >
                <span className="material-icons text-sm leading-none">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/saved"
              data-testid="nav-saved"
              className="relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
            >
              <span className="material-icons text-base leading-none">bookmark</span>
              <span className="hidden sm:inline">{t("nav.saved")}</span>
              {totalSaved > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none font-bold">
                  {totalSaved > 9 ? "9+" : totalSaved}
                </span>
              )}
            </Link>
            <button
              data-testid="theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              <span className="material-icons text-base leading-none">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>
            <LanguageSelector />
            <button
              data-testid="mobile-menu-toggle"
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              <span className="material-icons leading-none">{mobileMenuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 pb-3">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location === link.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <span className="material-icons text-base leading-none">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="material-icons text-primary text-base leading-none">forest</span>
            <span>낱말의 숲 · WordForest</span>
          </div>
          <a
            href="https://litt.ly/chichiboo"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="footer-credit"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t("footer.credit")}
          </a>
        </div>
      </footer>
    </div>
  );
}

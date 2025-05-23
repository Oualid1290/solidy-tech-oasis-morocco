
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, User, ShoppingCart, X, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

const content = {
  en: {
    home: "Home",
    products: "Products",
    sell: "Sell",
    about: "About",
    contact: "Contact",
    searchPlaceholder: "Search for hardware...",
    login: "Login",
    signup: "Sign Up",
    dashboard: "Dashboard",
    profile: "Profile",
    logout: "Logout"
  },
  fr: {
    home: "Accueil",
    products: "Produits",
    sell: "Vendre",
    about: "À propos",
    contact: "Contact",
    searchPlaceholder: "Rechercher du matériel...",
    login: "Se connecter",
    signup: "S'inscrire",
    dashboard: "Tableau de bord",
    profile: "Profil",
    logout: "Se déconnecter"
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    sell: "بيع",
    about: "حول",
    contact: "اتصال",
    searchPlaceholder: "البحث عن الأجهزة...",
    login: "تسجيل الدخول",
    signup: "التسجيل",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج"
  }
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { language } = useLanguage();
  const { isAuthenticated, user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const t = content[language as keyof typeof content];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const profilePath = userProfile?.username ? `/profile/${userProfile.username}` : '/profile';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12",
      isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-solidy-blue to-solidy-mint w-10 h-10 rounded-full flex items-center justify-center">
            <span className="font-bold text-white text-xl">S</span>
          </div>
          <span className="font-bold text-xl dark:text-white">Solidy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-medium hover:text-solidy-blue transition-colors">{t.home}</Link>
          <Link to="/products" className="font-medium hover:text-solidy-blue transition-colors">{t.products}</Link>
          <Link to="/post-listing" className="font-medium hover:text-solidy-blue transition-colors">{t.sell}</Link>
          <Link to="/about" className="font-medium hover:text-solidy-blue transition-colors">{t.about}</Link>
          <Link to="/contact" className="font-medium hover:text-solidy-blue transition-colors">{t.contact}</Link>
        </nav>

        {/* Search, Theme Toggle, and Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-solidy-blue w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <ThemeToggle />
          <LanguageSwitcher />
          
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" className="rounded-full" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard size={18} className="mr-1" />
                  <span>{t.dashboard}</span>
                </Link>
              </Button>
              <Button size="sm" className="rounded-full" asChild>
                <Link to={profilePath}>
                  <User size={18} className="mr-1" />
                  <span>{t.profile}</span>
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full" 
                onClick={() => signOut()}>
                <LogOut size={18} className="mr-1" />
                <span>{t.logout}</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="rounded-full" asChild>
                <Link to="/auth">
                  <User size={18} className="mr-1" />
                  <span>{t.login}</span>
                </Link>
              </Button>
              <Button 
                size="sm" 
                className="rounded-full bg-gradient-to-r from-solidy-blue to-solidy-mint hover:opacity-90 transition-opacity"
                asChild
              >
                <Link to="/auth?signup=true">
                  {t.signup}
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white dark:bg-gray-900 p-6 z-40 animate-slide-in md:hidden">
          <div className="flex flex-col gap-6">
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-solidy-blue"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <nav className="flex flex-col gap-6">
              <Link to="/" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>{t.home}</Link>
              <Link to="/products" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>{t.products}</Link>
              <Link to="/post-listing" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>{t.sell}</Link>
              <Link to="/about" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>{t.about}</Link>
              <Link to="/contact" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>{t.contact}</Link>
              
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>
                    {t.dashboard}
                  </Link>
                  <Link to={profilePath} className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>
                    {t.profile}
                  </Link>
                  <button 
                    className="font-medium text-lg text-left flex items-center gap-2 text-red-500"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={18} />
                    {t.logout}
                  </button>
                </>
              )}
            </nav>
            
            {!isAuthenticated && (
              <div className="mt-4 flex flex-col gap-4">
                <Button variant="outline" size="lg" className="rounded-full w-full" asChild>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <User size={18} className="mr-2" />
                    {t.login}
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  className="rounded-full w-full bg-gradient-to-r from-solidy-blue to-solidy-mint"
                  asChild
                >
                  <Link to="/auth?signup=true" onClick={() => setMobileMenuOpen(false)}>
                    {t.signup}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

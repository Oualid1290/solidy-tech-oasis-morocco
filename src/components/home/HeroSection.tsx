
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Search, MapPin } from "lucide-react";

const content = {
  en: {
    title: "Morocco's Future of Hardware Trading",
    subtitle: "Buy and sell computer hardware with confidence in the premier Moroccan tech marketplace",
    searchPlaceholder: "What are you looking for?",
    locationPlaceholder: "Select your city",
    searchButton: "Search",
    categories: "Browse Categories"
  },
  fr: {
    title: "L'avenir du commerce de matériel au Maroc",
    subtitle: "Achetez et vendez du matériel informatique en toute confiance sur la première place de marché tech marocaine",
    searchPlaceholder: "Que cherchez-vous ?",
    locationPlaceholder: "Sélectionnez votre ville",
    searchButton: "Rechercher",
    categories: "Parcourir les catégories"
  },
  ar: {
    title: "مستقبل تجارة الأجهزة في المغرب",
    subtitle: "اشتر وبع أجهزة الكمبيوتر بثقة في سوق التكنولوجيا المغربي الرائد",
    searchPlaceholder: "عما تبحث؟",
    locationPlaceholder: "اختر مدينتك",
    searchButton: "بحث",
    categories: "تصفح الفئات"
  }
};

export function HeroSection() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content];
  const isRtl = language === "ar";
  
  return (
    <section className={`relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-28 pb-20 overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Background elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-solidy-blue/10 dark:bg-solidy-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-solidy-mint/10 dark:bg-solidy-mint/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl">
              {t.subtitle}
            </p>
            
            <div className="bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none"
                />
              </div>
              
              <div className="relative flex-grow sm:border-l sm:border-gray-200 sm:dark:border-gray-700">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">{t.locationPlaceholder}</option>
                  <option value="casablanca">Casablanca</option>
                  <option value="rabat">Rabat</option>
                  <option value="marrakech">Marrakech</option>
                  <option value="fes">Fes</option>
                  <option value="tangier">Tangier</option>
                </select>
              </div>
              
              <Button size="lg" className="bg-gradient-to-r from-solidy-blue to-solidy-mint hover:opacity-90 transition-opacity px-8">
                {t.searchButton}
              </Button>
            </div>
            
            <div className="mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t.categories}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-full">GPUs</Button>
                <Button variant="outline" size="sm" className="rounded-full">CPUs</Button>
                <Button variant="outline" size="sm" className="rounded-full">RAM</Button>
                <Button variant="outline" size="sm" className="rounded-full">Motherboards</Button>
                <Button variant="outline" size="sm" className="rounded-full">Storage</Button>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="relative z-10 aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-solidy-blue to-solidy-mint rounded-full opacity-20 blur-2xl animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                alt="Computer Hardware" 
                className="relative z-20 rounded-3xl object-cover w-full h-full shadow-xl"
              />
              
              {/* Floating elements */}
              <div className="absolute top-10 -right-10 z-30 glass-card p-4 rounded-xl shadow-lg animate-floating">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                  <div>
                    <p className="font-medium">Verified Sellers</p>
                    <p className="text-xs text-gray-500">100% Trusted</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-5 -left-5 z-30 glass-card p-4 rounded-xl shadow-lg animate-floating" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-solidy-blue flex items-center justify-center text-white">🔒</div>
                  <div>
                    <p className="font-medium">Secure Deals</p>
                    <p className="text-xs text-gray-500">Safe transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

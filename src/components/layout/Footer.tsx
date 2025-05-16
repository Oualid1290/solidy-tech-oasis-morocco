
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const content = {
  en: {
    aboutTitle: "About Solidy",
    aboutText: "Morocco's Future of Hardware Trading. A marketplace for buying and selling computer hardware in Morocco.",
    quickLinks: "Quick Links",
    home: "Home",
    products: "Products",
    sell: "Sell Items",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    popularLocations: "Popular Locations",
    casablanca: "Casablanca",
    rabat: "Rabat",
    marrakech: "Marrakech",
    fes: "Fes",
    tangier: "Tangier",
    contact: "Contact Us",
    address: "123 Tech Street, Digital District, Casablanca",
    copyright: "© 2025 Solidy. All rights reserved.",
  },
  fr: {
    aboutTitle: "À propos de Solidy",
    aboutText: "L'avenir du commerce de matériel informatique au Maroc. Une plateforme pour acheter et vendre du matériel informatique au Maroc.",
    quickLinks: "Liens Rapides",
    home: "Accueil",
    products: "Produits",
    sell: "Vendre",
    terms: "Conditions Générales",
    privacy: "Politique de Confidentialité",
    popularLocations: "Emplacements Populaires",
    casablanca: "Casablanca",
    rabat: "Rabat",
    marrakech: "Marrakech",
    fes: "Fès",
    tangier: "Tanger",
    contact: "Contactez-nous",
    address: "123 Rue Tech, Quartier Digital, Casablanca",
    copyright: "© 2025 Solidy. Tous droits réservés.",
  },
  ar: {
    aboutTitle: "حول سوليدي",
    aboutText: "مستقبل تجارة الأجهزة في المغرب. سوق لشراء وبيع أجهزة الكمبيوتر في المغرب.",
    quickLinks: "روابط سريعة",
    home: "الرئيسية",
    products: "المنتجات",
    sell: "بيع",
    terms: "الشروط والأحكام",
    privacy: "سياسة الخصوصية",
    popularLocations: "المواقع الشائعة",
    casablanca: "الدار البيضاء",
    rabat: "الرباط",
    marrakech: "مراكش",
    fes: "فاس",
    tangier: "طنجة",
    contact: "اتصل بنا",
    address: "123 شارع التكنولوجيا، الحي الرقمي، الدار البيضاء",
    copyright: "© 2025 سوليدي. جميع الحقوق محفوظة.",
  }
};

export function Footer() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content];
  const isRtl = language === "ar";
  
  return (
    <footer className={`bg-gray-50 dark:bg-gray-900 pt-16 pb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-solidy-blue to-solidy-mint w-10 h-10 rounded-full flex items-center justify-center">
                <span className="font-bold text-white text-xl">S</span>
              </div>
              <span className="font-bold text-xl dark:text-white">Solidy</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t.aboutText}</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-solidy-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-solidy-blue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-solidy-blue transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-solidy-blue transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t.quickLinks}</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">{t.home}</Link></li>
              <li><Link to="/products" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">{t.products}</Link></li>
              <li><Link to="/post-listing" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">{t.sell}</Link></li>
              <li><Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">{t.terms}</Link></li>
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">{t.privacy}</Link></li>
            </ul>
          </div>
          
          {/* Popular Locations */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t.popularLocations}</h3>
            <ul className="space-y-4">
              <li><Link to="/location/casablanca" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">{t.casablanca}</Link></li>
              <li><Link to="/location/rabat" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">{t.rabat}</Link></li>
              <li><Link to="/location/marrakech" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">{t.marrakech}</Link></li>
              <li><Link to="/location/fes" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">{t.fes}</Link></li>
              <li><Link to="/location/tangier" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">{t.tangier}</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t.contact}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-solidy-blue shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-300">{t.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-solidy-blue" />
                <a href="tel:+212522123456" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">+212 522 123 456</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-solidy-blue" />
                <a href="mailto:contact@solidy.ma" className="text-gray-600 dark:text-gray-300 hover:text-solidy-blue dark:hover:text-solidy-blue transition-colors">contact@solidy.ma</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

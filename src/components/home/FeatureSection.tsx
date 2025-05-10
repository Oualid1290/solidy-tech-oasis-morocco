
import { Shield, Users, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const content = {
  en: {
    title: "Why Choose Solidy",
    subtitle: "The premier marketplace for hardware enthusiasts in Morocco",
    features: [
      {
        icon: Shield,
        title: "Trusted Sellers",
        description: "All sellers are verified and rated by our community to ensure high-quality transactions"
      },
      {
        icon: MapPin,
        title: "Local Markets",
        description: "Find hardware in your city with our location-based filtering system"
      },
      {
        icon: Users,
        title: "Growing Community",
        description: "Join thousands of tech enthusiasts across Morocco"
      },
      {
        icon: MessageCircle,
        title: "Direct Communication",
        description: "Chat directly with sellers to negotiate prices and arrange meetings"
      }
    ]
  },
  fr: {
    title: "Pourquoi Choisir Solidy",
    subtitle: "La première place de marché pour les passionnés de matériel au Maroc",
    features: [
      {
        icon: Shield,
        title: "Vendeurs de Confiance",
        description: "Tous les vendeurs sont vérifiés et notés par notre communauté pour garantir des transactions de qualité"
      },
      {
        icon: MapPin,
        title: "Marchés Locaux",
        description: "Trouvez du matériel dans votre ville grâce à notre système de filtrage par localisation"
      },
      {
        icon: Users,
        title: "Communauté Grandissante",
        description: "Rejoignez des milliers de passionnés de technologie à travers le Maroc"
      },
      {
        icon: MessageCircle,
        title: "Communication Directe",
        description: "Discutez directement avec les vendeurs pour négocier les prix et organiser des rencontres"
      }
    ]
  },
  ar: {
    title: "لماذا تختار سوليدي",
    subtitle: "السوق الرائدة لهواة الأجهزة في المغرب",
    features: [
      {
        icon: Shield,
        title: "بائعون موثوقون",
        description: "جميع البائعين تم التحقق منهم وتقييمهم من قبل مجتمعنا لضمان معاملات عالية الجودة"
      },
      {
        icon: MapPin,
        title: "أسواق محلية",
        description: "ابحث عن الأجهزة في مدينتك باستخدام نظام التصفية حسب الموقع"
      },
      {
        icon: Users,
        title: "مجتمع متنامي",
        description: "انضم إلى آلاف المهتمين بالتكنولوجيا في جميع أنحاء المغرب"
      },
      {
        icon: MessageCircle,
        title: "تواصل مباشر",
        description: "تحدث مباشرة مع البائعين للتفاوض على الأسعار وترتيب الاجتماعات"
      }
    ]
  }
};

export function FeatureSection() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content];
  const isRtl = language === "ar";
  
  return (
    <section className={`py-16 px-6 md:px-12 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-3">{t.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-solidy-blue to-solidy-mint flex items-center justify-center mb-6">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

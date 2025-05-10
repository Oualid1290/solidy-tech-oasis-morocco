
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const content = {
  en: {
    title: "Ready to join Morocco's premier hardware marketplace?",
    description: "Start buying and selling computer components with tech enthusiasts across Morocco",
    buttonText: "Get Started",
    alt: "Join Solidy"
  },
  fr: {
    title: "Prêt à rejoindre la première place de marché de matériel au Maroc ?",
    description: "Commencez à acheter et vendre des composants informatiques avec des passionnés de technologie à travers le Maroc",
    buttonText: "Commencer",
    alt: "Rejoindre Solidy"
  },
  ar: {
    title: "هل أنت مستعد للانضمام إلى سوق الأجهزة الرائد في المغرب؟",
    description: "ابدأ في شراء وبيع مكونات الكمبيوتر مع عشاق التكنولوجيا في جميع أنحاء المغرب",
    buttonText: "ابدأ الآن",
    alt: "انضم إلى سوليدي"
  }
};

export function CtaSection() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content];
  const isRtl = language === "ar";
  
  return (
    <section className={`py-16 px-6 md:px-12 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="frosted-glass relative overflow-hidden rounded-3xl">
          {/* Background gradients */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-solidy-blue/10 dark:bg-solidy-blue/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-solidy-mint/10 dark:bg-solidy-mint/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 p-10 md:p-16">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">{t.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl leading-relaxed">
                {t.description}
              </p>
              <Button className="rounded-full bg-solidy-blue hover:bg-solidy-blue/90 text-white px-8 py-6 h-auto text-base font-medium group">
                <span>{t.buttonText}</span>
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1591405351990-4726e331f141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt={t.alt}
                className="w-full max-w-xs rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

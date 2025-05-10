
import { Cpu, HardDrive, MemoryStick, MonitorSmartphone, Tv2, Keyboard, Fan } from "lucide-react";
import { CategoryCard } from "@/components/products/CategoryCard";
import { useLanguage } from "@/context/LanguageContext";

const content = {
  en: {
    title: "Browse Categories",
    subtitle: "Find the perfect hardware components for your needs",
  },
  fr: {
    title: "Parcourir les Catégories",
    subtitle: "Trouvez les composants matériels parfaits pour vos besoins",
  },
  ar: {
    title: "تصفح الفئات",
    subtitle: "ابحث عن مكونات الأجهزة المثالية لاحتياجاتك",
  }
};

const categories = [
  {
    title: "CPUs",
    icon: Cpu,
    count: 235,
    slug: "cpu",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-700"
  },
  {
    title: "GPUs",
    icon: Tv2,
    count: 189,
    slug: "gpu",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-700"
  },
  {
    title: "Memory",
    icon: MemoryStick,
    count: 310,
    slug: "memory",
    gradientFrom: "from-purple-500",
    gradientTo: "to-indigo-700"
  },
  {
    title: "Storage",
    icon: HardDrive,
    count: 278,
    slug: "storage",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-700"
  },
  {
    title: "Monitors",
    icon: MonitorSmartphone,
    count: 156,
    slug: "monitor",
    gradientFrom: "from-red-500",
    gradientTo: "to-rose-700"
  },
  {
    title: "Peripherals",
    icon: Keyboard,
    count: 425,
    slug: "peripheral",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-700"
  },
  {
    title: "Cooling",
    icon: Fan,
    count: 143,
    slug: "cooling",
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-700"
  },
];

export function CategoriesSection() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content];
  const isRtl = language === "ar";
  
  return (
    <section className={`py-16 px-6 md:px-12 bg-gray-50 dark:bg-gray-900/50 ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.slug} className="animate-fade-in">
              <CategoryCard
                title={category.title}
                icon={category.icon}
                count={category.count}
                slug={category.slug}
                gradientFrom={category.gradientFrom}
                gradientTo={category.gradientTo}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

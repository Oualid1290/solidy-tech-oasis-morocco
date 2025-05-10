
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { Shield, Package, MessageCircle, Truck, Award, Heart } from "lucide-react";

const About = () => {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container max-w-5xl mx-auto px-6">
          <div className={`text-center ${isRtl ? 'rtl' : ''}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Gamana</h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Morocco's premier marketplace for buying and selling new and used computer hardware,
              connecting tech enthusiasts across the country.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/post-listing">
                <Button size="lg">Start Selling</Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" size="lg">Explore Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Gamana was founded in 2023 with a simple mission: to create a secure and
                  trustworthy platform where Moroccans can buy and sell computer hardware,
                  from graphics cards and processors to complete systems.
                </p>
                <p>
                  We noticed that tech enthusiasts across Morocco struggled to find reliable
                  sources for both new and used computer components. Traditional marketplaces
                  lacked the specialized focus and security features needed for technology
                  transactions.
                </p>
                <p>
                  Our team of passionate technologists and marketplace experts came together to
                  build a platform that addresses these challenges, creating a community where
                  sellers can reach the right buyers, and where buyers can shop with confidence.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Team working on computers"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-solidy-blue/10 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-solidy-mint/10 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              At Gamana, we're guided by a set of principles that inform everything we do
              as we work to create the best marketplace experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-solidy-blue" />,
                title: "Security",
                description:
                  "We prioritize the security of transactions and protect the personal information of our users.",
              },
              {
                icon: <Award className="h-8 w-8 text-solidy-blue" />,
                title: "Quality",
                description:
                  "We encourage transparent listings with accurate descriptions and clear images.",
              },
              {
                icon: <MessageCircle className="h-8 w-8 text-solidy-blue" />,
                title: "Communication",
                description:
                  "We believe in open and honest communication between buyers and sellers.",
              },
              {
                icon: <Package className="h-8 w-8 text-solidy-blue" />,
                title: "Reliability",
                description:
                  "We build features that help ensure reliable transactions and deliveries.",
              },
              {
                icon: <Truck className="h-8 w-8 text-solidy-blue" />,
                title: "Convenience",
                description:
                  "We make buying and selling as simple and straightforward as possible.",
              },
              {
                icon: <Heart className="h-8 w-8 text-solidy-blue" />,
                title: "Community",
                description:
                  "We foster a community of tech enthusiasts who share knowledge and help each other.",
              },
            ].map((value, index) => (
              <div key={index} className="frosted-glass p-6 rounded-xl">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50,000+", label: "Active Users" },
              { number: "25,000+", label: "Listings" },
              { number: "15,000+", label: "Successful Sales" },
              { number: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-solidy-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The passionate people behind Gamana who work every day to create
              the best marketplace experience for our users.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Youssef Amrani",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              },
              {
                name: "Fatima Zahra",
                role: "CTO",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              },
              {
                name: "Omar El Fassi",
                role: "Head of Operations",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              },
            ].map((person, index) => (
              <div key={index} className="text-center">
                <div className="aspect-square rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{person.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-solidy-blue to-solidy-mint text-white">
        <div className="container max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Whether you're looking to upgrade your setup or sell your old hardware,
            Gamana is the perfect place to connect with tech enthusiasts across Morocco.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" variant="secondary">Sign Up Now</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-solidy-blue">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

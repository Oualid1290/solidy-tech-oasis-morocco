
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How do I create an account?",
    answer: (
      <>
        Creating an account is simple! Click on the "Sign Up" button in the top right corner of the page. 
        Fill in your email, create a password, choose a username, and you're ready to go. You can also sign up 
        using your Google or Facebook account for a quicker process.
      </>
    ),
    category: "account",
  },
  {
    question: "How do I reset my password?",
    answer: (
      <>
        To reset your password, click on the "Login" button, then select "Forgot Password". 
        Enter the email address associated with your account, and we'll send you instructions 
        on how to create a new password. Make sure to check your spam folder if you don't see the email.
      </>
    ),
    category: "account",
  },
  {
    question: "How do I edit my profile information?",
    answer: (
      <>
        After logging in, navigate to the Dashboard by clicking on your profile picture in the top right corner. 
        From there, select the "Profile" tab where you can update your profile information, including your username,
        profile picture, bio, and contact details.
      </>
    ),
    category: "account",
  },
  {
    question: "How do I post a listing?",
    answer: (
      <>
        To post a listing, log in to your account and click on the "Post Listing" button in the navigation bar.
        Fill out the listing form with detailed information about your product, including title, description, 
        price, condition, and at least one photo. Once submitted, your listing will be live on Gamana immediately.
      </>
    ),
    category: "selling",
  },
  {
    question: "What items am I allowed to sell?",
    answer: (
      <>
        Gamana is focused on computer hardware and related technology items. This includes CPUs, GPUs, 
        motherboards, RAM, storage devices, computer cases, cooling systems, peripherals, and complete systems.
        Items prohibited for sale include counterfeit goods, stolen merchandise, and items that violate copyrights or trademarks.
      </>
    ),
    category: "selling",
  },
  {
    question: "How do I edit or remove my listing?",
    answer: (
      <>
        To edit or remove a listing, go to your Dashboard and select the "My Listings" tab. Find the listing 
        you want to modify, and click on the "Edit" or "Delete" button. When editing, you can update any information 
        about your listing, including photos, description, and price.
      </>
    ),
    category: "selling",
  },
  {
    question: "Is there a fee for selling on Gamana?",
    answer: (
      <>
        Currently, Gamana does not charge any fees for listing or selling items. We're focused on building 
        a strong community of tech enthusiasts. In the future, we may introduce premium features or promotional 
        options, but basic listing will always remain free.
      </>
    ),
    category: "selling",
  },
  {
    question: "How do I contact a seller?",
    answer: (
      <>
        When viewing a listing, click on the "Contact Seller" or "Message" button to start a conversation. 
        You'll be taken to our built-in messaging system where you can discuss details, ask questions, and 
        arrange the purchase. You must be logged in to contact sellers.
      </>
    ),
    category: "buying",
  },
  {
    question: "How do payments work?",
    answer: (
      <>
        Gamana doesn't process payments directly between users. Instead, buyers and sellers arrange their 
        preferred payment method through our messaging system. We recommend meeting in person for exchanges 
        when possible, or using secure payment methods. Always exercise caution and never send payments to 
        unverified accounts.
      </>
    ),
    category: "buying",
  },
  {
    question: "What should I do if an item doesn't match the description?",
    answer: (
      <>
        If you receive an item that doesn't match its description, first contact the seller directly through 
        our messaging system to resolve the issue. If you're unable to reach a resolution, you can report the 
        issue to Gamana through the "Report a Problem" option in the listing, and our support team will investigate.
      </>
    ),
    category: "buying",
  },
  {
    question: "How do I leave a review for a seller?",
    answer: (
      <>
        After completing a transaction, you'll automatically receive a notification prompting you to leave a review. 
        Alternatively, you can go to the seller's profile page and click on the "Leave Review" button. Reviews are 
        important as they help build trust within our community.
      </>
    ),
    category: "buying",
  },
  {
    question: "How does Gamana ensure user safety?",
    answer: (
      <>
        We implement several measures to ensure safety, including user verification, secure messaging, 
        and a rating system. We monitor listings for suspicious activity and have a reporting system for 
        problematic users or listings. We also provide safety tips for in-person meetups and transactions.
      </>
    ),
    category: "safety",
  },
  {
    question: "What should I do if I suspect a listing is fraudulent?",
    answer: (
      <>
        If you suspect a listing is fraudulent, click on the "Report Listing" button found on the listing page. 
        Provide as much detail as possible about why you believe it's fraudulent. Our team will review the report 
        promptly and take appropriate action, which may include removing the listing and suspending the user account.
      </>
    ),
    category: "safety",
  },
  {
    question: "Tips for safe in-person meetings",
    answer: (
      <>
        <p>When meeting a buyer or seller in person, follow these safety tips:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Meet in a public place with plenty of people around</li>
          <li>Consider meeting at a police station or public building</li>
          <li>Bring a friend or family member with you</li>
          <li>Meet during daylight hours</li>
          <li>Tell someone else about your meeting plans</li>
          <li>Trust your instincts - if something feels wrong, walk away</li>
          <li>For expensive items, consider testing them before completing the transaction</li>
        </ul>
      </>
    ),
    category: "safety",
  },
];

const FAQ = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredFAQs = faqItems.filter((item) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container max-w-3xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Find answers to common questions and learn how to get the most out of Gamana.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                className="pl-10 h-12 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main FAQ Section */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          {/* Category Tabs */}
          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="mb-8"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="buying">Buying</TabsTrigger>
              <TabsTrigger value="selling">Selling</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* FAQ Items */}
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="frosted-glass rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="text-left font-medium">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="prose dark:prose-invert max-w-none">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-4">No matches found</h2>
              <p className="text-gray-500 mb-6">
                We couldn't find any FAQs matching your search query. Try using different keywords or browse by category.
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
              If you couldn't find what you were looking for, our support team is ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button size="lg">
                  Contact Support
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                View Guides
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;

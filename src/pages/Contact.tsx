import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Contact = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    topic: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (value: string) => {
    setForm((prev) => ({ ...prev, topic: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      });
      
      // Reset form
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        topic: ""
      });
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Have a question, suggestion, or need assistance? 
              Our team is here to help you with anything you need.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="frosted-glass p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="How can we help?" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Select value={form.topic} onValueChange={handleTopicChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Customer Support</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Your detailed message..."
                      rows={6} 
                      required 
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="frosted-glass p-6 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="bg-solidy-blue/10 dark:bg-solidy-blue/20 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-solidy-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Office Location</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        123 Tech Hub Street<br />
                        Casablanca, 20000<br />
                        Morocco
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="frosted-glass p-6 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="bg-solidy-blue/10 dark:bg-solidy-blue/20 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-solidy-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Customer Support:<br />
                        +212 5XX-XXXXXX<br />
                        Mon-Fri, 9AM-6PM
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="frosted-glass p-6 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="bg-solidy-blue/10 dark:bg-solidy-blue/20 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-solidy-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        General Inquiries:<br />
                        info@gamana.ma<br />
                        Support: support@gamana.ma
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="frosted-glass p-6 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="bg-solidy-blue/10 dark:bg-solidy-blue/20 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-solidy-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Business Hours</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Monday - Friday:<br />
                        9:00 AM - 6:00 PM<br />
                        Weekends: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="frosted-glass p-6 rounded-xl mt-8">
                <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Follow us on social media for updates, tips, and community highlights.
                </p>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span className="sr-only">Instagram</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Find Us</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Visit our office in Casablanca
            </p>
          </div>
          <div className="aspect-[16/9] w-full bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.59538876981!2d-7.6906349384570225!3d33.57298500696766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2a45573aaad%3A0x7ac946ed7408d87e!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2sus!4v1651825200000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find quick answers to common questions about Gamana.
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "How do I create a seller account?",
                answer: "Creating a seller account is easy! Simply sign up for a regular account and complete your profile information. Once verified, you can start listing your products immediately."
              },
              {
                question: "Is there a fee for selling items?",
                answer: "Gamana is currently free to use for both buyers and sellers. We may introduce premium features in the future, but basic listing and buying will remain free."
              },
              {
                question: "How do payments work?",
                answer: "Gamana does not process payments directly. We connect buyers and sellers who then arrange their preferred payment method. We recommend meeting in person for exchanges or using secure payment methods."
              },
              {
                question: "How can I report a suspicious listing or user?",
                answer: "You can report any suspicious activity by clicking the 'Report' button on the listing or user profile. Our team will review the report promptly and take appropriate action."
              },
              {
                question: "Do you verify the condition of products?",
                answer: "We don't physically verify products, but our rating system and reviews help maintain quality. We encourage buyers to check items thoroughly before completing purchases."
              }
            ].map((faq, index) => (
              <div key={index} className="frosted-glass p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

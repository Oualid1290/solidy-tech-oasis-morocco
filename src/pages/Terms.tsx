
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms & Conditions</CardTitle>
            <CardDescription>
              Please read these terms and conditions carefully
            </CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Solidy! These Terms & Conditions govern your use of our website and services.
              By accessing our website or using our services, you agree to be bound by these Terms.
              If you disagree with any part of these terms, you may not access the website or use our services.
            </p>
            
            <h2>2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and up-to-date information.
              You are responsible for safeguarding the password you use to access our service and for any activities
              or actions under your password.
            </p>
            
            <h2>3. Buying and Selling</h2>
            <p>
              3.1. As a seller, you are responsible for the accuracy of your listings.<br />
              3.2. All prices must be listed in Moroccan Dirham (MAD).<br />
              3.3. Solidy is not responsible for the quality of items sold on the platform.<br />
              3.4. We encourage buyers and sellers to meet in public places for transactions.
            </p>
            
            <h2>4. Prohibited Items</h2>
            <p>
              The following items may not be listed on our platform:
            </p>
            <ul>
              <li>Illegal goods or services</li>
              <li>Counterfeit or stolen items</li>
              <li>Items that infringe on intellectual property rights</li>
              <li>Dangerous or hazardous materials</li>
            </ul>
            
            <h2>5. Privacy</h2>
            <p>
              We are committed to protecting your privacy. Please refer to our Privacy Policy for information on how we collect,
              use, and disclose information about you.
            </p>
            
            <h2>6. Limitation of Liability</h2>
            <p>
              Solidy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting
              from your use of or inability to use our service.
            </p>
            
            <h2>7. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. It is your responsibility to review these Terms periodically.
              Your continued use of the platform following the posting of revised Terms means you accept those changes.
            </p>
            
            <h2>8. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at legal@solidy.ma.
            </p>
            
            <p className="text-sm text-gray-500 mt-8">Last updated: May 16, 2025</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Terms;

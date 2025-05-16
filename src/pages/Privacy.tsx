
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <CardDescription>
              How we collect, use, and protect your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you:
            </p>
            <ul>
              <li>Create an account</li>
              <li>Fill out a form</li>
              <li>Post a listing</li>
              <li>Communicate with other users</li>
              <li>Contact our support team</li>
            </ul>
            
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect and prevent fraudulent transactions and abuse</li>
            </ul>
            
            <h2>3. Information Sharing</h2>
            <p>
              We may share your personal information with:
            </p>
            <ul>
              <li>Other users as necessary to facilitate transactions</li>
              <li>Service providers who perform services on our behalf</li>
              <li>Law enforcement if required by law or to protect rights</li>
            </ul>
            
            <h2>4. Data Security</h2>
            <p>
              We take reasonable measures to help protect your personal information from loss, theft, misuse, 
              unauthorized access, disclosure, alteration, and destruction. However, no internet or electronic 
              storage system is 100% secure.
            </p>
            
            <h2>5. Your Rights</h2>
            <p>
              You may access, correct, or delete your personal information by signing into your account. 
              You may also contact us directly to request access to, correction of, or deletion of any 
              personal information that you have provided to us.
            </p>
            
            <h2>6. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar technologies to collect information about your browsing activities 
              and to distinguish you from other users of our website.
            </p>
            
            <h2>7. Changes to This Privacy Policy</h2>
            <p>
              We may change this privacy policy from time to time. If we make changes, we will notify you 
              by revising the date at the bottom of the policy and, in some cases, we may provide you with 
              additional notice.
            </p>
            
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at privacy@solidy.ma.
            </p>
            
            <p className="text-sm text-gray-500 mt-8">Last updated: May 16, 2025</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Privacy;

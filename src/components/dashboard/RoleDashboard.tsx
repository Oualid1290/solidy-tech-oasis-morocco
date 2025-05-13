
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuyerDashboard } from "./BuyerDashboard";
import { SellerDashboard } from "./SellerDashboard";
import { AdminDashboard } from "./AdminDashboard";

export function RoleDashboard() {
  const { userProfile } = useAuth();
  
  if (!userProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Gamana</CardTitle>
          <CardDescription>
            Please sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You need to be signed in to view this content.</p>
        </CardContent>
      </Card>
    );
  }
  
  switch (userProfile.role) {
    case 'buyer':
      return <BuyerDashboard />;
    case 'seller':
      return <SellerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Gamana</CardTitle>
            <CardDescription>
              Select a role to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>You need to select a role to access your dashboard.</p>
          </CardContent>
        </Card>
      );
  }
}

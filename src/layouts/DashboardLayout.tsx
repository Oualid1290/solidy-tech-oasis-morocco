
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Outlet, Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function DashboardLayout() {
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract current dashboard tab from path
  const currentPath = location.pathname.split('/').pop() || '';
  const currentTab = ['buyer', 'seller', 'admin'].includes(currentPath) ? currentPath : '';
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    if (value) {
      navigate(`/dashboard/${value}`);
    } else {
      navigate('/dashboard');
    }
  };
  
  // Redirect to appropriate role-specific dashboard when profile loads
  useEffect(() => {
    if (!isLoading && userProfile && currentTab === '') {
      // Auto-navigate to role-specific dashboard if we're on the main dashboard page
      if (location.pathname === '/dashboard') {
        console.log(`Navigating to dashboard/${userProfile.role}`);
        navigate(`/dashboard/${userProfile.role}`);
      }
    }
  }, [isLoading, userProfile, navigate, currentTab, location.pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Redirect to auth page if user is not authenticated
  if (!isAuthenticated || !userProfile) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Dashboard</CardTitle>
            <CardDescription>
              Welcome back, {userProfile?.full_name || userProfile?.username}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Show only the tab for the user's role */}
            <Tabs value={userProfile.role} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value={userProfile.role}>
                  {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)} Dashboard
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
}

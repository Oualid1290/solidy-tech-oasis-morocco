
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function RoleDashboard() {
  const { userProfile, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while profile is being fetched or created
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!userProfile) {
    toast({
      title: "Profile not found",
      description: "Your user profile could not be loaded. Please sign in again.",
      variant: "destructive"
    });
    
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
  
  // Direct to the appropriate dashboard view based on the user's role
  const currentPath = location.pathname;
  
  // If we're on the main dashboard page, redirect to the role-specific page
  if (currentPath === '/dashboard') {
    console.log(`Redirecting to role-specific dashboard: ${userProfile.role}`);
    return <Navigate to={`/dashboard/${userProfile.role}`} replace />;
  }
  
  // Otherwise we're already on a specific dashboard route, so render appropriate content
  // But verify that the current route matches the user's role
  const currentRole = currentPath.split('/').pop();
  
  if (currentRole !== userProfile.role) {
    console.log(`Current role ${currentRole} doesn't match user role ${userProfile.role}, redirecting`);
    return <Navigate to={`/dashboard/${userProfile.role}`} replace />;
  }
  
  // Return null since the appropriate dashboard component will be rendered by the route directly
  return null;
}

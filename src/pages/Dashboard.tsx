
import { useAuth } from "@/context/AuthContext";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  // If no user profile, redirect to auth page
  if (!userProfile) {
    console.log("No user profile found, redirecting to auth page");
    return <Navigate to="/auth" />;
  }

  // The user's role-specific dashboard will be automatically loaded by the RoleDashboard component
  return <RoleDashboard />;
};

export default Dashboard;

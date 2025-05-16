
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" />;
  }

  // The user's role-specific dashboard will be handled by the RoleDashboard component
  // Just redirect to the main dashboard path
  return <Navigate to="/dashboard" />;
};

export default Dashboard;


import { useAuth } from "@/context/AuthContext";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // The user's role-specific dashboard will be automatically loaded by the RoleDashboard component
  return <RoleDashboard />;
};

export default Dashboard;

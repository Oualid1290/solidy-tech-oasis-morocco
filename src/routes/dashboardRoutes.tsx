
import { ReactNode } from "react";
import Dashboard from "@/pages/Dashboard";
import { BuyerDashboard } from "@/components/dashboard/BuyerDashboard";
import { SellerDashboard } from "@/components/dashboard/SellerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Role guard component to restrict access to role-specific routes
const RoleGuard = ({ 
  children, 
  requiredRole 
}: { 
  children: ReactNode;
  requiredRole: 'buyer' | 'seller' | 'admin';
}) => {
  const { userProfile, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }
  
  if (!userProfile) {
    return <Navigate to="/auth" replace />;
  }
  
  if (userProfile.role !== requiredRole) {
    return <Navigate to={`/dashboard/${userProfile.role}`} replace />;
  }
  
  return <>{children}</>;
};

interface RouteConfig {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
}

export const dashboardRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />
      },
      {
        path: "buyer",
        element: (
          <RoleGuard requiredRole="buyer">
            <BuyerDashboard />
          </RoleGuard>
        )
      },
      {
        path: "seller",
        element: (
          <RoleGuard requiredRole="seller">
            <SellerDashboard />
          </RoleGuard>
        )
      },
      {
        path: "admin",
        element: (
          <RoleGuard requiredRole="admin">
            <AdminDashboard />
          </RoleGuard>
        )
      },
      {
        // Redirect any other dashboard routes back to dashboard home
        path: "*",
        element: <Navigate to="/dashboard" replace />
      }
    ]
  }
];

// Export a flattened route for use in AppRoutes
export const dashboardRoute: RouteConfig = dashboardRoutes[0];

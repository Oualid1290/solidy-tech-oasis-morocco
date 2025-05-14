
import { ReactNode } from "react";
import Dashboard from "@/pages/Dashboard";
import { BuyerDashboard } from "@/components/dashboard/BuyerDashboard";
import { SellerDashboard } from "@/components/dashboard/SellerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Navigate } from "react-router-dom";

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
        element: <BuyerDashboard />
      },
      {
        path: "seller",
        element: <SellerDashboard />
      },
      {
        path: "admin",
        element: <AdminDashboard />
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

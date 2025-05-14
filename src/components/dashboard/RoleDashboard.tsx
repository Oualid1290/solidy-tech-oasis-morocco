import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate, useLocation } from "react-router-dom";

export function RoleDashboard() {
  const { userProfile } = useAuth();
  const location = useLocation();
  
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
  
  // Direct to the appropriate dashboard view based on the user's role
  // This prevents the need for conditional rendering as each role has its own route
  const currentPath = location.pathname;
  
  if (currentPath === '/dashboard') {
    // If we're on the main dashboard page, redirect to the role-specific page
    return <Navigate to={`/dashboard/${userProfile.role}`} replace />;
  }
  
  // Otherwise we're already on a specific dashboard route, so render appropriate content
  switch (userProfile.role) {
    case 'buyer':
      // If already on the buyer route, render the component; otherwise redirect
      if (currentPath === '/dashboard/buyer') {
        return null; // BuyerDashboard is rendered by the route directly
      } else {
        return <Navigate to="/dashboard/buyer" replace />;
      }
    case 'seller':
      if (currentPath === '/dashboard/seller') {
        return null; // SellerDashboard is rendered by the route directly
      } else {
        return <Navigate to="/dashboard/seller" replace />;
      }
    case 'admin':
      if (currentPath === '/dashboard/admin') {
        return null; // AdminDashboard is rendered by the route directly
      } else {
        return <Navigate to="/dashboard/admin" replace />;
      }
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

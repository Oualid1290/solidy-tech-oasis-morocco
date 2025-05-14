import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes, protectedRoutes, notFoundRoute } from "./routes";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = () => {
  // Helper function to create routes recursively
  const createRoutes = (routes: any[], isProtected = false) => {
    return routes.map((route) => {
      // Create the element, wrapped in ProtectedRoute if necessary
      const element = isProtected ? 
        <ProtectedRoute>{route.element}</ProtectedRoute> : 
        route.element;
      
      // If the route has children, render them as nested routes
      if (route.children && route.children.length > 0) {
        return (
          <Route key={route.path} path={route.path} element={element}>
            {createRoutes(route.children, isProtected)}
          </Route>
        );
      }
      
      // Otherwise render a simple route
      return <Route key={route.path} path={route.path} element={element} />;
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {createRoutes(publicRoutes)}

        {/* Protected Routes */}
        {createRoutes(protectedRoutes, true)}

        {/* Not Found Route */}
        <Route path={notFoundRoute.path} element={notFoundRoute.element} />
      </Routes>
    </BrowserRouter>
  );
};

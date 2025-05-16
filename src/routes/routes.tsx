
import { ReactNode } from "react";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ProductDetail from "@/pages/ProductDetail";
import PostListing from "@/pages/PostListing";
import Chat from "@/pages/Chat";
import UserProfile from "@/pages/UserProfile";
import Auth from "@/pages/Auth";
import CategoryPage from "@/pages/CategoryPage";
import SearchResults from "@/pages/SearchResults";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Products from "@/pages/Products";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import LocationPage from "@/pages/LocationPage";
import { dashboardRoute } from "./dashboardRoutes";

interface RouteConfig {
  path: string;
  element: ReactNode;
  requireAuth?: boolean;
  children?: RouteConfig[];
}

// Public routes accessible to all users
export const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/:id",
    element: <ProductDetail />,
  },
  {
    path: "/products/category/:slug",
    element: <CategoryPage />,
  },
  {
    path: "/search",
    element: <SearchResults />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/location/:locationSlug",
    element: <LocationPage />,
  },
];

// Protected routes that require authentication
export const protectedRoutes: RouteConfig[] = [
  // Dashboard routes are defined in dashboardRoutes.tsx
  dashboardRoute,
  {
    path: "/profile",
    element: <UserProfile />,
    requireAuth: true,
  },
  {
    path: "/profile/:username",
    element: <UserProfile />,
    requireAuth: true,
  },
  {
    path: "/post-listing",
    element: <PostListing />,
    requireAuth: true,
  },
  {
    path: "/chat",
    element: <Chat />,
    requireAuth: true,
  },
  {
    path: "/chat/:chatId",
    element: <Chat />,
    requireAuth: true,
  },
];

// Not found route
export const notFoundRoute: RouteConfig = {
  path: "*",
  element: <NotFound />,
};

// All routes combined
export const allRoutes: RouteConfig[] = [
  ...publicRoutes,
  ...protectedRoutes,
  notFoundRoute,
];

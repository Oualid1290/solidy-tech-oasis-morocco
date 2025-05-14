
import { ReactNode } from "react";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ProductDetail from "@/pages/ProductDetail";
import PostListing from "@/pages/PostListing";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import CategoryPage from "@/pages/CategoryPage";
import SearchResults from "@/pages/SearchResults";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
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
];

// Protected routes that require authentication
export const protectedRoutes: RouteConfig[] = [
  // Dashboard routes are defined in dashboardRoutes.tsx
  dashboardRoute,
  {
    path: "/profile/:username",
    element: <Profile />,
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

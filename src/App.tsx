// src/App.tsx
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Using HashRouter to avoid SPA 404s on reload in dev/static hosting
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import CompareFood from "./pages/CompareFood";
import CompareTravel from "./pages/CompareTravel";
import CompareShelter from "./pages/CompareShelter";
import CompareQuickCommerce from "./pages/CompareQuickCommerce";
import CompareHealthcare from "./pages/CompareHealthcare";
import Wallet from "./pages/Wallet";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";
import { getUserProfile } from "./lib/storage";

const queryClient = new QueryClient();

/** Protected route - keeps existing behaviour */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const profile = getUserProfile();
  return profile ? <>{children}</> : <Navigate to="/onboarding" replace />;
};

/**
 * HomeRedirect will run when user visits "/" (root).
 * If user is logged in -> navigate to dashboard
 * otherwise -> show Index (landing) so new users can see it.
 *
 * We do this to avoid manual hash navigation confusion.
 */
function HomeRedirectWrapper() {
  const navigate = useNavigate();
  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      // navigate to dashboard (HashRouter will produce #/dashboard)
      navigate("/dashboard", { replace: true });
    }
    // if no profile — leave them on Index route (landing) which is mounted below
  }, [navigate]);

  // Render Index if not redirected
  return <Index />;
}

/** Lightweight test page to confirm router works (dev only) */
function TestPage() {
  return <div style={{ padding: 40 }}>ROUTER & APP MOUNT OK — Test Page</div>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          {/* Root: run HomeRedirectWrapper which will redirect logged-in users to /dashboard */}
          <Route path="/" element={<HomeRedirectWrapper />} />

          {/* explicit landing and onboarding */}
          <Route path="/landing" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Dev test route */}
          <Route path="/test" element={<TestPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/compare/food"
            element={
              <ProtectedRoute>
                <CompareFood />
              </ProtectedRoute>
            }
          />

          <Route
            path="/compare/travel"
            element={
              <ProtectedRoute>
                <CompareTravel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/compare/shelter"
            element={
              <ProtectedRoute>
                <CompareShelter />
              </ProtectedRoute>
            }
          />

          {/* QUICK COMMERCE — canonical lowercase path */}
          <Route
            path="/compare/quickcommerce"
            element={
              <ProtectedRoute>
                <CompareQuickCommerce />
              </ProtectedRoute>
            }
          />
          {/* Accept camelCase and redirect to canonical lowercase path */}
          <Route path="/compare/quickCommerce" element={<Navigate to="/compare/quickcommerce" replace />} />

          <Route
            path="/compare/healthcare"
            element={
              <ProtectedRoute>
                <CompareHealthcare />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />

          {/* catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

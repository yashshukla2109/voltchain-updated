// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "./ProtectedRoute";
// Correct import in App.tsx
import { AuthProvider } from "@/context/AuthContext";


import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Bidding from "./pages/Bidding";
import Account from "./pages/Account";
import MarketAnalysis from "./pages/MarketAnalysis";
import Community from "./pages/Community";
import Wallet from "./pages/Wallet";
import Notifications from "./pages/Notifications";
import Chatbot from "./pages/chatbot";
import NotFound from "./pages/NotFound";

// ✅ Import your transactions context provider
import { TransactionsProvider } from "./context/TransactionContext";

import "keen-slider/keen-slider.min.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* Wrap app with AuthProvider */}
        <AuthProvider>
          <TransactionsProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketplace"
                  element={
                    <ProtectedRoute>
                      <Marketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bidding"
                  element={
                    <ProtectedRoute>
                      <Bidding />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/market-analysis"
                  element={
                    <ProtectedRoute>
                      <MarketAnalysis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute>
                      <Community />
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
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chatbot"
                  element={
                    <ProtectedRoute>
                      <Chatbot />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TransactionsProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

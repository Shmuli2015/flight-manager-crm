import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ClientsPage from "./pages/ClientsPage";
import ClientDetails from "./pages/ClientDetails";
import FlightsPage from "./pages/FlightsPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import NewClientPage from "./pages/NewClientPage";
import NewFlightPage from "./pages/NewFlightPage";
import { AuthProvider, useAuth } from "./hooks/useSupabaseAuth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/login" 
                element={<LoginPage />} 
              />
              
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/clients" 
                element={
                  <ProtectedRoute>
                    <ClientsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/clients/new" 
                element={
                  <ProtectedRoute>
                    <NewClientPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/client/:id" 
                element={
                  <ProtectedRoute>
                    <ClientDetails />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/flights" 
                element={
                  <ProtectedRoute>
                    <FlightsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/flights/new" 
                element={
                  <ProtectedRoute>
                    <NewFlightPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

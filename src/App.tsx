import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BusinessDirectory from "./pages/BusinessDirectory";
import BusinessDetail from "./pages/BusinessDetail";
import AddBusiness from "./pages/AddBusiness";
import EditBusiness from "./pages/EditBusiness";
import BulkUpload from "./pages/BulkUpload";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { CSVAdapterProvider } from "./hooks/useCSVAdapter";
import BusinessMapInjector from "./components/business/BusinessMapInjector";
import BusinessSeoInjector from "./components/business/BusinessSeoInjector";
import BusinessSharingTools from "./components/business/BusinessSharingTools";
import BusinessSharingToolsContent from "./components/business/BusinessSharingToolsContent";
import PrintStylesInjector from "./components/PrintStylesInjector";
import AuthRequired from "./components/auth/AuthRequired";

// Configure React Query with better defaults for debugging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Disable refetching when window regains focus
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <CSVAdapterProvider>
            <BrowserRouter>
              <PrintStylesInjector />
              <Layout>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/businesses" element={<BusinessDirectory />} />
                  <Route path="/businesses/:id" element={
                    <>
                      <BusinessSeoInjector>
                        <BusinessDetail />
                      </BusinessSeoInjector>
                      <BusinessMapInjector />
                      <BusinessSharingTools />
                      <BusinessSharingToolsContent />
                    </>
                  } />
                  <Route path="/add-business" element={
                    <AuthRequired>
                      <AddBusiness />
                    </AuthRequired>
                  } />
                  <Route path="/edit-business/:id" element={<EditBusiness />} />
                  <Route path="/bulk-upload" element={
                    <AuthRequired>
                      <BulkUpload />
                    </AuthRequired>
                  } />
                  <Route path="/profile" element={
                    <AuthRequired>
                      <Profile />
                    </AuthRequired>
                  } />
                  <Route path="/dashboard" element={
                    <AuthRequired>
                      <Dashboard />
                    </AuthRequired>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </CSVAdapterProvider>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

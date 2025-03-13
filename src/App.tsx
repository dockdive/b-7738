
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppLanguageWrapper from "./components/AppLanguageWrapper";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BusinessDirectory from "./pages/BusinessDirectory";
import BusinessDetail from "./pages/BusinessDetail";
import AddBusiness from "./pages/AddBusiness";
import BulkUpload from "./pages/BulkUpload";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { CSVAdapterProvider } from "./hooks/useCSVAdapter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AppLanguageWrapper>
        <TooltipProvider>
          <CSVAdapterProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/businesses" element={<BusinessDirectory />} />
                  <Route path="/businesses/:id" element={<BusinessDetail />} />
                  <Route path="/add-business" element={<AddBusiness />} />
                  <Route path="/bulk-upload" element={<BulkUpload />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </CSVAdapterProvider>
        </TooltipProvider>
      </AppLanguageWrapper>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

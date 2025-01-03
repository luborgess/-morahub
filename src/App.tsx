import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from './pages/auth';
import ListingsPage from './pages/listings';
import ListingFormPage from './pages/listings/form';
import ListingDetailPage from './pages/listings/[id]';
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { AuthProvider } from "./components/auth/AuthProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/new" element={<PrivateRoute><ListingFormPage /></PrivateRoute>} />
            <Route path="/listings/edit/:id" element={<PrivateRoute><ListingFormPage /></PrivateRoute>} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
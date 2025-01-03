import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import AuthPage from './pages/auth';
import ListingsPage from './pages/listings';
import ListingFormPage from './pages/listings/form';
import ListingDetailPage from './pages/listings/[id]';
import FavoritesPage from './pages/favorites';
import ProfilePage from './pages/profile/[id]';
import ProfileEditPage from './pages/profile/edit';
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
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/listings/:id" element={<ListingDetailPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              
              {/* Rotas protegidas */}
              <Route element={<PrivateRoute />}>
                <Route path="/listings/new" element={<ListingFormPage />} />
                <Route path="/listings/edit/:id" element={<ListingFormPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/profile/edit" element={<ProfileEditPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
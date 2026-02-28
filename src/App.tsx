import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import BulkBeef from "./pages/BulkBeef";
import BulkLamb from "./pages/BulkLamb";
import BulkSheep from "./pages/BulkSheep";
import BulkChicken from "./pages/BulkChicken";
import Extras from "./pages/Extras";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wholesale from "./pages/Wholesale";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/bulk-beef" element={<BulkBeef />} />
              <Route path="/bulk-lamb" element={<BulkLamb />} />
              <Route path="/bulk-sheep" element={<BulkSheep />} />
              <Route path="/bulk-chicken" element={<BulkChicken />} />
              <Route path="/extras" element={<Extras />} />
              <Route path="/wholesale" element={<Wholesale />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

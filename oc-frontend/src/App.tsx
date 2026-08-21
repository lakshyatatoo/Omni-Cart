import { useEffect, useState, useCallback } from "react";
import { Routes, Route } from "react-router";
import { Homepage } from "./pages/home/Homepage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { Orders } from "./pages/orders/Orders";
import { Profile } from "./pages/Profile";
import { Tracking } from "./pages/Tracking";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthModal } from "./components/AuthModal";
import api from "./utils/axios";
import "./App.css";

export function App() {
  const [cart, setCart] = useState<unknown[]>([]);

  const loadCart = useCallback(async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    // Guard: Avoid unauthorized 401 network requests when logged out
    if (!token) {
      setCart([]);
      return;
    }

    try {
      const response = await api.get("/api/cart-items?expand=product");
      // Safely parse cart items across potential payload shapes
      const cartItems =
        response.data?.cart?.items ??
        response.data?.items ??
        (Array.isArray(response.data) ? response.data : []);
      setCart(cartItems);
    } catch {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <AuthProvider>
      <Routes>
        {/* Authentication */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Main pages */}
        <Route index element={<Homepage cart={cart} loadCart={loadCart} />} />

        <Route path="admin" element={<AdminDashboard />} />

        <Route path="admin-login" element={<AuthModal />} />

        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage cart={cart} loadCart={loadCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders cart={cart} loadCart={loadCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile cart={cart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="tracking/:orderId/:productId"
          element={
            <ProtectedRoute>
              <Tracking cart={cart} loadCart={loadCart} />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound cart={cart} loadCart={loadCart} />}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

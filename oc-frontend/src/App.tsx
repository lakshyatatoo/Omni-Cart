import { Routes, Route } from "react-router";
import { Homepage } from "./pages/home/Homepage";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { Orders } from "./pages/orders/Orders";
import { Profile } from "./pages/Profile";
import { Tracking } from "./pages/Tracking";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
// import { AuthModal } from "./components/AuthModal";
import api from "./utils/axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    try {
      const response = await api.get("/api/cart-items?expand=product");

      setCart(response.data.cart.items);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Authentication */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Main pages */}
        <Route index element={<Homepage cart={cart} loadCart={loadCart} />} />

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

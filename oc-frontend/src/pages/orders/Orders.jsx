import { Link } from "react-router";
import { Header } from "../../components/Header";
import { useState, useEffect, Fragment } from "react";
import { OrderHeader } from "./OrderHeader";
import { OrdersGrid } from "./OrdersGrid";
import api from "../../utils/axios";
import "./Orders.css";
import "../../components/Header.css";
export function Orders({ cart ,loadCart}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/api/orders?expand=products");
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.patch(`/api/orders/${orderId}/cancel`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order.");
    }
  };

  return (
    <>
      <link rel="icon" type="image/png" href="/orders-favicon.png" />
      <title>Orders</title>

      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        {loading && <div>Loading orders...</div>}
        {error && <div className="profile-message error">{error}</div>}

        <div className="orders-grid">
          {orders
            .filter((order) => order.status !== "cancelled")
            .map((order) => {
              return (
                <div key={order._id} className="order-container">
                  <OrderHeader order={order} onCancel={handleCancelOrder} />
                  <OrdersGrid order={order} loadCart={loadCart} />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

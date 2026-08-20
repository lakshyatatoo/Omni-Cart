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
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await api.get("/api/orders?expand=products");
      setOrders(response.data.orders);
    };
    fetchOrders();
  }, []);
  return (
    <>
      <link rel="icon" type="image/png" href="/orders-favicon.png" />
      <title>Orders</title>

      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {orders.map((order) => {
            return (
              <div key={order.id} className="order-container">
                <OrderHeader order={order} />
                <OrdersGrid order={order} loadCart={loadCart} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

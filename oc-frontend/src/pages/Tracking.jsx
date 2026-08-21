import { Header } from "../components/Header";
import { Link } from "react-router";
import dayjs from "dayjs";
import api from "../utils/axios";
import { useEffect, useState} from "react";
import { useParams } from "react-router";
import "./Tracking.css";
export function Tracking({ cart,loadCart }) {
  const { orderId, productId } = useParams();
  const [order, setOrder] = useState();
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await api.get(`/api/orders/${orderId}?expand=products`);
        setOrder(response.data.order);
      } catch (err) {
        console.error("Failed to fetch tracking data:", err);
        setError(err.response?.data?.message || "Failed to load tracking information.");
      }
    };
    fetchTrackingData();
  }, [orderId]);

  if (error) {
    return (
      <>
        <Header cart={cart} />
        <div className="tracking-page">
          <div className="order-tracking">
            <Link className="back-to-orders-link link-primary" to="/orders">
              View all orders
            </Link>
            <div className="product-info">{error}</div>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return null;
  }
  const orderProduct = order.items.find((orderProduct) => {
    return orderProduct.productId?._id?.toString() === productId;
  });

  if (!orderProduct || !orderProduct.productId) {
    return (
      <>
        <Header cart={cart} />
        <div className="tracking-page">
          <div className="order-tracking">
            <Link className="back-to-orders-link link-primary" to="/orders">
              View all orders
            </Link>
            <div className="product-info">Product not found in this order.</div>
          </div>
        </div>
      </>
    );
  }

  const deliveryTimems =
    orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
  const timePassedMs = dayjs().valueOf() - order.orderTimeMs;
  let deliveryPercent = (timePassedMs / deliveryTimems) * 100;

  const isPreparing = deliveryPercent < 33;
  const isShipped = deliveryPercent >= 33 && deliveryPercent < 100;
  const isDelivered = deliveryPercent >= 100;

  return (
    <>
      <link rel="icon" type="image/png" href="/tracking-favicon.png" />
      <title>Tracking</title>
      <Header cart={cart} />
      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            {deliveryPercent >= 100
              ? `Delivered on ${dayjs(orderProduct.estimatedDeliveryTimeMs).format("dddd, MMMM D")}`
              : `Arriving on ${dayjs(orderProduct.estimatedDeliveryTimeMs).format("dddd, MMMM D")}`}
          </div>

          <div className="product-info">{orderProduct.productId.name} </div>

          <div className="product-info"> Quantity: {orderProduct.quantity}</div>

          <img className="product-image" src={orderProduct.productId.image} />

          <div className="progress-labels-container">
            <div
              className={`progress-label ${isPreparing && "current status"}`}
            >
              Preparing
            </div>
            <div className={`progress-label ${isShipped && "current status"}`}>
              Shipped
            </div>
            <div
              className={`progress-label ${isDelivered && "current status"}`}
            >
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${deliveryPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

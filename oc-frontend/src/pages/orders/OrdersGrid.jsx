import dayjs from "dayjs";
import { Link, useNavigate } from "react-router";
import { Fragment } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axios";
export function OrdersGrid({ order, loadCart }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addToCart = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    await api.post("/api/cart-items", {
      productId,
      quantity: 1,
    });
    await loadCart();
  };
  return (
    <div className="order-details-grid">
      {order.items.map((orderProduct) => {
        if (!orderProduct.productId) return null;
        return (
          <Fragment key={orderProduct.productId._id || orderProduct.productId}>
            <div className="product-image-container">
              <img src={orderProduct.productId.image} />
            </div>

            <div className="product-details">
              <div className="product-name">{orderProduct.productId.name}</div>
              <div className="product-delivery-date">
                Arriving on:{" "}
                {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMMM D")}
              </div>
              <div className="product-quantity">
                Quantity: {orderProduct.quantity}
              </div>
              <button
                className="buy-again-button button-primary"
                onClick={() => addToCart(orderProduct.productId._id)}
              >
                <img
                  className="buy-again-icon"
                  src="images/icons/buy-again.png"
                />
                <span className="buy-again-message">Add to Cart</span>
              </button>
            </div>

            <div className="product-actions">
              <Link to={`/tracking/${order._id}/${orderProduct.productId._id}`}>
                <button className="track-package-button button-secondary">
                  Track package
                </button>
              </Link>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

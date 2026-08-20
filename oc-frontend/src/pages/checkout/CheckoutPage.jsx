import { CheckoutHeader } from "./CheckoutHeader";
import api from "../../utils/axios";
import { useEffect, useState } from "react";
import "./CheckoutPage.css";
import "./CheckoutHeader.css";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";

export function CheckoutPage({ cart, loadCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  //
  const fetchCheckoutData = async () => {
    const response = await api.get(
      "/api/delivery-options?expand=estimatedDeliveryTime",
    );
    setDeliveryOptions(response.data.deliveryOptions);
  };
  //
  const paySummary = async () => {
    const response = await api.get("/api/cart-items/payment-summary");
    setPaymentSummary(response.data);
  };
  //
  useEffect(() => {
    fetchCheckoutData();
  }, []);
  useEffect(() => {
    paySummary();
  }, [cart]);
  //
  return (
    <>
      <link rel="icon" type="image/png" href="/cart-favicon.png" />
      <title>Checkout</title>

      <CheckoutHeader cart={cart} />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <OrderSummary
            cart={cart}
            deliveryOptions={deliveryOptions}
            loadCart={loadCart}
          />
          <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
        </div>
      </div>
    </>
  );
}

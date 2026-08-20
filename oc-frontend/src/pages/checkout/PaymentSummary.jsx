import { formatMoney } from "../../utils/money";
import api from "../../utils/axios";
import { useNavigate } from "react-router";
import { useState } from "react";

const emptyShippingAddress = {
  name: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

export function PaymentSummary({ paymentSummary, loadCart }) {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState(emptyShippingAddress);
  const [formError, setFormError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleChange = (event) => {
    setShippingAddress({
      ...shippingAddress,
      [event.target.name]: event.target.value,
    });
  };

  const createOrder = async () => {
    setFormError("");
    if (Object.values(shippingAddress).some((value) => value.trim() === "")) {
      setFormError("Please fill in all shipping details.");
      return;
    }

    setPlacingOrder(true);
    try {
      await api.post("/api/orders", {
        shippingAddress,
        paymentMethod: "cod",
      });
      await loadCart();
      navigate("/orders");
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
      setPlacingOrder(false);
    }
  };

  return (
    <div className="payment-summary">
      <div className="payment-summary-title">Payment Summary</div>
      {paymentSummary && (
        <>
          <div
            className="payment-summary-row"
            data-testid="payment-product-cost"
          >
            <div>Items ({paymentSummary.totalItems}):</div>
            <div className="payment-summary-money">
              ${formatMoney(paymentSummary.productCostCents)}
            </div>
          </div>

          <div
            className="payment-summary-row"
            data-testid="payment-shipping-cost"
          >
            <div>Shipping &amp; handling:</div>
            <div className="payment-summary-money">
              ${formatMoney(paymentSummary.shippingCostCents)}
            </div>
          </div>

          <div
            className="payment-summary-row subtotal-row"
            data-testid="payment-subtotal"
          >
            <div>Total before tax:</div>
            <div className="payment-summary-money">
              ${formatMoney(paymentSummary.totalCostBeforeTaxCents)}
            </div>
          </div>

          <div className="payment-summary-row" data-testid="payment-tax">
            <div>Estimated tax (10%):</div>
            <div className="payment-summary-money">
              ${formatMoney(paymentSummary.taxCents)}
            </div>
          </div>

          <div
            className="payment-summary-row total-row"
            data-testid="payment-total"
          >
            <div>Order total:</div>
            <div className="payment-summary-money">
              ${formatMoney(paymentSummary.totalCostCents)}
            </div>
          </div>

          <div className="shipping-form">
            <div className="shipping-form-title">Shipping details</div>
            <input
              name="name"
              placeholder="Full name"
              value={shippingAddress.name}
              onChange={handleChange}
            />
            <input
              name="street"
              placeholder="Street address"
              value={shippingAddress.street}
              onChange={handleChange}
            />
            <input
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleChange}
            />
            <input
              name="state"
              placeholder="State"
              value={shippingAddress.state}
              onChange={handleChange}
            />
            <input
              name="zipCode"
              placeholder="ZIP code"
              value={shippingAddress.zipCode}
              onChange={handleChange}
            />
            <input
              name="country"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={handleChange}
            />
            {formError && (
              <div className="shipping-form-error">{formError}</div>
            )}
          </div>

          <button
            className="place-order-button button-primary"
            onClick={createOrder}
            data-testid="place-order-button"
            disabled={placingOrder}
          >
            {placingOrder ? "Placing order..." : "Place your order"}
          </button>
        </>
      )}
    </div>
  );
}
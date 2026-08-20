import  mobileLogoWhite  from "../../assets/images/mobile-logo-white.png";
import  logo  from "../../assets/images/logo.png";

import { Link } from "react-router";
import "./CheckoutHeader.css";
export function CheckoutHeader({ cart }) {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return (
    <>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link to="/">
              <img className="logo" src={logo} />
              <img className="mobile-logo" src={mobileLogoWhite} />
            </Link>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <Link to="/" className="return-to-home-link">
              {cartQuantity} items
            </Link>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>
    </>
  );
}

import mobileLogoWhite from "../assets/images/mobile-logo-white.png";
import logoWhite from "../assets/images/logo-white.png";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

type HeaderProps = {
  cart: {
    productId: number;
    quantity: number;
    deliveryOptionId: string;
  }[];
};

export function Header({ cart }: HeaderProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  const handleSearch = () => {
    navigate(`/?search=${search}`);
    setSearch("");
  };
  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    navigate("/login");
  };
  return (
    <>
      <div className="header">
        <div className="left-section">
          <Link to="/" className="header-link">
            <img className="logo" src={logoWhite} />
            <img className="mobile-logo" src={mobileLogoWhite} />
          </Link>
        </div>

        <div className="middle-section">
          <input
            className="search-bar"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button className="search-button" onClick={handleSearch}>
            <img className="search-icon" src="images/icons/search-icon.png" />
          </button>
        </div>

        <div className="right-section">
          {user ? (
            <>
              <div className="profile-section">
                <button
                  className="profile-button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <span className="profile-text">Profile</span>
                </button>
                {profileMenuOpen && (
                  <div className="profile-dropdown">
                    <Link
                      to="/profile"
                      className="profile-dropdown-item"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      className="profile-dropdown-item profile-logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <Link to="/orders" className="orders-link header-link">
                <span className="orders-text">Orders</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="orders-link header-link">
                <span className="orders-text">Login</span>
              </Link>
              <Link to="/register" className="orders-link header-link">
                <span className="orders-text">Register</span>
              </Link>
            </>
          )}

          <Link to={user ? "/checkout" : "/login"} className="cart-link header-link">
            <img className="cart-icon" src="images/icons/cart-icon.png" />
            <div className="cart-quantity">{cartQuantity}</div>
            <div className="cart-text">Cart</div>
          </Link>
        </div>
      </div>
    </>
  );
}

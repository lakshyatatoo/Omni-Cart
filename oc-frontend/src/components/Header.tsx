import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

type HeaderProps = {
  cart: {
    _id?: string;
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
          <Link to="/" className="header-link logo-badge-link">
            <div className="logo-badge">
              <span className="logo-badge-name">
                <span className="logo-omni">Omni</span>
                <span className="logo-cart">Cart</span>
              </span>
              <span className="logo-tagline">EVERYTHING. ANYWHERE.</span>
            </div>
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
            <svg
              className="search-arrow-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
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
                  <span className="orders-text">Profile</span>
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

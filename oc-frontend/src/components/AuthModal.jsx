import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

export function AuthModal() {
  const navigate = useNavigate();
  const { authModalOpen, closeAuthModal } = useAuth();

  if (!authModalOpen) {
    return null;
  }

  const goToRegister = () => {
    closeAuthModal();
    navigate("/register");
  };

  const goToLogin = () => {
    closeAuthModal();
    navigate("/login");
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="auth-modal-close"
          aria-label="Close"
          onClick={closeAuthModal}
        >
          &times;
        </button>

        <div className="auth-modal-icon">🔐</div>

        <h2 id="auth-modal-title" className="auth-modal-title">
          Login / Register Required
        </h2>

        <p className="auth-modal-text">
          You need an account to proceed. Please log in or create an account to
          access your cart, orders, and checkout.
        </p>

        <button className="auth-modal-primary" onClick={goToRegister}>
          Create Account
        </button>

        <button className="auth-modal-secondary" onClick={goToLogin}>
          Already have an account? Log in
        </button>
      </div>
    </div>
  );
}
import { useAuth } from "../../context/AuthContext";
import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import api from "../../utils/axios";
import "./Homepage.css";
import "../../components/Header.css";
import { ProductsGrid } from "./ProductsGrid";

export function Homepage({ cart, loadCart }) {
  const { user, authModalOpen, openAuthModal, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const navigate = useNavigate();

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const response = await api.get(
          search
            ? `/api/products?search=${encodeURIComponent(search)}`
            : "/api/products",
        );

        console.log("PRODUCT RESPONSE:", response.data);

        setProducts(response.data.products);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      }
    };

    getHomeData();
  }, [search]);

const handleManageClick = async () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded.role === "admin") {
          navigate("/admin");
          return;
        }
      } catch (e) {
        // Invalid token, fall through to show modal
      }
    }
    // Open admin auth modal
    openAuthModal(true);
    navigate("/admin-login");
  };

  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/omniSvg.svg" />
      <title>Omni-Cart</title>

      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
        <div className="manage-footer">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleManageClick();
            }}
            className="manage-link"
          >
            Manage
          </a>
        </div>
      </div>
    </>
  );
}

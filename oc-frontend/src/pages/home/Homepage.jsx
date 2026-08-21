import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import api from "../../utils/axios";
import { ProductsGrid } from "./ProductsGrid";
import "./Homepage.css";
import "../../components/Header.css";

export function Homepage({ cart, loadCart }) {
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
            : "/api/products"
        );
        const responseData = response.data;
        const productList = Array.isArray(responseData)
          ? responseData
          : (responseData.products || []);
        setProducts(productList);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      }
    };

    getHomeData();
  }, [search]);

  const handleManageClick = () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded.role === "admin") {
          navigate("/admin");
          return;
        }
      } catch (e) {
        // Token invalid or expired, continue to login flow
      }
    }
    navigate("/admin-login");
  };

  return (
    <div className="home-page">
      <Header cart={cart} />
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
  );
}

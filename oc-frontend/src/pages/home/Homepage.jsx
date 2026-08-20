import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import api from "../../utils/axios";
import "./Homepage.css";
import "../../components/Header.css";
import { ProductsGrid } from "./ProductsGrid";

export function Homepage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

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

  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/omniSvg.svg" />
      <title>Omni-Cart</title>

      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}

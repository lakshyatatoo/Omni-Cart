import "./NotFound.css";
import { Link } from "react-router";
import { Header } from "../components/Header";

export function NotFound({ cart, loadCart }) {
  return (
    <>
      <title>404 Page Not Found</title>
      <link rel="icon" type="image/svg+xml" href="home-favicon.png" />

      <Header cart={cart} />

      <div className="not-found-message">Page not found</div>
    </>
  );
}

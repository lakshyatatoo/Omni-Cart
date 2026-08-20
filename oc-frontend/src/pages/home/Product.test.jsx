import { it, expect, describe, vi, beforeEach } from "vitest";
import { Product } from "./Product";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../../context/AuthContext";
import api from "../../utils/axios";

vi.mock("../../utils/axios");

describe("Product", () => {
  let product;
  let loadCart;
  let user;

  beforeEach(() => {
    product = {
      _id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      image: "images/products/athletic-cotton-socks-6-pairs.jpg",
      name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
      rating: {
        stars: 4.5,
        count: 87,
      },
      priceCents: 1090,
      keywords: ["socks", "sports", "apparel"],
    };

    loadCart = vi.fn();
    user = userEvent.setup();

    api.get.mockResolvedValue({
      data: { user: { id: "1", name: "Test User", email: "test@test.com", role: "customer" } },
    });
    api.post.mockResolvedValue({});
  });

  it("displays product details correctly", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Product product={product} loadCart={loadCart} />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Black and Gray Athletic Cotton Socks - 6 Pairs"),
    ).toBeInTheDocument();

    expect(screen.getByText("10.90")).toBeInTheDocument();

    expect(screen.getByTestId("product-image")).toBeInTheDocument();

    expect(screen.getByTestId("product-image")).toHaveAttribute(
      "src",
      "images/products/athletic-cotton-socks-6-pairs.jpg",
    );

    expect(
      screen.getByTestId("product-rating-stars-image"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("product-rating-stars-image")).toHaveAttribute(
      "src",
      "images/ratings/rating-45.png",
    );

    expect(screen.getByText("87")).toBeInTheDocument();
  });

  it("add product to cart", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Product product={product} loadCart={loadCart} />
        </AuthProvider>
      </MemoryRouter>,
    );

    const addToCartButton = screen.getByTestId("add-to-cart-button");

    await user.click(addToCartButton);

    expect(api.post).toHaveBeenCalledWith("/api/cart-items", {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 1,
    });

    expect(loadCart).toHaveBeenCalled();
  });

  it("select option", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Product product={product} loadCart={loadCart} />
        </AuthProvider>
      </MemoryRouter>,
    );
    const quantitySelector = screen.getByTestId("quantity-selector");
    expect(quantitySelector).toHaveValue("1");
    await user.selectOptions(quantitySelector, "3");
    expect(quantitySelector).toHaveValue("3");

    const addToCartButton = screen.getByTestId("add-to-cart-button");
    await user.click(addToCartButton);
    expect(api.post).toHaveBeenCalledWith("/api/cart-items", {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 3,
    });
    expect(loadCart).toHaveBeenCalled();
  });
});

import { it, expect, describe, vi, beforeEach } from "vitest";
import { Homepage } from "./Homepage";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/react";
import { AuthProvider } from "../../context/AuthContext";
import api from "../../utils/axios";

vi.mock("../../utils/axios");

describe("Homepage", () => {
  let loadCart;
  let user;
  beforeEach(() => {
    loadCart = vi.fn();
    user = userEvent.setup();

    api.get.mockImplementation(async (urlPath) => {
      if (urlPath === "/api/auth/me") {
        return {
          data: { user: { id: "1", name: "Test User", email: "test@test.com", role: "customer" } },
        };
      }
      if (urlPath === "/api/products") {
        return {
          data: {
            status: "success",
            products: [
              {
                _id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                image: "images/products/athletic-cotton-socks-6-pairs.jpg",
                name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
                rating: {
                  stars: 4.5,
                  count: 87,
                },
                priceCents: 1090,
                keywords: ["socks", "sports", "apparel"],
              },
              {
                _id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
                image: "images/products/intermediate-composite-basketball.jpg",
                name: "Intermediate Size Basketball",
                rating: {
                  stars: 4,
                  count: 127,
                },
                priceCents: 2095,
                keywords: ["sports", "basketballs"],
              },
            ],
          },
        };
      }
    });
  });

  it("displays products correctly", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Homepage cart={[]} loadCart={loadCart} />
        </AuthProvider>
      </MemoryRouter>,
    );
    const productContainers = await screen.findAllByTestId("product-container");
    expect(productContainers).toHaveLength(2);
    expect(
      within(productContainers[0]).getByText(
        "Black and Gray Athletic Cotton Socks - 6 Pairs",
      ),
    ).toBeInTheDocument();
    expect(
      within(productContainers[1]).getByText("Intermediate Size Basketball"),
    ).toBeInTheDocument();
  });

  it("add to cart button check", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Homepage cart={[]} loadCart={loadCart} />
        </AuthProvider>
      </MemoryRouter>,
    );
    const productContainers = await screen.findAllByTestId("product-container");

    const addTocartButton1 = within(productContainers[0]).getByTestId(
      "add-to-cart-button",
    );
    const quantitySelector1 = within(productContainers[0]).getByTestId(
      "quantity-selector",
    );
    await user.selectOptions(quantitySelector1, "2");
    await user.click(addTocartButton1);
    
    const addTocartButton2 = within(productContainers[1]).getByTestId(
      "add-to-cart-button",
    );
    const quantitySelector2 = within(productContainers[1]).getByTestId(
      "quantity-selector",
    );
    await user.selectOptions(quantitySelector2, "3");
    await user.click(addTocartButton2);

    expect(api.post).toHaveBeenNthCalledWith(1, "/api/cart-items", {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
    });

    expect(api.post).toHaveBeenNthCalledWith(2, "/api/cart-items", {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 3,
    });
    expect(loadCart).toHaveBeenCalledTimes(2);
  });
});

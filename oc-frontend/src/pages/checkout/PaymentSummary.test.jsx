import { PaymentSummary } from "./PaymentSummary";
import { it, expect, describe, vi, beforeEach } from "vitest";
import { MemoryRouter, useLocation } from "react-router";
import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/react";
import api from "../../utils/axios";

vi.mock("../../utils/axios");

describe("PaymentSummary", () => {
  let data;
  let loadCart;
  let user;
  beforeEach(() => {
    data = {
      totalItems: 5,
      productCostCents: 5450,
      shippingCostCents: 0,
      totalCostBeforeTaxCents: 5450,
      taxCents: 545,
      totalCostCents: 5995,
    };
    loadCart = vi.fn();
    user = userEvent.setup();
  });
  it("payment summary check", async () => {
    render(
      <MemoryRouter>
        <PaymentSummary paymentSummary={data} loadCart={loadCart} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Items (5):")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("payment-product-cost")).getByText("$54.50"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("payment-shipping-cost")).toHaveTextContent(
      "$0.00",
    );
    expect(screen.getByTestId("payment-subtotal")).toHaveTextContent("$54.50");
    expect(screen.getByTestId("payment-tax")).toHaveTextContent("$5.45");
    expect(screen.getByTestId("payment-total")).toHaveTextContent("$59.95");
  });
  it("click place order. button", async () => {
    function Location() {
      const location = useLocation();
      return <div data-testid="location-display">{location.pathname}</div>;
    }
    render(
      <MemoryRouter>
        <PaymentSummary paymentSummary={data} loadCart={loadCart} />
        <Location />
      </MemoryRouter>,
    );
    const placeOrderButton = screen.getByTestId("place-order-button");
    await user.click(placeOrderButton);

    expect(api.post).not.toHaveBeenCalled();

    await user.type(screen.getByPlaceholderText("Full name"), "John Doe");
    await user.type(screen.getByPlaceholderText("Street address"), "123 Main St");
    await user.type(screen.getByPlaceholderText("City"), "Springfield");
    await user.type(screen.getByPlaceholderText("State"), "IL");
    await user.type(screen.getByPlaceholderText("ZIP code"), "62701");
    await user.type(screen.getByPlaceholderText("Country"), "USA");

    await user.click(placeOrderButton);

    expect(api.post).toHaveBeenCalledWith("/api/orders", {
      shippingAddress: {
        name: "John Doe",
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        zipCode: "62701",
        country: "USA",
      },
      paymentMethod: "cod",
    });
    expect(loadCart).toHaveBeenCalled();
    expect(screen.getByTestId("location-display")).toHaveTextContent("/orders");
  });
});

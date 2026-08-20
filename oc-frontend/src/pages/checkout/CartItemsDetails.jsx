import { formatMoney } from "../../utils/money";
import api from "../../utils/axios";
import { useState } from "react";

export function CartItemDetails({ cartItem, loadCart }) {
  const [updateQuantity, setUpdateQuantity] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const openBox = async () => {
    if (!updateQuantity) {
      setUpdateQuantity(true);
    } else {
      setUpdateQuantity(false);
    }
    if (updateQuantity) {
      await api.put(`/api/cart-items/${cartItem.productId._id}`, {
        quantity: Number(quantity),
      });
      await loadCart();
    }
  };
  const quantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const deleteItem = async () => {
    await api.delete(`/api/cart-items/${cartItem.productId._id}`);
    await loadCart();
  };
  return (
    <>
      <img className="product-image" src={cartItem.productId.image} />
      <div className="cart-item-details">
        <div className="product-name">{cartItem.productId.name}</div>
        <div className="product-price">
          ${formatMoney(cartItem.productId.priceCents)}
        </div>
        <div className="product-quantity">
          <span>
            Quantity:
            {updateQuantity ? (
              <input
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    openBox();
                  }
                  if (event.key === "Escape") {                    setUpdateQuantity(false);
                    setQuantity(cartItem.quantity);
                  }
                }}
                value={quantity}
                onChange={quantityChange}
                type="text"
                className="quantity-input"
                style={{ width: "20px" }}
              />
            ) : (
              ""
            )}
            <span className="quantity-label">{quantity}</span>
          </span>
          <span className="update-quantity-link link-primary" onClick={openBox}>
            Update
          </span>
          <span
            className="delete-quantity-link link-primary"
            onClick={deleteItem}
          >
            Delete
          </span>
        </div>
      </div>
    </>
  );
}

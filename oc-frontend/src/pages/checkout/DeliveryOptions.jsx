import { formatMoney } from "../../utils/money";
import dayjs from "dayjs";
import api from "../../utils/axios";
export function DeliveryOptions({ cartItem, deliveryOptions, loadCart }) {
  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>
      {deliveryOptions.map((deliveryOption) => {
        let priceString = "FREE Shipping";
        if (deliveryOption.priceCents > 0) {
          priceString = `$${formatMoney(deliveryOption.priceCents)}`;
        }
        const updateDeliveryOption = async () => {
          await api.patch(`/api/cart-items/${cartItem.productId._id}`, {
            deliveryOptionId: deliveryOption.id,
          });
          await loadCart();
        };
        return (
          <div
            key={deliveryOption.id}
            className="delivery-option"
            onClick={updateDeliveryOption}
          >
            <input
              type="radio"
              checked={cartItem.deliveryOptionId === deliveryOption.id}
              onChange={() => {}}
              className="delivery-option-input"
              name={`delivery-option-${cartItem._id}`}
            />
            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D",
                )}
              </div>
              <div className="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

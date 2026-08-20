import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  calculateCartTotal,
  getCartItemsForOrder,
} from "../services/cart.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCartController = asyncHandler(async (req, res) => {
  const cart = await getCart(req.user._id);
  res.json({
    status: "success",
    cart,
  });
});

export const addToCartController = asyncHandler(async (req, res) => {
  const { productId, quantity, deliveryOptionId } = req.body;
  const cart = await addToCart(
    req.user._id,
    productId,
    quantity,
    deliveryOptionId,
  );
  res.status(201).json({
    status: "success",
    cart,
  });
});

export const updateCartItemController = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updates = req.body;
  const cart = await updateCartItem(req.user._id, productId, updates);
  res.json({
    status: "success",
    cart,
  });
});

export const removeFromCartController = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await removeFromCart(req.user._id, productId);
  res.json({
    status: "success",
    cart,
  });
});

export const clearCartController = asyncHandler(async (req, res) => {
  const cart = await clearCart(req.user._id);
  res.json({
    status: "success",
    cart,
  });
});

export const getPaymentSummaryController = asyncHandler(async (req, res) => {
  const summary = await calculateCartTotal(req.user._id);
  res.json({
    status: "success",
    ...summary,
  });
});

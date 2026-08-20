import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { DeliveryOption } from '../models/deliveryOption.model.js';
import { AppError } from '../middleware/error.middleware.js';

const populateCart = (cart) => {
  return Cart.populate(cart, { path: 'items.productId', model: 'Product' });
};

export const getCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate('items.productId');
  
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  
  return cart;
};

export const addToCart = async (userId, productId, quantity, deliveryOptionId = '1') => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (!product.inStock) {
    throw new AppError('Product is out of stock', 400);
  }

  const deliveryOption = await DeliveryOption.findOne({ id: deliveryOptionId });
  if (!deliveryOption) {
    throw new AppError('Invalid delivery option', 400);
  }

  let cart = await Cart.findOne({ userId });
  
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
    if (cart.items[existingItemIndex].quantity > 10) {
      cart.items[existingItemIndex].quantity = 10;
    }
    if (deliveryOptionId) {
      cart.items[existingItemIndex].deliveryOptionId = deliveryOptionId;
    }
  } else {
    cart.items.push({
      productId,
      quantity,
      deliveryOptionId
    });
  }

  await cart.save();
  return Cart.populate(cart, { path: 'items.productId', model: 'Product' });
};

export const updateCartItem = async (userId, productId, updates) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    throw new AppError('Cart item not found', 404);
  }

  if (updates.quantity !== undefined) {
    cart.items[itemIndex].quantity = updates.quantity;
  }

  if (updates.deliveryOptionId !== undefined) {
    const deliveryOption = await DeliveryOption.findOne({ id: updates.deliveryOptionId });
    if (!deliveryOption) {
      throw new AppError('Invalid delivery option', 400);
    }
    cart.items[itemIndex].deliveryOptionId = updates.deliveryOptionId;
  }

  await cart.save();
  return Cart.populate(cart, { path: 'items.productId', model: 'Product' });
};

export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = cart.items.filter(
    item => item.productId.toString() !== productId
  );

  await cart.save();
  return Cart.populate(cart, { path: 'items.productId', model: 'Product' });
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = [];
  await cart.save();
  return cart;
};

export const calculateCartTotal = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return {
      totalItems: 0,
      productCostCents: 0,
      shippingCostCents: 0,
      totalCostBeforeTaxCents: 0,
      taxCents: 0,
      totalCostCents: 0,
      items: []
    };
  }

  let totalItems = 0;
  let productCostCents = 0;
  let shippingCostCents = 0;
  const items = [];

  for (const item of cart.items) {
    if (!item.productId) continue;

    const deliveryOption = await DeliveryOption.findOne({ id: item.deliveryOptionId });
    if (!deliveryOption) continue;

    const itemProductCost = item.productId.priceCents * item.quantity;
    const itemShippingCost = deliveryOption.priceCents;

    totalItems += item.quantity;
    productCostCents += itemProductCost;
    shippingCostCents += itemShippingCost;

    items.push({
      productId: item.productId._id,
      product: item.productId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId,
      deliveryOption,
      productCost: itemProductCost,
      shippingCost: itemShippingCost,
      estimatedDeliveryTimeMs: Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000
    });
  }

  const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
  const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
  const totalCostCents = totalCostBeforeTaxCents + taxCents;

  return {
    totalItems,
    productCostCents,
    shippingCostCents,
    totalCostBeforeTaxCents,
    taxCents,
    totalCostCents,
    items
  };
};

export const getCartItemsForOrder = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  const items = [];
  let totalCostCents = 0;

  for (const item of cart.items) {
    if (!item.productId) {
      throw new AppError(`Product not found in cart`, 400);
    }

    const deliveryOption = await DeliveryOption.findOne({ id: item.deliveryOptionId });
    if (!deliveryOption) {
      throw new AppError(`Invalid delivery option: ${item.deliveryOptionId}`, 400);
    }

    const productCost = item.productId.priceCents * item.quantity;
    const shippingCost = deliveryOption.priceCents;
    const estimatedDeliveryTimeMs = Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000;

    totalCostCents += productCost + shippingCost;

    items.push({
      productId: item.productId._id,
      quantity: item.quantity,
      priceCents: item.productId.priceCents,
      deliveryOptionId: item.deliveryOptionId,
      estimatedDeliveryTimeMs
    });
  }

  totalCostCents = Math.round(totalCostCents * 1.1);

  return { items, totalCostCents };
};
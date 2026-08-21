import { Order } from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { DeliveryOption } from '../models/deliveryOption.model.js';
import { AppError } from '../middleware/error.middleware.js';

export const createOrder = async (userId, shippingAddress, paymentMethod = 'cod') => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  let totalCostCents = 0;
  const items = [];

  for (const item of cart.items) {
    if (!item.productId) {
      throw new AppError(`Product not found in cart`, 400);
    }

    // Verify sufficient stock before placing the order
    if (item.productId.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for product: ${item.productId.name}`,
        400
      );
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

  const order = await Order.create({
    userId,
    orderTimeMs: Date.now(),
    totalCostCents,
    items,
    shippingAddress,
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'pending' : 'pending'
    }
  });

  // Decrement stock for every ordered product
  for (const item of cart.items) {
    const product = item.productId;
    product.stock -= item.quantity;
    product.inStock = product.stock > 0;
    await product.save();
  }

  cart.items = [];
  await cart.save();

  return Order.populate(order, { path: 'items.productId', model: 'Product' });
};

export const getUserOrders = async (userId, options = {}) => {
  const { page = 1, limit = 10, status } = options;
  
  const query = { userId };
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ orderTimeMs: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.productId'),
    Order.countDocuments(query)
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, userId }).populate('items.productId');
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  return order;
};

export const getAllOrders = async (options = {}) => {
  const { page = 1, limit = 20, status, userId } = options;
  
  const query = {};
  if (status) query.status = status;
  if (userId) query.userId = userId;

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ orderTimeMs: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .populate('items.productId'),
    Order.countDocuments(query)
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  ).populate('items.productId').populate('userId', 'name email');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return order;
};

export const updateOrderPayment = async (orderId, paymentData) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { 
      'payment.status': paymentData.status,
      'payment.transactionId': paymentData.transactionId 
    },
    { new: true, runValidators: true }
  ).populate('items.productId');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return order;
};

export const cancelOrder = async (orderId, userId, role) => {
  // Users can only cancel their own orders; admins can cancel any order
  const query = { _id: orderId };
  if (role !== 'admin') {
    query.userId = userId;
  }

  const order = await Order.findOne(query);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (!['pending', 'processing'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled at this stage', 400);
  }

  // Restore stock for every item in the cancelled order
  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.stock += item.quantity;
      product.inStock = product.stock > 0;
      await product.save();
    }
  }

  order.status = 'cancelled';
  await order.save();

  return Order.populate(order, { path: 'items.productId', model: 'Product' });
};
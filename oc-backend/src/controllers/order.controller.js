import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateOrderPayment,
  cancelOrder,
} from "../services/order.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrderController = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const order = await createOrder(req.user._id, shippingAddress, paymentMethod);
  res.status(201).json({
    status: "success",
    order,
  });
});

export const getUserOrdersController = asyncHandler(async (req, res) => {
  const options = {
    page: req.query.page ? parseInt(req.query.page) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 10,
    status: req.query.status,
  };

  const result = await getUserOrders(req.user._id, options);
  res.json({
    status: "success",
    ...result,
  });
});

export const getOrderController = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id, req.user._id);
  res.json({
    status: "success",
    order,
  });
});

export const getAllOrdersController = asyncHandler(async (req, res) => {
  const options = {
    page: req.query.page ? parseInt(req.query.page) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 20,
    status: req.query.status,
    userId: req.query.userId,
  };

  const result = await getAllOrders(options);
  res.json({
    status: "success",
    ...result,
  });
});

export const updateOrderStatusController = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await updateOrderStatus(req.params.id, status);
  res.json({
    status: "success",
    order,
  });
});

export const updateOrderPaymentController = asyncHandler(async (req, res) => {
  const order = await updateOrderPayment(req.params.id, req.body);
  res.json({
    status: "success",
    order,
  });
});

export const cancelOrderController = asyncHandler(async (req, res) => {
  const order = await cancelOrder(req.params.id, req.user._id);
  res.json({
    status: "success",
    order,
  });
});

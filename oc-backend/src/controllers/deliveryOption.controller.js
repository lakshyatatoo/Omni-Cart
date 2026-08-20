import {
  getDeliveryOptions,
  getDeliveryOptionById,
  createDeliveryOption,
  updateDeliveryOption,
  deleteDeliveryOption,
  seedDefaultDeliveryOptions,
} from "../services/deliveryOption.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDeliveryOptionsController = asyncHandler(async (req, res) => {
  const expand = req.query.expand;
  const options = await getDeliveryOptions(expand);
  res.json({
    status: "success",
    deliveryOptions: options,
  });
});

export const getDeliveryOptionController = asyncHandler(async (req, res) => {
  const option = await getDeliveryOptionById(req.params.id);
  res.json({
    status: "success",
    deliveryOption: option,
  });
});

export const createDeliveryOptionController = asyncHandler(async (req, res) => {
  const option = await createDeliveryOption(req.body);
  res.status(201).json({
    status: "success",
    deliveryOption: option,
  });
});

export const updateDeliveryOptionController = asyncHandler(async (req, res) => {
  const option = await updateDeliveryOption(req.params.id, req.body);
  res.json({
    status: "success",
    deliveryOption: option,
  });
});

export const deleteDeliveryOptionController = asyncHandler(async (req, res) => {
  await deleteDeliveryOption(req.params.id);
  res.status(204).json({
    status: "success",
    message: "Delivery option deleted successfully",
  });
});

export const seedDeliveryOptionsController = asyncHandler(async (req, res) => {
  const options = await seedDefaultDeliveryOptions();
  res.json({
    status: "success",
    deliveryOptions: options,
  });
});

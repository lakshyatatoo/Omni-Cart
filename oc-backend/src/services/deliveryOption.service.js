import { DeliveryOption } from '../models/deliveryOption.model.js';
import { AppError } from '../middleware/error.middleware.js';

export const getDeliveryOptions = async (expand = false) => {
  const options = await DeliveryOption.find().sort({ priceCents: 1 });
  
  if (expand === 'estimatedDeliveryTime') {
    const now = Date.now();
    return options.map(option => ({
      ...option.toObject(),
      estimatedDeliveryTimeMs: now + option.deliveryDays * 24 * 60 * 60 * 1000
    }));
  }
  
  return options;
};

export const getDeliveryOptionById = async (id) => {
  const option = await DeliveryOption.findOne({ id });
  if (!option) {
    throw new AppError('Delivery option not found', 404);
  }
  return option;
};

export const createDeliveryOption = async (optionData) => {
  const existing = await DeliveryOption.findOne({ id: optionData.id });
  if (existing) {
    throw new AppError('Delivery option with this ID already exists', 400);
  }
  return DeliveryOption.create(optionData);
};

export const updateDeliveryOption = async (id, updateData) => {
  const option = await DeliveryOption.findOneAndUpdate({ id }, updateData, {
    new: true,
    runValidators: true
  });
  
  if (!option) {
    throw new AppError('Delivery option not found', 404);
  }
  
  return option;
};

export const deleteDeliveryOption = async (id) => {
  const option = await DeliveryOption.findOneAndDelete({ id });
  if (!option) {
    throw new AppError('Delivery option not found', 404);
  }
  return option;
};

export const seedDefaultDeliveryOptions = async () => {
  const defaults = [
    { id: '1', deliveryDays: 7, priceCents: 0 },
    { id: '2', deliveryDays: 3, priceCents: 499 },
    { id: '3', deliveryDays: 1, priceCents: 999 }
  ];

  for (const option of defaults) {
    const existing = await DeliveryOption.findOne({ id: option.id });
    if (!existing) {
      await DeliveryOption.create(option);
    }
  }

  return DeliveryOption.find().sort({ priceCents: 1 });
};
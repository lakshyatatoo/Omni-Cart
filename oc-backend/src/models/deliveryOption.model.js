import mongoose from 'mongoose';

const deliveryOptionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  deliveryDays: {
    type: Number,
    required: [true, 'Delivery days is required'],
    min: [0, 'Delivery days cannot be negative']
  },
  priceCents: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
});

deliveryOptionSchema.index({ id: 1 }, { unique: true });

export const DeliveryOption = mongoose.model('DeliveryOption', deliveryOptionSchema);
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Quantity cannot exceed 10'],
    default: 1
  },
  deliveryOptionId: {
    type: String,
    required: [true, 'Delivery option is required'],
    default: '1'
  }
}, {
  timestamps: true,
  _id: true
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

cartSchema.index({ userId: 1 }, { unique: true });

export const Cart = mongoose.model('Cart', cartSchema);
export const CartItem = mongoose.model('CartItem', cartItemSchema);
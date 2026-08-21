import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  stars: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  priceCents: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  rating: {
    type: ratingSchema,
    required: true,
    default: { stars: 0, count: 0 }
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    default: 50,
    min: [0, 'Stock cannot be negative']
  }
}, {
  timestamps: true
});

// Keep inStock in sync with the stock count
productSchema.pre('save', function(next) {
  this.inStock = this.stock > 0;
  next();
});

productSchema.index({ name: 'text', keywords: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ priceCents: 1 });

export const Product = mongoose.model('Product', productSchema);
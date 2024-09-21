import { Schema, model } from 'mongoose';
import { ICartItem } from 'interfaces/CartItem';
import { IOrder } from 'interfaces/Order';
const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    status: {
      type: String,
      default: 'Not processed',
      enum: [
        'Not processed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ],
    },
  },
  { timestamps: true },
);

export const CartItem = model<ICartItem>('CartItem', CartItemSchema);

const OrderSchema = new Schema<IOrder>(
  {
    products: [CartItemSchema],
    customer_name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    customer_email: {
      type: String,
      trim: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
      required: [true, 'Email is required'],
    },
    delivery_address: {
      street: { type: String, required: 'Street is required' },
      city: { type: String, required: 'City is required' },
      state: { type: String },
      zipcode: { type: String, required: 'Zip Code is required' },
      country: { type: String, required: 'Country is required' },
    },
    payment_id: {},
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', OrderSchema);

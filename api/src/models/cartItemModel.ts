import { Schema, model } from 'mongoose';
import { ICartItem } from 'interfaces/CartItem';

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

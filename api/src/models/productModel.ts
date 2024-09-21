import { Schema, model } from 'mongoose';
import { IProduct } from 'interfaces/Product';

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  },
  { timestamps: true },
);

export const Product = model<IProduct>('Product', ProductSchema);

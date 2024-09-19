import { Document, Types } from 'mongoose';

export interface ICartItem extends Document {
  product: Types.ObjectId;
  quantity: number;
  shop: Types.ObjectId;
  status:
    | 'Not processed'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled';
}

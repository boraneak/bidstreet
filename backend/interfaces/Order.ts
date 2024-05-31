import { Types, Document } from "mongoose";
import { ICartItem } from "./CartItem";

export interface IOrder extends Document {
  products: Types.DocumentArray<ICartItem>;
  customer_name: string;
  customer_email: string;
  delivery_address: {
    street: string;
    city: string;
    state?: string;
    zipcode: string;
    country: string;
  };
  payment_id?: any;
  updated?: Date;
  created: Date;
  user: Types.ObjectId;
}

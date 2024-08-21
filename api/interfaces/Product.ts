import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  image: {
    data: Buffer;
    contentType: string;
  };
  description?: string;
  category?: string;
  quantity: number;
  price: number;
  updated?: Date;
  created: Date;
  shop: Types.ObjectId;
}

import mongoose, { Document } from 'mongoose';

export interface IShop extends Document {
  name: string;
  image?: {
    data: Buffer;
    contentType: string;
  };
  description?: string;
  updated?: Date;
  created: Date;
  owner: mongoose.Types.ObjectId;
}

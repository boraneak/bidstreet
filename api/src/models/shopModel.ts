import mongoose, { Schema } from 'mongoose';
import { IShop } from 'interfaces/Shop';

const ShopSchema: Schema<IShop> = new Schema(
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IShop>('Shop', ShopSchema);

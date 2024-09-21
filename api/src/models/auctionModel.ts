import { Schema, model } from 'mongoose';

import { IAuction } from 'interfaces/Auction';
const AuctionSchema = new Schema<IAuction>(
  {
    itemName: {
      type: String,
      trim: true,
      required: [true, 'Item name is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    bidStart: {
      type: Date,
      default: Date.now,
    },
    bidEnd: {
      type: Date,
      required: [true, 'Auction end time is required'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startingBid: {
      type: Number,
      default: 0,
    },
    bids: [
      {
        bidder: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        bid: {
          type: Number,
          required: true,
        },
        time: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);
export const Auction = model<IAuction>('Auction', AuctionSchema);

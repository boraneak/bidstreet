import { Document, Types } from 'mongoose';

export interface IAuction extends Document {
  itemName: string;
  description?: string;
  image: {
    data: Buffer;
    contentType: string;
  };
  updated?: Date;
  created: Date;
  bidStart: Date;
  bidEnd: Date;
  seller: Types.ObjectId;
  startingBid: number;
  bids: {
    bidder: Types.ObjectId;
    bid: number;
    time: Date;
  }[];
}

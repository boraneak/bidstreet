import { Server } from 'socket.io';
import { Auction } from 'models/auctionModel';
import { IAuction } from 'interfaces/Auction';
import { IBidInfo } from 'interfaces/BidInfo';

export const handleNewBid = async (
  io: Server,
  data: { bidInfo: IBidInfo; room: string },
) => {
  try {
    const updatedAuction: IAuction | null = await Auction.findOneAndUpdate(
      {
        _id: data.room,
        $or: [
          { 'bids.0.bid': { $lt: data.bidInfo.bid } },
          { bids: { $eq: [] } },
        ],
      },
      { $push: { bids: { $each: [data.bidInfo], $position: 0 } } },
      { new: true },
    )
      .populate('bids.bidder', '_id name')
      .populate('seller', '_id name')
      .exec();

    if (updatedAuction) {
      io.to(data.room).emit('new bid', updatedAuction);
    } else {
      console.warn(`Auction not found or invalid bid for room: ${data.room}`);
    }
  } catch (error) {
    console.error('Error handling new bid:', error);
  }
};

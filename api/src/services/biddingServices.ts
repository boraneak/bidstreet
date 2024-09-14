import { Server } from "http";
import { Socket } from "socket.io";
import { Auction } from "../models/auctionModel";
import { IAuction } from "../../interfaces/Auction";

interface BidInfo {
  bidder: string;
  bid: number;
  timestamp: Date;
}

interface NewBidData {
  bidInfo: BidInfo;
  room: string;
}

export default (server: Server) => {
   
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const io = require("socket.io").listen(server);

  io.on("connection", (socket: Socket) => {
    socket.on("join auction room", (data: { room: string }) => {
      socket.join(data.room);
    });

    socket.on("leave auction room", (data: { room: string }) => {
      socket.leave(data.room);
    });

    socket.on("new bid", (data: NewBidData) => {
      bid(data.bidInfo, data.room);
    });
  });

  const bid = async (bidInfo: BidInfo, auction: string) => {
    try {
      const result: IAuction | null = (await Auction.findOneAndUpdate(
        {
          _id: auction,
          $or: [{ "bids.0.bid": { $lt: bidInfo.bid } }, { bids: { $eq: [] } }],
        },
        { $push: { bids: { $each: [bidInfo], $position: 0 } } },
        { new: true }
      )
        .populate("bids.bidder", "_id name")
        .populate("seller", "_id name")
        .exec()) as IAuction;

      io.to(auction).emit("new bid", result);
    } catch (err) {
      console.log(err);
    }
  };
};

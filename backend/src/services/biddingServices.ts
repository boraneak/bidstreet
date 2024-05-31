import { Server } from "http";
import { Socket } from "socket.io";
import { Auction } from "../models/auctionModel";
import { IAuction } from "../../interfaces/Auction";

export default (server: Server) => {
  const io = require("socket.io").listen(server);

  io.on("connection", (socket: Socket) => {
    socket.on("join auction room", (data: { room: string }) => {
      socket.join(data.room);
    });

    socket.on("leave auction room", (data: { room: string }) => {
      socket.leave(data.room);
    });

    socket.on("new bid", (data: { bidInfo: any; room: string }) => {
      bid(data.bidInfo, data.room);
    });
  });

  const bid = async (bid: any, auction: string) => {
    try {
      let result: IAuction | null = (await Auction.findOneAndUpdate(
        {
          _id: auction,
          $or: [{ "bids.0.bid": { $lt: bid.bid } }, { bids: { $eq: [] } }],
        },
        { $push: { bids: { $each: [bid], $position: 0 } } },
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

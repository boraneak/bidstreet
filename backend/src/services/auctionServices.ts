import { Request, Response } from "express";
import { isValidObjectId } from "../../utils/isValidObjectId";

import mongoose from "mongoose";
import fs from "fs";
import { IAuction } from "../../interfaces/Auction";
import { Auction } from "../models/auctionModel";
import path from "path";
const defaultImagePath = path.join(
  __dirname,
  "../../public/images/defaultAuctionImage.jpg"
);

export const createAuction = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, "user")) return;
    let imageData;
    if (req.file) {
      imageData = fs.readFileSync(req.file.path);
    }

    const auctionData = {
      ...req.body,
      seller: new mongoose.Types.ObjectId(userId),
      image: req.file
        ? {
            data: imageData,
            contentType: req.file.mimetype,
          }
        : null,
    };

    const auction = new Auction(auctionData);
    const result = await auction.save();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error creating auction:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getAuctionById = async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.auctionId;
    if (!isValidObjectId(auctionId, res, "auction")) return;
    const auction = await Auction.findById(auctionId)
      .populate("seller", "_id name")
      .populate("bids.bidder", "_id name")
      .exec();

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    return res.json(auction);
  } catch (error) {
    console.error("Error fetching auction:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAuctionBySeller = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, "user")) return;

    const auctions = await Auction.find({ seller: userId })
      .populate("seller", "_id name")
      .populate("bids.bidder", "_id name")
      .exec();

    if (auctions.length === 0) {
      return res
        .status(404)
        .json({ error: "No auctions found for this seller" });
    }

    return res.json(auctions);
  } catch (error) {
    console.error("Error fetching auctions by seller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAuctionPhoto = async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.auctionId;

    if (!isValidObjectId(auctionId, res, "auction")) return;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    if (auction.image && auction.image.data) {
      res.set("Content-Type", auction.image.contentType);
      return res.send(auction.image.data);
    } else {
      // TODO: handle error if there is no default image file
      return res.sendFile(defaultImagePath);
    }
  } catch (error) {
    console.error("Error fetching auction photo:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const updateAuctionById = async (req: Request, res: Response) => {
  try {
    const { auctionId } = req.params;
    if (!isValidObjectId(auctionId, res, "auction")) return;

    const updateAuctiondData: Partial<IAuction> = { ...req.body };

    if (req.file) {
      const imageData = fs.readFileSync(req.file.path);
      updateAuctiondData.image = {
        data: imageData,
        contentType: req.file.mimetype,
      };
    }
    const existingAuction = await Auction.findOne({
      _id: auctionId,
    }).exec();
    if (!existingAuction) {
      return res.status(404).json({ error: "auction not found" });
    }
    const auction = await Auction.findOneAndUpdate(
      { _id: auctionId },
      updateAuctiondData,
      { new: true, runValidators: true }
    ).exec();
    return res.status(200).json(auction);
  } catch (error) {
    console.error("Error fetching auction photo:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const deleteAuctionById = async (req: Request, res: Response) => {
  try {
    const { auctionId } = req.params;
    if (!isValidObjectId(auctionId, res, "auction")) return;

    const auction = await Auction.findOne({ _id: auctionId });
    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    await Auction.deleteOne({ _id: auctionId });
    return res.status(200).json({ message: "Auction deleted successfully" });
  } catch (error) {
    console.error("Error deleting auction:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getOpenAuctions = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const auctions = await Auction.find({ bidEnd: { $gt: new Date() } })
      .sort("bidStart")
      .populate("seller", "_id name")
      .populate("bids.bidder", "_id name");

    return res.json(auctions);
  } catch (error) {
    console.error("Error fetching open auctions:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getAllAuctions = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const auctions = await Auction.find({});
    return res.json(auctions);
  } catch (error) {
    console.error("Error fetching all auctions:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getAuctionByBidder = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, "user")) return;
    const auctions: IAuction[] | null = await Auction.find({
      "bids.bidder": userId,
    })
      .populate("seller", "_id name")
      .populate("bids.bidder", "_id name");
    return res.json(auctions);
  } catch (error) {
    console.error("Error fetching all auctions:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

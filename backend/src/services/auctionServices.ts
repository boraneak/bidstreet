import { getErrorMessage } from "../../utils/dbErrorHandler";
import { Request, Response } from "express";
import { IMongoError } from "../../interfaces/MongoError";
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
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
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
    if (!auction)
      return res.status(400).json({
        error: "auction not found",
      });
    res.json(auction);
  } catch (err) {
    return res.status(400).json({
      error: "could not retrieve auction",
    });
  }
};

export const getAuctionBySeller = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, "user")) return;
    const auctions = await Auction.find({ seller: userId })
      .populate("seller", "_id name")
      .populate("bids.bidder", "_id name");
    if (!auctions) {
      return res.status(400).json({
        error: "auctions not found",
      });
    }
    res.json(auctions);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getAuctionPhoto = async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.auctionId;
    console.log(auctionId);

    if (!isValidObjectId(auctionId, res, "auction")) return;
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ error: "auction not found" });
    }

    if (auction.image && auction.image.data) {
      res.set("Content-Type", auction.image.contentType);
      return res.send(auction.image.data);
    } else {
      // TODO: handle error if there is no default image file
      return res.sendFile(defaultImagePath);
    }
  } catch (error: any) {
    return res.status(400).json({
      error: "could not retrieve shop photo",
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
  } catch (error: any) {
    return res.status(400).json({ error: "error updating the auction" });
  }
};

export const deleteAuctionById = async (req: Request, res: Response) => {
  try {
    const { auctionId } = req.params;
    if (!isValidObjectId(auctionId, res, "auction")) return;
    const auction = await Auction.findOne({ _id: auctionId });
    if (!auction) {
      return res.status(404).json({ error: "auction not found" });
    }

    await Auction.deleteOne({ _id: auctionId });
    res.status(200).json({ message: "auction deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getOpenAuctions = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const auctions = await Auction.find({ bidEnd: { $gt: new Date() } })
      .sort("bidStart")
      .populate("seller", "_id name")
      .populate("bids.bidder", "_id name");

    return res.json(auctions);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getAllAuctions = async (req: Request, res: Response) => {
  try {
    const auctions = await Auction.find({});
    res.json(auctions);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
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
    res.json(auctions);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

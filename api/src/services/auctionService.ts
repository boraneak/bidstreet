import fs from 'fs';
import { Auction } from 'models/auctionModel';
import mongoose from 'mongoose';
import path from 'path';
import { IAuction } from 'interfaces/Auction';

const defaultImagePath = path.join(
  __dirname,
  'public/images/defaultAuctionImage.jpg',
);

export const createAuctionService = async (
  userId: string,
  body: any,
  file: Express.Multer.File | undefined,
) => {
  let imageData = null;
  if (file) {
    const safeRoot = path.resolve(__dirname, '../../uploads'); // Define the safe root directory
    const resolvedPath = path.resolve(file.path);
    if (resolvedPath.startsWith(safeRoot)) {
      imageData = fs.readFileSync(resolvedPath);
    } else {
      throw new Error('Invalid file path');
    }
  }
  const auctionData = {
    ...body,
    seller: new mongoose.Types.ObjectId(userId),
    image: file
      ? {
          data: imageData,
          contentType: file.mimetype,
        }
      : null,
  };
  const auction = new Auction(auctionData);
  return auction.save();
};

export const getAuctionByIdService = async (auctionId: string) => {
  return Auction.findById(auctionId)
    .populate('seller', '_id name')
    .populate('bids.bidder', '_id name')
    .exec();
};

export const getAuctionsBySellerService = async (userId: string) => {
  return Auction.find({ seller: userId })
    .populate('seller', '_id name')
    .populate('bids.bidder', '_id name')
    .exec();
};

export const getAuctionPhotoService = async (auctionId: string) => {
  const auction = await Auction.findById(auctionId);
  if (!auction) {
    return null;
  }
  if (auction.image && auction.image.data) {
    return { data: auction.image.data, contentType: auction.image.contentType };
  } else {
    return { path: defaultImagePath };
  }
};

export const updateAuctionByIdService = async (
  auctionId: string,
  body: Partial<IAuction>,
  file: Express.Multer.File | undefined,
) => {
  const updateAuctionData: Partial<IAuction> = { ...body };

  if (file) {
    let imageData = null;
    const safeRoot = path.resolve(__dirname, '../../uploads'); // Define the safe root directory
    const resolvedPath = path.resolve(file.path);
    if (resolvedPath.startsWith(safeRoot)) {
      imageData = fs.readFileSync(resolvedPath);
    } else {
      throw new Error('Invalid file path');
    }
    updateAuctionData.image = {
      data: imageData,
      contentType: file.mimetype,
    };
  }

  const existingAuction = await Auction.findOne({ _id: auctionId }).exec();
  if (!existingAuction) {
    return null;
  }

  return Auction.findOneAndUpdate({ _id: auctionId }, updateAuctionData, {
    new: true,
    runValidators: true,
  }).exec();
};

export const deleteAuctionByIdService = async (auctionId: string) => {
  const auction = await Auction.findOne({ _id: auctionId });
  if (!auction) {
    return null;
  }
  return Auction.deleteOne({ _id: auctionId });
};

export const getOpenAuctionsService = async () => {
  return Auction.find({ bidEnd: { $gt: new Date() } })
    .sort('bidStart')
    .populate('seller', '_id name')
    .populate('bids.bidder', '_id name')
    .exec();
};

export const getAllAuctionsService = async () => {
  return Auction.find({}).exec();
};

export const getAuctionsByBidderService = async (userId: string) => {
  return Auction.find({ 'bids.bidder': userId })
    .populate('seller', '_id name')
    .populate('bids.bidder', '_id name')
    .exec();
};

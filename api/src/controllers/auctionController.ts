import { Request, Response } from 'express';
import services from 'services/index';
import { isValidObjectId } from 'utils/isValidObjectId';
import { handleError } from 'utils/errorHandler';

export const createAuction = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId, res, 'user')) return;

    const result = await services.auction.createAuctionService(
      userId,
      req.body,
      req.file,
    );
    return res.status(201).json(result);
  } catch (error) {
    return handleError(res, error, 'Error creating auction:');
  }
};

export const getAuctionById = async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.auctionId;
    if (!isValidObjectId(auctionId, res, 'auction')) return;

    const auction = await services.auction.getAuctionByIdService(auctionId);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    return res.status(200).json(auction);
  } catch (error) {
    return handleError(res, error, 'Error fetching auction:');
  }
};

export const getAuctionsBySeller = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;

    const auctions = await services.auction.getAuctionsBySellerService(userId);
    if (auctions.length === 0) {
      return res
        .status(404)
        .json({ error: 'No auctions found for this seller' });
    }
    return res.status(200).json(auctions);
  } catch (error) {
    return handleError(res, error, 'Error fetching auctions by seller:');
  }
};

export const getAuctionPhoto = async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.auctionId;
    if (!isValidObjectId(auctionId, res, 'auction')) return;

    const photo = await services.auction.getAuctionPhotoService(auctionId);
    if (!photo) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    if (photo.path) {
      return res.status(200).sendFile(photo.path);
    } else {
      res.set('Content-Type', photo.contentType);
      return res.status(200).send(photo.data);
    }
  } catch (error) {
    return handleError(res, error, 'Error fetching auction photo:');
  }
};

export const updateAuctionById = async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.auctionId;
    if (!isValidObjectId(auctionId, res, 'auction')) return;

    const updatedAuction = await services.auction.updateAuctionByIdService(
      auctionId,
      req.body,
      req.file,
    );
    if (!updatedAuction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    return res.status(200).json(updatedAuction);
  } catch (error) {
    return handleError(res, error, 'Error updating auction:');
  }
};

export const deleteAuctionById = async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.auctionId;
    if (!isValidObjectId(auctionId, res, 'auction')) return;

    const result = await services.auction.deleteAuctionByIdService(auctionId);
    if (!result) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    return res.status(200).json({ message: 'Auction deleted successfully' });
  } catch (error) {
    return handleError(res, error, 'Error deleting auction:');
  }
};

export const getOpenAuctions = async (_req: Request, res: Response) => {
  try {
    const openAuctions = await services.auction.getOpenAuctionsService();
    return res.status(200).json(openAuctions);
  } catch (error) {
    return handleError(res, error, 'Error fetching open auctions:');
  }
};

export const getAllAuctions = async (_req: Request, res: Response) => {
  try {
    const auctions = await services.auction.getAllAuctionsService();
    return res.status(200).json(auctions);
  } catch (error) {
    return handleError(res, error, 'Error fetching all auctions:');
  }
};

export const getAuctionsByBidder = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;

    const auctions = await services.auction.getAuctionsByBidderService(userId);
    return res.status(200).json(auctions);
  } catch (error) {
    return handleError(res, error, 'Error fetching auctions by bidder:');
  }
};

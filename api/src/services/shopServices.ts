import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Shop from 'models/shopModel';
import fs from 'fs';
import { IShop } from 'interfaces/Shop';
import { IAuthRequest } from 'interfaces/requests/AuthRequest';
import path from 'path';
import { isValidObjectId } from 'utils/isValidObjectId';
import { handleError } from 'utils/errorHandler';

const defaultImagePath = path.join(
  __dirname,
  'public/images/defaultShopImage.jpg',
);

export const createShop = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: 'User information is missing' });
    }

    let imageData;
    if (req.file) {
      imageData = fs.readFileSync(req.file.path);
    }

    const shopData: IShop = {
      ...req.body,
      owner: new mongoose.Types.ObjectId(req.user._id),
      image: req.file
        ? {
            data: imageData,
            contentType: req.file.mimetype,
          }
        : null,
    };

    const shop = new Shop(shopData);
    const result = await shop.save();
    return res.status(201).json(result);
  } catch (error) {
    return handleError(res, error, 'Error creating shop');
  }
};

export const getShopById = async (req: IAuthRequest, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, 'shop')) return;

    const shop = await Shop.findById(shopId)
      .populate('owner', '_id name')
      .exec();

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    return res.status(200).json(shop);
  } catch (error) {
    return handleError(res, error, 'Error retrieving shop by ID');
  }
};

export const getShopPhoto = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, 'shop')) return;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shop.image && shop.image.data) {
      res.set('Content-Type', shop.image.contentType);
      return res.status(200).send(shop.image.data);
    } else {
      return res.status(200).sendFile(defaultImagePath);
    }
  } catch (error) {
    return handleError(res, error, 'Error retrieving shop photo');
  }
};

export const updateShopById = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, 'shop')) return;

    const shop = await Shop.findOne({ _id: shopId });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Update image data if a new file is uploaded
    if (req.file) {
      const imageData = fs.readFileSync(req.file.path);
      shop.image = {
        data: imageData,
        contentType: req.file.mimetype,
      };
    }

    shop.set({
      ...req.body,
    });

    const result = await shop.save();
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error, 'Error updating shop by ID');
  }
};

export const deleteShopById = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, 'shop')) return;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const deletedShop = await shop.deleteOne({ _id: shopId });
    return res.status(200).json(deletedShop);
  } catch (error) {
    return handleError(res, error, 'Error deleting shop by ID');
  }
};

export const getAllShops = async (_req: Request, res: Response) => {
  try {
    const shops = await Shop.find();
    return res.status(200).json(shops);
  } catch (error) {
    return handleError(res, error, 'Error retrieving all shops');
  }
};

export const getShopByOwner = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;

    const shops = await Shop.find({ owner: userId })
      .populate('owner', '_id name')
      .exec();

    return res.status(200).json(shops);
  } catch (error) {
    return handleError(res, error, 'Error retrieving shops by owner');
  }
};

export const isShopOwner = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    if (!isValidObjectId(userId as string, res, 'user')) return;
    const shop = await Shop.findOne({ owner: userId });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (!shop.owner.equals(userId)) {
      return res
        .status(403)
        .json({ error: 'Unauthorized - User is not the owner of the shop' });
    }

    return next();
  } catch (error) {
    return handleError(res, error, 'Error verifying shop ownership');
  }
};

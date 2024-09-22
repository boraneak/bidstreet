import { NextFunction, Request, Response } from 'express';
import { handleError } from 'utils/errorHandler';
import services from 'services/index';

import { isValidObjectId } from 'utils/isValidObjectId';
import { IAuthRequest } from 'interfaces/requests/AuthRequest';

export const createShop = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: 'User information is missing' });
    }

    const result = await services.shop.createShopService(
      req.user._id,
      req.body,
      req.file,
    );
    return res.status(201).json(result);
  } catch (error) {
    return handleError(res, error, 'Error creating shop');
  }
};

export const getShopById = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, 'shop')) return;

    const shop = await services.shop.getShopByIdService(shopId);
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

    const photo = await services.shop.getShopPhotoService(shopId);

    if (typeof photo === 'string') {
      return res.status(200).sendFile(photo);
    }

    res.set('Content-Type', photo.contentType);
    return res.status(200).send(photo.imageData);
  } catch (error) {
    return handleError(res, error, 'Error retrieving shop photo');
  }
};

export const updateShopById = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, 'shop')) return;

    const updatedShop = await services.shop.updateShopByIdService(
      shopId,
      req.body,
      req.file,
    );
    if (!updatedShop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    return res.status(200).json(updatedShop);
  } catch (error) {
    return handleError(res, error, 'Error updating shop by ID');
  }
};

export const deleteShopById = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, 'shop')) return;

    const deletedShop = await services.shop.deleteShopByIdService(shopId);
    if (!deletedShop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    return res.status(200).json(deletedShop);
  } catch (error) {
    return handleError(res, error, 'Error deleting shop by ID');
  }
};

export const getAllShops = async (_req: Request, res: Response) => {
  try {
    const shops = await services.shop.getAllShopsService();
    return res.status(200).json(shops);
  } catch (error) {
    return handleError(res, error, 'Error retrieving all shops');
  }
};

export const getShopByOwner = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;

    const shops = await services.shop.getShopByOwnerService(userId);
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

    const shop = await services.shop.isShopOwnerService(userId as string);
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

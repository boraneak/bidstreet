import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import Shop from "../models/shopModel";
import { getErrorMessage } from "../../utils/dbErrorHandler";
import { IMongoError } from "../../interfaces/MongoError";
import fs from "fs";
import { IShop } from "../../interfaces/Shop";
import { IAuthRequest } from "../../interfaces/AuthRequest";
import path from "path";
const defaultImagePath = path.join(
  __dirname,
  "../../public/images/defaultShopImage.jpg"
);

export const createShop = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "User information is missing" });
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
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getShopById = async (req: IAuthRequest, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const shop = await Shop.findById(shopId)
      .populate("owner", "_id name")
      .exec();
    if (!shop) {
      return res.status(400).json({
        error: "Shop not found",
      });
    }
    res.json(shop);
  } catch (error) {
    return res.status(400).json({
      message: "Could not retrieve shop",
      error: error,
    });
  }
};

export const getShopPhoto = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ error: "Invalid shop ID format" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    if (shop.image && shop.image.data) {
      res.set("Content-Type", shop.image.contentType);
      return res.send(shop.image.data);
    } else {
      return res.sendFile(defaultImagePath);
    }
  } catch (error: any) {
    return res.status(400).json({
      error: "Could not retrieve shop photo",
    });
  }
};

export const updateShopById = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;
    const shop = await Shop.findOne({ _id: shopId});

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
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
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: "An error occurred while updating the shop" });
  }
};

export const deleteShopById = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ error: "Invalid shop ID format" });
    }

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const deletedShop = await shop.deleteOne({ _id: shopId });
    res.json(deletedShop);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getAllShops = async (req: Request, res: Response) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getShopByOwner = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const shops = await Shop.find({ owner: userId })
      .populate("owner", "_id name")
      .exec();
    res.json(shops);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const isShopOwner = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const shop = await Shop.findOne({ owner: userId });
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }
    if (!shop.owner.equals(userId)) {
      return res
        .status(403)
        .json({ error: "Unauthorized - User is not the owner of the shop" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

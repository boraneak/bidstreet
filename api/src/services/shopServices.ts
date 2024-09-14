import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import Shop from "../models/shopModel";
import fs from "fs";
import { IShop } from "../../interfaces/Shop";
import { IAuthRequest } from "../../interfaces/requests/AuthRequest";
import path from "path";
import { isValidObjectId } from "../../utils/isValidObjectId";
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
    console.error("Error creating shop:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getShopById = async (req: IAuthRequest, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, "shop")) return;

    const shop = await Shop.findById(shopId)
      .populate("owner", "_id name")
      .exec();

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    return res.status(200).json(shop);
  } catch (error) {
    console.error("Error retrieving shop by ID:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getShopPhoto = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, "shop")) return;

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
  } catch (error) {
    console.error("Error retrieving shop photo:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateShopById = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, "shop")) return;

    const shop = await Shop.findOne({ _id: shopId });

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
  } catch (error) {
    console.error("Error updating shop by ID:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteShopById = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, "shop")) return;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const deletedShop = await shop.deleteOne({ _id: shopId });
    return res.json(deletedShop);
  } catch (error) {
    console.error("Error deleting shop by ID:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllShops = async (_req: Request, res: Response) => {
  try {
    const shops = await Shop.find();
    return res.json(shops);
  } catch (error) {
    console.error("Error retrieving all shops:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getShopByOwner = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, "user")) return;

    const shops = await Shop.find({ owner: userId })
      .populate("owner", "_id name")
      .exec();

    return res.json(shops);
  } catch (error) {
    console.error("Error retrieving shops by owner:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const isShopOwner = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!isValidObjectId(userId as string, res, "user")) return;
    const shop = await Shop.findOne({ owner: userId });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    if (!shop.owner.equals(userId)) {
      return res
        .status(403)
        .json({ error: "Unauthorized - User is not the owner of the shop" });
    }

    return next();
  } catch (error) {
    console.error("Error verifying shop ownership:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

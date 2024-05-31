import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";

// import Shop from "../models/shopModel";
import { getErrorMessage } from "../../utils/dbErrorHandler";
import { IMongoError } from "../../interfaces/MongoError";
import fs from "fs";
import { IProduct } from "../../interfaces/Product";
import { IProductRequest } from "../../interfaces/ProductRequest";
import { IAuthRequest } from "../../interfaces/AuthRequest";
import { ISearchRequest } from "../../interfaces/SearchRequest";
import { Product } from "../models/productModel";
import path from "path";
import { isValidObjectId } from "../../utils/isValidObjectId";
const defaultImagePath = path.join(
  __dirname,
  "../../public/images/defaultProductImage.jpg"
);

export const createProduct = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;
    if (!isValidObjectId(shopId, res, "shop")) return;
    let imageData;
    if (req.file) {
      imageData = fs.readFileSync(req.file.path);
    }

    const productData = {
      ...req.body,
      shop: new mongoose.Types.ObjectId(shopId),
      image: req.file
        ? {
            data: imageData,
            contentType: req.file.mimetype,
          }
        : null,
    };

    const product = new Product(productData);
    const result = await product.save();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getProductById = async (req: IAuthRequest, res: Response) => {
  try {
    const productId = req.params.productId;
    if (!isValidObjectId(productId, res, "product")) return;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        error: "product not found",
      });
    }
    res.json(product);
  } catch (error) {
    return res.status(400).json({
      message: "could not retrieve product",
      error: error,
    });
  }
};

export const getProductPhoto = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    if (!isValidObjectId(productId, res, "product")) return;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    if (product.image && product.image.data) {
      res.set("Content-Type", product.image.contentType);
      return res.send(product.image.data);
    } else {
      return res.sendFile(defaultImagePath);
    }
  } catch (error: any) {
    return res.status(400).json({
      error: "could not retrieve shop photo",
    });
  }
};

export const updateProductById = async (req: Request, res: Response) => {
  try {
    const { shopId, productId } = req.params;
    if (!isValidObjectId(shopId, res, "shop")) return;
    if (!isValidObjectId(productId, res, "product")) return;

    const updatedData: Partial<IProduct> = { ...req.body };

    if (req.file) {
      const imageData = fs.readFileSync(req.file.path);
      updatedData.image = {
        data: imageData,
        contentType: req.file.mimetype,
      };
    }
    const existingProduct = await Product.findOne({
      _id: productId,
      shop: shopId,
    }).exec();
    if (!existingProduct) {
      return res.status(404).json({ error: "product not found" });
    }
    const product = await Product.findOneAndUpdate(
      { _id: productId, shop: shopId },
      updatedData,
      { new: true, runValidators: true }
    ).exec();
    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(400).json({ error: "error updating the product" });
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const { shopId, productId } = req.params;
    if (!isValidObjectId(shopId, res, "shop")) return;
    if (!isValidObjectId(productId, res, "product")) return;
    const product = await Product.findOne({ _id: productId, shop: shopId });
    if (!product) {
      return res
        .status(404)
        .json({ error: "product not found in the specified shop" });
    }

    await Product.deleteOne({ _id: productId, shop: shopId });
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getFilteredProducts = async (
  req: ISearchRequest,
  res: Response
) => {
  try {
    const query: {
      name?: { $regex: string; $options: string };
      category?: string;
    } = {};
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.category && req.query.category !== "all") {
      query.category = req.query.category;
    }
    const products = await Product.find(query)
      .populate("shop", "_id name")
      .select("-image")
      .exec();
    res.json(products);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getProductByShop = async (req: IAuthRequest, res: Response) => {
  try {
    const shopId = req.params.shopId;
    if (!isValidObjectId(shopId, res, "shop")) return;
    const products = await Product.find({ shop: shopId })
      .populate("shop", "_id name")
      .select("-image")
      .exec();
    res.json(products);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getLatestProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({})
      .sort({ created: -1 })
      .limit(5)
      .populate("shop", "_id name")
      .exec();
    res.json(products);
  } catch (err: any) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};
export const getRelatedProducts = async (
  req: IProductRequest,
  res: Response
) => {
  try {
    const productId = req.params.productId;
    if (!isValidObjectId(productId, res, "product")) return;

    // fetch the current product to get its shop & category
    const currentProduct: IProduct | null = await Product.findById(
      productId
    ).exec();
    if (!currentProduct) {
      throw new Error("product not found");
    }
    const currentShopId: Types.ObjectId | undefined = currentProduct?.shop;
    const currentCategory: string | undefined = currentProduct?.category;

    const query: {
      _id: { $ne: Types.ObjectId | string };
      shop: Types.ObjectId | undefined;
      category?: string;
    } = {
      _id: { $ne: productId },
      shop: currentShopId,
    } as {
      _id: { $ne: Types.ObjectId | string };
      shop: Types.ObjectId | undefined;
      category?: string;
    };
    if (currentCategory) {
      query.category = currentCategory;
    }
    const relatedProducts = await Product.find(query)
      .limit(5)
      .populate("shop", "_id name")
      .exec();
    res.json(relatedProducts);
  } catch (err: any) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

export const getProductCategories = async (req: Request, res: Response) => {
  try {
    const productCategories = await Product.distinct("category", {});
    res.json(productCategories);
  } catch (err: any) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

export const increaseProductQuantity = async (
  req: IProductRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.productId;
    if (!isValidObjectId(productId, res, "product")) return;
    const quantity = req.body.quantity;
    // if (quantity == null) {
    //   return res.status(400).json({error: "quantity is requried"});
    // }
    // if (typeof quantity !=='number') {
    //   return res.status(400).json({error: "quantity must be a number"});
    // }
    // if (quantity <= 0) {
    //   return res.status(400).json({error: "quantity must be a positive number"});

    // }
    await Product.findByIdAndUpdate(
      req.product?._id,
      { $inc: { quantity: quantity } },
      { new: true }
    ).exec();
    next();
  } catch (err: any) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

// export const decreaseProductQuantity = async (req: Request, res: Response, next: NextFunction) => {};

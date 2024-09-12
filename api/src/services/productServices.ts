import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";

import fs from "fs";
import { IProduct } from "../../interfaces/Product";
import { IProductRequest } from "../../interfaces/ProductRequest";
import { IAuthRequest } from "../../interfaces/AuthRequest";
import { ISearchRequest } from "../../interfaces/SearchRequest";
import { Product } from "../models/productModel";
import path from "path";
import { isValidObjectId } from "../../utils/isValidObjectId";
import escapeStringRegexp from "escape-string-regexp";

const defaultImagePath = path.join(
  __dirname,
  "../../public/images/defaultProductImage.jpg"
);

export const createProduct = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!mongoose.Types.ObjectId.isValid(shopId)) return;

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
    console.error("Error creating product:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getProductById = async (req: IAuthRequest, res: Response) => {
  try {
    const productId = req.params.productId;

    if (!isValidObjectId(productId, res, "product")) return;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getProductPhoto = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    if (!isValidObjectId(productId, res, "product")) return;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.image && product.image.data) {
      res.set("Content-Type", product.image.contentType);
      return res.send(product.image.data);
    } else {
      return res.sendFile(defaultImagePath);
    }
  } catch (error) {
    console.error("Error retrieving product photo:", error);
    return res.status(500).json({
      error: "Internal Server Error",
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
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, shop: shopId },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
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
        .json({ error: "Product not found in the specified shop" });
    }

    await Product.deleteOne({ _id: productId, shop: shopId });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({
        error: "No products found",
      });
    }

    return res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getFilteredProducts = async (
  req: ISearchRequest,
  res: Response
) => {
  try {
    const query: {
      name?: RegExp;
      category?: string;
    } = {};

    if (req.query.productName) {
      const sanitizedName = escapeStringRegexp(req.query.productName);
      query.name = new RegExp(sanitizedName, "i");
    }
    
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (Object.keys(query).length === 0) {
      return res.json([]);
    } else {
      const products = await Product.find(query)
        .populate("shop", "_id name")
        .exec();
      return res.json(products);
    }
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return res.status(400).json({
      error: "Internal Server Error",
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

    return res.json(products);
  } catch (error) {
    console.error("Error fetching products by shop:", error);
    return res.status(400).json({
      error: "Internal Server Error",
    });
  }
};

export const getLatestProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({})
      .sort({ created: -1 })
      .limit(5)
      .populate("shop", "_id name")
      .exec();

    return res.json(products);
  } catch (error) {
    console.error("Error fetching latest products:", error);
    return res.status(500).json({
      error: "Internal Server Error",
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
    const currentProduct: IProduct | null = await Product.findById(
      productId
    ).exec();
    if (!currentProduct) {
      throw new Error("product not found");
    }
    const currentShopId: Types.ObjectId | undefined = currentProduct.shop;
    const currentCategory: string | undefined = currentProduct.category;

    const query: {
      _id: { $ne: Types.ObjectId | string };
      shop: Types.ObjectId | undefined;
      category?: string;
    } = {
      _id: { $ne: productId },
      shop: currentShopId,
    };

    if (currentCategory) {
      query.category = currentCategory;
    }

    const relatedProducts = await Product.find(query)
      .limit(5)
      .populate("shop", "_id name")
      .exec();

    return res.json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getProductCategories = async (_req: Request, res: Response) => {
  try {
    const productCategories = await Product.distinct("category", {});
    return res.json(productCategories);
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return res.status(500).json({
      error: "Internal Server Error",
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
    if (quantity == null || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ error: "Invalid quantity value" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.product?._id,
      { $inc: { quantity: quantity } },
      { new: true }
    ).exec();

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    next();
  } catch (error) {
    console.error("Error increasing product quantity:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  // If next() is not called due to an error
  return res.status(500).json({ error: "Internal Server Error" });
};

import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import fs from 'fs';
import { IProduct } from 'interfaces/Product';
import { IProductRequest } from 'interfaces/requests/ProductRequest';
import { IAuthRequest } from 'interfaces/requests/AuthRequest';
import { ISearchRequest } from 'interfaces/requests/SearchRequest';
import { Product } from 'models/productModel';
import path from 'path';
import { isValidObjectId } from 'utils/isValidObjectId';
import escapeStringRegexp from 'escape-string-regexp';
import { handleError } from 'utils/errorHandler';

const defaultImagePath = path.join(
  __dirname,
  'public/images/defaultProductImage.jpg',
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
    return res.status(201).json(result);
  } catch (error) {
    return handleError(res, error, 'Error creating product');
  }
};

export const getProductById = async (req: IAuthRequest, res: Response) => {
  try {
    const productId = req.params.productId;

    if (!isValidObjectId(productId, res, 'product')) return;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return handleError(res, error, 'Error retrieving product');
  }
};

export const getProductPhoto = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    if (!isValidObjectId(productId, res, 'product')) return;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.image && product.image.data) {
      res.set('Content-Type', product.image.contentType);
      return res.send(product.image.data);
    } else {
      return res.sendFile(defaultImagePath);
    }
  } catch (error) {
    return handleError(res, error, 'Error retrieving product photo');
  }
};

export const updateProductById = async (req: Request, res: Response) => {
  try {
    const { shopId, productId } = req.params;
    if (!isValidObjectId(shopId, res, 'shop')) return;
    if (!isValidObjectId(productId, res, 'product')) return;

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
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, shop: shopId },
      updatedData,
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return handleError(res, error, 'Error updating product');
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const { shopId, productId } = req.params;
    if (!isValidObjectId(shopId, res, 'shop')) return;
    if (!isValidObjectId(productId, res, 'product')) return;

    const product = await Product.findOne({ _id: productId, shop: shopId });

    if (!product) {
      return res
        .status(404)
        .json({ error: 'Product not found in the specified shop' });
    }

    await Product.deleteOne({ _id: productId, shop: shopId });

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return handleError(res, error, 'Error deleting product');
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }

    return res.status(200).json(products);
  } catch (error) {
    return handleError(res, error, 'Error fetching products');
  }
};

export const getFilteredProducts = async (
  req: ISearchRequest,
  res: Response,
) => {
  try {
    const query: {
      name?: RegExp;
      category?: string;
    } = {};

    if (req.query.productName) {
      const sanitizedName = escapeStringRegexp(req.query.productName);
      query.name = new RegExp(sanitizedName, 'i');
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (Object.keys(query).length === 0) {
      return res.json([]);
    } else {
      const products = await Product.find(query)
        .populate('shop', '_id name')
        .exec();
      return res.status(200).json(products);
    }
  } catch (error) {
    return handleError(res, error, 'Error fetching filtered products');
  }
};

export const getProductByShop = async (req: IAuthRequest, res: Response) => {
  try {
    const shopId = req.params.shopId;
    if (!isValidObjectId(shopId, res, 'shop')) return;

    const products = await Product.find({ shop: shopId })
      .populate('shop', '_id name')
      .select('-image')
      .exec();

    return res.status(200).json(products);
  } catch (error) {
    return handleError(res, error, 'Error fetching products by shop');
  }
};

export const getLatestProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({})
      .sort({ created: -1 })
      .limit(5)
      .populate('shop', '_id name')
      .exec();

    return res.status(200).json(products);
  } catch (error) {
    return handleError(res, error, 'Error fetching latest products');
  }
};

export const getRelatedProducts = async (
  req: IProductRequest,
  res: Response,
) => {
  try {
    const productId = req.params.productId;
    if (!isValidObjectId(productId, res, 'product')) return;

    const currentProduct: IProduct | null =
      await Product.findById(productId).exec();
    if (!currentProduct) {
      throw new Error('Product not found');
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
      .populate('shop', '_id name')
      .exec();

    return res.status(200).json(relatedProducts);
  } catch (error) {
    return handleError(res, error, 'Error fetching related products');
  }
};

export const getProductCategories = async (_req: Request, res: Response) => {
  try {
    const productCategories = await Product.distinct('category', {});
    return res.status(200).json(productCategories);
  } catch (error) {
    return handleError(res, error, 'Error fetching product categories');
  }
};

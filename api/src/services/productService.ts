import mongoose, { Types } from 'mongoose';
import fs from 'fs';
import path from 'path';
import { IProduct } from 'interfaces/Product';
import { Product } from 'models/productModel';
import escapeStringRegexp from 'escape-string-regexp';

const defaultImagePath = path.join(
  __dirname,
  'public/images/defaultProductImage.jpg',
);

export const createProductService = async (
  productData: Partial<IProduct>,
  shopId: string,
  file: Express.Multer.File | undefined,
) => {
  let imageData;
  if (file) {
    const safeUploadDir = path.resolve(__dirname, '../../uploads');
    const resolvedPath = path.resolve(file.path);
    if (!resolvedPath.startsWith(safeUploadDir)) {
      throw new Error('Invalid file path');
    }
    imageData = fs.readFileSync(resolvedPath);
  }

  const newProduct = new Product({
    ...productData,
    shop: new mongoose.Types.ObjectId(shopId),
    image: file
      ? {
          data: imageData,
          contentType: file.mimetype,
        }
      : null,
  });

  return await newProduct.save();
};

export const getProductByIdService = async (productId: string) => {
  return await Product.findById(productId);
};

export const getProductPhotoService = async (productId: string) => {
  const product = await Product.findById(productId);
  if (product?.image?.data) {
    return { data: product.image.data, contentType: product.image.contentType };
  }
  return fs.readFileSync(defaultImagePath);
};

export const updateProductByIdService = async (
  productId: string,
  shopId: string,
  updatedData: Partial<IProduct>,
  file: Express.Multer.File | undefined,
) => {
  if (file) {
    const safeRoot = path.resolve(__dirname, '../../uploads'); // Define the safe root directory
    const filePath = path.resolve(safeRoot, file.path);
    const resolvedPath = fs.realpathSync(filePath);
    if (!resolvedPath.startsWith(safeRoot)) {
      throw new Error('Invalid file path');
    }
    const imageData = fs.readFileSync(resolvedPath);
    updatedData.image = {
      data: imageData,
      contentType: file.mimetype,
    };
  }

  return await Product.findOneAndUpdate(
    { _id: productId, shop: shopId },
    updatedData,
    { new: true, runValidators: true },
  );
};

export const deleteProductByIdService = async (
  productId: string,
  shopId: string,
) => {
  return await Product.deleteOne({ _id: productId, shop: shopId });
};

export const getAllProductsService = async () => {
  return await Product.find();
};

export const getFilteredProductsService = async (queryParams: any) => {
  const query: {
    name?: RegExp;
    category?: string;
  } = {};

  if (queryParams.productName) {
    const sanitizedName = escapeStringRegexp(queryParams.productName);
    query.name = new RegExp(sanitizedName, 'i');
  }

  if (queryParams.category) {
    query.category = { $eq: queryParams.category };
  }

  return await Product.find(query).populate('shop', '_id name').exec();
};

export const getProductByShopService = async (shopId: string) => {
  return await Product.find({ shop: shopId })
    .populate('shop', '_id name')
    .select('-image')
    .exec();
};

export const getLatestProductsService = async () => {
  return await Product.find({})
    .sort({ created: -1 })
    .limit(5)
    .populate('shop', '_id name')
    .exec();
};

export const getRelatedProductsService = async (productId: string) => {
  const currentProduct = await Product.findById(productId);
  if (!currentProduct) throw new Error('Product not found');

  const currentShopId = currentProduct.shop;
  const currentCategory = currentProduct.category;

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

  return await Product.find(query).limit(5).populate('shop', '_id name').exec();
};

export const getProductCategoriesService = async () => {
  return await Product.distinct('category', {});
};

import { Request, Response } from 'express';
import { handleError } from 'utils/errorHandler';
import services from 'services/index';
import { isValidObjectId } from 'utils/isValidObjectId';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, 'shop')) return;

    const result = await services.product.createProductService(
      req.body,
      shopId,
      req.file,
    );
    return res.status(201).json(result);
  } catch (error) {
    return handleError(res, error, 'Error creating product');
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    if (!isValidObjectId(productId, res, 'product')) return;

    const product = await services.product.getProductByIdService(productId);
    return res.status(200).json(product);
  } catch (error) {
    return handleError(res, error, 'Error retrieving product');
  }
};

export const getProductPhoto = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const photo = await services.product.getProductPhotoService(productId);
    return photo
      ? res.send(photo)
      : res.status(404).send('Product photo not found');
  } catch (error) {
    return handleError(res, error, 'Error retrieving product photo');
  }
};

export const updateProductById = async (req: Request, res: Response) => {
  try {
    const { shopId, productId } = req.params;

    if (!isValidObjectId(shopId, res, 'shop')) return;
    if (!isValidObjectId(productId, res, 'product')) return;

    const updatedProduct = await services.product.updateProductByIdService(
      productId,
      shopId,
      req.body,
      req.file,
    );
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return handleError(res, error, 'Error updating product');
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const { shopId, productId } = req.params;

    if (!isValidObjectId(shopId, res, 'shop')) return;
    if (!isValidObjectId(productId, res, 'product')) return;

    await services.product.deleteProductByIdService(productId, shopId);
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return handleError(res, error, 'Error deleting product');
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await services.product.getAllProductsService();
    return res.status(200).json(products);
  } catch (error) {
    return handleError(res, error, 'Error fetching products');
  }
};

export const getFilteredProducts = async (req: Request, res: Response) => {
  try {
    const products = await services.product.getFilteredProductsService(
      req.query,
    );
    return res.status(200).json(products);
  } catch (error) {
    return handleError(res, error, 'Error fetching filtered products');
  }
};

export const getProductByShop = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;

    if (!isValidObjectId(shopId, res, 'shop')) return;

    const products = await services.product.getProductByShopService(shopId);
    return res.status(200).json(products);
  } catch (error) {
    return handleError(res, error, 'Error fetching products by shop');
  }
};

export const getLatestProducts = async (_req: Request, res: Response) => {
  try {
    const products = await services.product.getLatestProductsService();
    return res.status(200).json(products);
  } catch (error) {
    return handleError(res, error, 'Error fetching latest products');
  }
};

export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    if (!isValidObjectId(productId, res, 'product')) return;

    const relatedProducts =
      await services.product.getRelatedProductsService(productId);
    return res.status(200).json(relatedProducts);
  } catch (error) {
    return handleError(res, error, 'Error fetching related products');
  }
};

export const getProductCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await services.product.getProductCategoriesService();
    return res.status(200).json(categories);
  } catch (error) {
    return handleError(res, error, 'Error fetching product categories');
  }
};

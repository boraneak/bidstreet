import axios from 'axios';
import queryString from 'query-string';
import { ProductCategories } from '../types/ProductCategories';
import { AuthCredentials } from '../types/AuthCredentials';
import { ShopProductParams } from '../types/ShopProductParams';
import { Product } from '../types/Product';
import { ProductSearchParams } from '../types/ProductSearchParams';

/**
 * Creates a new product for a specific shop.
 *
 * @param params - The parameters containing the shop ID and product ID.
 * @param credentials - The authentication credentials for the API request.
 * @param product - The product details to be created.
 * @returns A promise that resolves to an array of created product data.
 * @throws An error if the request fails.
 */
export const createProduct = async (
  params: ShopProductParams,
  credentials: AuthCredentials,
  product: Product,
): Promise<Product[]> => {
  try {
    const response = await axios.post<Product[]>(
      `${process.env.REACT_APP_API_BASE_URL}/products/create/by/${params.shopId}`,
      product,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${credentials.token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Fetches a product by its ID.
 *
 * @param params - The parameters containing the shop ID and product ID.
 * @param signal - An optional AbortSignal to allow request cancellation.
 * @returns The product data.
 * @throws An error if the request fails.
 */

export const fetchProductById = async (
  params: ShopProductParams,
  signal?: AbortSignal | undefined,
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `${process.env.REACT_APP_API_BASE_URL}/products/list/${params.productId}`,
      {
        signal: signal,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Updates an existing product for a specific shop.
 *
 * @param params - The parameters containing the shop ID and product ID.
 * @param credentials - The credentials containing the authentication token.
 * @param product - The updated product details.
 * @returns The updated product data.
 * @throws Will throw an error if the request fails.
 */

export const updateProduct = async (
  params: ShopProductParams,
  credentials: AuthCredentials,
  product: Product,
): Promise<Product[]> => {
  try {
    const response = await axios.put<Product[]>(
      `${process.env.REACT_APP_API_BASE_URL}/products/update/${params.shopId}/${params.productId}`,
      product,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${credentials.token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Removes a product from a specific shop.
 *
 * @param params - The parameters containing the shop ID and product ID.
 * @param credentials - The credentials containing the authentication token.
 * @returns The deleted product data or a confirmation message.
 * @throws Will throw an error if the request fails.
 */

export const removeProduct = async (
  params: ShopProductParams,
  credentials: AuthCredentials,
): Promise<Product> => {
  try {
    const response = await axios.delete<Product>(
      `${process.env.REACT_APP_API_BASE_URL}/products/delete/${params.shopId}/${params.productId}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${credentials.token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Lists products by shop ID.
 *
 * @param params - The parameters containing the shop ID and product ID.
 * @param signal - An optional AbortSignal to allow request cancellation.
 * @returns An array of products belonging to the specified shop.
 * @throws Will throw an error if the request fails.
 */

export const listProductsByShop = async (
  params: ShopProductParams,
  signal?: AbortSignal | undefined,
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `${process.env.REACT_APP_API_BASE_URL}/products/list/by/${params.shopId}`,
      {
        signal: signal,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
/**
 * Lists the latest products.
 *
 * @param signal - An optional AbortSignal to allow request cancellation.
 * @returns An array of the latest products.
 * @throws Will throw an error if the request fails.
 */
export const listLatestProducts = async (
  signal?: AbortSignal | undefined,
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `${process.env.REACT_APP_API_BASE_URL}/products/latest`,
      {
        signal: signal,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Lists related products based on the provided product ID.
 *
 * @param params - The parameters containing the shop ID and product ID.
 * @param signal - An optional AbortSignal to allow request cancellation.
 * @returns An array of related products.
 * @throws Will throw an error if the request fails.
 */

export const listRelatedProducts = async (
  params: ShopProductParams,
  signal?: AbortSignal | undefined,
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `${process.env.REACT_APP_API_BASE_URL}/products/related/${params.productId}`,
      {
        signal: signal,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Retrieves a list of product categories.
 *
 * @param signal - An optional AbortSignal to allow request cancellation.
 * @returns A Promise resolving to an array of product categories.
 * @throws Will throw an error if the request fails.
 */

export const listProductCategories = async (
  signal?: AbortSignal | undefined,
): Promise<ProductCategories> => {
  try {
    const response = await axios.get<ProductCategories>(
      `${process.env.REACT_APP_API_BASE_URL}/products/categories`,
      {
        signal: signal,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Searches for products based on the provided parameters.
 *
 * @param params - The parameters for searching (e.g., search term and category).
 * @param signal - An optional AbortSignal to allow request cancellation.
 * @returns A Promise resolving to an array of products matching the search criteria.
 * @throws Will throw an error if the request fails.
 */

export const searchProduct = async (
  params: ProductSearchParams,
  signal?: AbortSignal | undefined,
): Promise<Product[]> => {
  const query = queryString.stringify(params);
  try {
    const response = await axios.get<Product[]>(
      `${process.env.REACT_APP_API_BASE_URL}/products/search?${query}`,
      {
        signal: signal,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

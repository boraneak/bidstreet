import axios from '@/utils/axiosInstance';
import { ShopProductParams, AuthCredentials, Product } from '@/types';

export const createProduct = async (
  params: ShopProductParams,
  credentials: AuthCredentials,
  product: Product,
): Promise<Product[]> => {
  try {
    const response = await axios.post<Product[]>(
      `/products/create/by/${params.shopId}`,
      product,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

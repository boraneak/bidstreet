import { AuthCredentials, Product, ShopProductParams } from '@/types';
import axios from '@/utils/axiosInstance';

export const updateProduct = async (
  params: ShopProductParams,
  credentials: AuthCredentials,
  product: Product,
): Promise<Product[]> => {
  try {
    const response = await axios.put<Product[]>(
      `/products/update/${params.shopId}/${params.productId}`,
      product,
      {
        headers: {
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

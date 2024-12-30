import { ShopProductParams, AuthCredentials, Product } from '@/types';
import axios from '@/utils/axiosInstance';

export const deleteProduct = async (
  params: ShopProductParams,
  credentials: AuthCredentials,
): Promise<Product> => {
  try {
    const response = await axios.delete<Product>(
      `/products/delete/${params.shopId}/${params.productId}`,
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

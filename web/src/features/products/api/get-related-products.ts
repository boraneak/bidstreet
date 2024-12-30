import { ShopProductParams, Product } from '@/types';
import axios from '@/utils/axiosInstance';

export const getRelatedProducts = async (
  params: ShopProductParams,
  signal?: AbortSignal | undefined,
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `/products/related/${params.productId}`,
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

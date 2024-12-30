import { Product } from '@/types';
import axios from '@/utils/axiosInstance';

export const getLatestProducts = async (
  signal?: AbortSignal | undefined,
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`/products/latest`, {
      signal: signal,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

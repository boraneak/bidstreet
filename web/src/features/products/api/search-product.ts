import { ProductSearchParams, Product } from '@/types';
import axios from '@/utils/axiosInstance';
import queryString from 'query-string';

export const searchProduct = async (
  params: ProductSearchParams,
  signal?: AbortSignal | undefined,
): Promise<Product[]> => {
  const query = queryString.stringify(params);
  try {
    const response = await axios.get<Product[]>(`/products/search?${query}`, {
      signal: signal,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

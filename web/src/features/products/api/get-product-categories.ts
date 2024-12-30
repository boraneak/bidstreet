import { ProductCategories } from '@/types';
import axios from '@/utils/axiosInstance';

const getProductCategories = async (
  signal?: AbortSignal | undefined,
): Promise<ProductCategories> => {
  try {
    const response = await axios.get<ProductCategories>(
      `/products/categories`,
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
export default getProductCategories;

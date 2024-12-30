export interface AuthCredentials {
  token: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Product {
  _id: string;
  name: string;
  image?: {
    data: Buffer;
    contentType: string;
  };
  description?: string;
  category?: string;
  quantity: number;
  price: number;
  shop: string;
}

export type ProductCategories = string[];
export interface ProductSearchParams {
  productName?: string;
  category?: string;
}
export interface ShopProductParams {
  shopId: string;
  productId: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  seller?: boolean;
}

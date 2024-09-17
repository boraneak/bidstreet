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

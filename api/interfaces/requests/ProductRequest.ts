import { IProduct } from '../Product';
import { Request } from 'express';
export interface IProductRequest extends Request {
  product?: IProduct;
}

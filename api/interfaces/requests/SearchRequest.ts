import { Request } from "express";
export interface ISearchRequest extends Request {
  query: {
    productName?: string;
    category?: string;
  };
}

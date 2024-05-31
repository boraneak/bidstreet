import { Request } from "express";
export interface ISearchRequest extends Request {
  query: {
    search?: string;
    category?: string;
  };
}

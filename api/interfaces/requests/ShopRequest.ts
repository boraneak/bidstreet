import { Request } from "express";
import { IShop } from "../Shop";
import { IUser } from "../User";

export interface IShopRequest extends Request {
  user: IUser;
  shop: IShop;
}

import { Order, CartItem } from "../models/orderModel";
import { getErrorMessage } from "../../utils/dbErrorHandler";
import { Request, Response } from "express";
import { IMongoError } from "../../interfaces/MongoError";
import { isValidObjectId } from "../../utils/isValidObjectId";

import { Schema } from "mongoose";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, "user")) return;
    req.body.order.user = userId;
    const order = new Order(req.body.order);
    const result = await order.save();
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getOrderByShop = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;
    if (!isValidObjectId(shopId, res, "shop")) return;
    const orders = await Order.find({ "products.shop": shopId })
      .populate({ path: "products.product", select: "_id name price" })
      .sort("-created")
      .exec();
    res.json(orders);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

// export const updateOrderSById = async (req: Request, res: Response) => {};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    if (!isValidObjectId(orderId, res, "order")) return;
    const order = await Order.findById(orderId)
      .populate("products.product", "name price")
      .populate("products.shop", "name")
      .exec();
    if (!order)
      return res.status(400).json({
        error: "order not found",
      });
    res.json(order);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};

export const getOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, "user")) return;
    const orders = await Order.find({ user: userId }).sort("-created").exec();
    res.json(orders);
  } catch (error) {
    return res.status(400).json({
      error: getErrorMessage(error as IMongoError),
    });
  }
};
export const getOrderStatusValues = (req: Request, res: Response) => {
  try {
    type SchemaTypeWithEnumValues = Schema.Types.String & {
      enumValues: string[];
    };
    const statusPath = CartItem.schema.path(
      "status"
    ) as SchemaTypeWithEnumValues;
    res.json(statusPath.enumValues);
  } catch (error) {
    res.status(500).json({
      error: "could not retrieve order status values",
    });
  }
};

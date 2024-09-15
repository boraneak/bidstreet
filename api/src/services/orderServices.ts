import { Order, CartItem } from "../models/orderModel";
import { Request, Response } from "express";
import { isValidObjectId } from "../../utils/isValidObjectId";

import { Schema } from "mongoose";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, "user")) return;

    req.body.order.user = userId;
    const order = new Order(req.body.order);

    const result = await order.save();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      error: "Internal Server Error",
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

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ error: "No orders found for the specified shop" });
    }

    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by shop:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    if (!isValidObjectId(orderId, res, "order")) return;

    const order = await Order.findById(orderId)
      .populate("products.product", "name price")
      .populate("products.shop", "name")
      .exec();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, "user")) return;

    const orders = await Order.find({ user: userId }).sort("-created").exec();
    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by user:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getOrderStatusValues = (_req: Request, res: Response) => {
  try {
    type SchemaTypeWithEnumValues = Schema.Types.String & {
      enumValues: string[];
    };
    const statusPath = CartItem.schema.path(
      "status",
    ) as SchemaTypeWithEnumValues;
    return res.json(statusPath.enumValues);
  } catch (error) {
    console.error("Error retrieving order status values:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

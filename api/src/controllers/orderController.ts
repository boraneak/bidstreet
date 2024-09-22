import { Request, Response } from 'express';
import { isValidObjectId } from 'utils/isValidObjectId';
import { handleError } from 'utils/errorHandler';
import services from 'services/index';
import mongoose from 'mongoose';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;

    req.body.order.user = userId;
    const result = await services.order.createOrderService(req.body.order);
    return res.status(201).json(result);
  } catch (error) {
    return handleError(res, error, 'Error creating order:');
  }
};

export const getOrderByShop = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;
    if (!isValidObjectId(shopId, res, 'shop')) return;
    const objectId = new mongoose.Types.ObjectId(shopId);
    const orders = await services.order.getOrdersByShopService(objectId);
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ error: 'No orders found for the specified shop' });
    }

    return res.status(200).json(orders);
  } catch (error) {
    return handleError(res, error, 'Error fetching orders by shop:');
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    if (!isValidObjectId(orderId, res, 'order')) return;
    const objectId = new mongoose.Types.ObjectId(orderId);
    const order = await services.order.getOrderByIdService(objectId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return handleError(res, error, 'Error fetching order by ID:');
  }
};

export const getOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;
    const objectId = new mongoose.Types.ObjectId(userId);
    const orders = await services.order.getOrdersByUserService(objectId);
    return res.status(200).json(orders);
  } catch (error) {
    return handleError(res, error, 'Error fetching orders by user:');
  }
};

export const getOrderStatusValues = (_req: Request, res: Response) => {
  try {
    const statusValues = services.order.getOrderStatusValuesService();
    return res.status(200).json(statusValues);
  } catch (error) {
    return handleError(res, error, 'Error retrieving order status values:');
  }
};

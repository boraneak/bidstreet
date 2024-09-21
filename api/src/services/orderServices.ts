import { Order, CartItem } from 'models/orderModel';
import { Request, Response } from 'express';
import { isValidObjectId } from 'utils/isValidObjectId';
import { Schema } from 'mongoose';
import { handleError } from 'utils/errorHandler';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;

    req.body.order.user = userId;
    const order = new Order(req.body.order);

    const result = await order.save();
    return res.status(201).json(result);
  } catch (error) {
    return handleError(res, error, 'Error creating order:');
  }
};

export const getOrderByShop = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.shopId;
    if (!isValidObjectId(shopId, res, 'shop')) return;

    const orders = await Order.find({ 'products.shop': shopId })
      .populate({ path: 'products.product', select: '_id name price' })
      .sort('-created')
      .exec();

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

    const order = await Order.findById(orderId)
      .populate('products.product', 'name price')
      .populate('products.shop', 'name')
      .exec();

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

    const orders = await Order.find({ user: userId }).sort('-created').exec();
    return res.status(200).json(orders);
  } catch (error) {
    return handleError(res, error, 'Error fetching orders by user:');
  }
};

export const getOrderStatusValues = (_req: Request, res: Response) => {
  try {
    type SchemaTypeWithEnumValues = Schema.Types.String & {
      enumValues: string[];
    };
    const statusPath = CartItem.schema.path(
      'status',
    ) as SchemaTypeWithEnumValues;
    return res.status(200).json(statusPath.enumValues);
  } catch (error) {
    return handleError(res, error, 'Error retrieving order status values:');
  }
};

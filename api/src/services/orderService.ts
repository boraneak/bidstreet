import { Order } from 'models/orderModel';
import { CartItem } from 'models/cartItemModel';
import mongoose from 'mongoose';

export const createOrderService = async (orderData: any) => {
  const order = new Order(orderData);
  return await order.save();
};

export const getOrdersByShopService = async (
  shopId: mongoose.Types.ObjectId,
) => {
  return await Order.find({ 'products.shop': shopId })
    .populate({ path: 'products.product', select: '_id name price' })
    .sort('-created')
    .exec();
};

export const getOrderByIdService = async (orderId: mongoose.Types.ObjectId) => {
  return await Order.findById(orderId)
    .populate('products.product', 'name price')
    .populate('products.shop', 'name')
    .exec();
};

export const getOrdersByUserService = async (
  userId: mongoose.Types.ObjectId,
) => {
  return await Order.find({ user: userId }).sort('-created').exec();
};

export const getOrderStatusValuesService = () => {
  type SchemaTypeWithEnumValues = mongoose.Schema.Types.String & {
    enumValues: string[];
  };
  const statusPath = CartItem.schema.path('status') as SchemaTypeWithEnumValues;
  return statusPath.enumValues;
};

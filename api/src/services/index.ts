import * as authService from './authService';
import * as userService from './userService';
import * as shopService from './shopService';
import * as orderService from './orderService';
import * as auctionService from './auctionService';
import * as productService from './productService';

const services = {
  auth: authService,
  user: userService,
  shop: shopService,
  product: productService,
  order: orderService,
  auction: auctionService,
};

export default services;

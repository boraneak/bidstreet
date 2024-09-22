import * as authService from './authService';
import * as userService from './userService';
import * as shopServices from './shopServices';
import * as orderService from './orderService';
import * as auctionService from './auctionService';
import * as productService from './productService';

const services = {
  auth: authService,
  user: userService,
  shop: shopServices,
  product: productService,
  order: orderService,
  auction: auctionService,
};

export default services;

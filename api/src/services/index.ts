import * as authService from './authService';
import * as userServices from './userServices';
import * as shopServices from './shopServices';
import * as orderService from './orderService';
import * as auctionService from './auctionService';
import * as productService from './productService';

const services = {
  auth: authService,
  user: userServices,
  shop: shopServices,
  product: productService,
  order: orderService,
  auction: auctionService,
};

export default services;

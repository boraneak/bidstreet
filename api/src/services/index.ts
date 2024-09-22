import * as authServices from './authService';
import * as userServices from './userServices';
import * as shopServices from './shopServices';
import * as productServices from './productServices';
import * as orderService from './orderService';
import * as auctionService from './auctionService';

const services = {
  auth: authServices,
  user: userServices,
  shop: shopServices,
  product: productServices,
  order: orderService,
  auction: auctionService,
};

export default services;

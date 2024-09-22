import * as authServices from './authServices';
import * as userServices from './userServices';
import * as shopServices from './shopServices';
import * as productServices from './productServices';
import * as orderServices from './orderServices';
import * as auctionService from './auctionService';

const services = {
  auth: authServices,
  user: userServices,
  shop: shopServices,
  product: productServices,
  order: orderServices,
  auction: auctionService,
};

export default services;

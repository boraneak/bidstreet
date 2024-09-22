import * as authController from './authController';
// import * as userController from './userController';
// import * as shopController from './shopController';
import * as productController from './productController';
import * as orderController from './orderController';
import * as auctionController from './auctionController';

const controllers = {
  auth: authController,
  //   user: userController,
  //   shop: shopController,
  product: productController,
  order: orderController,
  auction: auctionController,
};

export default controllers;